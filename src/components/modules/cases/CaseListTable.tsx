"use client";

import React from "react";
import { Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DashboardTable } from "@/components/shared/DashboardTable";

interface CaseListTableProps {
  cases: any[];
  isLoading: boolean;
  onViewDetails: (c: any) => void;
}

export function CaseListTable({ cases, isLoading, onViewDetails }: CaseListTableProps) {
  const columns = [
    {
      header: "Case Title",
      cell: (c: any) => (
        <span className="font-semibold text-slate-900 text-sm">{c.title}</span>
      ),
    },
    {
      header: "Client",
      cell: (c: any) => (
        <span className="text-xs text-slate-700 font-medium notranslate" translate="no">
          {c.citizen?.fullName || c.citizen?.name || c.client?.fullName || c.client?.name || "Citizen Client"}
        </span>
      ),
    },
    {
      header: "Assigned Lawyer",
      cell: (c: any) => (
        <span className="text-xs text-slate-700 font-medium notranslate" translate="no">
          {c.lawyer?.fullName || c.lawyer?.name || "Unassigned"}
        </span>
      ),
    },
    {
      header: "Status",
      cell: (c: any) => {
        const status = (c.status || "pending").toLowerCase();
        let colorClasses = "bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-100";
        
        if (status === "active" || status === "accepted") {
          colorClasses = "bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-100";
        } else if (status === "resolved" || status === "closed") {
          colorClasses = "bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-100";
        } else if (status === "cancelled" || status === "rejected") {
          colorClasses = "bg-rose-100 text-rose-800 border-rose-300 hover:bg-rose-100";
        }

        return (
          <Badge
            variant="outline"
            className={`capitalize font-semibold text-xs border px-2.5 py-0.5 ${colorClasses}`}
          >
            {c.status || "pending"}
          </Badge>
        );
      },
    },
    {
      header: "Date Filed",
      cell: (c: any) => (
        <span className="text-xs text-slate-500">
          {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "N/A"}
        </span>
      ),
    },
    {
      header: "Actions",
      cell: (c: any) => (
        <div className="text-right">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(c)}
            className="h-8 px-3 text-xs"
          >
            <Eye className="w-3.5 h-3.5 mr-1 text-slate-600" />
            Details
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DashboardTable
      data={cases}
      columns={columns}
      loading={isLoading}
      emptyText="No legal cases found matching your query."
    />
  );
}
