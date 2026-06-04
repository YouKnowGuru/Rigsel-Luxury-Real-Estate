import mongoose, { Schema, Document } from "mongoose";
import {
  SOLUTION_SERVICE_TYPES,
  type SolutionServiceType,
} from "@/lib/solution-types";

export { SOLUTION_SERVICE_TYPES, type SolutionServiceType };

export interface ISolutionProject extends Document {
  title: string;
  slug: string;
  summary: string;
  description: string;
  serviceType: SolutionServiceType;
  technologies: string[];
  coverImage: string;
  galleryImages: string[];
  projectUrl: string;
  demoUrl: string;
  clientName: string;
  isPinned: boolean;
  isFeatured: boolean;
  isPublished: boolean;
  publishedAt: Date;
  order: number;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const SolutionProjectSchema: Schema = new Schema(
  {
    title: { type: String, required: true, trim: true, index: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    summary: { type: String, required: true, maxlength: 500 },
    description: { type: String, default: "" },
    serviceType: {
      type: String,
      enum: SOLUTION_SERVICE_TYPES,
      required: true,
      index: true,
    },
    technologies: { type: [String], default: [] },
    coverImage: { type: String, default: "" },
    galleryImages: { type: [String], default: [] },
    projectUrl: { type: String, default: "", trim: true },
    demoUrl: { type: String, default: "", trim: true },
    clientName: { type: String, default: "", trim: true },
    isPinned: { type: Boolean, default: false, index: true },
    isFeatured: { type: Boolean, default: false, index: true },
    isPublished: { type: Boolean, default: false, index: true },
    publishedAt: { type: Date, default: Date.now, index: true },
    order: { type: Number, default: 0, index: true },
    viewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

SolutionProjectSchema.index({ isPublished: 1, serviceType: 1, isPinned: -1, order: -1 });

SolutionProjectSchema.pre("save", function (next) {
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
  delete mongoose.models.SolutionProject;
}

export default mongoose.models.SolutionProject ||
  mongoose.model<ISolutionProject>("SolutionProject", SolutionProjectSchema);
