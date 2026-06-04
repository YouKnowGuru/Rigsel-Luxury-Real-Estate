import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import PropertyType from "@/models/PropertyType";
import Property from "@/models/Property";
import { checkRateLimit, getClientIP } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
    try {
        const clientIP = getClientIP(request);
        const rateLimit = await checkRateLimit(`property_types_get_${clientIP}`, 60, 60 * 1000);
        if (!rateLimit.success) {
            return NextResponse.json(
                { success: false, error: "Rate limit exceeded. Please try again later." },
                { status: 429 }
            );
        }

        await connectDB();
        const withCounts = new URL(request.url).searchParams.get("counts") === "true";
        let types = await PropertyType.find({}).sort({ name: 1 }).lean();

        if (types.length === 0) {
            const defaults = [
                { name: "House", slug: "house", requiresBedBath: true, areaLabel: "Area (Decimals)" },
                { name: "Apartment", slug: "apartment", requiresBedBath: true, areaLabel: "Area (Decimals)" },
                { name: "Land", slug: "land", requiresBedBath: false, areaLabel: "Area (Decimals)" },
                { name: "Commercial", slug: "commercial", requiresBedBath: false, areaLabel: "Area (Decimals)" },
                { name: "Hotel", slug: "hotel", requiresBedBath: false, areaLabel: "Area (Decimals)" },
            ];
            await PropertyType.insertMany(defaults);
            types = await PropertyType.find({}).sort({ name: 1 }).lean();
        }

        if (!withCounts) {
            return NextResponse.json({ success: true, data: types });
        }

        const countRows = await Property.aggregate([
            { $match: { isSold: { $ne: true } } },
            { $group: { _id: { $toLower: "$propertyType" }, count: { $sum: 1 } } },
        ]);
        const countMap = Object.fromEntries(
            countRows.map((r: { _id: string; count: number }) => [r._id, r.count])
        );

        const data = types.map((t) => ({
            ...t,
            listingCount:
                countMap[t.slug.toLowerCase()] ??
                countMap[t.name.toLowerCase()] ??
                0,
        }));

        return NextResponse.json({ success: true, data });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An error occurred";
        return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
    }
}
