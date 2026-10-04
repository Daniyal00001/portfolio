import Link from "next/link"
import { Github, Linkedin, Mail, MapPin } from "lucide-react"
import { SiMedium } from "react-icons/si"

import { Mydata } from "@/lib/data"

const sections = [
  { label: "About", href: "/" },
  { label: "Skills", href: "/skills" },
  { label: "Experience", href: "/experience" },
  { label: "Projects", href: "/projects" },
  { label: "Achievements", href: "/achievements" },
  { label: "Contact", href: "/contact" },
]

const socials = [
  { label: "GitHub", href: Mydata.Socials.GitHub, icon: Github },
  { label: "LinkedIn", href: Mydata.Socials.LinkedIn, icon: Linkedin },
  { label: "Medium", href: Mydata.Socials.Medium, icon: SiMedium },
  { label: "Email", href: `mailto:${Mydata.Email}`, icon: Mail },
].filter((item) => item.href)

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="container py-14">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
          <div className="flex flex-col gap-4">
            <p className="font-display text-2xl font-bold tracking-tight text-foreground">
              {Mydata.Name}
            </p>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              Full stack developer building production web platforms with React, Next.js and
              Node.js. Currently open to new work.
            </p>
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 text-primary" />
              Islamabad, Pakistan
            </p>
          </div>

          <nav className="flex flex-col gap-3" aria-label="Footer">
            <p className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Explore
            </p>
            {sections.map((section) => (
              <Link
                key={section.href}
                href={section.href}
                className="w-fit text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                {section.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Elsewhere
            </p>
            {socials.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("mailto:") ? undefined : "_blank"}
                rel="noreferrer"
                className="flex w-fit items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                <Icon className="h-4 w-4" />
                {label}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border/60 pt-6 text-sm text-muted-foreground sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()} {Mydata.Name}. All rights reserved.
          </p>
          <p>
            Built with <span className="text-primary">&hearts;</span> using Next.js &middot;{" "}
            <a
              href="https://github.com/Start-app/Portfolio"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-primary underline underline-offset-4"
            >
              Source
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
