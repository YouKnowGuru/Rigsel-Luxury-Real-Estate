import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import connectDB from "@/lib/mongodb";
import SolutionProject from "@/models/SolutionProject";
import { solutionProjectSchema } from "@/lib/validation";
import { getAdminToken } from "@/lib/auth";
import { slugify } from "@/lib/slug";

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
    const project = await SolutionProject.findById(id).select("-__v").lean();

    if (!project) {
      return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: project });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An error occurred";
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}

export async function PUT(
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
    const validationResult = solutionProjectSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: validationResult.error.format() },
        { status: 400 }
      );
    }

    const data = validationResult.data;
    await connectDB();

    const updateData: Record<string, unknown> = { ...data };
    if (data.slug) updateData.slug = slugify(data.slug);
    if (data.publishedAt) updateData.publishedAt = new Date(data.publishedAt);
    updateData.coverImage = data.coverImage || "";
    updateData.projectUrl = data.projectUrl || "";
    updateData.demoUrl = data.demoUrl || "";

    const project = await SolutionProject.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!project) {
      return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: project });
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
    if (typeof body.isPinned === "boolean") updateData.isPinned = body.isPinned;
    if (typeof body.isPublished === "boolean") updateData.isPublished = body.isPublished;
    if (typeof body.isFeatured === "boolean") updateData.isFeatured = body.isFeatured;

    const project = await SolutionProject.findByIdAndUpdate(id, updateData, { new: true });

    if (!project) {
      return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: project });
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
    const project = await SolutionProject.findByIdAndDelete(id);

    if (!project) {
      return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Deleted" });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An error occurred";
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
