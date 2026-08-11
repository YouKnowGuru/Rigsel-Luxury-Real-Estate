const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const REQUEST_TIMEOUT_MS = 55_000;
const MAX_RETRIES = 2;

export type ChatRole = "user" | "assistant" | "system";

export interface ChatTurn {
  role: ChatRole;
  content: string;
}

const DEFAULT_MODEL = "openrouter/free";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function completeWithOpenRouter(
  messages: ChatTurn[],
  options?: { model?: string; maxTokens?: number }
): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is not configured");
  }

  const model = options?.model || process.env.OPENROUTER_MODEL || DEFAULT_MODEL;
  const siteUrl =
    process.env.OPENROUTER_SITE_URL ||
    process.env.NEXTAUTH_URL ||
    "https://phojaarealestate.com";
  const siteName = process.env.OPENROUTER_SITE_NAME || "PHOJAA95 Real Estate";

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await fetch(OPENROUTER_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": siteUrl,
          "X-Title": siteName,
        },
        body: JSON.stringify({
          model,
          messages,
          max_tokens: options?.maxTokens ?? 700,
          temperature: 0.35,
          top_p: 0.9,
          frequency_penalty: 0.2,
          provider: { allow_fallbacks: true },
        }),
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });

      const raw = await res.text();
      let data: {
        choices?: { message?: { content?: string } }[];
        error?: { message?: string; code?: number };
      } = {};

      try {
        data = JSON.parse(raw);
      } catch {
        throw new Error(`Invalid OpenRouter response (${res.status})`);
      }

      if (!res.ok) {
        const msg = data.error?.message || raw.slice(0, 200);
        const retryable = res.status === 429 || res.status >= 500;
        if (retryable && attempt < MAX_RETRIES) {
          await sleep(1200 * (attempt + 1));
          continue;
        }
        throw new Error(`OpenRouter ${res.status}: ${msg}`);
      }

      if (data.error?.message) {
        throw new Error(data.error.message);
      }

      const content = data.choices?.[0]?.message?.content?.trim();
      if (!content) {
        throw new Error("Empty response from OpenRouter");
      }

      return polishReply(content);
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      const retryable =
        lastError.name === "TimeoutError" ||
        /429|503|502|rate|timeout/i.test(lastError.message);
      if (retryable && attempt < MAX_RETRIES) {
        await sleep(1200 * (attempt + 1));
        continue;
      }
      throw lastError;
    }
  }

  throw lastError ?? new Error("OpenRouter request failed");
}

/** Trim noise common with free models */
function polishReply(text: string): string {
  return text
    .replace(/^(Sure!|Certainly!|Of course!|Great question!)\s*/i, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
