"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import {
  Loader2,
  Plus,
  PenLine,
  Trash2,
  ExternalLink,
  FileText,
  CheckCircle2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { PostStats } from "@/components/admin/post-stats"

export default function AdminBlogPage() {
  const router = useRouter()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState("")
  const [error, setError] = useState(null)
  const [creating, setCreating] = useState(false)

  async function fetchPosts() {
    setLoading(true)
    const { data, error } = await supabase
      .from("posts")
      .select("id, slug, title, status, published_at, updated_at, tags")
      .order("updated_at", { ascending: false })

    if (error) setError(error.message)
    else setPosts(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const handleCreate = async () => {
    setCreating(true)
    const stamp = Date.now()
    const { data, error } = await supabase
      .from("posts")
      .insert([{ title: "Untitled post", slug: `untitled-${stamp}`, status: "draft" }])
      .select("id")
      .single()

    setCreating(false)
    if (error) {
      setError(error.message)
      return
    }
    router.push(`/mdtadmin/blog/${data.id}`)
  }

  const handleDelete = async (post) => {
    if (!confirm(`Delete "${post.title}"? This cannot be undone.`)) return
    const { error } = await supabase.from("posts").delete().eq("id", post.id)
    if (error) setError(error.message)
    else setPosts((prev) => prev.filter((p) => p.id !== post.id))
  }

  const visible = posts.filter((post) =>
    post.title.toLowerCase().includes(query.toLowerCase())
  )

  const published = posts.filter((p) => p.status === "published").length
  const drafts = posts.length - published

  if (loading) {
    return (
      <div className="flex justify-center p-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-primary">Blog</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {published} published &middot; {drafts} draft{drafts === 1 ? "" : "s"}
          </p>
        </div>
        <Button onClick={handleCreate} disabled={creating}>
          {creating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
          New post
        </Button>
      </div>

      {error && (
        <div className="rounded-md border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <Input
        placeholder="Search posts…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="max-w-sm"
      />

      {visible.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
            <FileText className="h-10 w-10 text-muted-foreground/40" />
            <p className="font-medium text-foreground">
              {posts.length === 0 ? "No posts yet" : "No posts match that search"}
            </p>
            {posts.length === 0 && (
              <p className="max-w-sm text-sm text-muted-foreground">
                Create your first post and it will appear on your public blog once published.
              </p>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {visible.map((post) => (
            <Card key={post.id} className="group transition-colors hover:border-primary/40">
              <CardContent className="flex flex-wrap items-center justify-between gap-4 py-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={`/mdtadmin/blog/${post.id}`}
                      className="truncate text-lg font-semibold text-foreground transition-colors hover:text-primary"
                    >
                      {post.title}
                    </Link>
                    {post.status === "published" ? (
                      <Badge className="gap-1 bg-primary/10 text-primary hover:bg-primary/10">
                        <CheckCircle2 className="h-3 w-3" />
                        Published
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground">
                        Draft
                      </Badge>
                    )}
                  </div>
                  <p className="mt-1 truncate font-mono text-xs text-muted-foreground">
                    /blog/{post.slug}
                  </p>
                  {post.status === "published" && (
                    <div className="mt-2">
                      <PostStats slug={post.slug} compact />
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  {post.status === "published" && (
                    <Button variant="ghost" size="icon" asChild title="View live">
                      <a href={`/blog/${post.slug}`} target="_blank" rel="noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" asChild title="Edit">
                    <Link href={`/mdtadmin/blog/${post.id}`}>
                      <PenLine className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => handleDelete(post)}
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
