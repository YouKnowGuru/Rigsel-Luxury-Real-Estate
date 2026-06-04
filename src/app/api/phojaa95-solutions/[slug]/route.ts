import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import SolutionProject from "@/models/SolutionProject";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    await connectDB();

    const project = await SolutionProject.findOne({
      slug: slug.toLowerCase(),
      isPublished: true,
    })
      .select("-__v")
      .lean();

    if (!project) {
      return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: project });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An error occurred";
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();

    if (body.action !== "incrementView") {
      return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
    }

    await connectDB();
    const project = await SolutionProject.findOneAndUpdate(
      { slug: slug.toLowerCase(), isPublished: true },
      { $inc: { viewCount: 1 } },
      { new: true }
    ).select("-__v");

    if (!project) {
      return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: project });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An error occurred";
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
