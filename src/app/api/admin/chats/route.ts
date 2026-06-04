import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Chat from "@/models/Chat";
import { verifyToken } from "@/lib/jwt";
import "@/models/Property"; // Needed to populate property
import { getAdminTokenFromRequest } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const token = await getAdminTokenFromRequest(req);

    if (!token) {
        return NextResponse.json({ error: "Unauthorized - No token" }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized - Invalid token" }, { status: 401 });
    }

    await connectDB();

    // Fetch all active chats, sorted by latest message
    const chats = await Chat.find({ status: "active" })
      .populate({
         path: "propertyId",
         select: "title images",
         options: { strictPopulate: false }
      })
      .sort({ lastMessageAt: -1 })
      .lean();

    return NextResponse.json(chats, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An error occurred";
    return NextResponse.json(
      { error: "Failed to fetch chats" },
      { status: 500 }
    );
  }
}
