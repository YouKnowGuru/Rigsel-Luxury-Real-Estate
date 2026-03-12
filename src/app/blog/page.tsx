"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Newspaper, ArrowRight, Calendar, User, Tag } from "lucide-react";
import { cn } from "@/lib/utils";

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

export default function BlogListingPage() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const res = await fetch("/api/blogs?published=true");
                const data = await res.json();
                if (data.success) {
                    setBlogs(data.data);
                }
            } catch (error) {
                console.error("Error fetching blogs:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchBlogs();
    }, []);

    return (
        <div className="min-h-screen bg-[#F9F7F2] dark:bg-background font-outfit pt-32 pb-20">
            <div className="fixed inset-0 bg-thangka opacity-[0.01] pointer-events-none" />

            <div className="container-luxury mx-auto px-6 lg:px-10 relative z-10">
                {/* Header */}
                <header className="max-w-3xl mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-3 mb-4"
                    >
                        <div className="w-1.5 h-6 bg-bhutan-red rounded-full" />
                        <span className="text-bhutan-red font-bold text-xs uppercase tracking-[0.4em]">Insights & Stories</span>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-bold text-bhutan-dark dark:text-foreground mb-6 leading-tight"
                    >
                        Real Estate <span className="text-bhutan-gold italic font-light">Perspectives</span> in Bhutan
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-bhutan-dark/60 dark:text-muted-foreground leading-relaxed"
                    >
                        Expert advice, market trends, and luxury living inspiration from the heart of the Dragon Kingdom.
                    </motion.p>
                </header>

                {/* Blog Grid */}
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                             <div key={i} className="animate-pulse bg-white dark:bg-card rounded-[2rem] aspect-[4/5] shadow-luxury" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                        {blogs.map((blog, idx) => (
                            <motion.article
                                key={blog._id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="group bg-white dark:bg-card rounded-[2.5rem] overflow-hidden shadow-luxury border border-white dark:border-white/10 hover:border-bhutan-gold/20 transition-all duration-500 flex flex-col h-full"
                            >
                                <Link href={`/blog/${blog.slug}`} className="relative block aspect-[4/3] overflow-hidden">
                                    <img
                                        src={blog.coverImage}
                                        alt={blog.title}
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                    />
                                    <div className="absolute top-6 left-6 flex flex-wrap gap-2">
                                        {blog.tags.slice(0, 2).map((tag) => (
                                            <span key={tag} className="px-4 py-1.5 bg-white/90 backdrop-blur-md text-bhutan-dark text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </Link>

                                <div className="p-8 flex-1 flex flex-col">
                                    <div className="flex items-center gap-4 text-[11px] font-bold text-bhutan-gold uppercase tracking-[0.2em] mb-4">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {new Date(blog.createdAt).toLocaleDateString()}
                                        </div>
                                        <div className="w-1 h-1 bg-bhutan-gold/30 rounded-full" />
                                        <div className="flex items-center gap-1.5">
                                            <User className="w-3.5 h-3.5" />
                                            {blog.author}
                                        </div>
                                    </div>

                                    <Link href={`/blog/${blog.slug}`}>
                                        <h2 className="text-2xl font-bold text-bhutan-dark dark:text-foreground mb-4 group-hover:text-bhutan-red transition-colors leading-snug">
                                            {blog.title}
                                        </h2>
                                    </Link>

                                    <p className="text-bhutan-dark/50 dark:text-muted-foreground/50 text-base mb-8 line-clamp-3 leading-relaxed">
                                        {blog.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                                    </p>

                                    <div className="mt-auto">
                                        <Link
                                            href={`/blog/${blog.slug}`}
                                            className="inline-flex items-center gap-2 text-bhutan-red font-bold text-xs uppercase tracking-[0.3em] group/btn"
                                        >
                                            Read Full Story
                                            <motion.div
                                                className="w-8 h-8 rounded-full bg-bhutan-red/5 flex items-center justify-center group-hover/btn:bg-bhutan-red group-hover/btn:text-white transition-all duration-300"
                                            >
                                                <ArrowRight className="w-4 h-4" />
                                            </motion.div>
                                        </Link>
                                    </div>
                                </div>
                            </motion.article>
                        ))}
                    </div>
                )}

                {!isLoading && blogs.length === 0 && (
                    <div className="text-center py-40">
                        <Newspaper className="w-20 h-20 text-bhutan-gold/10 mx-auto mb-6" />
                        <p className="text-xl text-bhutan-dark/30 dark:text-muted-foreground/30 font-bold uppercase tracking-[0.2em]">Our stories are being penned...</p>
                    </div>
                )}
            </div>
        </div>
    );
}
