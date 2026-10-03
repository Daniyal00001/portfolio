"use client"

import { useEffect, useRef } from "react"

// Records one view per page visit, then reports how long the reader stayed and how
// far they scrolled. Everything is sent to our own endpoint; no third-party script,
// no cookies, and the visitor key is hashed server-side from IP and user agent.
export function PostAnalytics({ slug }) {
  const sessionId = useRef(null)
  const startedAt = useRef(Date.now())
  const maxScroll = useRef(0)
  const reported = useRef(false)

  useEffect(() => {
    if (!slug) return

    sessionId.current =
      globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`
    startedAt.current = Date.now()

    const payload = () => ({
      slug,
      sessionId: sessionId.current,
      referrer: document.referrer || null,
      durationSeconds: Math.round((Date.now() - startedAt.current) / 1000),
      scrollPercent: maxScroll.current,
    })

    // Initial view.
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload(), durationSeconds: 0, scrollPercent: 0 }),
      keepalive: true,
    }).catch(() => {})

    const onScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      if (scrollable <= 0) {
        maxScroll.current = 100
        return
      }
      const percent = Math.round((window.scrollY / scrollable) * 100)
      if (percent > maxScroll.current) maxScroll.current = Math.min(percent, 100)
    }

    // sendBeacon survives the page unloading, which a normal fetch often does not.
    const report = () => {
      if (reported.current) return
      reported.current = true
      const body = JSON.stringify(payload())
      if (navigator.sendBeacon) {
        navigator.sendBeacon("/api/track", new Blob([body], { type: "application/json" }))
      } else {
        fetch("/api/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body,
          keepalive: true,
        }).catch(() => {})
      }
    }

    const onHidden = () => {
      if (document.visibilityState === "hidden") report()
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    document.addEventListener("visibilitychange", onHidden)
    window.addEventListener("pagehide", report)

    return () => {
      window.removeEventListener("scroll", onScroll)
      document.removeEventListener("visibilitychange", onHidden)
      window.removeEventListener("pagehide", report)
      report()
    }
  }, [slug])

  return null
}

export default PostAnalytics
