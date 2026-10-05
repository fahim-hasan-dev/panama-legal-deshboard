"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

interface AddLawyerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddLawyerModal({ isOpen, onClose, onSuccess }: AddLawyerModalProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [workArea, setWorkArea] = useState("");
  const [identityNumber, setIdentityNumber] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const resetForm = () => {
    setFullName("");
    setEmail("");
    setPassword("");
    setPhoneNumber("");
    setWorkArea("");
    setIdentityNumber("");
  };

  const handleCreateLawyer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      toast.error("Please fill in name, email, and password.");
      return;
    }
    setSubmitting(true);
    try {
      const lawyerData = {
        fullName,
        name: fullName,
        email,
        password,
        phoneNumber,
        workArea,
        identityNumber,
        role: "lawyer",
        isEmailVerified: true,
      };

      const payload = new FormData();
      payload.append("data", JSON.stringify(lawyerData));

      await api.post("/user/create-user", payload);
      toast.success("Lawyer registered! Credentials sent to email.");
      resetForm();
      onClose();
      onSuccess();
    } catch (err: any) {
      toast.error(err?.message || "Failed to create lawyer account");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Verified Lawyer Account</DialogTitle>
          <DialogDescription>
            Admin exclusive action: Create attorney credentials for PV & ASOCIADOS Legal Group platform access
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleCreateLawyer} className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Full Name <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="e.g. Lic. Sofia Garcia"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Email Address <span className="text-red-500">*</span>
              </label>
              <Input
                type="email"
                placeholder="sofia@legal.pa"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Login Password <span className="text-red-500">*</span>
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Phone Number</label>
              <Input
                placeholder="+507 6888-0000"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Bar License / Identity Number</label>
            <Input
              placeholder="e.g. PA-BAR-88912"
              value={identityNumber}
              onChange={(e) => setIdentityNumber(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Specialty & Work Area</label>
            <Input
              placeholder="e.g. Labor Law, Commercial Contracts, Public Registry"
              value={workArea}
              onChange={(e) => setWorkArea(e.target.value)}
            />
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting} className="bg-[#2E5089] hover:bg-[#244172] text-white font-semibold">
              {submitting ? "Creating Account..." : "Create Lawyer Account"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
