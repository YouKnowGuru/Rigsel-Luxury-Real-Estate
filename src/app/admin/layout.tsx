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
            const interval = setInterval(fetchStats, 60000);
            return () => clearInterval(interval);
        }
    }, [isLoginPage]);

    const fetchStats = async () => {
        try {
            const res = await fetch("/api/admin/stats");
            const data = await res.json();
            if (data.success) {
                const newCount = data.data.unreadInquiries || 0;
                const prevCount = unreadCount;
                if (newCount > prevCount) {
                    toast({
                        title: "New Inquiry",
                        description: `You have ${newCount} unread message${newCount > 1 ? 's' : ''}.`,
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
        return <div className="min-h-screen bg-fog-light dark:bg-card font-sans">{children}</div>;
    }

    return (
        <div className="min-h-screen bg-fog-light dark:bg-card flex font-sans antialiased">
            <AdminSidebar unreadCount={unreadCount} />
            <div className="flex-1 flex flex-col min-h-screen ml-0 lg:ml-64 transition-all duration-300 ease-apple">
                <AdminTopNav unreadCount={unreadCount} recentInquiries={recentInquiries} />
                <main className="flex-1 overflow-auto min-h-0">
                    {children}
                </main>
            </div>
        </div>
    );
}
