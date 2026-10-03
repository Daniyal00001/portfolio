import { createHash, randomUUID } from "crypto"
import { createClient } from "@supabase/supabase-js"

// Writes use the service role, so RLS never exposes the analytics table to the public.
function admin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SECRET_KEY,
    { auth: { persistSession: false } }
  )
}

// A salted, one-way hash of IP + user agent. The raw values are never stored, and
// the hash cannot be reversed to identify anyone.
function visitorHash(request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  const ua = request.headers.get("user-agent") || "unknown"
  const salt = process.env.ANALYTICS_SALT || process.env.SUPABASE_SECRET_KEY || "salt"
  return createHash("sha256").update(`${ip}|${ua}|${salt}`).digest("hex").slice(0, 32)
}

function deviceFrom(ua = "") {
  if (/iPad|Tablet/i.test(ua)) return "tablet"
  if (/Mobi|Android|iPhone/i.test(ua)) return "mobile"
  return "desktop"
}

function referrerHost(value) {
  if (!value) return null
  try {
    const host = new URL(value).hostname.replace(/^www\./, "")
    return host || null
  } catch {
    return null
  }
}

export async function POST(request) {
  let body
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: "Invalid body" }, { status: 400 })
  }

  const { slug, sessionId, referrer, durationSeconds, scrollPercent } = body || {}
  if (!slug || typeof slug !== "string") {
    return Response.json({ error: "slug required" }, { status: 400 })
  }

  const supabase = admin()
  const ua = request.headers.get("user-agent") || ""

  // A later beacon for the same session updates that row rather than double counting.
  if (sessionId) {
    const { data: existing } = await supabase
      .from("post_views")
      .select("id, duration_seconds, scroll_percent")
      .eq("session_id", sessionId)
      .maybeSingle()

    if (existing) {
      await supabase
        .from("post_views")
        .update({
          duration_seconds: Math.max(existing.duration_seconds, Math.min(Number(durationSeconds) || 0, 3600)),
          scroll_percent: Math.max(existing.scroll_percent, Math.min(Number(scrollPercent) || 0, 100)),
        })
        .eq("id", existing.id)

      return Response.json({ ok: true, updated: true })
    }
  }

  const { error } = await supabase.from("post_views").insert([
    {
      slug,
      visitor_hash: visitorHash(request),
      session_id: sessionId || randomUUID(),
      referrer_host: referrerHost(referrer),
      country: request.headers.get("x-vercel-ip-country") || null,
      device: deviceFrom(ua),
      duration_seconds: Math.min(Number(durationSeconds) || 0, 3600),
      scroll_percent: Math.min(Number(scrollPercent) || 0, 100),
    },
  ])

  if (error && error.code !== "23505") {
    console.error("track failed:", error.message)
    return Response.json({ error: "insert failed" }, { status: 500 })
  }

  return Response.json({ ok: true })
}
