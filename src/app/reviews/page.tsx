"use client";

import React from "react";
import { useListQuery } from "@/hooks/useListQuery";
import { Star, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/shared/Pagination";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

export default function ReviewsPage() {
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

  const handleDeleteReview = async (id: string) => {
    try {
      await api.delete(`/review/${id}`);
      toast.success("Review removed successfully");
      refresh();
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete review");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#16253E] tracking-tight flex items-center gap-2">
            <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
            Lawyer Reviews & Moderation
          </h1>
          <p className="text-xs text-slate-500 font-normal">Monitor ratings and feedback submitted by citizens for verified lawyers and legal experts.</p>
        </div>
        <Badge variant="outline" className="px-3 py-1 bg-white text-slate-700 font-semibold">
          Total Feedback Entries: {totalItems}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {isLoading ? (
          <div className="col-span-2 text-center py-12 text-slate-500 text-sm">Loading lawyer feedback...</div>
        ) : reviews.length === 0 ? (
          <div className="col-span-2 text-center py-12 text-slate-500 text-sm">No review entries submitted yet.</div>
        ) : (
          reviews.map((rev) => (
            <Card key={rev._id || rev.id} className="shadow-xs hover:border-slate-300 transition-colors">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <Badge variant="outline" className="bg-[#2E5089]/10 text-[#2E5089] font-semibold border-[#2E5089]/30 text-[10px]">
                      Lawyer: {rev.lawyerName || rev.lawyer?.fullName || rev.lawyer?.name || "Legal Expert"}
                    </Badge>
                    <div className="flex items-center gap-1 mt-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
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
                    onClick={() => handleDeleteReview(rev._id || rev.id)}
                    className="text-red-500 hover:bg-red-50 hover:text-red-600 h-8 w-8 p-0"
                    title="Delete review"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100 italic">
                  "{rev.comment}"
                </p>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>By: <strong className="text-slate-700">{rev.reviewerName || rev.user?.fullName || rev.user?.name || "Verified Citizen"}</strong></span>
                  <span>{rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : "N/A"}</span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Pagination
        page={page}
        totalPages={totalPages}
        totalItems={totalItems}
        onPageChange={(newPage) => setPage(newPage)}
      />
    </div>
  );
}
