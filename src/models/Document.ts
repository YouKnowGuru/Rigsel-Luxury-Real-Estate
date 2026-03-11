import mongoose, { Schema, Document } from "mongoose";

export interface IDocument extends Document {
    title: string;
    description: string;
    fileUrl: string;
    fileType: string;
    fileSize: string;
    downloadCount: number;
    createdAt: Date;
    updatedAt: Date;
}

const DocumentSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        fileUrl: { type: String, required: true },
        fileType: { type: String, required: true },
        fileSize: { type: String, required: true },
        downloadCount: { type: Number, default: 0 },
    },
    { timestamps: true }
);

export default mongoose.models.Document || mongoose.model<IDocument>("Document", DocumentSchema);
