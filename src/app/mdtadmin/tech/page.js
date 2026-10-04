"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { v4 as uuidv4 } from "uuid"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { skillEntries } from "@/lib/skill-entries"
import { SkillPicture } from "@/lib/skill-icons"
import { ImageCropper } from "@/components/ui/image-cropper"
import { Loader2 } from "lucide-react"

const LOGO_SIZE = 256

function flatten(categories) {
  return categories.flatMap((category) =>
    skillEntries(category).map((entry, index) => ({
      key: `${category.id}-${index}`,
      categoryId: category.id,
      category: category.category,
      index,
      name: entry.name,
      image: entry.image,
    }))
  )
}

async function squareBlob(blob) {
  const url = URL.createObjectURL(blob)
  try {
    const image = await new Promise((resolve, reject) => {
      const element = new Image()
      element.onload = () => resolve(element)
      element.onerror = reject
      element.src = url
    })
    const canvas = document.createElement("canvas")
    canvas.width = LOGO_SIZE
    canvas.height = LOGO_SIZE
    const context = canvas.getContext("2d")
    context.clearRect(0, 0, LOGO_SIZE, LOGO_SIZE)
    context.drawImage(image, 0, 0, LOGO_SIZE, LOGO_SIZE)
    const squared = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"))
    return squared || blob
  } finally {
    URL.revokeObjectURL(url)
  }
}

export default function TechRowPage() {
  const [categories, setCategories] = useState([])
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [savingKey, setSavingKey] = useState(null)
  const [cropSrc, setCropSrc] = useState("")
  const [cropKey, setCropKey] = useState(null)

  const load = async () => {
    setLoading(true)
    const { data, error } = await supabase.from("skills").select("*").order("id", { ascending: true })
    if (error) {
      console.error(error)
      toast.error("Could not load the tech row.")
    } else {
      const rows = data || []
      setCategories(rows)
      setItems(flatten(rows))
    }
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const updateItem = (key, patch) => {
    setItems((current) => current.map((item) => (item.key === key ? { ...item, ...patch } : item)))
  }

  const saveItem = async (item) => {
    const name = item.name.trim()
    if (!name) {
      toast.error("Enter a name.")
      return
    }
    const category = categories.find((row) => row.id === item.categoryId)
    if (!category) return

    const entries = skillEntries(category).map((entry, index) =>
      index === item.index ? { name, image: item.image } : { name: entry.name, image: entry.image }
    )

    setSavingKey(item.key)
    const { error } = await supabase
      .from("skills")
      .update({ entries, items: entries.map((entry) => entry.name) })
      .eq("id", item.categoryId)
    setSavingKey(null)

    if (error) {
      toast.error(error.message || "Could not save.")
      return
    }

    setCategories((current) =>
      current.map((row) => (row.id === item.categoryId ? { ...row, entries, items: entries.map((entry) => entry.name) } : row))
    )
    updateItem(item.key, { name })
    toast.success("Saved.")
  }

  const startCrop = (key, file) => {
    if (!file) return
    if (!file.type.startsWith("image/")) {
      toast.error("Choose an image file.")
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      setCropKey(key)
      setCropSrc(String(reader.result || ""))
    }
    reader.readAsDataURL(file)
  }

  const uploadCrop = async (blob) => {
    const item = items.find((entry) => entry.key === cropKey)
    if (!item) return
    setSavingKey(item.key)
    try {
      const squared = await squareBlob(blob)
      const path = `skills/${uuidv4()}.png`
      const { error } = await supabase.storage.from("portfolio").upload(path, squared, {
        contentType: "image/png",
        upsert: false,
      })
      if (error) throw error
      const { data } = supabase.storage.from("portfolio").getPublicUrl(path)
      const next = { ...item, image: data.publicUrl }
      updateItem(item.key, { image: data.publicUrl })
      setCropSrc("")
      setCropKey(null)
      await saveItem(next)
    } catch (error) {
      console.error(error)
      toast.error(error.message || "Upload failed.")
      setSavingKey(null)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-charcoal-blue dark:text-verdigris">Tech row</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          These cards are the moving row above Technical Expertise. Every logo is cropped to a square and saved at {LOGO_SIZE}×{LOGO_SIZE}, then shown at the same size.
        </p>
      </div>

      {items.length === 0 ? (
        <p className="rounded-lg border border-dashed py-12 text-center text-muted-foreground">
          Add skills first. They show up here.
        </p>
      ) : (
        <div className="flex flex-wrap gap-4">
          {items.map((item) => (
            <div
              key={item.key}
              className="flex h-52 w-44 shrink-0 flex-col items-center gap-3 rounded-md border border-primary/35 bg-card px-3 py-4 text-center"
            >
              <label className="relative flex h-12 w-12 cursor-pointer items-center justify-center">
                <SkillPicture name={item.name} image={item.image} className="h-12 w-12" />
                {savingKey === item.key && (
                  <span className="absolute inset-0 flex items-center justify-center rounded-md bg-background/80">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </span>
                )}
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
                  className="sr-only"
                  onChange={(event) => {
                    startCrop(item.key, event.target.files?.[0])
                    event.target.value = ""
                  }}
                />
              </label>
              <Input
                value={item.name}
                aria-label={`${item.category} skill name`}
                onChange={(event) => updateItem(item.key, { name: event.target.value })}
                className="h-8 text-center text-sm"
              />
              <p className="line-clamp-1 text-[10px] uppercase tracking-wider text-muted-foreground">{item.category}</p>
              <Button type="button" size="sm" variant="outline" className="mt-auto w-full" disabled={savingKey === item.key} onClick={() => saveItem(item)}>
                Save
              </Button>
            </div>
          ))}
        </div>
      )}

      <ImageCropper
        imageSrc={cropSrc}
        open={Boolean(cropSrc)}
        defaultAspect={1}
        loading={Boolean(savingKey)}
        onOpenChange={(open) => {
          if (!open) {
            setCropSrc("")
            setCropKey(null)
          }
        }}
        onCancel={() => {
          setCropSrc("")
          setCropKey(null)
        }}
        onCropComplete={uploadCrop}
      />
    </div>
  )
}
