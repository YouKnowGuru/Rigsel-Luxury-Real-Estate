import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import PropertyType from "@/models/PropertyType";
import { verifyToken } from "@/lib/jwt";

export async function GET() {
    try {
        await connectDB();
        let types = await PropertyType.find({}).sort({ name: 1 });

        // Seed defaults if empty
        if (types.length === 0) {
            const defaults = [
                { name: "House", slug: "house", requiresBedBath: true, areaLabel: "Area (m²)" },
                { name: "Apartment", slug: "apartment", requiresBedBath: true, areaLabel: "Area (sq.ft)" },
                { name: "Land", slug: "land", requiresBedBath: false, areaLabel: "Area (Decimals)" },
                { name: "Commercial", slug: "commercial", requiresBedBath: false, areaLabel: "Area (sq.ft)" },
                { name: "Villa", slug: "villa", requiresBedBath: true, areaLabel: "Area (m²)" },
            ];
            await PropertyType.insertMany(defaults);
            types = await PropertyType.find({}).sort({ name: 1 });
        }

        return NextResponse.json({ success: true, data: types });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const token = request.headers.get("authorization")?.split(" ")[1];
        const decoded = token ? await verifyToken(token) : null;
        if (!token || !decoded) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();
        const body = await request.json();
        const propertyType = await PropertyType.create(body);
        return NextResponse.json({ success: true, data: propertyType }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
