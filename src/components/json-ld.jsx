"use client"

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

export function JsonLd({ profile }) {
  const name = profile?.name || "Muhammad Daniyal Tallat"
  const personId = `${SITE}/#person`

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": personId,
    name,
    jobTitle: profile?.role || "Full Stack Software Engineer",
    description: profile?.summary || "Full Stack Software Engineer.",
    url: profile?.social_portfolio || SITE,
    ...(profile?.image_url ? { image: profile.image_url } : {}),
    email: profile?.email || "daniyaltallat0@gmail.com",
    sameAs: [
      profile?.social_linkedin,
      profile?.social_github,
      profile?.social_portfolio,
      profile?.social_medium,
    ].filter(Boolean),
  }

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE}/#website`,
    url: SITE,
    name: `${name} — Developer Portfolio`,
    description: profile?.summary || "Portfolio of Muhammad Daniyal Tallat, Full Stack Software Engineer",
    publisher: { "@id": personId },
    inLanguage: "en-US"
  }

  const profilePageSchema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${SITE}/#profilepage`,
    url: SITE,
    name: `${name} — Portfolio`,
    mainEntity: { "@id": personId },
    dateModified: new Date().toISOString().split("T")[0],
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE },
        { "@type": "ListItem", position: 2, name: "Skills", item: `${SITE}/skills` },
        { "@type": "ListItem", position: 3, name: "Experience", item: `${SITE}/experience` },
        { "@type": "ListItem", position: 4, name: "Projects", item: `${SITE}/projects` },
        { "@type": "ListItem", position: 5, name: "Contact", item: `${SITE}/contact` }
      ]
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePageSchema) }}
      />
    </>
  )
}
