import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Blog from "@/models/Blog";
import { verifyToken } from "@/lib/jwt";
import { blogSchema } from "@/lib/validation";
import { checkRateLimit, getClientIP } from "@/lib/rate-limit";
import { getAdminToken } from "@/lib/auth";

// GET /api/blogs - Get all blogs
export async function GET(request: NextRequest) {
    try {
        // Rate limit public reads
        const clientIP = getClientIP(request);
        const rateLimit = await checkRateLimit(`blogs_get_${clientIP}`, 60, 60 * 1000);
        if (!rateLimit.success) {
            return NextResponse.json(
                { success: false, error: "Rate limit exceeded. Please try again later." },
                { status: 429 }
            );
        }

        await connectDB();

        const { searchParams } = new URL(request.url);
        const publishedOnly = searchParams.get("published") === "true";
        const limit = Math.min(Number(searchParams.get("limit")) || 10, 100);
        const page = Number(searchParams.get("page")) || 1;
        const skip = (page - 1) * limit;

        const query: Record<string, unknown> = {};
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
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An error occurred";
        return NextResponse.json(
            { success: false, error: errorMessage },
            { status: 500 }
        );
    }
}

// POST /api/blogs - Create new blog (Admin only)
export async function POST(request: NextRequest) {
    try {
        const token = await getAdminToken(request);
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
        const body = await request.json();

        // Validate with Zod
        const validationResult = blogSchema.safeParse(body);
        if (!validationResult.success) {
            return NextResponse.json(
                { success: false, error: "Validation failed", details: validationResult.error.format() },
                { status: 400 }
            );
        }

        const data = validationResult.data;

        // Generate slug if not provided
        if (!data.slug) {
            data.slug = data.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, "");
        }

        const blog = await Blog.create(data);

        return NextResponse.json(
            { success: true, data: blog },
            { status: 201 }
        );
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An error occurred";
        if ((error as { code?: number }).code === 11000) {
            return NextResponse.json(
                { success: false, error: "Blog with this slug already exists" },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { success: false, error: errorMessage },
            { status: 500 }
        );
    }
}
