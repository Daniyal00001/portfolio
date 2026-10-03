"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Briefcase, Loader2 } from "lucide-react"
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
    is_development: e.Company !== "BestMobile.pk", // Fallback logic
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

      {/* Development Experience */}
      <div className="relative max-w-3xl mx-auto pl-8 sm:pl-0 mb-20">
        <h3 className="text-xl font-bold mb-10 text-primary uppercase tracking-widest text-center sm:text-left">{content.experienceDevHeading}</h3>

        {/* Vertical Line */}
        <div className="absolute left-8 sm:left-1/2 top-16 bottom-0 w-0.5 bg-border -translate-x-1/2 hidden sm:block"></div>
        <div className="absolute left-0 top-16 bottom-0 w-0.5 bg-border sm:hidden"></div>

        {devRoles.map((job, index) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className={`relative mb-12 flex flex-col sm:flex-row ${index % 2 === 0 ? "sm:items-end sm:text-right" : "sm:items-start sm:text-left"
              } gap-8 group`}
          >
            {/* Timeline Dot */}
            <div className="absolute left-0 sm:left-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background -translate-x-[calc(50%-1px)] mt-1.5 z-10 group-hover:scale-125 transition-transform duration-300 shadow-[0_2px_10px_-2px_color-mix(in_oklch,var(--primary)_50%,transparent)]"></div>

            {/* Content Wrapper to push to correct side */}
            <div className={`w-full sm:w-1/2 ${index % 2 === 0 ? "sm:pr-12" : "sm:pl-12 sm:ml-auto"}`}>
              <Card className="retro-card border border-border hover:shadow-lg hover:border-primary/50 transition-all duration-300 bg-card/80 backdrop-blur-xl">
                <CardHeader className="pb-2">
                  <div className={`flex flex-col ${index % 2 === 0 ? "sm:items-end" : "sm:items-start"}`}>
                    <span className="text-sm font-mono text-primary mb-1">{job.duration}</span>
                    <CardTitle className="text-xl font-bold text-foreground">{job.position}</CardTitle>
                    <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                      <Briefcase className="w-3 h-3" />
                      {job.company}
                    </h4>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground/80 leading-relaxed mb-4">
                    {job.description}
                  </p>
                  {job.skills && job.skills.length > 0 && (
                    <div className={`flex flex-wrap gap-2 ${index % 2 === 0 ? "sm:justify-end" : "sm:justify-start"}`}>
                      {job.skills.map((skill, i) => (
                        <span key={i} className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded border border-primary/20 bg-primary/10 text-primary">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
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
                      {job.company}
                    </div>
                  </div>
                  <span className="text-xs font-mono font-medium text-primary/80 bg-primary/10 px-2 py-0.5 rounded border border-primary/20 w-fit">
                    {job.duration}
                  </span>
                </div>

                <p className="text-sm text-muted-foreground/80 leading-relaxed max-w-2xl">
                  {job.description}
                </p>
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
