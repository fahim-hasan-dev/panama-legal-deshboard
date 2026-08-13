"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import {
  HelpCircle,
  Plus,
  Trash2,
  ChevronRight,
  Home,
  FolderTree,
  ArrowLeft,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import toast from "react-hot-toast";

interface QuestionItem {
  _id: string;
  id?: string;
  name: string;
  parent?: any;
  createdAt?: string;
}

export default function CaseQuestionsPage() {
  const [breadcrumbs, setBreadcrumbs] = useState<QuestionItem[]>([]);
  const [currentQuestions, setCurrentQuestions] = useState<QuestionItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const currentParent = breadcrumbs.length > 0 ? breadcrumbs[breadcrumbs.length - 1] : null;

  const loadQuestionsAtLevel = async (parentItem: QuestionItem | null) => {
    setLoading(true);
    try {
      const parentId = parentItem ? (parentItem._id || parentItem.id) : "";
      const endpoint = parentId ? `/case-question?parentId=${parentId}` : "/case-question";
      const res = await api.get(endpoint);
      const list = res?.data || res || [];
      setCurrentQuestions(Array.isArray(list) ? list : []);
    } catch (err: any) {
      toast.error(err?.message || "Failed to load questions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuestionsAtLevel(null);
  }, []);

  const handleOpenSubQuestions = (item: QuestionItem) => {
    const newBreadcrumbs = [...breadcrumbs, item];
    setBreadcrumbs(newBreadcrumbs);
    loadQuestionsAtLevel(item);
  };

  const handleNavigateToBreadcrumb = (index: number) => {
    if (index === -1) {
      setBreadcrumbs([]);
      loadQuestionsAtLevel(null);
    } else {
      const newBreadcrumbs = breadcrumbs.slice(0, index + 1);
      setBreadcrumbs(newBreadcrumbs);
      loadQuestionsAtLevel(newBreadcrumbs[newBreadcrumbs.length - 1]);
    }
  };

  const handleCreateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter a question or topic name.");
      return;
    }

    setSubmitting(true);
    try {
      const payload: any = { name: name.trim() };
      if (currentParent) {
        payload.parent = currentParent._id || currentParent.id;
      }

      await api.post("/case-question/add-question", payload);
      toast.success("Question added successfully!");
      setShowAddModal(false);
      setName("");

      loadQuestionsAtLevel(currentParent);
    } catch (err: any) {
      toast.error(err?.message || "Failed to create question");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteQuestion = async (id: string) => {
    try {
      await api.delete(`/case-question/delete-question/${id}`);
      toast.success("Question deleted successfully");
      loadQuestionsAtLevel(currentParent);
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete question");
    }
  };

  const openAddModal = () => {
    setName("");
    setShowAddModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#16253E] tracking-tight flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-[#2E5089]" />
            Case Questions
          </h1>
          <p className="text-xs text-slate-500 font-normal">
            Manage legal questions and choices presented to citizens when creating a new case.
          </p>
        </div>

        <Button
          onClick={openAddModal}
          className="bg-[#2E5089] hover:bg-[#244172] text-white font-semibold text-xs gap-1.5"
        >
          <Plus className="w-4 h-4" />
          {currentParent ? `Add Sub-question under "${currentParent.name}"` : "Add Root Question"}
        </Button>
      </div>

      {/* Navigation Breadcrumb Bar */}
      <nav className="flex items-center gap-2 p-3 bg-white rounded-xl border border-slate-200 shadow-xs overflow-x-auto">
        <button
          onClick={() => handleNavigateToBreadcrumb(-1)}
          className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors ${
            breadcrumbs.length === 0
              ? "bg-[#2E5089] text-white"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Home className="w-3.5 h-3.5" />
          All Categories
        </button>

        {breadcrumbs.map((crumb, idx) => {
          const isLast = idx === breadcrumbs.length - 1;
          return (
            <React.Fragment key={crumb._id || crumb.id || idx}>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <button
                onClick={() => handleNavigateToBreadcrumb(idx)}
                className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap ${
                  isLast
                    ? "bg-[#2E5089] text-white"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                {crumb.name}
              </button>
            </React.Fragment>
          );
        })}
      </nav>

      {/* Questions Card Container */}
      <Card className="shadow-xs">
        <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              {currentParent && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleNavigateToBreadcrumb(breadcrumbs.length - 2)}
                  className="h-7 w-7 p-0 text-slate-600 hover:bg-slate-100"
                  title="Go Back"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              )}
              <CardTitle className="text-base font-bold text-[#16253E] flex items-center gap-2">
                <FolderTree className="w-4 h-4 text-[#2E5089]" />
                {currentParent ? `Sub-questions: ${currentParent.name}` : "Root Categories"}
              </CardTitle>
            </div>
            <CardDescription className="text-xs text-slate-500 mt-1">
              {currentParent
                ? `Questions belonging directly under "${currentParent.name}"`
                : "Top-level case categories"}
            </CardDescription>
          </div>
          <Badge variant="outline" className="bg-slate-50 text-slate-700 font-semibold">
            Count: {currentQuestions.length}
          </Badge>
        </CardHeader>

        <CardContent className="p-4">
          {loading ? (
            <div className="text-center py-12 text-slate-500 text-sm">Loading questions...</div>
          ) : currentQuestions.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <p className="text-sm text-slate-500">
                {currentParent
                  ? `No sub-questions created under "${currentParent.name}" yet.`
                  : "No root categories created yet."}
              </p>
              <Button
                onClick={openAddModal}
                variant="outline"
                className="text-xs text-[#2E5089] border-[#2E5089]/30"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                {currentParent ? `Add Sub-question under "${currentParent.name}"` : "Add Root Question"}
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQuestions.map((item) => (
                <div
                  key={item._id || item.id}
                  className="p-4 rounded-xl border border-slate-200 bg-white hover:border-[#2E5089]/40 hover:shadow-xs transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm leading-snug">{item.name}</h3>
                      <p className="text-[11px] text-slate-400 mt-1">
                        {currentParent ? `Parent: ${currentParent.name}` : "Root Level"}
                      </p>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteQuestion(item._id || item.id!)}
                      className="text-red-500 hover:bg-red-50 h-8 w-8 p-0 shrink-0"
                      title="Delete question"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-end pt-2 border-t border-slate-100">
                    <Button
                      onClick={() => handleOpenSubQuestions(item)}
                      className="bg-[#2E5089] hover:bg-[#244172] text-white text-xs font-semibold h-8 px-3 gap-1"
                    >
                      <span>View Sub-questions</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Context-Aware Add Question Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-[#16253E]">
              {currentParent ? `Add Sub-question` : "Add Root Category"}
            </DialogTitle>
            <DialogDescription>
              {currentParent
                ? `Creating nested question under "${currentParent.name}"`
                : "Creating top-level root question category"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateQuestion} className="space-y-4 py-2">
            {currentParent && (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-0.5">
                <p className="text-[11px] font-semibold text-slate-500 uppercase">Target Parent:</p>
                <p className="text-xs font-bold text-[#2E5089]">{currentParent.name}</p>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Question / Choice Name <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="e.g. Dismissal without prior notice"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting} className="bg-[#2E5089] hover:bg-[#244172] text-white font-semibold">
                {submitting ? "Saving..." : "Save Question"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
