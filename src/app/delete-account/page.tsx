import React from "react";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { Trash2, ShieldAlert, Smartphone } from "lucide-react";

export default function DeleteAccountPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-end mb-6">
          <LanguageSwitcher />
        </div>
        
        <div className="bg-white shadow-sm border border-slate-200 rounded-2xl overflow-hidden">
          <div className="p-8 md:p-10 border-b border-slate-100 bg-[#16253E] text-center">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-8 h-8 text-red-400" />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Account Deletion</h1>
            <p className="text-slate-300 mt-2 text-sm">
              Instructions for deleting your PV & ASOCIADOS Legal Group account.
            </p>
          </div>
          <div className="p-8 md:p-10">
            
            <div className="space-y-6">
              <div className="flex items-start gap-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <ShieldAlert className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-amber-900">Important Information</h3>
                  <p className="text-sm text-amber-800 mt-1">
                    Deleting your account is permanent and cannot be undone. All your data, cases, and profile information will be completely removed from our systems.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
                  <Smartphone className="w-5 h-5 text-[#2E5089]" />
                  How to delete your account via the mobile app
                </h2>
                
                <ol className="list-decimal list-inside space-y-4 text-slate-700 ml-2">
                  <li><span className="font-medium text-slate-900">Open the app</span> and ensure you are logged in.</li>
                  <li>Navigate to your <span className="font-medium text-slate-900">Profile</span> section from the bottom navigation bar.</li>
                  <li>Scroll down and tap on the <span className="font-medium text-red-500">Delete account</span> option.</li>
                  <li>A confirmation popup will appear asking for your password.</li>
                  <li><span className="font-medium text-slate-900">Type your password</span> into the input field to confirm your identity.</li>
                  <li>Tap the red <span className="font-medium text-slate-900">Delete account</span> button to finalize.</li>
                </ol>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100">
                <p className="text-sm text-slate-500">
                  If you no longer have access to the app or need manual assistance deleting your account, please contact our support team.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
