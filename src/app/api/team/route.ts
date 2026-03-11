import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import TeamMember from "@/models/TeamMember";

export async function GET() {
    try {
        await dbConnect();
        const members = await TeamMember.find().sort({ order: 1, createdAt: 1 });

        return NextResponse.json({ success: true, data: members });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
