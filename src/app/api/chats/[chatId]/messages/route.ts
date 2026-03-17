import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Chat from "@/models/Chat";
import Message from "@/models/Message";
import mongoose from "mongoose";
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ chatId: string }> }
) {
  try {
    await connectDB();
    const { chatId } = await params;

    if (!mongoose.Types.ObjectId.isValid(chatId)) {
      return NextResponse.json({ error: "Invalid Chat ID" }, { status: 400 });
    }

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    const messages = await Message.find({ chatId }).sort({ createdAt: 1 });

    return NextResponse.json(messages, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ chatId: string }> }
) {
  try {
    await connectDB();
    const { chatId } = await params;
    
    // Check token to see if admin is sending the message
    const cookieStore = await cookies();
    let token = cookieStore.get("adminToken")?.value;
    
    if (!token) {
        const authHeader = req.headers.get("authorization");
        if (authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1];
        }
    }
    
    let sender: "guest" | "admin" = "guest";
    
    if (token) {
        try {
            const payload = await verifyToken(token);
            if (payload) {
                sender = "admin";
            }
        } catch(e) { /* ignore invalid token for sender determination */ }
    }

    const body = await req.json();
    const { text } = body;

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return NextResponse.json(
        { error: "Message text is required" },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(chatId)) {
      return NextResponse.json({ error: "Invalid Chat ID" }, { status: 400 });
    }

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    if (chat.status === "closed") {
      return NextResponse.json(
        { error: "Cannot send messages to a closed chat" },
        { status: 400 }
      );
    }

    const message = await Message.create({
      chatId,
      sender,
      text: text.trim(),
    });

    // Update the lastMessageAt field in the Chat model
    await Chat.findByIdAndUpdate(chatId, { lastMessageAt: new Date() });

    return NextResponse.json(message, { status: 201 });
  } catch (error: any) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
