import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Property from "@/models/Property";
import Contact from "@/models/Contact";
import { verifyToken } from "@/lib/jwt";

// GET /api/admin/stats - Get dashboard statistics (Admin only)
export async function GET(request: NextRequest) {
  try {
    // Verify admin token
    const token = request.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: "Invalid token" },
        { status: 401 }
      );
    }

    await connectDB();

    // Get counts
    const totalProperties = await Property.countDocuments();
    const totalInquiries = await Contact.countDocuments();
    const featuredProperties = await Property.countDocuments({ featured: true });
    
    // Get recent listings (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentListings = await Property.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
    });

    // Get unread inquiries
    const unreadInquiries = await Contact.countDocuments({ isRead: false });

    // Get recent properties
    const recentProperties = await Property.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    // Get recent inquiries
    const recentInquiries = await Contact.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    return NextResponse.json({
      success: true,
      data: {
        totalProperties,
        totalInquiries,
        featuredProperties,
        recentListings,
        unreadInquiries,
        recentProperties,
        recentInquiries,
      },
    });
  } catch (error: any) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
