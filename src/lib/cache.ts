import { cache } from "react";
import connectDB from "./mongodb";
import Property from "@/models/Property";
import PropertyType from "@/models/PropertyType";

/**
 * Cached database queries using React.cache()
 * These are deduplicated within a single request
 */

export const getProperties = cache(async (query: Record<string, unknown> = {}, 
  sortBy: string = "createdAt", 
  sortOrder: number = -1,
  limit: number = 20,
  skip: number = 0
) => {
  await connectDB();
  const sortObj: Record<string, 1 | -1> = { [sortBy]: sortOrder as 1 | -1 };
  return Property.find(query)
    .sort(sortObj)
    .skip(skip)
    .limit(limit)
    .lean();
});

export const getPropertyCount = cache(async (query: Record<string, unknown> = {}) => {
  await connectDB();
  return Property.countDocuments(query);
});

export const getFeaturedProperties = cache(async (limit: number = 6) => {
  await connectDB();
  return Property.find({ featured: true })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
});

export const getLatestProperties = cache(async (limit: number = 6) => {
  await connectDB();
  return Property.find({})
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
});

export const getPropertyById = cache(async (id: string) => {
  await connectDB();
  return Property.findById(id).lean();
});

export const getPropertyTypes = cache(async () => {
  await connectDB();
  return PropertyType.find({}).sort({ name: 1 }).lean();
});
