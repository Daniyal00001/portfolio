"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { ArrowRight, Download, Github, Linkedin, Mail, MapPin, Terminal, Loader2 } from "lucide-react"
import { SiMedium } from "react-icons/si"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { LiquidEther } from "@/components/liquid-ether"
import { Mydata } from "@/lib/data"
import { useSiteContent } from "@/components/site-content"

export function Hero() {
  const { profile: row, content } = useSiteContent()
  const profile = {
    Name: row?.name || Mydata.Name,
    Role: row?.role || Mydata.Role,
    Summary: row?.summary || Mydata.Summary,
    Email: row?.email || Mydata.Email,
    Socials: {
      LinkedIn: row?.social_linkedin || Mydata.Socials.LinkedIn,
      GitHub: row?.social_github || Mydata.Socials.GitHub,
      Portfolio: row?.social_portfolio || Mydata.Socials.Portfolio,
      Medium: row?.social_medium || content.mediumUrl,
    },
    ResumeUrl: row?.resume_url || content.resumeFallback,
    ImageUrl: row?.image_url || content.portraitFallback,
  }
  const [loading, setLoading] = useState(true);
  const [projectCount, setProjectCount] = useState(0);
  // null until the real span is computed, so the hero never flashes a wrong, lower number.
  const [experienceYears, setExperienceYears] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch Projects Count
        const { count: pCount } = await supabase
          .from('projects')
          .select('*', { count: 'exact', head: true });

        if (pCount !== null) setProjectCount(pCount);

        // Fetch Experience to calculate years
        const { data: expData } = await supabase
          .from('experience')
          .select('duration, is_development')
          .order('id', { ascending: false });

        if (expData && expData.length > 0) {
          const intervals = []
          const now = new Date()

          expData.forEach(exp => {
            // Skip non-development roles (default to dev if column missing)
            if (exp.is_development === false) return
            const parts = exp.duration.split(/[–—-]/).map(p => p.trim())
            if (parts.length >= 2) {
              const start = parseHeroDate(parts[0])
              const end = parts[1].toLowerCase().includes("present") ? now : parseHeroDate(parts[1])
              if (start && end) intervals.push({ start, end })
            }
          })

          if (intervals.length > 0) {
            const merged = mergeHeroIntervals(intervals)
            let totalMonths = 0
            merged.forEach(interval => {
              const diff = (interval.end.getFullYear() - interval.start.getFullYear()) * 12 +
                (interval.end.getMonth() - interval.start.getMonth()) + 1
              totalMonths += Math.max(0, diff)
            })
            const yearsExp = Math.floor(totalMonths / 12)
            setExperienceYears(yearsExp > 0 ? yearsExp : 1)
          }
        }
      } catch (err) {
        console.error("Error loading data:", err);
      } finally {
        setLoading(false);
      }
    }

    function parseHeroDate(dateStr) {
      if (!dateStr) return null
      const monthsMap = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"]
      const parts = dateStr.toLowerCase().replace(/,/g, "").trim().split(/\s+/)
      let month = 0
      let year = 0
      if (parts.length >= 2) {
        const mIdx = monthsMap.findIndex(m => parts[0].startsWith(m))
        month = mIdx !== -1 ? mIdx : 0
        year = parseInt(parts[parts.length - 1])
      } else if (parts.length === 1) {
        year = parseInt(parts[0])
      }
      if (isNaN(year) || year < 1900) return null
      return new Date(year, month, 1)
    }

    function mergeHeroIntervals(intervals) {
      if (intervals.length <= 1) return intervals
      const sorted = [...intervals].sort((a, b) => a.start - b.start)
      const result = [sorted[0]]
      for (let i = 1; i < sorted.length; i++) {
        const last = result[result.length - 1]
        const current = sorted[i]
        if (current.start <= last.end) {
          last.end = new Date(Math.max(last.end, current.end))
        } else {
          result.push(current)
        }
      }
      return result
    }

    fetchData();
  }, []);

  if (loading && !profile.Name) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  }

  return (
    <section id="home" className="relative min-h-[calc(100vh-4rem)] w-full py-12 md:py-24 lg:py-32 flex items-center justify-center">
      {/* Interactive WebGL ether — the hero's one authored moment. */}
      <LiquidEther className="absolute inset-0 z-0 h-full w-full" />

      {/* Scrim: keeps the text column readable over the fluid, and blends the
          canvas into the section below instead of ending on a hard edge. */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-r from-background from-20% via-background/80 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-40 bg-gradient-to-b from-transparent to-background" />

      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
          backgroundSize: "40px 40px"
        }}
      />

      <div className="container relative z-10 px-4 md:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">

          {/* Left Column: Text Content */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="flex flex-col gap-6"
          >


            <motion.h1 variants={item} className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
              Hi, I&apos;m <span className="text-primary">{profile.Name}</span>
            </motion.h1>

            <motion.div variants={item} className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-medium text-muted-foreground">
                <span className="text-primary">&lt;Dev&gt;</span> {profile.Role} <span className="text-primary">/&gt;</span>
              </h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                {experienceYears
                  ? profile.Summary?.replace(/over \d+ year(s?)/, `over ${experienceYears} year${experienceYears > 1 ? 's' : ''}`)
                  : profile.Summary}
              </p>
            </motion.div>

            <motion.div variants={item} className="flex flex-col gap-3 min-[400px]:flex-row">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold" asChild>
                <a href="/projects">{content.viewProjects} <ArrowRight className="ml-2 h-4 w-4" /></a>
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground dark:border-primary dark:text-primary dark:hover:bg-primary dark:hover:text-primary-foreground bg-transparent" asChild>
                <a href={profile.ResumeUrl || content.resumeFallback} download>{content.downloadCv} <Download className="ml-2 h-4 w-4" /></a>
              </Button>
            </motion.div>

            <motion.div variants={item} className="flex gap-4 text-muted-foreground">
              <a href={profile.Socials?.GitHub || "#"} target="_blank" rel="noreferrer" aria-label="GitHub" className="hover:text-primary transition-colors">
                <Github className="h-6 w-6" />
              </a>
              <a href={profile.Socials?.LinkedIn || "#"} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="hover:text-primary transition-colors">
                <Linkedin className="h-6 w-6" />
              </a>
              {(profile.Socials?.Medium || content.mediumUrl) ? (
                <a href={profile.Socials?.Medium || content.mediumUrl} target="_blank" rel="noreferrer" aria-label="Medium blog" className="hover:text-primary transition-colors">
                  <SiMedium className="h-6 w-6" />
                </a>
              ) : null}
              <a href={`mailto:${profile.Email}`} aria-label="Email" className="hover:text-primary transition-colors">
                <Mail className="h-6 w-6" />
              </a>
            </motion.div>
          </motion.div>

          {/* Right Column: Visual/Profile */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center justify-center lg:justify-end"
          >
            <div className="relative group">
              {/* Red glow behind the card */}
              <div className="absolute -inset-4 rounded-xl bg-primary/10 blur-2xl group-hover:bg-primary/20 transition-all duration-500" />

              <Card className="relative p-0 overflow-hidden border border-border bg-card/80 backdrop-blur-xl w-full max-w-md rotate-3 hover:rotate-0 transition-transform duration-300 shadow-2xl">
                <CardContent className="p-0">
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    {/* Image with Grayscale Filter */}
                    <div className="absolute inset-0 flex h-full w-full items-center justify-center bg-muted text-muted-foreground transition-transform duration-500 hover:scale-[1.03]">
                      {profile.ImageUrl ? (
                        <img
                          src={profile.ImageUrl}
                          alt="Profile"
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <span className="text-4xl font-display opacity-20">&lt; /&gt;</span>
                      )}
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span className="whitespace-nowrap">{content.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                        </span>
                        <span className="text-xs font-medium text-primary ml-1 whitespace-nowrap">{content.availability}</span>
                      </div>
                    </div>

                    <div className="space-y-2 font-mono text-sm border-t border-border pt-4">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{content.experienceStat}</span>
                        <span className="text-foreground">{experienceYears ? `${experienceYears}+ Years` : "—"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{content.projectsStat}</span>
                        <span className="text-foreground">{projectCount}+</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-foreground">{content.stackStat}</span>
                        <span className="text-foreground">{content.stackValue}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
