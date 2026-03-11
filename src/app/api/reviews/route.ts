import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Review from "@/models/Review";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// GET /api/reviews - Get approved reviews for homepage
export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const reviews = await Review.find({ isApproved: true })
            .sort({ createdAt: -1 })
            .limit(10)
            .lean();

        return NextResponse.json({
            success: true,
            data: reviews,
        });
    } catch (error: any) {
        console.error("Error fetching reviews:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

// POST /api/reviews - Submit a new review with optional photo
export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const formData = await request.formData();
        const name = formData.get("name") as string;
        const role = formData.get("role") as string;
        const location = formData.get("location") as string;
        const content = formData.get("content") as string;
        const rating = parseInt(formData.get("rating") as string) || 5;
        const file = formData.get("file") as File | null;

        let avatarUrl = "";

        if (file) {
            // Convert file to buffer
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            // Upload to Cloudinary
            const uploadResult = await new Promise<{ secure_url: string }>((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    {
                        folder: "phojaa-reviews",
                        resource_type: "image",
                        transformation: [
                            { width: 400, height: 400, crop: "fill", gravity: "face" },
                            { quality: "auto" },
                        ],
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result as { secure_url: string });
                    }
                ).end(buffer);
            });
            avatarUrl = uploadResult.secure_url;
        }

        const review = await Review.create({
            name,
            role,
            location,
            content,
            rating,
            avatar: avatarUrl || undefined, // Use default if no image uploaded
            isApproved: false, // Always requires moderation
            isRead: false,
        });

        return NextResponse.json(
            {
                success: true,
                message: "Thank you! Your review has been submitted for approval.",
                data: review,
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("Error submitting review:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
