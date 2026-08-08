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

    // Admin-only vivid aurora layer: the base .glass-scene is near-white in
    // light mode with only faint corner blobs, so translucent admin cards
    // had nothing colorful to blur and read as solid white. This fixed layer
    // spreads saturated drifting color across the whole viewport (including
    // the centre) so .admin-glass surfaces blur it into real frosted glass.
    // z-index -9 sits above the base scene (-10) and below all admin content.
    const adminAurora = (
        <div aria-hidden className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: -9 }}>
            <div className="absolute rounded-full blur-4xl will-change-transform top-[-10%] left-[-5%] w-[42rem] h-[42rem] bg-sky/30 dark:bg-sky/45 animate-float-slow" />
            <div className="absolute rounded-full blur-4xl will-change-transform top-[12%] right-[-8%] w-[40rem] h-[40rem] bg-bhutan-gold/25 dark:bg-bhutan-gold/38 animate-float-slow [animation-delay:-6s]" />
            <div className="absolute rounded-full blur-4xl will-change-transform top-[28%] left-[30%] w-[38rem] h-[38rem] bg-emerald/20 dark:bg-emerald/34 animate-float-slow [animation-delay:-3s]" />
            <div className="absolute rounded-full blur-4xl will-change-transform top-[42%] right-[28%] w-[36rem] h-[36rem] bg-sky/22 dark:bg-sky/38 animate-float-slow [animation-delay:-8s]" />
            <div className="absolute rounded-full blur-4xl will-change-transform bottom-[-12%] left-[16%] w-[42rem] h-[42rem] bg-bhutan-red/22 dark:bg-bhutan-red/34 animate-float-slow [animation-delay:-11s]" />
            <div className="absolute rounded-full blur-4xl will-change-transform bottom-[6%] right-[12%] w-[38rem] h-[38rem] bg-bhutan-gold/20 dark:bg-bhutan-gold/30 animate-float-slow [animation-delay:-15s]" />
        </div>
    );

    if (isLoginPage) {
        return (
            <>
                {adminAurora}
                <div className="min-h-screen font-sans">{children}</div>
            </>
        );
    }

    return (
        <>
            {adminAurora}
            <div className="min-h-screen flex font-sans antialiased">
                <AdminSidebar unreadCount={unreadCount} />
                <div className="flex-1 flex flex-col min-h-screen ml-0 lg:ml-64 transition-all duration-300 ease-apple">
                    <AdminTopNav unreadCount={unreadCount} recentInquiries={recentInquiries} />
                    <main className="flex-1 overflow-auto min-h-0">
                        {children}
                    </main>
                </div>
            </div>
        </>
    );
}
