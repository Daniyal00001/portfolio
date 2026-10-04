"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Mydata } from "@/lib/data"
import { skillEntries } from "@/lib/skill-entries"
import { SkillPicture } from "@/lib/skill-icons"
import { useSiteContent } from "@/components/site-content"

function fallbackSkills() {
  return Object.values(Mydata.Skills).flat().map((name) => ({ name, image: "" }))
}

function SkillCard({ name, image }) {
  return (
    <div className="group/card flex h-36 w-44 shrink-0 flex-col items-center justify-center gap-3 rounded-md border border-primary/35 bg-card px-4 py-4 text-center shadow-[0_0_16px_color-mix(in_oklch,var(--primary)_22%,transparent)] transition-transform duration-300 hover:scale-[1.04] hover:border-primary/70 hover:shadow-[0_0_24px_color-mix(in_oklch,var(--primary)_48%,transparent)]">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center">
        <SkillPicture name={name} image={image} className="h-12 w-12" />
      </span>
      <span className="text-sm font-medium leading-snug text-foreground">{name}</span>
    </div>
  )
}

function SkillRow({ skills, copy }) {
  return (
    <ul className="flex shrink-0 items-center gap-4 pr-4" aria-hidden={copy === 1 ? true : undefined}>
      {skills.map((skill) => (
        <li key={`${copy}-${skill.name}`}>
          <SkillCard name={skill.name} image={skill.image} />
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
      .select("category, items, entries")
      .order("id", { ascending: true })
      .then(({ data }) => {
        if (cancelled || !data?.length) return
        const names = data.flatMap((row) => skillEntries(row))
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
