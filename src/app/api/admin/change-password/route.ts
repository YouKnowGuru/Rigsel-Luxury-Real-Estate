import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Admin from "@/models/Admin";
import { verifyToken } from "@/lib/jwt";
import { verifyCsrfProtection } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { changePasswordSchema } from "@/lib/validation";
import { getAdminToken } from "@/lib/auth";
import { logAuthEvent, logDataEvent } from "@/lib/logger";

// POST /api/admin/change-password
export async function POST(request: NextRequest) {
    try {
        // Verify CSRF token for state-changing request
        const csrfCheck = await verifyCsrfProtection(request);
        if (!csrfCheck.valid) {
            return NextResponse.json(
                { success: false, error: csrfCheck.error || "CSRF validation failed" },
                { status: 403 }
            );
        }

        const token = await getAdminToken(request);
        if (!token) {
            await logAuthEvent("UNAUTHORIZED_ACCESS", request, {
                error: "Missing auth token",
            });
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const decoded = await verifyToken(token);
        if (!decoded) {
            await logAuthEvent("UNAUTHORIZED_ACCESS", request, {
                error: "Invalid token",
            });
            return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 });
        }

        await connectDB();

        const body = await request.json();

        // Validate with Zod
        const validationResult = changePasswordSchema.safeParse(body);
        if (!validationResult.success) {
            return NextResponse.json(
                { success: false, error: "Validation failed", details: validationResult.error.format() },
                { status: 400 }
            );
        }

        const { currentPassword, newPassword } = validationResult.data;

        const admin = await Admin.findById(decoded.userId).select("+password");
        if (!admin) {
            return NextResponse.json({ success: false, error: "Admin not found" }, { status: 404 });
        }

        const isValid = await bcrypt.compare(currentPassword, admin.password);
        if (!isValid) {
            await logAuthEvent("LOGIN_FAILURE", request, {
                userId: decoded.userId,
                username: decoded.username,
                error: "Change password failed - incorrect current password",
            });
            return NextResponse.json(
                { success: false, error: "Current password is incorrect" },
                { status: 400 }
            );
        }

        admin.password = newPassword;
        await admin.save();

        // Log password change
        await logAuthEvent("PASSWORD_CHANGE", request, {
            userId: decoded.userId,
            username: decoded.username,
        });

        await logDataEvent("DATA_UPDATE", request, {
            userId: decoded.userId,
            username: decoded.username || "unknown",
            resource: "Admin",
            resourceId: decoded.userId,
            details: { action: "password_change" },
        });

        return NextResponse.json({ success: true, message: "Password updated successfully" });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An error occurred";
        return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
    }
}
