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
      const token = localStorage.getItem("adminToken");
      const res = await fetch("/api/admin/chats", {
        headers: { Authorization: `Bearer ${token}` }
      });
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
      const token = localStorage.getItem("adminToken");
      const headers: any = {};
      if (token) {
         headers.Authorization = `Bearer ${token}`;
      }
      
      const res = await fetch(`/api/chats/${chatId}/messages`, {
         headers
      });
      
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
    // Poll for new chats every 10 seconds
    const chatInterval = setInterval(fetchChats, 10000);
    return () => clearInterval(chatInterval);
  }, []);

  useEffect(() => {
    if (activeChatId) {
      fetchMessages(activeChatId);
      // Poll for new messages every 4 seconds
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
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`/api/admin/chats/${chatId}`, {
        method: "DELETE",
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
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
    setInputText(""); // optimistic clear

    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`/api/chats/${activeChatId}/messages`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          ...(token && { "Authorization": `Bearer ${token}` })
        },
        body: JSON.stringify({ text: currentText }),
      });

      if (res.ok) {
        const newMessage = await res.json();
        setMessages((prev) => [...prev, newMessage]);
        fetchChats(); // Update last message time in sidebar
      } else {
        toast({ title: "Failed to send message", variant: "destructive" });
        setInputText(currentText); // revert on failure
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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-bhutan-dark">Live Chats</h1>
        <p className="text-muted-foreground mt-1 text-sm md:text-base">
          Connect with clients inquiring about properties in real-time.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-220px)] min-h-[500px]">
        {/* Sidebar: Chat List */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search chats..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-gray-50 border-transparent focus:bg-white transition-colors text-black text-base"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto w-full custom-scrollbar p-2">
            {isLoading ? (
              <div className="flex justify-center p-8">
                <div className="w-6 h-6 border-2 border-bhutan-red border-t-transparent rounded-full animate-spin" />
              </div>
            ) : filteredChats.length === 0 ? (
              <div className="text-center p-8 text-gray-400">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No active chats found.</p>
              </div>
            ) : (
              <div className="space-y-1">
                {filteredChats.map((chat) => (
                  <button
                    key={chat._id}
                    onClick={() => setActiveChatId(chat._id)}
                    className={`w-full text-left p-3 rounded-xl transition-all ${
                      activeChatId === chat._id
                        ? "bg-bhutan-red/5 border border-bhutan-red/20"
                        : "hover:bg-gray-50 border border-transparent"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1.5">
                      <span className="font-bold text-bhutan-dark truncate pr-2 text-base">
                        {chat.guestName}
                      </span>
                      <span className="text-[11px] text-gray-500 flex items-center gap-1 shrink-0">
                        <Clock className="w-3.5 h-3.5" />
                        {formatDistanceToNow(new Date(chat.lastMessageAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-bhutan-dark/70 truncate font-medium">
                      <Home className="w-4 h-4 shrink-0" />
                      <span className="truncate">{chat.propertyId?.title || "Unknown Property"}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
          {activeChat ? (
            <>
              {/* Chat Header */}
                <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-bhutan-dark flex items-center gap-3 text-lg">
                    <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                    {activeChat.guestName}
                    <span className="px-2.5 py-1 bg-green-100 text-green-700 text-[11px] rounded-full uppercase tracking-wider font-bold">
                      Active
                    </span>
                  </h2>
                  <div className="text-base font-medium text-bhutan-dark/80 truncate max-w-md mt-1">
                    Inquiring about: {activeChat.propertyId?.title}
                  </div>
                  <div className="text-sm font-medium text-bhutan-dark/60 mt-0.5">
                    {activeChat.guestEmail}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {activeChat.propertyId?.images?.[0] && (
                    <div className="w-16 h-12 rounded-lg overflow-hidden border border-gray-200 shrink-0">
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
                    className="text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    title="Delete Chat"
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#F9F7F2]/30 custom-scrollbar">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400">
                    <MessageSquare className="w-12 h-12 mb-3 opacity-20" />
                    <p>No messages yet.</p>
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
                          className={`max-w-[85%] p-4 rounded-2xl text-[17px] shadow-sm font-medium leading-relaxed ${
                            isAdmin
                              ? "bg-bhutan-dark text-white rounded-br-none"
                              : "bg-white border border-gray-200 text-bhutan-dark rounded-bl-none"
                          }`}
                        >
                          {msg.text}
                        </div>
                        <span className="text-xs font-medium text-gray-500 mt-1.5 px-1">
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
              <div className="p-4 border-t border-gray-100 bg-white">
                <form onSubmit={handleSendMessage} className="flex gap-3">
                  <Input
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type your reply..."
                    className="flex-1 bg-gray-50 border-transparent focus:bg-white h-12 rounded-xl text-black text-base md:text-lg"
                  />
                  <Button
                    type="submit"
                    disabled={!inputText.trim()}
                    className="h-12 px-6 bg-bhutan-red hover:bg-bhutan-dark text-white rounded-xl gap-2"
                  >
                    <span>Send</span>
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                <MessageSquare className="w-10 h-10 text-gray-300" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-gray-600 mb-1">No Chat Selected</p>
                <p className="text-sm">Select a chat from the sidebar to view messages.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
