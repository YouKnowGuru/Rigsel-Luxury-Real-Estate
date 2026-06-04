import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import SolutionProject from "@/models/SolutionProject";
import { checkRateLimit, getClientIP } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  try {
    const clientIP = getClientIP(request);
    const rateLimit = await checkRateLimit(
      `phojaa95_solutions_get_${clientIP}`,
      60,
      60 * 1000
    );
    if (!rateLimit.success) {
      return NextResponse.json(
        { success: false, error: "Rate limit exceeded" },
        { status: 429 }
      );
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const serviceType = searchParams.get("serviceType");
    const featured = searchParams.get("featured");
    const search = searchParams.get("search");
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "12", 10)));

    const query: Record<string, unknown> = { isPublished: true };
    if (serviceType && serviceType !== "all") query.serviceType = serviceType;
    if (featured === "true") query.isFeatured = true;
    if (search?.trim()) {
      const re = { $regex: search.trim(), $options: "i" };
      query.$or = [{ title: re }, { summary: re }, { technologies: re }];
    }

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      SolutionProject.find(query)
        .sort({ isPinned: -1, order: -1, publishedAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("-__v")
        .lean(),
      SolutionProject.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      data,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An error occurred";
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
