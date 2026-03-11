import mongoose, { Schema, Document } from "mongoose";

export interface IDocument extends Document {
    title: string;
    description: string;
    fileUrl?: string;
    fileContent?: Buffer;
    fileType: string;
    contentType: string;
    fileSize: string;
    downloadCount: number;
    createdAt: Date;
    updatedAt: Date;
}

console.log(">>> [Model:Document] Defining Schema");

const DocumentSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        fileUrl: { type: String, default: "" },
        fileContent: { type: Buffer },
        fileType: { type: String, required: true },
        contentType: { type: String, required: true },
        fileSize: { type: String, required: true },
        downloadCount: { type: Number, default: 0 },
    },
    { timestamps: true }
);

// Force re-registration of the model in development to pick up schema changes
if (process.env.NODE_ENV === "development") {
    delete mongoose.models.Document;
}

export default mongoose.models.Document || mongoose.model<IDocument>("Document", DocumentSchema);
