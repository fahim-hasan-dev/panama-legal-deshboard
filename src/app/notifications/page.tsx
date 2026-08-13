"use client";

import React, { useState } from "react";
import { useListQuery } from "@/hooks/useListQuery";
import { Bell, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { DashboardTable } from "@/components/shared/DashboardTable";
import { Pagination } from "@/components/shared/Pagination";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

export default function NotificationsPage() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [targetRole, setTargetRole] = useState("all");
  const [sending, setSending] = useState(false);

  const {
    data: notifications,
    isLoading,
    page,
    setPage,
    totalPages,
    totalItems,
    refresh,
  } = useListQuery<any>({
    endpoint: "/notification",
  });

  const handleSendTestPush = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) {
      toast.error("Please fill in title and message text.");
      return;
    }
    setSending(true);
    try {
      await api.post("/notification/test-push", {
        title,
        message,
        role: targetRole,
      });
      toast.success("Broadcast notification sent successfully!");
      setTitle("");
      setMessage("");
      refresh();
    } catch (err: any) {
      toast.error(err?.message || "Failed to send notification");
    } finally {
      setSending(false);
    }
  };

  const columns = [
    {
      header: "Notification",
      cell: (n: any) => (
        <div className="space-y-0.5">
          <p className="font-semibold text-slate-900 text-sm">{n.title}</p>
          <p className="text-xs text-slate-600">{n.message}</p>
        </div>
      ),
    },
    {
      header: "Target",
      cell: (n: any) => (
        <Badge variant="outline" className="capitalize bg-slate-100 font-semibold text-slate-700 text-xs">
          {n.role || "all"}
        </Badge>
      ),
    },
    {
      header: "Date Sent",
      cell: (n: any) => (
        <span className="text-xs text-slate-500">
          {n.createdAt ? new Date(n.createdAt).toLocaleDateString() : "N/A"}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#16253E] tracking-tight flex items-center gap-2">
            <Bell className="w-6 h-6 text-[#2E5089]" />
            Push Notifications Dispatcher
          </h1>
          <p className="text-xs text-slate-500 font-normal">Broadcast mobile push notifications and system announcements to citizens and lawyers.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 shadow-xs">
          <CardHeader>
            <CardTitle className="text-base font-bold text-[#16253E]">Broadcast Notification</CardTitle>
            <CardDescription className="text-xs text-slate-500">Dispatch real-time push alert</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSendTestPush} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Target Audience</label>
                <select
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm"
                >
                  <option value="all">All App Users</option>
                  <option value="citizen">Citizens Only</option>
                  <option value="lawyer">Lawyers & Experts Only</option>
                  <option value="student">Law Students Only</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Alert Title <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="e.g. Legal Platform Maintenance"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Alert Message Body <span className="text-red-500">*</span>
                </label>
                <Textarea
                  placeholder="Enter detailed alert content..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={sending}
                className="w-full bg-[#2E5089] hover:bg-[#244172] text-white font-semibold gap-2"
              >
                <Send className="w-4 h-4" />
                {sending ? "Dispatching..." : "Send Notification"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 shadow-xs flex flex-col justify-between">
          <div>
            <CardHeader>
              <CardTitle className="text-base font-bold text-[#16253E]">Broadcast Logs</CardTitle>
              <CardDescription className="text-xs text-slate-500">History of sent notifications and status</CardDescription>
            </CardHeader>
            <CardContent>
              <DashboardTable
                data={notifications}
                columns={columns}
                loading={isLoading}
                emptyText="No broadcast history found."
              />
            </CardContent>
          </div>

          <div className="p-4 pt-0">
            <Pagination
              page={page}
              totalPages={totalPages}
              totalItems={totalItems}
              onPageChange={(newPage) => setPage(newPage)}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}
