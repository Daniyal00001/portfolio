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
          .order("featured", { ascending: false })
          .order("year", { ascending: false })
          .order("id", { ascending: false })
        
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

  if (loading && projects.length === 0) {
    return (
      <div className="flex justify-center p-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

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

      <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 z-10">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <Card className="h-full pt-0 flex flex-col overflow-hidden border border-border hover:border-primary/50 hover:shadow-[0_4px_20px_-4px_color-mix(in_oklch,var(--primary)_15%,transparent)] transition-all duration-300 group bg-card/80 backdrop-blur-xl">
              <div className="relative aspect-[2/1] w-full overflow-hidden bg-black/50 flex items-center justify-center group-hover:bg-primary/5 transition-colors">
                {project.images && project.images.length > 0 ? (
                  <ProjectCarousel
                    images={project.images}
                    name={project.name}
                  />
                ) : project.image_url ? (
                  <ProjectCarousel
                    images={[project.image_url]}
                    name={project.name}
                  />
                ) : (
                  <Code2 className="h-16 w-16 text-muted-foreground/30 group-hover:text-primary/50 transition-colors" />
                )}
                <div className="absolute top-4 right-4 flex gap-2">
                  {project.featured && (
                    <Badge variant="secondary" className="bg-primary text-primary-foreground font-bold">Featured</Badge>
                  )}
                </div>
              </div>

              <CardHeader>
                <CardTitle className="flex justify-between items-start font-bold text-xl font-display">
                  {project.name}
                  <span className="text-sm font-mono font-normal text-muted-foreground mt-1">{project.year}</span>
                </CardTitle>
                <div className="flex flex-wrap gap-2 mt-2">
                  {project.tech && project.tech.map((t, i) => (
                    <Badge key={i} variant="outline" className="text-xs bg-background/50">{t}</Badge>
                  ))}
                </div>
              </CardHeader>

              <CardContent className="flex-grow">
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {project.description}
                </p>
              </CardContent>

              <CardFooter className="gap-0 pt-0 overflow-hidden">
                <div className="flex w-full gap-0 relative">
                  <div className={`transition-all duration-300 ease-out ${project.github_url ? 'w-full group-hover:w-1/2' : 'w-full'}`}>
                    {project.live_url && (
                      <Button size="sm" className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                        <a href={project.live_url} target="_blank" rel="noreferrer">
                          <ExternalLink className="h-4 w-4" /> Live Demo
                        </a>
                      </Button>
                    )}
                  </div>
                  {project.github_url && (
                    <div className="w-0 group-hover:w-1/2 opacity-0 group-hover:opacity-100 overflow-hidden transition-all duration-300 ease-out group-hover:ml-2">
                      <Button variant="outline" size="sm" className="w-full gap-2 border-border hover:bg-white/5 whitespace-nowrap" asChild>
                        <a href={project.github_url} target="_blank" rel="noreferrer">
                          <Github className="h-4 w-4" /> Code
                        </a>
                      </Button>
                    </div>
                  )}
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        ))}

        {projects.length === 0 && (
          <div className="col-span-full text-center text-muted-foreground py-12">
            Stay tuned for updates...
          </div>
        )}
      </div>
    </section>
  )
}
