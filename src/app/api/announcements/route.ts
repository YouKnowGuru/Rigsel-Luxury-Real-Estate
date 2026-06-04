import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Announcement from "@/models/Announcement";

export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const category = searchParams.get("category");
        const priority = searchParams.get("priority");
        const search = searchParams.get("search");
        const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
        const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "12", 10)));

        const now = new Date();

        // Build query using MongoDB aggregation for maximum flexibility
        const matchStage: Record<string, unknown> = {
            isPublished: true,
        };

        // Handle expiry: include if expiresAt is null, undefined, missing, or in the future
        matchStage.$expr = {
            $or: [
                { $eq: ["$expiresAt", null] },
                { $not: { $ifNull: ["$expiresAt", false] } },
                { $gt: ["$expiresAt", now] },
            ],
        };

        if (category) matchStage.category = category;
        if (priority) matchStage.priority = priority;
        if (search && search.trim()) {
            const searchRegex = { $regex: search.trim(), $options: "i" };
            matchStage.$or = [
                { title: searchRegex },
                { summary: searchRegex },
                { content: searchRegex },
            ];
        }

        const skip = (page - 1) * limit;

        // Use aggregation pipeline for reliable querying
        const [results] = await Announcement.aggregate([
            { $match: matchStage },
            {
                $facet: {
                    data: [
                        { $sort: { isPinned: -1, priority: -1, publishedAt: -1 } },
                        { $skip: skip },
                        { $limit: limit },
                        { $project: { __v: 0 } },
                    ],
                    total: [{ $count: "count" }],
                },
            },
        ]);

        const announcements = results.data || [];
        const total = results.total[0]?.count || 0;

        return NextResponse.json({
            success: true,
            data: announcements,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An error occurred";
        return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
    }
}
