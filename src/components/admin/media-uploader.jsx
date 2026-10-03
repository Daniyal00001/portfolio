/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { useDropzone } from "react-dropzone";
import { supabase } from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, UploadCloud, X, Image as ImageIcon, Link as LinkIcon, Edit } from "lucide-react";
import { ImageCropper } from "@/components/ui/image-cropper";

export function MediaUploader({ value, onChange, bucketName = "portfolio", label = "Project Images" }) {
  const [tab, setTab] = useState("upload");
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [fileToCrop, setFileToCrop] = useState(null);
  const [cropperOpen, setCropperOpen] = useState(false);

  // Ensure value is always an array
  const images = Array.isArray(value) ? value : (value ? [value] : []);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setFileToCrop(reader.result);
        setCropperOpen(true);
      });
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".png", ".jpg", ".webp"],
    },
    maxFiles: 1,
  });

  const uploadFile = async (blob) => {
    setUploading(true);
    try {
      const filename = `${uuidv4()}.jpeg`;
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filename, blob, {
          contentType: "image/jpeg",
          upsert: false,
        });

      if (error) throw error;

      const { data: publicData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filename);

      const newUrl = publicData.publicUrl;
      const updatedImages = [...images, newUrl];
      onChange(updatedImages);
      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error(error.message || "Failed to upload image.");
    } finally {
      setUploading(false);
      setFileToCrop(null);
      setCropperOpen(false);
    }
  };

  const handleUrlSubmit = () => {
    if (urlInput) {
      const updatedImages = [...images, urlInput];
      onChange(updatedImages);
      setUrlInput("");
      toast.success("Image URL added!");
    }
  };

  const removeImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    onChange(updatedImages);
  };

  const moveImage = (index, direction) => {
    const updatedImages = [...images];
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= images.length) return;
    [updatedImages[index], updatedImages[newIndex]] = [updatedImages[newIndex], updatedImages[index]];
    onChange(updatedImages);
  };

  return (
    <div className="space-y-4">
      <Label>{label} ({images.length})</Label>
      
      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          {images.map((img, index) => (
            <div key={index} className="relative rounded-lg overflow-hidden border border-border group bg-muted aspect-[2/1] flex items-center justify-center">
              <img 
                src={img} 
                alt={`Preview ${index + 1}`} 
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                <Button 
                  variant="secondary" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => moveImage(index, -1)}
                  disabled={index === 0}
                >
                  <UploadCloud className="h-4 w-4 rotate-180" />
                </Button>
                <Button 
                  variant="secondary" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => moveImage(index, 1)}
                  disabled={index === images.length - 1}
                >
                  <UploadCloud className="h-4 w-4" />
                </Button>
                <Button 
                  variant="destructive" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => removeImage(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="absolute bottom-1 left-2 bg-black/50 px-1.5 rounded text-[10px] text-white">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      <Tabs defaultValue="upload" value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload"><UploadCloud className="h-4 w-4 mr-2"/> Upload</TabsTrigger>
          <TabsTrigger value="url"><LinkIcon className="h-4 w-4 mr-2"/> URL</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload" className="mt-4">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
              ${isDragActive ? "border-primary bg-primary/10" : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50"}
            `}
          >
            <input {...getInputProps()} />
            {uploading ? (
              <div className="flex flex-col items-center justify-center py-2">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Uploading...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-2 gap-2">
                <div className="p-2 bg-muted rounded-full">
                  <ImageIcon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="text-sm font-medium">Add another image</div>
                <p className="text-xs text-muted-foreground">PNG, JPG, WEBP</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="url" className="mt-4 space-y-4">
          <div className="flex gap-2">
            <Input 
              placeholder="https://example.com/image.jpg" 
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleUrlSubmit())}
            />
            <Button onClick={handleUrlSubmit} type="button">Add</Button>
          </div>
        </TabsContent>
      </Tabs>

      {fileToCrop && (
        <ImageCropper
          open={cropperOpen}
          onOpenChange={setCropperOpen}
          imageSrc={fileToCrop}
          onCropComplete={async (blob) => {
            await uploadFile(blob);
          }}
          loading={uploading}
          onCancel={() => {
            setCropperOpen(false);
            setFileToCrop(null);
          }}
        />
      )}
    </div>
  );
}
