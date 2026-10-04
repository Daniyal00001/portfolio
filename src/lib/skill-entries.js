export function skillEntries(category) {
  const raw = Array.isArray(category?.entries) && category.entries.length
    ? category.entries
    : category?.items || []

  return raw
    .map((entry) => {
      if (typeof entry === "string") return { name: entry.trim(), image: "" }
      return {
        name: String(entry?.name || "").trim(),
        image: String(entry?.image || "").trim(),
      }
    })
    .filter((entry) => entry.name)
}
