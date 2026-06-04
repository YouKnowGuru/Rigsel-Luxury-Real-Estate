import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import TeamMember from "@/models/TeamMember";
import { checkRateLimit, getClientIP } from "@/lib/rate-limit";

export async function GET(request: Request) {
    try {
        // Rate limit public reads
        const clientIP = getClientIP(request);
        const rateLimit = await checkRateLimit(`team_get_${clientIP}`, 60, 60 * 1000);
        if (!rateLimit.success) {
            return NextResponse.json(
                { success: false, error: "Rate limit exceeded. Please try again later." },
                { status: 429 }
            );
        }

        await dbConnect();
        const members = await TeamMember.find().sort({ order: 1, createdAt: 1 }).lean();

        return NextResponse.json({ success: true, data: members });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An error occurred";
        return NextResponse.json(
            { success: false, error: errorMessage },
            { status: 500 }
        );
    }
}
