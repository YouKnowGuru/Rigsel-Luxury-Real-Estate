/** Remove Cloudinary size crops so old uploads keep full 2:1 panorama */
export function cleanCloudinaryPanoramaUrl(url: string): string {
  if (!url.includes("res.cloudinary.com") || !url.includes("/upload/")) {
    return url;
  }

  try {
    const u = new URL(url);
    const parts = u.pathname.split("/");
    const uploadIdx = parts.indexOf("upload");
    if (uploadIdx === -1) return url;

    const afterUpload = parts.slice(uploadIdx + 1);
    const keepFrom = afterUpload.findIndex(
      (seg) =>
        /^v\d+$/.test(seg) ||
        seg.startsWith("phojaa") ||
        (!seg.includes(",") && !seg.startsWith("c_") && seg.includes("."))
    );

    if (keepFrom <= 0) return url;

    const cleaned = [
      ...parts.slice(0, uploadIdx + 1),
      ...afterUpload.slice(keepFrom),
    ].join("/");

    return `${u.origin}${cleaned}`;
  } catch {
    return url;
  }
}

/** High-res delivery for 360° viewer (no upscaling past original; avoids soft auto:good) */
export function cloudinaryPanoramaDeliveryUrl(url: string): string {
  const cleaned = cleanCloudinaryPanoramaUrl(url);
  if (!cleaned.includes("res.cloudinary.com") || !cleaned.includes("/upload/")) {
    return cleaned;
  }
  if (cleaned.includes("/upload/q_") || cleaned.includes("/upload/w_")) {
    return cleaned;
  }
  return cleaned.replace(
    "/upload/",
    "/upload/q_95/w_8192,c_limit/f_auto/"
  );
}

/** Use same-origin proxy for external panorama URLs (fixes CORS in WebGL viewers) */
export function panoramaDisplayUrl(url: string): string {
  if (!url?.trim()) return url;
  const cleaned = cloudinaryPanoramaDeliveryUrl(url.trim());
  try {
    const parsed = new URL(cleaned);
    if (parsed.hostname === "res.cloudinary.com") {
      return `/api/panorama-proxy?url=${encodeURIComponent(cleaned)}`;
    }
  } catch {
    /* use raw url */
  }
  return cleaned;
}

/** True 360° equirectangular images are ~2:1 (twice as wide as tall) */
export function isEquirectangularRatio(width: number, height: number): boolean {
  if (!width || !height) return false;
  const ratio = width / height;
  return ratio >= 1.75 && ratio <= 2.25;
}

export function checkPanoramaDimensions(
  width: number,
  height: number
): { valid: boolean; ratio: number; hint: string } {
  const ratio = width / height;
  if (isEquirectangularRatio(width, height)) {
    return { valid: true, ratio, hint: "Valid 360° panorama shape." };
  }
  if (ratio < 1.2) {
    return {
      valid: false,
      ratio,
      hint:
        "This looks like a normal flat/portrait photo. Use a 360° sphere photo (2:1 wide), e.g. from Google Street View app.",
    };
  }
  if (ratio > 2.5) {
    return {
      valid: false,
      ratio,
      hint: "Image is too wide or cropped wrong. Export a standard equirectangular 360° (2:1).",
    };
  }
  return {
    valid: false,
    ratio,
    hint: `Image ratio is ${ratio.toFixed(2)}:1 but 360° needs about 2:1 (e.g. 6000×3000).`,
  };
}

export function loadImageDimensions(
  src: string
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    if (!src.startsWith("blob:")) {
      img.crossOrigin = "anonymous";
    }
    img.onload = () =>
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => reject(new Error("Could not read image"));
    img.src = src;
  });
}

export async function verifyPanoramaUrl(url: string): Promise<{
  ok: boolean;
  message?: string;
  valid360?: boolean;
  ratio?: number;
}> {
  const displayUrl = panoramaDisplayUrl(url);
  try {
    const res = await fetch(displayUrl, { method: "HEAD" });
    if (!res.ok) {
      return {
        ok: false,
        message: `Image not reachable (${res.status}). Re-upload as a 360° panorama.`,
      };
    }

    try {
      const { width, height } = await loadImageDimensions(displayUrl);
      const check = checkPanoramaDimensions(width, height);
      return {
        ok: true,
        valid360: check.valid,
        ratio: check.ratio,
        message: check.valid ? undefined : check.hint,
      };
    } catch {
      return { ok: true, valid360: undefined };
    }
  } catch {
    return {
      ok: false,
      message: "Could not reach the image URL. Check your connection or re-upload.",
    };
  }
}
