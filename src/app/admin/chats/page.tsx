"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Send, Search, Clock, Home, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function AdminChatsPage() {
  const [chats, setChats] = useState<any[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const fetchChats = async () => {
    try {
      const res = await fetch("/api/admin/chats");
      if (res.ok) {
        const data = await res.json();
        setChats(data);
      }
    } catch (error) {
      console.error("Failed to fetch chats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMessages = async (chatId: string) => {
    try {
      const res = await fetch(`/api/chats/${chatId}/messages`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  };

  useEffect(() => {
    fetchChats();
    const chatInterval = setInterval(fetchChats, 10000);
    return () => clearInterval(chatInterval);
  }, []);

  useEffect(() => {
    if (activeChatId) {
      fetchMessages(activeChatId);
      const msgInterval = setInterval(() => fetchMessages(activeChatId), 4000);
      return () => clearInterval(msgInterval);
    }
  }, [activeChatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleDeleteChat = async (chatId: string) => {
    if (!window.confirm("Are you sure you want to delete this chat? This will remove all messages.")) return;

    try {
      const res = await fetch(`/api/admin/chats/${chatId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast({ title: "Chat deleted successfully" });
        setActiveChatId(null);
        setMessages([]);
        fetchChats();
      } else {
        toast({ title: "Failed to delete chat", variant: "destructive" });
      }
    } catch (err) {
      toast({ title: "Network error", variant: "destructive" });
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeChatId) return;

    const currentText = inputText;
    setInputText("");

    try {
      const res = await fetch(`/api/chats/${activeChatId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: currentText }),
      });

      if (res.ok) {
        const newMessage = await res.json();
        setMessages((prev) => [...prev, newMessage]);
        fetchChats();
      } else {
        toast({ title: "Failed to send message", variant: "destructive" });
        setInputText(currentText);
      }
    } catch (err) {
      toast({ title: "Network error", variant: "destructive" });
      setInputText(currentText);
    }
  };

  const activeChat = chats.find((c) => c._id === activeChatId);

  const filteredChats = chats.filter(
    (chat) =>
      chat.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.propertyId?.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-3 sm:p-5 lg:p-8 max-w-[1600px] mx-auto space-y-4 sm:space-y-6 h-[calc(100vh-60px)] flex flex-col">
      {/* Header */}
      <div className="shrink-0">
        <p className="text-sky text-[11px] sm:text-[12px] font-semibold uppercase tracking-[0.12em] mb-1">Live Conversations</p>
        <h1 className="text-[22px] sm:text-[26px] lg:text-[28px] font-semibold text-foreground tracking-tight">Live Chats</h1>
        <p className="text-ink-600 text-sm sm:text-base font-medium mt-1">
          Connect with clients inquiring about properties in real-time.
        </p>
      </div>

      {/* Chat Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-3 sm:gap-4 lg:gap-5 min-h-0">
        {/* Sidebar: Chat List */}
        <div className="bg-card rounded-2xl sm:rounded-[20px] border border-ink-100/60 shadow-soft flex flex-col overflow-hidden">
          <div className="p-3 sm:p-4 border-b border-ink-100/60">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" strokeWidth={1.5} />
              <Input
                placeholder="Search chats..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 sm:h-10 rounded-xl border-ink-200 focus:border-sky focus:ring-2 focus:ring-sky/15 text-foreground text-sm"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-1.5 sm:p-2 scrollbar-none">
            {isLoading ? (
              <div className="flex justify-center p-4 sm:p-8">
                <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-sky/20 border-t-sky rounded-full animate-spin" />
              </div>
            ) : filteredChats.length === 0 ? (
              <div className="text-center p-4 sm:p-8 text-ink-400">
                <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 opacity-50" strokeWidth={1.5} />
                <p className="text-xs sm:text-sm">No active chats found.</p>
              </div>
            ) : (
              <div className="space-y-0.5 sm:space-y-1">
                {filteredChats.map((chat) => (
                  <button
                    key={chat._id}
                    onClick={() => setActiveChatId(chat._id)}
                    className={`w-full text-left p-2.5 sm:p-3 rounded-xl transition-all ${
                      activeChatId === chat._id
                        ? "bg-sky/5 border border-sky/20"
                        : "hover:bg-ink-50/50 border border-transparent"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1 sm:mb-1.5">
                      <span className="font-semibold text-foreground truncate pr-2 text-sm sm:text-base">
                        {chat.guestName}
                      </span>
                      <span className="text-[11px] sm:text-xs text-ink-500 flex items-center gap-1 shrink-0">
                        <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" strokeWidth={1.5} />
                        {formatDistanceToNow(new Date(chat.lastMessageAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs sm:text-sm text-ink-600 truncate font-medium">
                      <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" strokeWidth={1.5} />
                      <span className="truncate">{chat.propertyId?.title || "Unknown Property"}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="bg-card rounded-2xl sm:rounded-[20px] border border-ink-100/60 shadow-soft flex flex-col overflow-hidden min-h-0">
          {activeChat ? (
            <>
              {/* Chat Header */}
              <div className="p-3 sm:p-4 border-b border-ink-100/60 bg-ink-50/30 flex items-center justify-between gap-2 sm:gap-4 shrink-0">
                <div className="min-w-0 flex-1">
                  <h2 className="font-semibold text-foreground flex items-center gap-2 sm:gap-2.5 text-sm sm:text-base">
                    <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)] shrink-0" />
                    <span className="truncate">{activeChat.guestName}</span>
                    <span className="px-1.5 sm:px-2 py-0.5 bg-green-100 text-green-700 text-[10px] sm:text-[11px] rounded-full uppercase tracking-[0.12em] font-semibold whitespace-nowrap shrink-0">
                      Active
                    </span>
                  </h2>
                  <div className="text-xs sm:text-sm font-medium text-ink-700 truncate mt-0.5">
                    Inquiring about: {activeChat.propertyId?.title}
                  </div>
                  <div className="text-[11px] sm:text-xs font-medium text-ink-500 mt-0.5 truncate">
                    {activeChat.guestEmail}
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                  {activeChat.propertyId?.images?.[0] && (
                    <div className="w-10 h-8 sm:w-14 sm:h-10 rounded-md sm:rounded-lg overflow-hidden border border-ink-100/60 shrink-0 hidden sm:block">
                      <img
                        src={activeChat.propertyId.images[0]}
                        alt="Property"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteChat(activeChat._id)}
                    className="text-ink-400 hover:text-red-500 hover:bg-red-50 transition-colors h-8 w-8 sm:h-9 sm:w-9"
                    title="Delete Chat"
                  >
                    <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={1.5} />
                  </Button>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 p-3 sm:p-4 overflow-y-auto space-y-2.5 sm:space-y-3 scrollbar-none min-h-0">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-ink-400">
                    <MessageSquare className="w-10 h-10 sm:w-12 sm:h-12 mb-3 opacity-20" strokeWidth={1.5} />
                    <p className="text-sm">No messages yet.</p>
                  </div>
                ) : (
                  messages.map((msg, idx) => {
                    const isAdmin = msg.sender === "admin";
                    return (
                      <div
                        key={idx}
                        className={`flex flex-col ${
                          isAdmin ? "items-end" : "items-start"
                        }`}
                      >
                        <div
                          className={`max-w-[88%] sm:max-w-[80%] p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl text-sm sm:text-[15px] font-medium leading-relaxed ${
                            isAdmin
                              ? "bg-sky text-white rounded-br-sm"
                              : "bg-ink-50 border border-ink-100 text-foreground rounded-bl-sm"
                          }`}
                        >
                          {msg.text}
                        </div>
                        <span className="text-[10px] sm:text-xs font-medium text-ink-400 mt-1 px-1">
                          {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-3 sm:p-4 border-t border-ink-100/60 bg-card shrink-0">
                <form onSubmit={handleSendMessage} className="flex gap-2 sm:gap-3">
                  <Input
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type your reply..."
                    className="flex-1 h-9 sm:h-11 rounded-xl border-ink-200 focus:border-sky focus:ring-2 focus:ring-sky/15 text-foreground text-sm"
                  />
                  <Button
                    type="submit"
                    disabled={!inputText.trim()}
                    className="h-9 sm:h-11 px-4 sm:px-6 bg-sky hover:bg-sky/90 text-white rounded-full gap-1.5 sm:gap-2"
                  >
                    <span className="hidden sm:inline text-sm">Send</span>
                    <Send className="w-4 h-4 sm:w-4 sm:h-4" strokeWidth={1.5} />
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-ink-400 space-y-3 sm:space-y-4 px-4">
              <div className="w-14 h-14 sm:w-20 sm:h-20 bg-ink-50/50 rounded-full flex items-center justify-center">
                <MessageSquare className="w-7 h-7 sm:w-10 sm:h-10 text-ink-300" strokeWidth={1.5} />
              </div>
              <div className="text-center">
                <p className="font-semibold text-ink-600 text-sm sm:text-base mb-1">No Chat Selected</p>
                <p className="text-xs sm:text-sm">Select a chat from the sidebar to view messages.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
