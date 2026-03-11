"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Building2, MessageSquare, TrendingUp, Eye, Plus, ArrowUpRight,
  Clock, ArrowRight, Star, AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate, formatPrice } from "@/lib/utils";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

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

// Animated counter hook
function useAnimatedCounter(target: number, duration = 1200) {
  const [count, setCount] = useState(0);
  const frameRef = useRef<number>();

  useEffect(() => {
    if (target === 0) return;
    const start = performance.now();
    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setCount(Math.round(eased * target));
      if (progress < 1) frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  }, [target, duration]);

  return count;
}

function StatCard({
  name, value, change, icon: Icon, colorClass, bgClass, delay,
}: {
  name: string; value: number; change: string; icon: React.ElementType; colorClass: string; bgClass: string; delay: number;
}) {
  const animated = useAnimatedCounter(value);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white rounded-2xl p-6 border border-white shadow-sm hover:shadow-lg hover:border-bhutan-gold/20 transition-all duration-500 group cursor-default"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500", bgClass)}>
          <Icon className={cn("w-5 h-5", colorClass)} />
        </div>
        <div className="flex items-center gap-1 text-emerald-600 text-sm font-bold bg-emerald-50 px-2.5 py-1.5 rounded-full">
          <ArrowUpRight className="w-3.5 h-3.5" />
          {change}
        </div>
      </div>
      <p className="text-4xl font-bold text-bhutan-dark mb-1">{animated.toLocaleString()}</p>
      <p className="text-sm text-bhutan-dark/40 font-bold uppercase tracking-widest">{name}</p>
    </motion.div>
  );
}

