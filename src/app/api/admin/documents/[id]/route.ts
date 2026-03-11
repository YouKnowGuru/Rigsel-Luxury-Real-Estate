import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import connectDB from "@/lib/mongodb";
import Document from "@/models/Document";

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const token = request.headers.get("authorization")?.split(" ")[1];
        if (!token) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        const decoded = verifyToken(token);
        if (!decoded) return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 });

        // Await params for Next.js 15+ compatibility
        const { id } = await params;

        await connectDB();
        const document = await Document.findByIdAndDelete(id);

        if (!document) {
            return NextResponse.json({ success: false, error: "Document not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Document deleted" });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
