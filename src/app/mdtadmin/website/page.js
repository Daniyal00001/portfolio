"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Save } from "lucide-react"
import { MediaUploader } from "@/components/admin/media-uploader"
import { DEFAULT_CONTENT, mergeContent } from "@/lib/site-defaults"

const COPY_FIELDS = [
  ["location", "Hero location"],
  ["availability", "Availability label"],
  ["viewProjects", "Projects button"],
  ["downloadCv", "CV button"],
  ["stackStat", "Stack label"],
  ["stackValue", "Stack value"],
  ["experienceStat", "Experience label"],
  ["projectsStat", "Projects label"],
  ["techEyebrow", "Tech eyebrow"],
  ["techTitle", "Tech heading"],
  ["skillsTitle", "Skills heading"],
  ["skillsPageTitle", "Skills page title"],
  ["experienceTitle", "Experience heading"],
  ["experienceDevHeading", "Experience group heading"],
  ["experienceOtherHeading", "Other experience heading"],
  ["experiencePageTitle", "Experience page title"],
  ["projectsTitle", "Projects heading"],
  ["projectsPageTitle", "Projects page title"],
  ["achievementsTitle", "Achievements heading"],
  ["achievementsPageTitle", "Achievements page title"],
  ["contactTitle", "Contact heading"],
  ["contactInfoTitle", "Contact info heading"],
  ["contactPageTitle", "Contact page title"],
  ["whatsappLabel", "WhatsApp label"],
  ["responseTime", "Response time"],
  ["phone", "Phone shown on the site"],
  ["whatsappUrl", "WhatsApp link"],
  ["mediumUrl", "Medium link, used when the profile Medium field is empty"],
]

const LONG_FIELDS = [
  ["techBody", "Tech intro"],
  ["skillsBody", "Skills intro"],
  ["skillsPageBody", "Skills page intro"],
  ["experienceBody", "Experience intro"],
  ["experiencePageBody", "Experience page intro"],
  ["projectsBody", "Projects intro"],
  ["projectsPageBody", "Projects page intro"],
  ["achievementsBody", "Achievements intro"],
  ["contactBody", "Contact intro"],
  ["contactInfoBody", "Contact details text"],
  ["contactPageBody", "Contact page intro"],
]

function OneImage({ label, value, onChange }) {
  return (
    <MediaUploader
      label={label}
      value={value ? [value] : []}
      onChange={(urls) => onChange(urls[urls.length - 1] || "")}
    />
  )
}

export default function WebsitePage() {
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
          <h1 className="text-3xl font-display font-bold text-charcoal-blue dark:text-verdigris">Website</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Text and images for the public site. Projects, skills, experience, education, achievements, and blog posts stay on their own pages in the sidebar.
          </p>
        </div>
        <Button type="submit" disabled={saving}>
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Save website
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Identity</CardTitle>
          <CardDescription>Name, bio, contact, and social links shown on the site.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <Field label="Full name" value={profile.name} onChange={(value) => setProfile({ ...profile, name: value })} />
          <Field label="Role" value={profile.role} onChange={(value) => setProfile({ ...profile, role: value })} />
          <div className="md:col-span-2">
            <Label>Summary</Label>
            <Textarea className="mt-2 min-h-[120px]" value={profile.summary} onChange={(e) => setProfile({ ...profile, summary: e.target.value })} />
          </div>
          <Field label="Email" value={profile.email} onChange={(value) => setProfile({ ...profile, email: value })} />
          <Field label="Phone" value={profile.phone} onChange={(value) => setProfile({ ...profile, phone: value })} />
          <Field label="Address" value={profile.address} onChange={(value) => setProfile({ ...profile, address: value })} />
          <Field label="Resume URL" value={profile.resume_url} onChange={(value) => setProfile({ ...profile, resume_url: value })} />
          <Field label="LinkedIn" value={profile.social_linkedin} onChange={(value) => setProfile({ ...profile, social_linkedin: value })} />
          <Field label="GitHub" value={profile.social_github} onChange={(value) => setProfile({ ...profile, social_github: value })} />
          <Field label="Medium" value={profile.social_medium} onChange={(value) => setProfile({ ...profile, social_medium: value })} />
          <Field label="Portfolio URL" value={profile.social_portfolio} onChange={(value) => setProfile({ ...profile, social_portfolio: value })} />
          <div className="md:col-span-2">
            <OneImage label="Profile photo" value={profile.image_url} onChange={(value) => setProfile({ ...profile, image_url: value })} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Logos</CardTitle>
          <CardDescription>Light logo shows in light mode. Dark logo shows in dark mode.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <OneImage label="Light logo" value={content.logoLight} onChange={(value) => setField("logoLight", value)} />
          <OneImage label="Dark logo" value={content.logoDark} onChange={(value) => setField("logoDark", value)} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Headings and labels</CardTitle>
          <CardDescription>Every short line of copy on the public pages.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          {COPY_FIELDS.map(([key, label]) => (
            <Field key={key} label={label} value={content[key] || ""} onChange={(value) => setField(key, value)} />
          ))}
          {LONG_FIELDS.map(([key, label]) => (
            <div key={key} className="md:col-span-2 space-y-2">
              <Label>{label}</Label>
              <Textarea value={content[key] || ""} onChange={(e) => setField(key, e.target.value)} />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Technology logos</CardTitle>
          <CardDescription>
            One name per line. React, Next.js, TypeScript, JavaScript, Node.js, Python, Tailwind, PostgreSQL, Supabase, Firebase, Git, and Figma use their brand marks. Any other name is shown as text. Add an image with Name|https://image-url.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea className="min-h-[220px] font-mono text-sm" value={content.techs} onChange={(e) => setField("techs", e.target.value)} />
        </CardContent>
      </Card>

      <Button type="submit" disabled={saving}>
        {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
        Save website
      </Button>
    </form>
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
