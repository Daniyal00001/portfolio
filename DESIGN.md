---
name: Signal Depth
description: A modern, rounded developer portfolio with real 3D — soft depth, generous radii, and a signal-red brand.
colors:
  signal-red: "oklch(0.58 0.22 27)"
  signal-red-deep: "oklch(0.48 0.21 27)"
  signal-red-soft: "oklch(0.95 0.04 27)"
  ink: "oklch(0.18 0.014 265)"
  ink-soft: "oklch(0.32 0.012 265)"
  surface: "oklch(0.985 0.002 265)"
  panel: "oklch(1 0 0)"
  hairline: "oklch(0.90 0.004 265)"
  muted-ink: "oklch(0.52 0.010 265)"
  night: "oklch(0.16 0.012 265)"
  night-panel: "oklch(0.21 0.013 265)"
  accent-cyan: "oklch(0.72 0.13 210)"
  accent-amber: "oklch(0.76 0.14 70)"
  success: "oklch(0.62 0.15 150)"
typography:
  display:
    fontFamily: "Sora, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(2.5rem, 7vw, 5.5rem)"
    fontWeight: 700
    lineHeight: 1.02
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Sora, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(1.75rem, 4vw, 3rem)"
    fontWeight: 700
    lineHeight: 1.12
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Sora, Helvetica Neue, Arial, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.015em"
  body:
    fontFamily: "Figtree, Helvetica Neue, Arial, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.7
    letterSpacing: "normal"
  label:
    fontFamily: "Figtree, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.02em"
  data:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "0.8125rem"
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: "0"
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  2xl: "32px"
  pill: "9999px"
spacing:
  xs: "8px"
  sm: "16px"
  md: "24px"
  lg: "40px"
  xl: "72px"
  section: "120px"
components:
  button-primary:
    backgroundColor: "{colors.signal-red}"
    textColor: "{colors.panel}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "16px 28px"
  button-primary-hover:
    backgroundColor: "{colors.signal-red-deep}"
    textColor: "{colors.panel}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "16px 28px"
  card:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xl}"
    padding: "24px"
  chip:
    backgroundColor: "{colors.signal-red-soft}"
    textColor: "{colors.signal-red-deep}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "6px 14px"
---

# Design System: Signal Depth

## Overview

**Creative North Star: "The Lit Object"**

A modern portfolio built around real three-dimensional objects rather than pictures of
them. The organising idea is that the work is shown as things you can turn over: the
tech stack renders as actual 3D geometry in WebGL, and the flat interface around it
behaves like soft-lit material — rounded, gently raised, catching light at the edges.

Everything else recedes so those objects lead. Surfaces are generous and quiet, type
is confident but unfussy, and a single signal red carries every action. The red is the
user's binding brand colour and it is the only saturated hue in the base interface;
the colour in the composition comes from the 3D objects themselves.

The honest risk of this world is familiarity — soft rounded cards with a WebGL hero is
the most common portfolio look in circulation. The defence is craft and restraint: real
geometry rather than stock illustration, one accent rather than a gradient soup, tight
type, and a page that is mostly calm so the 3D moments land.

**Key Characteristics:**
- Generous rounded geometry (16–32px) with pill-shaped actions
- Soft, low-contrast ambient depth; never hard drop shadows
- Real WebGL objects as the visual centrepiece, not decorative blobs
- One saturated brand red against cool near-neutrals
- Dark mode is the showcase; light mode is the daylight professional read

## Colors

Cool near-neutrals with a single saturated red. Chromatic interest comes from the
lit 3D objects, not from the interface.

### Primary
- **Signal Red** (`oklch(0.58 0.22 27)`): Every primary action, the active navigation
  state, and the emphasis colour in headings. The user's binding brand colour.
- **Signal Red Deep** (`oklch(0.48 0.21 27)`): Hover and pressed states.
- **Signal Red Soft** (`oklch(0.95 0.04 27)`): Chip and tag backgrounds in light mode.

