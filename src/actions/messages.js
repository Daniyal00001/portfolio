"use server"

import { createClient } from "@supabase/supabase-js"

function admin() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SECRET_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

export async function sendContactMessage({ name, email, message }) {
  const cleanName = String(name || "").trim()
  const cleanEmail = String(email || "").trim().toLowerCase()
  const cleanMessage = String(message || "").trim()

  if (cleanName.length < 1 || cleanName.length > 120) {
    return { success: false, error: "Enter your name." }
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail) || cleanEmail.length > 200) {
    return { success: false, error: "Enter a valid email address." }
  }
  if (cleanMessage.length < 1 || cleanMessage.length > 5000) {
    return { success: false, error: "Enter a message." }
  }

  const { error } = await admin().from("messages").insert({
    name: cleanName,
    email: cleanEmail,
    message: cleanMessage,
    is_read: false,
  })

  if (error) {
    console.error("Failed to store contact message:", error.message)
    return { success: false, error: "Could not send your message. Please try again." }
  }

  return { success: true }
}
