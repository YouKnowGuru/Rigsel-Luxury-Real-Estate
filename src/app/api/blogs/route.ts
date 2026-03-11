import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Blog from "@/models/Blog";
import { verifyToken } from "@/lib/jwt";

// GET /api/blogs - Get all blogs
export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const publishedOnly = searchParams.get("published") === "true";
        const limit = Number(searchParams.get("limit")) || 10;
        const page = Number(searchParams.get("page")) || 1;
        const skip = (page - 1) * limit;

        const query: any = {};
        if (publishedOnly) {
            query.published = true;
        }

        const blogs = await Blog.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const total = await Blog.countDocuments(query);

        return NextResponse.json({
            success: true,
            data: blogs,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error: any) {
        console.error("Error fetching blogs:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

// POST /api/blogs - Create new blog (Admin only)
export async function POST(request: NextRequest) {
    try {
        const token = request.headers.get("authorization")?.split(" ")[1];
        if (!token) {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 }
            );
        }

        const decoded = verifyToken(token);
        if (!decoded) {
            return NextResponse.json(
                { success: false, error: "Invalid token" },
                { status: 401 }
            );
        }

        await connectDB();
        const body = await request.json();

        if (!body.title || !body.content || !body.coverImage) {
            return NextResponse.json(
                { success: false, error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Generate slug if not provided
        if (!body.slug) {
            body.slug = body.title
                .toLowerCase()
                .replace(/[^a-z0-0]+/g, "-")
                .replace(/(^-|-$)/g, "");
        }

        const blog = await Blog.create(body);

        return NextResponse.json(
            { success: true, data: blog },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("Error creating blog:", error);
        if (error.code === 11000) {
            return NextResponse.json(
                { success: false, error: "Blog with this slug already exists" },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
