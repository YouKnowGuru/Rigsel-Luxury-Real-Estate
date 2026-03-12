import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Property from "@/models/Property";
import Contact from "@/models/Contact";
import { verifyToken } from "@/lib/jwt";

// GET /api/admin/stats/charts - Get monthly chart data
export async function GET(request: NextRequest) {
    try {
        const token = request.headers.get("authorization")?.split(" ")[1];
        if (!token) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const decoded = await verifyToken(token);
        if (!decoded) {
            return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 });
        }

        await connectDB();

        const now = new Date();
        const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);

        // Properties per month (last 12 months)
        const propertiesPerMonth = await Property.aggregate([
            {
                $match: { createdAt: { $gte: twelveMonthsAgo } },
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" },
                    },
                    count: { $sum: 1 },
                },
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } },
        ]);

        // Inquiries per month (last 12 months)
        const inquiriesPerMonth = await Contact.aggregate([
            {
                $match: { createdAt: { $gte: twelveMonthsAgo } },
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" },
                    },
                    count: { $sum: 1 },
                },
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } },
        ]);

        // Build months array for last 12 months with zero-fill
        const months = [];
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        for (let i = 11; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const year = d.getFullYear();
            const month = d.getMonth() + 1;

            const propData = propertiesPerMonth.find(
                (p) => p._id.year === year && p._id.month === month
            );
            const inqData = inquiriesPerMonth.find(
                (p) => p._id.year === year && p._id.month === month
            );

            months.push({
                name: monthNames[month - 1],
                properties: propData?.count || 0,
                inquiries: inqData?.count || 0,
            });
        }

        return NextResponse.json({ success: true, data: months });
    } catch (error: any) {
        console.error("Error fetching chart data:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
