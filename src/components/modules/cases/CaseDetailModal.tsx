"use client";

import React from "react";
import { Briefcase, User, Scale, Calendar, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface CaseDetailModalProps {
  selectedCase: any | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CaseDetailModal({
  selectedCase,
  isOpen,
  onClose,
}: CaseDetailModalProps) {
  if (!selectedCase) return null;

  const citizenObj = selectedCase.citizen || selectedCase.client || {};
  const lawyerObj = selectedCase.lawyer || {};

  const citizenName = citizenObj.fullName || citizenObj.name || "Citizen Client";
  const citizenEmail = citizenObj.email || "No email address";

  const lawyerName = lawyerObj.fullName || lawyerObj.name || "Unassigned";
  const lawyerEmail = lawyerObj.email || (lawyerObj.name || lawyerObj.fullName ? "No email address" : "No lawyer assigned yet");

  const status = (selectedCase.status || "pending").toLowerCase();
  let statusBadgeStyle = "bg-amber-100 text-amber-800 border-amber-300";

  if (status === "active" || status === "accepted") {
    statusBadgeStyle = "bg-blue-100 text-blue-800 border-blue-300";
  } else if (status === "resolved" || status === "closed") {
    statusBadgeStyle = "bg-emerald-100 text-emerald-800 border-emerald-300";
  } else if (status === "cancelled" || status === "rejected") {
    statusBadgeStyle = "bg-rose-100 text-rose-800 border-rose-300";
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader className="pb-2 border-b border-slate-100">
          <div className="flex items-center justify-between gap-2">
            <DialogTitle className="flex items-center gap-2 text-base font-bold text-[#16253E]">
              <Briefcase className="w-4 h-4 text-[#2E5089]" />
              Case Details & Overview
            </DialogTitle>
            <Badge variant="outline" className={`capitalize font-semibold text-xs border ${statusBadgeStyle}`}>
              {status}
            </Badge>
          </div>
          <DialogDescription className="text-xs text-slate-500 font-normal">
            Read-only consultation records and assigned legal group contacts.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-3">
          {/* Title & Description */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <h3 className="font-bold text-slate-900 text-sm">{selectedCase.title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              {selectedCase.description || "No case description provided."}
            </p>
            {selectedCase.createdAt && (
              <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1 pt-1">
                <Calendar className="w-3 h-3 text-slate-400" />
                Filed on: {new Date(selectedCase.createdAt).toLocaleDateString()}
              </p>
            )}
          </div>

          {/* Citizen & Lawyer Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Citizen Info Box */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#2E5089]/10 text-[#2E5089] flex items-center justify-center font-bold text-xs shrink-0">
                  <User className="w-3.5 h-3.5" />
                </div>
                <div className="truncate">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Citizen Info</span>
                  <p className="font-semibold text-slate-900 text-xs truncate">{citizenName}</p>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 flex items-center gap-1 truncate pt-0.5">
                <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                <span className="truncate">{citizenEmail}</span>
              </p>
            </div>

            {/* Lawyer Info Box */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-emerald-500/10 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0">
                  <Scale className="w-3.5 h-3.5" />
                </div>
                <div className="truncate">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Lawyer Info</span>
                  <p className="font-semibold text-slate-900 text-xs truncate">{lawyerName}</p>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 flex items-center gap-1 truncate pt-0.5">
                <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                <span className="truncate">{lawyerEmail}</span>
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="pt-2 border-t border-slate-100">
          <Button variant="outline" size="sm" onClick={onClose} className="h-8 px-4 text-xs font-semibold">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
