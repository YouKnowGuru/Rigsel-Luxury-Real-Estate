import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Document from "@/models/Document";

export async function GET() {
    try {
        await connectDB();
        const documents = await Document.find().sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: documents });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
