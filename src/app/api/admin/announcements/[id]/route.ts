import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import connectDB from "@/lib/mongodb";
import Announcement from "@/models/Announcement";
import { announcementSchema } from "@/lib/validation";
import { getAdminToken } from "@/lib/auth";

// GET single announcement (admin)
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
        const announcement = await Announcement.findById(id).select("-__v").lean();

        if (!announcement) {
            return NextResponse.json({ success: false, error: "Announcement not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: announcement });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An error occurred";
        return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
    }
}

// PUT - full update
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

        const validationResult = announcementSchema.safeParse(body);
        if (!validationResult.success) {
            return NextResponse.json(
                { success: false, error: "Validation failed", details: validationResult.error.format() },
                { status: 400 }
            );
        }

        const data = validationResult.data;
        await connectDB();

        const updateData: Record<string, unknown> = {
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
            updateData.publishedAt = new Date(data.publishedAt);
        }
        if (data.expiresAt) {
            updateData.expiresAt = new Date(data.expiresAt);
        } else {
            updateData.expiresAt = null;
        }
        if (data.coverImage) {
            updateData.coverImage = data.coverImage;
        } else {
            updateData.coverImage = "";
        }

        const announcement = await Announcement.findByIdAndUpdate(id, updateData, { new: true });

        if (!announcement) {
            return NextResponse.json({ success: false, error: "Announcement not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: announcement });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An error occurred";
        return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
    }
}

// PATCH - partial update (toggle pin, toggle publish, increment views)
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();

        await connectDB();

        // Allow public view count increment without auth
        if (body.action === "incrementView") {
            const announcement = await Announcement.findByIdAndUpdate(
                id,
                { $inc: { viewCount: 1 } },
                { new: true }
            );
            if (!announcement) {
                return NextResponse.json({ success: false, error: "Announcement not found" }, { status: 404 });
            }
            return NextResponse.json({ success: true, data: announcement });
        }

        // Admin-only actions
        const token = await getAdminToken(request);
        if (!token) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        const decoded = await verifyToken(token);
        if (!decoded) return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 });

        const updateData: Record<string, unknown> = {};
        if (typeof body.isPinned === "boolean") updateData.isPinned = body.isPinned;
        if (typeof body.isPublished === "boolean") updateData.isPublished = body.isPublished;
        if (body.priority) updateData.priority = body.priority;
        if (body.category) updateData.category = body.category;

        const announcement = await Announcement.findByIdAndUpdate(id, updateData, { new: true });

        if (!announcement) {
            return NextResponse.json({ success: false, error: "Announcement not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: announcement });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An error occurred";
        return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
    }
}

// DELETE
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
        const announcement = await Announcement.findByIdAndDelete(id);

        if (!announcement) {
            return NextResponse.json({ success: false, error: "Announcement not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Announcement deleted" });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An error occurred";
        return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
    }
}
