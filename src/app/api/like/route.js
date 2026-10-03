import { createHash } from "crypto"
import { createClient } from "@supabase/supabase-js"

function admin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SECRET_KEY,
    { auth: { persistSession: false } }
  )
}

function visitorHash(request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  const ua = request.headers.get("user-agent") || "unknown"
  const salt = process.env.ANALYTICS_SALT || process.env.SUPABASE_SECRET_KEY || "salt"
  return createHash("sha256").update(`${ip}|${ua}|${salt}`).digest("hex").slice(0, 32)
}

async function countFor(supabase, slug) {
  const { count } = await supabase
    .from("post_likes")
    .select("*", { count: "exact", head: true })
    .eq("slug", slug)
  return count ?? 0
}

// Current like count, and whether this visitor has already liked it.
export async function GET(request) {
  const slug = new URL(request.url).searchParams.get("slug")
  if (!slug) return Response.json({ error: "slug required" }, { status: 400 })

  const supabase = admin()
  const { data: mine } = await supabase
    .from("post_likes")
    .select("id")
    .eq("slug", slug)
    .eq("visitor_hash", visitorHash(request))
    .maybeSingle()

  return Response.json({ likes: await countFor(supabase, slug), liked: Boolean(mine) })
}

// Toggle: liking twice removes the like. One per visitor, enforced in the schema.
export async function POST(request) {
  let body
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: "Invalid body" }, { status: 400 })
  }

  const slug = body?.slug
  if (!slug) return Response.json({ error: "slug required" }, { status: 400 })

  const supabase = admin()
  const hash = visitorHash(request)

  const { data: existing } = await supabase
    .from("post_likes")
    .select("id")
    .eq("slug", slug)
    .eq("visitor_hash", hash)
    .maybeSingle()

  if (existing) {
    await supabase.from("post_likes").delete().eq("id", existing.id)
    return Response.json({ likes: await countFor(supabase, slug), liked: false })
  }

  const { error } = await supabase.from("post_likes").insert([{ slug, visitor_hash: hash }])
  if (error && error.code !== "23505") {
    console.error("like failed:", error.message)
    return Response.json({ error: "insert failed" }, { status: 500 })
  }

  return Response.json({ likes: await countFor(supabase, slug), liked: true })
}
