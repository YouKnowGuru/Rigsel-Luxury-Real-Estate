import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import dbConnect from "@/lib/mongodb";
import TeamMember from "@/models/TeamMember";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
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
        const member = await TeamMember.findById(id);

        if (!member) {
            return NextResponse.json(
                { success: false, error: "Team member not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: member });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
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

        const member = await TeamMember.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        });

        if (!member) {
            return NextResponse.json(
                { success: false, error: "Team member not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: member });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
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
        const member = await TeamMember.findByIdAndDelete(id);

        if (!member) {
            return NextResponse.json(
                { success: false, error: "Team member not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: {} });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
