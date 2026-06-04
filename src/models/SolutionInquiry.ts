import mongoose, { Schema, Document } from "mongoose";
import {
  SOLUTION_SERVICE_TYPES,
  SOLUTION_INQUIRY_STATUSES,
  type SolutionInquiryStatus,
  type SolutionServiceType,
} from "@/lib/solution-types";

export { SOLUTION_INQUIRY_STATUSES, type SolutionInquiryStatus };

export interface ISolutionInquiry extends Document {
  name: string;
  email: string;
  phone: string;
  serviceType: SolutionServiceType;
  projectTitle: string;
  budget: string;
  timeline: string;
  requirements: string;
  status: SolutionInquiryStatus;
  isRead: boolean;
  adminNotes: string;
  createdAt: Date;
  updatedAt: Date;
}

const SolutionInquirySchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 100,
    },
    phone: { type: String, required: true, trim: true, maxlength: 20 },
    serviceType: {
      type: String,
      enum: SOLUTION_SERVICE_TYPES,
      required: true,
      index: true,
    },
    projectTitle: { type: String, default: "", trim: true, maxlength: 200 },
    budget: { type: String, default: "", trim: true, maxlength: 100 },
    timeline: { type: String, default: "", trim: true, maxlength: 100 },
    requirements: { type: String, required: true, maxlength: 5000 },
    status: {
      type: String,
      enum: SOLUTION_INQUIRY_STATUSES,
      default: "new",
      index: true,
    },
    isRead: { type: Boolean, default: false, index: true },
    adminNotes: { type: String, default: "", maxlength: 2000 },
  },
  { timestamps: true }
);

SolutionInquirySchema.index({ createdAt: -1 });

if (process.env.NODE_ENV === "development") {
  delete mongoose.models.SolutionInquiry;
}

export default mongoose.models.SolutionInquiry ||
  mongoose.model<ISolutionInquiry>("SolutionInquiry", SolutionInquirySchema);
