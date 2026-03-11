import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Blog from "@/models/Blog";

// GET /api/blogs/slug/[slug] - Get blog by slug (for frontend)
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
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
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
