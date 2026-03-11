import mongoose, { Schema, Document } from "mongoose";

export interface IGallery extends Document {
    title?: string;
    image: string;
    category: string;
    createdAt: Date;
    updatedAt: Date;
}

const GallerySchema: Schema = new Schema(
    {
        title: {
            type: String,
            trim: true,
        },
        image: {
            type: String,
            required: [true, "Image URL is required"],
        },
        category: {
            type: String,
            default: "All",
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

GallerySchema.index({ category: 1 });
GallerySchema.index({ createdAt: -1 });

export default mongoose.models.Gallery || mongoose.model<IGallery>("Gallery", GallerySchema);
