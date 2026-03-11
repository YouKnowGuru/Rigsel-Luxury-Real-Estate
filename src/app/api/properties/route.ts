import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Property from "@/models/Property";
import { verifyToken } from "@/lib/jwt";

// GET /api/properties - Get all properties
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    
    // Build query
    const query: any = {};
    
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
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice && Number(maxPrice) > 0) query.price.$lte = Number(maxPrice);
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
      query.$text = { $search: search };
    }

    // Pagination
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 20;
    const skip = (page - 1) * limit;

    // Sort
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") === "asc" ? 1 : -1;

    const properties = await Property.find(query)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Property.countDocuments(query);

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
  } catch (error: any) {
    console.error("Error fetching properties:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/properties - Create new property (Admin only)
export async function POST(request: NextRequest) {
  try {
    // Verify admin token
    const token = request.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: "Invalid token" },
        { status: 401 }
      );
    }

    await connectDB();

    const body = await request.json();
    
    // Validate required fields
    const requiredFields = [
      "title",
      "price",
      "location",
      "district",
      "area",
      "propertyType",
      "description",
      "images",
    ];
    
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    const property = await Property.create(body);

    return NextResponse.json(
      { success: true, data: property },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating property:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
