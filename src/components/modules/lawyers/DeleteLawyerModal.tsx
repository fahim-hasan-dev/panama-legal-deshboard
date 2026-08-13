"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface DeleteLawyerModalProps {
  lawyer: any | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteLawyerModal({ lawyer, isOpen, onClose, onConfirm }: DeleteLawyerModalProps) {
  if (!lawyer) return null;

  const name = lawyer.fullName || lawyer.name || "Attorney";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-red-600">Revoke Lawyer Account</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <strong className="text-slate-900">{name}</strong>'s attorney account?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Delete Account
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
