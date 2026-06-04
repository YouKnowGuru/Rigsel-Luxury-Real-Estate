import mongoose, { Schema, Document } from "mongoose";

export interface IAnnouncement extends Document {
    title: string;
    content: string;
    summary: string;
    category: string;
    priority: "low" | "normal" | "high" | "urgent";
    isPinned: boolean;
    isPublished: boolean;
    publishedAt: Date;
    expiresAt?: Date;
    coverImage?: string;
    author: string;
    viewCount: number;
    createdAt: Date;
    updatedAt: Date;
}

const AnnouncementSchema: Schema = new Schema(
    {
        title: { type: String, required: true, index: true },
        content: { type: String, required: true },
        summary: { type: String, required: true },
        category: { type: String, required: true, default: "General", index: true },
        priority: { type: String, enum: ["low", "normal", "high", "urgent"], default: "normal", index: true },
        isPinned: { type: Boolean, default: false, index: true },
        isPublished: { type: Boolean, default: false, index: true },
        publishedAt: { type: Date, default: Date.now, index: true },
        expiresAt: { type: Date, default: null, index: true },
        coverImage: { type: String, default: "" },
        author: { type: String, required: true, default: "Admin" },
        viewCount: { type: Number, default: 0 },
    },
    { timestamps: true }
);

// Compound index for public queries: pinned first, then priority, then published date
AnnouncementSchema.index({ isPinned: -1, priority: -1, publishedAt: -1 });

// Auto-generate summary from content if not provided
AnnouncementSchema.pre("save", function (next) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const announcement = this as any;
    if (!announcement.summary || announcement.summary.trim() === "") {
        // Strip HTML tags and take first 200 chars
        const plainText = (announcement.content || "")
            .replace(/<[^>]*>/g, " ")
            .replace(/\s+/g, " ")
            .trim();
        announcement.summary = plainText.length > 200
            ? plainText.substring(0, 200) + "..."
            : plainText;
    }
    next();
});

// Only force re-registration in development
if (process.env.NODE_ENV === "development") {
    delete mongoose.models.Announcement;
}

export default mongoose.models.Announcement || mongoose.model<IAnnouncement>("Announcement", AnnouncementSchema);
