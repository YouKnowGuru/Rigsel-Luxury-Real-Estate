import { Metadata } from "next";
import connectDB from "@/lib/mongodb";
import Blog from "@/models/Blog";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    await connectDB();
    const blogDoc: any = await Blog.findOne({ slug, published: true }).lean();

    if (!blogDoc || Array.isArray(blogDoc)) {
      return {
        title: "Story Not Found | PHOJAA95 Real Estate",
        description: "The requested blog article was not found.",
      };
    }
    const blog = blogDoc;

    const plainTextContent = (blog.content || "")
      .replace(/<[^>]*>/g, "")
      .slice(0, 160)
      .trim();

    const title = `${blog.title} | PHOJAA95 Real Estate`;
    const description =
      plainTextContent ||
      `Read ${blog.title} on PHOJAA95 Real Estate — Bhutan real estate blog.`;
    const keywords = [
      ...(blog.tags || []),
      "Bhutan real estate blog",
      "Bhutan property news",
      "PHOJAA95 Real Estate",
      "real estate in Bhutan",
    ];

    return {
      title,
      description,
      keywords,
      authors: [{ name: blog.author || "PHOJAA95 Real Estate" }],
      openGraph: {
        title,
        description,
        type: "article",
        url: `https://phojaarealestate.com/blog/${slug}`,
        publishedTime: blog.createdAt ? new Date(blog.createdAt).toISOString() : undefined,
        authors: [blog.author || "PHOJAA95 Real Estate"],
        tags: blog.tags || [],
        images: blog.coverImage
          ? [
              {
                url: blog.coverImage,
                width: 1200,
                height: 630,
                alt: blog.title,
              },
            ]
          : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: blog.coverImage ? [blog.coverImage] : undefined,
      },
      alternates: {
        canonical: `https://phojaarealestate.com/blog/${slug}`,
      },
    };
  } catch (error) {
    return {
      title: "Blog | PHOJAA95 Real Estate",
      description: "Bhutan real estate insights, guides, and stories.",
    };
  }
}

import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";

export default async function BlogDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let blog: any = null;

  try {
    await connectDB();
    blog = await Blog.findOne({ slug, published: true }).lean();
  } catch (error) {
    // Silently fail if DB error
  }

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Blog", url: "/blog" },
    { name: blog?.title || "Article", url: `/blog/${slug}` },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbs} />
      {blog && (
        <ArticleJsonLd
          title={blog.title}
          description={
            blog.content?.replace(/<[^>]*>/g, "").slice(0, 160) || blog.title
          }
          url={`https://phojaarealestate.com/blog/${slug}`}
          image={blog.coverImage}
          datePublished={blog.createdAt ? new Date(blog.createdAt).toISOString() : undefined}
          dateModified={blog.updatedAt ? new Date(blog.updatedAt).toISOString() : undefined}
          authorName={blog.author || "PHOJAA95 Real Estate"}
        />
      )}
      {children}
    </>
  );
}
