"use client";

import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { SessionGuard } from "@/components/admin/session-guard";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/mdtadmin/login";

  return (
    <div className="flex min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px] pointer-events-none" />
      <div className="absolute inset-0 flex items-center justify-center bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-charcoal-blue/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-verdigris/5 rounded-full blur-3xl pointer-events-none" />

      {!isLoginPage && <SessionGuard />}
      {!isLoginPage && <AdminSidebar className="z-20 relative" />}
      <main
        className={`flex-1  ${!isLoginPage ? " w-[calc(100vw-256px)] max-h-[calc(100vh-600px)]" : "w-[100vw] "} p-4 md:p-10 lg:p-12 overflow-y-auto min-h-screen relative z-10 custom-scrollbar`}
      >
        <div className="max-w-7xl mx-auto w-full h-full animate-in fade-in duration-700 slide-in-from-bottom-4">{children}</div>
      </main>
    </div>
  );
}
