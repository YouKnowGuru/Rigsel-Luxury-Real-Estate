import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Admin from "@/models/Admin";
import { verifyToken } from "@/lib/jwt";
import bcrypt from "bcryptjs";

// POST /api/admin/change-password
export async function POST(request: NextRequest) {
    try {
        const token = request.headers.get("authorization")?.split(" ")[1];
        if (!token) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const decoded = await verifyToken(token) as unknown as { userId: string } | null;
        if (!decoded) {
            return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 });
        }

        await connectDB();

        const { currentPassword, newPassword } = await request.json();

        if (!currentPassword || !newPassword) {
            return NextResponse.json(
                { success: false, error: "Current and new passwords are required" },
                { status: 400 }
            );
        }

        if (newPassword.length < 6) {
            return NextResponse.json(
                { success: false, error: "New password must be at least 6 characters" },
                { status: 400 }
            );
        }

        const admin = await Admin.findById(decoded.userId).select("+password");
        if (!admin) {
            return NextResponse.json({ success: false, error: "Admin not found" }, { status: 404 });
        }

        const isValid = await bcrypt.compare(currentPassword, admin.password);
        if (!isValid) {
            return NextResponse.json(
                { success: false, error: "Current password is incorrect" },
                { status: 400 }
            );
        }

        const hashed = await bcrypt.hash(newPassword, 12);
        admin.password = hashed;
        await admin.save();

        return NextResponse.json({ success: true, message: "Password updated successfully" });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
