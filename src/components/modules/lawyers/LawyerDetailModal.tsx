"use client";

import React from "react";
import { Mail, Phone, Briefcase } from "lucide-react";
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

interface LawyerDetailModalProps {
  lawyer: any | null;
  isOpen: boolean;
  onClose: () => void;
}

export function LawyerDetailModal({ lawyer, isOpen, onClose }: LawyerDetailModalProps) {
  if (!lawyer) return null;

  const name = lawyer.fullName || lawyer.name || "Attorney";
  const initials = name.substring(0, 2).toUpperCase();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Attorney Credentials & Profile</DialogTitle>
          <DialogDescription>Full profile verification for {name}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="flex items-center gap-4 p-4 rounded-lg bg-slate-50 border border-slate-200">
            <div className="w-12 h-12 rounded-full bg-[#2E5089] text-white font-bold text-base flex items-center justify-center notranslate" translate="no">
              {initials}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 notranslate" translate="no">{name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="default" className="text-xs capitalize">
                  Verified Attorney
                </Badge>
                <Badge variant="outline" className="text-xs font-mono notranslate" translate="no">
                  {lawyer.identityNumber || "PA-BAR-VALID"}
                </Badge>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <p className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-[#2E5089]" /> Email
              </p>
              <p className="font-semibold text-slate-800 text-xs mt-1 truncate notranslate" translate="no">{lawyer.email}</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <p className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-[#2E5089]" /> Phone
              </p>
              <p className="font-semibold text-slate-800 text-xs mt-1 notranslate" translate="no">{lawyer.phoneNumber || "N/A"}</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 col-span-2">
              <p className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5 text-[#2E5089]" /> Legal Specialty
              </p>
              <p className="font-semibold text-slate-800 text-xs mt-1">
                {lawyer.workArea || lawyer.specialty || "General Practice"}
              </p>
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
