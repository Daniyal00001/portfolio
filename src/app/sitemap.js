import { getPublishedPosts, SITE_URL } from "@/lib/posts"

export const revalidate = 3600

const staticRoutes = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/blog", changeFrequency: "daily", priority: 0.9 },
  { path: "/skills", changeFrequency: "monthly", priority: 0.8 },
  { path: "/experience", changeFrequency: "monthly", priority: 0.8 },
  { path: "/projects", changeFrequency: "monthly", priority: 0.8 },
  { path: "/achievements", changeFrequency: "monthly", priority: 0.8 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.6 },
]

export default async function sitemap() {
  const posts = await getPublishedPosts()

  return [
    ...staticRoutes.map(({ path, changeFrequency, priority }) => ({
      url: `${SITE_URL}${path}`,
      lastModified: new Date(),
      changeFrequency,
      priority,
    })),
    ...posts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.updated_at || post.published_at || Date.now()),
      changeFrequency: "monthly",
      priority: 0.7,
    })),
  ]
}
