"use client";

import React from "react";
import { Eye, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DashboardTable } from "@/components/shared/DashboardTable";

interface LawyerListTableProps {
  lawyers: any[];
  isLoading: boolean;
  onView: (lawyer: any) => void;
  onDelete: (lawyer: any) => void;
}

export function LawyerListTable({ lawyers, isLoading, onView, onDelete }: LawyerListTableProps) {
  const columns = [
    {
      header: "Attorney Details",
      cell: (lawyer: any) => {
        const name = lawyer.fullName || lawyer.name || "Attorney";
        const initials = name.substring(0, 2).toUpperCase();
        return (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#2E5089]/10 text-[#2E5089] border border-[#2E5089]/20 flex items-center justify-center font-bold text-xs notranslate" translate="no">
              {initials}
            </div>
            <div>
              <p className="font-semibold text-slate-900 text-sm notranslate" translate="no">{name}</p>
              <p className="text-xs text-slate-500 notranslate" translate="no">{lawyer.email}</p>
            </div>
          </div>
        );
      },
    },
    {
      header: "License / Bar ID",
      cell: (lawyer: any) => (
        <Badge variant="outline" className="font-mono text-[11px] bg-slate-50 border-slate-300 notranslate" translate="no">
          {lawyer.identityNumber || "PA-BAR-VERIFIED"}
        </Badge>
      ),
    },
    {
      header: "Specialty & Work Area",
      cell: (lawyer: any) => (
        <span className="text-xs text-slate-700 font-medium">
          {lawyer.workArea || lawyer.specialty || "General Litigation"}
        </span>
      ),
    },
    {
      header: "Phone / Contact",
      cell: (lawyer: any) => (
        <span className="text-xs text-slate-600 notranslate" translate="no">{lawyer.phoneNumber || "N/A"}</span>
      ),
    },
    {
      header: "Status",
      cell: (lawyer: any) => (
        <Badge variant="success" className="capitalize text-xs">
          {lawyer.status || "active"}
        </Badge>
      ),
    },
    {
      header: "Actions",
      cell: (lawyer: any) => (
        <div className="flex items-center justify-end gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView(lawyer)}
            className="h-8 w-8 p-0"
            title="View details"
          >
            <Eye className="w-4 h-4 text-slate-600" />
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(lawyer)}
            className="h-8 w-8 p-0"
            title="Delete lawyer"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DashboardTable
      data={lawyers}
      columns={columns}
      loading={isLoading}
      emptyText="No lawyer accounts found matching your search."
    />
  );
}
