import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Settings from "@/models/Settings";
import { verifyToken } from "@/lib/jwt";
import { landCalculatorSchema } from "@/lib/validation";
import { getAdminToken } from "@/lib/auth";

const DEFAULT_CALC = {
    pricePerDecimal: 500000,
    decimalToSqft: 435.6,
    decimalToSqm: 40.47,
    currency: "Nu.",
};

// GET /api/admin/land-calculator
export async function GET(request: NextRequest) {
    try {
        const token = await getAdminToken(request);
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
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An error occurred";
        return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
    }
}

// PUT /api/admin/land-calculator
export async function PUT(request: NextRequest) {
    try {
        const token = await getAdminToken(request);
        if (!token) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }
        const decoded = await verifyToken(token);
        if (!decoded) {
            return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 });
        }

        await connectDB();
        const body = await request.json();

        // Validate with Zod
        const validationResult = landCalculatorSchema.safeParse(body);
        if (!validationResult.success) {
            return NextResponse.json(
                { success: false, error: "Validation failed", details: validationResult.error.format() },
                { status: 400 }
            );
        }

        const settings = await Settings.findOneAndUpdate(
            { key: "land_calculator" },
            { $set: { value: validationResult.data } },
            { upsert: true, new: true }
        );

        return NextResponse.json({ success: true, data: settings.value });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An error occurred";
        return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
    }
}
