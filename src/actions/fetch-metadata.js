"use server";

import { unstable_noStore as noStore } from "next/cache";

export async function fetchMetadata(url) {
  noStore(); // Disable caching for this action

  if (!url) return { error: "URL is required" };

  try {
    const isYouTube = url.includes("youtube.com") || url.includes("youtu.be");

    if (isYouTube) {
      // Use noembed.com for easy YouTube metadata
      const response = await fetch(`https://noembed.com/embed?url=${url}`);
      const data = await response.json();

      if (data.error) throw new Error(data.error);

      // YouTube noembed doesn't provide the upload date.
      // We return what we have.
      return {
        title: data.title,
        description: data.author_name ? `Video by ${data.author_name}` : "",
        thumbnail_url: data.thumbnail_url,
        type: "youtube",
        date: new Date().toISOString().split("T")[0], // Fallback to today
      };
    } else {
      // Generic scraping for OG tags
      const response = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
      });
      const html = await response.text();

      // Simple regex to find meta tags.
      const getMeta = (prop) => {
        const patterns = [
          new RegExp(`<meta property="${prop}" content="([^"]*)"`, "i"),
          new RegExp(`<meta name="${prop}" content="([^"]*)"`, "i"),
          new RegExp(`<meta itemProp="${prop}" content="([^"]*)"`, "i"),
        ];

        for (const pattern of patterns) {
          const match = html.match(pattern);
          if (match) return match[1];
        }
        return "";
      };

      const getTitle = () => {
        const ogTitle = getMeta("og:title") || getMeta("twitter:title");
        if (ogTitle) return ogTitle;
        const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
        return titleMatch ? titleMatch[1] : "";
      };

      const title = getTitle();
      const description = getMeta("og:description") || getMeta("description") || getMeta("twitter:description");
      const thumbnail_url = getMeta("og:image") || getMeta("twitter:image");

      // Try to find a publish date
      let dateString =
        getMeta("article:published_time") || getMeta("date") || getMeta("pubdate") || getMeta("publish-date") || getMeta("DC.date.issued");

      let date = new Date().toISOString().split("T")[0];
      if (dateString) {
        try {
          const parsedDate = new Date(dateString);
          if (!isNaN(parsedDate.getTime())) {
            date = parsedDate.toISOString().split("T")[0];
          }
        } catch (e) {
          console.error("Error parsing date:", e);
        }
      }

      return {
        title: title || url,
        description: description || "",
        thumbnail_url: thumbnail_url || "",
        type: "article",
        date: date,
      };
    }
  } catch (error) {
    console.error("Error fetching metadata:", error);
    return { error: "Failed to fetch metadata. Please enter details manually." };
  }
}
