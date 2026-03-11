"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    FileDown,
    Upload,
    Plus,
    Trash2,
    FileText,
    Search,
    Calendar,
    Loader2,
    Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Document {
    _id: string;
    title: string;
    description: string;
    fileUrl: string;
    fileType: string;
    fileSize: string;
    createdAt: string;
}

export default function DocumentManagement() {
    const router = useRouter();
    const { toast } = useToast();
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // Form state
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        fileUrl: "",
        fileType: "",
        fileSize: "",
        fileContent: "", // Base64 for documents
        contentType: ""
    });

    useEffect(() => {
        const token = localStorage.getItem("adminToken");
        if (!token) {
            router.push("/admin");
            return;
        }
        fetchDocuments(token);
    }, []);

    const fetchDocuments = async (token: string) => {
        try {
            const res = await fetch("/api/admin/documents", {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setDocuments(data.data);
            }
        } catch (error) {
            console.error("Error fetching documents:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const fileName = file.name.toLowerCase();
        const isPdf = file.type === "application/pdf" || fileName.endsWith(".pdf");
        const isWord = file.type.includes("word") || fileName.endsWith(".doc") || fileName.endsWith(".docx");
        const isExcel = file.type.includes("excel") || fileName.endsWith(".xls") || fileName.endsWith(".xlsx");
        const isTxt = file.type.includes("text/plain") || fileName.endsWith(".txt") || fileName.endsWith(".csv");
        const isDocument = isPdf || isWord || isExcel || isTxt;

        console.log("[DocumentPage] Handling file upload:", {
            name: file.name,
            type: file.type,
            size: file.size,
            isDocument,
            isPdf,
            isTxt
        });

        if (isDocument) {
            console.log("[DocumentPage] Detected document, reading as Base64...");
            // For documents, read as Base64 and store in state (skip Cloudinary)
            const reader = new FileReader();
            reader.onload = () => {
                const base64 = (reader.result as string).split(",")[1];
                console.log("[DocumentPage] Base64 conversion complete. Bytes:", base64.length);
                setFormData({
                    ...formData,
                    fileUrl: "", // No Cloudinary URL for DB storage
                    fileContent: base64,
                    contentType: file.type || (isPdf ? "application/pdf" : "application/octet-stream"),
                    fileType: file.name.split(".").pop()?.toUpperCase() || "FILE",
                    fileSize: (file.size / (1024 * 1024)).toFixed(2) + " MB"
                });
                setUploading(false);
                toast({ title: "Document Processed", description: "File prepared for database storage." });
            };
            reader.onerror = (err) => {
                console.error("[DocumentPage] FileReader error:", err);
                setUploading(false);
                toast({ title: "Read Failed", description: "Could not read document file", variant: "destructive" });
            };
            reader.readAsDataURL(file);
            return;
        }

        console.log("[DocumentPage] Detected image, uploading to Cloudinary...");
        try {
            const token = localStorage.getItem("adminToken");
            const fd = new FormData();
            fd.append("file", file);

            const res = await fetch("/api/upload", {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: fd,
            });

            const data = await res.json();
            console.log("[DocumentPage] Cloudinary response:", data);
            if (data.success) {
                setFormData({
                    ...formData,
                    fileUrl: data.url,
                    fileContent: "", // Not needed for Cloudinary files
                    contentType: file.type,
                    fileType: file.type.split("/")[1]?.toUpperCase() || "IMAGE",
                    fileSize: (file.size / (1024 * 1024)).toFixed(2) + " MB"
                });
                toast({ title: "Image Uploaded", description: "Stored on Cloudinary successfully." });
            } else throw new Error(data.error);
        } catch (error: any) {
            console.error("[DocumentPage] Cloudinary upload failed:", error);
            toast({ title: "Upload Failed", description: error.message, variant: "destructive" });
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this document?")) return;

        try {
            const token = localStorage.getItem("adminToken");
            const res = await fetch(`/api/admin/documents/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setDocuments(documents.filter(d => d._id !== id));
                toast({ title: "Deleted", description: "Document removed successfully." });
            }
        } catch (error) {
            toast({ title: "Error", description: "Failed to delete document", variant: "destructive" });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("[DocumentSubmit] Starting submission...", { 
            title: formData.title, 
            hasUrl: !!formData.fileUrl, 
            hasContent: !!formData.fileContent,
            contentType: formData.contentType 
        });

        if (!formData.fileUrl && !formData.fileContent) {
            toast({ title: "Error", description: "Please upload a file or document first", variant: "destructive" });
            return;
        }

        try {
            const token = localStorage.getItem("adminToken");
            const res = await fetch("/api/admin/documents", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (data.success) {
                setDocuments([data.data, ...documents]);
                setShowUploadModal(false);
                setFormData({ title: "", description: "", fileUrl: "", fileType: "", fileSize: "", fileContent: "", contentType: "" });
                toast({ title: "Success", description: "Document published live." });
            } else {
                console.error("[DocumentSubmit] Server error:", data.error);
                throw new Error(data.error || "Failed to save");
            }
        } catch (error: any) {
            console.error("[DocumentSubmit] Submission failed:", error);
            toast({ title: "Error", description: error.message || "Failed to save document", variant: "destructive" });
        }
    };

    const filteredDocuments = documents.filter(d =>
        d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-bhutan-dark flex items-center gap-3">
                        <FileDown className="text-bhutan-red" /> Document Management
                    </h1>
                    <p className="text-gray-500 mt-1">Manage files, brochures, and public documents.</p>
                </div>
                <Button
                    onClick={() => setShowUploadModal(true)}
                    className="bg-bhutan-red hover:bg-red-700 text-white rounded-xl h-11 px-6 shadow-lg shadow-bhutan-red/20"
                >
                    <Plus className="w-4 h-4 mr-2" /> Upload Document
                </Button>
            </header>

            {/* Toolbar */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-6 flex items-center">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                        placeholder="Search by title or description..."
                        className="pl-10 h-11 border-gray-100 bg-gray-50/50"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Document Grid */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="w-10 h-10 animate-spin text-bhutan-red mb-4" />
                    <p className="text-gray-400 font-medium">Loading your documents...</p>
                </div>
            ) : filteredDocuments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredDocuments.map((doc) => (
                        <motion.div
                            layout
                            key={doc._id}
                            className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all group"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-bhutan-red group-hover:bg-bhutan-red group-hover:text-white transition-colors">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                        onClick={() => handleDelete(doc._id)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                            <h3 className="font-bold text-bhutan-dark text-lg mb-1">{doc.title}</h3>
                            <p className="text-gray-500 text-sm line-clamp-2 min-h-[40px] mb-4">{doc.description}</p>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-50 text-[10px] uppercase tracking-widest font-bold text-gray-400">
                                <div className="flex flex-col">
                                    <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> {new Date(doc.createdAt).toLocaleDateString()}</span>
                                    <span className="mt-1">{doc.fileType} • {doc.fileSize}</span>
                                </div>
                                <a
                                    href={`/api/download/${doc._id}`}
                                    download={doc.title}
                                    className="text-bhutan-gold hover:text-bhutan-red transition-colors flex items-center gap-1"
                                >
                                    <Download className="w-3 h-3" /> View & Download
                                </a>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4 border border-gray-100">
                        <FileDown className="w-8 h-8 text-gray-300" />
                    </div>
                    <h3 className="text-xl font-bold text-bhutan-dark mb-2">No documents found</h3>
                    <p className="text-gray-400 mb-6 max-w-xs mx-auto">Start by uploading your first document to make it available for download.</p>
                </div>
            )}

            {/* Upload Modal */}
            <AnimatePresence>
                {showUploadModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-bhutan-dark/60 backdrop-blur-sm"
                            onClick={() => !uploading && setShowUploadModal(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
                        >
                            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                                <h2 className="text-xl font-bold text-bhutan-dark flex items-center gap-2">
                                    <Upload className="w-5 h-5 text-bhutan-red" /> New Document
                                </h2>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => !uploading && setShowUploadModal(false)}
                                    className="rounded-full"
                                >
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-6 space-y-5">
                                <div className="space-y-4">
                                    <div className="relative group">
                                        <div className={cn(
                                            "border-2 border-dashed rounded-2xl p-8 transition-all flex flex-col items-center justify-center cursor-pointer",
                                            formData.fileUrl ? "border-bhutan-gold bg-bhutan-gold/5" : "border-gray-200 hover:border-bhutan-red/30 hover:bg-bhutan-red/5"
                                        )}>
                                            <input
                                                type="file"
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                                onChange={handleFileUpload}
                                                disabled={uploading}
                                            />
                                            {uploading ? (
                                                <Loader2 className="w-8 h-8 animate-spin text-bhutan-red" />
                                            ) : (formData.fileUrl || formData.fileContent) ? (
                                                <>
                                                    <FileText className="w-10 h-10 text-bhutan-gold mb-2" />
                                                    <p className="text-sm font-bold text-bhutan-gold truncate max-w-[200px]">
                                                        {formData.fileContent ? "Document Ready" : "Image Ready"}
                                                    </p>
                                                    <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-widest click to change">Click to change</p>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-3 text-gray-400 group-hover:text-bhutan-red transition-colors">
                                                        <Plus className="w-6 h-6" />
                                                    </div>
                                                    <p className="text-sm font-bold text-bhutan-dark">Click to upload document</p>
                                                    <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-widest">PDF, DOC, JPG up to 10MB</p>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Document Title</label>
                                        <Input
                                            placeholder="e.g., Property Purchase Agreement"
                                            required
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            className="h-12 border-gray-100 bg-gray-50 focus:ring-bhutan-red/10 focus:border-bhutan-red/30 rounded-xl"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Description</label>
                                        <Textarea
                                            placeholder="Provide a brief context for this document..."
                                            required
                                            rows={3}
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            className="border-gray-100 bg-gray-50 focus:ring-bhutan-red/10 focus:border-bhutan-red/30 rounded-xl resize-none"
                                        />
                                    </div>
                                </div>
                                <Button
                                    className="w-full h-12 bg-bhutan-dark hover:bg-bhutan-red text-white font-bold rounded-xl transition-all shadow-xl shadow-bhutan-dark/10"
                                    type="submit"
                                    disabled={loading || uploading || (!formData.fileUrl && !formData.fileContent)}
                                >
                                    Publish Document
                                </Button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

function X({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
    )
}
