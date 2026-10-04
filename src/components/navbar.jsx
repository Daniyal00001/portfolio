"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Menu, X } from "lucide-react"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ModeToggle } from "@/components/mode-toggle"
import { useSiteContent } from "@/components/site-content"

const navItems = [
  { name: "About", href: "/" },
  { name: "Skills", href: "/skills" },
  { name: "Experience", href: "/experience" },
  { name: "Projects", href: "/projects" },
  { name: "Education", href: "/education" },
  { name: "Contact", href: "/contact" },
]

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { content } = useSiteContent()
  const [isOpen, setIsOpen] = React.useState(false)
  const [activeSection, setActiveSection] = React.useState("/")

  const handleNavClick = (e, href) => {
    e.preventDefault()
    setIsOpen(false)

    if (pathname === "/") {
      const targetId = href === "/" ? "home" : href.replace(/^\//, "")
      const element = document.getElementById(targetId)
      if (element) {
        window.history.pushState({}, "", href === "/" ? "/" : `#${targetId}`)
        const y = element.getBoundingClientRect().top + window.scrollY - 64
        window.scrollTo({ top: y, behavior: "smooth" })
        return
      }
    }

    router.push(href)
  }

  React.useEffect(() => {
    // Only run scroll spy on Home page
    if (pathname !== "/") return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id
            if (id === "home") setActiveSection("/")
            else setActiveSection(`/${id}`)
          }
        })
      },
      { rootMargin: "-30% 0px -70% 0px" } // Adjusted logic for better trigger
    )

    const sections = document.querySelectorAll("section[id]")
    sections.forEach((section) => observer.observe(section))

    return () => sections.forEach((section) => observer.unobserve(section))
  }, [pathname])

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="mr-8 flex items-center space-x-2" onClick={(e) => handleNavClick(e, "/")}>
          <img src={content.logoLight} alt="Logo" className="h-8 w-auto dark:hidden" />
          <img src={content.logoDark} alt="Logo" className="h-8 w-auto hidden dark:block" />
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className={cn(
                "transition-colors hover:text-foreground/80 text-foreground/60 relative group",
                (pathname === "/"
                  ? activeSection === item.href
                  : pathname === item.href)
                  ? "text-foreground font-semibold"
                  : ""
              )}
            >
              {item.name}
              <span className={cn(
                "absolute -bottom-1 left-0 w-full h-[2px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left",
                (pathname === "/"
                  ? activeSection === item.href
                  : pathname === item.href)
                  ? "scale-x-100 bg-primary"
                  : ""
              )} />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <ModeToggle />

          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden hover:bg-transparent">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] border-l border-border dark:border-primary/30">
              <SheetHeader>
                <SheetTitle className="font-display text-left text-2xl font-bold text-foreground">
                  Menu
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-8">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className={cn(
                      "text-lg font-medium transition-all hover:translate-x-2",
                      pathname === item.href
                        ? "text-primary font-bold translate-x-2"
                        : "text-foreground"
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  )
}
