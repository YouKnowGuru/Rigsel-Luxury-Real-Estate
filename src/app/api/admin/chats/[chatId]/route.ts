import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Chat from "@/models/Chat";
import Message from "@/models/Message";
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ chatId: string }> }
) {
    try {
        const { chatId } = await params;
        
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

        // 1. Delete associated messages
        await Message.deleteMany({ chatId });

        // 2. Delete the chat itself
        const deletedChat = await Chat.findByIdAndDelete(chatId);

        if (!deletedChat) {
            return NextResponse.json({ error: "Chat not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Chat deleted successfully" }, { status: 200 });
    } catch (error: any) {
        console.error("Error deleting chat:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
