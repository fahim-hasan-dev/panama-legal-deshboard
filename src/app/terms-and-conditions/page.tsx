import React from "react";
import { BASE_URL } from "@/config/env-config";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import "react-quill-new/dist/quill.snow.css";

export const dynamic = "force-dynamic";

async function getTerms() {
  try {
    const res = await fetch(`${BASE_URL}/public/terms-and-conditions`, { cache: "no-store" });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data?.content || null;
  } catch (err) {
    console.error("Failed to fetch terms:", err);
    return null;
  }
}

export default async function TermsAndConditionsPage() {
  const content = await getTerms();

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-end mb-6">
          <LanguageSwitcher />
        </div>
        
        <div className="bg-white shadow-sm border border-slate-200 rounded-2xl overflow-hidden">
          <div className="p-8 md:p-10 border-b border-slate-100 bg-[#16253E]">
            <h1 className="text-3xl font-bold text-white tracking-tight">Terms & Conditions</h1>
            <p className="text-slate-300 mt-2 text-sm">
              Please read the terms and conditions carefully before using PV & ASOCIADOS Legal Group.
            </p>
          </div>
          <div className="p-8 md:p-10">
            {content ? (
              <div className="ql-snow">
                <div 
                  className="ql-editor !p-0 text-slate-700 leading-relaxed" 
                  dangerouslySetInnerHTML={{ __html: content }} 
                />
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-slate-500">Terms & Conditions have not been published yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
