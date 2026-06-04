"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { X, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { AssistantMessage } from "@/components/chat/AssistantMessage";
import { PhojaaA1Fab, PhojaaA1Avatar } from "@/components/chat/PhojaaA1Fab";
import { PhojaaA1Icon } from "@/components/chat/PhojaaA1Icon";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const STORAGE_KEY = "phojaa_a1_chat_history";

const QUICK_PROMPTS = [
  "Show featured properties in Paro",
  "What is Phojaa95 Solutions?",
  "I need a website for my business",
  "How can I contact PHOJAA95?",
];

function loadHistory(): ChatMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ChatMessage[];
    return Array.isArray(parsed) ? parsed.slice(-20) : [];
  } catch {
    return [];
  }
}

export function PhojaaA1Chat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [warmedUp, setWarmedUp] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setMessages(loadHistory());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      /* ignore */
    }
  }, [messages, hydrated]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    if (!isOpen || warmedUp) return;
    fetch("/api/assistant")
      .then(() => setWarmedUp(true))
      .catch(() => {});
  }, [isOpen, warmedUp]);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  const submitText = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) return;

      const userMsg: ChatMessage = {
        id: `u-${Date.now()}`,
        role: "user",
        content: trimmed,
      };

      const previousMessages = messages;
      const nextMessages = [...messages, userMsg];
      setMessages(nextMessages);
      setInputText("");
      setIsLoading(true);

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const res = await fetch("/api/assistant", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: nextMessages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
          }),
          signal: controller.signal,
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          const err =
            typeof data.error === "string"
              ? data.error
              : "Phojaa A1 could not respond.";
          toast({ title: err, variant: "destructive" });
          setMessages(previousMessages);
          setInputText(trimmed);
          return;
        }

        const assistantMsg: ChatMessage = {
          id: `a-${Date.now()}`,
          role: "assistant",
          content: data.reply as string,
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;
        toast({
          title: "Network error",
          description: "Check your connection and try again.",
          variant: "destructive",
        });
        setMessages(previousMessages);
        setInputText(trimmed);
      } finally {
        setIsLoading(false);
        abortRef.current = null;
      }
    },
    [isLoading, messages, toast]
  );

  const sendMessage = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      submitText(inputText);
    },
    [inputText, submitText]
  );

  const clearChat = () => {
    abortRef.current?.abort();
    setMessages([]);
    setIsLoading(false);
    sessionStorage.removeItem(STORAGE_KEY);
  };

  return (
    <>
      <PhojaaA1Fab onClick={() => setIsOpen(true)} hidden={isOpen} />

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-4 right-4 left-4 sm:left-auto md:bottom-8 md:right-8 z-[100] w-auto sm:w-[400px] sm:max-w-sm bg-background rounded-apple-xl shadow-product border border-ink-100 dark:border-ink-700/40 overflow-hidden flex flex-col max-h-[85vh]"
          >
            <div className="bg-ink-900 text-white px-5 py-4 flex items-center justify-between gap-3">
              <div className="min-w-0 flex items-center gap-3">
                <PhojaaA1Avatar />
                <div className="min-w-0">
                  <p className="font-semibold text-[14px] leading-tight">
                    Phojaa A1
                  </p>
                  <p className="text-[12px] text-white/60 truncate">
                    Listings · Bhutan rules · Site help
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {messages.length > 0 && (
                  <button
                    type="button"
                    onClick={clearChat}
                    className="text-[11px] text-white/50 hover:text-white px-2 py-1 rounded-md hover:bg-white/10 transition-colors no-tap"
                  >
                    Clear
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center no-tap"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" strokeWidth={1.75} />
                </button>
              </div>
            </div>

            <div className="h-[400px] flex flex-col bg-fog dark:bg-ink-900/40">
              <div className="flex-1 px-4 py-4 overflow-y-auto space-y-3">
                {messages.length === 0 ? (
                  <div className="flex flex-col gap-4">
                    <div className="text-center text-ink-400 text-[13px] px-2 pt-2">
                      <div className="mx-auto mb-3 w-14 h-14 rounded-full bg-gradient-to-br from-sky/15 to-sky-deep/10 border border-sky/20 flex items-center justify-center">
                        <PhojaaA1Icon size="xl" className="opacity-90" />
                      </div>
                      <p className="text-foreground font-medium text-[14px] mb-1">
                        Hi, I&apos;m Phojaa A1
                      </p>
                      <p>
                        I know our live listings, site pages, and Bhutan property
                        basics. Tap a suggestion or type below.
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {QUICK_PROMPTS.map((prompt) => (
                        <button
                          key={prompt}
                          type="button"
                          disabled={isLoading}
                          onClick={() => submitText(prompt)}
                          className="text-left text-[12px] px-3 py-2 rounded-full border border-ink-200 dark:border-ink-700 bg-white dark:bg-card text-ink-600 hover:border-sky hover:text-foreground transition-colors no-tap disabled:opacity-50"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isUser = msg.role === "user";
                    return (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 8, x: isUser ? 6 : -6 }}
                        animate={{ opacity: 1, y: 0, x: 0 }}
                        className={`flex flex-col ${
                          isUser ? "items-end" : "items-start"
                        }`}
                      >
                        {!isUser && (
                          <span className="text-[10px] font-medium text-ink-400 mb-1 px-1">
                            Phojaa A1
                          </span>
                        )}
                        <div
                          className={`max-w-[90%] px-3.5 py-2.5 rounded-2xl text-[14px] ${
                            isUser
                              ? "bg-sky text-white rounded-br-md leading-snug whitespace-pre-wrap"
                              : "bg-white dark:bg-card text-foreground border border-ink-100 dark:border-ink-700/40 rounded-bl-md"
                          }`}
                        >
                          {isUser ? (
                            msg.content
                          ) : (
                            <AssistantMessage content={msg.content} />
                          )}
                        </div>
                      </motion.div>
                    );
                  })
                )}
                {isLoading && (
                  <div className="flex items-start gap-2 text-[13px] text-ink-400 px-1">
                    <span className="inline-flex gap-1 pt-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky/60 animate-pulse" />
                      <span className="w-1.5 h-1.5 rounded-full bg-sky/60 animate-pulse [animation-delay:150ms]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-sky/60 animate-pulse [animation-delay:300ms]" />
                    </span>
                    Finding the best answer…
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-3 bg-background border-t border-ink-100 dark:border-ink-700/40">
                <form onSubmit={sendMessage} className="flex gap-2">
                  <input
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Ask about listings, land rules…"
                    disabled={isLoading}
                    className="input-apple flex-1 py-2.5 text-[14px]"
                    aria-label="Message to Phojaa A1"
                  />
                  <button
                    type="submit"
                    disabled={!inputText.trim() || isLoading}
                    className="btn-primary w-10 h-10 p-0 shrink-0"
                    aria-label="Send"
                  >
                    <Send className="w-4 h-4" strokeWidth={1.75} />
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
