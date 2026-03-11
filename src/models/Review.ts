import mongoose, { Schema, Document } from "mongoose";

export interface IReview extends Document {
    name: string;
    role: string;
    content: string;
    avatar: string;
    rating: number;
    location: string;
    isApproved: boolean;
    isRead: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const ReviewSchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            maxlength: [100, "Name cannot exceed 100 characters"],
        },
        role: {
            type: String,
            required: [true, "Role is required"],
            trim: true,
            maxlength: [100, "Role cannot exceed 100 characters"],
        },
        content: {
            type: String,
            required: [true, "Content is required"],
            minlength: [10, "Review must be at least 10 characters"],
            maxlength: [2000, "Review cannot exceed 2000 characters"],
        },
        avatar: {
            type: String,
            default: "https://res.cloudinary.com/dzv5z8zjv/image/upload/v1700000000/default-avatar_u9z5zb.png", // Generic placeholder or null
        },
        rating: {
            type: Number,
            required: [true, "Rating is required"],
            min: [1, "Rating must be at least 1"],
            max: [5, "Rating must be at most 5"],
            default: 5,
        },
        location: {
            type: String,
            required: [true, "Location is required"],
            trim: true,
        },
        isApproved: {
            type: Boolean,
            default: false,
        },
        isRead: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes
ReviewSchema.index({ isApproved: 1 });
ReviewSchema.index({ createdAt: -1 });

export default mongoose.models.Review ||
    mongoose.model<IReview>("Review", ReviewSchema);
