"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Upload, X, Plus, Loader2, ImageIcon, Settings as SettingsIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { RichTextEditor } from "@/components/admin/RichTextEditor";

const districts = [
  "Bumthang", "Chhukha", "Dagana", "Gasa", "Haa",
  "Lhuentse", "Mongar", "Paro", "Pema Gatshel", "Punakha",
  "Samdrup Jongkhar", "Samtse", "Sarpang", "Thimphu", "Trashigang",
  "Trashi Yangtse", "Trongsa", "Tsirang", "Wangdue Phodrang", "Zhemgang"
];

// Property types will be fetched from API
interface IPropertyType {
  _id: string;
  name: string;
  slug: string;
  requiresBedBath: boolean;
  areaLabel: string;
}

const commonFeatures = [
  "Parking", "Garden", "Balcony", "Mountain View", "River View",
  "Security System", "Modern Kitchen", "Furnished", "Air Conditioning",
  "Internet", "Solar Power", "Water Heater", "CCTV", "Gym",
];

export default function NewPropertyPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [customFeature, setCustomFeature] = useState("");
  const [description, setDescription] = useState("");
  const [propertyTypes, setPropertyTypes] = useState<IPropertyType[]>([]);
  const [formData, setFormData] = useState({
    title: "", price: "", location: "", district: "Thimphu",
    bedrooms: "", bathrooms: "", area: "", propertyType: "",
    latitude: "", longitude: "", featured: false, loanAvailable: false,
    loanAmount: "", isSold: false,
  });
  const [specifications, setSpecifications] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    fetchPropertyTypes();
  }, []);

  const fetchPropertyTypes = async () => {
    try {
      const res = await fetch("/api/admin/property-types", {
      });
      const data = await res.json();
      if (data.success) {
        setPropertyTypes(data.data);
        if (data.data.length > 0) {
          setFormData(prev => ({ ...prev, propertyType: data.data[0].slug }));
        }
      }
    } catch (error) {
      console.error("Error fetching property types:", error);
    }
  };

  const currentType = propertyTypes.find(t => t.slug === formData.propertyType);
  const showBedBath = currentType?.requiresBedBath ?? true;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImages(true);

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/upload", {
          method: "POST",
          body: fd,
        });
        const data = await res.json();
        if (data.success) return data.url as string;
        // Fallback: use object URL if Cloudinary not configured
        if (data.error?.includes("not configured")) {
          toast({
            title: "Cloudinary Not Configured",
            description: "Using local preview. Set up Cloudinary in .env for production.",
            variant: "default",
          });
          return URL.createObjectURL(file);
        }
        throw new Error(data.error);
      });

      const urls = await Promise.all(uploadPromises);
      setImages((prev) => [...prev, ...urls]);
      toast({ title: "Images Uploaded", description: `${urls.length} image(s) added.` });
    } catch (error: any) {
      // Fallback to object URLs on any error
      const objectUrls = Array.from(files).map((f) => URL.createObjectURL(f));
      setImages((prev) => [...prev, ...objectUrls]);
      toast({ title: "Using Local Preview", description: "Configure Cloudinary for cloud storage." });
    } finally {
      setUploadingImages(false);
      e.target.value = "";
    }
  };

  const removeImage = (index: number) => setImages(images.filter((_, i) => i !== index));

  const toggleFeature = (feature: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(feature) ? prev.filter((f) => f !== feature) : [...prev, feature]
    );
  };

  const addCustomFeature = () => {
    if (customFeature.trim() && !selectedFeatures.includes(customFeature.trim())) {
      setSelectedFeatures((prev) => [...prev, customFeature.trim()]);
      setCustomFeature("");
    }
  };

  const addSpecification = () => {
    setSpecifications([...specifications, { label: "", value: "" }]);
  };

  const updateSpecification = (index: number, field: "label" | "value", val: string) => {
    const updated = [...specifications];
    updated[index][field] = val;
    setSpecifications(updated);
  };

  const removeSpecification = (index: number) => {
    setSpecifications(specifications.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length === 0) {
      toast({ title: "No Images", description: "Please upload at least one image.", variant: "destructive" });
      return;
    }
    if (!description || description === "<p></p>") {
      toast({ title: "No Description", description: "Please write a property description.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/properties", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          bedrooms: Number(formData.bedrooms) || 0,
          bathrooms: Number(formData.bathrooms) || 0,
          area: Number(formData.area),
          latitude: Number(formData.latitude) || 27.4712,
          longitude: Number(formData.longitude) || 89.6339,
          images,
          loanAmount: Number(formData.loanAmount) || 0,
          isSold: formData.isSold,
          features: selectedFeatures,
          specifications: specifications.filter(s => s.label && s.value),
          description,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast({ title: "Property Created!", description: "The listing has been added successfully." });
        router.push("/admin/properties");
      } else {
        throw new Error(data.error || "Failed to create property");
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputCls = "h-11 rounded-2xl border-ink-200 focus:border-sky focus:ring-[3px] focus:ring-sky/15 text-foreground text-base font-medium";
  const selectCls = "w-full h-11 px-3 bg-background dark:bg-card border border-ink-200 dark:border-ink-700 rounded-2xl focus:outline-none focus:ring-[3px] focus:ring-sky/15 text-base text-foreground appearance-none cursor-pointer font-medium";
  const labelCls = "block text-[13px] font-medium text-ink-600 mb-1.5";

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <header className="mb-7 flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 bg-card rounded-[14px] border border-ink-200 flex items-center justify-center text-ink-400 hover:text-sky hover:scale-105 transition-all shadow-soft"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
        </button>
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <div className="w-0.5 h-4 bg-sky rounded-full" />
            <p className="text-sky text-[12px] font-semibold uppercase tracking-[0.12em]">New Listing</p>
          </div>
          <h1 className="text-[28px] font-semibold text-foreground tracking-tight">Add Property</h1>
        </div>
      </header>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Fields */}
          <div className="lg:col-span-2 space-y-5">
            {/* Basic Info */}
            <div className="bg-card rounded-[20px] p-6 border border-ink-100/60 shadow-soft">
              <h2 className="font-semibold text-foreground text-base mb-5 flex items-center gap-2">
                <span className="w-1 h-4 bg-sky rounded-full" /> Basic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className={labelCls}>Property Title *</label>
                  <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Luxury Villa in Thimphu" className={inputCls} required />
                </div>
                <div>
                  <label className={labelCls}>Price (Nu.) *</label>
                  <Input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="25000000" className={inputCls} required />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className={labelCls + " mb-0"}>Property Type *</label>
                    <Link href="/admin/settings/property-types" className="text-[12px] font-medium text-sky hover:text-sky-hover transition-colors flex items-center gap-1">
                      <SettingsIcon className="w-3.5 h-3.5" strokeWidth={1.5} /> Manage
                    </Link>
                  </div>
                  <select value={formData.propertyType} onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })} className={selectCls} required>
                    {propertyTypes.map((t) => <option key={t._id} value={t.slug}>{t.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Location / Address *</label>
                  <Input value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g., Motithang, Thimphu" className={inputCls} required />
                </div>
                <div>
                  <label className={labelCls}>District *</label>
                  <select value={formData.district} onChange={(e) => setFormData({ ...formData, district: e.target.value })} className={selectCls} required>
                    {districts.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className={`md:col-span-2 grid ${showBedBath ? 'grid-cols-3' : 'grid-cols-1'} gap-3`}>
                  {showBedBath && (
                    <>
                      <div>
                        <label className={labelCls + " text-center block"}>Bedrooms</label>
                        <Input type="number" value={formData.bedrooms} onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                          placeholder="3" className={inputCls + " text-center"} min="0" />
                      </div>
                      <div>
                        <label className={labelCls + " text-center block"}>Bathrooms</label>
                        <Input type="number" value={formData.bathrooms} onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                          placeholder="2" className={inputCls + " text-center"} min="0" />
                      </div>
                    </>
                  )}
                  <div className={showBedBath ? "" : "md:col-span-1"}>
                    <label className={labelCls + " text-center block"}>
                      {currentType?.areaLabel || "Area (m²)"} *
                    </label>
                    <Input type="number" step="any" value={formData.area} onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                      placeholder="200" className={inputCls + " text-center"} required min="0" />
                  </div>
                </div>
              </div>
            </div>

            {/* Specifications */}
            <div className="bg-card rounded-[20px] p-6 border border-ink-100/60 shadow-soft">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-semibold text-foreground text-base flex items-center gap-2">
                  <span className="w-1 h-4 bg-sky rounded-full" /> Property Specifications
                </h2>
                <button
                  type="button"
                  onClick={addSpecification}
                  className="text-[12px] font-medium text-sky hover:text-sky-hover flex items-center gap-1.5 px-3 py-1.5 bg-sky/5 rounded-xl transition-colors border border-sky/10"
                >
                  <Plus className="w-3.5 h-3.5" strokeWidth={1.5} /> Add Spec
                </button>
              </div>

              <div className="space-y-3">
                {specifications.length === 0 ? (
                  <p className="text-ink-400 text-sm text-center py-4 bg-muted rounded-2xl border border-dashed border-ink-200">
                    No custom specifications added. You can add things like "Storey", "Living Room", etc.
                  </p>
                ) : (
                  specifications.map((spec, index) => (
                    <div key={index} className="flex gap-3 animate-in fade-in slide-in-from-top-1 duration-200">
                      <div className="flex-1">
                        <label className={labelCls}>Label (e.g. Story)</label>
                        <Input
                          value={spec.label}
                          onChange={(e) => updateSpecification(index, "label", e.target.value)}
                          placeholder="e.g. Story"
                          className={inputCls}
                        />
                      </div>
                      <div className="flex-1">
                        <label className={labelCls}>Value (e.g. 2)</label>
                        <Input
                          value={spec.value}
                          onChange={(e) => updateSpecification(index, "value", e.target.value)}
                          placeholder="e.g. 2"
                          className={inputCls}
                        />
                      </div>
                      <div className="flex items-end pb-1.5">
                        <button
                          type="button"
                          onClick={() => removeSpecification(index)}
                          className="w-10 h-10 flex items-center justify-center text-ink-300 hover:text-sky hover:bg-sky/5 rounded-xl transition-colors"
                        >
                          <X className="w-4 h-4" strokeWidth={1.5} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Description – Rich Text Editor */}
            <div className="bg-card rounded-[20px] p-6 border border-ink-100/60 shadow-soft">
              <h2 className="font-semibold text-foreground text-base mb-4 flex items-center gap-2">
                <span className="w-1 h-4 bg-sky rounded-full" /> Description *
              </h2>
              <RichTextEditor
                value={description}
                onChange={setDescription}
                placeholder="Write a compelling description of the property with key highlights, surroundings, and unique features..."
              />
            </div>

            {/* Features */}
            <div className="bg-card rounded-[20px] p-6 border border-ink-100/60 shadow-soft">
              <h2 className="font-semibold text-foreground text-base mb-4 flex items-center gap-2">
                <span className="w-1 h-4 bg-emerald-500 rounded-full" /> Features & Amenities
              </h2>
              <div className="flex flex-wrap gap-2 mb-4">
                {commonFeatures.map((feature) => (
                  <button key={feature} type="button" onClick={() => toggleFeature(feature)}
                    className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all border ${selectedFeatures.includes(feature)
                      ? "bg-sky text-background border-sky shadow-soft"
                      : "bg-muted text-ink-500 border-ink-200 hover:border-sky/30 hover:text-sky"
                      }`}
                  >
                    {feature}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <Input value={customFeature} onChange={(e) => setCustomFeature(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCustomFeature(); } }}
                  placeholder="Add custom feature..." className={inputCls + " flex-1"} />
                <button type="button" onClick={addCustomFeature}
                  className="h-11 px-4 bg-sky text-background rounded-xl font-medium text-base hover:bg-sky-hover transition-colors shadow-soft">
                  <Plus className="w-4 h-4" strokeWidth={1.5} />
                </button>
              </div>
              {selectedFeatures.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {selectedFeatures.map((f) => (
                    <span key={f} className="flex items-center gap-1.5 px-2.5 py-1 bg-sky/10 text-sky text-sm font-medium rounded-lg">
                      {f}
                      <button type="button" onClick={() => toggleFeature(f)} className="hover:text-ink-800 transition-colors">
                        <X className="w-3 h-3" strokeWidth={1.5} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Image Upload */}
            <div className="bg-card rounded-[20px] p-5 border border-ink-100/60 shadow-soft">
              <h2 className="font-semibold text-foreground text-base mb-4 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-sky" strokeWidth={1.5} /> Property Images *
              </h2>

              <label htmlFor="img-upload" className="block">
                <div className={`border-2 border-dashed border-ink-200 rounded-xl p-6 text-center cursor-pointer hover:border-sky/40 hover:bg-sky/5 transition-all ${uploadingImages ? "opacity-70 pointer-events-none" : ""}`}>
                  {uploadingImages ? (
                    <><Loader2 className="w-7 h-7 text-sky/60 mx-auto mb-2 animate-spin" strokeWidth={1.5} />
                      <p className="text-ink-500 text-sm font-medium">Uploading...</p></>
                  ) : (
                    <><Upload className="w-7 h-7 text-ink-300 mx-auto mb-2" strokeWidth={1.5} />
                      <p className="text-ink-600 text-sm font-medium">Click to Upload</p>
                      <p className="text-ink-400 text-xs sm:text-sm mt-1">JPEG · PNG · WebP</p></>
                  )}
                </div>
                <input id="img-upload" type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>

              {images.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {images.map((img, i) => (
                    <div key={i} className="relative aspect-square group">
                      <img src={img} alt={`Preview ${i + 1}`} className="w-full h-full object-cover rounded-xl border border-ink-100" />
                      <button type="button" onClick={() => removeImage(i)}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-sky text-background rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-soft">
                        <X className="w-3 h-3" strokeWidth={1.5} />
                      </button>
                      {i === 0 && (
                        <span className="absolute bottom-1 left-1 text-[11px] sm:text-[13px] sm:text-[12px] font-semibold bg-sky text-background px-1.5 py-0.5 rounded">Cover</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Coordinates & Meta */}
            <div className="bg-card rounded-[20px] p-5 border border-ink-100/60 shadow-soft">
              <h2 className="font-semibold text-foreground text-base mb-4">Location & Meta</h2>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className={labelCls}>Latitude</label>
                    <Input type="number" step="any" value={formData.latitude}
                      onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                      placeholder="27.4712" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Longitude</label>
                    <Input type="number" step="any" value={formData.longitude}
                      onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                      placeholder="89.6339" className={inputCls} />
                  </div>
                </div>
                <label className="flex items-center gap-3 p-3 bg-card rounded-xl cursor-pointer hover:bg-sky/5 transition-colors border border-transparent hover:border-sky/20">
                  <input type="checkbox" checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 rounded text-sky focus:ring-sky cursor-pointer" />
                  <div>
                    <span className="text-sm font-medium text-foreground">Featured</span>
                    <p className="text-xs sm:text-sm text-ink-500">Show on homepage highlights</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-3 bg-card rounded-xl cursor-pointer hover:bg-sky/5 transition-colors border border-transparent hover:border-sky/20">
                  <input type="checkbox" checked={formData.loanAvailable}
                    onChange={(e) => setFormData({ ...formData, loanAvailable: e.target.checked })}
                    className="w-4 h-4 rounded text-sky focus:ring-sky cursor-pointer" />
                  <div>
                    <span className="text-sm font-medium text-foreground">Loan Option</span>
                    <p className="text-xs sm:text-sm text-ink-500">Indicate if property has a loan option available</p>
                  </div>
                </label>

                {formData.loanAvailable && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="space-y-1.5"
                  >
                    <label className={labelCls}>Loan Amount (Nu.)</label>
                    <Input
                      type="number"
                      value={formData.loanAmount}
                      onChange={(e) => setFormData({ ...formData, loanAmount: e.target.value })}
                      placeholder="e.g. 5000000"
                      className={inputCls}
                    />
                  </motion.div>
                )}

                <label className="flex items-center gap-3 p-3 bg-card rounded-xl cursor-pointer hover:bg-sky/5 transition-colors border border-transparent hover:border-sky/20">
                  <input type="checkbox" checked={formData.isSold}
                    onChange={(e) => setFormData({ ...formData, isSold: e.target.checked })}
                    className="w-4 h-4 rounded text-sky focus:ring-sky cursor-pointer" />
                  <div>
                    <span className="text-sm font-medium text-foreground">Mark as Sold</span>
                    <p className="text-xs sm:text-sm text-ink-500">Displays &quot;SOLD&quot; badge in frontend</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Submit */}
            <div className="space-y-2">
              <button type="submit" disabled={isSubmitting}
                className="w-full h-12 bg-sky text-background rounded-full font-semibold text-sm hover:bg-sky-hover transition-all shadow-elevated disabled:opacity-60 flex items-center justify-center gap-2">
                {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" strokeWidth={1.5} /> Creating...</> : "Create Property"}
              </button>
              <button type="button" onClick={() => router.back()}
                className="w-full h-10 text-sm text-ink-400 hover:text-sky transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
