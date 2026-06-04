import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import connectDB from "@/lib/mongodb";
import SolutionInquiry from "@/models/SolutionInquiry";
import { getAdminToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const token = await getAdminToken(request);
    if (!token) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    const decoded = await verifyToken(token);
    if (!decoded) return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const serviceType = searchParams.get("serviceType");
    const unreadOnly = searchParams.get("unread") === "true";

    await connectDB();

    const query: Record<string, unknown> = {};
    if (status && status !== "all") query.status = status;
    if (serviceType && serviceType !== "all") query.serviceType = serviceType;
    if (unreadOnly) query.isRead = false;

    const inquiries = await SolutionInquiry.find(query)
      .sort({ createdAt: -1 })
      .select("-__v")
      .lean();

    const unreadCount = await SolutionInquiry.countDocuments({ isRead: false });

    return NextResponse.json({ success: true, data: inquiries, unreadCount });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An error occurred";
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
