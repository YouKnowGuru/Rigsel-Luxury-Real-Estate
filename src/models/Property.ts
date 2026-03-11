import mongoose, { Schema, Document } from "mongoose";

export interface IProperty extends Document {
  title: string;
  price: number;
  location: string;
  district: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  propertyType: string;
  description: string;
  features: string[];
  images: string[];
  latitude: number;
  longitude: number;
  featured: boolean;
  loanAvailable: boolean;
  loanAmount: number;
  isSold: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PropertySchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Property title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    district: {
      type: String,
      required: [true, "District is required"],
      trim: true,
      enum: [
        "Bumthang",
        "Chhukha",
        "Dagana",
        "Gasa",
        "Haa",
        "Lhuentse",
        "Mongar",
        "Paro",
        "Pema Gatshel",
        "Punakha",
        "Samdrup Jongkhar",
        "Samtse",
        "Sarpang",
        "Thimphu",
        "Trashigang",
        "Trashi Yangtse",
        "Trongsa",
        "Tsirang",
        "Wangdue Phodrang",
        "Zhemgang",
      ],
    },
    bedrooms: {
      type: Number,
      min: [0, "Bedrooms cannot be negative"],
      default: 0,
    },
    bathrooms: {
      type: Number,
      min: [0, "Bathrooms cannot be negative"],
      default: 0,
    },
    area: {
      type: Number,
      required: [true, "Area is required"],
      min: [0, "Area cannot be negative"],
    },
    propertyType: {
      type: String,
      required: [true, "Property type is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      minlength: [50, "Description must be at least 50 characters"],
      maxlength: [5000, "Description cannot exceed 5000 characters"],
    },
    features: {
      type: [String],
      default: [],
    },
    images: {
      type: [String],
      required: [true, "At least one image is required"],
      validate: {
        validator: function (v: string[]) {
          return v.length > 0 && v.length <= 20;
        },
        message: "Images must be between 1 and 20",
      },
    },
    latitude: {
      type: Number,
      required: [true, "Latitude is required"],
      min: [-90, "Invalid latitude"],
      max: [90, "Invalid latitude"],
    },
    longitude: {
      type: Number,
      required: [true, "Longitude is required"],
      min: [-180, "Invalid longitude"],
      max: [180, "Invalid longitude"],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    loanAvailable: {
      type: Boolean,
      default: false,
    },
    loanAmount: {
      type: Number,
      default: 0,
    },
    isSold: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for better query performance
PropertySchema.index({ location: "text", title: "text", description: "text" });
PropertySchema.index({ district: 1 });
PropertySchema.index({ propertyType: 1 });
PropertySchema.index({ price: 1 });
PropertySchema.index({ featured: 1 });
PropertySchema.index({ createdAt: -1 });

// Virtual for formatted price
PropertySchema.virtual("formattedPrice").get(function (this: IProperty) {
  return `Nu. ${this.price.toLocaleString("en-IN")}`;
});

// Virtual for price per decimal (for land)
PropertySchema.virtual("pricePerDecimal").get(function (this: IProperty) {
  if (this.propertyType === "land" && this.area > 0) {
    return Math.round(this.price / (this.area / 40.47));
  }
  return null;
});

export default mongoose.models.Property ||
  mongoose.model<IProperty>("Property", PropertySchema);
