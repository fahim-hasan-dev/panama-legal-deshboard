"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  User as UserIcon,
  LogOut,
  Settings,
  Menu,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { navItems } from "./Sidebar";

export function Navbar({
  setMobileOpen,
}: {
  setMobileOpen?: (v: boolean) => void;
}) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const currentNav = navItems.find((item) =>
    item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };

    if (showProfileMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [showProfileMenu]);

  return (
    <header className="sticky top-0 z-30 h-20 bg-white border-b border-slate-200 px-4 sm:px-6 md:px-10 flex items-center justify-between shadow-xs">
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        <button
          onClick={() => setMobileOpen?.(true)}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer shrink-0"
          title="Open Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <h2 className="text-base sm:text-lg font-bold text-[#16253E] tracking-tight truncate">
            {currentNav?.title || "Dashboard"}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium truncate mt-0.5">
            PV & ASOCIADOS Legal Group Administration
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        {/* Admin Profile Dropdown Container */}
        <div className="relative" ref={profileMenuRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-[#2E5089] text-white font-bold text-sm flex items-center justify-center shadow-xs">
              {user?.name ? user.name.substring(0, 2).toUpperCase() : "AD"}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-bold text-[#16253E] leading-tight">
                {user?.name || "Admin User"}
              </p>
              <p className="text-xs text-slate-500 capitalize font-medium mt-0.5">
                {user?.role || "Administrator"}
              </p>
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-60 rounded-xl bg-white border border-slate-200 shadow-xl py-2 z-50 animate-in fade-in-50 slide-in-from-top-2">
              <div className="px-4 py-3 border-b border-slate-100">
                <p className="text-sm font-bold text-[#16253E]">{user?.name || "Admin User"}</p>
                <p className="text-xs text-slate-500 truncate font-normal mt-0.5">{user?.email || "admin@panamalegal.com"}</p>
              </div>

              <div className="py-1">
                <Link
                  href="/settings"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                >
                  <UserIcon className="w-4 h-4 text-slate-500" />
                  Account Settings
                </Link>
                <Link
                  href="/settings"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                >
                  <Settings className="w-4 h-4 text-slate-500" />
                  Security & Password
                </Link>
              </div>

              <div className="pt-1 border-t border-slate-100">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer text-left"
                >
                  <LogOut className="w-4 h-4 text-red-500" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
