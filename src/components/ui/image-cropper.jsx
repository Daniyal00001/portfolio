"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import Cropper from "react-easy-crop";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RotateCw, Loader2 } from "lucide-react";

export function ImageCropper({
  imageSrc,
  open,
  onOpenChange,
  onCropComplete,
  onCancel,
  loading,
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [aspect, setAspect] = useState(2 / 1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropChange = (crop) => {
    setCrop(crop);
  };

  const onZoomChange = (zoom) => {
    setZoom(zoom);
  };

  const onRotationChange = (rotation) => {
    setRotation(rotation);
  };

  const onCropCompleteCallback = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (error) => reject(error));
      image.setAttribute("crossOrigin", "anonymous"); // needed to avoid cross-origin issues on CodeSandbox
      image.src = url;
    });

  function getRadianAngle(degreeValue) {
    return (degreeValue * Math.PI) / 180;
  }

  /**
   * Returns the new bounding area of a rotated rectangle.
   */
  function rotateSize(width, height, rotation) {
    const rotRad = getRadianAngle(rotation);

    return {
      width:
        Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
      height:
        Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
    };
  }

  /**
   * This function was adapted from the one in the ReadMe of https://github.com/DominicTobias/react-image-crop
   */
  async function getCroppedImg(
    imageSrc,
    pixelCrop,
    rotation = 0,
    flip = { horizontal: false, vertical: false }
  ) {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      return null;
    }

    const rotRad = getRadianAngle(rotation);

    // calculate bounding box of the rotated image
    const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
      image.width,
      image.height,
      rotation
    );

    // set canvas size to match the bounding box
    canvas.width = bBoxWidth;
    canvas.height = bBoxHeight;

    // translate canvas context to a central location to allow rotating and flipping around the center
    ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
    ctx.rotate(rotRad);
    ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
    ctx.translate(-image.width / 2, -image.height / 2);

    // draw rotated image
    ctx.drawImage(image, 0, 0);

    // croppedAreaPixels values are bounding box relative
    // extract the cropped image using these values
    const data = ctx.getImageData(
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height
    );

    // set canvas width to final desired crop size - this will clear existing context
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    // paste generated rotate image at the top left corner
    ctx.putImageData(data, 0, 0);

    // As custom Blob
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
            reject(new Error("Canvas is empty"));
            return;
        }
        blob.name = "cropped.jpeg";
        resolve(blob);
      }, "image/jpeg");
    });
  }

  const handleSave = async () => {
    try {
      const croppedImageBlob = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        rotation
      );
      onCropComplete(croppedImageBlob);
    } catch (e) {
      console.error(e);
      toast.error("Something went wrong cropping the image");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle>Crop Image</DialogTitle>
        </DialogHeader>
        
        <div className="relative flex-1 bg-black w-full overflow-hidden">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={aspect}
            onCropChange={onCropChange}
            onCropComplete={onCropCompleteCallback}
            onZoomChange={onZoomChange}
            onRotationChange={onRotationChange}
          />
        </div>

        <div className="p-6 space-y-4 bg-background border-t">
          <div className="flex items-center gap-4">
            <div className="flex-1 space-y-1">
                <Label>Zoom</Label>
                <Slider
                    value={[zoom]}
                    min={1}
                    max={3}
                    step={0.1}
                    onValueChange={(vals) => setZoom(vals[0])}
                />
            </div>
            <div className="flex-1 space-y-1">
                <Label>Rotation</Label>
                <Slider
                    value={[rotation]}
                    min={0}
                    max={360}
                    step={1}
                    onValueChange={(vals) => setRotation(vals[0])}
                />
            </div>
             <Button variant="outline" size="icon" onClick={() => setRotation((r) => r + 90)}>
                <RotateCw className="h-4 w-4" />
             </Button>
          </div>

          <div className="flex items-center justify-between">
            <div className="w-[200px]">
                <Label className="mb-2 block">Aspect Ratio</Label>
                <Select
                    value={aspect ? aspect.toString() : "free"}
                    onValueChange={(val) => setAspect(val === "free" ? undefined : parseFloat(val))}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select ratio" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="free">Free</SelectItem>
                        <SelectItem value={(2.4).toString()}>Ultra-Wide (2.4:1)</SelectItem>
                        <SelectItem value={(2).toString()}>Wide (2:1)</SelectItem>
                        <SelectItem value={(16/9).toString()}>16:9 (Landscape)</SelectItem>
                        <SelectItem value={(4/3).toString()}>4:3 (Standard)</SelectItem>
                        <SelectItem value={(1).toString()}>1:1 (Square)</SelectItem>
                        <SelectItem value={(9/16).toString()}>9:16 (Portrait)</SelectItem>
                        <SelectItem value={(3/4).toString()}>3:4 (Portrait)</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="flex gap-2 items-end">
                 <Button variant="outline" onClick={onCancel} disabled={loading}>
                    Cancel
                 </Button>
                 <Button onClick={handleSave} disabled={loading}>
                    {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    {loading ? "Saving..." : "Crop & Save"}
                 </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
