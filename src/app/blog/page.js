import Link from "next/link"
import Image from "next/image"
import { ArrowUpRight, Clock, Rss } from "lucide-react"

import { PageWrapper } from "@/components/page-wrapper"
import { Badge } from "@/components/ui/badge"
import { getPublishedPosts, formatPostDate, SITE_URL } from "@/lib/posts"

export const revalidate = 300

export const metadata = {
  title: "Blog",
  description:
    "Articles on software engineering by Muhammad Daniyal Tallat.",
  alternates: {
    canonical: `${SITE_URL}/blog`,
    types: { "application/rss+xml": `${SITE_URL}/blog/rss.xml` },
  },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/blog`,
    title: "Blog | Muhammad Daniyal Tallat",
    description:
      "Articles on software engineering by Muhammad Daniyal Tallat.",
  },
}

export default async function BlogIndexPage() {
  const posts = await getPublishedPosts()

  return (
    <PageWrapper title="Writing">
      <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
        <p className="max-w-2xl text-lg text-muted-foreground">
          Notes on building for the web: React and Next.js in production, full stack
          architecture, and the occasional soldering iron.
        </p>
        <a
          href="/blog/rss.xml"
          className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          <Rss className="h-4 w-4" />
          RSS
        </a>
      </div>

      {posts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border py-20 text-center">
          <p className="text-lg font-medium text-foreground">No posts published yet</p>
          <p className="mt-2 text-sm text-muted-foreground">
            The first article is on its way. Check back shortly.
          </p>
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-border border-t border-border">
          {posts.map((post) => (
            <article key={post.slug} className="group py-8">
              <Link href={`/blog/${post.slug}`} className="grid gap-6 sm:grid-cols-[1fr_auto] sm:items-start">
                <div className="flex flex-col gap-3">
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <time dateTime={post.published_at}>{formatPostDate(post.published_at)}</time>
                    {post.tags?.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="font-normal">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <h2 className="font-display text-2xl font-bold leading-snug text-foreground transition-colors group-hover:text-primary md:text-3xl">
                    {post.title}
                  </h2>

                  {post.excerpt && (
                    <p className="max-w-2xl leading-relaxed text-muted-foreground">{post.excerpt}</p>
                  )}

                  <span className="mt-1 flex items-center gap-1.5 text-sm font-medium text-primary">
                    Read article
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>

                {post.cover_image_url && (
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg border border-border sm:w-56">
                    <Image
                      src={post.cover_image_url}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 100vw, 224px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                )}
              </Link>
            </article>
          ))}
        </div>
      )}
    </PageWrapper>
  )
}
