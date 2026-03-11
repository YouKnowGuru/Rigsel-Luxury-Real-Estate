import { NextRequest, NextResponse } from "next/server";
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
    try {
        const token = request.headers.get("authorization")?.split(" ")[1];
        if (!token) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        const decoded = verifyToken(token);
        if (!decoded) return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 });

        const body = await request.json();
        const { title, description, fileUrl, fileType, fileSize } = body;

        await connectDB();
        const document = await Document.create({
            title,
            description,
            fileUrl,
            fileType,
            fileSize
        });

        return NextResponse.json({ success: true, data: document });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
