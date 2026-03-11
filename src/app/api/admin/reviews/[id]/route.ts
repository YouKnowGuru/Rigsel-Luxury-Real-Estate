import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Review from "@/models/Review";
import { verifyToken } from "@/lib/jwt";

// PATCH /api/admin/reviews/[id] - Update review status (Approve/Reject)
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const token = request.headers.get("authorization")?.split(" ")[1];
        if (!token || !verifyToken(token)) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();
        const body = await request.json();

        const review = await Review.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        });

        if (!review) {
            return NextResponse.json({ success: false, error: "Review not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            data: review,
        });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// DELETE /api/admin/reviews/[id] - Delete a review
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const token = request.headers.get("authorization")?.split(" ")[1];
        if (!token || !verifyToken(token)) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();
        const review = await Review.findByIdAndDelete(id);

        if (!review) {
            return NextResponse.json({ success: false, error: "Review not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: "Review deleted successfully",
        });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
