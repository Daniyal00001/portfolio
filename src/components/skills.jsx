"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mydata } from "@/lib/data"
import { skillEntries } from "@/lib/skill-entries"
import { SkillPicture } from "@/lib/skill-icons"
import { useSiteContent } from "@/components/site-content"

export function Skills({ isPage = false }) {
  const { content } = useSiteContent()
  const [skillCategories, setSkillCategories] = useState(
    Object.entries(Mydata.Skills).map(([category, items], id) => ({ id, category, items }))
  )
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSkills() {
      try {
        const { data, error } = await supabase
          .from("skills")
          .select("*")
          .order("id", { ascending: true })
        
        if (data) setSkillCategories(data)
      } catch (err) {
        console.error("Error loading skills:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchSkills()
  }, [])

  if (loading && skillCategories.length === 0) {
    return (
      <div className="flex justify-center p-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const layers = skillCategories.map((cat, index) => ({ cat, index }))
  const rows = []
  for (let i = 0; i < layers.length; i += 3) rows.push(layers.slice(i, i + 3))

  return (
    <section id="skills" className={isPage ? "relative w-full" : "relative container py-12 md:py-24 lg:py-32"}>
      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-end mix-blend-screen">
        <div className="h-[800px] w-[800px] translate-x-1/3 -translate-y-1/3 rounded-full bg-primary/10 text-transparent blur-[140px]" />
      </div>

      {!isPage && (
        <div className="relative z-10 mb-12 flex flex-col items-center gap-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="sign text-3xl sm:text-4xl md:text-5xl">
              {content.skillsTitle}
            </h2>
          </motion.div>
          <p className="max-w-[60ch] text-lg text-muted-foreground">
            {content.skillsBody}
          </p>
        </div>
      )}

      {layers.length === 0 ? (
        <div className="relative z-10 py-12 text-center text-muted-foreground">
          Stay tuned for updates...
        </div>
      ) : (
        <>
          <div className="relative z-10 lg:hidden">
            {layers.map(({ cat, index }) => (
              <React.Fragment key={cat.id}>
                <div
                  className="skill-stack-layer sticky"
                  style={{ top: `calc(4.75rem + ${index} * 12px)`, zIndex: index + 1 }}
                >
                  <CategoryCard cat={cat} index={index} />
                </div>
                {index < layers.length - 1 && <div className="skill-stack-gap h-[max(7rem,calc(100svh-32rem))]" />}
              </React.Fragment>
            ))}
            <div className="skill-stack-gap h-[22vh]" />
          </div>

          <div className="relative z-10 hidden lg:block">
            {rows.map((row, rowIndex) => (
              <React.Fragment key={row[0].cat.id}>
                <div
                  className="skill-stack-layer sticky"
                  style={{ top: `calc(5rem + ${rowIndex} * 16px)`, zIndex: rowIndex + 1 }}
                >
                  <div className="grid grid-cols-3 items-stretch gap-5">
                    {row.map(({ cat, index }) => (
                      <CategoryCard key={cat.id} cat={cat} index={index} />
                    ))}
                  </div>
                </div>
                {rowIndex < rows.length - 1 && <div className="skill-stack-gap h-[clamp(9rem,calc(100svh-30rem),24rem)]" />}
              </React.Fragment>
            ))}
            <div className="skill-stack-gap h-[18vh]" />
          </div>
        </>
      )}
    </section>
  )
}

function CategoryCard({ cat, index }) {
  const entries = skillEntries(cat)

  return (
    <Card className="h-full overflow-hidden border border-border bg-card shadow-[0_18px_40px_-24px_rgba(0,0,0,0.7)]">
      <CardHeader className="flex flex-row items-end justify-between gap-3 border-b border-border/70 pb-4">
        <div>
          <p className="font-mono text-xs tracking-[0.2em] text-primary">
            {String(index + 1).padStart(2, "0")}
          </p>
          <CardTitle className="mt-1 font-display text-2xl text-foreground">{cat.category}</CardTitle>
        </div>
        <span className="text-xs text-muted-foreground">{entries.length}</span>
      </CardHeader>
      <CardContent className="pt-4">
        <ul className="grid grid-cols-1 gap-y-2 sm:grid-cols-2 sm:gap-x-4">
          {entries.map((skill) => (
            <li key={skill.name} className="flex items-center gap-2 text-sm text-muted-foreground">
              {skill.image ? (
                <SkillPicture name={skill.name} image={skill.image} className="h-4 w-4 shrink-0" />
              ) : (
                <span className="h-1 w-1 shrink-0 rounded-full bg-primary/80" />
              )}
              <span>{skill.name}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
