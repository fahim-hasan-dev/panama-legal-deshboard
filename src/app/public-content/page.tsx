"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { api } from "@/lib/api";
import {
  Globe,
  Plus,
  Trash2,
  Edit,
  HelpCircle,
  ShieldCheck,
  FileCode2,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import toast from "react-hot-toast";

import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "clean"],
  ],
};

export default function PublicContentPage() {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // FAQ Modal State
  const [showFaqModal, setShowFaqModal] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [editingFaqId, setEditingFaqId] = useState<string | null>(null);

  // FAQ Delete Confirmation State
  const [deletingFaq, setDeletingFaq] = useState<any | null>(null);

  // Legal Pages State
  const [privacyPolicy, setPrivacyPolicy] = useState("");
  const [terms, setTerms] = useState("");
  const [savingPrivacy, setSavingPrivacy] = useState(false);
  const [savingTerms, setSavingTerms] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [faqRes, privacyRes, termsRes] = await Promise.allSettled([
        api.get("/public/faq/all"),
        api.get("/public/privacy-policy"),
        api.get("/public/terms-and-conditions"),
      ]);

      const faqData = faqRes.status === "fulfilled" && faqRes.value?.data ? faqRes.value.data : [];
      const privacyData = privacyRes.status === "fulfilled" && privacyRes.value?.data ? privacyRes.value.data : null;
      const termsData = termsRes.status === "fulfilled" && termsRes.value?.data ? termsRes.value.data : null;

      setFaqs(Array.isArray(faqData) ? faqData : []);
      if (privacyData?.content) setPrivacyPolicy(privacyData.content);
      if (termsData?.content) setTerms(termsData.content);
    } catch (err: any) {
      toast.error(err?.message || "Failed to load public content");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) return;
    try {
      if (editingFaqId) {
        await api.patch(`/public/faq/${editingFaqId}`, { question: question.trim(), answer: answer.trim() });
        toast.success("FAQ updated!");
      } else {
        await api.post("/public/faq", { question: question.trim(), answer: answer.trim() });
        toast.success("FAQ created!");
      }
      setShowFaqModal(false);
      setQuestion("");
      setAnswer("");
      setEditingFaqId(null);
      fetchData();
    } catch (err: any) {
      toast.error(err?.message || "Failed to save FAQ");
    }
  };

  const confirmDeleteFaq = async () => {
    if (!deletingFaq) return;
    const id = deletingFaq._id || deletingFaq.id;
    try {
      await api.delete(`/public/faq/${id}`);
      toast.success("FAQ deleted successfully!");
      setFaqs(faqs.filter((f) => (f._id || f.id) !== id));
      setDeletingFaq(null);
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete FAQ");
    }
  };

  const handleSaveLegalPages = async (type: "privacy-policy" | "terms-and-conditions", content: string) => {
    if (type === "privacy-policy") setSavingPrivacy(true);
    else setSavingTerms(true);

    try {
      await api.post("/public", { type, content });
      toast.success(`${type === "privacy-policy" ? "Privacy Policy" : "Terms & Conditions"} saved successfully!`);
    } catch (err: any) {
      toast.error(err?.message || `Failed to update ${type}`);
    } finally {
      setSavingPrivacy(false);
      setSavingTerms(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#16253E] tracking-tight flex items-center gap-2">
            <Globe className="w-6 h-6 text-[#2E5089]" />
            Public Content Management
          </h1>
          <p className="text-xs text-slate-500 font-normal">
            Manage FAQs, Privacy Policy, and Terms of Service presented to citizens and legal professionals.
          </p>
        </div>
      </div>

      <Tabs defaultValue="faq" className="w-full">
        <TabsList>
          <TabsTrigger value="faq" className="gap-2">
            <HelpCircle className="w-4 h-4" />
            <span>FAQs ({faqs.length})</span>
          </TabsTrigger>

          <TabsTrigger value="privacy" className="gap-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Privacy Policy</span>
          </TabsTrigger>

          <TabsTrigger value="terms" className="gap-2">
            <FileCode2 className="w-4 h-4" />
            <span>Terms & Conditions</span>
          </TabsTrigger>
        </TabsList>

        {/* FAQs Tab */}
        <TabsContent value="faq" className="mt-6 space-y-4">
          <div className="flex justify-end">
            <Button
              onClick={() => {
                setEditingFaqId(null);
                setQuestion("");
                setAnswer("");
                setShowFaqModal(true);
              }}
              className="bg-[#2E5089] hover:bg-[#244172] text-white font-semibold text-xs gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Add FAQ Item
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-12 text-slate-500 text-sm">Loading FAQs...</div>
          ) : faqs.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm">No FAQ items created yet.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {faqs.map((f) => (
                <Card key={f._id || f.id} className="shadow-xs hover:border-slate-300 transition-colors">
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-slate-900 text-sm">{f.question}</h3>
                      <div className="flex items-center gap-1 shrink-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingFaqId(f._id || f.id);
                            setQuestion(f.question);
                            setAnswer(f.answer);
                            setShowFaqModal(true);
                          }}
                          className="h-8 w-8 p-0 text-slate-500 hover:text-slate-900"
                          title="Edit FAQ"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeletingFaq(f)}
                          className="h-8 w-8 p-0 text-red-500 hover:bg-red-50"
                          title="Delete FAQ"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                      {f.answer}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Privacy Policy Tab with WYSIWYG ReactQuill Editor */}
        <TabsContent value="privacy" className="mt-6">
          <Card className="shadow-xs border border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <CardTitle className="text-base font-bold text-[#16253E] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#2E5089]" />
                  Privacy Policy Editor
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Formatted privacy policy content for public web and mobile apps.
                </CardDescription>
              </div>

              <Button
                onClick={() => handleSaveLegalPages("privacy-policy", privacyPolicy)}
                disabled={savingPrivacy}
                className="bg-[#2E5089] hover:bg-[#244172] text-white font-semibold text-xs"
              >
                {savingPrivacy ? "Saving..." : "Save Privacy Policy"}
              </Button>
            </CardHeader>

            <CardContent className="p-4 space-y-3">
              <div className="bg-white rounded-lg">
                <ReactQuill
                  theme="snow"
                  value={privacyPolicy}
                  onChange={setPrivacyPolicy}
                  modules={quillModules}
                  placeholder="Compose privacy policy content..."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Terms & Conditions Tab with WYSIWYG ReactQuill Editor */}
        <TabsContent value="terms" className="mt-6">
          <Card className="shadow-xs border border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <CardTitle className="text-base font-bold text-[#16253E] flex items-center gap-2">
                  <FileCode2 className="w-4 h-4 text-[#2E5089]" />
                  Terms & Conditions Editor
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Legal terms and service agreement for citizens and lawyers.
                </CardDescription>
              </div>

              <Button
                onClick={() => handleSaveLegalPages("terms-and-conditions", terms)}
                disabled={savingTerms}
                className="bg-[#2E5089] hover:bg-[#244172] text-white font-semibold text-xs"
              >
                {savingTerms ? "Saving..." : "Save Terms & Conditions"}
              </Button>
            </CardHeader>

            <CardContent className="p-4 space-y-3">
              <div className="bg-white rounded-lg">
                <ReactQuill
                  theme="snow"
                  value={terms}
                  onChange={setTerms}
                  modules={quillModules}
                  placeholder="Compose terms & conditions content..."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add / Edit FAQ Modal */}
      <Dialog open={showFaqModal} onOpenChange={setShowFaqModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-[#16253E]">
              {editingFaqId ? "Edit FAQ Item" : "Create New FAQ"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSaveFaq} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Question <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="e.g. What payment methods are accepted in Panama?"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Detailed Answer <span className="text-red-500">*</span>
              </label>
              <Textarea
                placeholder="Provide clear explanation..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                rows={4}
                required
              />
            </div>

            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={() => setShowFaqModal(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-[#2E5089] hover:bg-[#244172] text-white font-semibold">
                Save FAQ
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete FAQ Confirmation Modal */}
      <Dialog open={!!deletingFaq} onOpenChange={(open) => !open && setDeletingFaq(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Confirm FAQ Deletion
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Are you sure you want to delete this FAQ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {deletingFaq && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg my-2">
              <p className="text-xs font-bold text-slate-800">{deletingFaq.question}</p>
            </div>
          )}

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setDeletingFaq(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteFaq}>
              Delete FAQ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
