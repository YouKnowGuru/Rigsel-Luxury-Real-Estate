import { NextRequest, NextResponse } from "next/server";

const ALLOWED_HOSTS = ["res.cloudinary.com"];

function parseTargetUrl(request: NextRequest): URL | NextResponse {
  const raw = new URL(request.url).searchParams.get("url");
  if (!raw) {
    return NextResponse.json({ error: "Missing url" }, { status: 400 });
  }
  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    return NextResponse.json({ error: "Invalid url" }, { status: 400 });
  }
  if (!ALLOWED_HOSTS.includes(parsed.hostname)) {
    return NextResponse.json({ error: "Host not allowed" }, { status: 403 });
  }
  return parsed;
}

/** Same-origin proxy so 360° viewer can load Cloudinary images without CORS issues */
export async function HEAD(request: NextRequest) {
  try {
    const parsed = parseTargetUrl(request);
    if (parsed instanceof NextResponse) return parsed;

    const upstream = await fetch(parsed.toString(), { method: "HEAD" });
    return new NextResponse(null, {
      status: upstream.ok ? 200 : 502,
      headers: {
        "Content-Type": upstream.headers.get("content-type") || "image/jpeg",
      },
    });
  } catch {
    return NextResponse.json({ error: "Proxy failed" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const parsed = parseTargetUrl(request);
    if (parsed instanceof NextResponse) return parsed;

    const upstream = await fetch(parsed.toString(), { cache: "force-cache" });
    if (!upstream.ok) {
      return NextResponse.json(
        { error: `Image fetch failed (${upstream.status})` },
        { status: 502 }
      );
    }

    const contentType =
      upstream.headers.get("content-type") || "image/jpeg";
    const buffer = await upstream.arrayBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch {
    return NextResponse.json({ error: "Proxy failed" }, { status: 500 });
  }
}
