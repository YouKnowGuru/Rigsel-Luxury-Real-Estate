import { NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit, getClientIP } from "@/lib/rate-limit";
import { completeWithOpenRouter, type ChatTurn } from "@/lib/openrouter";
import {
  buildPhojaaA1SystemPrompt,
  warmupPhojaaA1Context,
} from "@/lib/phojaa-a1-context";

const assistantMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(2000),
});

const assistantRequestSchema = z.object({
  messages: z.array(assistantMessageSchema).min(1).max(24),
});

/** Preload property/settings cache when chat opens */
export async function GET() {
  try {
    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json({ ready: false }, { status: 503 });
    }
    await warmupPhojaaA1Context();
    return NextResponse.json({ ready: true });
  } catch {
    return NextResponse.json({ ready: false }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const clientIP = getClientIP(req);
    const rateLimit = await checkRateLimit(
      `assistant_${clientIP}`,
      25,
      60 * 1000
    );
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a moment." },
        { status: 429 }
      );
    }

    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: "AI assistant is not configured yet." },
        { status: 503 }
      );
    }

    const body = await req.json();
    const parsed = assistantRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { messages } = parsed.data;
    const last = messages[messages.length - 1];
    if (last.role !== "user") {
      return NextResponse.json(
        { error: "Last message must be from the user" },
        { status: 400 }
      );
    }

    const history = messages.slice(-12);
    const systemPrompt = await buildPhojaaA1SystemPrompt(last.content);

    const openRouterMessages: ChatTurn[] = [
      { role: "system", content: systemPrompt },
      ...history.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    ];

    const reply = await completeWithOpenRouter(openRouterMessages);

    return NextResponse.json({ reply }, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Assistant unavailable";
    console.error("[Phojaa A1]", message);

    const userMessage = /429|rate/i.test(message)
      ? "Free AI is busy — please wait a few seconds and try again."
      : /timeout/i.test(message)
        ? "That took too long. Try a shorter question."
        : "Could not get a response. Please try again.";

    return NextResponse.json({ error: userMessage }, { status: 500 });
  }
}
