import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Gallery from "@/models/Gallery";
import { verifyToken } from "@/lib/jwt";
import { gallerySchema } from "@/lib/validation";
import { checkRateLimit, getClientIP } from "@/lib/rate-limit";
import { getAdminToken } from "@/lib/auth";

// GET /api/gallery - Fetch all gallery images
export async function GET(request: NextRequest) {
    try {
        // Rate limit public reads
        const clientIP = getClientIP(request);
        const rateLimit = await checkRateLimit(`gallery_get_${clientIP}`, 60, 60 * 1000);
        if (!rateLimit.success) {
            return NextResponse.json(
                { success: false, error: "Rate limit exceeded. Please try again later." },
                { status: 429 }
            );
        }

        await connectDB();
        const { searchParams } = new URL(request.url);
        const category = searchParams.get("category");

        const query: Record<string, unknown> = {};
        if (category && category !== "All") {
            query.category = category;
        }

        const items = await Gallery.find(query).sort({ createdAt: -1 }).lean();

        return NextResponse.json({ success: true, data: items });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An error occurred";
        return NextResponse.json(
            { success: false, error: errorMessage },
            { status: 500 }
        );
    }
}

// POST /api/gallery - Upload new gallery image (Admin only)
export async function POST(request: NextRequest) {
    try {
        const token = await getAdminToken(request);
        if (!token) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const decoded = await verifyToken(token);
        if (!decoded) {
            return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 });
        }

        await connectDB();
        const body = await request.json();

        // Validate with Zod
        const validationResult = gallerySchema.safeParse(body);
        if (!validationResult.success) {
            return NextResponse.json(
                { success: false, error: "Validation failed", details: validationResult.error.format() },
                { status: 400 }
            );
        }

        const item = await Gallery.create(validationResult.data);

        return NextResponse.json({ success: true, data: item }, { status: 201 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An error occurred";
        return NextResponse.json(
            { success: false, error: errorMessage },
            { status: 500 }
        );
    }
}
