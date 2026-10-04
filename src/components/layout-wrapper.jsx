"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { SiteContentProvider } from "@/components/site-content";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/mdtadmin");

  return (
    <SiteContentProvider>
      {!isAdmin && <Navbar />}
      <main className={`flex-1 w-full flex flex-col items-center min-h-screen overflow-x-clip`}>
        {children}
      </main>
    </SiteContentProvider>
  );
}
