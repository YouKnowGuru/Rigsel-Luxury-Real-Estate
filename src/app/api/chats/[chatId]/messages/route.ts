import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Chat from "@/models/Chat";
import Message from "@/models/Message";
import mongoose from "mongoose";
import { verifyToken } from "@/lib/jwt";
import { messageSchema } from "@/lib/validation";
import { checkRateLimit, getClientIP } from "@/lib/rate-limit";
import { getAdminTokenFromRequest } from "@/lib/auth";

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
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An error occurred";
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
    // Rate limit messages
    const clientIP = getClientIP(req);
    const rateLimit = await checkRateLimit(`messages_post_${clientIP}`, 30, 60 * 1000); // 30 per minute
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: "Too many messages. Please slow down." },
        { status: 429 }
      );
    }

    await connectDB();
    const { chatId } = await params;

    // Check token to see if admin is sending the message
    const token = await getAdminTokenFromRequest(req);

    let sender: "guest" | "admin" = "guest";

    if (token) {
        try {
            const payload = await verifyToken(token);
            if (payload) {
                sender = "admin";
            }
        } catch { /* ignore invalid token for sender determination */ }
    }

    const body = await req.json();

    // Validate with Zod
    const validationResult = messageSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validationResult.error.format() },
        { status: 400 }
      );
    }

    const { text } = validationResult.data;

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
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An error occurred";
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
