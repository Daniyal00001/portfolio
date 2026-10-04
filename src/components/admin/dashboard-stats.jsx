"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  AlertTriangle,
  CheckCircle2,
  FileText,
  FolderGit2,
  Inbox,
  Loader2,
  Trophy,
  Wrench,
} from "lucide-react"

import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// `head: true` returns only the count, so these stay cheap.
async function countRows(table, apply) {
  let query = supabase.from(table).select("*", { count: "exact", head: true })
  if (apply) query = apply(query)
  const { count, error } = await query
  // A missing table (migration not yet applied) should not break the dashboard.
  if (error) return null
  return count ?? 0
}

export function DashboardStats() {
  const [stats, setStats] = useState(null)
  const [issues, setIssues] = useState([])

  useEffect(() => {
    async function load() {
      const [projects, achievements, skills, experience, unread, published, drafts] =
        await Promise.all([
          countRows("projects"),
          countRows("achievements"),
          countRows("skills"),
          countRows("experience"),
          countRows("messages", (q) => q.eq("is_read", false)),
          countRows("posts", (q) => q.eq("status", "published")),
          countRows("posts", (q) => q.eq("status", "draft")),
        ])

      setStats({ projects, achievements, skills, experience, unread, published, drafts })

      // Content health: only real, actionable gaps.
      const found = []

      const { data: thinPosts } = await supabase
        .from("posts")
        .select("id, title, meta_description, cover_image_url")
        .eq("status", "published")

      ;(thinPosts || []).forEach((post) => {
        if (!post.meta_description) {
          found.push({
            severity: "warn",
            text: `"${post.title}" has no meta description`,
            href: `/mdtadmin/blog/${post.id}`,
          })
        }
        if (!post.cover_image_url) {
          found.push({
            severity: "info",
            text: `"${post.title}" has no cover image`,
            href: `/mdtadmin/blog/${post.id}`,
          })
        }
      })

      const { data: projectRows } = await supabase
        .from("projects")
        .select("id, name, image_url, images, live_url")

      ;(projectRows || []).forEach((project) => {
        const hasImage = project.image_url || (project.images && project.images.length > 0)
        if (!hasImage) {
          found.push({
            severity: "info",
            text: `Project "${project.name}" has no image`,
            href: "/mdtadmin",
          })
        }
      })

      if (drafts > 0) {
        found.push({
          severity: "info",
          text: `${drafts} blog draft${drafts === 1 ? "" : "s"} not published yet`,
          href: "/mdtadmin/blog",
        })
      }

      if (unread > 0) {
        found.push({
          severity: "warn",
          text: `${unread} unread message${unread === 1 ? "" : "s"}`,
          href: "/mdtadmin/messages",
        })
      }

      setIssues(found)
    }

    load()
  }, [])

  if (!stats) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    )
  }

  const cards = [
    {
      label: "Blog posts",
      value: stats.published,
      sub:
        stats.published === null
          ? "Run the blog migration to enable"
          : `${stats.drafts ?? 0} draft${stats.drafts === 1 ? "" : "s"}`,
      icon: FileText,
      href: "/mdtadmin/blog",
    },
    {
      label: "Projects",
      value: stats.projects,
      sub: "Portfolio items",
      icon: FolderGit2,
      href: "/mdtadmin",
    },
    {
      label: "Skills",
      value: stats.skills,
      sub: "Categories",
      icon: Wrench,
      href: "/mdtadmin/skills",
    },
    {
      label: "Achievements",
      value: stats.achievements,
      sub: "Press and milestones",
      icon: Trophy,
      href: "/mdtadmin?tab=achievements",
    },
    {
      label: "Unread messages",
      value: stats.unread,
      sub: stats.unread > 0 ? "Needs a reply" : "All caught up",
      icon: Inbox,
      href: "/mdtadmin/messages",
      highlight: stats.unread > 0,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {cards.map(({ label, value, sub, icon: Icon, href, highlight }) => (
          <Link key={label} href={href}>
            <Card
              className={`h-full transition-colors hover:border-primary/40 ${
                highlight ? "border-primary/40" : ""
              }`}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {label}
                </CardTitle>
                <Icon className={`h-4 w-4 ${highlight ? "text-primary" : "text-muted-foreground"}`} />
              </CardHeader>
              <CardContent>
                <div className="font-display text-3xl font-bold">
                  {value === null ? "—" : value}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-base">Content health</CardTitle>
          <Badge variant={issues.length ? "outline" : "secondary"} className="font-normal">
            {issues.length} item{issues.length === 1 ? "" : "s"}
          </Badge>
        </CardHeader>
        <CardContent>
          {issues.length === 0 ? (
            <p className="flex items-center gap-2 py-4 text-sm text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              Everything looks complete. No gaps found.
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {issues.map((issue, index) => (
                <li key={index}>
                  <Link
                    href={issue.href}
                    className="flex items-center gap-3 py-2.5 text-sm transition-colors hover:text-primary"
                  >
                    <AlertTriangle
                      className={`h-4 w-4 shrink-0 ${
                        issue.severity === "warn" ? "text-primary" : "text-muted-foreground"
                      }`}
                    />
                    <span className="text-foreground">{issue.text}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
