"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { token, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const publicPaths = ["/login", "/privacy-policy", "/terms-and-conditions"];

  useEffect(() => {
    if (!isLoading && !token && !publicPaths.includes(pathname)) {
      if (typeof window !== "undefined") {
        window.location.replace("/login");
      }
    }
  }, [token, isLoading, pathname]);

  if (publicPaths.includes(pathname)) {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#16253E] text-white gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-[#2E5089]" />
        <p className="text-sm font-semibold text-slate-300">Loading PV & ASOCIADOS Legal Group Admin...</p>
      </div>
    );
  }

  if (!token) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />
      
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          collapsed ? "lg:ml-20" : "lg:ml-64"
        }`}
      >
        <Navbar setMobileOpen={setMobileOpen} />
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
