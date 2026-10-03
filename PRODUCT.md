# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

No single primary audience — the site must work for all of these at once (confirmed
by the user as "all in one"):

- **EU employers and recruiters**, including relocation roles. The companion CV is
  written in Europass format and states openness to EU relocation.
- **Remote-first international employers**, any country.
- **Freelance and agency clients** hiring for a build rather than employing him.
- **Local Pakistan and Gulf employers** (Islamabad, Lahore, Dubai market).

Typical situation: someone skimming quickly to decide whether this person is worth
a conversation. They arrive from a job application, a LinkedIn or GitHub profile,
or a search for his name.

## Product Purpose

A personal portfolio and CV site for Muhammad Faheem Iqbal, a full stack developer
based in Islamabad, Pakistan.

Success is a visitor **downloading the CV** — that is the single conversion the
user named. Contacting him is a secondary outcome. Everything on the page exists to
build enough credibility that taking the CV feels worthwhile.

## Positioning

Two things a neighbouring developer portfolio could not truthfully copy:

1. **Full stack web plus real hardware.** React/Next.js/Node/Python production work
   alongside IoT builds with hand-etched custom PCBs. Most web developers have no
   hardware story at all.
2. **Independently verified proof.** His smart home project was covered by three
   national media outlets (ARY News, UrduPoint, KarDikhao). This is third-party
   evidence, not self-description.

Supporting facts: international experience across three countries (Pakistan,
Austria, United States) and promotion to Software Engineer within 11 months.

## Operating Context

- Visitors are usually skim-reading and time-poor; many arrive on mobile.
- The site is also used as a live link inside job applications, so it must load fast
  and read credibly on first paint.
- The CV PDF lives at `public/assets/PDF/CV/Muhammad_Faheem_Iqbal_CV.pdf` and is kept
  in sync with the site content.

## Capabilities and Constraints

- Next.js 16 (App Router, Turbopack), React 19, Tailwind v4, shadcn/ui components.
- **All content is database-driven via Supabase** and edited through an admin panel
  at `/mfiadmin`: profile, experience, skills, projects, achievements, messages, and
  blog posts. Redesign work must keep this data layer and the admin panel working.
- Tables: `profiles`, `experience`, `skills`, `projects`, `achievements`, `messages`,
  and `posts` (blog; migration in `supabase/migrations/` pending application).
- A blog with an SEO suite (meta fields, canonical URLs, Article JSON-LD, RSS,
  sitemap) and a Markdown editor in the admin panel.
- Three.js is available and in use for interactive WebGL.
- Sections currently present: hero, tech marquee, skills, experience, projects,
  achievements/media, contact, blog.

## Brand Commitments

- **Red is binding.** The user confirmed the red brand colour must not change. It was
  a deliberate recent choice and is now applied consistently across light and dark
  themes and the admin panel.
- The `MFI` logo mark exists at `public/assets/mylogo/` (black and white variants).
  The user did *not* mark it as fixed, so it may be reworked, but it is real
  existing brand material rather than a placeholder.
- A professional photograph of the user exists and is currently used in the hero.
  Also not marked as fixed.

## Evidence on Hand

Real, verifiable material — none of this may be fabricated or embellished:

- **Press:** ARY News TV report (2022), UrduPoint video interview (2022),
  KarDikhao article (01/2024), all on the smart home project. Stored in the
  `achievements` table with live URLs.
- **Employment:** MicroMerger (Pvt.) Ltd (Associate → Software Engineer),
  Alphabase (US-based, internship), JUHUU GmbH (Austria, remote), BestMobile.pk.
- **Current work:** TabTake, an all-in-one restaurant management system
  (tabtake.com).
- **Projects:** StitchSmart, PeekGamer, Qotion, PlantPulse, Cinematic Vistas,
  ExplorePak, Speedy Eats, KaTable, Liquid Ether. 25+ public GitHub repositories.
- **Writing:** Medium at faheem506pk.medium.com.
- **Education:** BS Information Technology, University of Chakwal (2020–2024).

Explicit absences that must not be invented: no client testimonials, no user or
traffic numbers, no revenue or performance benchmarks, no certifications. An earlier
version of the dashboard displayed a fabricated "1.2k profile views / +12%" stat;
that has been removed and must not return.

## Product Principles

1. **Credibility before flourish.** Every effect must survive the question "does this
   make a hiring manager trust him more?" The verified press coverage and real
   shipped work are the strongest assets; presentation serves them.
2. **The CV download is the destination.** It should be reachable from anywhere on
   the site without hunting.
3. **One person, many audiences.** Copy and structure cannot assume EU, local, or
   freelance context exclusively.
4. **Claims stay literally true.** No invented metrics, no inflated titles. The user
   actively pushes back on overstatement — he challenged his own job title for
   implying more frontend focus than intended.
5. **Content stays editable.** Anything added must be manageable from the admin
   panel rather than hardcoded.

## Accessibility & Inclusion

No product-specific standard was established by the user. General practice applies:
readable contrast in both themes, keyboard-operable controls, and respect for
`prefers-reduced-motion` (already implemented in the WebGL hero).
