import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import ArchitectureDesign from "@/models/ArchitectureDesign";
import mongoose from "mongoose";
import { checkRateLimit, getClientIP } from "@/lib/rate-limit";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const clientIP = getClientIP(request);
    const rateLimit = await checkRateLimit(
      `architecture_design_one_${clientIP}`,
      120,
      60 * 1000
    );
    if (!rateLimit.success) {
      return NextResponse.json(
        { success: false, error: "Rate limit exceeded" },
        { status: 429 }
      );
    }

    const { id } = await params;
    await connectDB();

    const query = mongoose.Types.ObjectId.isValid(id)
      ? { _id: id, isPublished: true }
      : { slug: id, isPublished: true };

    const design = await ArchitectureDesign.findOne(query).select("-__v").lean();

    if (!design) {
      return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: design });
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
    const { id } = await params;
    const body = await request.json();

    if (body.action !== "incrementView") {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    await connectDB();

    const query = mongoose.Types.ObjectId.isValid(id)
      ? { _id: id, isPublished: true }
      : { slug: id, isPublished: true };

    const design = await ArchitectureDesign.findOneAndUpdate(
      query,
      { $inc: { viewCount: 1 } },
      { new: true }
    ).select("viewCount");

    if (!design) {
      return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: design });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An error occurred";
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
