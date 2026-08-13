"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Scale, Lock, Mail, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error("Please enter email and password.");
      return;
    }
    setLoading(true);
    try {
      await login(email.trim(), password.trim());
    } catch {
      // Error handling and toast are handled inside AuthContext.login
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-[#16253E] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2E5089] text-white flex items-center justify-center font-bold text-xl shadow-xs">
              <Scale className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold text-white tracking-wider">
              PV & ASOCIADOS
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-normal">
            Legal Group Management Portal
          </p>
        </div>

        {/* Login Form Card */}
        <Card className="shadow-2xl border-slate-800 bg-white">
          <CardHeader className="space-y-1 text-center pb-4">
            <CardTitle className="text-xl font-bold text-[#16253E]">Admin Sign In</CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Enter your administrator credentials to proceed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    type="email"
                    placeholder="admin@pvasociados.pa"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9 h-10 text-sm"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9 h-10 text-sm"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#2E5089] hover:bg-[#244172] text-white font-semibold h-10 text-sm gap-2 mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In to Dashboard"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-[11px] text-slate-500 mt-6 font-medium">
          &copy; {new Date().getFullYear()} PV & ASOCIADOS Legal Group. All rights reserved.
        </p>
      </div>
    </div>
  );
}
