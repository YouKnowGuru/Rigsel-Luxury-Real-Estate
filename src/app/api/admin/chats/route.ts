import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Chat from "@/models/Chat";
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";
import "@/models/Property"; // Needed to populate property

export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    let token = cookieStore.get("adminToken")?.value;
    
    if (!token) {
        const authHeader = req.headers.get("authorization");
        if (authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1];
        }
    }

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
  } catch (error: any) {
    console.error("Error fetching admin chats:", error);
    return NextResponse.json(
      { error: "Failed to fetch chats" },
      { status: 500 }
    );
  }
}
