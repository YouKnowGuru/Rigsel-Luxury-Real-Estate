import mongoose, { Schema, Document } from "mongoose";

export interface IChat extends Document {
  propertyId: mongoose.Types.ObjectId;
  guestName: string;
  guestEmail: string;
  status: "active" | "closed";
  lastMessageAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ChatSchema: Schema = new Schema(
  {
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
    guestName: {
      type: String,
      required: true,
      trim: true,
    },
    guestEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    status: {
      type: String,
      enum: ["active", "closed"],
      default: "active",
    },
    lastMessageAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
ChatSchema.index({ propertyId: 1, guestEmail: 1 });
ChatSchema.index({ status: 1 });
ChatSchema.index({ lastMessageAt: -1 });

export default mongoose.models.Chat || mongoose.model<IChat>("Chat", ChatSchema);
