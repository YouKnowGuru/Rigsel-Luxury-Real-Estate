import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import connectDB from "@/lib/mongodb";
import Document from "@/models/Document";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper to extract Cloudinary info from URL
function getCloudinaryInfo(url: string) {
    const parts = url.split("/");
    const uploadIndex = parts.indexOf("upload");
    if (uploadIndex === -1) return null;
    
    const resourceType = parts[uploadIndex - 1]; // "raw" or "image"
    
    const nextPart = parts[uploadIndex + 1];
    let version = null;
    let publicIdStart = uploadIndex + 1;
    
    if (nextPart.startsWith("v") && /^\d+$/.test(nextPart.substring(1))) {
        version = nextPart.substring(1);
        publicIdStart = uploadIndex + 2;
    }
    
    const publicId = parts.slice(publicIdStart).join("/");
    return { publicId, version, resourceType };
}

// GET /api/download/[id] - Download a document by fetching it from Cloudinary
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        await connectDB();
        const doc = await Document.findById(id);

        if (!doc) {
            return NextResponse.json(
                { success: false, error: "Document not found" },
                { status: 404 }
            );
        }

        // --- NEW: Serve from MongoDB Buffer if available ---
        if (doc.fileContent && doc.fileContent.length > 0) {
            console.log(`[Download] Serving from MongoDB Buffer: ${doc.title}`);
            
            // Determine content type and extension
            const contentType = doc.contentType || "application/octet-stream";
            const ext = (doc.fileType || "file").toLowerCase();
            
            // Sanitize filename and encode for header
            const cleanTitle = doc.title.replace(/[^a-zA-Z0-9_\- ]/g, "").trim() || "document";
            const finalFilename = cleanTitle.toLowerCase().endsWith(`.${ext}`) ? cleanTitle : `${cleanTitle}.${ext}`;
            const encodedFilename = encodeURIComponent(finalFilename);

            console.log(`[Download] Headers: Type=${contentType}, Name=${finalFilename}, Size=${doc.fileContent.length}`);

            // Increment download count
            await Document.findByIdAndUpdate(id, { $inc: { downloadCount: 1 } });

            // Use standard Response for maximum compatibility with binary streams
            return new Response(new Uint8Array(doc.fileContent), {
                status: 200,
                headers: {
                    "Content-Type": contentType,
                    "Content-Disposition": `attachment; filename="${encodedFilename}"; filename*=UTF-8''${encodedFilename}`,
                    "Cache-Control": "no-cache",
                },
            });
        }
        // ---------------------------------------------------

        let downloadUrl = doc.fileUrl;
        const info = getCloudinaryInfo(doc.fileUrl);
        console.log(`[Download] Extracted Info:`, info);

        // If it's a Cloudinary URL, try to get fresh info from API
        if (info && doc.fileUrl.includes("cloudinary.com")) {
            try {
                console.log(`[Download] Calling Admin API for: ${info.publicId} (${info.resourceType})`);
                const resource = await cloudinary.api.resource(info.publicId, {
                    resource_type: info.resourceType,
                });
                console.log(`[Download] Admin API success. Secure URL: ${resource.secure_url}`);
                downloadUrl = resource.secure_url;
                
                // If it's still not a signed URL and we need one, sign it
                if (!downloadUrl.includes("s--")) {
                    downloadUrl = cloudinary.url(info.publicId, {
                        resource_type: info.resourceType,
                        sign_url: true,
                        secure: true,
                        type: "upload",
                        version: resource.version || info.version,
                        analytics: false
                    });
                    console.log(`[Download] Generated signed URL from API info: ${downloadUrl}`);
                }
            } catch (apiError: any) {
                console.warn(`[Download] Admin API failed, falling back to manual signing:`, apiError.message);
                downloadUrl = cloudinary.url(info.publicId, {
                    resource_type: info.resourceType,
                    sign_url: true,
                    secure: true,
                    type: "upload",
                    version: info.version,
                    analytics: false
                });
            }
        }

        // Fetch the file from Cloudinary
        console.log(`[Download] Fetching from Cloudinary: ${downloadUrl}`);
        const fileResponse = await fetch(downloadUrl);
        console.log(`[Download] Cloudinary response status: ${fileResponse.status} ${fileResponse.statusText}`);

        if (!fileResponse.ok) {
            const errorBody = await fileResponse.text();
            console.error(`[Download] Cloudinary fetch failed: ${errorBody}`);
            return NextResponse.json(
                { 
                    success: false, 
                    error: `Cloudinary fetch failed: ${fileResponse.status}`,
                    details: errorBody 
                },
                { status: 502 }
            );
        }

        const arrayBuffer = await fileResponse.arrayBuffer();
        const contentType = doc.contentType || fileResponse.headers.get("content-type") || "application/octet-stream";
        const ext = (doc.fileType || "file").toLowerCase();
        const cleanTitle = doc.title.replace(/[^a-zA-Z0-9_\- ]/g, "").trim() || "document";
        const finalFilename = cleanTitle.toLowerCase().endsWith(`.${ext}`) ? cleanTitle : `${cleanTitle}.${ext}`;
        const encodedFilename = encodeURIComponent(finalFilename);

        console.log(`[Download] Serving from Cloudinary. Headers: Type=${contentType}, Name=${finalFilename}`);

        // Increment download count
        await Document.findByIdAndUpdate(id, { $inc: { downloadCount: 1 } });

        return new Response(new Uint8Array(arrayBuffer), {
            status: 200,
            headers: {
                "Content-Type": contentType,
                "Content-Disposition": `attachment; filename="${encodedFilename}"; filename*=UTF-8''${encodedFilename}`,
                "Cache-Control": "no-cache",
            },
        });
    } catch (error: any) {
        console.error("Download error:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
