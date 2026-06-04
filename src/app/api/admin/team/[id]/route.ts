import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import dbConnect from "@/lib/mongodb";
import TeamMember from "@/models/TeamMember";
import { teamMemberSchema } from "@/lib/validation";
import { getAdminTokenFromRequest } from "@/lib/auth";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
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
        const member = await TeamMember.findById(id);

        if (!member) {
            return NextResponse.json(
                { success: false, error: "Team member not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: member });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An error occurred";
        return NextResponse.json(
            { success: false, error: errorMessage },
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

        // Validate with Zod (partial)
        const validationResult = teamMemberSchema.partial().safeParse(body);
        if (!validationResult.success) {
            return NextResponse.json(
                { success: false, error: "Validation failed", details: validationResult.error.format() },
                { status: 400 }
            );
        }

        await dbConnect();

        const member = await TeamMember.findByIdAndUpdate(id, validationResult.data, {
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
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An error occurred";
        return NextResponse.json(
            { success: false, error: errorMessage },
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
        const member = await TeamMember.findByIdAndDelete(id);

        if (!member) {
            return NextResponse.json(
                { success: false, error: "Team member not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: {} });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An error occurred";
        return NextResponse.json(
            { success: false, error: errorMessage },
            { status: 500 }
        );
    }
}
