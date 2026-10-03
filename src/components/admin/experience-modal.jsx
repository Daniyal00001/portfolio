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

           <div className="space-y-2">
            <Label htmlFor="logo_url">Logo URL</Label>
            <Input
              id="logo_url"
              placeholder="https://..."
              value={formData.logo_url || ""}
              onChange={(e) =>
                setFormData({ ...formData, logo_url: e.target.value })
              }
            />
          </div>

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
