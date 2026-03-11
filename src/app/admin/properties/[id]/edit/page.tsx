"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    Upload,
    X,
    Plus,
    Loader2,
    Settings as SettingsIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { RichTextEditor } from "@/components/admin/RichTextEditor";

const districts = [
    "Bumthang", "Chhukha", "Dagana", "Gasa", "Haa",
    "Lhuentse", "Mongar", "Paro", "Pema Gatshel", "Punakha",
    "Samdrup Jongkhar", "Samtse", "Sarpang", "Thimphu", "Trashigang",
    "Trashi Yangtse", "Trongsa", "Tsirang", "Wangdue Phodrang", "Zhemgang"
];

// Property types fetched from API
interface IPropertyType {
    _id: string;
    name: string;
    slug: string;
    requiresBedBath: boolean;
    areaLabel: string;
}

const commonFeatures = [
    "Traditional Bhutanese Architecture",
    "Mountain View",
    "Prayer Room",
    "Traditional Stove (Bukhari)",
    "Gardens",
    "Smart Security",
    "Modern Amenities",
    "River Side",
];

export default function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [images, setImages] = useState<string[]>([]);
    const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
    const [customFeature, setCustomFeature] = useState("");

    const [formData, setFormData] = useState({
        title: "",
        price: "",
        location: "",
        district: "Thimphu",
        propertyType: "house",
        bedrooms: "",
        bathrooms: "",
        area: "",
        featured: false,
        loanAvailable: false,
        latitude: "",
        longitude: "",
    });
    const [description, setDescription] = useState("");
    const [uploadingImages, setUploadingImages] = useState(false);
    const [propertyTypes, setPropertyTypes] = useState<IPropertyType[]>([]);

    useEffect(() => {
        fetchPropertyTypes();
    }, []);

    const fetchPropertyTypes = async () => {
        try {
            const res = await fetch("/api/admin/property-types");
            const data = await res.json();
            if (data.success) {
                setPropertyTypes(data.data);
            }
        } catch (error) {
            console.error("Error fetching property types:", error);
        }
    };

    const currentType = propertyTypes.find(t => t.slug === formData.propertyType);
    const showBedBath = currentType?.requiresBedBath ?? true;

    useEffect(() => {
        const token = localStorage.getItem("adminToken");
        if (!token) {
            router.push("/admin");
        } else {
            fetchProperty();
        }
    }, [id]);

    const fetchProperty = async () => {
        try {
            const response = await fetch(`/api/properties/${id}`);
            const data = await response.json();
            if (data.success) {
                const p = data.data;
                setFormData({
                    title: p.title || "",
                    price: p.price?.toString() || "",
                    location: p.location || "",
                    district: p.district || "Thimphu",
                    propertyType: p.propertyType || "house",
                    bedrooms: p.bedrooms?.toString() || "",
                    bathrooms: p.bathrooms?.toString() || "",
                    area: p.area?.toString() || "",
                    featured: p.featured || false,
                    loanAvailable: p.loanAvailable || false,
                    latitude: p.latitude?.toString() || "",
                    longitude: p.longitude?.toString() || "",
                });
                setDescription(p.description || "");
                setImages(p.images || []);
                setSelectedFeatures(p.features || []);
            } else {
                toast({
                    title: "Error",
                    description: "Failed to fetch property details",
                    variant: "destructive",
                });
                router.push("/admin/properties");
            }
        } catch (error) {
            console.error("Error fetching property:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        setUploadingImages(true);
        const token = localStorage.getItem("adminToken");
        try {
            const urls = await Promise.all(
                Array.from(files).map(async (file) => {
                    const fd = new FormData();
                    fd.append("file", file);
                    const res = await fetch("/api/upload", {
                        method: "POST",
                        headers: { Authorization: `Bearer ${token}` },
                        body: fd,
                    });
                    const data = await res.json();
                    if (data.success) return data.url as string;
                    return URL.createObjectURL(file);
                })
            );
            setImages((prev) => [...prev, ...urls]);
        } catch {
            const fallback = Array.from(files).map((f) => URL.createObjectURL(f));
            setImages((prev) => [...prev, ...fallback]);
        } finally {
            setUploadingImages(false);
            e.target.value = "";
        }
    };

    const removeImage = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
    };

    const toggleFeature = (feature: string) => {
        setSelectedFeatures((prev) =>
            prev.includes(feature)
                ? prev.filter((f) => f !== feature)
                : [...prev, feature]
        );
    };

    const addCustomFeature = () => {
        if (customFeature && !selectedFeatures.includes(customFeature)) {
            setSelectedFeatures([...selectedFeatures, customFeature]);
            setCustomFeature("");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch(`/api/properties/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
                },
                body: JSON.stringify({
                    ...formData,
                    description,
                    price: Number(formData.price),
                    bedrooms: Number(formData.bedrooms),
                    bathrooms: Number(formData.bathrooms),
                    area: Number(formData.area),
                    latitude: Number(formData.latitude),
                    longitude: Number(formData.longitude),
                    features: selectedFeatures,
                    images,
                }),
            });

            const data = await response.json();

            if (data.success) {
                toast({
                    title: "Success",
                    description: "Property updated successfully",
                });
                router.push("/admin/properties");
            } else {
                throw new Error(data.error);
            }
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to update property",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#F9F7F2] flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-4 border-bhutan-red border-t-transparent rounded-full" />
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 lg:p-10 max-w-[1200px] mx-auto min-h-screen">
            <div className="fixed inset-0 bg-thangka opacity-[0.015] pointer-events-none" />

            {/* Header */}
            <header className="mb-8 md:mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => router.back()}
                        className="w-10 h-10 bg-white/80 backdrop-blur-md rounded-xl border border-white flex items-center justify-center text-bhutan-dark/40 hover:text-bhutan-red hover:scale-110 transition-all shadow-luxury group"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div>
                        <motion.div
                            initial={{ opacity: 0, x: -15 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-2 mb-1"
                        >
                            <div className="w-0.5 h-6 bg-bhutan-red rounded-full" />
                            <p className="text-bhutan-red font-bold text-xs uppercase tracking-[0.3em]">Vault Modification</p>
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-3xl md:text-4xl font-bold text-bhutan-dark leading-tight"
                        >
                            Update <span className="text-bhutan-gold italic font-light">Listing</span>
                        </motion.h2>
                    </div>
                </div>
            </header>

            {/* Form Container */}
            <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleSubmit}
                className="relative z-10"
            >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Main Content Area */}
                    <div className="lg:col-span-8 space-y-6">
                        <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] p-6 md:p-8 border border-white shadow-luxury">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Title */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm uppercase tracking-widest font-bold text-bhutan-dark/40 mb-2">
                                        Property Designation *
                                    </label>
                                    <Input
                                        value={formData.title}
                                        onChange={(e) =>
                                            setFormData({ ...formData, title: e.target.value })
                                        }
                                        placeholder="e.g., Imperial Villa in Thimphu"
                                        className="h-12 bg-white/50 border-white focus:ring-bhutan-red/10 text-base rounded-xl"
                                        required
                                    />
                                </div>

                                {/* Price */}
                                <div>
                                    <label className="block text-sm uppercase tracking-widest font-bold text-bhutan-dark/40 mb-2">
                                        Investment Value (Nu.) *
                                    </label>
                                    <Input
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) =>
                                            setFormData({ ...formData, price: e.target.value })
                                        }
                                        placeholder="25000000"
                                        className="h-12 bg-white/50 border-white focus:ring-bhutan-red/10 text-base rounded-xl"
                                        required
                                    />
                                </div>

                                {/* Property Type */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="block text-sm uppercase tracking-widest font-bold text-bhutan-dark/40 mb-0">
                                            Asset Class *
                                        </label>
                                        <Link href="/admin/settings/property-types" className="text-[10px] font-bold text-bhutan-gold hover:text-bhutan-red transition-colors uppercase tracking-wider flex items-center gap-1">
                                            <SettingsIcon className="w-3 h-3" /> Manage
                                        </Link>
                                    </div>
                                    <select
                                        value={formData.propertyType}
                                        onChange={(e) =>
                                            setFormData({ ...formData, propertyType: e.target.value })
                                        }
                                        className="w-full h-12 px-4 bg-white/50 border border-white rounded-xl focus:ring-2 focus:ring-bhutan-red/10 outline-none text-base appearance-none cursor-pointer"
                                        required
                                    >
                                        {propertyTypes.map((type) => (
                                            <option key={type._id} value={type.slug}>
                                                {type.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Location Details */}
                                <div>
                                    <label className="block text-sm uppercase tracking-widest font-bold text-bhutan-dark/40 mb-2">
                                        Specific Address *
                                    </label>
                                    <Input
                                        value={formData.location}
                                        onChange={(e) =>
                                            setFormData({ ...formData, location: e.target.value })
                                        }
                                        placeholder="e.g., High-end Residence at Motithang"
                                        className="h-12 bg-white/50 border-white focus:ring-bhutan-red/10 text-base rounded-xl"
                                        required
                                    />
                                </div>

                                {/* District */}
                                <div>
                                    <label className="block text-sm uppercase tracking-widest font-bold text-bhutan-dark/40 mb-2">
                                        Dzongkhag *
                                    </label>
                                    <select
                                        value={formData.district}
                                        onChange={(e) =>
                                            setFormData({ ...formData, district: e.target.value })
                                        }
                                        className="w-full h-12 px-4 bg-white/50 border border-white rounded-xl focus:ring-2 focus:ring-bhutan-red/10 outline-none text-base appearance-none cursor-pointer"
                                        required
                                    >
                                        {districts.map((district) => (
                                            <option key={district} value={district}>
                                                {district}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Specifications */}
                                <div className={`grid ${showBedBath ? 'grid-cols-3' : 'grid-cols-1'} gap-4 md:col-span-2`}>
                                    {showBedBath && (
                                        <>
                                            <div>
                                                <label className="block text-xs uppercase tracking-widest font-bold text-bhutan-dark/40 mb-1.5 text-center">
                                                    Bedrooms
                                                </label>
                                                <Input
                                                    type="number"
                                                    value={formData.bedrooms}
                                                    onChange={(e) =>
                                                        setFormData({ ...formData, bedrooms: e.target.value })
                                                    }
                                                    className="h-10 text-center bg-white/50 border-white text-base rounded-lg"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs uppercase tracking-widest font-bold text-bhutan-dark/40 mb-1.5 text-center">
                                                    Baths
                                                </label>
                                                <Input
                                                    type="number"
                                                    value={formData.bathrooms}
                                                    onChange={(e) =>
                                                        setFormData({ ...formData, bathrooms: e.target.value })
                                                    }
                                                    className="h-10 text-center bg-white/50 border-white text-base rounded-lg"
                                                />
                                            </div>
                                        </>
                                    )}
                                    <div className={showBedBath ? "" : "md:col-span-1"}>
                                        <label className="block text-xs uppercase tracking-widest font-bold text-bhutan-dark/40 mb-1.5 text-center">
                                            {currentType?.areaLabel || "Area (m²)"}
                                        </label>
                                        <Input
                                            type="number"
                                            value={formData.area}
                                            onChange={(e) =>
                                                setFormData({ ...formData, area: e.target.value })
                                            }
                                            className="h-10 text-center bg-white/50 border-white text-base rounded-lg"
                                        />
                                    </div>
                                </div>

                                {/* Description – Rich Text Editor */}
                                <div className="md:col-span-2">
                                    <label className="block text-xs uppercase tracking-widest font-bold text-bhutan-dark/40 mb-2">
                                        Description *
                                    </label>
                                    <RichTextEditor
                                        value={description}
                                        onChange={setDescription}
                                        placeholder="Update the compelling description for this property..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Features Card */}
                        <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] p-6 md:p-8 border border-white shadow-luxury">
                            <label className="block text-xs uppercase tracking-widest font-bold text-bhutan-dark/40 mb-4">
                                Distinguished Features
                            </label>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {commonFeatures.map((feature) => (
                                    <button
                                        key={feature}
                                        type="button"
                                        onClick={() => toggleFeature(feature)}
                                        className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 border ${selectedFeatures.includes(feature)
                                            ? "bg-bhutan-red text-white border-bhutan-red shadow-lg shadow-bhutan-red/10"
                                            : "bg-white/50 text-bhutan-dark/40 border-white hover:border-bhutan-gold/20"
                                            }`}
                                    >
                                        {feature}
                                    </button>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <Input
                                    value={customFeature}
                                    onChange={(e) => setCustomFeature(e.target.value)}
                                    placeholder="Unique attribute..."
                                    className="flex-1 h-10 bg-white/50 border-white text-base italic rounded-xl"
                                />
                                <Button
                                    type="button"
                                    variant="luxury"
                                    onClick={addCustomFeature}
                                    className="h-10 px-4 rounded-xl"
                                >
                                    <Plus className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Area (Images & Actions) */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Image Gallery Control */}
                        <div className="bg-bhutan-dark rounded-[2.5rem] p-6 md:p-8 border-4 border-white/5 shadow-luxury relative overflow-hidden group">
                            <div className="absolute inset-0 bg-thangka opacity-[0.03] pointer-events-none" />
                            <label className="block text-xs uppercase tracking-widest font-bold text-white/40 mb-4 relative z-10">
                                Visual Assets
                            </label>

                            <div className="border border-white/10 rounded-2xl p-6 text-center hover:bg-white/5 transition-all cursor-pointer group/upload relative z-10">
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                    id="image-upload"
                                />
                                <label
                                    htmlFor="image-upload"
                                    className="cursor-pointer flex flex-col items-center"
                                >
                                    <Upload className="w-8 h-8 text-bhutan-gold/40 mb-3 group-hover/upload:scale-110 group-hover/upload:text-bhutan-gold transition-all duration-500" />
                                    <p className="text-white text-xs font-bold uppercase tracking-widest opacity-80">Update Portfolios</p>
                                    <p className="text-white/30 text-xs uppercase tracking-widest mt-1">Multi-select JPEG/PNG</p>
                                </label>
                            </div>

                            {images.length > 0 && (
                                <div className="mt-6 grid grid-cols-3 gap-3 relative z-10">
                                    {images.map((image, index) => (
                                        <div key={index} className="relative aspect-square group/img">
                                            <img
                                                src={image}
                                                alt={`Preview ${index + 1}`}
                                                className="w-full h-full object-cover rounded-xl border border-white/10"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-bhutan-red text-white rounded-full flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity shadow-lg"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Coordinates & Meta */}
                        <div className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] p-6 md:p-8 border border-white shadow-luxury">
                            <label className="block text-xs uppercase tracking-widest font-bold text-bhutan-dark/40 mb-4">
                                System Attributes
                            </label>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-[#F9F7F2]/50 rounded-2xl border border-transparent hover:border-bhutan-gold/10 transition-all group">
                                    <div className="flex items-center gap-3">
                                        <span className="w-4 h-4 text-bhutan-red">★</span>
                                        <span className="text-xs font-bold uppercase tracking-[0.2em]">Featured Asset</span>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={formData.featured}
                                        onChange={(e) =>
                                            setFormData({ ...formData, featured: e.target.checked })
                                        }
                                        className="w-5 h-5 rounded-lg border-bhutan-gold/20 text-bhutan-red focus:ring-bhutan-red cursor-pointer"
                                    />
                                </div>

                                <div className="flex items-center justify-between p-4 bg-[#F9F7F2]/50 rounded-2xl border border-transparent hover:border-bhutan-gold/10 transition-all group">
                                    <div className="flex items-center gap-3">
                                        <span className="w-4 h-4 text-bhutan-gold">🏦</span>
                                        <span className="text-xs font-bold uppercase tracking-[0.2em]">Loan Available</span>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={formData.loanAvailable}
                                        onChange={(e) =>
                                            setFormData({ ...formData, loanAvailable: e.target.checked })
                                        }
                                        className="w-5 h-5 rounded-lg border-bhutan-gold/20 text-bhutan-red focus:ring-bhutan-red cursor-pointer"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-3 bg-white/50 border border-white rounded-xl">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-bhutan-dark/30 mb-1">Latitude</p>
                                        <input
                                            type="number"
                                            step="any"
                                            value={formData.latitude}
                                            onChange={(e) =>
                                                setFormData({ ...formData, latitude: e.target.value })
                                            }
                                            placeholder="27.4712"
                                            className="w-full bg-transparent border-none p-0 text-sm text-bhutan-dark outline-none placeholder:text-bhutan-dark/10"
                                        />
                                    </div>
                                    <div className="p-3 bg-white/50 border border-white rounded-xl">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-bhutan-dark/30 mb-1">Longitude</p>
                                        <input
                                            type="number"
                                            step="any"
                                            value={formData.longitude}
                                            onChange={(e) =>
                                                setFormData({ ...formData, longitude: e.target.value })
                                            }
                                            placeholder="89.6339"
                                            className="w-full bg-transparent border-none p-0 text-sm text-bhutan-dark outline-none placeholder:text-bhutan-dark/10"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Submit Block */}
                        <div className="flex flex-col gap-3">
                            <Button
                                type="submit"
                                variant="luxury"
                                isLoading={isSubmitting}
                                className="w-full h-16 rounded-[1.5rem] shadow-2xl shadow-bhutan-red/10 text-sm font-bold uppercase tracking-[0.4em]"
                            >
                                Update Listing
                            </Button>
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="w-full h-12 text-sm font-bold uppercase tracking-widest text-bhutan-dark/30 hover:text-bhutan-red transition-colors"
                            >
                                Discard Changes
                            </button>
                        </div>
                    </div>
                </div>
            </motion.form>
        </div>
    );
}
