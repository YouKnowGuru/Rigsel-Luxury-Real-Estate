import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Settings from "@/models/Settings";
import { verifyToken } from "@/lib/jwt";

const DEFAULT_CALC = {
    pricePerDecimal: 500000,
    decimalToSqft: 435.6,
    decimalToSqm: 40.47,
    currency: "Nu.",
};

// GET /api/admin/land-calculator
export async function GET(request: NextRequest) {
    try {
        const token = request.headers.get("authorization")?.split(" ")[1];
        if (!token) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }
        const decoded = await verifyToken(token);
        if (!decoded) {
            return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 });
        }

        await connectDB();
        let settings = await Settings.findOne({ key: "land_calculator" });
        if (!settings) {
            settings = await Settings.create({ key: "land_calculator", value: DEFAULT_CALC });
        }

        return NextResponse.json({ success: true, data: settings.value });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// PUT /api/admin/land-calculator
export async function PUT(request: NextRequest) {
    try {
        const token = request.headers.get("authorization")?.split(" ")[1];
        if (!token) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }
        const decoded = await verifyToken(token);
        if (!decoded) {
            return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 });
        }

        await connectDB();
        const body = await request.json();

        const settings = await Settings.findOneAndUpdate(
            { key: "land_calculator" },
            { $set: { value: body } },
            { upsert: true, new: true }
        );

        return NextResponse.json({ success: true, data: settings.value });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
