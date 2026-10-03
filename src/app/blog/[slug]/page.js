import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { ArrowLeft, Clock } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Markdown } from "@/components/markdown"
import { PostAnalytics } from "@/components/post-analytics"
import { LikeButton } from "@/components/like-button"
import {
  getPostBySlug,
  getPublishedPosts,
  formatPostDate,
  readingMinutes,
  postUrl,
  SITE_URL,
} from "@/lib/posts"
import { Mydata } from "@/lib/data"

export const revalidate = 300

export async function generateStaticParams() {
  const posts = await getPublishedPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    return { title: "Post not found", robots: { index: false, follow: false } }
  }

  const title = post.meta_title || post.title
  const description = post.meta_description || post.excerpt || undefined
  const image = post.og_image_url || post.cover_image_url

  return {
    title,
    description,
    alternates: { canonical: post.canonical_url || postUrl(post.slug) },
    robots: post.noindex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      type: "article",
      url: postUrl(post.slug),
      title,
      description,
      publishedTime: post.published_at || undefined,
      modifiedTime: post.updated_at || undefined,
      authors: [Mydata.Name],
      tags: post.tags || [],
      images: image ? [{ url: image, alt: post.title }] : undefined,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      images: image ? [image] : undefined,
    },
  }
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) notFound()

  const minutes = readingMinutes(post.content)
  const image = post.og_image_url || post.cover_image_url

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.meta_title || post.title,
    description: post.meta_description || post.excerpt || undefined,
    image: image ? [image] : undefined,
    datePublished: post.published_at || undefined,
    dateModified: post.updated_at || post.published_at || undefined,
    author: {
      "@type": "Person",
      name: Mydata.Name,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Person",
      name: Mydata.Name,
      url: SITE_URL,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": post.canonical_url || postUrl(post.slug),
    },
    keywords: post.tags?.join(", ") || undefined,
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: postUrl(post.slug) },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <article className="container max-w-3xl py-12 md:py-20">
        <Link
          href="/blog"
          className="mb-10 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          All writing
        </Link>

        <header className="flex flex-col gap-5">
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <time dateTime={post.published_at}>{formatPostDate(post.published_at)}</time>
            <span aria-hidden="true">&middot;</span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {minutes} min read
            </span>
          </div>

          <h1 className="font-display text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-xl leading-relaxed text-muted-foreground">{post.excerpt}</p>
          )}

          {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="font-normal">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </header>

        {post.cover_image_url && (
          <div className="relative mt-10 aspect-[16/9] w-full overflow-hidden rounded-xl border border-border">
            <Image
              src={post.cover_image_url}
              alt={post.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
          </div>
        )}

        <div className="mt-12">
          <Markdown content={post.content} />
        </div>

        <footer className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-8">
          <LikeButton slug={post.slug} />
          <Link
            href="/blog"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Read more articles
          </Link>
        </footer>
      </article>

      <PostAnalytics slug={post.slug} />
    </>
  )
}
