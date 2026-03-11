import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Gallery from "@/models/Gallery";
import { verifyToken } from "@/lib/jwt";

// GET /api/gallery - Fetch all gallery images
export async function GET(request: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const category = searchParams.get("category");

        const query: any = {};
        if (category && category !== "All") {
            query.category = category;
        }

        const items = await Gallery.find(query).sort({ createdAt: -1 }).lean();

        return NextResponse.json({ success: true, data: items });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

// POST /api/gallery - Upload new gallery image (Admin only)
export async function POST(request: NextRequest) {
    try {
        const token = request.headers.get("authorization")?.split(" ")[1];
        if (!token) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const decoded = verifyToken(token);
        if (!decoded) {
            return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 });
        }

        await connectDB();
        const body = await request.json();

        if (!body.image) {
            return NextResponse.json(
                { success: false, error: "Image URL is required" },
                { status: 400 }
            );
        }

        const item = await Gallery.create(body);

        return NextResponse.json({ success: true, data: item }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
