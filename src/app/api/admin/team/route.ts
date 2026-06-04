import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import dbConnect from "@/lib/mongodb";
import TeamMember from "@/models/TeamMember";
import { teamMemberSchema } from "@/lib/validation";
import { getAdminTokenFromRequest } from "@/lib/auth";

export async function GET(request: Request) {
    try {
        const token = await getAdminTokenFromRequest(request);

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
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An error occurred";
        return NextResponse.json(
            { success: false, error: errorMessage },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const token = await getAdminTokenFromRequest(request);

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

        // Validate with Zod
        const validationResult = teamMemberSchema.safeParse(body);
        if (!validationResult.success) {
            return NextResponse.json(
                { success: false, error: "Validation failed", details: validationResult.error.format() },
                { status: 400 }
            );
        }

        await dbConnect();
        const newMember = await TeamMember.create(validationResult.data);

        return NextResponse.json({ success: true, data: newMember }, { status: 201 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An error occurred";
        return NextResponse.json(
            { success: false, error: errorMessage },
            { status: 500 }
        );
    }
}
