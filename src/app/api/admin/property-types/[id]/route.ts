import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import PropertyType from "@/models/PropertyType";
import { verifyToken } from "@/lib/jwt";
import { propertyTypeSchema } from "@/lib/validation";
import { getAdminToken } from "@/lib/auth";

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

        // Validate with Zod (partial)
        const validationResult = propertyTypeSchema.partial().safeParse(body);
        if (!validationResult.success) {
            return NextResponse.json(
                { success: false, error: "Validation failed", details: validationResult.error.format() },
                { status: 400 }
            );
        }

        const updated = await PropertyType.findByIdAndUpdate(id, validationResult.data, { new: true });
        return NextResponse.json({ success: true, data: updated });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An error occurred";
        return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
    }
}

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
        await PropertyType.findByIdAndDelete(id);
        return NextResponse.json({ success: true, message: "Type deleted" });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An error occurred";
        return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
    }
}
