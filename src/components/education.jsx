"use client"

import { motion } from "framer-motion"
import { Award, Calendar, GraduationCap, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

import { Card, CardContent } from "@/components/ui/card"
import { useSiteContent } from "@/components/site-content"

const FALLBACK = [
  {
    id: "bs",
    degree: "BS (Hons) in Computer Science",
    university: "Government College University, Lahore",
    period: "2022 – 2026 · CGPA 3.14",
  },
  {
    id: "fsc",
    degree: "FSc Pre-Engineering",
    university: "Punjab College of Science, Lahore",
    period: "2020 – 2022 · 961/1100",
  },
]

function present(row) {
  const parts = String(row.period || "")
    .split("·")
    .map((part) => part.trim())
    .filter(Boolean)
  const duration = parts[0] || ""
  const result = parts.slice(1).join(" · ")
  let resultLabel = "Result"
  if (/cgpa/i.test(result)) resultLabel = "CGPA"
  else if (/marks/i.test(result) || /\d+\s*\/\s*\d+/.test(result)) resultLabel = "Marks"
  const resultValue = result.replace(/^(CGPA|Marks)\s*:?\s*/i, "")
  return { ...row, duration, resultLabel, resultValue }
}

export function Education({ isPage = false }) {
  const { content } = useSiteContent()
  const [entries, setEntries] = useState(FALLBACK.map(present))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    supabase
      .from("education")
      .select("*")
      .order("id", { ascending: true })
      .then(({ data }) => {
        if (cancelled) return
        if (data && data.length > 0) setEntries(data.map(present))
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  if (loading && entries.length === 0) {
    return (
      <div className="flex justify-center p-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <section id="education" className={isPage ? "relative w-full" : "relative container py-12 md:py-24 lg:py-32"}>
      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-end mix-blend-screen">
        <div className="h-[800px] w-[800px] translate-x-1/3 rounded-full bg-primary/10 blur-[140px]" />
      </div>

      {!isPage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="relative z-10 mb-16 flex flex-col items-center gap-4 text-center"
        >
          <h2 className="sign relative z-10 mx-auto w-fit border-b-4 border-primary pb-2 text-3xl sm:text-4xl md:text-5xl">
            {content.educationTitle}
          </h2>
          <p className="max-w-[60ch] text-lg text-muted-foreground">
            {content.educationBody}
          </p>
        </motion.div>
      )}

      <div className="relative z-10 mx-auto max-w-3xl">
        <div className="absolute bottom-0 left-0 top-2 w-0.5 bg-border sm:left-6" />
        <div className="space-y-6">
          {entries.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              viewport={{ once: true }}
              className="relative pl-8 sm:pl-16"
            >
              <span className="absolute left-0 top-7 h-3 w-3 -translate-x-[5px] rounded-full border-2 border-background bg-primary shadow-[0_0_0_4px_color-mix(in_oklch,var(--primary)_18%,transparent)] sm:left-6" />
              <Card className="border border-border bg-card/80 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_8px_24px_-12px_color-mix(in_oklch,var(--primary)_45%,transparent)]">
                <CardContent className="space-y-4 p-5 sm:p-6">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-1">
                      <h3 className="font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                        {item.degree}
                      </h3>
                      <p className="flex items-start gap-2 text-sm font-medium text-muted-foreground">
                        <GraduationCap className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        {item.university}
                      </p>
                    </div>
                    {item.duration ? (
                      <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 font-mono text-xs font-medium text-primary">
                        <Calendar className="h-3.5 w-3.5" />
                        {item.duration}
                      </span>
                    ) : null}
                  </div>
                  {item.resultValue ? (
                    <div className="flex items-center gap-2 border-t border-border pt-4 text-sm">
                      <Award className="h-4 w-4 text-primary" />
                      <span className="text-muted-foreground">{item.resultLabel}</span>
                      <span className="font-semibold text-foreground">{item.resultValue}</span>
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
