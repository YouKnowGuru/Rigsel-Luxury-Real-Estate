import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import connectDB from "@/lib/mongodb";
import SolutionProject from "@/models/SolutionProject";
import { solutionProjectSchema } from "@/lib/validation";
import { getAdminToken } from "@/lib/auth";
import { slugify } from "@/lib/slug";

async function ensureUniqueSlug(base: string, excludeId?: string): Promise<string> {
  let slug = slugify(base);
  let n = 0;
  while (true) {
    const candidate = n === 0 ? slug : `${slug}-${n}`;
    const exists = await SolutionProject.findOne({
      slug: candidate,
      ...(excludeId ? { _id: { $ne: excludeId } } : {}),
    });
    if (!exists) return candidate;
    n++;
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = await getAdminToken(request);
    if (!token) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    const decoded = await verifyToken(token);
    if (!decoded) return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const serviceType = searchParams.get("serviceType");
    const search = searchParams.get("search");

    await connectDB();

    const query: Record<string, unknown> = {};
    if (status === "published") query.isPublished = true;
    else if (status === "drafts") query.isPublished = false;
    else if (status === "featured") query.isFeatured = true;
    if (serviceType && serviceType !== "all") query.serviceType = serviceType;

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { summary: { $regex: search, $options: "i" } },
      ];
    }

    const projects = await SolutionProject.find(query)
      .sort({ order: -1, isPinned: -1, publishedAt: -1 })
      .select("-__v")
      .lean();

    return NextResponse.json({ success: true, data: projects });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An error occurred";
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = await getAdminToken(request);
    if (!token) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    const decoded = await verifyToken(token);
    if (!decoded) return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 });

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

    const slug = data.slug
      ? slugify(data.slug)
      : await ensureUniqueSlug(data.title);

    const project = await SolutionProject.create({
      ...data,
      slug,
      coverImage: data.coverImage || "",
      projectUrl: data.projectUrl || "",
      demoUrl: data.demoUrl || "",
      publishedAt: data.publishedAt ? new Date(data.publishedAt) : new Date(),
    });

    return NextResponse.json({ success: true, data: project });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An error occurred";
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
