"use client"

import * as React from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { ExternalLink, Github, Code2, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { ProjectCarousel } from "@/components/project-carousel"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useSiteContent } from "@/components/site-content"

export function Projects({ isPage = false }) {
  const { content } = useSiteContent()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProjects() {
      try {
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .eq("visible", true)
          .order("sort_order", { ascending: true, nullsFirst: false })
          .order("id", { ascending: true })
        
        if (error) {
           console.error("Error fetching projects:", error);
           return;
        }
        if (data) setProjects(data)
      } catch (err) {
        console.error("Error loading projects:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchProjects()
  }, [])

  const rows = []
  for (let i = 0; i < projects.length; i += 3) rows.push(projects.slice(i, i + 3))

  return (
    <section id="projects" className={isPage ? "w-full" : "relative container py-12 md:py-24 lg:py-32"}>
      {!isPage && (
        <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none mix-blend-screen">
          <div className="w-[800px] h-[800px] bg-primary/10 blur-[140px] rounded-full translate-y-1/4 text-transparent" />
        </div>
      )}
      {!isPage && (
        <div className="relative flex flex-col items-center gap-4 text-center mb-16 z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl border-b-4 border-primary pb-2 inline-block">
              {content.projectsTitle}
            </h2>
          </motion.div>
          <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            {content.projectsBody}
          </p>
        </div>
      )}

      {loading && projects.length === 0 ? (
        <div className="relative z-10 flex justify-center p-24">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : projects.length === 0 ? (
        <div className="relative z-10 py-12 text-center text-muted-foreground">
          Stay tuned for updates...
        </div>
      ) : (
        <>
          <div className="relative z-10 lg:hidden">
            {projects.slice(0, 2).length > 0 && (
              <div className="flex flex-col gap-5">
                {projects.slice(0, 2).map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            )}
            {projects.slice(2).map((project, index) => (
              <React.Fragment key={project.id}>
                {index === 0 ? <div className="h-5" /> : <div className="skill-stack-gap h-[max(18rem,42vh)]" />}
                <StackLayer index={index} peek={76 + index * 12}>
                  <ProjectCard project={project} />
                </StackLayer>
              </React.Fragment>
            ))}
            {projects.length > 2 && <div className="skill-stack-gap h-[22vh]" />}
          </div>

          <div className="relative z-10 hidden lg:block">
            {rows.slice(0, 2).length > 0 && (
              <div className="flex flex-col gap-5">
                {rows.slice(0, 2).map((row) => (
                  <div key={row[0].id} className="grid grid-cols-3 items-stretch gap-5">
                    {row.map((project) => (
                      <ProjectCard key={project.id} project={project} />
                    ))}
                  </div>
                ))}
              </div>
            )}
            {rows.slice(2).map((row, rowIndex) => (
              <React.Fragment key={row[0].id}>
                {rowIndex === 0 ? <div className="h-5" /> : <div className="skill-stack-gap h-[max(18rem,42vh)]" />}
                <StackLayer index={rowIndex} peek={80 + rowIndex * 16}>
                  <div className="grid grid-cols-3 items-stretch gap-5">
                    {row.map((project) => (
                      <ProjectCard key={project.id} project={project} />
                    ))}
                  </div>
                </StackLayer>
              </React.Fragment>
            ))}
            {rows.length > 2 && <div className="skill-stack-gap h-[18vh]" />}
          </div>
        </>
      )}
    </section>
  )
}

function StackLayer({ index, peek, className, children }) {
  const ref = React.useRef(null)
  const [top, setTop] = React.useState(peek)

  React.useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const measure = () => {
      const height = el.offsetHeight
      const room = window.innerHeight - 32
      setTop(height + peek <= room ? peek : room - height)
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    window.addEventListener("resize", measure)
    return () => {
      observer.disconnect()
      window.removeEventListener("resize", measure)
    }
  }, [peek])

  return (
    <div ref={ref} className={`skill-stack-layer sticky${className ? ` ${className}` : ""}`} style={{ top, zIndex: index + 1 }}>
      {children}
    </div>
  )
}

function ProjectDescription({ text }) {
  const paragraphs = String(text || "")
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .filter(Boolean)

  if (paragraphs.length === 0) return null

  return (
    <div className="space-y-3">
      {paragraphs.map((paragraph, index) => (
        <p key={index} className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
          {paragraph}
        </p>
      ))}
    </div>
  )
}

function ProjectCard({ project }) {
  return (
    <Card className="group relative flex h-full flex-col overflow-hidden border border-border bg-card pt-0 shadow-[0_18px_40px_-24px_rgba(0,0,0,0.7)] transition-all duration-300 hover:z-10 hover:-translate-y-1.5 hover:scale-[1.02] hover:border-primary hover:shadow-[0_18px_36px_-16px_color-mix(in_oklch,var(--primary)_60%,transparent)]">
      <div className="relative flex aspect-[21/9] w-full items-center justify-center overflow-hidden bg-black transition-colors group-hover:bg-primary/5">
        {project.images && project.images.length > 0 ? (
          <ProjectCarousel images={project.images} name={project.name} />
        ) : project.image_url ? (
          <ProjectCarousel images={[project.image_url]} name={project.name} />
        ) : (
          <Code2 className="h-16 w-16 text-muted-foreground/30 transition-colors group-hover:text-primary/50" />
        )}
        <div className="absolute top-4 right-4 flex gap-2">
          {project.featured && (
            <Badge variant="secondary" className="bg-primary font-bold text-primary-foreground">Featured</Badge>
          )}
        </div>
      </div>

      <CardHeader>
        <CardTitle className="flex items-start justify-between font-display text-xl font-bold">
          <span>
            {project.name}
            {project.associated_with ? (
              <span className="mt-1 block font-sans text-xs font-normal text-muted-foreground">
                Associated with {project.associated_with}
              </span>
            ) : null}
          </span>
          <span className="mt-1 font-mono text-sm font-normal text-muted-foreground">{project.year}</span>
        </CardTitle>
        <div className="mt-2 flex flex-wrap gap-2">
          {project.tech && project.tech.map((t, i) => (
            <Badge key={i} variant="outline" className="bg-background/50 text-xs">{t}</Badge>
          ))}
        </div>
      </CardHeader>

      <CardContent className="flex-grow">
        <ProjectDescription text={project.description} />
      </CardContent>

      <CardFooter className="pt-0">
        <div className="flex w-full gap-2">
          {project.live_url && (
            <Button size="sm" className="flex-1 gap-2 bg-primary text-primary-foreground hover:bg-primary/90" asChild>
              <a href={project.live_url} target="_blank" rel="noreferrer">
                <ExternalLink className="h-4 w-4" /> Live Demo
              </a>
            </Button>
          )}
          {project.github_url && (
            <Button variant="outline" size="sm" className="flex-1 gap-2 border-border hover:bg-white/5" asChild>
              <a href={project.github_url} target="_blank" rel="noreferrer">
                <Github className="h-4 w-4" /> Code
              </a>
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
