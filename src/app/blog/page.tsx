"use client";

import { useState, useEffect, useMemo, memo, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Newspaper, Calendar, User, ArrowRight, Clock } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { cn } from "@/lib/utils";

/* ============================================================
   BLOG PAGE — Apple News-style editorial layout
   Design Principles:
   • Featured hero card with large imagery
   • Clean grid with editorial typography
   • Tag-based filtering
   • Reading time estimates
   • Smooth staggered animations
   ============================================================ */

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

/* ── Animation variants ── */
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] },
  }),
};

/* ── Helper: Strip HTML and estimate read time ── */
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "");
}

function readingTime(content: string): string {
  const words = stripHtml(content).split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return `${minutes} min read`;
}

function formatDate(date: string, showYear?: boolean): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: showYear ? "numeric" : undefined,
  });
}

/* ── Tag Filter Component ── */
const TagFilter = memo(function TagFilter({
  tags,
  activeTag,
  onTagChange,
}: {
  tags: string[];
  activeTag: string;
  onTagChange: (tag: string) => void;
}) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <button
        onClick={() => onTagChange("")}
        className={cn(
          "h-8 px-4 rounded-full text-[13px] font-medium transition-all no-tap outline-none focus-visible:ring-2 focus-visible:ring-sky/40",
          activeTag === ""
            ? "bg-foreground text-background"
            : "bg-fog dark:bg-ink-800/40 text-ink-500 hover:text-foreground"
        )}
      >
        All
      </button>
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => onTagChange(tag)}
          className={cn(
            "h-8 px-4 rounded-full text-[13px] font-medium transition-all no-tap outline-none focus-visible:ring-2 focus-visible:ring-sky/40",
            activeTag === tag
              ? "bg-foreground text-background"
              : "bg-fog dark:bg-ink-800/40 text-ink-500 hover:text-foreground"
          )}
        >
          {tag}
        </button>
      ))}
    </div>
  );
});

