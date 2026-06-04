"use client";

import { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "next/navigation";

interface ChatWidgetProps {
  propertyId?: string;
  propertyTitle?: string;
}

export default function ChatWidget({
  propertyId: propertyIdProp,
  propertyTitle: propertyTitleProp,
}: ChatWidgetProps) {
  const params = useParams();
  const propertyId =
    propertyIdProp || (params?.id as string | undefined) || "general";
  const propertyTitle = propertyTitleProp || "your inquiry";

  const [isOpen, setIsOpen] = useState(false);
  const [chatId, setChatId] = useState<string | null>(null);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedChatId = localStorage.getItem(`chat_${propertyId}`);
    if (savedChatId) setChatId(savedChatId);
  }, [propertyId]);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;

    const fetchMessages = async () => {
      if (!chatId || !isOpen) return;
      try {
        const res = await fetch(`/api/chats/${chatId}/messages`);
        if (res.ok) {
          const data = await res.json();
          if (data.length > messages.length) setMessages(data);
        }
      } catch (err) {
        console.error("Failed to fetch messages", err);
      }
    };

    if (isOpen && chatId) {
      fetchMessages();
      interval = setInterval(fetchMessages, 4000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isOpen, chatId, messages.length]);

  useEffect(() => {
    const handleOpenChat = () => setIsOpen(true);
    window.addEventListener("open-chat", handleOpenChat);
    return () => window.removeEventListener("open-chat", handleOpenChat);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleStartChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName || !guestEmail) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/chats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propertyId, guestName, guestEmail }),
      });

      if (res.ok) {
        const data = await res.json();
        setChatId(data._id);
        localStorage.setItem(`chat_${propertyId}`, data._id);
        localStorage.setItem(`guestName`, guestName);
      } else {
        toast({ title: "Error starting chat", variant: "destructive" });
      }
    } catch {
      toast({ title: "Failed to connect", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !chatId) return;

    const currentText = inputText;
    setInputText("");

    try {
      const res = await fetch(`/api/chats/${chatId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: currentText }),
      });

      if (res.ok) {
        const newMessage = await res.json();
        setMessages((prev) => [...prev, newMessage]);
      } else {
        toast({ title: "Failed to send message", variant: "destructive" });
        setInputText(currentText);
      }
    } catch {
      toast({ title: "Network error", variant: "destructive" });
      setInputText(currentText);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-20 right-4 sm:bottom-24 sm:right-6 z-50 w-12 h-12 sm:w-[52px] sm:h-[52px] bg-foreground text-background rounded-full shadow-lifted hover:bg-ink-700 transition-all duration-fast hover:scale-105 flex items-center justify-center no-tap ${
          isOpen ? "hidden" : "flex"
        }`}
        aria-label="Open chat"
      >
        <MessageSquare className="w-5 h-5" strokeWidth={1.75} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-4 right-4 left-4 sm:left-auto md:bottom-8 md:right-28 lg:right-32 z-[100] w-auto sm:w-[380px] sm:max-w-sm bg-background rounded-apple-xl shadow-product border border-ink-100 dark:border-ink-700/40 overflow-hidden flex flex-col max-h-[85vh]"
          >
            {/* Header */}
            <div className="bg-ink-900 text-white px-5 py-4 flex items-center justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-emerald rounded-full animate-pulse" />
                  <span className="font-semibold text-[14px]">Live support</span>
                </div>
                <p className="text-[12px] text-white/60 truncate max-w-[220px]">
                  {propertyTitle}
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center no-tap"
                aria-label="Close"
              >
                <X className="w-4 h-4" strokeWidth={1.75} />
              </button>
            </div>

            <div className="h-[360px] flex flex-col bg-fog dark:bg-ink-900/40">
              {!chatId ? (
                <form
                  onSubmit={handleStartChat}
                  className="p-6 flex flex-col h-full justify-center space-y-3"
                >
                  <p className="text-[14px] text-ink-500 text-center mb-2">
                    Introduce yourself to start the conversation.
                  </p>
                  <input
                    placeholder="Your name"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    required
                    className="input-apple"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    required
                    className="input-apple"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary-lg w-full"
                  >
                    {isSubmitting ? "Connecting…" : "Start chatting"}
                  </button>
                </form>
              ) : (
                <>
                  <div className="flex-1 px-4 py-4 overflow-y-auto space-y-3">
                    {messages.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-ink-400 text-[13px]">
                        <MessageSquare
                          className="w-7 h-7 mb-2 opacity-50"
                          strokeWidth={1.5}
                        />
                        <p>No messages yet. Say hello.</p>
                      </div>
                    ) : (
                      messages.map((msg, idx) => {
                        const isGuest = msg.sender === "guest";
                        return (
                          <motion.div
                            key={msg._id || idx}
                            initial={{
                              opacity: 0,
                              y: 8,
                              x: isGuest ? 6 : -6,
                            }}
                            animate={{ opacity: 1, y: 0, x: 0 }}
                            className={`flex flex-col ${
                              isGuest ? "items-end" : "items-start"
                            }`}
                          >
                            <div
                              className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-[14px] leading-snug ${
                                isGuest
                                  ? "bg-sky text-white rounded-br-md"
                                  : "bg-white dark:bg-card text-foreground border border-ink-100 dark:border-ink-700/40 rounded-bl-md"
                              }`}
                            >
                              {msg.text}
                            </div>
                            <span className="text-[10px] text-ink-400 mt-1 px-1 tabular-nums">
                              {new Date(msg.createdAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </motion.div>
                        );
                      })
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  <div className="p-3 bg-background border-t border-ink-100 dark:border-ink-700/40">
                    <form onSubmit={handleSendMessage} className="flex gap-2">
                      <input
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Type a message…"
                        className="input-apple flex-1 py-2.5 text-[14px]"
                      />
                      <button
                        type="submit"
                        disabled={!inputText.trim()}
                        className="btn-primary w-10 h-10 p-0 shrink-0"
                        aria-label="Send"
                      >
                        <Send className="w-4 h-4" strokeWidth={1.75} />
                      </button>
                    </form>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
