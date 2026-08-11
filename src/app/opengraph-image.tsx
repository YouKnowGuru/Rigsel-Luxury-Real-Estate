import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "PHOJAA95 Real Estate — Best Real Estate in Bhutan";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0b0f19 0%, #111827 50%, #030712 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          position: "relative",
          padding: "60px",
        }}
      >
        {/* Subtle decorative glow */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "800px",
            height: "400px",
            background: "radial-gradient(circle, rgba(0, 113, 227, 0.25) 0%, rgba(0, 0, 0, 0) 70%)",
            borderRadius: "50%",
          }}
        />

        {/* Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            background: "rgba(255, 255, 255, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: "30px",
            padding: "8px 20px",
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: "#0071e3",
            }}
          />
          <span
            style={{
              color: "#ffffff",
              fontSize: "16px",
              fontWeight: 600,
              letterSpacing: "2px",
            }}
          >
            PHOJAA95 REAL ESTATE BHUTAN
          </span>
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: "64px",
            fontWeight: 800,
            color: "#ffffff",
            textAlign: "center",
            lineHeight: 1.1,
            margin: 0,
            maxWidth: "950px",
            letterSpacing: "-0.02em",
          }}
        >
          Best Real Estate in Bhutan
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: "26px",
            color: "rgba(255, 255, 255, 0.75)",
            textAlign: "center",
            marginTop: "20px",
            marginBottom: "40px",
            maxWidth: "800px",
            lineHeight: 1.4,
          }}
        >
          Verified Land, Houses & Commercial Properties Across All 20 Dzongkhags
        </p>

        {/* Domain Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "#0071e3",
            color: "#ffffff",
            fontSize: "20px",
            fontWeight: 600,
            borderRadius: "14px",
            padding: "12px 28px",
          }}
        >
          phojaa95realestate.com
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
