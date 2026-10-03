"use client"

import { useCallback, useEffect, useRef } from "react"
import { usePathname, useRouter } from "next/navigation"
import { toast } from "sonner"

import { supabase } from "@/lib/supabase"

// Absolute session lifetime. Supabase keeps refreshing tokens indefinitely by
// default, so without this cap an admin session never ends.
const MAX_SESSION_MS = 2 * 24 * 60 * 60 * 1000 // 2 days
const WARN_BEFORE_MS = 60 * 60 * 1000 // warn in the final hour
const CHECK_INTERVAL_MS = 60 * 1000

export function SessionGuard() {
  const router = useRouter()
  const pathname = usePathname()
  const warned = useRef(false)

  const expire = useCallback(
    async (message) => {
      await supabase.auth.signOut()
      toast.error(message)
      router.replace("/mdtadmin/login")
    },
    [router]
  )

  const check = useCallback(async () => {
    const { data, error } = await supabase.auth.getUser()
    const user = data?.user
    if (error || !user) return

    // last_sign_in_at comes from the auth server, so this cannot be extended by
    // editing anything in the browser.
    const signedInAt = user.last_sign_in_at ? new Date(user.last_sign_in_at).getTime() : null
    if (!signedInAt || Number.isNaN(signedInAt)) return

    const age = Date.now() - signedInAt
    const remaining = MAX_SESSION_MS - age

    if (remaining <= 0) {
      await expire("Session expired after 2 days. Please sign in again.")
      return
    }

    if (remaining <= WARN_BEFORE_MS && !warned.current) {
      warned.current = true
      const minutes = Math.max(1, Math.round(remaining / 60000))
      toast.warning(`Session ends in about ${minutes} minute${minutes === 1 ? "" : "s"}.`, {
        description: "Sign in again to keep working.",
      })
    }
  }, [expire])

  useEffect(() => {
    if (pathname === "/mdtadmin/login") return

    check()
    const interval = setInterval(check, CHECK_INTERVAL_MS)

    // A tab left open in the background should be re-checked the moment it returns.
    const onVisible = () => {
      if (document.visibilityState === "visible") check()
    }
    document.addEventListener("visibilitychange", onVisible)

    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") warned.current = false
      if (event === "TOKEN_REFRESHED") check()
    })

    return () => {
      clearInterval(interval)
      document.removeEventListener("visibilitychange", onVisible)
      sub?.subscription?.unsubscribe()
    }
  }, [pathname, check])

  return null
}

export default SessionGuard
