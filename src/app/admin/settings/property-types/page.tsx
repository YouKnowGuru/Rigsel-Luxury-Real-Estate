"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Edit2, Check, X, Loader2, Home, Settings as SettingsIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface IPropertyType {
    _id: string;
    name: string;
    slug: string;
    requiresBedBath: boolean;
    areaLabel: string;
}

export default function PropertyTypesPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [types, setTypes] = useState<IPropertyType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // New Type Form
    const [newName, setNewName] = useState("");
    const [newRequires, setNewRequires] = useState(true);
    const [newAreaLabel, setNewAreaLabel] = useState("Area (m²)");

    // Edit Form
    const [editName, setEditName] = useState("");
    const [editRequires, setEditRequires] = useState(true);
    const [editAreaLabel, setEditAreaLabel] = useState("");

    useEffect(() => {
        fetchTypes();
    }, []);

    const fetchTypes = async () => {
        try {
            const res = await fetch("/api/admin/property-types");
            const data = await res.json();
            if (data.success) setTypes(data.data);
        } catch (error) {
            toast({ title: "Error", description: "Failed to fetch property types", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newName.trim()) return;

        setIsSaving(true);
        try {
            const slug = newName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
            const res = await fetch("/api/admin/property-types", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
                },
                body: JSON.stringify({
                    name: newName.trim(),
                    slug,
                    requiresBedBath: newRequires,
                    areaLabel: newAreaLabel
                }),
            });
            const data = await res.json();
            if (data.success) {
                setTypes([...types, data.data]);
                setNewName("");
                setNewRequires(true);
                setNewAreaLabel("Area (m²)");
                toast({ title: "Success", description: "Property type added" });
            } else {
                throw new Error(data.error);
            }
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this property type?")) return;

        try {
            const res = await fetch(`/api/admin/property-types/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
            });
            if (res.ok) {
                setTypes(types.filter(t => t._id !== id));
                toast({ title: "Deleted", description: "Property type removed" });
            }
        } catch (error) {
            toast({ title: "Error", description: "Failed to delete", variant: "destructive" });
        }
    };

    const startEdit = (type: IPropertyType) => {
        setEditingId(type._id);
        setEditName(type.name);
        setEditRequires(type.requiresBedBath);
        setEditAreaLabel(type.areaLabel || "Area (m²)");
    };

    const handleUpdate = async (id: string) => {
        setIsSaving(true);
        try {
            const slug = editName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
            const res = await fetch(`/api/admin/property-types/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
                },
                body: JSON.stringify({
                    name: editName.trim(),
                    slug,
                    requiresBedBath: editRequires,
                    areaLabel: editAreaLabel
                }),
            });
            const data = await res.json();
            if (data.success) {
                setTypes(types.map(t => t._id === id ? data.data : t));
                setEditingId(null);
                toast({ title: "Updated", description: "Property type updated" });
            }
        } catch (error) {
            toast({ title: "Error", description: "Failed to update", variant: "destructive" });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-bhutan-red" />
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6 lg:p-8 max-w-4xl mx-auto">
            <header className="mb-8 flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-0.5 h-4 bg-bhutan-red rounded-full" />
                        <p className="text-bhutan-red font-bold text-xs uppercase tracking-[0.3em]">System Config</p>
                    </div>
                    <h1 className="text-3xl font-bold text-bhutan-dark">Property Types</h1>
                </div>
            </header>

            <div className="grid gap-6">
                {/* Add New Form */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl p-6 border border-bhutan-gold/10 shadow-sm"
                >
                    <h2 className="font-bold text-bhutan-dark text-base mb-4 flex items-center gap-2">
                        <Plus className="w-4 h-4 text-emerald-500" /> Add New Type
                    </h2>
                    <form onSubmit={handleAdd} className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="flex-1 w-full text-left">
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-bhutan-dark/40 mb-1.5 ml-1">Type Name</label>
                            <Input
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                placeholder="e.g. Land, Apartment, Villa"
                                className="h-11 rounded-xl border-bhutan-gold/15 focus:border-bhutan-red/30"
                            />
                        </div>
                        <div className="flex-1 w-full text-left">
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-bhutan-dark/40 mb-1.5 ml-1">Area Label</label>
                            <Input
                                value={newAreaLabel}
                                onChange={(e) => setNewAreaLabel(e.target.value)}
                                placeholder="Area (m²), Area (Decimals)"
                                className="h-11 rounded-xl border-bhutan-gold/15 focus:border-bhutan-red/30"
                            />
                        </div>
                        <div className="flex items-center gap-3 h-11 px-4 bg-[#F9F7F2] rounded-xl border border-bhutan-gold/10">
                            <input
                                type="checkbox"
                                checked={newRequires}
                                onChange={(e) => setNewRequires(e.target.checked)}
                                className="w-4 h-4 text-bhutan-red bg-white border-bhutan-gold/30 rounded focus:ring-bhutan-red/20"
                                id="requires-new"
                            />
                            <label htmlFor="requires-new" className="text-sm font-bold text-bhutan-dark/60 uppercase tracking-tight cursor-pointer">Requires Bed/Bath</label>
                        </div>
                        <button
                            type="submit"
                            disabled={isSaving || !newName.trim()}
                            className="h-11 px-6 bg-bhutan-red text-white rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-bhutan-dark transition-all disabled:opacity-50"
                        >
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add Type"}
                        </button>
                    </form>
                </motion.div>

                {/* Types List */}
                <div className="space-y-3">
                    <AnimatePresence mode="popLayout">
                        {types.map((type) => (
                            <motion.div
                                key={type._id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-white rounded-2xl p-4 border border-bhutan-gold/10 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow"
                            >
                                {editingId === type._id ? (
                                    <div className="flex-1 flex flex-col md:flex-row gap-3 items-center">
                                        <Input
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                            className="h-10 rounded-lg flex-1"
                                            placeholder="Name"
                                        />
                                        <Input
                                            value={editAreaLabel}
                                            onChange={(e) => setEditAreaLabel(e.target.value)}
                                            className="h-10 rounded-lg flex-1"
                                            placeholder="Area Label"
                                        />
                                        <div className="flex items-center gap-2 px-3 h-10 bg-[#F9F7F2] rounded-lg">
                                            <input
                                                type="checkbox"
                                                checked={editRequires}
                                                onChange={(e) => setEditRequires(e.target.checked)}
                                                id={`edit-req-${type._id}`}
                                            />
                                            <label htmlFor={`edit-req-${type._id}`} className="text-xs font-bold text-bhutan-dark/60 uppercase">Bed/Bath</label>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => handleUpdate(type._id)} className="p-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600">
                                                <Check className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => setEditingId(null)} className="p-2 bg-bhutan-dark/10 text-bhutan-dark/50 rounded-lg hover:bg-bhutan-dark/20">
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-bhutan-gold/5 border border-bhutan-gold/15 flex items-center justify-center">
                                                <Home className="w-5 h-5 text-bhutan-gold" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-bhutan-dark text-lg">{type.name}</h3>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className="text-[10px] bg-[#F9F7F2] text-bhutan-dark/40 px-1.5 py-0.5 rounded font-bold uppercase">{type.slug}</span>
                                                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${type.requiresBedBath ? 'bg-emerald-50 text-emerald-600' : 'bg-bhutan-red/5 text-bhutan-red/60'}`}>
                                                        {type.requiresBedBath ? "Bed/Bath Enabled" : "Area Only"}
                                                    </span>
                                                    <span className="text-[10px] bg-bhutan-gold/5 text-bhutan-gold px-1.5 py-0.5 rounded font-bold uppercase">
                                                        {type.areaLabel || "Area (m²)"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            <button onClick={() => startEdit(type)} className="p-2 text-bhutan-dark/30 hover:text-bhutan-gold transition-colors">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleDelete(type._id)} className="p-2 text-bhutan-dark/30 hover:text-bhutan-red transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