// Custom tooltip for recharts
function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-bhutan-dark/95 backdrop-blur-md border border-white/10 rounded-xl p-3 shadow-2xl">
        <p className="text-white/60 text-xs font-bold uppercase tracking-wider mb-2">{label}</p>
        {payload.map((entry: any) => (
          <div key={entry.name} className="flex items-center gap-2 text-sm">
            <span className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
            <span className="text-white/70">{entry.name}:</span>
            <span className="text-white font-bold">{entry.value}</span>
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

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) { router.push("/admin"); return; }
    fetchDashboardData(token);
  }, [router]);

  const fetchDashboardData = async (token: string) => {
    try {
      const [statsRes, chartRes] = await Promise.all([
        fetch("/api/admin/stats", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("/api/admin/stats/charts", { headers: { Authorization: `Bearer ${token}` } }),
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
        <div className="flex flex-col items-center gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="w-10 h-10 border-4 border-bhutan-red/20 border-t-bhutan-red rounded-full"
          />
          <p className="text-bhutan-dark/40 text-xs uppercase tracking-widest font-bold">Loading…</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      name: "Total Properties",
      value: stats?.totalProperties ?? 0,
      change: `+${stats?.recentListings ?? 0} this month`,
      icon: Building2,
      colorClass: "text-bhutan-red",
      bgClass: "bg-bhutan-red/10",
    },
    {
      name: "Total Inquiries",
      value: stats?.totalInquiries ?? 0,
      change: `${stats?.unreadInquiries ?? 0} unread`,
      icon: MessageSquare,
      colorClass: "text-bhutan-gold",
      bgClass: "bg-bhutan-gold/10",
    },
    {
      name: "Featured Listings",
      value: stats?.featuredProperties ?? 0,
      change: "Highlighted",
      icon: Star,
      colorClass: "text-amber-500",
      bgClass: "bg-amber-50",
    },
    {
      name: "New This Month",
      value: stats?.recentListings ?? 0,
      change: "Last 30 days",
      icon: TrendingUp,
      colorClass: "text-emerald-600",
      bgClass: "bg-emerald-50",
    },
  ];

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto">
      {/* Page Header */}
      <header className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <motion.div
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 mb-1"
          >
            <div className="w-0.5 h-5 bg-bhutan-red rounded-full" />
            <p className="text-bhutan-red font-bold text-[10px] uppercase tracking-[0.3em]">Overview</p>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl md:text-3xl font-bold text-bhutan-dark"
          >
            Dashboard
          </motion.h1>
        </div>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <Link href="/admin/properties/new">
            <button className="h-11 px-5 bg-bhutan-red text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-bhutan-dark transition-all duration-300 shadow-lg shadow-bhutan-red/20 flex items-center gap-2.5 group">
              <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
              Add Property
            </button>
          </Link>
        </motion.div>
      </header>

      {/* Unread Alert */}
      {(stats?.unreadInquiries ?? 0) > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-bhutan-gold/10 border border-bhutan-gold/30 rounded-2xl flex items-center gap-3"
        >
          <AlertCircle className="w-5 h-5 text-bhutan-gold shrink-0" />
          <p className="text-sm text-bhutan-dark/70 font-medium">
            You have <span className="font-bold text-bhutan-dark">{stats?.unreadInquiries}</span> unread{" "}
            {(stats?.unreadInquiries ?? 0) === 1 ? "inquiry" : "inquiries"}.
          </p>
          <Link href="/admin/inquiries" className="ml-auto text-xs font-bold text-bhutan-red hover:underline">
            View All →
          </Link>
        </motion.div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat, i) => (
          <StatCard key={stat.name} {...stat} delay={i * 0.08} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        {/* Properties Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-white rounded-2xl p-6 border border-white shadow-sm"
        >
          <div className="mb-5">
            <h3 className="font-bold text-bhutan-dark text-base">Properties Added</h3>
            <p className="text-xs text-bhutan-dark/40 mt-0.5 uppercase tracking-wider">Last 12 months</p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="propGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#9B1C1C" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#9B1C1C" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F4C43015" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#2F2F2F60" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#2F2F2F60" }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="properties" name="Properties" stroke="#9B1C1C" strokeWidth={2.5} fill="url(#propGrad)" dot={{ fill: "#9B1C1C", r: 3, strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Inquiries Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="bg-white rounded-2xl p-6 border border-white shadow-sm"
        >
          <div className="mb-5">
            <h3 className="font-bold text-bhutan-dark text-base">Inquiries Received</h3>
            <p className="text-xs text-bhutan-dark/40 mt-0.5 uppercase tracking-wider">Last 12 months</p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="inqGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F4C430" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#F4C430" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F4C43015" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#2F2F2F60" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#2F2F2F60" }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="inquiries" name="Inquiries" stroke="#F4C430" strokeWidth={2.5} fill="url(#inqGrad)" dot={{ fill: "#F4C430", r: 3, strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Recent Lists */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* Recent Inquiries */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="xl:col-span-3 bg-white rounded-2xl border border-white shadow-sm overflow-hidden"
        >
          <div className="p-5 border-b border-bhutan-gold/5 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-bhutan-dark text-base">Recent Inquiries</h3>
              <p className="text-sm text-bhutan-dark/40 mt-0.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Latest messages
              </p>
            </div>
            <Link href="/admin/inquiries" className="text-sm font-bold text-bhutan-red hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-bhutan-gold/5">
            {(stats?.recentInquiries ?? []).length === 0 ? (
              <div className="py-12 text-center">
                <MessageSquare className="w-8 h-8 text-bhutan-dark/10 mx-auto mb-2" />
                <p className="text-xs text-bhutan-dark/30 uppercase tracking-wider">No inquiries yet</p>
              </div>
            ) : (
              stats?.recentInquiries.map((inquiry, i) => (
                <motion.div
                  key={inquiry._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.55 + i * 0.06 }}
                  className={cn(
                    "p-4 hover:bg-[#F9F7F2]/50 transition-colors flex items-center gap-4 group",
                    !inquiry.isRead && "bg-bhutan-gold/3"
                  )}
                >
                  <div className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0 shadow-sm",
                    !inquiry.isRead ? "bg-bhutan-red text-white" : "bg-[#F9F7F2] text-bhutan-dark/40"
                  )}>
                    {inquiry.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-bold text-bhutan-dark group-hover:text-bhutan-red transition-colors truncate">
                        {inquiry.name}
                      </h4>
                      {!inquiry.isRead && <span className="w-1.5 h-1.5 bg-bhutan-red rounded-full animate-pulse shrink-0" />}
                    </div>
                    <p className="text-sm text-bhutan-dark/50 truncate italic">"{inquiry.message}"</p>
                  </div>
                  <span className="text-xs text-bhutan-dark/30 font-bold uppercase tracking-widest shrink-0">
                    {formatDate(inquiry.createdAt)}
                  </span>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

        {/* Recent Properties */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="xl:col-span-2 bg-bhutan-dark rounded-2xl border border-white/5 shadow-sm overflow-hidden"
        >
          <div className="p-5 border-b border-white/5">
            <h3 className="font-bold text-white text-sm">Recent Properties</h3>
            <p className="text-xs text-bhutan-gold/50 mt-0.5">Newest listings</p>
          </div>
          <div className="divide-y divide-white/5">
            {(stats?.recentProperties ?? []).length === 0 ? (
              <div className="py-12 text-center">
                <Building2 className="w-8 h-8 text-white/10 mx-auto mb-2" />
                <p className="text-xs text-white/20 uppercase tracking-wider">No properties yet</p>
              </div>
            ) : (
              stats?.recentProperties.map((property, i) => (
                <motion.div
                  key={property._id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.65 + i * 0.06 }}
                  className="p-4 hover:bg-white/5 transition-colors group"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-bhutan-red/20 rounded-lg flex items-center justify-center shrink-0">
                      <Building2 className="w-4 h-4 text-bhutan-gold" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-bold text-white group-hover:text-bhutan-gold transition-colors truncate leading-tight">
                        {property.title}
                      </p>
                      <p className="text-bhutan-gold font-bold text-sm mt-0.5">
                        Nu. {property.price?.toLocaleString()}
                      </p>
                    </div>
                    {property.featured && (
                      <span className="px-1.5 py-0.5 bg-bhutan-gold/20 text-bhutan-gold text-[10px] font-bold rounded uppercase tracking-wider shrink-0">
                        ★
                      </span>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </div>
          <div className="p-4">
            <Link href="/admin/properties">
              <button className="w-full h-10 rounded-xl border border-white/10 text-white/40 text-xs font-bold uppercase tracking-wider hover:bg-white/5 hover:text-white transition-all">
                View All Properties
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
