import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Chat from "@/models/Chat";
import mongoose from "mongoose";
import { chatSchema } from "@/lib/validation";
import { checkRateLimit, getClientIP } from "@/lib/rate-limit";

export async function POST(req: Request) {
  try {
    // Rate limit chat creation
    const clientIP = getClientIP(req);
    const rateLimit = await checkRateLimit(`chats_post_${clientIP}`, 10, 60 * 60 * 1000); // 10 per hour
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: "Too many chat requests. Please try again later." },
        { status: 429 }
      );
    }

    await connectDB();
    const body = await req.json();

    // Validate with Zod
    const validationResult = chatSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validationResult.error.format() },
        { status: 400 }
      );
    }

    const { propertyId, guestName, guestEmail } = validationResult.data;

    if (!mongoose.Types.ObjectId.isValid(propertyId)) {
      return NextResponse.json(
        { error: "Invalid Property ID" },
        { status: 400 }
      );
    }

    // Check if an active chat already exists for this property and guest
    let chat = await Chat.findOne({
      propertyId,
      guestEmail: guestEmail.toLowerCase(),
      status: "active",
    });

    if (!chat) {
      // Create a new chat session
      chat = await Chat.create({
        propertyId,
        guestName,
        guestEmail: guestEmail.toLowerCase(),
        status: "active",
      });
    }

    return NextResponse.json(chat, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An error occurred";
    return NextResponse.json(
      { error: "Failed to create or retrieve chat" },
      { status: 500 }
    );
  }
}
