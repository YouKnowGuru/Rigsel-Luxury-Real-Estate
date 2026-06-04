"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Building2, MessageSquare, TrendingUp, Star, Plus, ArrowUpRight,
  Clock, ArrowRight, AlertCircle, Home,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

function useIsDark() {
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains("dark"));
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);
  return isDark;
}

interface StatsData {
  totalProperties: number;
  totalInquiries: number;
  featuredProperties: number;
  recentListings: number;
  unreadInquiries: number;
  recentProperties: Array<{ _id: string; title: string; price: number; featured: boolean; propertyType: string }>;
  recentInquiries: Array<{ _id: string; name: string; message: string; createdAt: string; isRead: boolean }>;
}

interface ChartDataPoint {
  name: string;
  properties: number;
  inquiries: number;
}

function useAnimatedCounter(target: number, duration = 1200) {
  const [count, setCount] = useState(0);
  const frameRef = useRef<number>();

  useEffect(() => {
    if (target === 0) return;
    const start = performance.now();
    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  }, [target, duration]);

  return count;
}

function StatCard({
  name, value, change, icon: Icon, delay, accent = "sky",
}: {
  name: string; value: number; change: string; icon: React.ElementType; delay: number; accent?: "sky" | "emerald" | "amber" | "violet";
}) {
  const animated = useAnimatedCounter(value);
  const accentMap = {
    sky: "bg-sky/8 text-sky",
    emerald: "bg-emerald/10 text-emerald",
    amber: "bg-amber/10 text-amber",
    violet: "bg-violet/10 text-violet",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      className="bg-card rounded-[20px] border border-ink-100/60 shadow-soft p-5 hover:shadow-elevated transition-shadow duration-300 group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={cn("w-10 h-10 rounded-[14px] flex items-center justify-center transition-transform duration-300 group-hover:scale-105", accentMap[accent])}>
          <Icon className="w-5 h-5" strokeWidth={1.5} />
        </div>
        <div className="flex items-center gap-1 text-emerald-600 text-[12px] font-semibold bg-emerald-50/80 px-2.5 py-1 rounded-full">
          <ArrowUpRight className="w-3 h-3" strokeWidth={2.5} />
          {change}
        </div>
      </div>
      <p className="text-[32px] font-semibold text-foreground tracking-tight mb-0.5">
        {animated.toLocaleString()}
      </p>
      <p className="text-[13px] text-ink-400 font-medium">{name}</p>
    </motion.div>
  );
}

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 dark:bg-card/95 backdrop-blur-xl border border-ink-100/80 rounded-[16px] p-3 shadow-lifted">
        <p className="text-[11px] sm:text-[13px] sm:text-[13px] text-ink-400 font-semibold uppercase tracking-wider mb-2">{label}</p>
        {payload.map((entry: any) => (
          <div key={entry.name} className="flex items-center gap-2 text-[13px]">
            <span className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
            <span className="text-ink-400">{entry.name}:</span>
            <span className="text-foreground font-semibold">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const isDark = useIsDark();
  const chartGridColor = isDark ? "#2C2C2E" : "#F0F0F2";
  const chartTickColor = isDark ? "#A1A1A6" : "#86868B";

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, chartRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/admin/stats/charts"),
      ]);
      const statsData = await statsRes.json();
      const chartDataRes = await chartRes.json();
      if (statsData.success) setStats(statsData.data);
      if (chartDataRes.success) setChartData(chartDataRes.data);
    } catch (e) {
      console.error("Dashboard fetch error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-[2.5px] border-sky/15 border-t-sky rounded-full"
          />
          <p className="text-ink-400 text-[13px] font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    { name: "Total Properties", value: stats?.totalProperties ?? 0, change: `+${stats?.recentListings ?? 0} this month`, icon: Building2, accent: "sky" as const },
    { name: "Total Inquiries", value: stats?.totalInquiries ?? 0, change: `${stats?.unreadInquiries ?? 0} unread`, icon: MessageSquare, accent: "emerald" as const },
    { name: "Featured Listings", value: stats?.featuredProperties ?? 0, change: "Highlighted", icon: Star, accent: "amber" as const },
    { name: "New This Month", value: stats?.recentListings ?? 0, change: "Last 30 days", icon: TrendingUp, accent: "violet" as const },
  ];

  return (
    <div className="p-5 md:p-8 lg:p-10 max-w-[1440px] mx-auto">
      {/* Header */}
      <header className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-sky text-[12px] font-semibold uppercase tracking-[0.12em] mb-1.5"
          >
            Overview
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="text-[28px] md:text-[32px] font-semibold text-foreground tracking-tight"
          >
            Dashboard
          </motion.h1>
        </div>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 }}>
          <Link
            href="/admin/properties/new"
            className="inline-flex items-center gap-2 h-11 px-5 rounded-full bg-sky text-white text-[14px] font-medium hover:bg-sky-hover active:scale-[0.98] transition-all duration-200"
          >
            <Plus className="w-4 h-4" strokeWidth={2} />
            Add Property
          </Link>
        </motion.div>
      </header>

      {/* Unread Alert */}
      {(stats?.unreadInquiries ?? 0) > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-4 bg-sky/[0.04] border border-sky/15 rounded-[20px] flex items-center gap-3"
        >
          <div className="w-9 h-9 rounded-full bg-sky/10 flex items-center justify-center shrink-0">
            <AlertCircle className="w-[18px] h-[18px] text-sky" strokeWidth={1.5} />
          </div>
          <p className="text-[14px] text-ink-600">
            You have <span className="font-semibold text-foreground">{stats?.unreadInquiries}</span> unread{" "}
            {(stats?.unreadInquiries ?? 0) === 1 ? "inquiry" : "inquiries"}.
          </p>
          <Link href="/admin/inquiries" className="ml-auto text-[13px] font-semibold text-sky hover:underline">
            View All &rarr;
          </Link>
        </motion.div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat, i) => (
          <StatCard key={stat.name} {...stat} delay={i * 0.08} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-card rounded-[20px] border border-ink-100/60 shadow-soft p-6"
        >
          <div className="mb-5">
            <h3 className="font-semibold text-foreground text-[16px]">Properties Added</h3>
            <p className="text-[12px] text-ink-400 mt-0.5 font-medium">Last 12 months</p>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="propGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0071E3" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#0071E3" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: chartTickColor }} axisLine={false} tickLine={false} dy={8} />
              <YAxis tick={{ fontSize: 11, fill: chartTickColor }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="properties" name="Properties" stroke="#0071E3" strokeWidth={2} fill="url(#propGrad)" dot={{ fill: "#0071E3", r: 3, strokeWidth: 0 }} activeDot={{ r: 5, strokeWidth: 0, fill: "#0071E3" }} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="bg-card rounded-[20px] border border-ink-100/60 shadow-soft p-6"
        >
          <div className="mb-5">
            <h3 className="font-semibold text-foreground text-[16px]">Inquiries Received</h3>
            <p className="text-[12px] text-ink-400 mt-0.5 font-medium">Last 12 months</p>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="inqGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#34C759" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#34C759" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: chartTickColor }} axisLine={false} tickLine={false} dy={8} />
              <YAxis tick={{ fontSize: 11, fill: chartTickColor }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="inquiries" name="Inquiries" stroke="#34C759" strokeWidth={2} fill="url(#inqGrad)" dot={{ fill: "#34C759", r: 3, strokeWidth: 0 }} activeDot={{ r: 5, strokeWidth: 0, fill: "#34C759"}} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
        {/* Recent Inquiries */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="xl:col-span-3 bg-card rounded-[20px] border border-ink-100/60 shadow-soft overflow-hidden"
        >
          <div className="p-5 border-b border-ink-100/60 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-foreground text-[16px]">Recent Inquiries</h3>
              <p className="text-[12px] text-ink-400 mt-0.5 font-medium flex items-center gap-1">
                <Clock className="w-3 h-3" strokeWidth={2} /> Latest communications
              </p>
            </div>
            <Link href="/admin/inquiries" className="text-[13px] font-semibold text-sky hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-3 h-3" strokeWidth={2} />
            </Link>
          </div>
          <div className="divide-y divide-ink-100/60">
            {(stats?.recentInquiries ?? []).length === 0 ? (
              <div className="py-14 text-center">
                <MessageSquare className="w-9 h-9 text-ink-200 mx-auto mb-2" strokeWidth={1.5} />
                <p className="text-[14px] text-ink-400 font-medium">No inquiries yet</p>
              </div>
            ) : (
              stats?.recentInquiries.map((inquiry, i) => (
                <motion.div
                  key={inquiry._id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.55 + i * 0.06 }}
                  className={cn(
                    "p-4 hover:bg-ink-50/60 transition-colors flex items-center gap-4 group cursor-pointer",
                    !inquiry.isRead && "bg-sky/[0.015]"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center font-semibold text-[13px] shrink-0",
                    !inquiry.isRead ? "bg-sky text-white shadow-sm" : "bg-ink-100 text-ink-500"
                  )}>
                    {inquiry.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-[14px] font-semibold text-foreground group-hover:text-sky transition-colors truncate">
                        {inquiry.name}
                      </h4>
                      {!inquiry.isRead && <span className="w-1.5 h-1.5 bg-sky rounded-full animate-pulse shrink-0" />}
                    </div>
                    <p className="text-[13px] text-ink-400 truncate">&ldquo;{inquiry.message}&rdquo;</p>
                  </div>
                  <span className="text-[11px] sm:text-[13px] sm:text-[13px] text-ink-300 font-medium uppercase tracking-wider shrink-0">
                    {formatDate(inquiry.createdAt)}
                  </span>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

        {/* Recent Properties */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="xl:col-span-2 bg-card rounded-[20px] border border-ink-100/60 shadow-soft overflow-hidden"
        >
          <div className="p-5 border-b border-ink-100/60">
            <h3 className="font-semibold text-foreground text-[16px]">Recent Properties</h3>
            <p className="text-[12px] text-ink-400 mt-0.5 font-medium">Newest listings</p>
          </div>
          <div className="divide-y divide-ink-100/60">
            {(stats?.recentProperties ?? []).length === 0 ? (
              <div className="py-14 text-center">
                <Home className="w-9 h-9 text-ink-200 mx-auto mb-2" strokeWidth={1.5} />
                <p className="text-[14px] text-ink-400 font-medium">No properties yet</p>
              </div>
            ) : (
              stats?.recentProperties.map((property, i) => (
                <motion.div
                  key={property._id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.65 + i * 0.06 }}
                  className="p-4 hover:bg-ink-50/60 transition-colors group cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 bg-sky/[0.08] rounded-[12px] flex items-center justify-center shrink-0">
                      <Building2 className="w-[18px] h-[18px] text-sky" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-semibold text-foreground group-hover:text-sky transition-colors truncate leading-tight">
                        {property.title}
                      </p>
                      <p className="text-sky font-semibold text-[13px] mt-0.5">
                        Nu. {property.price?.toLocaleString()}
                      </p>
                    </div>
                    {property.featured && (
                      <span className="px-2 py-0.5 bg-sky/[0.08] text-sky text-[11px] sm:text-[13px] sm:text-[12px] font-bold rounded-full uppercase tracking-wider shrink-0">
                        Featured
                      </span>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </div>
          <div className="p-4 border-t border-ink-100/60">
            <Link
              href="/admin/properties"
              className="w-full h-10 rounded-xl border border-ink-200/80 text-ink-400 text-[13px] font-medium hover:bg-ink-50 hover:text-foreground transition-all duration-200 flex items-center justify-center"
            >
              View All Properties
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
