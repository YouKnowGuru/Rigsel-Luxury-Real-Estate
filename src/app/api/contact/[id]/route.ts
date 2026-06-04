import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Contact from "@/models/Contact";
import { verifyToken } from "@/lib/jwt";
import { getAdminToken } from "@/lib/auth";

// GET /api/contact/[id] - Get single message
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = await getAdminToken(request);
    if (!token) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const decoded = await verifyToken(token);
    if (!decoded) return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 });

    await connectDB();
    const inquiry = await Contact.findById(id).populate("propertyId", "title slug images");
    if (!inquiry) return NextResponse.json({ success: false, error: "Inquiry not found" }, { status: 404 });

    return NextResponse.json({ success: true, data: inquiry });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An error occurred";
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}

// PATCH /api/contact/[id] - Update message (isRead, etc)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = await getAdminToken(request);
    if (!token) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const decoded = await verifyToken(token);
    if (!decoded) return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 });

    await connectDB();
    const body = await request.json();

    // Only allow specific fields to be updated
    const allowedUpdates: Record<string, unknown> = {};
    if (typeof body.isRead === "boolean") allowedUpdates.isRead = body.isRead;
    if (typeof body.isReplied === "boolean") allowedUpdates.isReplied = body.isReplied;

    const inquiry = await Contact.findByIdAndUpdate(id, { $set: allowedUpdates }, { new: true });

    if (!inquiry) return NextResponse.json({ success: false, error: "Inquiry not found" }, { status: 404 });

    return NextResponse.json({ success: true, data: inquiry });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An error occurred";
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}

// DELETE /api/contact/[id] - Delete message
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = await getAdminToken(request);
    if (!token) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const decoded = await verifyToken(token);
    if (!decoded) return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 });

    await connectDB();
    await Contact.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: "Inquiry deleted successfully" });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An error occurred";
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
