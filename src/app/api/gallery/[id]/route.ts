import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Gallery from "@/models/Gallery";
import { verifyToken } from "@/lib/jwt";
import { getAdminToken } from "@/lib/auth";

// DELETE /api/gallery/[id] - Delete gallery image (Admin only)
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const token = await getAdminToken(request);
        if (!token) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const decoded = await verifyToken(token);
        if (!decoded) {
            return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 });
        }

        await connectDB();
        const item = await Gallery.findByIdAndDelete(id);

        if (!item) {
            return NextResponse.json(
                { success: false, error: "Image not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, message: "Image deleted successfully" });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An error occurred";
        return NextResponse.json(
            { success: false, error: errorMessage },
            { status: 500 }
        );
    }
}
