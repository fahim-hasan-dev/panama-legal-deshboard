import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "PV & ASOCIADOS Legal Group - Admin Dashboard",
  description: "Management portal for PV & ASOCIADOS Legal Group application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-slate-50 text-slate-900 selection:bg-[#2E5089] selection:text-white">
        <AuthProvider>
          <DashboardLayout>{children}</DashboardLayout>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#16253E",
                color: "#fff",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: "500",
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
