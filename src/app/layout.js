import { Sora, Figtree, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import LayoutWrapper from "@/components/layout-wrapper";
import { JsonLd } from "@/components/json-ld";
import { Toaster } from "@/components/ui/sonner";

// Sora is geometric with squared terminals — it reads engineered rather than
// decorative, which suits a page whose subject is built objects. Figtree keeps long
// prose comfortable underneath it.
const sora = Sora({
  variable: "--ff-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const figtree = Figtree({
  variable: "--ff-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--ff-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

import { createClient } from "@supabase/supabase-js";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const PROFILE_IMAGE = `${SITE_URL}/assets/images/profile.jpg`;

// Initialize Supabase Client for Server Side
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function getProfile() {
  try {
    const { data } = await supabase.from("profiles").select("*").single();
    return data;
  } catch (error) {
    console.error("Error fetching profile for SEO:", error);
    return null;
  }
}

export async function generateMetadata() {
  const profile = await getProfile();

  const title = profile?.name
    ? `${profile.name} — ${profile.role || "Software Engineer"}`
    : "Muhammad Daniyal Tallat — Full Stack Software Engineer";

  const description =
    profile?.summary ||
    "Muhammad Daniyal Tallat — Full Stack Software Engineer. Production experience across frontend, backend, databases, APIs, and cloud deployments.";

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: title,
      template: "%s | Daniyal Tallat",
    },
    description: description,
    keywords: [
      profile?.name || "Muhammad Daniyal Tallat",
      "Daniyal Tallat",
      "full stack software engineer",
      "software engineer Pakistan",
      "web developer Pakistan",
      "React developer",
      "Next.js developer",
      "TypeScript developer",
    ],
    authors: [{ name: profile?.name || "Muhammad Daniyal Tallat", url: SITE_URL }],
    creator: profile?.name || "Muhammad Daniyal Tallat",
    publisher: profile?.name || "Muhammad Daniyal Tallat",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: SITE_URL,
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: SITE_URL,
      siteName: `${profile?.name || "Muhammad Daniyal Tallat"} — Developer Portfolio`,
      title: title,
      description: description,
      images: [
        {
          url: profile?.image_url || PROFILE_IMAGE,
          width: 800,
          height: 800,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: [profile?.image_url || PROFILE_IMAGE],
      creator: profile?.name || "Muhammad Daniyal Tallat",
    },
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/assets/mylogo/MFI-Black.png", media: "(prefers-color-scheme: light)", sizes: "any", type: "image/png" },
        { url: "/assets/mylogo/MFI-White.png", media: "(prefers-color-scheme: dark)", sizes: "any", type: "image/png" },
      ],
      apple: [
        { url: "/assets/mylogo/MFI-Black.png", sizes: "180x180", type: "image/png" }
      ],
    },
    manifest: "/manifest.json",
    category: "technology",
  };
}

export default async function RootLayout({ children }) {
  const profile = await getProfile();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <JsonLd profile={profile} />
      </head>
      <body className={`${sora.variable} ${figtree.variable} ${jetbrainsMono.variable} antialiased body min-h-screen flex flex-col`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <LayoutWrapper>{children}</LayoutWrapper>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
