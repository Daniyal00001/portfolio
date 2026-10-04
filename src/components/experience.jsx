"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { ArrowUpRight, Briefcase, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mydata } from "@/lib/data"
import { useSiteContent } from "@/components/site-content"

export function Experience() {
  const { content } = useSiteContent()
  const [experiences, setExperiences] = useState(Mydata.Experience.map((e, idx) => ({
    id: idx,
    company: e.Company,
    position: e.Position,
    location: e.Location,
    description: e.Description,
    duration: e.Duration,
    is_development: e.Company !== "BestMobile.pk",
    company_url: e.Website || "",
    logo_url: e.Logo || "",
    links: e.Links || [],
    skills: []
  })))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchExperience() {
      try {
        const { data, error } = await supabase
          .from("experience")
          .select("*")
          .order("id", { ascending: true })

        if (data) setExperiences(data)
      } catch (err) {
        console.error("Error loading experience:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchExperience()
  }, [])

  if (loading && experiences.length === 0) {
    return (
      <div className="flex justify-center p-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const devRoles = experiences.filter(job => job.is_development !== false);
  const otherRoles = experiences.filter(job => job.is_development === false);

  return (
    <section id="experience" className="relative container py-12 md:py-24 lg:py-32">
      {/* Spotlight Background */}
      <div className="absolute inset-0 z-0 flex items-center justify-start pointer-events-none mix-blend-screen">
        <div className="w-[800px] h-[800px] bg-primary/10 blur-[140px] rounded-full -translate-x-1/2 text-transparent" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="flex flex-col items-center gap-4 text-center mb-16"
      >
        <h2 className="font-display text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl border-b-4 border-primary pb-2 relative z-10 w-fit mx-auto">
          {content.experienceTitle}
        </h2>
        <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
          {content.experienceBody}
        </p>
      </motion.div>

      <div className="relative mx-auto mb-20 max-w-3xl pl-8">
        <div className="absolute bottom-0 left-0 top-2 w-0.5 bg-border"></div>

        {devRoles.map((job, index) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="group relative mb-12"
          >
            <div className="absolute left-0 z-10 mt-1.5 h-4 w-4 -translate-x-[calc(50%-1px)] rounded-full border-4 border-background bg-primary shadow-[0_2px_10px_-2px_color-mix(in_oklch,var(--primary)_50%,transparent)] transition-transform duration-300 group-hover:scale-125"></div>

            <div className="w-full text-left">
              <Card className="retro-card border border-border bg-card/80 backdrop-blur-xl transition-all duration-300 hover:border-primary/50 hover:shadow-lg">
                <CardHeader className="pb-2">
                  <div className="flex items-start gap-3 text-left">
                    <CompanyLogo src={job.logo_url} name={job.company} />
                    <div className="flex min-w-0 flex-col items-start">
                      <span className="mb-1 font-mono text-sm text-primary">{job.duration}</span>
                      <CardTitle className="text-xl font-bold text-foreground">{job.position}</CardTitle>
                      <h4 className="text-balance text-sm font-semibold text-muted-foreground">
                        <ExperienceLink href={job.company_url}>{job.company}</ExperienceLink>
                      </h4>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ExperiencePoints text={job.description} links={job.links} />
                </CardContent>
              </Card>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Other Experience */}
      {otherRoles.length > 0 && (
        <div className="max-w-3xl mx-auto border-t border-border pt-12">
          <h3 className="text-xl font-bold mb-8 text-muted-foreground uppercase tracking-widest text-center">{content.experienceOtherHeading}</h3>
          <div className="relative border-l border-border ml-3 md:ml-6 space-y-10 py-2">
            {otherRoles.map((job, idx) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="relative pl-8 md:pl-12"
              >
                <span className="absolute -left-[5px] top-2 h-2.5 w-2.5 rounded-full bg-primary ring-4 ring-background shadow-[0_2px_8px_-2px_color-mix(in_oklch,var(--primary)_40%,transparent)]" />

                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-2">
                  <div className="space-y-1">
                    <h4 className="text-lg font-bold text-foreground hover:text-primary transition-colors">
                      {job.position}
                    </h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                      <Briefcase className="w-3.5 h-3.5 text-primary/70" />
                      <ExperienceLink href={job.company_url}>{job.company}</ExperienceLink>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-medium text-primary/80 bg-primary/10 px-2 py-0.5 rounded border border-primary/20 w-fit">
                    {job.duration}
                  </span>
                </div>

                <ExperiencePoints text={job.description} links={job.links} muted />
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {experiences.length === 0 && (
        <div className="text-center text-muted-foreground py-12">
          Stay tuned for updates...
        </div>
      )}
    </section>
  )
}

function CompanyLogo({ src, name }) {
  if (!src) return <Briefcase className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />
  return (
    <img
      src={src}
      alt={name}
      className="h-12 w-12 shrink-0 rounded-md border border-border bg-white object-contain p-0.5"
    />
  )
}

function safeUrl(value) {
  try {
    const url = new URL(String(value || ""))
    if (url.protocol === "http:" || url.protocol === "https:") return url.href
  } catch {
    return ""
  }
  return ""
}

function linkedPoint(point, links) {
  const sorted = [...(links || [])].sort((a, b) => String(b.label || "").length - String(a.label || "").length)
  for (const link of sorted) {
    const label = String(link.label || "").trim()
    const href = safeUrl(link.url)
    if (!label || !href) continue
    if (!point.toLowerCase().startsWith(label.toLowerCase())) continue
    let end = label.length
    if (point.slice(end).trimStart().startsWith(":")) end = point.indexOf(":", end) + 1
    return { name: point.slice(0, end).trimEnd(), rest: point.slice(end).trimStart(), href }
  }
  return null
}

function ExperienceLink({ href, children, light = false }) {
  const url = safeUrl(href)
  if (!url) return children
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className={`${light ? "font-medium text-foreground" : "hover:text-foreground"}`}
    >
      {children}
      <ArrowUpRight className="ml-0.5 inline h-3.5 w-3.5 align-[-2px] text-muted-foreground" aria-hidden="true" />
      <span className="sr-only">Opens in a new tab</span>
    </a>
  )
}

function ExperiencePoints({ text, links = [], alignEnd = false, muted = false }) {
  const points = String(text || "")
    .split(/\n+/)
    .map((point) => point.trim())
    .filter(Boolean)

  if (points.length <= 1 && points.length > 0 && !linkedPoint(points[0], links)) {
    return (
      <p className={`mb-4 text-sm leading-relaxed ${muted ? "text-muted-foreground/80" : "text-foreground/80"}`}>
        {text}
      </p>
    )
  }

  return (
    <ul className="mb-4 space-y-3">
      {points.map((point) => {
        const linked = linkedPoint(point, links)
        return (
          <li
            key={point}
            className={`flex gap-2.5 text-left text-sm leading-relaxed ${muted ? "text-muted-foreground/80" : "text-foreground/80"} ${alignEnd ? "sm:flex-row-reverse sm:text-right" : ""}`}
          >
            <span className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full bg-primary shadow-[0_0_8px_2px_color-mix(in_oklch,var(--primary)_85%,transparent)]" />
            <span>
              {linked ? (
                <>
                  <ExperienceLink href={linked.href} light>{linked.name}</ExperienceLink>
                  {linked.rest ? ` ${linked.rest}` : ""}
                </>
              ) : (
                point
              )}
            </span>
          </li>
        )
      })}
    </ul>
  )
}
