"use client";

import React from "react";
import { Eye, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DashboardTable } from "@/components/shared/DashboardTable";

interface UserListTableProps {
  users: any[];
  isLoading: boolean;
  onView: (user: any) => void;
  onDelete: (user: any) => void;
}

export function UserListTable({ users, isLoading, onView, onDelete }: UserListTableProps) {
  const columns = [
    {
      header: "User Details",
      cell: (user: any) => {
        const name = user.fullName || user.name || "User";
        const initials = name.substring(0, 2).toUpperCase();
        return (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs text-[#2E5089]">
              {initials}
            </div>
            <div>
              <p className="font-semibold text-slate-900 text-sm">{name}</p>
              <p className="text-xs text-slate-500">{user.email}</p>
            </div>
          </div>
        );
      },
    },
    {
      header: "Role",
      cell: (user: any) => (
        <Badge
          variant={user.role === "expert" ? "default" : "secondary"}
          className="capitalize font-semibold text-xs"
        >
          {user.role}
        </Badge>
      ),
    },
    {
      header: "Status",
      cell: (user: any) => (
        <Badge variant={user.status === "restricted" ? "warning" : "success"} className="capitalize text-xs">
          {user.status || "active"}
        </Badge>
      ),
    },
    {
      header: "Phone / Contact",
      cell: (user: any) => (
        <span className="text-xs text-slate-600">{user.phoneNumber || "N/A"}</span>
      ),
    },
    {
      header: "Joined Date",
      cell: (user: any) => (
        <span className="text-xs text-slate-500">
          {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
        </span>
      ),
    },
    {
      header: "Actions",
      cell: (user: any) => (
        <div className="flex items-center justify-end gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView(user)}
            className="h-8 w-8 p-0"
            title="View details"
          >
            <Eye className="w-4 h-4 text-slate-600" />
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(user)}
            className="h-8 w-8 p-0"
            title="Delete user"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DashboardTable
      data={users}
      columns={columns}
      loading={isLoading}
      emptyText="No users found matching your search."
    />
  );
}
