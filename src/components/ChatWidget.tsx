"use client";

import { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

interface ChatWidgetProps {
  propertyId: string;
  propertyTitle: string;
}

export default function ChatWidget({ propertyId, propertyTitle }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [chatId, setChatId] = useState<string | null>(null);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat session on mount
  useEffect(() => {
    const savedChatId = localStorage.getItem(`chat_${propertyId}`);
    if (savedChatId) {
      setChatId(savedChatId);
    }
  }, [propertyId]);

  // Poll for messages when chat is open and session exists
  useEffect(() => {
    let interval: NodeJS.Timeout;

    const fetchMessages = async () => {
      if (!chatId || !isOpen) return;
      try {
        const res = await fetch(`/api/chats/${chatId}/messages`);
        if (res.ok) {
          const data = await res.json();
          // checking if new messages arrived to sort of flash scroll to bottom
          if (data.length > messages.length) {
             setMessages(data);
          }
        }
      } catch (err) {
        console.error("Failed to fetch messages", err);
      }
    };

    if (isOpen && chatId) {
      fetchMessages(); // initial fetch
      interval = setInterval(fetchMessages, 4000); // Poll every 4 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isOpen, chatId, messages.length]);

  // Listen for custom event to open chat
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
        
        // Setup initial guest info locally so we dont have to refetch parent chat obj immediately
        localStorage.setItem(`guestName`, guestName);
      } else {
        toast({ title: "Error starting chat", variant: "destructive" });
      }
    } catch (err) {
      toast({ title: "Failed to connect", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !chatId) return;

    const currentText = inputText;
    setInputText(""); // optimistic clear

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
        setInputText(currentText); // revert on failure
      }
    } catch (err) {
      toast({ title: "Network error", variant: "destructive" });
      setInputText(currentText);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-4 right-24 md:bottom-8 md:right-28 lg:right-32 z-50 p-3.5 sm:p-4 bg-bhutan-red text-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:bg-bhutan-dark transition-all duration-300 transform hover:scale-110 ${
          isOpen ? "hidden" : "block"
        }`}
      >
        <div className="absolute inset-0 bg-bhutan-red rounded-full animate-ping opacity-20" />
        <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 relative z-10" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-4 right-4 left-4 sm:left-auto md:bottom-8 md:right-28 lg:right-32 z-[100] w-auto sm:w-[380px] sm:max-w-sm bg-white dark:bg-card rounded-2xl shadow-luxury border border-bhutan-gold/10 overflow-hidden flex flex-col max-h-[85vh]"
          >
            {/* Header */}
            <div className="bg-bhutan-dark p-4 flex items-center justify-between text-white border-b border-white/10">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                   <span className="font-bold text-base">Live Support</span>
                </div>
                <span className="text-sm font-medium text-white/80 truncate max-w-[200px]">{propertyTitle}</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/70 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="h-[350px] flex flex-col bg-[#F9F7F2] dark:bg-background">
              {!chatId ? (
                /* Registration Screen */
                <form onSubmit={handleStartChat} className="p-6 flex flex-col h-full justify-center space-y-4">
                  <div className="text-center mb-2">
                    <p className="text-bhutan-dark text-sm font-medium">Please introduce yourself before chatting with an admin.</p>
                  </div>
                  <Input
                    placeholder="Your Name"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    required
                    className="border-bhutan-gold/20 text-black text-base"
                  />
                  <Input
                    type="email"
                    placeholder="Your Email"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    required
                    className="border-bhutan-gold/20 text-black text-base"
                  />
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-bhutan-red hover:bg-bhutan-red/90 text-white"
                  >
                    Start Chatting
                  </Button>
                </form>
              ) : (
                /* Chat Messages Screen */
                <>
                  <div className="flex-1 p-4 overflow-y-auto space-y-3 custom-scrollbar">
                    {messages.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-bhutan-dark/40 text-sm">
                        <MessageSquare className="w-8 h-8 mb-2 opacity-20" />
                        <p>No messages yet. Say hello!</p>
                      </div>
                    ) : (
                      messages.map((msg, idx) => {
                        const isGuest = msg.sender === "guest";
                        return (
                          <motion.div
                            key={msg._id || idx}
                            initial={{ opacity: 0, x: isGuest ? 10 : -10, scale: 0.95 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            className={`flex flex-col ${isGuest ? "items-end" : "items-start"}`}
                          >
                            <div
                              className={`max-w-[85%] p-3.5 rounded-2xl text-base font-medium leading-relaxed ${
                                isGuest
                                  ? "bg-bhutan-red text-white rounded-br-none shadow-sm"
                                  : "bg-white border border-bhutan-gold/20 text-bhutan-dark rounded-bl-none shadow-sm"
                              }`}
                            >
                              {msg.text}
                            </div>
                            <span className="text-xs font-medium text-muted-foreground mt-1 px-1">
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

                  {/* Input Area */}
                  <div className="p-3 bg-white border-t border-bhutan-gold/10">
                    <form onSubmit={handleSendMessage} className="flex gap-2">
                      <Input
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 border-bhutan-gold/20 focus-visible:ring-bhutan-red text-black text-base"
                      />
                      <Button
                        type="submit"
                        size="icon"
                        disabled={!inputText.trim()}
                        className="bg-bhutan-red hover:bg-bhutan-red/90 text-white flex-shrink-0"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
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
