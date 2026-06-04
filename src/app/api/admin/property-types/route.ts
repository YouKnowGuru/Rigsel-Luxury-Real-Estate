import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import PropertyType from "@/models/PropertyType";
import { verifyToken } from "@/lib/jwt";
import { propertyTypeSchema } from "@/lib/validation";
import { getAdminToken } from "@/lib/auth";

export async function GET() {
    try {
        await connectDB();
        let types = await PropertyType.find({}).sort({ name: 1 });

        // Seed defaults if empty
        if (types.length === 0) {
            const defaults = [
                { name: "House", slug: "house", requiresBedBath: true, areaLabel: "Area (Decimals)" },
                { name: "Apartment", slug: "apartment", requiresBedBath: true, areaLabel: "Area (Decimals)" },
                { name: "Land", slug: "land", requiresBedBath: false, areaLabel: "Area (Decimals)" },
                { name: "Commercial", slug: "commercial", requiresBedBath: false, areaLabel: "Area (Decimals)" },
                { name: "Villa", slug: "villa", requiresBedBath: true, areaLabel: "Area (Decimals)" },
            ];
            await PropertyType.insertMany(defaults);
            types = await PropertyType.find({}).sort({ name: 1 });
        }

        return NextResponse.json({ success: true, data: types });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An error occurred";
        return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const token = await getAdminToken(request);
        const decoded = token ? await verifyToken(token) : null;
        if (!token || !decoded) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();
        const body = await request.json();

        // Validate with Zod
        const validationResult = propertyTypeSchema.safeParse(body);
        if (!validationResult.success) {
            return NextResponse.json(
                { success: false, error: "Validation failed", details: validationResult.error.format() },
                { status: 400 }
            );
        }

        const propertyType = await PropertyType.create(validationResult.data);
        return NextResponse.json({ success: true, data: propertyType }, { status: 201 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An error occurred";
        return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
    }
}
