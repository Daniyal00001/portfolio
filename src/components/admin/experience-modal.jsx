"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2 } from "lucide-react";
import { AssetField } from "@/components/admin/asset-field";

export function ExperienceModal({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  isSubmitting,
}) {
  const [formData, setFormData] = useState({
    company: "",
    position: "",
    duration: "",
    location: "",
    type: "Full-time",
    description: "",
    skills: "", // Comma separated string for input
    logo_url: "",
    company_url: "",
    links: [],
    is_development: true,
  });

  useEffect(() => {
    if (open) { // Only update when modal opens
        if (initialData) {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            setFormData({
                ...initialData,
                is_development: initialData.is_development !== false,
                skills: initialData.skills && Array.isArray(initialData.skills) ? initialData.skills.join(", ") : "",
                company_url: initialData.company_url || "",
                links: Array.isArray(initialData.links)
                  ? initialData.links.map((link) => ({ label: link.label || "", url: link.url || "" }))
                  : [],
            });
        } else {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            setFormData({
                company: "",
                position: "",
                duration: "",
                location: "",
                type: "Full-time",
                description: "",
                skills: "",
                logo_url: "",
                company_url: "",
                links: [],
                is_development: true,
            });
        }
    }
  }, [initialData, open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const skillsArray = formData.skills
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s !== "");

    onSubmit({
      ...formData,
      skills: skillsArray,
      company_url: (formData.company_url || "").trim(),
      links: (formData.links || [])
        .map((link) => ({ label: link.label.trim(), url: link.url.trim() }))
        .filter((link) => link.label && link.url),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Experience" : "Add Experience"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                value={formData.position}
                onChange={(e) =>
                  setFormData({ ...formData, position: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                placeholder="e.g. Jan 2024 - Present"
                value={formData.duration}
                onChange={(e) =>
                  setFormData({ ...formData, duration: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Input
                id="type"
                placeholder="Full-time, Contract, etc."
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
            />
          </div>

          <AssetField
            label="Company logo"
            hint="Shown beside this role. Upload a square mark if you can."
            value={formData.logo_url || ""}
            folder="experience"
            onChange={(logo_url) => setFormData({ ...formData, logo_url })}
          />

          <div className="space-y-2">
            <Label htmlFor="skills">Skills (comma separated)</Label>
            <Input
              id="skills"
              placeholder="React, Node.js, TypeScript"
              value={formData.skills}
              onChange={(e) =>
                setFormData({ ...formData, skills: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company_url">Company link</Label>
            <Input
              id="company_url"
              placeholder="https://..."
              value={formData.company_url || ""}
              onChange={(e) =>
                setFormData({ ...formData, company_url: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Bullet links</Label>
            <p className="text-xs text-muted-foreground">
              The label must match the start of a bullet, such as Agents Anywhere or GCU LMS.
            </p>
            <div className="space-y-2">
              {(formData.links || []).map((link, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={link.label}
                    placeholder="Label"
                    aria-label={`Link ${index + 1} label`}
                    onChange={(e) => {
                      const links = [...formData.links]
                      links[index] = { ...link, label: e.target.value }
                      setFormData({ ...formData, links })
                    }}
                  />
                  <Input
                    value={link.url}
                    placeholder="https://..."
                    aria-label={`Link ${index + 1} URL`}
                    onChange={(e) => {
                      const links = [...formData.links]
                      links[index] = { ...link, url: e.target.value }
                      setFormData({ ...formData, links })
                    }}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="shrink-0 text-destructive"
                    aria-label={`Remove link ${index + 1}`}
                    onClick={() =>
                      setFormData({
                        ...formData,
                        links: formData.links.filter((_, i) => i !== index),
                      })
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                setFormData({
                  ...formData,
                  links: [...(formData.links || []), { label: "", url: "" }],
                })
              }
            >
              <Plus className="mr-2 h-4 w-4" /> Add link
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              className="min-h-[140px]"
              placeholder="One bullet per paragraph. Leave a blank line between bullets."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
            />
          </div>

          <div className="flex items-center space-x-2 border p-3 rounded-md bg-muted/30">
            <Checkbox 
              id="is_development" 
              checked={formData.is_development}
              onCheckedChange={(checked) => 
                setFormData({ ...formData, is_development: !!checked })
              }
            />
            <div className="grid gap-1.5 leading-none">
              <Label
                htmlFor="is_development"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Software Development Role
              </Label>
              <p className="text-xs text-muted-foreground">
                Marking this as checked will include this role in your &quot;Years of Experience&quot; calculation.
              </p>
            </div>
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
