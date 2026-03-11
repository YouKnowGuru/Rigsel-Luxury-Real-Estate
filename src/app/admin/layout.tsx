"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopNav } from "@/components/admin/AdminTopNav";
import { useToast } from "@/hooks/use-toast";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isLoginPage = pathname === "/admin";
    const [unreadCount, setUnreadCount] = useState(0);
    const [recentInquiries, setRecentInquiries] = useState<any[]>([]);
    const { toast } = useToast();

    useEffect(() => {
        if (!isLoginPage) {
            fetchStats();
            // Poll every 15 seconds for new messages
            const interval = setInterval(fetchStats, 15000);
            return () => clearInterval(interval);
        }
    }, [isLoginPage]);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem("adminToken");
            if (!token) return;
            const res = await fetch("/api/admin/stats", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (data.success) {
                const newCount = data.data.unreadInquiries || 0;

                // If count increased, show toast
                if (newCount > unreadCount) {
                    toast({
                        title: "New Inquiry",
                        description: `You have ${newCount} unread message${newCount > 1 ? 's' : ''}.`,
                        variant: "success",
                    });
                }

                setUnreadCount(newCount);
                setRecentInquiries(data.data.recentInquiries || []);
            }
        } catch {
            // silently ignore
        }
    };

    if (isLoginPage) {
        return <div className="min-h-screen bg-bhutan-dark">{children}</div>;
    }

    return (
        <div className="min-h-screen bg-[#F9F7F2] flex">
            <AdminSidebar unreadCount={unreadCount} />
            <div className="flex-1 flex flex-col min-h-screen lg:ml-64 transition-all duration-300">
                <AdminTopNav unreadCount={unreadCount} recentInquiries={recentInquiries} />
                <main className="flex-1 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
