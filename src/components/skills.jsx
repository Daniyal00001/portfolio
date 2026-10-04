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

  return (
    <section id="skills" className={isPage ? "relative w-full" : "relative container py-12 md:py-24 lg:py-32"}>
      {/* Spotlight Background */}
      <div className="absolute inset-0 z-0 flex items-center justify-end pointer-events-none mix-blend-screen">
        <div className="w-[800px] h-[800px] bg-primary/10 blur-[140px] rounded-full translate-x-1/3 -translate-y-1/3 text-transparent" />
      </div>
      
      {/* On /skills the page wrapper already supplies the title. */}
      {!isPage && (
        <div className="relative flex flex-col items-center gap-4 text-center mb-12 z-10">
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

      <div className="relative grid gap-5 md:grid-cols-2 lg:grid-cols-3 z-10">
        {skillCategories.map((cat, index) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.06 }}
            viewport={{ once: true }}
          >
            <Card className="group h-full overflow-hidden border border-border bg-card/80 backdrop-blur-xl transition-all duration-300 hover:border-primary/40 hover:shadow-[0_8px_28px_-8px_color-mix(in_oklch,var(--primary)_35%,transparent)]">
              <CardHeader className="flex flex-row items-end justify-between gap-3 border-b border-border/70 pb-4">
                <div>
                  <p className="font-mono text-xs tracking-[0.2em] text-primary">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <CardTitle className="mt-1 text-2xl font-display text-foreground">{cat.category}</CardTitle>
                </div>
                <span className="text-xs text-muted-foreground">{skillEntries(cat).length}</span>
              </CardHeader>
              <CardContent className="pt-4">
                <ul className="grid grid-cols-1 gap-y-2 sm:grid-cols-2 sm:gap-x-4">
                  {skillEntries(cat).map((skill) => (
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
          </motion.div>
        ))}

        {skillCategories.length === 0 && (
          <div className="col-span-full text-center text-muted-foreground py-12">
            Stay tuned for updates...
          </div>
        )}
      </div>
    </section>
  )
}