/* ── Featured Article Card ── */
const FeaturedArticle = memo(function FeaturedArticle({
  blog,
}: {
  blog: Blog;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.article
      initial={shouldReduceMotion ? {} : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="mb-16 md:mb-20"
    >
      <Link
        href={`/blog/${blog.slug}`}
        className="group grid lg:grid-cols-2 gap-6 md:gap-10 items-center"
      >
        {/* Image */}
        <div className="relative aspect-[4/3] rounded-apple-xl overflow-hidden bg-fog">
          <Image
            src={blog.coverImage}
            alt={blog.title}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover transition-transform duration-1200 ease-apple-out group-hover:scale-[1.04]"
            priority
          />
          <div className="absolute top-4 left-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[11px] font-semibold text-foreground">
              Featured
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="lg:py-4">
          <p className="text-[12px] font-semibold uppercase tracking-eyebrow text-sky mb-3">
            {blog.tags[0] || "Story"}
          </p>
          <h2 className="font-semibold text-[clamp(1.75rem,1.5rem+2vw,2.75rem)] tracking-tighter2 leading-tight2 text-foreground text-balance group-hover:text-sky transition-colors duration-fast">
            {blog.title}
          </h2>
          <p className="mt-4 text-[16px] sm:text-[17px] text-ink-500 leading-snug2 line-clamp-3">
            {stripHtml(blog.content).substring(0, 200)}…
          </p>

          {/* Meta */}
          <div className="mt-6 flex items-center gap-4 text-[12px] text-ink-500">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" strokeWidth={1.75} />
              {formatDate(blog.createdAt, true)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" strokeWidth={1.75} />
              {blog.author}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" strokeWidth={1.75} />
              {readingTime(blog.content)}
            </span>
          </div>

          <span className="mt-6 inline-flex items-center gap-1 text-sky text-[15px] font-medium group-hover:underline underline-offset-4 transition-all">
            Read full story
            <ArrowRight
              className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
              strokeWidth={1.75}
            />
          </span>
        </div>
      </Link>
    </motion.article>
  );
});

/* ── Article Card ── */
const ArticleCard = memo(function ArticleCard({
  blog,
  index,
}: {
  blog: Blog;
  index: number;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.article
      initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.5,
        delay: Math.min(index * 0.06, 0.3),
        ease: [0.16, 1, 0.3, 1],
      }}
      className="group bg-fog/60 dark:bg-ink-800/30 rounded-apple-xl overflow-hidden border border-ink-100/40 dark:border-ink-700/20 hover:shadow-product hover:border-ink-200/60 dark:hover:border-ink-600/30 transition-all duration-fast"
    >
      <Link href={`/blog/${blog.slug}`} className="block">
        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden bg-ink-100">
          <Image
            src={blog.coverImage}
            alt={blog.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-1200 ease-apple-out group-hover:scale-[1.04]"
            loading="lazy"
          />
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6">
          {/* Tag */}
          {blog.tags[0] && (
            <span className="inline-block text-[11px] font-semibold uppercase tracking-eyebrow text-sky mb-2">
              {blog.tags[0]}
            </span>
          )}

          {/* Title */}
          <h3 className="font-semibold text-[18px] sm:text-[20px] tracking-tighter2 leading-tight2 text-foreground line-clamp-2 group-hover:text-sky transition-colors duration-fast">
            {blog.title}
          </h3>

          {/* Excerpt */}
          <p className="mt-2 text-[14px] text-ink-500 leading-snug2 line-clamp-2">
            {stripHtml(blog.content).substring(0, 120)}…
          </p>

          {/* Meta */}
          <div className="mt-4 flex items-center gap-3 text-[11px] text-ink-500">
            <span className="inline-flex items-center gap-1">
              <Calendar className="w-3 h-3" strokeWidth={1.75} />
              {formatDate(blog.createdAt)}
            </span>
            <span>·</span>
            <span>{readingTime(blog.content)}</span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
});

/* ── Skeleton Loader ── */
const ArticleSkeleton = memo(function ArticleSkeleton() {
  return (
    <div className="bg-fog/60 rounded-apple-xl overflow-hidden animate-pulse">
      <div className="aspect-[16/10] bg-ink-100" />
      <div className="p-5 sm:p-6 space-y-3">
        <div className="h-3 w-16 bg-ink-200 rounded" />
        <div className="h-5 w-full bg-ink-200 rounded" />
        <div className="h-5 w-3/4 bg-ink-200 rounded" />
        <div className="h-3 w-full bg-ink-200 rounded" />
        <div className="h-3 w-2/3 bg-ink-200 rounded" />
      </div>
    </div>
  );
});

/* ── Empty State ── */
const EmptyState = memo(function EmptyState() {
  return (
    <div className="text-center py-24 max-w-md mx-auto">
      <div className="w-16 h-16 rounded-full bg-fog flex items-center justify-center mx-auto mb-5">
        <Newspaper className="w-7 h-7 text-ink-400" strokeWidth={1.5} />
      </div>
      <h3 className="font-semibold text-[20px] tracking-tighter2 text-foreground">
        No stories yet.
      </h3>
      <p className="mt-2 text-[15px] text-ink-500">
        Our editorial team is working on something special. Check back soon.
      </p>
    </div>
  );
});

/* ── Main Blog Page ── */
export default function BlogListingPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTag, setActiveTag] = useState("");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch("/api/blogs?published=true");
        const data = await res.json();
        if (data.success) setBlogs(data.data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  // Extract unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    blogs.forEach((blog) => blog.tags.forEach((tag) => tags.add(tag)));
    return Array.from(tags).slice(0, 8);
  }, [blogs]);

  // Filter blogs by tag
  const filteredBlogs = useMemo(() => {
    if (!activeTag) return blogs;
    return blogs.filter((blog) => blog.tags.includes(activeTag));
  }, [blogs, activeTag]);

  // Split featured and rest
  const [featured, ...rest] = filteredBlogs;

  const handleTagChange = useCallback((tag: string) => {
    setActiveTag(tag);
  }, []);

  return (
    <main className="bg-background">
      {/* Hero */}
      <PageHero
        eyebrow="Editorial"
        title="Insights & stories."
        subtitle="News, guides, and perspectives on property, land, and living in Bhutan."
        breadcrumbs={[{ label: "Blog" }]}
      />

      {/* Content */}
      <section className="section-y-sm">
        <div className="container-apple-wide">
          {isLoading ? (
            /* Loading skeletons */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {[1, 2, 3].map((i) => (
                <ArticleSkeleton key={i} />
              ))}
            </div>
          ) : blogs.length === 0 ? (
            /* Empty state */
            <EmptyState />
          ) : (
            <>
              {/* Tag filters */}
              {allTags.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="mb-10"
                >
                  <TagFilter
                    tags={allTags}
                    activeTag={activeTag}
                    onTagChange={handleTagChange}
                  />
                </motion.div>
              )}

              {/* Results count */}
              {activeTag && (
                <p className="text-[13px] text-ink-500 mb-6">
                  Showing{" "}
                  <span className="font-medium text-foreground">
                    {filteredBlogs.length}
                  </span>{" "}
                  {filteredBlogs.length === 1 ? "story" : "stories"} tagged{" "}
                  <span className="font-medium text-foreground">
                    "{activeTag}"
                  </span>
                </p>
              )}

              {/* Featured article */}
              {featured && !activeTag && (
                <FeaturedArticle blog={featured} />
              )}

              {/* Article grid */}
              {rest.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                  {(activeTag ? filteredBlogs : rest).map((blog, i) => (
                    <ArticleCard key={blog._id} blog={blog} index={i} />
                  ))}
                </div>
              )}

              {/* No results after filtering */}
              {filteredBlogs.length === 0 && activeTag && (
                <div className="text-center py-16">
                  <p className="text-[16px] text-ink-500">
                    No stories found with tag{" "}
                    <span className="font-medium text-foreground">
                      "{activeTag}"
                    </span>
                  </p>
                  <button
                    onClick={() => setActiveTag("")}
                    className="mt-3 text-sky text-[14px] font-medium hover:underline underline-offset-4"
                  >
                    Show all stories
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
}
