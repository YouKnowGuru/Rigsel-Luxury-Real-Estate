"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, User, Clock, Share2, Facebook, Twitter, Link as LinkIcon } from "lucide-react";

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
    const [blog, setBlog] = useState<Blog | null>(null);
    const [isLoading, setIsLoading] = useState(true);

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
                console.error("Error fetching blog:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchBlog();
    }, [slug]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#F9F7F2] flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-bhutan-red border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!blog) return null;

    return (
        <div className="min-h-screen bg-white font-outfit pt-32 pb-20">
            <div className="fixed inset-0 bg-thangka opacity-[0.01] pointer-events-none" />

            {/* Hero Section */}
            <div className="container-luxury mx-auto px-6 lg:px-10 relative z-10 mb-16">
                <div className="max-w-4xl mx-auto">
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 text-bhutan-dark/40 hover:text-bhutan-red transition-colors mb-8 group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Back to Stories</span>
                    </Link>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-wrap gap-4 items-center mb-6"
                    >
                        {blog.tags.map((tag) => (
                            <span key={tag} className="px-4 py-1 bg-bhutan-red/5 text-bhutan-red text-[10px] font-bold uppercase tracking-widest rounded-full border border-bhutan-red/10">
                                {tag}
                            </span>
                        ))}
                        <div className="flex items-center gap-2 text-[10px] font-bold text-bhutan-dark/30 uppercase tracking-[0.2em] ml-2">
                            <Clock className="w-3.5 h-3.5" />
                            5 min read
                        </div>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-bold text-bhutan-dark mb-10 leading-tight"
                    >
                        {blog.title}
                    </motion.h1>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex items-center justify-between py-6 border-y border-bhutan-gold/10"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-bhutan-gold/20 flex items-center justify-center text-bhutan-gold font-bold text-lg">
                                {blog.author[0]}
                            </div>
                            <div>
                                <p className="text-sm font-bold text-bhutan-dark uppercase tracking-widest">{blog.author}</p>
                                <p className="text-xs text-bhutan-dark/40 font-medium">{new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button className="w-10 h-10 rounded-full border border-bhutan-gold/10 flex items-center justify-center text-bhutan-dark/30 hover:bg-bhutan-red hover:text-white hover:border-bhutan-red transition-all">
                                <Share2 className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Featured Image */}
            <div className="container-luxury mx-auto px-6 lg:px-10 mb-16 relative z-10 w-full">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="aspect-[21/9] rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white"
                >
                    <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover" />
                </motion.div>
            </div>

            {/* Content Section */}
            <div className="container-luxury mx-auto px-6 lg:px-10 relative z-10">
                <div className="max-w-3xl mx-auto">
                    <article
                        className="prose prose-xl prose-bhutan max-w-none text-bhutan-dark/80 font-medium leading-[1.8]
              prose-headings:text-bhutan-dark prose-headings:font-bold
              prose-p:mb-8 prose-img:rounded-3xl prose-img:shadow-xl prose-img:my-12
              prose-strong:text-bhutan-dark prose-strong:font-bold
              prose-blockquote:border-l-4 prose-blockquote:border-bhutan-red prose-blockquote:bg-[#F9F7F2] prose-blockquote:p-8 prose-blockquote:rounded-3xl prose-blockquote:italic
            "
                        dangerouslySetInnerHTML={{ __html: blog.content }}
                    />

                    <div className="mt-20 pt-10 border-t border-bhutan-gold/10 flex flex-wrap gap-4 items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                            {blog.tags.map(tag => (
                                <span key={tag} className="text-xs font-bold text-bhutan-gold bg-bhutan-gold/5 px-4 py-2 rounded-xl">#{tag}</span>
                            ))}
                        </div>

                        <div className="flex items-center gap-4">
                            <span className="text-[10px] font-bold text-bhutan-dark/30 uppercase tracking-[0.2em]">Share post</span>
                            <div className="flex gap-2">
                                {[Facebook, Twitter, LinkIcon].map((Icon, i) => (
                                    <button key={i} className="w-9 h-9 rounded-full bg-[#F9F7F2] flex items-center justify-center text-bhutan-dark/40 hover:bg-bhutan-dark hover:text-white transition-all">
                                        <Icon className="w-4 h-4" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
