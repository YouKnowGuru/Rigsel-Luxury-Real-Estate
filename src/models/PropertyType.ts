import mongoose, { Schema, Document } from "mongoose";

export interface IPropertyType extends Document {
    name: string;
    slug: string;
    requiresBedBath: boolean;
    areaLabel: string;
    createdAt: Date;
    updatedAt: Date;
}

const PropertyTypeSchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Property type name is required"],
            unique: true,
            trim: true,
        },
        slug: {
            type: String,
            required: [true, "Slug is required"],
            unique: true,
            lowercase: true,
            trim: true,
        },
        requiresBedBath: {
            type: Boolean,
            default: true,
        },
        areaLabel: {
            type: String,
            default: "Area (m²)",
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.PropertyType ||
    mongoose.model<IPropertyType>("PropertyType", PropertyTypeSchema);
