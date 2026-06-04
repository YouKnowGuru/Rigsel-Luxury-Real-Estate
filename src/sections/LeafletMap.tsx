"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface LeafletMapProps {
  locations: any[];
  onLocationSelect: (location: any) => void;
}

export default function LeafletMap({
  locations,
  onLocationSelect,
}: LeafletMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
    }).setView([27.4712, 89.6339], 7);
    mapInstanceRef.current = map;

    // Apple Maps-style minimalist light tile layer
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 20,
      }
    ).addTo(map);

    L.control.zoom({ position: "bottomright" }).addTo(map);

    // Apple-style minimal pin: solid black drop with white inner dot
    const customIcon = L.divIcon({
      className: "phojaa-pin",
      html: `
        <div style="position: relative; width: 32px; height: 40px; transform: translate(-50%, -100%); display: flex; align-items: flex-start; justify-content: center;">
          <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 0C7.163 0 0 6.92 0 15.467 0 26.667 16 40 16 40s16-13.333 16-24.533C32 6.92 24.837 0 16 0z" fill="#1D1D1F"/>
            <circle cx="16" cy="15" r="5" fill="#FFFFFF"/>
          </svg>
        </div>
      `,
      iconSize: [32, 40],
      iconAnchor: [16, 40],
      popupAnchor: [0, -40],
    });

    locations.forEach((location) => {
      const marker = L.marker([location.lat, location.lng], {
        icon: customIcon,
      }).addTo(map);

      const popupContent = `
        <div style="font-family: Inter, -apple-system, system-ui, sans-serif; padding: 14px 16px 16px; min-width: 200px;">
          <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.012em; color: #0071E3; margin: 0 0 4px;">
            ${location.properties} listings
          </p>
          <h4 style="font-size: 18px; font-weight: 600; letter-spacing: -0.022em; line-height: 1.15; color: #1D1D1F; margin: 0 0 4px;">
            ${location.name}
          </h4>
          <p style="font-size: 13px; color: #86868B; margin: 0 0 12px; line-height: 1.4;">
            ${location.description || ""}
          </p>
          <a href="/properties?district=${location.name}"
             style="display: inline-flex; align-items: center; gap: 4px; color: #0071E3; font-size: 13px; font-weight: 500; text-decoration: none;">
            View properties ›
          </a>
        </div>
      `;

      marker.bindPopup(popupContent, {
        className: "phojaa-popup",
        maxWidth: 260,
        closeButton: false,
      });

      marker.on("click", () => {
        onLocationSelect(location);
        map.flyTo([location.lat, location.lng], 12, {
          duration: 1.2,
          easeLinearity: 0.25,
        });
      });
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [locations, onLocationSelect]);

  return (
    <>
      <style jsx global>{`
        .phojaa-popup .leaflet-popup-content-wrapper {
          background: #ffffff;
          border-radius: 18px;
          border: 1px solid rgba(0, 0, 0, 0.06);
          box-shadow:
            0 4px 12px rgba(0, 0, 0, 0.06),
            0 16px 32px rgba(0, 0, 0, 0.05);
          padding: 0;
        }
        .phojaa-popup .leaflet-popup-content {
          margin: 0;
          font-family: Inter, -apple-system, system-ui, sans-serif;
        }
        .phojaa-popup .leaflet-popup-tip {
          background: #ffffff;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
        }
        .leaflet-control-zoom a {
          background-color: #ffffff !important;
          color: #1d1d1f !important;
          border-color: rgba(0, 0, 0, 0.08) !important;
          border-radius: 10px !important;
        }
        .leaflet-control-zoom a:hover {
          background-color: #f5f5f7 !important;
        }
      `}</style>
      <div
        ref={mapContainerRef}
        className="h-full w-full"
        style={{ minHeight: "320px", background: "#f5f5f7" }}
      />
    </>
  );
}
