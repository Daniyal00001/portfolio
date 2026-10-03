"use client";

import { useEffect, useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { MediaUploader } from "@/components/admin/media-uploader";

export function ProjectModal({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  isSubmitting,
}) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    tech: "", // Comma separated string for input
    github_url: "",
    live_url: "",
    featured: false,
    year: "",
    images: [], // Support multiple images
  });

  useEffect(() => {
    if (open) {
      if (initialData) {

        // eslint-disable-next-line
        setFormData({
          ...initialData,
          tech: initialData.tech ? initialData.tech.join(", ") : "",
          images: initialData.images || (initialData.image_url ? [initialData.image_url] : []),
        });
      } else {


        setFormData({
          name: "",
          description: "",
          tech: "",
          github_url: "",
          live_url: "",
          featured: false,
          year: new Date().getFullYear().toString(),
          images: [],
        });
      }
    }
  }, [initialData, open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const techArray = formData.tech
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t !== "");

    onSubmit({
      ...formData,
      tech: techArray,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Project" : "Add Project"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Project Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              className="min-h-[100px]"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tech">Technologies (comma separated)</Label>
            <Input
              id="tech"
              placeholder="Next.js, Tailwind, Supabase"
              value={formData.tech}
              onChange={(e) =>
                setFormData({ ...formData, tech: e.target.value })
              }
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="github_url">GitHub URL</Label>
              <Input
                id="github_url"
                placeholder="https://github.com/..."
                value={formData.github_url || ""}
                onChange={(e) =>
                  setFormData({ ...formData, github_url: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="live_url">Live URL</Label>
              <Input
                id="live_url"
                placeholder="https://..."
                value={formData.live_url || ""}
                onChange={(e) =>
                  setFormData({ ...formData, live_url: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                value={formData.year}
                onChange={(e) =>
                  setFormData({ ...formData, year: e.target.value })
                }
              />
            </div>
            {/* Empty column or move Featured here if desired */}
          </div>

          <div className="space-y-2">
             <MediaUploader
               value={formData.images}
               onChange={(urls) => setFormData({ ...formData, images: urls })}
             />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="featured"
              checked={formData.featured}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, featured: !!checked })
              }
            />
            <Label
              htmlFor="featured"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Featured Project
            </Label>
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
