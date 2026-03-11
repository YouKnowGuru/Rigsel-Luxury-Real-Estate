import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Settings from "@/models/Settings";
import { verifyToken } from "@/lib/jwt";

const DEFAULT_SETTINGS = {
    siteName: "Phojaa Real Estate",
    phone: "+975 16 111 999",
    email: "phojaa95realestate@gmail.com",
    address: "Norzin Lam, Thimphu, Bhutan",
    facebook: "https://www.facebook.com/share/1b2Fk7oC9q/ 2",
    instagram: "https://tiktok.com/@phojaa95realestate",
    whatsapp: "+975 16 111 999",
};

// GET /api/admin/settings
export async function GET(request: NextRequest) {
    try {
        const token = request.headers.get("authorization")?.split(" ")[1];
        if (!token) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }
        const decoded = verifyToken(token);
        if (!decoded) {
            return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 });
        }

        await connectDB();
        let settings = await Settings.findOne({ key: "site_settings" });
        if (!settings) {
            settings = await Settings.create({ key: "site_settings", value: DEFAULT_SETTINGS });
        }

        return NextResponse.json({ success: true, data: settings.value });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// PUT /api/admin/settings
export async function PUT(request: NextRequest) {
    try {
        const token = request.headers.get("authorization")?.split(" ")[1];
        if (!token) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }
        const decoded = verifyToken(token);
        if (!decoded) {
            return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 });
        }

        await connectDB();
        const body = await request.json();

        const settings = await Settings.findOneAndUpdate(
            { key: "site_settings" },
            { $set: { value: body } },
            { upsert: true, new: true }
        );

        return NextResponse.json({ success: true, data: settings.value });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
