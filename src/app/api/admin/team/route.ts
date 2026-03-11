import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import dbConnect from "@/lib/mongodb";
import TeamMember from "@/models/TeamMember";

export async function GET() {
    try {
        const headersList = await headers();
        const token = headersList.get("authorization")?.split(" ")[1];

        if (!token) {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 }
            );
        }

        const payload = await verifyToken(token);
        if (!payload || !["admin", "superadmin"].includes(payload.role as string)) {
            return NextResponse.json(
                { success: false, error: "Forbidden" },
                { status: 403 }
            );
        }

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

export async function POST(request: Request) {
    try {
        const headersList = await headers();
        const token = headersList.get("authorization")?.split(" ")[1];

        if (!token) {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 }
            );
        }

        const payload = await verifyToken(token);
        if (!payload || !["admin", "superadmin"].includes(payload.role as string)) {
            return NextResponse.json(
                { success: false, error: "Forbidden" },
                { status: 403 }
            );
        }

        const body = await request.json();
        await dbConnect();

        const newMember = await TeamMember.create(body);

        return NextResponse.json({ success: true, data: newMember }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
