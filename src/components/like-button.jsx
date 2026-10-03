"use client"

import { useEffect, useState } from "react"
import { Heart } from "lucide-react"

export function LikeButton({ slug }) {
  const [likes, setLikes] = useState(null)
  const [liked, setLiked] = useState(false)
  const [pending, setPending] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetch(`/api/like?slug=${encodeURIComponent(slug)}`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled || data?.error) return
        setLikes(data.likes)
        setLiked(data.liked)
      })
      .catch(() => {})
    return () => { cancelled = true }
  }, [slug])

  const toggle = async () => {
    if (pending) return
    setPending(true)

    // Optimistic: the count moves immediately, and reverts if the request fails.
    const previous = { likes, liked }
    setLiked(!liked)
    setLikes((n) => (n ?? 0) + (liked ? -1 : 1))

    try {
      const res = await fetch("/api/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      })
      const data = await res.json()
      if (data?.error) throw new Error(data.error)
      setLikes(data.likes)
      setLiked(data.liked)
    } catch {
      setLikes(previous.likes)
      setLiked(previous.liked)
    } finally {
      setPending(false)
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={pending}
      aria-pressed={liked}
      aria-label={liked ? "Remove like" : "Like this article"}
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all disabled:opacity-60 ${
        liked
          ? "border-primary/40 bg-primary/10 text-primary"
          : "border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
      }`}
    >
      <Heart className={`h-4 w-4 transition-transform ${liked ? "scale-110 fill-current" : ""}`} />
      {likes === null ? "…" : likes}
    </button>
  )
}

export default LikeButton
