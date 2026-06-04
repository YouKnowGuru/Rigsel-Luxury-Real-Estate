import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { v2 as cloudinary } from "cloudinary";
import { getAdminToken } from "@/lib/auth";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_PANORAMA_SIZE = 40 * 1024 * 1024; // 40MB — keep full-res 360° (e.g. 8K×4K)
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif", "image/bmp", "image/tiff"];
const ALLOWED_DOCUMENT_TYPES = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-powerpoint", "application/vnd.openxmlformats-officedocument.presentationml.presentation", "text/plain", "text/csv"];
const ALLOWED_DOCUMENT_EXTS = ["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt", "csv"];
const ALLOWED_IMAGE_EXTS = ["jpg", "jpeg", "png", "webp", "gif", "avif", "bmp", "tiff"];

// POST /api/upload - Upload images to Cloudinary
export async function POST(request: NextRequest) {
    try {
        const token = await getAdminToken(request);
        if (!token) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }
        const decoded = await verifyToken(token);
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
        const purpose = formData.get("purpose")?.toString() || "";
        const isPanorama = purpose === "panorama";

        if (!file) {
            return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
        }

        const maxSize = isPanorama ? MAX_PANORAMA_SIZE : MAX_FILE_SIZE;
        if (file.size > maxSize) {
            return NextResponse.json(
                { success: false, error: `File size exceeds ${maxSize / (1024 * 1024)}MB limit` },
                { status: 400 }
            );
        }

        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const fileName = file.name.toLowerCase();
        const fileExt = fileName.split(".").pop() || "";

        // Validate file type using both MIME type and extension
        const isPdf = file.type === "application/pdf" || fileExt === "pdf";
        const isDocument = isPdf || ALLOWED_DOCUMENT_EXTS.includes(fileExt) || ALLOWED_DOCUMENT_TYPES.includes(file.type);
        const isImage = ALLOWED_IMAGE_TYPES.includes(file.type) || ALLOWED_IMAGE_EXTS.includes(fileExt);

        if (!isDocument && !isImage) {
            return NextResponse.json(
                { success: false, error: "Invalid file type. Only images (JPEG, PNG, WebP, GIF) and documents (PDF, DOC, XLS, PPT, TXT, CSV) are allowed." },
                { status: 400 }
            );
        }

        // For documents/PDFs use 'raw' — this is the ONLY way to preserve the original file
        // 'image' and 'auto' cause Cloudinary to rasterize PDFs
        const finalResourceType = isDocument ? "raw" : "image";

        // Upload to Cloudinary
        const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
            const uploadOptions: Record<string, unknown> = {
                folder: isPanorama ? "phojaa-panoramas" : "phojaa-realestate",
                resource_type: finalResourceType,
            };

            // For raw/document uploads, set explicit public_id with extension
            if (isDocument) {
                const baseName = file.name.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "_");
                uploadOptions.public_id = `${baseName}_${Date.now()}.${fileExt}`;
            }

            // Panoramas: no resize/compress on upload — blur happens if Cloudinary shrinks the file
            // (display URL adds a high-res delivery transform in panorama-url.ts)
            if (isImage && !isPanorama) {
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
                            reject(error);
                        } else {
                            resolve(result as { secure_url: string });
                        }
                    }
                )
                .end(buffer);
        });

        return NextResponse.json({ success: true, url: result.secure_url });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An error occurred";
        return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
    }
}
