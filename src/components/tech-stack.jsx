"use client"

import { motion } from "framer-motion"
import { parseTechs } from "@/lib/site-defaults"
import { useSiteContent } from "@/components/site-content"

function TechLogo({ tech }) {
  return (
    <div className="group flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-6 transition-all duration-200 hover:-translate-y-1 hover:border-primary/30 depth-rest hover:depth-lift">
      {tech.iconUrl ? (
        <img src={tech.iconUrl} alt="" className="h-9 w-9 shrink-0 object-contain" />
      ) : tech.icon ? (
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="h-9 w-9 shrink-0 fill-[color:var(--logo)] dark:fill-[color:var(--logo-dark)]"
          style={{
            "--logo": `#${tech.icon.hex}`,
            "--logo-dark": `#${tech.darkHex || tech.icon.hex}`,
          }}
        >
          <path d={tech.icon.path} />
        </svg>
      ) : (
        <span className="flex h-9 w-9 items-center justify-center text-lg font-semibold text-primary">
          {tech.name.slice(0, 1)}
        </span>
      )}
      <span className="text-sm font-medium text-muted-foreground transition-colors group-hover:text-foreground">
        {tech.name}
      </span>
    </div>
  )
}

export function TechStack() {
  const { content } = useSiteContent()
  const techs = parseTechs(content.techs)

  return (
    <section className="container py-20 md:py-28">
      <div className="mb-12 max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">{content.techEyebrow}</p>
        <h2 className="sign mt-3 text-3xl md:text-4xl">{content.techTitle}</h2>
        <p className="mt-4 text-lg text-muted-foreground">
          {content.techBody}
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        viewport={{ once: true, margin: "-80px" }}
        className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6"
      >
        {techs.map((tech) => (
          <TechLogo key={tech.name} tech={tech} />
        ))}
      </motion.div>
    </section>
  )
}

export default TechStack
