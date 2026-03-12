import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Review from "@/models/Review";
import { verifyToken } from "@/lib/jwt";

// GET /api/admin/reviews - Get all reviews for moderation
export async function GET(request: NextRequest) {
    try {
        const token = request.headers.get("authorization")?.split(" ")[1];
        const decoded = token ? await verifyToken(token) : null;
        if (!token || !decoded) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        const { searchParams } = new URL(request.url);
        const filter = searchParams.get("filter") || "all";

        let query = {};
        if (filter === "pending") query = { isApproved: false };
        if (filter === "approved") query = { isApproved: true };

        const reviews = await Review.find(query).sort({ createdAt: -1 }).lean();

        return NextResponse.json({
            success: true,
            data: reviews,
        });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
