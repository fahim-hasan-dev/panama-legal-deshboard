"use client";

import React, { useState } from "react";
import { useListQuery } from "@/hooks/useListQuery";
import { Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CaseListTable } from "@/components/modules/cases/CaseListTable";
import { CaseDetailModal } from "@/components/modules/cases/CaseDetailModal";
import { Pagination } from "@/components/shared/Pagination";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

export default function CasesPage() {
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedCase, setSelectedCase] = useState<any | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const initialParams = selectedStatus !== "all" ? { status: selectedStatus } : {};

  const {
    data: cases,
    isLoading,
    searchTerm,
    setSearchTerm,
    page,
    setPage,
    totalPages,
    totalItems,
    setFilters,
    refresh,
  } = useListQuery<any>({
    endpoint: "/case",
    initialParams,
  });

  const handleStatusFilterChange = (status: string) => {
    setSelectedStatus(status);
    if (status === "all") {
      setFilters({});
    } else {
      setFilters({ status });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#16253E] tracking-tight">Case Management</h1>
          <p className="text-xs text-slate-500 font-normal">Track legal consultations, citizen requests, lawyer assignments, and resolution statuses.</p>
        </div>
        <Badge variant="outline" className="px-3 py-1 bg-white text-slate-700 w-fit">
          Total Cases: {totalItems}
        </Badge>
      </div>

      <Card className="shadow-xs">
        <CardContent className="p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search case #, title or client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-10 text-sm"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
            {["all", "pending", "active", "resolved", "closed"].map((st) => (
              <button
                key={st}
                onClick={() => handleStatusFilterChange(st)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold capitalize transition-colors cursor-pointer whitespace-nowrap ${
                  selectedStatus === st
                    ? "bg-[#2E5089] text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <CaseListTable
        cases={cases}
        isLoading={isLoading}
        onViewDetails={(c) => {
          setSelectedCase(c);
          setShowDetailModal(true);
        }}
      />

      <Pagination
        page={page}
        totalPages={totalPages}
        totalItems={totalItems}
        onPageChange={(newPage) => setPage(newPage)}
      />

      <CaseDetailModal
        selectedCase={selectedCase}
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
      />
    </div>
  );
}
