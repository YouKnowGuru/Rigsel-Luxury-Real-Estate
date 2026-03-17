import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Chat from "@/models/Chat";
import mongoose from "mongoose";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { propertyId, guestName, guestEmail } = body;

    if (!propertyId || !guestName || !guestEmail) {
      return NextResponse.json(
        { error: "Property ID, Name, and Email are required" },
        { status: 400 }
      );
    }

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
  } catch (error: any) {
    console.error("Error creating chat:", error);
    return NextResponse.json(
      { error: "Failed to create or retrieve chat" },
      { status: 500 }
    );
  }
}
