import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Settings from "@/models/Settings";

const DEFAULT_SETTINGS = {
    siteName: "Phojaa Real Estate",
    phone: "+975 16 111 999",
    email: "phojaa95realestate@gmail.com",
    address: "Norzin Lam, Thimphu, Bhutan",
    facebook: "https://www.facebook.com/share/1b2Fk7oC9q/ 2",
    instagram: "https://tiktok.com/@phojaa95realestate",
    whatsapp: "+975 16 111 999",
};

// GET /api/settings - Public access to site settings
export async function GET(request: NextRequest) {
    try {
        await connectDB();
        let settings = await Settings.findOne({ key: "site_settings" });

        const data = settings ? settings.value : DEFAULT_SETTINGS;

        return NextResponse.json({ success: true, data });
    } catch (error: any) {
        console.error("Public Settings API Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
