import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import connectDB from "@/lib/mongodb";
import SolutionInquiry from "@/models/SolutionInquiry";
import { SOLUTION_INQUIRY_STATUSES } from "@/lib/solution-types";
import { getAdminToken } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = await getAdminToken(request);
    if (!token) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    const decoded = await verifyToken(token);
    if (!decoded) return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 });

    const { id } = await params;
    await connectDB();
    const inquiry = await SolutionInquiry.findById(id).select("-__v").lean();

    if (!inquiry) {
      return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: inquiry });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An error occurred";
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = await getAdminToken(request);
    if (!token) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    const decoded = await verifyToken(token);
    if (!decoded) return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 });

    const { id } = await params;
    const body = await request.json();
    await connectDB();

    const updateData: Record<string, unknown> = {};
    if (typeof body.isRead === "boolean") updateData.isRead = body.isRead;
    if (body.status && SOLUTION_INQUIRY_STATUSES.includes(body.status)) {
      updateData.status = body.status;
    }
    if (typeof body.adminNotes === "string") {
      updateData.adminNotes = body.adminNotes.slice(0, 2000);
    }

    const inquiry = await SolutionInquiry.findByIdAndUpdate(id, updateData, { new: true });

    if (!inquiry) {
      return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: inquiry });
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
    const token = await getAdminToken(request);
    if (!token) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    const decoded = await verifyToken(token);
    if (!decoded) return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 });

    const { id } = await params;
    await connectDB();
    const inquiry = await SolutionInquiry.findByIdAndDelete(id);

    if (!inquiry) {
      return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Deleted" });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An error occurred";
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
