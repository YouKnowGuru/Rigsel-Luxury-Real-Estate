"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import {
  Loader2,
  Maximize2,
  Minimize2,
  Move3d,
  AlertCircle,
  Smartphone,
  RotateCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  panoramaDisplayUrl,
  verifyPanoramaUrl,
} from "@/lib/panorama-url";

export type PanoramaScene = {
  id: string;
  title: string;
  panoramaUrl: string;
};

type PannellumViewer = {
  destroy: () => void;
  on?: (event: string, fn: (...args: unknown[]) => void) => void;
  startAutoRotate?: (speed: number) => void;
  stopAutoRotate?: () => void;
  loadScene?: (id: string) => void;
};

declare global {
  interface Window {
    pannellum?: {
      viewer: (
        el: HTMLElement,
        config: Record<string, unknown>
      ) => PannellumViewer;
    };
  }
}

const PANNELLUM_JS =
  "https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js";
const PANNELLUM_CSS =
  "https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css";

const VIEWER_UI = {
  autoLoad: true,
  showControls: true,
  showFullscreenCtrl: true,
  showZoomCtrl: true,
  compass: true,
  /* Lower FOV = less “zoom” = sharper (wide FOV stretches pixels and looks blurry) */
  hfov: 92,
  minHfov: 70,
  maxHfov: 105,
  pitch: 2,
  yaw: 0,
  friction: 0.12,
  mouseZoom: true,
  autoRotate: -1.2,
  autoRotateInactivityDelay: 2500,
  autoRotateStopDelay: 8000,
};

let pannellumLoadPromise: Promise<void> | null = null;

function loadPannellum(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.pannellum) return Promise.resolve();
  if (pannellumLoadPromise) return pannellumLoadPromise;

  pannellumLoadPromise = new Promise((resolve, reject) => {
    if (!document.getElementById("pannellum-css")) {
      const link = document.createElement("link");
      link.id = "pannellum-css";
      link.rel = "stylesheet";
      link.href = PANNELLUM_CSS;
      document.head.appendChild(link);
    }

    const existing = document.getElementById("pannellum-js");
    if (existing && window.pannellum) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.id = "pannellum-js";
    script.src = PANNELLUM_JS;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load 360 viewer script"));
    document.body.appendChild(script);
  });

  return pannellumLoadPromise;
}

function sceneConfig(url: string) {
  return {
    type: "equirectangular",
    panorama: panoramaDisplayUrl(url),
    crossOrigin: "anonymous",
  };
}

type Panorama360ViewerProps = {
  panoramaUrl: string;
  scenes?: PanoramaScene[];
  className?: string;
  initialSceneId?: string;
};

