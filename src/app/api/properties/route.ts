import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Property from "@/models/Property";
import { verifyToken } from "@/lib/jwt";
import { propertySchema } from "@/lib/validation";
import { checkRateLimit, getClientIP } from "@/lib/rate-limit";
import { getAdminToken } from "@/lib/auth";
import { getProperties, getPropertyCount } from "@/lib/cache";

// GET /api/properties - Get all properties
export async function GET(request: NextRequest) {
  try {
    // Rate limit public reads
    const clientIP = getClientIP(request);
    const rateLimit = await checkRateLimit(`properties_get_${clientIP}`, 60, 60 * 1000);
    if (!rateLimit.success) {
      return NextResponse.json(
        { success: false, error: "Rate limit exceeded. Please try again later." },
        { status: 429 }
      );
    }

    await connectDB();

    const { searchParams } = new URL(request.url);

    // Build query
    const query: Record<string, unknown> = {};

    // Filter by district
    const district = searchParams.get("district");
    if (district && district !== "All Districts") {
      query.district = district;
    }

    // Filter by property type
    const propertyType = searchParams.get("propertyType");
    if (propertyType) {
      query.propertyType = propertyType.toLowerCase();
    }

    // Filter by price range
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) (query.price as Record<string, number>).$gte = Number(minPrice);
      if (maxPrice && Number(maxPrice) > 0) (query.price as Record<string, number>).$lte = Number(maxPrice);
    }

    // Filter by bedrooms
    const bedrooms = searchParams.get("bedrooms");
    if (bedrooms && Number(bedrooms) > 0) {
      query.bedrooms = { $gte: Number(bedrooms) };
    }

    // Filter by bathrooms
    const bathrooms = searchParams.get("bathrooms");
    if (bathrooms && Number(bathrooms) > 0) {
      query.bathrooms = { $gte: Number(bathrooms) };
    }

    // Filter by featured
    const featured = searchParams.get("featured");
    if (featured === "true") {
      query.featured = true;
    }

    // Search by text
    const search = searchParams.get("search");
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { district: { $regex: search, $options: "i" } },
      ];
    }

    // Pagination
    const page = Number(searchParams.get("page")) || 1;
    const limit = Math.min(Number(searchParams.get("limit")) || 20, 1000); // Max 1000
    const skip = (page - 1) * limit;

    // Sort
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") === "asc" ? 1 : -1;

    // Use cached queries for deduplication within the same request
    const [properties, total] = await Promise.all([
      getProperties(query, sortBy, sortOrder, limit, skip),
      getPropertyCount(query),
    ]);

    return NextResponse.json({
      success: true,
      data: properties,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An error occurred";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

// POST /api/properties - Create new property (Admin only)
export async function POST(request: NextRequest) {
  try {
    // Verify admin token
    const token = await getAdminToken(request);
    if (!token) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: "Invalid token" },
        { status: 401 }
      );
    }

    await connectDB();

    const body = await request.json();

    // Validate with Zod
    const validationResult = propertySchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: validationResult.error.format() },
        { status: 400 }
      );
    }

    const property = await Property.create(validationResult.data);

    return NextResponse.json(
      { success: true, data: property },
      { status: 201 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An error occurred";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
