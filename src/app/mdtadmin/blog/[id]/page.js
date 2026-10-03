"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase"
import {
  ArrowLeft,
  Bold,
  Code2,
  Eye,
  Heading2,
  Heading3,
  Image as ImageIcon,
  Italic,
  Link2,
  List,
  ListOrdered,
  Loader2,
  Quote,
  Save,
  Columns2,
  PenLine,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Markdown } from "@/components/markdown"
import { MediaUploader } from "@/components/admin/media-uploader"
import { PostStats } from "@/components/admin/post-stats"
import { SITE_URL, readingMinutes } from "@/lib/posts"

function slugify(value = "") {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

// Character budgets Google actually respects before truncating.
const META_TITLE_MAX = 60
const META_DESC_MIN = 120
const META_DESC_MAX = 160

const TOOLBAR = [
  { icon: Bold, label: "Bold", before: "**", after: "**" },
  { icon: Italic, label: "Italic", before: "_", after: "_" },
  { icon: Heading2, label: "Heading 2", before: "## ", after: "", block: true },
  { icon: Heading3, label: "Heading 3", before: "### ", after: "", block: true },
  { icon: Link2, label: "Link", before: "[", after: "](https://)" },
  { icon: Code2, label: "Code block", before: "```\n", after: "\n```", block: true },
  { icon: Quote, label: "Quote", before: "> ", after: "", block: true },
  { icon: List, label: "Bullet list", before: "- ", after: "", block: true },
  { icon: ListOrdered, label: "Numbered list", before: "1. ", after: "", block: true },
  { icon: ImageIcon, label: "Image", before: "![alt](", after: ")" },
]

function CharacterMeter({ value = "", min, max }) {
  const length = value.length
  const tooShort = min ? length > 0 && length < min : false
  const tooLong = length > max
  const tone = tooLong
    ? "text-destructive"
    : tooShort
      ? "text-muted-foreground"
      : length === 0
        ? "text-muted-foreground"
        : "text-primary"

  return (
    <span className={`font-mono text-xs ${tone}`}>
      {length}/{max}
      {tooLong && " — will be truncated"}
      {tooShort && " — a little short"}
    </span>
  )
}

export default function BlogEditorPage() {
  const { id } = useParams()
  const router = useRouter()
  const textareaRef = useRef(null)

  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [view, setView] = useState("split") // write | split | preview
  const [slugTouched, setSlugTouched] = useState(false)

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase.from("posts").select("*").eq("id", id).single()
      if (error) {
        toast.error(`Could not load post: ${error.message}`)
        router.push("/mdtadmin/blog")
        return
      }
      setPost(data)
      setSlugTouched(Boolean(data.slug) && !data.slug.startsWith("untitled-"))
      setLoading(false)
    }
    load()
  }, [id, router])

  const update = (patch) => setPost((prev) => ({ ...prev, ...patch }))

  const handleTitleChange = (title) => {
    update(slugTouched ? { title } : { title, slug: slugify(title) })
  }

  const applyFormat = ({ before, after, block }) => {
    const el = textareaRef.current
    if (!el) return
    const { selectionStart: start, selectionEnd: end } = el
    const content = post.content || ""
    const selected = content.slice(start, end)

    const insertion = block
      ? `${before}${selected || "text"}${after}`
      : `${before}${selected || "text"}${after}`

    const next = content.slice(0, start) + insertion + content.slice(end)
    update({ content: next })

    requestAnimationFrame(() => {
      el.focus()
      const cursor = start + before.length
      el.setSelectionRange(cursor, cursor + (selected || "text").length)
    })
  }

  const save = async (overrides = {}) => {
    setSaving(true)
    const payload = { ...post, ...overrides }

    // Stamp the publish date the first time a post goes live.
    if (payload.status === "published" && !payload.published_at) {
      payload.published_at = new Date().toISOString()
    }

    const { id: _id, created_at, updated_at, ...writable } = payload

    const { error } = await supabase.from("posts").update(writable).eq("id", id)
    setSaving(false)

    if (error) {
      toast.error(
        error.code === "23505"
          ? "That slug is already used by another post."
          : `Save failed: ${error.message}`
      )
      return
    }

    setPost(payload)
    toast.success(payload.status === "published" ? "Post published" : "Draft saved")
  }

  const minutes = useMemo(() => readingMinutes(post?.content || ""), [post?.content])

  if (loading || !post) {
    return (
      <div className="flex justify-center p-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const serpTitle = post.meta_title || post.title || "Untitled post"
  const serpDescription =
    post.meta_description || post.excerpt || "No description set — Google will pick its own snippet."

  return (
    <div className="space-y-6 pb-20">
      {/* Sticky action bar */}
      <div className="sticky top-0 z-20 -mx-4 flex flex-wrap items-center justify-between gap-3 border-b border-border bg-background/95 px-4 py-3 backdrop-blur">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/mdtadmin/blog" aria-label="Back to posts">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <p className="max-w-[40ch] truncate text-sm font-semibold text-foreground">
              {post.title || "Untitled post"}
            </p>
            <p className="text-xs text-muted-foreground">
              {post.status === "published" ? "Published" : "Draft"} &middot; {minutes} min read
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="mr-1 hidden rounded-lg border border-border p-0.5 sm:flex">
            {[
              { key: "write", icon: PenLine, label: "Write" },
              { key: "split", icon: Columns2, label: "Split" },
              { key: "preview", icon: Eye, label: "Preview" },
            ].map(({ key, icon: Icon, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => setView(key)}
                aria-pressed={view === key}
                title={label}
                className={`rounded-md px-2.5 py-1.5 transition-colors ${
                  view === key
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
              </button>
            ))}
          </div>

          <Button variant="outline" onClick={() => save({ status: "draft" })} disabled={saving}>
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save draft
          </Button>
          <Button onClick={() => save({ status: "published" })} disabled={saving}>
            {post.status === "published" ? "Update" : "Publish"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        {/* ---------------- Main editor ---------------- */}
        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={post.title || ""}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="How I cut our build time in half"
              className="h-auto py-3 font-display text-2xl font-bold"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              value={post.excerpt || ""}
              onChange={(e) => update({ excerpt: e.target.value })}
              placeholder="One or two sentences shown in the post list and used as the SEO fallback."
              className="min-h-[70px]"
            />
          </div>

          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-1 rounded-lg border border-border bg-muted/40 p-1">
            {TOOLBAR.map((tool) => (
              <button
                key={tool.label}
                type="button"
                title={tool.label}
                aria-label={tool.label}
                onClick={() => applyFormat(tool)}
                className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-background hover:text-primary"
              >
                <tool.icon className="h-4 w-4" />
              </button>
            ))}
            <span className="ml-auto pr-2 font-mono text-xs text-muted-foreground">Markdown</span>
          </div>

          <div
            className={`grid gap-4 ${view === "split" ? "lg:grid-cols-2" : "grid-cols-1"}`}
          >
            {view !== "preview" && (
              <Textarea
                ref={textareaRef}
                value={post.content || ""}
                onChange={(e) => update({ content: e.target.value })}
                placeholder={"Write in Markdown…\n\n## A heading\n\nSome **bold** text and `code`."}
                className="min-h-[560px] resize-y font-mono text-sm leading-relaxed"
              />
            )}

            {view !== "write" && (
              <div className="min-h-[560px] overflow-auto rounded-lg border border-border bg-card p-6">
                {post.content ? (
                  <Markdown content={post.content} />
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Nothing to preview yet. Start writing on the left.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ---------------- Sidebar ---------------- */}
        <aside className="space-y-5">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Search appearance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Google-style preview */}
              <div className="rounded-lg border border-border bg-background p-3">
                <p className="truncate text-xs text-muted-foreground">
                  {SITE_URL.replace("https://", "")}/blog/{post.slug || "…"}
                </p>
                <p className="mt-1 line-clamp-2 text-base leading-snug text-[#1a0dab] dark:text-[#8ab4f8]">
                  {serpTitle}
                </p>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{serpDescription}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="meta_title">SEO title</Label>
                  <CharacterMeter value={post.meta_title || ""} max={META_TITLE_MAX} />
                </div>
                <Input
                  id="meta_title"
                  value={post.meta_title || ""}
                  onChange={(e) => update({ meta_title: e.target.value })}
                  placeholder={post.title || "Defaults to the post title"}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="meta_description">Meta description</Label>
                  <CharacterMeter
                    value={post.meta_description || ""}
                    min={META_DESC_MIN}
                    max={META_DESC_MAX}
                  />
                </div>
                <Textarea
                  id="meta_description"
                  value={post.meta_description || ""}
                  onChange={(e) => update({ meta_description: e.target.value })}
                  placeholder="Defaults to the excerpt."
                  className="min-h-[80px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">URL slug</Label>
                <Input
                  id="slug"
                  value={post.slug || ""}
                  onChange={(e) => {
                    setSlugTouched(true)
                    update({ slug: slugify(e.target.value) })
                  }}
                  className="font-mono text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="canonical_url">Canonical URL</Label>
                <Input
                  id="canonical_url"
                  value={post.canonical_url || ""}
                  onChange={(e) => update({ canonical_url: e.target.value })}
                  placeholder="Only if this was published elsewhere first"
                  className="text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Set this to the Medium URL if you cross-post, so Google knows which copy wins.
                </p>
              </div>

              <label className="flex items-center gap-2 text-sm text-foreground">
                <input
                  type="checkbox"
                  checked={Boolean(post.noindex)}
                  onChange={(e) => update({ noindex: e.target.checked })}
                  className="h-4 w-4 accent-[var(--primary)]"
                />
                Hide from search engines
              </label>
            </CardContent>
          </Card>

          {post.status === "published" && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <PostStats slug={post.slug} />
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Cover image</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <MediaUploader
                value={post.cover_image_url || ""}
                onChange={(next) =>
                  update({ cover_image_url: Array.isArray(next) ? next[0] || "" : next || "" })
                }
              />
              <p className="text-xs text-muted-foreground">
                Also used as the social share image unless you set a separate one below.
              </p>
              <div className="space-y-2">
                <Label htmlFor="og_image_url">Social share image</Label>
                <Input
                  id="og_image_url"
                  value={post.og_image_url || ""}
                  onChange={(e) => update({ og_image_url: e.target.value })}
                  placeholder="Optional override"
                  className="text-sm"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Tags</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input
                value={(post.tags || []).join(", ")}
                onChange={(e) =>
                  update({
                    tags: e.target.value
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean),
                  })
                }
                placeholder="react, nextjs, performance"
              />
              <div className="flex flex-wrap gap-1.5">
                {(post.tags || []).map((tag) => (
                  <Badge key={tag} variant="outline" className="font-normal">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  )
}
