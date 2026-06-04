import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import connectDB from "@/lib/mongodb";
import Announcement from "@/models/Announcement";
import { announcementSchema } from "@/lib/validation";
import { getAdminToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
    try {
        const token = await getAdminToken(request);
        if (!token) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        const decoded = await verifyToken(token);
        if (!decoded) return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 });

        const { searchParams } = new URL(request.url);
        const status = searchParams.get("status"); // all | published | drafts | expired | pinned
        const search = searchParams.get("search");
        const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
        const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));

        await connectDB();

        const query: Record<string, unknown> = {};
        const now = new Date();

        if (status === "published") {
            query.isPublished = true;
            query.publishedAt = { $lte: now };
            query.$or = [
                { expiresAt: { $exists: false } },
                { expiresAt: null },
                { expiresAt: { $gt: now } },
            ];
        } else if (status === "drafts") {
            query.isPublished = false;
        } else if (status === "expired") {
            query.expiresAt = { $lte: now };
        } else if (status === "pinned") {
            query.isPinned = true;
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { summary: { $regex: search, $options: "i" } },
                { content: { $regex: search, $options: "i" } },
            ];
        }

        const skip = (page - 1) * limit;

        const [announcements, total] = await Promise.all([
            Announcement.find(query)
                .sort({ isPinned: -1, priority: -1, publishedAt: -1 })
                .skip(skip)
                .limit(limit)
                .select("-__v")
                .lean(),
            Announcement.countDocuments(query),
        ]);

        return NextResponse.json({
            success: true,
            data: announcements,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An error occurred";
        return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const token = await getAdminToken(request);
        if (!token) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const decoded = await verifyToken(token);
        if (!decoded) {
            return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 });
        }

        const body = await request.json();

        // Validate with Zod
        const validationResult = announcementSchema.safeParse(body);
        if (!validationResult.success) {
            return NextResponse.json(
                { success: false, error: "Validation failed", details: validationResult.error.format() },
                { status: 400 }
            );
        }

        const data = validationResult.data;

        const announcementData: Record<string, unknown> = {
            title: data.title,
            content: data.content,
            summary: data.summary,
            category: data.category,
            priority: data.priority,
            isPinned: data.isPinned,
            isPublished: data.isPublished,
            author: data.author,
        };

        if (data.publishedAt) {
            announcementData.publishedAt = new Date(data.publishedAt);
        }
        if (data.expiresAt) {
            announcementData.expiresAt = new Date(data.expiresAt);
        }
        if (data.coverImage) {
            announcementData.coverImage = data.coverImage;
        }

        const announcement = await Announcement.create(announcementData);
        return NextResponse.json({ success: true, data: announcement });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An error occurred";
        return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
    }
}
