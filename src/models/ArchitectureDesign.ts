import mongoose, { Schema, Document } from "mongoose";

export interface IArchitectureScene {
  id: string;
  title: string;
  panoramaUrl: string;
}

export interface IArchitectureDesign extends Document {
  title: string;
  slug: string;
  summary: string;
  description: string;
  category: string;
  location: string;
  district: string;
  architect: string;
  coverImage: string;
  panoramaUrl: string;
  scenes: IArchitectureScene[];
  isPinned: boolean;
  isFeatured: boolean;
  isPublished: boolean;
  publishedAt: Date;
  order: number;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const SceneSchema = new Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true, trim: true },
    panoramaUrl: { type: String, required: true },
  },
  { _id: false }
);

const ArchitectureDesignSchema: Schema = new Schema(
  {
    title: { type: String, required: true, trim: true, index: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    summary: { type: String, required: true, maxlength: 500 },
    description: { type: String, default: "" },
    category: {
      type: String,
      required: true,
      default: "Residential",
      index: true,
    },
    location: { type: String, default: "", trim: true },
    district: { type: String, default: "", trim: true },
    architect: { type: String, default: "", trim: true },
    coverImage: { type: String, default: "" },
    panoramaUrl: { type: String, required: true },
    scenes: { type: [SceneSchema], default: [] },
    isPinned: { type: Boolean, default: false, index: true },
    isFeatured: { type: Boolean, default: false, index: true },
    isPublished: { type: Boolean, default: false, index: true },
    publishedAt: { type: Date, default: Date.now, index: true },
    order: { type: Number, default: 0, index: true },
    viewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

ArchitectureDesignSchema.index({ isPublished: 1, isFeatured: -1, order: -1, publishedAt: -1 });

ArchitectureDesignSchema.pre("save", function (next) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const doc = this as any;
  if (!doc.summary?.trim() && doc.description) {
    const plain = String(doc.description)
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    doc.summary =
      plain.length > 200 ? `${plain.substring(0, 200)}...` : plain || doc.title;
  }
  next();
});

if (process.env.NODE_ENV === "development") {
  delete mongoose.models.ArchitectureDesign;
}

export default mongoose.models.ArchitectureDesign ||
  mongoose.model<IArchitectureDesign>("ArchitectureDesign", ArchitectureDesignSchema);
