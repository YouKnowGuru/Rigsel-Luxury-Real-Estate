import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import PropertyType from "@/models/PropertyType";

export async function GET() {
    try {
        await connectDB();
        const types = await PropertyType.find({}).sort({ name: 1 });
        return NextResponse.json({ success: true, data: types });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