export function Panorama360Viewer({
  panoramaUrl,
  scenes = [],
  className,
  initialSceneId,
}: Panorama360ViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<PannellumViewer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [flatWarning, setFlatWarning] = useState("");
  const [activeScene, setActiveScene] = useState(initialSceneId || "main");
  const [fullscreen, setFullscreen] = useState(false);
  const [gyroAvailable, setGyroAvailable] = useState(false);

  const allScenes = useMemo(
    () => [
      { id: "main", title: "Main view", panoramaUrl },
      ...scenes.filter((s) => s.panoramaUrl?.trim() && s.id !== "main"),
    ],
    [panoramaUrl, scenes]
  );

  const buildConfig = useCallback(
    (firstSceneId: string, multi: boolean) => {
      const base = { ...VIEWER_UI };

      if (multi) {
        const sceneMap: Record<string, unknown> = {};
        for (const s of allScenes) {
          sceneMap[s.id] = { title: s.title, ...sceneConfig(s.panoramaUrl) };
        }
        return {
          ...base,
          default: { firstScene: firstSceneId, sceneFadeDuration: 1000 },
          scenes: sceneMap,
        };
      }

      return { ...base, ...sceneConfig(panoramaUrl) };
    },
    [allScenes, panoramaUrl]
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !panoramaUrl?.trim()) {
      setError("No 360° image URL configured.");
      setLoading(false);
      return;
    }

    let cancelled = false;
    let loadTimeout: ReturnType<typeof setTimeout> | undefined;

    const init = async () => {
      setLoading(true);
      setError("");
      setFlatWarning("");

      try {
        const check = await verifyPanoramaUrl(panoramaUrl);
        if (!check.ok) {
          if (!cancelled) {
            setError(check.message || "Panorama image not reachable.");
            setLoading(false);
          }
          return;
        }

        if (check.valid360 === false && check.message) {
          setFlatWarning(check.message);
        }

        await loadPannellum();
        if (cancelled || !window.pannellum) return;

        viewerRef.current?.destroy();
        viewerRef.current = null;
        el.innerHTML = "";

        const current =
          allScenes.find((s) => s.id === activeScene) || allScenes[0];
        const hasMultiple = allScenes.length > 1;
        const config = buildConfig(current?.id || "main", hasMultiple);

        const viewer = window.pannellum.viewer(el, config);
        viewerRef.current = viewer;

        loadTimeout = setTimeout(() => {
          if (!cancelled) setLoading(false);
        }, 12000);

        viewer.on?.("load", () => {
          if (!cancelled) {
            clearTimeout(loadTimeout);
            setLoading(false);
            try {
              viewer.startAutoRotate?.(-1.2);
            } catch {
              /* optional API */
            }
          }
        });

        viewer.on?.("error", () => {
          if (!cancelled) {
            clearTimeout(loadTimeout);
            setLoading(false);
            setError(
              "Could not display 360° view. Upload a true 360° sphere photo (2:1 ratio), not a normal listing image."
            );
          }
        });

        setTimeout(() => {
          if (!cancelled) setLoading(false);
        }, 2000);
      } catch (e) {
        if (!cancelled) {
          clearTimeout(loadTimeout);
          setLoading(false);
          const msg = e instanceof Error ? e.message : "";
          setError(
            msg.includes("360 viewer script")
              ? "360 viewer blocked — restart dev server and refresh."
              : "Could not load 360° view. Re-upload a proper panorama from admin."
          );
        }
      }
    };

    init();

    return () => {
      cancelled = true;
      clearTimeout(loadTimeout);
      try {
        viewerRef.current?.destroy();
      } catch {
        /* ignore */
      }
      viewerRef.current = null;
    };
  }, [panoramaUrl, activeScene, allScenes, buildConfig]);

  useEffect(() => {
    setGyroAvailable(
      typeof window !== "undefined" &&
        ("DeviceOrientationEvent" in window ||
          "deviceorientation" in window)
    );
  }, []);

  const switchScene = (sceneId: string) => {
    const v = viewerRef.current;
    if (v?.loadScene && allScenes.length > 1) {
      try {
        v.loadScene(sceneId);
        setActiveScene(sceneId);
        return;
      } catch {
        /* re-init */
      }
    }
    setActiveScene(sceneId);
  };

  const toggleFullscreen = () => {
    const el = containerRef.current?.parentElement;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen?.().then(() => setFullscreen(true));
    } else {
      document.exitFullscreen?.().then(() => setFullscreen(false));
    }
  };

  useEffect(() => {
    const onFs = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  return (
    <div
      className={cn(
        "relative rounded-apple-xl overflow-hidden bg-ink-900 border border-ink-100 dark:border-ink-700/40 shadow-product",
        className
      )}
    >
      {/* Immersive frame */}
      <div className="absolute inset-0 pointer-events-none z-[15] ring-1 ring-inset ring-white/10 rounded-apple-xl" />
      <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/40 to-transparent z-[15] pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/50 to-transparent z-[15] pointer-events-none" />

      <div className="absolute top-3 left-3 z-20 flex flex-col gap-2 pointer-events-none">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-sky/90 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 shadow-lg">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          360° Live
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-black/55 backdrop-blur-md text-white text-[11px] font-medium px-2.5 py-1">
          <Move3d className="w-3.5 h-3.5" strokeWidth={1.75} />
          Drag to explore
        </span>
        {gyroAvailable && (
          <span className="inline-flex items-center gap-1 rounded-full bg-black/45 backdrop-blur-md text-white/80 text-[10px] px-2 py-0.5">
            <Smartphone className="w-3 h-3" />
            Tilt phone on mobile
          </span>
        )}
      </div>

      <button
        type="button"
        onClick={toggleFullscreen}
        className="absolute top-3 right-3 z-20 w-10 h-10 rounded-full bg-black/55 backdrop-blur-md text-white flex items-center justify-center hover:bg-sky/80 transition-colors no-tap"
        aria-label={fullscreen ? "Exit fullscreen" : "Fullscreen"}
      >
        {fullscreen ? (
          <Minimize2 className="w-4 h-4" strokeWidth={1.75} />
        ) : (
          <Maximize2 className="w-4 h-4" strokeWidth={1.75} />
        )}
      </button>

      {flatWarning && !error && (
        <div className="absolute top-14 left-3 right-3 z-[25] pointer-events-none">
          <div className="rounded-xl bg-amber-500/95 text-ink-900 text-[12px] sm:text-[13px] font-medium px-4 py-3 shadow-lg flex gap-2 items-start">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">This is not a real 360° photo</p>
              <p className="mt-1 font-normal opacity-90">{flatWarning}</p>
              <p className="mt-1 text-[11px] opacity-80">
                Re-upload using Google Street View (photo sphere) for a true
                walk-around view.
              </p>
            </div>
          </div>
        </div>
      )}

      {allScenes.length > 1 && (
        <div className="absolute bottom-4 left-3 right-3 z-20 flex flex-wrap gap-2 justify-center pointer-events-auto">
          {allScenes.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => switchScene(s.id)}
              className={cn(
                "text-[12px] font-medium px-3 py-2 rounded-full backdrop-blur-md transition-all no-tap",
                activeScene === s.id
                  ? "bg-sky text-white shadow-lg scale-105"
                  : "bg-black/50 text-white/90 hover:bg-black/70"
              )}
            >
              {s.title}
            </button>
          ))}
        </div>
      )}

      {!loading && !error && (
        <div className="absolute bottom-4 right-4 z-20 pointer-events-none hidden sm:flex items-center gap-1 text-white/40 text-[10px]">
          <RotateCw className="w-3 h-3" />
          Auto-rotating
        </div>
      )}

      {loading && !error && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-ink-900 text-white/70 gap-2">
          <Loader2 className="w-8 h-8 animate-spin text-sky" />
          <span className="text-[13px]">Loading immersive 360°…</span>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-ink-900 text-white/85 gap-3 px-6 text-center">
          <AlertCircle className="w-10 h-10 text-amber-400" />
          <p className="text-[14px] leading-relaxed max-w-md">{error}</p>
        </div>
      )}

      <div
        ref={containerRef}
        className="w-full h-[min(78vh,640px)] min-h-[320px] sm:min-h-[400px]"
        style={{ touchAction: "none" }}
      />
    </div>
  );
}
