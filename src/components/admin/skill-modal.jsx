"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { skillEntries } from "@/lib/skill-entries";
import { SkillPicture } from "@/lib/skill-icons";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";

const emptySkill = () => ({ name: "", image: "" });

export function SkillModal({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  isSubmitting,
}) {
  const [category, setCategory] = useState("");
  const [entries, setEntries] = useState([emptySkill()]);
  const [uploadingIndex, setUploadingIndex] = useState(null);

  useEffect(() => {
    if (!open) return;
    if (initialData) {
      const current = skillEntries(initialData);
      setCategory(initialData.category || "");
      setEntries(current.length ? current : [emptySkill()]);
    } else {
      setCategory("");
      setEntries([emptySkill()]);
    }
  }, [initialData, open]);

  const updateEntry = (index, patch) => {
    setEntries((current) => current.map((entry, i) => (i === index ? { ...entry, ...patch } : entry)));
  };

  const uploadImage = async (index, file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Choose an image file.");
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      toast.error("That file is larger than 15 MB.");
      return;
    }

    const cleanName = file.name.replace(/[^\w.\- ]+/g, "").trim() || "image";
    const path = `skills/${uuidv4()}-${cleanName}`;
    setUploadingIndex(index);
    try {
      const { error } = await supabase.storage.from("portfolio").upload(path, file, {
        contentType: file.type || "application/octet-stream",
        upsert: false,
      });
      if (error) throw error;
      const { data } = supabase.storage.from("portfolio").getPublicUrl(path);
      updateEntry(index, { image: data.publicUrl });
      toast.success("Uploaded. Click Save to publish it.");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Upload failed.");
    } finally {
      setUploadingIndex(null);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const cleaned = entries
      .map((entry) => ({ name: entry.name.trim(), image: entry.image.trim() }))
      .filter((entry) => entry.name);

    if (!cleaned.length) {
      toast.error("Add at least one skill name.");
      return;
    }

    onSubmit({
      category: category.trim(),
      entries: cleaned,
      items: cleaned.map((entry) => entry.name),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Skill Category" : "Add Skill Category"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category name</Label>
            <Input
              id="category"
              placeholder="Languages"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Skills</Label>
            <div className="max-h-[50vh] space-y-2 overflow-y-auto pr-1">
              {entries.map((entry, index) => (
                <div key={index} className="flex items-center gap-2 rounded-lg border border-border bg-muted/20 p-2">
                  <label className="relative flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-md border border-border bg-background">
                    {entry.image || entry.name ? (
                      <SkillPicture name={entry.name || "?"} image={entry.image} className="h-7 w-7" />
                    ) : (
                      <ImagePlus className="h-4 w-4 text-muted-foreground" />
                    )}
                    {uploadingIndex === index && (
                      <span className="absolute inset-0 flex items-center justify-center bg-background/80">
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </span>
                    )}
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
                      className="sr-only"
                      onChange={(event) => {
                        uploadImage(index, event.target.files?.[0]);
                        event.target.value = "";
                      }}
                    />
                  </label>
                  <Input
                    value={entry.name}
                    placeholder="Skill name"
                    aria-label={`Skill ${index + 1} name`}
                    onChange={(event) => updateEntry(index, { name: event.target.value })}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="shrink-0 text-destructive"
                    aria-label={`Remove skill ${index + 1}`}
                    onClick={() => setEntries((current) => current.filter((_, i) => i !== index))}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <Button type="button" variant="outline" onClick={() => setEntries((current) => [...current, emptySkill()])}>
              Add skill
            </Button>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
