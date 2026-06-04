import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Review from "@/models/Review";
import { verifyToken } from "@/lib/jwt";
import { getAdminToken } from "@/lib/auth";

// GET /api/admin/reviews - Get all reviews for moderation
export async function GET(request: NextRequest) {
    try {
        const token = await getAdminToken(request);
        const decoded = token ? await verifyToken(token) : null;
        if (!token || !decoded) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        const { searchParams } = new URL(request.url);
        const filter = searchParams.get("filter") || "all";

        let query: Record<string, unknown> = {};
        if (filter === "pending") query = { isApproved: false };
        if (filter === "approved") query = { isApproved: true };

        const reviews = await Review.find(query).sort({ createdAt: -1 }).lean();

        return NextResponse.json({
            success: true,
            data: reviews,
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An error occurred";
        return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
    }
}
