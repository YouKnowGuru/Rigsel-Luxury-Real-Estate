import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { verifyToken } from "@/lib/jwt";
import connectDB from "@/lib/mongodb";
import Document from "@/models/Document";

export async function GET(request: NextRequest) {
    try {
        const token = request.headers.get("authorization")?.split(" ")[1];
        if (!token) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        const decoded = verifyToken(token);
        if (!decoded) return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 });

        await connectDB();
        const documents = await Document.find().sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: documents });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    console.log(">>> [AdminDocumentsAPI] POST request received at " + new Date().toISOString());
    try {
        await connectDB();
        
        // Extra safety to ensure we use the latest schema in dev
        if (process.env.NODE_ENV === "development" && mongoose.models.Document) {
            console.log(">>> [AdminDocumentsAPI] Refreshing Document model");
            delete mongoose.models.Document;
        }

        const token = request.headers.get("authorization")?.split(" ")[1];
        if (!token) {
            console.warn("[AdminDocumentsAPI] No token provided");
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }
        
        const decoded = verifyToken(token);
        if (!decoded) {
            console.warn("[AdminDocumentsAPI] Invalid token");
            return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 });
        }

        const body = await request.json();
        console.log("[AdminDocumentsAPI] Received body:", { 
            title: body.title,
            hasContent: !!body.fileContent,
            contentLen: body.fileContent?.length
        });
        
        const { title, description, fileUrl, fileType, fileSize, fileContent, contentType } = body;

        await connectDB();
        
        const documentData: any = {
            title,
            description,
            fileUrl: fileUrl || "",
            fileType,
            fileSize,
            contentType
        };

        // If file content is provided (for documents), convert from base64 to buffer
        if (fileContent) {
            documentData.fileContent = Buffer.from(fileContent, 'base64');
        }

        try {
            const document = await Document.create(documentData);
            console.log(`>>> [AdminDocumentsAPI] Document saved successfully:`, {
                id: document._id,
                title: document.title,
                type: document.fileType,
                contentType: document.contentType,
                hasBuffer: !!document.fileContent
            });
            return NextResponse.json({ success: true, data: document });
        } catch (validationError: any) {
            console.error("[AdminDocumentsAPI] Mongoose Validation Error:", validationError);
            return NextResponse.json({ 
                success: false, 
                error: validationError.message,
                details: validationError.errors 
            }, { status: 400 });
        }
    } catch (error: any) {
        console.error("[AdminDocumentsAPI] Global error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
