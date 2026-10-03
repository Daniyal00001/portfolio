"use client"

import { useEffect, useState } from "react"
import { Eye, Users, Clock, Heart, TrendingUp, CheckCheck } from "lucide-react"

import { supabase } from "@/lib/supabase"

function formatDuration(seconds) {
  const s = Number(seconds) || 0
  if (s < 60) return `${s}s`
  const m = Math.floor(s / 60)
  return `${m}m ${s % 60}s`
}

const EMPTY = {
  views: 0,
  unique_visitors: 0,
  avg_seconds: 0,
  completion_rate: 0,
  views_7d: 0,
  views_30d: 0,
  likes: 0,
}

export function PostStats({ slug, compact = false }) {
  const [stats, setStats] = useState(null)
  const [missing, setMissing] = useState(false)

  useEffect(() => {
    let cancelled = false
    supabase
      .rpc("post_stats", { post_slug: slug })
      .then(({ data, error }) => {
        if (cancelled) return
        // The analytics migration may not be applied yet; degrade quietly.
        if (error) { setMissing(true); return }
        setStats(data?.[0] ?? EMPTY)
      })
    return () => { cancelled = true }
  }, [slug])

  if (missing) {
    return compact ? null : (
      <p className="text-sm text-muted-foreground">
        Analytics not enabled yet — run the migration in{" "}
        <code className="text-xs">supabase/migrations/0002_post_analytics.sql</code>.
      </p>
    )
  }

  if (!stats) {
    return <div className="h-5 w-40 animate-pulse rounded bg-muted" />
  }

  if (compact) {
    return (
      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Eye className="h-3.5 w-3.5" />
          {stats.views} views
        </span>
        <span className="flex items-center gap-1.5">
          <Users className="h-3.5 w-3.5" />
          {stats.unique_visitors} readers
        </span>
        <span className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5" />
          {formatDuration(stats.avg_seconds)} avg
        </span>
        <span className="flex items-center gap-1.5">
          <Heart className="h-3.5 w-3.5" />
          {stats.likes}
        </span>
      </div>
    )
  }

  const tiles = [
    { label: "Total views", value: stats.views, icon: Eye, hint: "Every page load" },
    { label: "Unique readers", value: stats.unique_visitors, icon: Users, hint: "Distinct devices" },
    { label: "Avg read time", value: formatDuration(stats.avg_seconds), icon: Clock, hint: "Time on page" },
    { label: "Finished it", value: `${stats.completion_rate}%`, icon: CheckCheck, hint: "Scrolled past 90%" },
    { label: "Last 7 days", value: stats.views_7d, icon: TrendingUp, hint: `${stats.views_30d} in 30 days` },
    { label: "Likes", value: stats.likes, icon: Heart, hint: "One per reader" },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
      {tiles.map(({ label, value, icon: Icon, hint }) => (
        <div key={label} className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {label}
            </span>
            <Icon className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
          <p className="mt-2 font-display text-2xl font-bold">{value}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>
        </div>
      ))}
    </div>
  )
}

export default PostStats
