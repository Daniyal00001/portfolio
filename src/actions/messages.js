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

  try {
    await emailOwner({ name: cleanName, email: cleanEmail, message: cleanMessage })
  } catch (emailError) {
    console.error("Contact email failed:", emailError)
  }

  return { success: true }
}

// Resend's free test sender can only deliver to the address on the Resend account.
// Sign up with the same inbox as ADMIN_EMAIL, then set RESEND_API_KEY on Vercel.
async function emailOwner({ name, email, message }) {
  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.ADMIN_EMAIL || "daniyaltallat0@gmail.com"
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set, so the contact email was not sent.")
    return
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Portfolio <onboarding@resend.dev>",
      to: [to],
      reply_to: email,
      subject: `New message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    }),
  })

  if (!response.ok) {
    console.error("Contact email failed:", response.status, await response.text())
  }
}
