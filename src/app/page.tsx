"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import {
  Users,
  Briefcase,
  BookOpen,
  FileText,
  TrendingUp,
  ArrowRight,
  Scale,
  HelpCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DashboardTable } from "@/components/shared/DashboardTable";

export default function OverviewPage() {
  const [stats, setStats] = useState({
    usersCount: 0,
    lawyersCount: 0,
    casesCount: 0,
    activeCasesCount: 0,
    articlesCount: 0,
    libraryCount: 0,
    questionsCount: 0,
  });
  const [recentCases, setRecentCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOverviewData = async () => {
    setLoading(true);
    try {
      const [usersRes, lawyersRes, casesRes, articlesRes, libRes, questionsRes] = await Promise.allSettled([
        api.get("/user"),
        api.get("/user?role=lawyer"),
        api.get("/case"),
        api.get("/article"),
        api.get("/library"),
        api.get("/case-question"),
      ]);

      const usersList = usersRes.status === "fulfilled" && usersRes.value?.data
        ? (Array.isArray(usersRes.value.data) ? usersRes.value.data : usersRes.value.data.users || usersRes.value.data.data || [])
        : [];

      const lawyersList = lawyersRes.status === "fulfilled" && lawyersRes.value?.data
        ? (Array.isArray(lawyersRes.value.data) ? lawyersRes.value.data : lawyersRes.value.data.users || lawyersRes.value.data.data || [])
        : [];

      const casesList = casesRes.status === "fulfilled" && casesRes.value?.data
        ? (Array.isArray(casesRes.value.data) ? casesRes.value.data : casesRes.value.data.cases || casesRes.value.data.data || [])
        : [];

      const articlesList = articlesRes.status === "fulfilled" && articlesRes.value?.data
        ? (Array.isArray(articlesRes.value.data) ? articlesRes.value.data : articlesRes.value.data.data || [])
        : [];

      const libList = libRes.status === "fulfilled" && libRes.value?.data
        ? (Array.isArray(libRes.value.data) ? libRes.value.data : libRes.value.data.data || [])
        : [];

      const questionsList = questionsRes.status === "fulfilled" && questionsRes.value?.data
        ? (Array.isArray(questionsRes.value.data) ? questionsRes.value.data : questionsRes.value.data.data || [])
        : [];

      const activeCases = casesList.filter((c: any) => c.status === "active" || c.status === "pending");

      setStats({
        usersCount: usersList.length,
        lawyersCount: lawyersList.length,
        casesCount: casesList.length,
        activeCasesCount: activeCases.length,
        articlesCount: articlesList.length,
        libraryCount: libList.length,
        questionsCount: questionsList.length,
      });

      setRecentCases(casesList.slice(0, 5));
    } catch (error) {
      console.error("Failed to load overview analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOverviewData();
  }, []);

  const caseColumns = [
    {
      header: "Case ID & Title",
      cell: (c: any) => (
        <div className="space-y-0.5">
          <span className="text-[11px] font-bold text-[#2E5089] bg-[#2E5089]/10 px-2 py-0.5 rounded-md">
            {c.caseNumber || c._id || c.id}
          </span>
          <p className="font-semibold text-slate-900 text-xs mt-1">{c.title}</p>
        </div>
      ),
    },
    {
      header: "Client",
      cell: (c: any) => <span className="text-xs text-slate-700">{c.client?.fullName || c.client?.name || "Client"}</span>,
    },
    {
      header: "Status",
      cell: (c: any) => {
        const status = (c.status || "pending").toLowerCase();
        let colorClasses = "bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-100";
        
        if (status === "active" || status === "accepted") {
          colorClasses = "bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-100";
        } else if (status === "resolved" || status === "closed") {
          colorClasses = "bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-100";
        } else if (status === "cancelled" || status === "rejected") {
          colorClasses = "bg-rose-100 text-rose-800 border-rose-300 hover:bg-rose-100";
        }

        return (
          <Badge
            variant="outline"
            className={`capitalize font-semibold text-[11px] border px-2 py-0.5 ${colorClasses}`}
          >
            {c.status || "pending"}
          </Badge>
        );
      },
    },
    {
      header: "Filed Date",
      cell: (c: any) => <span className="text-xs text-slate-500">{c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "N/A"}</span>,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#16253E] tracking-tight">
          PV & ASOCIADOS Legal Group Executive Overview
        </h1>
        <p className="text-xs text-slate-500 font-normal">
          Real-time platform metrics, active legal case intake, lawyer directory stats, and published resources.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="shadow-xs hover:border-slate-300 transition-colors">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Registered Users</p>
              <h3 className="text-2xl font-bold text-[#16253E]">{loading ? "..." : stats.usersCount}</h3>
              <p className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                <TrendingUp className="w-3 h-3 text-emerald-600" /> Platform Accounts
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-[#2E5089]">
              <Users className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xs hover:border-slate-300 transition-colors">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Verified Attorneys</p>
              <h3 className="text-2xl font-bold text-[#16253E]">{loading ? "..." : stats.lawyersCount}</h3>
              <p className="text-[11px] text-[#2E5089] flex items-center gap-1 font-semibold">
                Registered Lawyers
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#2E5089]/10 border border-[#2E5089]/20 flex items-center justify-center text-[#2E5089]">
              <Scale className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xs hover:border-slate-300 transition-colors">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Legal Cases</p>
              <h3 className="text-2xl font-bold text-[#16253E]">{loading ? "..." : stats.casesCount}</h3>
              <p className="text-[11px] text-amber-600 font-medium">
                {stats.activeCasesCount} Active Intake
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-[#2E5089]">
              <Briefcase className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xs hover:border-slate-300 transition-colors">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Resources & Articles</p>
              <h3 className="text-2xl font-bold text-[#16253E]">{loading ? "..." : stats.articlesCount + stats.libraryCount}</h3>
              <p className="text-[11px] text-slate-500 font-medium">{stats.questionsCount} Case Questions</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-[#2E5089]">
              <BookOpen className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base font-bold text-[#16253E]">Recent Legal Case Intake</CardTitle>
              <CardDescription className="text-xs text-slate-500">Latest consultations filed by Panamanian citizens</CardDescription>
            </div>
            <Link href="/cases" className="text-xs font-semibold text-[#2E5089] hover:underline flex items-center gap-1">
              View All Cases <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </CardHeader>
          <CardContent>
            <DashboardTable
              data={recentCases}
              columns={caseColumns}
              loading={loading}
              emptyText="No recent cases filed."
            />
          </CardContent>
        </Card>

        <Card className="shadow-xs">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold text-[#16253E]">Quick Admin Actions</CardTitle>
            <CardDescription className="text-xs text-slate-500">Shortcuts to core platform management</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/lawyers" className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-slate-100 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-[#2E5089] text-white flex items-center justify-center font-bold">
                  <Scale className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Register Attorney</p>
                  <p className="text-[11px] text-slate-500">Create verified lawyer account</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </Link>

            <Link href="/articles" className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-slate-100 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-slate-800 text-white flex items-center justify-center font-bold">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Publish Article</p>
                  <p className="text-[11px] text-slate-500">Write educational legal article</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </Link>

            <Link href="/library" className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-slate-100 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-slate-800 text-white flex items-center justify-center font-bold">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Legal Library</p>
                  <p className="text-[11px] text-slate-500">Upload PDF legal document</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
