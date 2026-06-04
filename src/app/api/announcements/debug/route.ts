import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Announcement from "@/models/Announcement";

export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const now = new Date();

        // Get ALL announcements (no filters)
        const all = await Announcement.find().select("-__v").lean();

        // Get counts for different conditions
        const totalCount = await Announcement.countDocuments();
        const publishedCount = await Announcement.countDocuments({ isPublished: true });
        const publishedAndDateOk = await Announcement.countDocuments({
            isPublished: true,
            publishedAt: { $lte: now },
        });

        // Test the $expr query
        const exprQuery = {
            isPublished: true,
            publishedAt: { $lte: now },
            $expr: {
                $or: [
                    { $eq: ["$expiresAt", null] },
                    { $not: { $ifNull: ["$expiresAt", false] } },
                    { $gt: ["$expiresAt", now] },
                ],
            },
        };
        const exprCount = await Announcement.countDocuments(exprQuery);

        // Test aggregation
        const [aggResult] = await Announcement.aggregate([
            { $match: exprQuery },
            {
                $facet: {
                    data: [{ $limit: 10 }],
                    total: [{ $count: "count" }],
                },
            },
        ]);

        return NextResponse.json({
            success: true,
            debug: {
                now: now.toISOString(),
                counts: {
                    total: totalCount,
                    published: publishedCount,
                    publishedAndDateOk,
                    exprQuery: exprCount,
                    aggregation: aggResult.total[0]?.count || 0,
                },
                allAnnouncements: all.map((a: any) => ({
                    _id: a._id.toString(),
                    title: a.title,
                    isPublished: a.isPublished,
                    publishedAt: a.publishedAt,
                    expiresAt: a.expiresAt,
                    priority: a.priority,
                    category: a.category,
                    isPinned: a.isPinned,
                    author: a.author,
                    viewCount: a.viewCount,
                })),
            },
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An error occurred";
        console.error("[Debug API] Error:", errorMessage);
        return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
    }
}
