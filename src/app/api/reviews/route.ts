import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Review from "@/models/Review";

// GET /api/reviews - Get approved reviews for homepage
export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const reviews = await Review.find({ isApproved: true })
            .sort({ createdAt: -1 })
            .limit(10)
            .lean();

        return NextResponse.json({
            success: true,
            data: reviews,
        });
    } catch (error: any) {
        console.error("Error fetching reviews:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

// POST /api/reviews - Submit a new review
export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const body = await request.json();

        const review = await Review.create({
            ...body,
            isApproved: false, // Always requires moderation
            isRead: false,
        });

        return NextResponse.json(
            {
                success: true,
                message: "Thank you! Your review has been submitted for approval.",
                data: review,
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("Error submitting review:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
