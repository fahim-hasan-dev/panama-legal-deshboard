"use client";

import React, { useState } from "react";
import { useListQuery } from "@/hooks/useListQuery";
import { Award, Plus, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LawyerListTable } from "@/components/modules/lawyers/LawyerListTable";
import { AddLawyerModal } from "@/components/modules/lawyers/AddLawyerModal";
import { LawyerDetailModal } from "@/components/modules/lawyers/LawyerDetailModal";
import { DeleteLawyerModal } from "@/components/modules/lawyers/DeleteLawyerModal";
import { Pagination } from "@/components/shared/Pagination";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

export default function LawyersPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedLawyer, setSelectedLawyer] = useState<any | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [lawyerToDelete, setLawyerToDelete] = useState<any | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const {
    data: lawyers,
    isLoading,
    searchTerm,
    setSearchTerm,
    page,
    setPage,
    totalPages,
    totalItems,
    refresh,
  } = useListQuery<any>({
    endpoint: "/user",
    initialParams: { role: "lawyer" },
  });

  const handleConfirmDelete = async () => {
    if (!lawyerToDelete) return;
    try {
      await api.delete(`/user/${lawyerToDelete._id || lawyerToDelete.id}`);
      toast.success("Lawyer deleted successfully");
      setShowDeleteModal(false);
      setLawyerToDelete(null);
      refresh();
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete lawyer");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#16253E] tracking-tight flex items-center gap-2">
            <Award className="w-6 h-6 text-[#2E5089]" />
            Lawyer Management Panel
          </h1>
          <p className="text-xs text-slate-500 font-normal">
            Exclusive administration of verified attorneys. Only Admins can register and create new lawyer accounts.
          </p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-[#2E5089] hover:bg-[#244172] text-white font-semibold text-xs gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Register New Lawyer
        </Button>
      </div>

      <Card className="shadow-xs">
        <CardContent className="p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search by lawyer name, email or specialty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-10 text-sm"
            />
          </div>
          <Badge variant="outline" className="px-3 py-1 bg-white text-slate-700 font-semibold">
            Registered Attorneys: {totalItems}
          </Badge>
        </CardContent>
      </Card>

      <LawyerListTable
        lawyers={lawyers}
        isLoading={isLoading}
        onView={(l) => {
          setSelectedLawyer(l);
          setShowDetailModal(true);
        }}
        onDelete={(l) => {
          setLawyerToDelete(l);
          setShowDeleteModal(true);
        }}
      />

      <Pagination
        page={page}
        totalPages={totalPages}
        totalItems={totalItems}
        onPageChange={(newPage) => setPage(newPage)}
      />

      <AddLawyerModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={() => refresh()}
      />

      <LawyerDetailModal
        lawyer={selectedLawyer}
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
      />

      <DeleteLawyerModal
        lawyer={lawyerToDelete}
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
