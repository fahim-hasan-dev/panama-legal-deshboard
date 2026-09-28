"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  HelpCircle,
  BookOpen,
  FileText,
  Bot,
  CreditCard,
  Star,
  Globe,
  Bell,
  Settings,
  LogOut,
  Scale,
  ChevronLeft,
  ChevronRight,
  Shield,
  Award,
  X,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export const navItems = [
  { title: "Overview", href: "/", icon: LayoutDashboard },
  { title: "Users", href: "/users", icon: Users },
  { title: "Lawyers", href: "/lawyers", icon: Award },
  { title: "Cases", href: "/cases", icon: Briefcase },
  { title: "Case Questions", href: "/case-questions", icon: HelpCircle },
  { title: "Legal Library", href: "/library", icon: BookOpen },
  { title: "Articles", href: "/articles", icon: FileText },
  { title: "Reviews", href: "/reviews", icon: Star },
  { title: "Public Content", href: "/public-content", icon: Globe },
  { title: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar({
  collapsed,
  setCollapsed,
  mobileOpen = false,
  setMobileOpen,
}: {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  mobileOpen?: boolean;
  setMobileOpen?: (v: boolean) => void;
}) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  return (
    <>
      {/* Mobile Drawer Backdrop Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen?.(false)}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden animate-in fade-in-50"
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-screen bg-[#16253E] text-slate-100 border-r border-slate-800/80 transition-all duration-300 flex flex-col justify-between shadow-xl lg:shadow-sm",
          mobileOpen ? "translate-x-0 w-64" : "-translate-x-full lg:translate-x-0",
          collapsed ? "lg:w-20" : "lg:w-64"
        )}
      >
        {/* Top Header Logo */}
        <div>
          <div className="h-20 flex items-center justify-between px-4 border-b border-slate-700/60">
            <Link href="/" onClick={() => setMobileOpen?.(false)} className="flex items-center gap-3 overflow-hidden">
              <img
                src="/PV_logo_sidebar.png"
                alt="PV & ASOCIADOS"
                className="h-14 w-14 object-contain shrink-0 -ml-1"
              />
              {(!collapsed || mobileOpen) && (
                <div className="truncate">
                  <h1 className="font-bold text-sm tracking-wider text-white leading-tight">
                    PV & ASOCIADOS
                  </h1>
                  <p className="text-[10px] text-slate-400 font-normal">Legal Group Admin</p>
                </div>
              )}
            </Link>

            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex h-7 w-7 rounded-md bg-slate-800/80 hover:bg-slate-700 items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setMobileOpen?.(false)}
              className="lg:hidden flex h-8 w-8 rounded-lg bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-all cursor-pointer items-center justify-center shadow-xs"
              title="Close navigation menu"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* Nav Items */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-160px)] no-scrollbar">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen?.(false)}
                  className={cn(
                    "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer",
                    isActive
                      ? "bg-[#2E5089] text-white shadow-xs"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                  )}
                  title={collapsed && !mobileOpen ? item.title : undefined}
                >
                  <Icon className={cn("w-4 h-4 shrink-0", isActive ? "text-white" : "text-slate-400")} />
                  {(!collapsed || mobileOpen) && <span className="truncate">{item.title}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Admin User */}
        <div className="p-3 border-t border-slate-700/60 bg-[#121f34]">
          {!collapsed && (
            <div className="flex items-center gap-2.5 px-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-[#2E5089] border border-slate-600 flex items-center justify-center font-bold text-xs text-white notranslate" translate="no">
                {user?.name ? user.name.substring(0, 2).toUpperCase() : "AD"}
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-slate-200 truncate notranslate" translate="no">{user?.name || "Administrator"}</p>
                <span className="text-[10px] font-normal text-slate-400 uppercase">
                  {user?.role || "ADMIN"}
                </span>
              </div>
            </div>
          )}

          <button
            onClick={() => setShowLogoutDialog(true)}
            className={cn(
              "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors cursor-pointer",
              collapsed ? "justify-center" : ""
            )}
            title="Logout"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Logout Confirmation Dialog */}
      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg font-bold text-slate-900">
              <Shield className="w-5 h-5 text-red-600" />
              Confirm Logout
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to log out of the PV & ASOCIADOS Legal Group Admin Dashboard?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowLogoutDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setShowLogoutDialog(false);
                logout();
              }}
            >
              Log out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
