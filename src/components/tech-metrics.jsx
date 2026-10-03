"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { supabase } from "@/lib/supabase"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Code2, Zap } from "lucide-react"

export function TechMetrics() {
  const [metrics, setMetrics] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAndCalculate() {
      try {
        const { data, error } = await supabase
          .from("experience")
          .select("*")
        
        if (data && data.length > 0) {
          const techIntervals = {}
          const now = new Date()

          data.forEach((exp) => {
            if (exp.is_development === false) return
            if (!exp.duration || !exp.skills) return

            const parts = exp.duration.split(/[–—-]/).map(p => p.trim())
            if (parts.length < 2) return

            const start = parseDate(parts[0])
            const end = parts[1].toLowerCase().includes("present") ? now : parseDate(parts[1])

            if (!start || !end) return

            exp.skills.forEach((skill) => {
              const name = skill.trim()
              if (!techIntervals[name]) techIntervals[name] = []
              techIntervals[name].push({ start, end })
            })
          })

          const calculatedMetrics = Object.entries(techIntervals)
            .map(([name, intervals]) => {
              const merged = mergeIntervals(intervals)
              let totalMonths = 0
              merged.forEach(interval => {
                const diff = (interval.end.getFullYear() - interval.start.getFullYear()) * 12 + 
                             (interval.end.getMonth() - interval.start.getMonth()) + 1
                totalMonths += Math.max(0, diff)
              })

              return {
                name,
                years: (totalMonths / 12).toFixed(1),
                months: totalMonths
              }
            })
            .sort((a, b) => b.months - a.months)
            .filter(m => m.months > 0)
            .slice(0, 12)

          setMetrics(calculatedMetrics)
        } else {
           // Fallback to Mydata structure if DB is empty
           setMetrics(getFallbackMetrics())
        }
      } catch (err) {
        console.error("Error calculating tech metrics:", err)
        setMetrics(getFallbackMetrics())
      } finally {
        setLoading(false)
      }
    }

    fetchAndCalculate()
  }, [])

  function mergeIntervals(intervals) {
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

  function parseDate(dateStr) {
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

  function getFallbackMetrics() {
     return [
        { name: "React.js", years: "1.5", months: 18 },
        { name: "JavaScript", years: "2.0", months: 24 },
        { name: "Next.js", years: "1.0", months: 12 },
        { name: "Tailwind CSS", years: "1.2", months: 14 },
        { name: "TypeScript", years: "1.0", months: 12 },
        { name: "Frappe", years: "0.8", months: 10 },
        { name: "PHP", years: "0.4", months: 5 },
        { name: "WordPress", years: "1.0", months: 12 }
     ].sort((a, b) => b.months - a.months)
  }

  if (loading) return (
     <div className="flex justify-center p-12">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
     </div>
  )

  if (metrics.length === 0) return null

  return (
    <section className="relative container py-12 md:py-20">
      {/* Spotlight Background */}
      <div className="absolute inset-0 z-0 flex items-center justify-end pointer-events-none mix-blend-screen">
        <div className="w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full translate-x-1/4 text-transparent" />
      </div>

      <div className="relative flex flex-col items-center gap-3 text-center mb-10 z-10">
         <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 overflow-hidden"
         >
            <Zap className="h-4 w-4 fill-current" />
            <span className="text-xs font-bold uppercase tracking-widest">Smart Analytics</span>
         </motion.div>
         <h2 className="font-display text-3xl font-bold tracking-tighter sm:text-4xl text-foreground">
            Technical Expertise
         </h2>
         <p className="text-muted-foreground text-sm max-w-[600px]">
            Data-driven calculation of my working experience based on unique calendar months.
         </p>
      </div>

      <div className="relative grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4 max-w-6xl mx-auto z-10">
        {metrics.map((tech, index) => (
          <motion.div
            key={tech.name}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            viewport={{ once: true }}
            className="group"
          >
            <Card className="h-full border border-border bg-card/80 backdrop-blur-xl hover:bg-card hover:border-primary/50 hover:-translate-y-1 transition-all duration-300">
              <CardContent className="p-4 flex flex-col items-center justify-center text-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:shadow-[0_4px_16px_-4px_color-mix(in_oklch,var(--primary)_30%,transparent)] transition-all">
                   <Code2 className="h-5 w-5" />
                </div>
                <div className="space-y-0.5">
                   <div className="font-bold text-sm tracking-tight">{tech.name}</div>
                   <div className="text-[10px] font-mono font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                      {tech.years} YEARS
                   </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
