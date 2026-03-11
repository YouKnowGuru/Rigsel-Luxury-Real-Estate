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
    Filter,
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
        const token = localStorage.getItem("adminToken");
        if (!token) {
            router.push("/admin");
        } else {
            fetchBlogs();
        }
    }, [router]);

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
                    Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
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
            <div className="min-h-screen bg-[#F9F7F2] flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-4 border-bhutan-red border-t-transparent rounded-full" />
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 lg:p-10 max-w-[1500px] mx-auto min-h-screen">
            <div className="fixed inset-0 bg-thangka opacity-[0.015] pointer-events-none" />

            {/* Header */}
            <header className="mb-6 md:mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
                <div>
                    <motion.div
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2 mb-2"
                    >
                        <div className="w-0.5 h-6 bg-bhutan-red rounded-full" />
                        <p className="text-bhutan-red font-bold text-xs uppercase tracking-[0.3em]">Insights</p>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl md:text-4xl font-bold text-bhutan-dark leading-tight"
                    >
                        Manage <span className="text-bhutan-gold italic font-light">Blogs</span>
                    </motion.h2>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <Link href="/admin/blogs/new">
                        <button className="h-12 md:h-14 px-6 bg-bhutan-red text-white text-[9px] font-bold uppercase tracking-[0.3em] rounded-xl hover:bg-bhutan-dark transition-all duration-500 shadow-xl shadow-bhutan-red/10 flex items-center gap-3 group">
                            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                            New Blog Post
                        </button>
                    </Link>
                </motion.div>
            </header>

            {/* Filters & Search */}
            <div className="mb-8 flex flex-col md:flex-row gap-4 items-center relative z-10">
                <div className="relative flex-1 group w-full">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-bhutan-dark/30 group-focus-within:text-bhutan-red transition-colors" />
                    <Input
                        placeholder="Search by title..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-12 md:h-14 pl-12 rounded-xl bg-white border-white shadow-luxury focus:ring-bhutan-red/10 text-base"
                    />
                </div>
            </div>

            {/* Blog List Grid */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/80 backdrop-blur-xl rounded-[1.5rem] md:rounded-[2rem] shadow-luxury border border-white overflow-hidden relative z-10"
            >
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-[#F9F7F2]/50 border-b border-bhutan-gold/5">
                                <th className="px-6 py-4 text-left text-sm font-bold text-bhutan-dark/40 uppercase tracking-widest border-b border-bhutan-gold/5">
                                    Blog Details
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-bold text-bhutan-dark/40 uppercase tracking-widest border-b border-bhutan-gold/5">
                                    Author
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-bold text-bhutan-dark/40 uppercase tracking-widest border-b border-bhutan-gold/5">
                                    Date
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-bold text-bhutan-dark/40 uppercase tracking-widest border-b border-bhutan-gold/5">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-right text-sm font-bold text-bhutan-dark/40 uppercase tracking-widest border-b border-bhutan-gold/5">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-bhutan-gold/5">
                            {filteredBlogs.map((blog, idx) => (
                                <motion.tr
                                    key={blog._id}
                                    initial={{ opacity: 0, x: -5 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.05 * idx }}
                                    className="hover:bg-[#F9F7F2]/30 transition-colors group"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl overflow-hidden shadow-lg border border-white group-hover:scale-105 transition-transform duration-500 shrink-0">
                                                <img
                                                    src={blog.coverImage}
                                                    alt={blog.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="text-base font-bold text-bhutan-dark truncate leading-tight group-hover:text-bhutan-red transition-colors">
                                                    {blog.title}
                                                </h4>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-bhutan-dark/60 font-medium">
                                        {blog.author}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-bhutan-dark/60 italic">
                                        {new Date(blog.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={cn(
                                                "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border transition-all",
                                                blog.published
                                                    ? "bg-emerald-500 text-white border-emerald-500/5 shadow-md shadow-emerald-500/5"
                                                    : "bg-bhutan-gold/10 text-bhutan-gold border-bhutan-gold/20"
                                            )}
                                        >
                                            {blog.published ? "Published" : "Draft"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link href={`/blog/${blog.slug}`} target="_blank">
                                                <button className="w-9 h-9 rounded-lg bg-white border border-black/5 flex items-center justify-center text-bhutan-dark/20 hover:bg-bhutan-dark hover:text-white transition-all duration-300 shadow-sm">
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                            </Link>
                                            <Link href={`/admin/blogs/${blog._id}/edit`}>
                                                <button className="w-9 h-9 rounded-lg bg-white border border-black/5 flex items-center justify-center text-bhutan-gold/30 hover:bg-bhutan-gold hover:text-white transition-all duration-300 shadow-sm">
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(blog._id)}
                                                className="w-9 h-9 rounded-lg bg-white border border-black/5 flex items-center justify-center text-bhutan-red/30 hover:bg-bhutan-red hover:text-white transition-all duration-300 shadow-sm"
                                            >
                                                <Trash2 className="w-4 h-4" />
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
                        <div className="w-16 h-16 bg-[#F9F7F2] rounded-full flex items-center justify-center mx-auto mb-4">
                            <Newspaper className="w-8 h-8 text-bhutan-dark/5" />
                        </div>
                        <p className="text-bhutan-dark/20 text-[8px] font-bold uppercase tracking-[0.3em]">No Blogs Found</p>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
