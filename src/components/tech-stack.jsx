"use client"

import { useEffect, useState } from "react"
import {
  siReact,
  siNextdotjs,
  siAngular,
  siTypescript,
  siJavascript,
  siPython,
  siCplusplus,
  siHtml5,
  siCss,
  siRedux,
  siVite,
  siTailwindcss,
  siNodedotjs,
  siExpress,
  siDjango,
  siFastapi,
  siMysql,
  siMongodb,
  siRedis,
  siPrisma,
  siMongoose,
  siJsonwebtokens,
  siSocketdotio,
  siDocker,
  siGithubactions,
  siGit,
  siGithub,
  siPostman,
  siShadcnui,
  siRadixui,
} from "simple-icons"
import { supabase } from "@/lib/supabase"
import { Mydata } from "@/lib/data"
import { useSiteContent } from "@/components/site-content"

const ICONS = {
  "javascript (es6+)": siJavascript,
  typescript: siTypescript,
  python: siPython,
  "c++": siCplusplus,
  html5: siHtml5,
  css3: siCss,
  "react.js": siReact,
  "next.js": siNextdotjs,
  angular: siAngular,
  redux: siRedux,
  vite: siVite,
  "tailwind css": siTailwindcss,
  "shadcn ui": siShadcnui,
  "radix ui": siRadixui,
  "node.js": siNodedotjs,
  "express.js": siExpress,
  django: siDjango,
  "django rest framework": siDjango,
  fastapi: siFastapi,
  mysql: siMysql,
  mongodb: siMongodb,
  redis: siRedis,
  "prisma orm": siPrisma,
  mongoose: siMongoose,
  "jwt authentication": siJsonwebtokens,
  "socket.io": siSocketdotio,
  docker: siDocker,
  "github actions": siGithubactions,
  git: siGit,
  github: siGithub,
  postman: siPostman,
}

function isDarkMark(hex) {
  const value = parseInt(hex, 16)
  const red = (value >> 16) & 255
  const green = (value >> 8) & 255
  const blue = value & 255
  return (red * 299 + green * 587 + blue * 114) / 1000 < 90
}

function fallbackSkills() {
  return Object.values(Mydata.Skills).flat()
}

function SkillCard({ name }) {
  const icon = ICONS[name.toLowerCase()]
  const dark = icon && isDarkMark(icon.hex)

  return (
    <div className="group/card flex h-36 w-44 shrink-0 flex-col items-center justify-center gap-3 rounded-md border border-primary/35 bg-card px-4 py-4 text-center shadow-[0_0_16px_color-mix(in_oklch,var(--primary)_22%,transparent)] transition-transform duration-300 hover:scale-[1.04] hover:border-primary/70 hover:shadow-[0_0_24px_color-mix(in_oklch,var(--primary)_48%,transparent)]">
      {icon ? (
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="h-9 w-9 shrink-0 fill-[color:var(--logo)] dark:fill-[color:var(--logo-dark)]"
          style={{
            "--logo": `#${icon.hex}`,
            "--logo-dark": dark ? "#FFFFFF" : `#${icon.hex}`,
          }}
        >
          <path d={icon.path} />
        </svg>
      ) : (
        <span className="flex h-9 w-9 shrink-0 items-center justify-center text-base font-semibold text-primary">
          {name.slice(0, 1)}
        </span>
      )}
      <span className="text-sm font-medium leading-snug text-foreground">{name}</span>
    </div>
  )
}

function SkillRow({ skills, copy }) {
  return (
    <ul className="flex shrink-0 items-center gap-4 pr-4" aria-hidden={copy === 1 ? true : undefined}>
      {skills.map((name) => (
        <li key={`${copy}-${name}`}>
          <SkillCard name={name} />
        </li>
      ))}
    </ul>
  )
}

export function TechStack() {
  const { content } = useSiteContent()
  const [skills, setSkills] = useState(fallbackSkills)

  useEffect(() => {
    let cancelled = false
    supabase
      .from("skills")
      .select("category, items")
      .order("id", { ascending: true })
      .then(({ data }) => {
        if (cancelled || !data?.length) return
        const names = data.flatMap((row) => row.items || []).filter(Boolean)
        if (names.length) setSkills(names)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section className="py-20 md:py-28">
      <div className="container mb-12 max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">{content.techEyebrow}</p>
        <h2 className="sign mt-3 text-3xl sm:text-4xl md:text-5xl">{content.techTitle}</h2>
        <p className="mt-4 text-lg text-muted-foreground">{content.techBody}</p>
      </div>

      <div className="skill-marquee overflow-hidden py-4 [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
        <div className="skill-marquee-track flex w-max">
          <SkillRow skills={skills} copy={0} />
          <SkillRow skills={skills} copy={1} />
        </div>
      </div>
    </section>
  )
}

export default TechStack
