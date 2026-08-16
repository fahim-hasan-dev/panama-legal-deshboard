"use client";

import React, { useState, useMemo } from "react";
import { useListQuery } from "@/hooks/useListQuery";
import { Star, Trash2, User, Scale, ShieldAlert } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/shared/Pagination";
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

export default function ReviewsPage() {
  const [selectedTab, setSelectedTab] = useState<string>("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    data: reviews,
    isLoading,
    page,
    setPage,
    totalPages,
    totalItems,
    refresh,
  } = useListQuery<any>({
    endpoint: "/review/all",
  });

  const filteredReviews = useMemo(() => {
    if (!reviews || !Array.isArray(reviews)) return [];
    if (selectedTab === "all") return reviews;
    if (selectedTab === "citizen") {
      return reviews.filter((rev) => {
        const role = (rev.user?.role || rev.citizen?.role || rev.reviewerRole || "").toLowerCase();
        return role === "citizen" || role === "user" || !role || role !== "lawyer";
      });
    }
    if (selectedTab === "lawyer") {
      return reviews.filter((rev) => {
        const role = (rev.user?.role || rev.lawyer?.role || rev.reviewerRole || "").toLowerCase();
        return role === "lawyer" || rev.lawyerName || rev.lawyer;
      });
    }
    return reviews;
  }, [reviews, selectedTab]);

  const handleDeleteReview = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await api.delete(`/review/${deleteId}`);
      toast.success("Review entry removed successfully");
      setDeleteId(null);
      refresh();
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete review");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#16253E] tracking-tight flex items-center gap-2">
            <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
            Reviews & Ratings
          </h1>
          <p className="text-xs text-slate-500 font-normal">
            Monitor feedback, ratings, and testimonials submitted across citizens and verified lawyers.
          </p>
        </div>
        <Badge variant="outline" className="px-3 py-1 bg-white text-slate-700 font-semibold w-fit">
          Total Feedback Entries: {totalItems}
        </Badge>
      </div>

      {/* Filter Tabs */}
      <Card className="shadow-xs">
        <CardContent className="p-4 flex items-center gap-2 overflow-x-auto">
          {[
            { id: "all", label: "All Reviews" },
            { id: "citizen", label: "Citizen Reviews" },
            { id: "lawyer", label: "Lawyer Reviews" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                selectedTab === tab.id
                  ? "bg-[#2E5089] text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {isLoading ? (
          <div className="col-span-2 text-center py-12 text-slate-500 text-sm">Loading reviews...</div>
        ) : filteredReviews.length === 0 ? (
          <div className="col-span-2 text-center py-12 text-slate-500 text-sm">No review entries found for this tab.</div>
        ) : (
          filteredReviews.map((rev) => {
            const reviewerName =
              rev.reviewerName ||
              rev.user?.fullName ||
              rev.user?.name ||
              rev.citizen?.fullName ||
              rev.citizen?.name ||
              "Verified User";

            const reviewerRole = rev.user?.role || rev.citizen?.role || "Citizen";

            const targetName =
              rev.revieweeName ||
              rev.lawyerName ||
              rev.lawyer?.fullName ||
              rev.lawyer?.name ||
              rev.target?.fullName ||
              rev.target?.name ||
              "Legal Expert";

            return (
              <Card key={rev._id || rev.id} className="shadow-xs hover:border-slate-300 transition-colors">
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <Badge variant="outline" className="bg-[#2E5089]/10 text-[#2E5089] font-semibold border-[#2E5089]/30 text-[11px] flex items-center gap-1 w-fit">
                        <Scale className="w-3 h-3" />
                        Target: {targetName}
                      </Badge>
                      <div className="flex items-center gap-1 mt-2.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < (rev.rating || 5)
                                ? "text-amber-400 fill-amber-400"
                                : "text-slate-200"
                            }`}
                          />
                        ))}
                        <span className="text-xs font-bold text-slate-800 ml-1">{rev.rating || 5}.0</span>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteId(rev._id || rev.id)}
                      className="text-slate-400 hover:bg-red-50 hover:text-red-600 h-8 w-8 p-0 transition-colors"
                      title="Delete review entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100 italic">
                    "{rev.comment || rev.feedback || "No text feedback provided."}"
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3 text-slate-400" />
                      By: <strong className="text-slate-800 font-semibold">{reviewerName}</strong>
                      <span className="text-[10px] text-slate-400 capitalize">({reviewerRole})</span>
                    </span>
                    <span>{rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : "N/A"}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      <Pagination
        page={page}
        totalPages={totalPages}
        totalItems={totalItems}
        onPageChange={(newPage) => setPage(newPage)}
      />

      {/* Delete Review Confirmation Dialog */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-[#16253E]">
              <ShieldAlert className="w-5 h-5 text-red-600" />
              Confirm Delete Review
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to permanently delete this user feedback entry? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteId(null)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteReview}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Review"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
