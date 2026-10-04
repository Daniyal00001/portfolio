"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { DEFAULT_CONTENT, mergeContent } from "@/lib/site-defaults"

const SiteContentContext = createContext({
  profile: null,
  content: DEFAULT_CONTENT,
})

export function SiteContentProvider({ children, initialProfile = null }) {
  const [profile, setProfile] = useState(initialProfile)
  const [content, setContent] = useState(
    initialProfile ? mergeContent(initialProfile.content) : DEFAULT_CONTENT
  )

  useEffect(() => {
    let cancelled = false
    supabase
      .from("profiles")
      .select("*")
      .limit(1)
      .single()
      .then(({ data }) => {
        if (cancelled || !data) return
        setProfile(data)
        setContent(mergeContent(data.content))
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <SiteContentContext.Provider value={{ profile, content }}>
      {children}
    </SiteContentContext.Provider>
  )
}

export function useSiteContent() {
  return useContext(SiteContentContext)
}

export function SiteText({ k, className, as: Tag = "p" }) {
  const { content } = useSiteContent()
  return <Tag className={className}>{content[k]}</Tag>
}
