"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    FileDown,
    Download,
    FileText,
    Search,
    ArrowRight,
    Loader2,
    Calendar,
    ChevronRight,
} from "lucide-react";

interface Document {
    _id: string;
    title: string;
    description: string;
    fileUrl: string;
    fileType: string;
    fileSize: string;
    createdAt: string;
}

export default function DownloadsPage() {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetch("/api/documents")
            .then(res => res.json())
            .then(data => {
                if (data.success) setDocuments(data.data);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const filteredDocs = documents.filter(d =>
        d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <main className="min-h-screen bg-white dark:bg-background">

            {/* Hero Section */}
            <div className="relative pt-32 pb-20 bg-bhutan-dark overflow-hidden">
                <div className="absolute inset-0 bg-thangka opacity-10 pointer-events-none" />
                <div className="container-luxury mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-center gap-2 mb-4"
                    >
                        <div className="w-1 h-4 bg-bhutan-gold rounded-full" />
                        <span className="text-bhutan-gold font-bold text-xs uppercase tracking-[0.3em]">Resource Center</span>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-bold text-white mb-6"
                    >
                        Downloads & <span className="text-bhutan-gold italic">Resources</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-white/60 max-w-2xl mx-auto text-lg"
                    >
                        Access essential documents, property brochures, guides, and legal forms to help you in your real estate journey.
                    </motion.p>
                </div>
            </div>

            {/* Main Content */}
            <section className="py-20 bg-[#F9F7F2] dark:bg-background/50">
                <div className="container-luxury mx-auto px-6">
                    {/* Search Bar */}
                    <div className="max-w-4xl mx-auto -mt-32 mb-16 relative z-20">
                        <div className="bg-white dark:bg-card p-2 rounded-2xl shadow-xl border border-bhutan-gold/10 dark:border-white/10 flex items-center">
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search documents by name or keyword..."
                                    className="w-full pl-12 pr-6 py-4 bg-transparent border-none focus:ring-0 text-bhutan-dark dark:text-foreground font-medium"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <button className="bg-bhutan-red hover:bg-red-800 text-white px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-widest transition-all hidden md:block">
                                Find Documents
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loader2 className="w-12 h-12 animate-spin text-bhutan-red mb-4" />
                            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Syncing Resources...</p>
                        </div>
                    ) : filteredDocs.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredDocs.map((doc, i) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    key={doc._id}
                                    className="bg-white dark:bg-card rounded-[2rem] p-8 border border-gray-100 dark:border-white/5 shadow-soft hover:shadow-xl transition-all group flex flex-col h-full"
                                >
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="w-14 h-14 bg-bhutan-red/5 rounded-2xl flex items-center justify-center text-bhutan-red group-hover:bg-bhutan-red group-hover:text-white transition-all transform group-hover:rotate-6 shadow-sm">
                                            <FileText className="w-7 h-7" />
                                        </div>
                                        <div className="bg-bhutan-gold/10 dark:bg-bhutan-gold/20 text-bhutan-gold text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter">
                                            {doc.fileSize}
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-bold text-bhutan-dark dark:text-foreground mb-3 group-hover:text-bhutan-red transition-colors flex-grow">
                                        {doc.title}
                                    </h3>

                                    <p className="text-gray-500 dark:text-muted-foreground mb-8 line-clamp-3 leading-relaxed">
                                        {doc.description}
                                    </p>

                                    <div className="mt-auto space-y-6">
                                        <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-muted-foreground/40 border-t border-gray-50 dark:border-white/5 pt-6">
                                            <span className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5" /> {new Date(doc.createdAt).toLocaleDateString()}</span>
                                            <span className="flex items-center gap-2">• {doc.fileType}</span>
                                        </div>

                                        <a
                                            href={`/api/download/${doc._id}`}
                                            className="w-full flex items-center justify-between bg-bhutan-dark hover:bg-bhutan-red text-white p-4 px-6 rounded-2xl transition-all group/btn shadow-lg hover:shadow-bhutan-red/20"
                                        >
                                            <span className="font-bold uppercase tracking-widest text-xs">Download File</span>
                                            <Download className="w-4 h-4 transform group-hover/btn:translate-y-1 transition-transform" />
                                        </a>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-32 bg-white dark:bg-card rounded-[3rem] border border-bhutan-gold/10 dark:border-white/5 shadow-sm overflow-hidden relative">
                            <div className="absolute inset-0 bg-thangka opacity-[0.03] pointer-events-none" />
                            <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                <FileDown className="w-10 h-10 text-gray-200" />
                            </div>
                             <h3 className="text-2xl font-bold text-bhutan-dark dark:text-foreground mb-3">No documents available</h3>
                            <p className="text-gray-400 max-w-sm mx-auto mb-8 font-serif italic text-lg">
                                We're currently updating our resource library. Please check back later for property guides and forms.
                            </p>
                            <button
                                onClick={() => setSearchQuery("")}
                                className="text-bhutan-red font-bold uppercase tracking-widest text-xs flex items-center gap-2 mx-auto hover:gap-4 transition-all"
                            >
                                Clear search <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>
            </section>

        </main>
    );
}
