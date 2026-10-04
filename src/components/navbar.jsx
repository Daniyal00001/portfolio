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
    if (pathname !== "/") return

    const update = () => {
      const sections = [...document.querySelectorAll("section[id]")]
      if (sections.length === 0) return
      const line = 120
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4
      let current = sections[0].id
      if (atBottom) {
        current = sections[sections.length - 1].id
      } else {
        for (const section of sections) {
          if (section.getBoundingClientRect().top <= line) current = section.id
        }
      }
      setActiveSection(current === "home" ? "/" : `/${current}`)
    }

    update()
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)
    return () => {
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
    }
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
            <SheetContent
              side="left"
              overlayClassName="bg-black/70"
              className="w-72 gap-0 border-r border-border bg-background p-0 sm:max-w-none"
            >
              <SheetHeader className="border-b border-border/70 px-6 py-5 pr-12">
                <SheetTitle className="sr-only">Menu</SheetTitle>
                <img src={content.logoLight} alt="MDT" className="h-8 w-auto max-w-[8.5rem] object-contain object-left dark:hidden" />
                <img src={content.logoDark} alt="MDT" className="hidden h-8 w-auto max-w-[8.5rem] object-contain object-left dark:block" />
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-3 py-4">
                {navItems.map((item) => {
                  const active = pathname === "/" ? activeSection === item.href : pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={(e) => handleNavClick(e, item.href)}
                      className={cn(
                        "rounded-lg px-3 py-3 text-base font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
                        active && "bg-primary/10 text-foreground"
                      )}
                    >
                      <span className="inline-flex flex-col">
                        <span className={cn(active && "font-semibold")}>{item.name}</span>
                        <span className={cn("mt-1 h-0.5 rounded-full bg-primary", active ? "w-full" : "w-0")} />
                      </span>
                    </Link>
                  )
                })}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  )
}
