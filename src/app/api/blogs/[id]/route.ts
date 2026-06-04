import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Blog from "@/models/Blog";
import { verifyToken } from "@/lib/jwt";
import { blogSchema } from "@/lib/validation";
import { getAdminToken } from "@/lib/auth";

// GET /api/blogs/[id] - Get a single blog by ID
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await connectDB();
        const blog = await Blog.findById(id).lean();

        if (!blog) {
            return NextResponse.json(
                { success: false, error: "Blog not found" },
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

// PUT /api/blogs/[id] - Update a blog (Admin only)
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const token = await getAdminToken(request);
        if (!token) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const decoded = await verifyToken(token);
        if (!decoded) {
            return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 });
        }

        await connectDB();
        const body = await request.json();

        // Validate with Zod (partial)
        const validationResult = blogSchema.partial().safeParse(body);
        if (!validationResult.success) {
            return NextResponse.json(
                { success: false, error: "Validation failed", details: validationResult.error.format() },
                { status: 400 }
            );
        }

        const blog = await Blog.findByIdAndUpdate(id, validationResult.data, {
            new: true,
            runValidators: true,
        });

        if (!blog) {
            return NextResponse.json(
                { success: false, error: "Blog not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: blog });
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

// DELETE /api/blogs/[id] - Delete a blog (Admin only)
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const token = await getAdminToken(request);
        if (!token) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const decoded = await verifyToken(token);
        if (!decoded) {
            return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 });
        }

        await connectDB();
        const blog = await Blog.findByIdAndDelete(id);

        if (!blog) {
            return NextResponse.json(
                { success: false, error: "Blog not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, message: "Blog deleted successfully" });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An error occurred";
        return NextResponse.json(
            { success: false, error: errorMessage },
            { status: 500 }
        );
    }
}
