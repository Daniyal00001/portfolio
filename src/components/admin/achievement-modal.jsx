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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchMetadata } from "@/actions/fetch-metadata";
import { Loader2, Wand2 } from "lucide-react";
import { toast } from "sonner";

export function AchievementModal({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  isSubmitting,
}) {
  const [fetching, setFetching] = useState(false);
  const [formData, setFormData] = useState({
    type: "youtube",
    url: "",
    title: "",
    description: "",
    thumbnail_url: "",
    date: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    if (open) {
      if (initialData) {
        setFormData({
          ...initialData,
          date: initialData.date ? new Date(initialData.date).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
        });
      } else {
        setFormData({
          type: "youtube",
          url: "",
          title: "",
          description: "",
          thumbnail_url: "",
          date: new Date().toISOString().split("T")[0],
        });
      }
    }
  }, [initialData, open]);

  const handleFetchInfo = async () => {
    if (!formData.url) {
      toast.error("Please enter a URL first.");
      return;
    }

    setFetching(true);
    try {
      const metadata = await fetchMetadata(formData.url);
      if (metadata.error) {
        toast.error(metadata.error);
      } else {
        setFormData((prev) => ({
          ...prev,
          title: metadata.title || prev.title,
          description: metadata.description || prev.description,
          thumbnail_url: metadata.thumbnail_url || prev.thumbnail_url,
          type: metadata.type || prev.type,
          date: metadata.date || prev.date,
        }));
        toast.success("Metadata fetched successfully!");
      }
    } catch (error) {
      toast.error("Failed to fetch metadata.");
      console.error(error);
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Achievement" : "Add Achievement"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select
                value={formData.type}
                onValueChange={(val) => setFormData({ ...formData, type: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="youtube">YouTube Interview</SelectItem>
                  <SelectItem value="article">Article / Blog</SelectItem>
                  <SelectItem value="news">News Feature</SelectItem>
                  <SelectItem value="award">Award</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <div className="flex gap-2">
              <Input
                id="url"
                placeholder="https://youtube.com/... or https://medium.com/..."
                value={formData.url}
                onChange={(e) =>
                  setFormData({ ...formData, url: e.target.value })
                }
                required
              />
              <Button
                type="button"
                variant="secondary"
                onClick={handleFetchInfo}
                disabled={fetching || !formData.url}
              >
                {fetching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4 mr-2" />}
                Auto-Fill
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              className="min-h-[80px]"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="thumbnail_url">Thumbnail URL</Label>
            <Input
              id="thumbnail_url"
              value={formData.thumbnail_url}
              onChange={(e) =>
                setFormData({ ...formData, thumbnail_url: e.target.value })
              }
            />
            {formData.thumbnail_url && (
              <div className="mt-2 relative aspect-video w-40 rounded-md overflow-hidden border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={formData.thumbnail_url} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
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
