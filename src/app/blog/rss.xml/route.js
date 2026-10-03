import { getPublishedPosts, postUrl, SITE_URL } from "@/lib/posts"
import { Mydata } from "@/lib/data"

export const revalidate = 3600

function escapeXml(value = "") {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

export async function GET() {
  const posts = await getPublishedPosts()

  const items = posts
    .map((post) => {
      const link = postUrl(post.slug)
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description>${escapeXml(post.excerpt || "")}</description>
      <pubDate>${new Date(post.published_at || Date.now()).toUTCString()}</pubDate>
      ${(post.tags || []).map((tag) => `<category>${escapeXml(tag)}</category>`).join("\n      ")}
    </item>`
    })
    .join("\n")

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(Mydata.Name)} — Writing</title>
    <link>${SITE_URL}/blog</link>
    <description>Articles on React, Next.js, full stack engineering and IoT.</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/blog/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600",
    },
  })
}
