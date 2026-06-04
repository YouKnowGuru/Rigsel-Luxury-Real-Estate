/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow local network access for development
  allowedDevOrigins: ["192.168.8.34", "localhost", "127.0.0.1"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com", pathname: "/**" },
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "lh3.googleusercontent.com", pathname: "/**" },
      { protocol: "https", hostname: "maps.googleapis.com", pathname: "/**" },
    ],
  },
  // Only expose non-sensitive variables that need to be available client-side
  // SECURITY: Never expose API keys, secrets, or credentials here
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  },
  // Optimize barrel file imports for faster dev/build performance
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-label",
      "@radix-ui/react-select",
      "@radix-ui/react-slot",
      "@radix-ui/react-tabs",
      "@radix-ui/react-toast",
    ],
  },
  async rewrites() {
    return {
      beforeFiles: [
        // Silence legacy Vite-style dev requests (/@vite/client, /@react-refresh, ...).
        // path-to-regexp v8 (used by Next.js 16) no longer allows a repeating `:path*`
        // without a delimiter, so we use a named regex parameter instead.
        { source: "/:vitePath(@.*)", destination: "/api/noop" },
        { source: "/src/main.tsx", destination: "/api/noop" },
        { source: "/dev-sw.js", destination: "/api/noop" },
      ],
    };
  },
  async headers() {
    const isDev = process.env.NODE_ENV === "development";

    return [
      // Security headers for ALL routes
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          // HSTS: Only in production (causes HTTPS issues in dev)
          ...(isDev
            ? []
            : [
                {
                  key: "Strict-Transport-Security",
                  value: "max-age=63072000; includeSubDomains; preload",
                },
              ]),
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net",
              "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net",
              "img-src 'self' https://res.cloudinary.com https://images.unsplash.com https://lh3.googleusercontent.com https://*.basemaps.cartocdn.com data: blob:",
              "font-src 'self'",
              "connect-src 'self' https://res.cloudinary.com https://cdn.jsdelivr.net",
              "media-src 'self' https://res.cloudinary.com",
              "object-src 'none'",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              ...(isDev ? [] : ["upgrade-insecure-requests"]),
            ].join("; "),
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
        ],
      },
      // Cache-busting headers for Next.js static assets
      // These files have content hashes in filenames, so they can be cached forever
      {
        source: "/_next/static/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      // CORS headers for public API routes only (NOT admin routes)
      {
        source: "/api/(properties|blogs|contact|reviews|chats|gallery|download)(/.*)?",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          {
            key: "Access-Control-Allow-Origin",
            value: process.env.ALLOWED_ORIGIN || "https://phojaa95realestate.com",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "X-Requested-With, Accept, Content-Type, Authorization",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
