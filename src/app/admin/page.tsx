"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, User, ArrowRight, ShieldCheck, Mountain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
        localStorage.setItem("adminToken", data.token);
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
    <div className="min-h-screen bg-bhutan-dark flex items-center justify-center p-6 relative overflow-hidden">
      {/* Heritage Background Elements */}
      <div className="absolute inset-0 bg-thangka opacity-[0.05] pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-bhutan-red/10 rounded-full blur-[120px]" />
      <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-bhutan-gold/5 rounded-full blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-xl relative z-10"
      >
        {/* Branding Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-white/5 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 mb-8 shadow-2xl group transition-all duration-700 hover:border-bhutan-gold/40">
            <Mountain className="w-10 h-10 text-bhutan-gold transition-transform duration-700 group-hover:scale-110" />
          </div>
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Phojaa <span className="text-bhutan-gold italic font-light">Workspace</span>
          </h1>
          <div className="h-px w-20 bg-bhutan-gold/30 mx-auto" />
          <p className="text-white/60 text-sm font-bold uppercase tracking-[0.4em] mt-6">Secure Access Portal</p>
        </div>

        {/* Luxury Glass Login Card */}
        <div className="bg-white/5 backdrop-blur-[100px] rounded-[2rem] md:rounded-[4rem] p-8 md:p-16 border-4 border-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-12">
              <div className="w-12 h-12 bg-bhutan-red/20 rounded-xl flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-bhutan-red" />
              </div>
              <h2 className="text-2xl font-serif font-bold text-white italic">
                Authorized Login
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 md:space-y-10">
              <div className="space-y-3 md:space-y-4">
                <label className="text-sm font-bold text-white/80 uppercase tracking-[0.3em] ml-6 font-serif">
                  Your Identity
                </label>
                <div className="relative">
                  <User className="absolute left-6 md:left-8 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-bhutan-gold/50" />
                  <Input
                    type="text"
                    placeholder="Enter Username"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    className="h-16 md:h-20 pl-12 md:pl-16 rounded-[1rem] md:rounded-[1.5rem] bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:ring-bhutan-gold/30 focus:border-bhutan-gold/30 shadow-inner text-base md:text-lg font-serif"
                    required
                  />
                </div>
              </div>

              <div className="space-y-3 md:space-y-4">
                <label className="text-sm font-bold text-white/80 uppercase tracking-[0.3em] ml-6 font-serif">
                  Access Key
                </label>
                <div className="relative">
                  <Lock className="absolute left-6 md:left-8 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-bhutan-gold/50" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter Password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="h-16 md:h-20 pl-12 md:pl-16 pr-12 md:pr-16 rounded-[1rem] md:rounded-[1.5rem] bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:ring-bhutan-gold/30 focus:border-bhutan-gold/30 shadow-inner text-base md:text-lg font-serif"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-6 md:right-8 top-1/2 -translate-y-1/2 text-white/30 hover:text-bhutan-gold transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 md:w-6 md:h-6" />
                    ) : (
                      <Eye className="w-5 h-5 md:w-6 md:h-6" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-20 md:h-24 bg-bhutan-red text-white text-xs md:text-sm font-bold uppercase tracking-[0.5em] rounded-[1.5rem] md:rounded-[2rem] hover:bg-white hover:text-black transition-all duration-700 shadow-3xl shadow-bhutan-red/20 disabled:opacity-50 group flex items-center justify-center gap-4 mt-6 md:mt-8"
              >
                {isLoading ? (
                  "Verifying..."
                ) : (
                  <>
                    Enter Workspace
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-500" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-12 text-center">
              <Link
                href="/"
                className="text-white/40 hover:text-white text-xs font-bold uppercase tracking-[0.3em] transition-all duration-500 hover:tracking-[0.4em] italic"
              >
                ← Return to Public Site
              </Link>
            </div>
          </div>
        </div>

        {/* System ID / Footer */}
        <div className="mt-12 text-center">
          <p className="text-white/10 text-[10px] font-bold uppercase tracking-[0.5em]">
            Phojaa Real Estate Management System v2.0
          </p>
        </div>
      </motion.div>
    </div>
  );
}