### Secondary
Used only inside 3D scenes and data visualisation, never as interface chrome.
- **Accent Cyan** (`oklch(0.72 0.13 210)`): Secondary rim light and graph edges.
- **Accent Amber** (`oklch(0.76 0.14 70)`): Warm key light on 3D objects.

### Tertiary
- **Success** (`oklch(0.62 0.15 150)`): Availability status only. Never an action.

### Neutral
- **Ink** (`oklch(0.18 0.014 265)`): Primary text in light mode. Slightly blue-cool.
- **Ink Soft** (`oklch(0.32 0.012 265)`): Secondary headings.
- **Surface** (`oklch(0.985 0.002 265)`): Light page ground.
- **Panel** (`oklch(1 0 0)`): Raised cards in light mode.
- **Hairline** (`oklch(0.90 0.004 265)`): Borders and dividers.
- **Muted Ink** (`oklch(0.52 0.010 265)`): Secondary text.
- **Night** (`oklch(0.16 0.012 265)`): Dark page ground — cool charcoal, never pure black.
- **Night Panel** (`oklch(0.21 0.013 265)`): Raised cards in dark mode.

### Named Rules

**The One Accent Rule.** Red is the only saturated colour in the interface. If a screen
shows a second saturated hue outside a 3D canvas or a tech brand icon, remove it.

**The Cool Neutral Rule.** Neutrals carry a slight blue cast (hue 265). Warm greys and
cream grounds do not belong in this system.

## Typography

**Display Font:** Sora (with Helvetica Neue, Arial fallback)
**Body Font:** Figtree (with Helvetica Neue, Arial fallback)
**Label/Mono Font:** JetBrains Mono

**Character:** Sora is geometric with slightly squared terminals — it reads engineered
rather than decorative, which suits a page whose subject is built objects. Figtree is a
warm geometric workhorse that keeps long paragraphs comfortable. The pairing is modern
without being fashionable.

### Hierarchy
- **Display** (700, `clamp(2.5rem, 7vw, 5.5rem)`, 1.02, -0.035em): The name and one or
  two section openers. Tight tracking is essential at this size.
- **Headline** (700, `clamp(1.75rem, 4vw, 3rem)`, 1.12): Section titles.
- **Title** (600, 1.25rem, 1.3): Card and project titles, role names.
- **Body** (400, 1.0625rem, 1.7): Running prose. Hold the measure at 65–75ch.
- **Label** (600, 0.8125rem, 0.02em): Buttons, chips, metadata, nav items.
- **Data** (JetBrains Mono, 500, 0.8125rem): Dates, durations, counts, versions.

### Named Rules

**The Tight Display Rule.** Display and Headline always carry negative tracking
(-0.025em or tighter). Large type set at default tracking is the single clearest sign
of an unconsidered page.

## Layout

A 1400px max container with 24px gutters on mobile and 48px from `md` up.

Vertical rhythm is 120px between sections on desktop and 80px on mobile, applied
consistently. Within a section, a heading takes more space above it than below so it
binds to the content it introduces.

Content grids are 1 column on mobile, 2 at `md`, 3 at `lg` for project and skill cards.
Long-form text is constrained to roughly 70ch regardless of container width.

3D canvases are full-bleed within their section and capped at 70vh so they never push
the primary action below the fold. Below `md`, interactive 3D degrades to a static
rendered frame or a plain grid, because dragging a canvas on a phone fights the scroll.

## Elevation & Depth

Depth is **soft and ambient**, suggesting a diffusely lit object rather than a card
floating over a desk. Shadows are large, low-opacity and vertically offset; there are
no hard, tight, high-contrast drop shadows anywhere.

In dark mode shadows do almost nothing, so depth there is carried by surface lightness
(Night Panel against Night) plus a 1px top highlight on raised elements.

