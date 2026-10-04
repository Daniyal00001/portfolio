"use client"

import { useRef, useState } from "react"
import { supabase } from "@/lib/supabase"
import { v4 as uuidv4 } from "uuid"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FileText, Loader2, Upload, X } from "lucide-react"

const ACCEPT = {
  image: "image/png,image/jpeg,image/webp,image/gif,image/svg+xml",
  pdf: "application/pdf",
}

export function AssetField({ label, hint, value, onChange, kind = "image", folder = "about" }) {
  const inputRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [showLink, setShowLink] = useState(false)
  const [link, setLink] = useState("")

  const upload = async (file) => {
    if (!file) return
    const allowed = kind === "pdf" ? file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf") : file.type.startsWith("image/")
    if (!allowed) {
      toast.error(kind === "pdf" ? "Choose a PDF file." : "Choose an image file.")
      return
    }
    if (file.size > 15 * 1024 * 1024) {
      toast.error("That file is larger than 15 MB.")
      return
    }

    const cleanName = file.name.replace(/[^\w.\- ]+/g, "").trim() || (kind === "pdf" ? "file.pdf" : "image")
    const path = `${folder}/${uuidv4()}-${cleanName}`
    setUploading(true)
    try {
      const { error } = await supabase.storage.from("portfolio").upload(path, file, {
        contentType: file.type || (kind === "pdf" ? "application/pdf" : "application/octet-stream"),
        upsert: false,
      })
      if (error) throw error
      const { data } = supabase.storage.from("portfolio").getPublicUrl(path)
      onChange(data.publicUrl)
      toast.success("Uploaded. Click Save to publish it.")
    } catch (error) {
      console.error(error)
      toast.error(error.message || "Upload failed.")
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  const fileName = value ? decodeURIComponent(String(value).split("/").pop() || "") : ""

  return (
    <div className="space-y-3">
      <div>
        <Label>{label}</Label>
        {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
      </div>

      {value ? (
        <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-3">
          {kind === "pdf" ? (
            <FileText className="h-8 w-8 shrink-0 text-primary" />
          ) : (
            <img src={value} alt="" className="h-16 w-16 shrink-0 rounded-md border border-border bg-background object-contain" />
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{fileName}</p>
            <a href={value} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline">
              Open current file
            </a>
          </div>
          <Button type="button" variant="ghost" size="icon" onClick={() => onChange("")} aria-label={`Remove ${label}`}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : null}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT[kind]}
        className="hidden"
        onChange={(event) => upload(event.target.files?.[0])}
      />

      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" disabled={uploading} onClick={() => inputRef.current?.click()}>
          {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
          {value ? "Replace" : "Upload"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => setShowLink((open) => !open)}>
          Paste a link instead
        </Button>
      </div>

      {showLink && (
        <div className="flex gap-2">
          <Input
            value={link}
            placeholder={kind === "pdf" ? "https://…/file.pdf" : "https://…/image.png"}
            onChange={(event) => setLink(event.target.value)}
          />
          <Button
            type="button"
            onClick={() => {
              if (!link.trim()) return
              onChange(link.trim())
              setLink("")
              setShowLink(false)
            }}
          >
            Use link
          </Button>
        </div>
      )}
    </div>
  )
}
