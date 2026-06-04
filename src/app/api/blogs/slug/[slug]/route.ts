import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Blog from "@/models/Blog";
import { checkRateLimit, getClientIP } from "@/lib/rate-limit";

// GET /api/blogs/slug/[slug] - Get blog by slug (for frontend)
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        // Rate limit public reads
        const clientIP = getClientIP(request);
        const rateLimit = await checkRateLimit(`blog_slug_get_${clientIP}`, 60, 60 * 1000);
        if (!rateLimit.success) {
            return NextResponse.json(
                { success: false, error: "Rate limit exceeded. Please try again later." },
                { status: 429 }
            );
        }

        const { slug } = await params;
        await connectDB();
        const blog = await Blog.findOne({ slug, published: true }).lean();

        if (!blog) {
            return NextResponse.json(
                { success: false, error: "Blog not found or not published" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: blog });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An error occurred";
        return NextResponse.json(
            { success: false, error: errorMessage },
            { status: 500 }
        );
    }
}