### Shadow Vocabulary
- **Ambient rest** (`box-shadow: 0 1px 2px rgb(0 0 0 / 0.04), 0 8px 24px rgb(0 0 0 / 0.06)`): Cards and panels at rest.
- **Ambient lift** (`box-shadow: 0 2px 4px rgb(0 0 0 / 0.05), 0 16px 40px rgb(0 0 0 / 0.10)`): Hover state for interactive cards.
- **Action glow** (`box-shadow: 0 8px 24px color-mix(in oklch, var(--primary) 28%, transparent)`): Primary buttons only.

### Named Rules

**The Soft Light Rule.** Shadow blur is always at least 8× the vertical offset. A tight
shadow reads as a sticker; a wide one reads as material.

## Shapes

Rounded throughout. Cards and panels use 24px (`xl`), nested elements step down to 12px
or 8px, and media containers use 16–24px with `overflow-hidden` so images clip to the
curve. Buttons, chips and tags are full pills.

The rule is that radius decreases with element size: a large panel at 24–32px and a
small chip as a pill both read correctly, but a small element at 24px looks broken.

## Components

### Buttons
- **Shape:** Full pill (`9999px`).
- **Primary:** Signal Red fill, white Label text, 16px/28px padding, action glow shadow.
- **Hover / Focus:** Fill to Signal Red Deep, shadow deepens slightly, 1px upward
  translate. Focus draws a 2px ring in Signal Red offset 2px.
- **Secondary:** Transparent with 1px Hairline border and Ink text; hover fills with the
  muted surface. No glow on secondary.

### Chips / Tags
- **Style:** Pill, Signal Red Soft background with Signal Red Deep text in light mode;
  a translucent red wash with light red text in dark mode. No border.
- **Use:** Technology tags and post tags. Not for actions.

### Cards / Containers
- **Corner Style:** 24px (`xl`).
- **Background:** Panel in light, Night Panel in dark.
- **Shadow Strategy:** Ambient rest, moving to ambient lift on hover for interactive cards.
- **Border:** 1px Hairline in light mode; in dark mode a 1px top inner highlight instead.
- **Internal Padding:** 24px, rising to 32px on feature cards.

### Inputs / Fields
- **Style:** 12px radius, 1px Hairline border, Panel background, 12px/16px padding.
- **Focus:** Border becomes Signal Red with a soft 3px red ring at low opacity.
- **Error:** Border and helper text in the destructive red.

### Navigation
Label role, Muted Ink at rest, Ink on hover. The active item sits in a pill of the muted
surface rather than carrying an underline. The bar is translucent with a backdrop blur
and a hairline bottom border. On mobile it becomes a full-height sheet.

### Tech Stack 3D (signature component)
The technology stack rendered as real WebGL geometry: rounded-cube tiles carrying each
technology's brand mark, arranged on a slow orbit and individually hoverable. Lit with a
warm key and a cyan rim so the objects read as physical. Drag to spin, hover to raise and
label. Caps device pixel ratio, pauses when offscreen or hidden, honours
`prefers-reduced-motion` with a still frame, and falls back to a plain icon grid where
WebGL is unavailable or the viewport is below `md`.

## Do's and Don'ts

### Do:
- **Do** keep red as the only saturated interface colour; let the 3D carry the rest.
- **Do** use wide, soft, low-opacity shadows and step radius down with element size.
- **Do** set display and headline type with negative tracking.
- **Do** keep the 120px section rhythm so the page has a steady pulse.
- **Do** give every 3D surface a non-WebGL fallback and a reduced-motion still frame.

### Don't:
- **Don't** use hard tight drop shadows, or shadows in dark mode where lightness works.
- **Don't** introduce a second saturated interface colour or a multi-hue gradient.
- **Don't** use warm greys or cream grounds; neutrals are cool (hue 265).
- **Don't** reintroduce gradient text or animated gradient blobs.
- **Don't** let a 3D canvas push the primary action below the fold.
