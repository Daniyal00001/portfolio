"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Save } from "lucide-react"
import { mergeContent } from "@/lib/site-defaults"

export function SectionCopy({ title, description, fields }) {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [userId, setUserId] = useState(null)
  const [values, setValues] = useState({})

  const fieldKeys = fields.map((field) => field.key).join("|")

  useEffect(() => {
    let cancelled = false
    const keys = fieldKeys.split("|").filter(Boolean)
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        if (!cancelled) setLoading(false)
        return
      }
      const { data } = await supabase.from("profiles").select("content").eq("id", user.id).single()
      if (cancelled) return
      const content = mergeContent(data?.content)
      const next = {}
      keys.forEach((key) => {
        next[key] = content[key] || ""
      })
      setUserId(user.id)
      setValues(next)
      setLoading(false)
    }
    load()
    return () => {
      cancelled = true
    }
  }, [fieldKeys])

  const save = async () => {
    if (!userId) return
    setSaving(true)
    const { data } = await supabase.from("profiles").select("content").eq("id", userId).single()
    const content = { ...(data?.content || {}), ...values }
    const { error } = await supabase.from("profiles").update({ content }).eq("id", userId)
    setSaving(false)
    if (error) alert(error.message)
    else alert("Saved. Refresh the public site to see it.")
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
        <div>
          <CardTitle>{title}</CardTitle>
          {description ? <CardDescription className="mt-1.5">{description}</CardDescription> : null}
        </div>
        <Button type="button" onClick={save} disabled={loading || saving || !userId}>
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Save
        </Button>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        {loading ? (
          <div className="md:col-span-2 flex justify-center py-6">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          fields.map((field) => (
            <div key={field.key} className={field.long ? "md:col-span-2 space-y-2" : "space-y-2"}>
              <Label>{field.label}</Label>
              {field.long ? (
                <Textarea
                  className={field.mono ? "min-h-[180px] font-mono text-sm" : undefined}
                  value={values[field.key] || ""}
                  onChange={(event) => setValues((current) => ({ ...current, [field.key]: event.target.value }))}
                />
              ) : (
                <Input
                  value={values[field.key] || ""}
                  onChange={(event) => setValues((current) => ({ ...current, [field.key]: event.target.value }))}
                />
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
