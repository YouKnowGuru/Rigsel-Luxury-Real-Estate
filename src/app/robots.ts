import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/admin/*",
          "/api/admin/",
          "/api/auth/",
          "/_next/",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/admin/", "/api/admin/"],
      },
    ],
    sitemap: "https://phojaa95realestate.com/sitemap.xml",
    host: "https://phojaa95realestate.com",
  };
}
