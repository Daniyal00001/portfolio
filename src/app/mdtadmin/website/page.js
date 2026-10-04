"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Save } from "lucide-react"
import { AssetField } from "@/components/admin/asset-field"
import { DEFAULT_CONTENT, mergeContent } from "@/lib/site-defaults"
import { ContactInbox } from "@/components/admin/contact-inbox"

const ABOUT_FIELDS = [
  ["location", "Location"],
  ["availability", "Availability"],
  ["viewProjects", "Projects button"],
  ["downloadCv", "CV button"],
  ["experienceStat", "Experience label"],
  ["experienceValue", "Experience value"],
  ["stackStat", "Stack label"],
  ["stackValue", "Stack value"],
  ["mediumUrl", "Medium link, used when the profile Medium field is empty"],
]

const CONTACT_FIELDS = [
  ["phone", "Phone fallback"],
  ["whatsappUrl", "WhatsApp link"],
  ["whatsappLabel", "WhatsApp label"],
  ["responseTime", "Response time"],
  ["contactTitle", "Contact heading"],
  ["contactInfoTitle", "Contact info heading"],
  ["contactPageTitle", "Contact page title"],
]

const CONTACT_LONG = [
  ["contactBody", "Contact intro"],
  ["contactInfoBody", "Contact details text"],
  ["contactPageBody", "Contact page intro"],
]

function WebsiteEditor() {
  const searchParams = useSearchParams()
  const section = searchParams.get("section") === "contact" ? "contact" : "about"
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [userId, setUserId] = useState(null)
  const [profile, setProfile] = useState({
    name: "",
    role: "",
    summary: "",
    email: "",
    phone: "",
    address: "",
    image_url: "",
    resume_url: "",
    social_linkedin: "",
    social_github: "",
    social_medium: "",
    social_portfolio: "",
  })
  const [content, setContent] = useState(DEFAULT_CONTENT)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setLoading(false)
        return
      }
      setUserId(user.id)
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single()
      if (data) {
        setProfile({
          name: data.name || "",
          role: data.role || "",
          summary: data.summary || "",
          email: data.email || "",
          phone: data.phone || "",
          address: data.address || "",
          image_url: data.image_url || "",
          resume_url: data.resume_url || "",
          social_linkedin: data.social_linkedin || "",
          social_github: data.social_github || "",
          social_medium: data.social_medium || "",
          social_portfolio: data.social_portfolio || "",
        })
        setContent(mergeContent(data.content))
      }
      setLoading(false)
    }
    load()
  }, [])

  const setField = (key, value) => setContent((current) => ({ ...current, [key]: value }))

  const save = async (event) => {
    event.preventDefault()
    if (!userId) return
    setSaving(true)
    const { error } = await supabase
      .from("profiles")
      .update({ ...profile, content })
      .eq("id", userId)
    setSaving(false)
    if (error) alert(error.message)
    else alert("Website content saved. Refresh the public site to see it.")
  }

  if (loading) {
    return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>
  }

  return (
    <form onSubmit={save} className="mx-auto max-w-4xl space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-charcoal-blue dark:text-verdigris">
            {section === "contact" ? "Contact" : "About"}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            {section === "contact"
              ? "The phone, email, and text shown on the Contact tab."
              : "The name, photo, summary, and stats shown on the About tab."}
          </p>
        </div>
        <Button type="submit" disabled={saving}>
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Save {section === "contact" ? "contact" : "about"}
        </Button>
      </div>

      {section === "about" && <>
      <Card>
        <CardHeader>
          <CardTitle>Identity</CardTitle>
          <CardDescription>Name, bio, and links shown on the About tab.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <Field label="Full name" value={profile.name} onChange={(value) => setProfile({ ...profile, name: value })} />
          <Field label="Role" value={profile.role} onChange={(value) => setProfile({ ...profile, role: value })} />
          <div className="md:col-span-2">
            <Label>Summary</Label>
            <Textarea className="mt-2 min-h-[120px]" value={profile.summary} onChange={(e) => setProfile({ ...profile, summary: e.target.value })} />
          </div>
          <Field label="Address" value={profile.address} onChange={(value) => setProfile({ ...profile, address: value })} />
          <Field label="LinkedIn" value={profile.social_linkedin} onChange={(value) => setProfile({ ...profile, social_linkedin: value })} />
          <Field label="GitHub" value={profile.social_github} onChange={(value) => setProfile({ ...profile, social_github: value })} />
          <Field label="Medium" value={profile.social_medium} onChange={(value) => setProfile({ ...profile, social_medium: value })} />
          <Field label="Portfolio URL" value={profile.social_portfolio} onChange={(value) => setProfile({ ...profile, social_portfolio: value })} />
          <div className="md:col-span-2">
            <AssetField
              label="Profile photo"
              hint="The portrait on the About card. Uploading replaces the current photo."
              value={profile.image_url}
              onChange={(value) => setProfile({ ...profile, image_url: value })}
              kind="image"
              folder="profile"
            />
          </div>
          <div className="md:col-span-2">
            <AssetField
              label="CV"
              hint="The file behind Download CV. Uploading stores the PDF and the site serves that file."
              value={profile.resume_url}
              onChange={(value) => setProfile({ ...profile, resume_url: value })}
              kind="pdf"
              folder="cv"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Logos</CardTitle>
          <CardDescription>Each logo has its own upload. Light logo shows in light mode. Dark logo shows in dark mode.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-8 md:grid-cols-2">
          <AssetField
            label="Light logo"
            hint="Dark mark, shown on a light background."
            value={content.logoLight}
            onChange={(value) => setField("logoLight", value)}
            kind="image"
            folder="logos"
          />
          <AssetField
            label="Dark logo"
            hint="Light mark, shown on a dark background."
            value={content.logoDark}
            onChange={(value) => setField("logoDark", value)}
            kind="image"
            folder="logos"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Hero</CardTitle>
          <CardDescription>The lines on the About card.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          {ABOUT_FIELDS.map(([key, label]) => (
            <Field key={key} label={label} value={content[key] || ""} onChange={(value) => setField(key, value)} />
          ))}
        </CardContent>
      </Card>
      </>}

      {section === "contact" && (
      <Card>
        <CardHeader>
          <CardTitle>Contact details</CardTitle>
          <CardDescription>Shown on the Contact tab.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <Field label="Email" value={profile.email} onChange={(value) => setProfile({ ...profile, email: value })} />
          <Field label="Phone" value={profile.phone} onChange={(value) => setProfile({ ...profile, phone: value })} />
          {CONTACT_FIELDS.map(([key, label]) => (
            <Field key={key} label={label} value={content[key] || ""} onChange={(value) => setField(key, value)} />
          ))}
          {CONTACT_LONG.map(([key, label]) => (
            <div key={key} className="md:col-span-2 space-y-2">
              <Label>{label}</Label>
              <Textarea value={content[key] || ""} onChange={(e) => setField(key, e.target.value)} />
            </div>
          ))}
        </CardContent>
      </Card>
      )}

      {section === "contact" && <ContactInbox />}
    </form>
  )
}

export default function WebsitePage() {
  return (
    <Suspense fallback={<div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>}>
      <WebsiteEditor />
    </Suspense>
  )
}

function Field({ label, value, onChange }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  )
}
