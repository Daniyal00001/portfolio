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

export function SkillModal({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  isSubmitting,
}) {
  const [formData, setFormData] = useState({
    category: "",
    items: "", // Comma separated string for input
  });

  useEffect(() => {
    if (open) {
      if (initialData) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        setFormData({
          category: initialData.category,
          items: initialData.items ? initialData.items.join(", ") : "",
        });
      } else {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        setFormData({
          category: "",
          items: "",
        });
      }
    }
  }, [initialData, open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const itemsArray = formData.items
      .split(",")
      .map((i) => i.trim())
      .filter((i) => i !== "");

    onSubmit({
      ...formData,
      items: itemsArray,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Skill Category" : "Add Skill Category"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category Name</Label>
            <Input
              id="category"
              placeholder="e.g. Languages, Frameworks"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="items">Skills (comma separated)</Label>
            <Input
              id="items"
              placeholder="React, Next.js, Node.js"
              value={formData.items}
              onChange={(e) =>
                setFormData({ ...formData, items: e.target.value })
              }
              required
            />
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
