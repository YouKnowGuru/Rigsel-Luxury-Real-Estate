import mongoose, { Schema, Document } from "mongoose";

export interface ITeamMember extends Document {
    name: string;
    role: string;
    image: string;
    desc: string;
    quote: string;
    order: number;
    createdAt: Date;
    updatedAt: Date;
}

const TeamMemberSchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
        },
        role: {
            type: String,
            required: [true, "Role is required"],
            trim: true,
        },
        image: {
            type: String,
            required: [true, "Image URL is required"],
        },
        desc: {
            type: String,
            required: [true, "Description is required"],
        },
        quote: {
            type: String,
            required: [true, "Quote is required"],
        },
        order: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

TeamMemberSchema.index({ order: 1 });

export default mongoose.models.TeamMember || mongoose.model<ITeamMember>("TeamMember", TeamMemberSchema);
