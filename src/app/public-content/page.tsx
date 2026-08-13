"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Globe, Plus, Trash2, Edit, HelpCircle, Mail, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DashboardTable } from "@/components/shared/DashboardTable";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import toast from "react-hot-toast";

export default function PublicContentPage() {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [showFaqModal, setShowFaqModal] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [editingFaqId, setEditingFaqId] = useState<string | null>(null);

  const [privacyPolicy, setPrivacyPolicy] = useState("");
  const [terms, setTerms] = useState("");
  const [savingPolicy, setSavingPolicy] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [faqRes, contactRes, publicRes] = await Promise.allSettled([
        api.get("/public/faq/all"),
        api.get("/public/contact/all"),
        api.get("/public"),
      ]);

      const faqData = faqRes.status === "fulfilled" && faqRes.value?.data ? faqRes.value.data : [];
      const contactData = contactRes.status === "fulfilled" && contactRes.value?.data ? contactRes.value.data : [];
      const publicData = publicRes.status === "fulfilled" && publicRes.value?.data ? publicRes.value.data : {};

      setFaqs(Array.isArray(faqData) ? faqData : []);
      setContacts(Array.isArray(contactData) ? contactData : []);
      if (publicData.privacyPolicy) setPrivacyPolicy(publicData.privacyPolicy);
      if (publicData.termsAndConditions) setTerms(publicData.termsAndConditions);
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
    if (!question || !answer) return;
    try {
      if (editingFaqId) {
        await api.patch(`/public/faq/${editingFaqId}`, { question, answer });
        toast.success("FAQ updated!");
      } else {
        await api.post("/public/faq", { question, answer });
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

  const handleDeleteFaq = async (id: string) => {
    try {
      await api.delete(`/public/faq/${id}`);
      toast.success("FAQ deleted");
      setFaqs(faqs.filter((f) => (f._id || f.id) !== id));
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete FAQ");
    }
  };

  const handleSaveLegalPages = async (type: string, content: string) => {
    setSavingPolicy(true);
    try {
      await api.post("/public", { type, content });
      toast.success(`${type} saved successfully!`);
    } catch (err: any) {
      toast.error(err?.message || `Failed to update ${type}`);
    } finally {
      setSavingPolicy(false);
    }
  };

  const contactColumns = [
    {
      header: "Sender Name",
      cell: (c: any) => <span className="font-semibold text-slate-900 text-sm">{c.name}</span>,
    },
    {
      header: "Email",
      cell: (c: any) => <span className="text-xs text-slate-600">{c.email}</span>,
    },
    {
      header: "Subject",
      cell: (c: any) => <span className="text-xs font-semibold text-[#2E5089]">{c.subject || "General Inquiry"}</span>,
    },
    {
      header: "Message Body",
      cell: (c: any) => <span className="text-xs text-slate-700 max-w-xs truncate block">{c.message}</span>,
    },
    {
      header: "Date Sent",
      cell: (c: any) => <span className="text-xs text-slate-500">{c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "N/A"}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#16253E] tracking-tight flex items-center gap-2">
            <Globe className="w-6 h-6 text-[#2E5089]" />
            Public Content & Legal Terms
          </h1>
          <p className="text-xs text-slate-500 font-normal">Manage FAQs, user contact submissions, Privacy Policy, and Terms of Service.</p>
        </div>
      </div>

      <Tabs defaultValue="faq" className="w-full">
        <TabsList>
          <TabsTrigger value="faq" className="gap-2">
            <HelpCircle className="w-4 h-4" />
            <span>FAQ Management ({faqs.length})</span>
          </TabsTrigger>
          <TabsTrigger value="contacts" className="gap-2">
            <Mail className="w-4 h-4" />
            <span>Contact Messages ({contacts.length})</span>
          </TabsTrigger>
          <TabsTrigger value="legal" className="gap-2">
            <FileText className="w-4 h-4" />
            <span>Privacy & Terms Editor</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="faq" className="mt-6 space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => { setEditingFaqId(null); setQuestion(""); setAnswer(""); setShowFaqModal(true); }} className="bg-[#2E5089] hover:bg-[#244172] text-white font-semibold text-xs gap-1.5">
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
                          className="h-8 w-8 p-0 text-slate-500"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteFaq(f._id || f.id)}
                          className="h-8 w-8 p-0 text-red-500 hover:bg-red-50"
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

        <TabsContent value="contacts" className="mt-6">
          <DashboardTable
            data={contacts}
            columns={contactColumns}
            loading={loading}
            emptyText="No contact messages received yet."
          />
        </TabsContent>

        <TabsContent value="legal" className="mt-6 space-y-6">
          <Card className="shadow-xs">
            <CardHeader>
              <CardTitle className="text-base font-bold text-[#16253E]">Privacy Policy Editor</CardTitle>
              <CardDescription className="text-xs text-slate-500">Public privacy policy displayed in mobile & web apps</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                rows={6}
                value={privacyPolicy}
                placeholder="Enter privacy policy text..."
                onChange={(e) => setPrivacyPolicy(e.target.value)}
              />
              <Button
                onClick={() => handleSaveLegalPages("privacy-policy", privacyPolicy)}
                disabled={savingPolicy}
                className="bg-[#2E5089] hover:bg-[#244172] text-white font-semibold"
              >
                Save Privacy Policy
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-xs">
            <CardHeader>
              <CardTitle className="text-base font-bold text-[#16253E]">Terms & Conditions Editor</CardTitle>
              <CardDescription className="text-xs text-slate-500">Terms of service agreement for citizens & lawyers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                rows={6}
                value={terms}
                placeholder="Enter terms & conditions text..."
                onChange={(e) => setTerms(e.target.value)}
              />
              <Button
                onClick={() => handleSaveLegalPages("terms-and-conditions", terms)}
                disabled={savingPolicy}
                className="bg-[#2E5089] hover:bg-[#244172] text-white font-semibold"
              >
                Save Terms & Conditions
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={showFaqModal} onOpenChange={setShowFaqModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
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
    </div>
  );
}
