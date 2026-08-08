"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    Newspaper,
    Plus,
    Search,
    Edit,
    Trash2,
    Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Blog {
    _id: string;
    title: string;
    slug: string;
    coverImage: string;
    author: string;
    published: boolean;
    createdAt: string;
}

export default function BlogListPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            const response = await fetch("/api/blogs");
            const data = await response.json();
            if (data.success) {
                setBlogs(data.data);
            }
        } catch (error) {
            console.error("Error fetching blogs:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this blog post?")) return;

        try {
            const response = await fetch(`/api/blogs/${id}`, {
                method: "DELETE",
                headers: {
                },
            });

            if (response.ok) {
                toast({
                    title: "Blog Deleted",
                    description: "The blog post has been deleted successfully",
                });
                fetchBlogs();
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete blog post",
                variant: "destructive",
            });
        }
    };

    const filteredBlogs = blogs.filter((blog) =>
        blog.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="p-3 sm:p-4 md:p-8 lg:p-10 max-w-[1500px] mx-auto min-h-screen flex items-center justify-center">
                <div className="admin-glass rounded-[20px] p-10 flex flex-col items-center gap-3 w-full max-w-sm">
                    <div className="animate-spin w-8 h-8 border-4 border-sky/20 border-t-sky rounded-full" />
                    <p className="text-ink-400 text-[13px] font-medium">Loading blogs...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-3 sm:p-4 md:p-8 lg:p-10 max-w-[1500px] mx-auto min-h-screen">
            {/* Header */}
            <header className="mb-4 md:mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6 relative z-10">
                <div>
                    <motion.div
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2 mb-2"
                    >
                        <div className="w-0.5 h-6 bg-sky rounded-full" />
                        <p className="text-sky text-[12px] font-semibold uppercase tracking-[0.12em]">Insights</p>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[22px] sm:text-[26px] md:text-[28px] font-semibold text-foreground tracking-tight"
                    >
                        Manage Blogs
                    </motion.h2>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <Link
                        href="/admin/blogs/new"
                        className="h-10 sm:h-12 md:h-14 px-4 sm:px-6 bg-sky text-white rounded-full hover:bg-sky-hover transition-all duration-300 flex items-center gap-2 sm:gap-3 group"
                    >
                        <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" strokeWidth={1.5} />
                        <span className="hidden sm:inline">New Blog Post</span>
                        <span className="sm:hidden">New Post</span>
                    </Link>
                </motion.div>
            </header>

            {/* Filters & Search */}
            <div className="mb-6 md:mb-8 flex flex-col md:flex-row gap-4 items-center relative z-10">
                <div className="relative flex-1 group w-full">
                    <Search className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400 group-focus-within:text-sky transition-colors" strokeWidth={1.5} />
                    <Input
                        placeholder="Search by title..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-10 sm:h-11 rounded-2xl border-ink-200 focus:border-sky focus:ring-[3px] focus:ring-sky/15 text-sm sm:text-base pl-10 sm:pl-11"
                    />
                </div>
            </div>

            {/* Blog List Grid */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="admin-glass rounded-[20px] overflow-hidden relative z-10"
            >
                <div className="overflow-x-auto -mx-3 sm:mx-0">
                    <table className="w-full min-w-[640px]">
                        <thead>
                            <tr className="bg-card/50 border-b border-ink-100/60">
                                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-medium text-ink-500 uppercase tracking-wider">
                                    Blog Details
                                </th>
                                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-medium text-ink-500 uppercase tracking-wider">
                                    Author
                                </th>
                                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-medium text-ink-500 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-medium text-ink-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-4 sm:px-6 py-3 sm:py-4 text-right text-xs sm:text-sm font-medium text-ink-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-ink-100/60">
                            {filteredBlogs.map((blog, idx) => (
                                <motion.tr
                                    key={blog._id}
                                    initial={{ opacity: 0, x: -5 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.05 * idx }}
                                    className="hover:bg-card/40 transition-colors group"
                                >
                                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                                        <div className="flex items-center gap-3 sm:gap-4">
                                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl overflow-hidden border border-ink-100/60 group-hover:scale-105 transition-transform duration-500 shrink-0">
                                                <img
                                                    src={blog.coverImage}
                                                    alt={blog.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="text-sm sm:text-base font-medium text-foreground truncate leading-tight group-hover:text-sky transition-colors">
                                                    {blog.title}
                                                </h4>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-ink-600 font-medium">
                                        {blog.author}
                                    </td>
                                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-ink-600">
                                        {new Date(blog.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                                        <span
                                            className={cn(
                                                "px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-medium uppercase tracking-wider border transition-all",
                                                blog.published
                                                    ? "bg-emerald-500 text-white border-emerald-500/20"
                                                    : "bg-ink-100 text-ink-600 border-ink-200"
                                            )}
                                        >
                                            {blog.published ? "Published" : "Draft"}
                                        </span>
                                    </td>
                                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-right">
                                        <div className="flex items-center justify-end gap-1.5 sm:gap-2">
                                            <Link
                                                href={`/blog/${blog.slug}`}
                                                target="_blank"
                                                className="w-8 h-8 sm:w-9 sm:h-9 rounded-[14px] bg-card border border-ink-200 flex items-center justify-center text-ink-400 hover:text-foreground hover:border-sky transition-all duration-300"
                                            >
                                                <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={1.5} />
                                            </Link>
                                            <Link
                                                href={`/admin/blogs/${blog._id}/edit`}
                                                className="w-8 h-8 sm:w-9 sm:h-9 rounded-[14px] bg-card border border-ink-200 flex items-center justify-center text-ink-400 hover:text-foreground hover:border-sky transition-all duration-300"
                                            >
                                                <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={1.5} />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(blog._id)}
                                                className="w-8 h-8 sm:w-9 sm:h-9 rounded-[14px] bg-card border border-ink-200 flex items-center justify-center text-ink-400 hover:text-red-500 hover:border-red-300 transition-all duration-300"
                                            >
                                                <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={1.5} />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredBlogs.length === 0 && (
                    <div className="text-center py-20">
                        <div className="w-16 h-16 bg-card rounded-full flex items-center justify-center mx-auto mb-4">
                            <Newspaper className="w-8 h-8 text-ink-300" strokeWidth={1.5} />
                        </div>
                        <p className="text-ink-400 text-sm font-medium">No Blogs Found</p>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
