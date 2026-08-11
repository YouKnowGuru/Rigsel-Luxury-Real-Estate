import { MetadataRoute } from "next";
import connectDB from "@/lib/mongodb";
import Blog from "@/models/Blog";
import PropertyModel from "@/models/Property";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://phojaarealestate.com";

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/properties`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/land-calculator`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/phojaa95-solutions`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/architecture-design`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  let dynamicBlogPages: MetadataRoute.Sitemap = [];
  let dynamicPropertyPages: MetadataRoute.Sitemap = [];

  try {
    await connectDB();

    // Fetch published blogs
    const blogs = await Blog.find({ published: true }).select("slug updatedAt createdAt").lean();
    dynamicBlogPages = blogs.map((b: any) => ({
      url: `${baseUrl}/blog/${b.slug}`,
      lastModified: b.updatedAt ? new Date(b.updatedAt) : b.createdAt ? new Date(b.createdAt) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

    // Fetch properties
    const properties = await PropertyModel.find().select("_id slug updatedAt createdAt").lean();
    dynamicPropertyPages = properties.map((p: any) => ({
      url: `${baseUrl}/properties/${p.slug || p._id}`,
      lastModified: p.updatedAt ? new Date(p.updatedAt) : p.createdAt ? new Date(p.createdAt) : new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    }));
  } catch (error) {
    console.error("Error generating dynamic sitemap:", error);
  }

  return [...staticPages, ...dynamicPropertyPages, ...dynamicBlogPages];
}
