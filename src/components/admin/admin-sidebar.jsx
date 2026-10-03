"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Briefcase,
  GraduationCap,
  Wrench,
  Users,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  Trophy,
  PenLine,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/mdtadmin",
    icon: LayoutDashboard,
  },
  {
    title: "Website",
    href: "/mdtadmin/website",
    icon: Globe,
  },
  {
    title: "Blog",
    href: "/mdtadmin/blog",
    icon: PenLine,
  },
  {
    title: "Experience",
    href: "/mdtadmin/experience",
    icon: Briefcase,
  },
  {
    title: "Education",
    href: "/mdtadmin/education",
    icon: GraduationCap,
  },
  {
    title: "Skills",
    href: "/mdtadmin/skills",
    icon: Wrench,
  },
  {
    title: "Messages",
    href: "/mdtadmin/messages",
    icon: MessageSquare,
  },
  {
    title: "Users",
    href: "/mdtadmin/users",
    icon: Users,
  },
  {
    title: "Achievements",
    href: "/mdtadmin#achievements",
    icon: Trophy,
  },
  {
    title: "Settings",
    href: "/mdtadmin/profile",
    icon: Settings,
  },
];

export function AdminSidebar({ className }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/mdtadmin/login");
  };

  const sidebarContent = (
    <div className="flex bg-card/80 backdrop-blur-xl flex-col h-full border-r border-border/50 ">
      <div className="p-8">
        <div className="flex items-center gap-3 group px-2">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-verdigris to-charcoal-blue flex items-center justify-center text-white shadow-lg shadow-verdigris/20 group-hover:scale-105 transition-transform">
            <LayoutDashboard className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-display font-bold text-charcoal-blue dark:text-verdigris tracking-tight">
              Admin
            </h2>
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Portal v2.0</p>
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 py-2 space-y-1 overflow-y-auto custom-scrollbar  max-h-[calc(100vh-40px)]">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 relative",
                isActive
                  ? "bg-charcoal-blue/5 text-charcoal-blue dark:bg-verdigris/10 dark:text-verdigris shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className={cn(
                "h-5 w-5 transition-transform duration-300 group-hover:scale-110",
                isActive ? "text-charcoal-blue dark:text-verdigris" : "text-muted-foreground/70"
              )} />
              {item.title}
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute left-0 w-1 h-6 bg-charcoal-blue dark:bg-verdigris rounded-r-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </div>

      <div className="p-4 mt-auto border-t border-border/50 bg-muted/30">
        <div className="px-4 py-4 mb-2 flex items-center gap-3 rounded-xl border border-border/50 bg-card/50">
          <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground border border-border pointer-events-none">
            {user?.email?.[0].toUpperCase() || "A"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{user?.user_metadata?.username || "Admin User"}</p>
            <p className="text-[10px] text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 dark:hover:bg-destructive/10 rounded-xl transition-colors h-11"
          onClick={handleLogout}
        >
          <LogOut className="mr-3 h-4 w-4" />
          <span className="font-medium">Sign Out</span>
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <div className="md:hidden h-16 border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-50 px-4 flex items-center justify-between ">
        <h2 className="text-lg font-display font-bold text-charcoal-blue dark:text-verdigris">Daniyal<span className="text-foreground">.dev</span></h2>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-xl hover:bg-muted">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72 border-r-0">
            {sidebarContent}
          </SheetContent>
        </Sheet>
      </div>

      <aside className={cn("hidden md:block w-64 fixed inset-y-0 left-0 z-40 bg-background max-h-[100vh]", className)}>
        {sidebarContent}
      </aside>
    </>
  );
}

