import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Review from "@/models/Review";
import { verifyToken } from "@/lib/jwt";
import { getAdminToken } from "@/lib/auth";

// PATCH /api/admin/reviews/[id] - Update review status (Approve/Reject)
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const token = await getAdminToken(request);
        const decoded = token ? await verifyToken(token) : null;
        if (!token || !decoded) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();
        const body = await request.json();

        // Only allow specific fields to be updated
        const allowedUpdates: Record<string, unknown> = {};
        if (typeof body.isApproved === "boolean") allowedUpdates.isApproved = body.isApproved;
        if (typeof body.isRead === "boolean") allowedUpdates.isRead = body.isRead;

        const review = await Review.findByIdAndUpdate(id, { $set: allowedUpdates }, {
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
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An error occurred";
        return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
    }
}

// DELETE /api/admin/reviews/[id] - Delete a review
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const token = await getAdminToken(request);
        const decoded = token ? await verifyToken(token) : null;
        if (!token || !decoded) {
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
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An error occurred";
        return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
    }
}
