"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Share2,
  Facebook,
  Twitter,
  Link as LinkIcon,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { sanitizeHtml } from "@/lib/sanitize";

interface Blog {
  _id: string;
  title: string;
  slug: string;
  content: string;
  coverImage: string;
  author: string;
  tags: string[];
  createdAt: string;
}

export default function BlogDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [shareUrl, setShareUrl] = useState("");
  const [blog, setBlog] = useState<Blog | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setShareUrl(window.location.href);
  }, []);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`/api/blogs/slug/${slug}`);
        const data = await res.json();
        if (data.success) {
          setBlog(data.data);
        } else {
          router.push("/blog");
        }
      } catch (error) {
        // Silently handle error
      } finally {
        setIsLoading(false);
      }
    };
    fetchBlog();
  }, [slug, router]);

  const copyLink = () => {
    if (typeof window === "undefined") return;
    navigator.clipboard.writeText(window.location.href);
    toast({ title: "Link copied", variant: "success" });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-ink-400 animate-spin" />
      </div>
    );
  }

  if (!blog) return null;

  const readTime = Math.max(
    1,
    Math.ceil(blog.content.replace(/<[^>]*>/g, "").split(/\s+/).length / 200)
  );

  // Sanitize HTML content before rendering
  const sanitizedContent = sanitizeHtml(blog.content);


  return (
    <main className="bg-background pt-16 sm:pt-20">
      {/* Top action row */}
      <div className="container-apple-wide py-4 flex items-center justify-between text-[13px]">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-foreground/85 hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={1.75} />
          All stories
        </Link>
      </div>

      {/* Header */}
      <section className="container-apple text-center pt-8 pb-10">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-[12px] font-semibold uppercase tracking-eyebrow text-sky mb-3">
            Story
          </p>
          <h1 className="font-semibold tracking-tighter3 leading-tighter text-balance text-[clamp(2rem,1.5rem+3vw,4.25rem)] text-foreground">
            {blog.title}
          </h1>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-[13px] text-ink-500">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" strokeWidth={1.75} />
              {new Date(blog.createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <span>·</span>
            <span>{blog.author}</span>
            <span>·</span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" strokeWidth={1.75} />
              {readTime} min read
            </span>
          </div>
        </motion.div>
      </section>

      {/* Cover image */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-10">
        <div className="relative aspect-[16/9] rounded-apple-xl overflow-hidden bg-fog shadow-product">
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="w-full h-full object-cover ken-burns"
          />
        </div>
      </div>

      {/* Article */}
      <article className="container-narrow section-y-sm">
        <div
          className="prose prose-lg dark:prose-invert max-w-none text-ink-500 leading-snug2
            prose-headings:font-semibold prose-headings:text-foreground prose-headings:tracking-tightest
            prose-headings:mt-12 prose-headings:mb-5
            prose-h2:text-[clamp(1.75rem,1.5rem+1.25vw,2.5rem)]
            prose-h3:text-[clamp(1.5rem,1.25rem+1vw,2rem)]
            prose-p:mb-6 prose-p:text-[17px] sm:prose-p:text-[18px]
            prose-a:text-sky prose-a:no-underline hover:prose-a:underline
            prose-strong:text-foreground prose-strong:font-semibold
            prose-img:rounded-apple-lg prose-img:my-10
            prose-blockquote:border-l-2 prose-blockquote:border-foreground prose-blockquote:not-italic prose-blockquote:font-normal prose-blockquote:text-foreground prose-blockquote:text-[clamp(1.25rem,1rem+0.75vw,1.5rem)] prose-blockquote:pl-6
            prose-ul:my-6 prose-li:my-1.5"
          dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        />

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-ink-100 dark:border-ink-700/40">
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((t) => (
                <span
                  key={t}
                  className="px-3 py-1.5 rounded-full bg-fog text-foreground text-[12px]"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Share */}
        <div className="mt-10 pt-8 border-t border-ink-100 dark:border-ink-700/40 flex items-center justify-between gap-4 flex-wrap">
          <p className="text-[13px] text-ink-500 inline-flex items-center gap-2">
            <Share2 className="w-4 h-4" strokeWidth={1.75} />
            Share this story
          </p>
          <div className="flex items-center gap-2">
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-fog hover:bg-foreground hover:text-background text-foreground transition-colors"
              aria-label="Share on Facebook"
            >
              <Facebook className="w-4 h-4" strokeWidth={1.75} />
            </a>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(blog.title)}&url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-fog hover:bg-foreground hover:text-background text-foreground transition-colors"
              aria-label="Share on Twitter"
            >
              <Twitter className="w-4 h-4" strokeWidth={1.75} />
            </a>
            <button
              onClick={copyLink}
              className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-fog hover:bg-foreground hover:text-background text-foreground transition-colors"
              aria-label="Copy link"
            >
              <LinkIcon className="w-4 h-4" strokeWidth={1.75} />
            </button>
          </div>
        </div>
      </article>

      <section className="bg-fog">
        <div className="container-apple-wide section-y-sm text-center">
          <h2 className="font-semibold text-[clamp(1.75rem,1.5rem+1.5vw,2.5rem)] tracking-tighter2 leading-tight2 text-foreground">
            Keep reading.
          </h2>
          <p className="mt-2 text-[15px] text-ink-500">
            More stories, perspectives, and field notes.
          </p>
          <Link
            href="/blog"
            className="mt-6 inline-flex link-apple link-arrow text-[15px]"
          >
            Back to all stories
          </Link>
        </div>
      </section>
    </main>
  );
}
