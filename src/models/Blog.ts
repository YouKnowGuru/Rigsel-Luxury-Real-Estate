import mongoose, { Schema, Document } from "mongoose";

export interface IBlog extends Document {
    title: string;
    slug: string;
    content: string;
    coverImage: string;
    author: string;
    tags: string[];
    published: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const BlogSchema: Schema = new Schema(
    {
        title: {
            type: String,
            required: [true, "Blog title is required"],
            trim: true,
            maxlength: [200, "Title cannot exceed 200 characters"],
        },
        slug: {
            type: String,
            required: [true, "Slug is required"],
            unique: true,
            trim: true,
            lowercase: true,
        },
        content: {
            type: String,
            required: [true, "Content is required"],
        },
        coverImage: {
            type: String,
            required: [true, "Cover image is required"],
        },
        author: {
            type: String,
            default: "Admin",
        },
        tags: {
            type: [String],
            default: [],
        },
        published: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes for better search performance
BlogSchema.index({ title: "text", content: "text" });
BlogSchema.index({ slug: 1 });
BlogSchema.index({ published: 1 });
BlogSchema.index({ createdAt: -1 });

export default mongoose.models.Blog || mongoose.model<IBlog>("Blog", BlogSchema);
