import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// POST /api/upload - Upload images to Cloudinary
export async function POST(request: NextRequest) {
    try {
        const token = request.headers.get("authorization")?.split(" ")[1];
        if (!token) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }
        const decoded = verifyToken(token);
        if (!decoded) {
            return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 });
        }

        // Check if Cloudinary is configured
        if (
            !process.env.CLOUDINARY_CLOUD_NAME ||
            process.env.CLOUDINARY_CLOUD_NAME === "your-cloudinary-cloud-name"
        ) {
            return NextResponse.json(
                { success: false, error: "Cloudinary is not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your .env file." },
                { status: 500 }
            );
        }

        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
        }

        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const fileName = file.name.toLowerCase();
        const fileExt = fileName.split(".").pop() || "";
        const isPdf = file.type === "application/pdf" || fileExt === "pdf";
        const isDocument = isPdf || ["doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt", "csv"].includes(fileExt);
        const isImage = !isDocument && (file.type.startsWith("image/") || /\.(jpg|jpeg|png|webp|avif|gif|bmp|tiff)$/.test(fileName));

        // For documents/PDFs use 'raw' — this is the ONLY way to preserve the original file
        // 'image' and 'auto' cause Cloudinary to rasterize PDFs
        const finalResourceType = isDocument ? "raw" : (isImage ? "image" : "raw");

        console.log(`[Upload] File: ${file.name}, Type: ${file.type}, Extension: ${fileExt}, isPdf: ${isPdf}, isDocument: ${isDocument}, isImage: ${isImage}, resourceType: ${finalResourceType}`);

        // Upload to Cloudinary
        const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
            const uploadOptions: any = {
                folder: "phojaa-realestate",
                resource_type: finalResourceType,
            };

            // For raw/document uploads, set explicit public_id with extension
            if (isDocument) {
                const baseName = file.name.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "_");
                uploadOptions.public_id = `${baseName}_${Date.now()}.${fileExt}`;
            }

            // Only apply image transformations for actual images (not documents)
            if (isImage) {
                uploadOptions.transformation = [
                    { width: 1200, height: 900, crop: "limit" },
                    { quality: "auto" },
                    { fetch_format: "auto" },
                ];
            }

            cloudinary.uploader
                .upload_stream(
                    uploadOptions,
                    (error, result) => {
                        if (error) {
                            console.error("[Upload] Cloudinary error:", error);
                            reject(error);
                        } else {
                            console.log(`[Upload] Success: ${(result as any)?.secure_url}`);
                            resolve(result as { secure_url: string });
                        }
                    }
                )
                .end(buffer);
        });

        return NextResponse.json({ success: true, url: result.secure_url });
    } catch (error: any) {
        console.error("Upload error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
