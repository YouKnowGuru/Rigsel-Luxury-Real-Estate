import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import PropertyType from "@/models/PropertyType";
import { verifyToken } from "@/lib/jwt";

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
        const updated = await PropertyType.findByIdAndUpdate(id, body, { new: true });
        return NextResponse.json({ success: true, data: updated });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

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
        await PropertyType.findByIdAndDelete(id);
        return NextResponse.json({ success: true, message: "Type deleted" });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
