"use client";

import React from "react";
import { Briefcase, User, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  onUpdateStatus: (caseId: string, status: string) => void;
}

export function CaseDetailModal({
  selectedCase,
  isOpen,
  onClose,
  onUpdateStatus,
}: CaseDetailModalProps) {
  if (!selectedCase) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-[#2E5089]" />
            Case Details & History
          </DialogTitle>
          <DialogDescription>
            {selectedCase.caseNumber || selectedCase._id || selectedCase.id}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
            <h3 className="font-bold text-slate-900 text-sm">{selectedCase.title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              {selectedCase.description || "No description provided."}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
              <p className="text-slate-500 font-semibold flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-[#2E5089]" /> Client
              </p>
              <p className="font-semibold text-slate-800">{selectedCase.client?.name || selectedCase.client?.fullName || "Citizen Client"}</p>
              <p className="text-[11px] text-slate-500">{selectedCase.client?.email}</p>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
              <p className="text-slate-500 font-semibold flex items-center gap-1">
                <Scale className="w-3.5 h-3.5 text-[#2E5089]" /> Assigned Lawyer
              </p>
              <p className="font-semibold text-slate-800">{selectedCase.lawyer?.name || selectedCase.lawyer?.fullName || "Not assigned"}</p>
              <p className="text-[11px] text-slate-500">{selectedCase.lawyer?.email}</p>
            </div>
          </div>

          <div className="p-4 rounded-lg border border-slate-200 space-y-2">
            <label className="text-xs font-semibold text-slate-700 block">Update Case Status</label>
            <div className="flex flex-wrap gap-2">
              {["pending", "active", "resolved", "closed"].map((st) => (
                <Button
                  key={st}
                  variant={selectedCase.status === st ? "default" : "outline"}
                  size="sm"
                  onClick={() => onUpdateStatus(selectedCase._id || selectedCase.id, st)}
                  className="text-xs capitalize h-8"
                >
                  {st}
                </Button>
              ))}
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
