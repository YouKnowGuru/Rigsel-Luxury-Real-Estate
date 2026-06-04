"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, User, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Welcome Back",
          description: "Entering the workspace...",
          variant: "success",
        });
        router.push("/admin/dashboard");
      } else {
        toast({
          title: "Login Failed",
          description: data.message || "Please check your details.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      {/* Ambient background orbs */}
      <div className="absolute -top-48 -right-48 w-[700px] h-[700px] bg-sky/[0.04] rounded-full blur-[140px]" />
      <div className="absolute -bottom-48 -left-48 w-[700px] h-[700px] bg-sky/[0.03] rounded-full blur-[140px]" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[380px] relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center justify-center w-16 h-16 bg-card rounded-[20px] shadow-soft border border-ink-100/80 mb-6 overflow-hidden"
          >
            <Image
              src="/image/logo.png"
              alt="PHOJAA95 Real Estate Logo"
              width={56}
              height={56}
              className="object-cover rounded-[16px]"
              priority
            />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="font-sans text-[28px] font-semibold tracking-tight text-foreground mb-1.5"
          >
            Phojaa Workspace
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-[15px] text-ink-400 font-normal"
          >
            Sign in to manage your properties
          </motion.p>
        </div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="bg-card rounded-[24px] shadow-elevated border border-ink-100/60 p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[13px] font-medium text-ink-600 ml-1">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-ink-400 pointer-events-none" strokeWidth={1.5} />
                <input
                  type="text"
                  placeholder="Enter username"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  className="w-full h-12 pl-11 pr-4 rounded-2xl border border-ink-200 bg-background text-[15px] text-foreground placeholder:text-ink-400 outline-none transition-all duration-200 focus:border-sky focus:ring-[3px] focus:ring-sky/15"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[13px] font-medium text-ink-600 ml-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-ink-400 pointer-events-none" strokeWidth={1.5} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full h-12 pl-11 pr-11 rounded-2xl border border-ink-200 bg-background text-[15px] text-foreground placeholder:text-ink-400 outline-none transition-all duration-200 focus:border-sky focus:ring-[3px] focus:ring-sky/15"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600 transition-colors p-1"
                >
                  {showPassword ? (
                    <EyeOff className="w-[18px] h-[18px]" strokeWidth={1.5} />
                  ) : (
                    <Eye className="w-[18px] h-[18px]" strokeWidth={1.5} />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded-full bg-sky text-white text-[15px] font-medium inline-flex items-center justify-center gap-2 transition-all duration-200 hover:bg-sky-hover active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none mt-2"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" strokeWidth={2} />
                </>
              )}
            </button>
          </form>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45, duration: 0.5 }}
          className="mt-8 text-center space-y-3"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[14px] text-ink-400 hover:text-sky transition-colors font-medium"
          >
            <ArrowRight className="w-3.5 h-3.5 rotate-180" strokeWidth={2} />
            Back to public site
          </Link>
          <p className="text-[11px] sm:text-[13px] sm:text-[13px] text-ink-300 font-medium uppercase tracking-[0.15em]">
            Phojaa Real Estate CMS
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
