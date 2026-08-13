"use client";

import React, { useState } from "react";
import { useListQuery } from "@/hooks/useListQuery";
import { Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { UserListTable } from "@/components/modules/users/UserListTable";
import { UserDetailModal } from "@/components/modules/users/UserDetailModal";
import { DeleteUserModal } from "@/components/modules/users/DeleteUserModal";
import { Pagination } from "@/components/shared/Pagination";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

export default function UsersPage() {
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<any | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const initialParams = selectedRole !== "all" ? { role: selectedRole } : {};

  const {
    data: users,
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
    endpoint: "/user",
    initialParams,
  });

  const handleRoleChange = (role: string) => {
    setSelectedRole(role);
    if (role === "all") {
      setFilters({});
    } else {
      setFilters({ role });
    }
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    try {
      await api.delete(`/user/${userToDelete._id || userToDelete.id}`);
      toast.success("User deleted successfully");
      setShowDeleteModal(false);
      setUserToDelete(null);
      refresh();
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete user");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#16253E] tracking-tight">User Management</h1>
          <p className="text-xs text-slate-500 font-normal">Manage registered citizens, legal experts, and law students.</p>
        </div>
        <Badge variant="outline" className="px-3 py-1 bg-white text-slate-700 font-semibold">
          Total Users: {totalItems}
        </Badge>
      </div>

      <Card className="shadow-xs">
        <CardContent className="p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-10 text-sm"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {["all", "citizen", "expert", "student"].map((role) => (
              <button
                key={role}
                onClick={() => handleRoleChange(role)}
                className={`px-3.5 py-1.5 rounded-md text-xs font-semibold capitalize transition-all cursor-pointer whitespace-nowrap ${
                  selectedRole === role
                    ? "bg-[#2E5089] text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <UserListTable
        users={users}
        isLoading={isLoading}
        onView={(u) => {
          setSelectedUser(u);
          setShowDetailModal(true);
        }}
        onDelete={(u) => {
          setUserToDelete(u);
          setShowDeleteModal(true);
        }}
      />

      <Pagination
        page={page}
        totalPages={totalPages}
        totalItems={totalItems}
        onPageChange={(newPage) => setPage(newPage)}
      />

      <UserDetailModal
        user={selectedUser}
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
      />

      <DeleteUserModal
        user={userToDelete}
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
