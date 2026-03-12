import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Settings from "@/models/Settings";

export const dynamic = "force-dynamic";

const DEFAULT_SETTINGS = {
    siteName: "Phojaa95Real Estate",
    phone: "+975 16 111 999",
    email: "phojaa95realestate@gmail.com",
    address: "Norzin Lam, Thimphu, Bhutan",
    facebook: "https://www.facebook.com/share/1b2Fk7oC9q/ 2",
    instagram: "https://tiktok.com/@phojaa95realestate",
    whatsapp: "+975 16 111 999",
    heroImage: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=2674&auto=format&fit=crop",
    heroImages: [
        "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=2674&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?q=80&w=2670&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1505873242700-f289a29e1e0f?q=80&w=2670&auto=format&fit=crop",
    ],
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
