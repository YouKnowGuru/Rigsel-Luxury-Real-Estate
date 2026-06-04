import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Review from "@/models/Review";
import { v2 as cloudinary } from "cloudinary";
import { reviewSchema } from "@/lib/validation";
import { checkRateLimit, getClientIP } from "@/lib/rate-limit";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// GET /api/reviews - Get approved reviews for homepage
export async function GET(request: NextRequest) {
    try {
        // Rate limit public reads
        const clientIP = getClientIP(request);
        const rateLimit = await checkRateLimit(`reviews_get_${clientIP}`, 60, 60 * 1000);
        if (!rateLimit.success) {
            return NextResponse.json(
                { success: false, error: "Rate limit exceeded. Please try again later." },
                { status: 429 }
            );
        }

        await connectDB();

        const reviews = await Review.find({ isApproved: true })
            .sort({ createdAt: -1 })
            .limit(10)
            .lean();

        return NextResponse.json({
            success: true,
            data: reviews,
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An error occurred";
        return NextResponse.json(
            { success: false, error: errorMessage },
            { status: 500 }
        );
    }
}

// POST /api/reviews - Submit a new review with optional photo
export async function POST(request: NextRequest) {
    try {
        // Rate limit review submissions
        const clientIP = getClientIP(request);
        const rateLimit = await checkRateLimit(`reviews_post_${clientIP}`, 3, 60 * 60 * 1000); // 3 per hour
        if (!rateLimit.success) {
            return NextResponse.json(
                { success: false, error: "Too many submissions. Please try again later." },
                { status: 429 }
            );
        }

        await connectDB();

        const formData = await request.formData();
        const name = formData.get("name") as string;
        const role = formData.get("role") as string;
        const location = formData.get("location") as string;
        const content = formData.get("content") as string;
        const rating = parseInt(formData.get("rating") as string) || 5;
        const file = formData.get("file") as File | null;

        // Validate text fields with Zod
        const validationResult = reviewSchema.safeParse({ name, role, location, content, rating });
        if (!validationResult.success) {
            return NextResponse.json(
                { success: false, error: "Validation failed", details: validationResult.error.format() },
                { status: 400 }
            );
        }

        let avatarUrl = "";

        if (file) {
            // Validate file size (max 5MB)
            const maxSize = 5 * 1024 * 1024;
            if (file.size > maxSize) {
                return NextResponse.json(
                    { success: false, error: "File size exceeds 5MB limit" },
                    { status: 400 }
                );
            }

            // Validate file type
            const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
            if (!allowedTypes.includes(file.type)) {
                return NextResponse.json(
                    { success: false, error: "Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed." },
                    { status: 400 }
                );
            }

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
            ...validationResult.data,
            avatar: avatarUrl || undefined,
            isApproved: false,
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
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An error occurred";
        return NextResponse.json(
            { success: false, error: errorMessage },
            { status: 500 }
        );
    }
}
