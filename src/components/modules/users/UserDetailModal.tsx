"use client";

import React from "react";
import { Mail, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface UserDetailModalProps {
  user: any | null;
  isOpen: boolean;
  onClose: () => void;
}

export function UserDetailModal({ user, isOpen, onClose }: UserDetailModalProps) {
  if (!user) return null;

  const initials = user.fullName || user.name ? (user.fullName || user.name).substring(0, 2).toUpperCase() : "US";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>User Profile Details</DialogTitle>
          <DialogDescription>Information for {user.fullName || user.name}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="flex items-center gap-4 p-4 rounded-lg bg-slate-50 border border-slate-200">
            <div className="w-12 h-12 rounded-full bg-[#2E5089] text-white font-bold text-base flex items-center justify-center notranslate" translate="no">
              {initials}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 notranslate" translate="no">{user.fullName || user.name}</h3>
              <Badge variant="default" className="capitalize mt-1 text-xs">
                {user.role}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <p className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-[#2E5089]" /> Email
              </p>
              <p className="font-semibold text-slate-800 text-xs mt-1 truncate notranslate" translate="no">{user.email}</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <p className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-[#2E5089]" /> Phone
              </p>
              <p className="font-semibold text-slate-800 text-xs mt-1 notranslate" translate="no">{user.phoneNumber || "Not provided"}</p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
