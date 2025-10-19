import { useState, useRef } from "react";
import { Button } from "./ui/button";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface ImageUploadProps {
  currentImage?: string | null;
  onUploadComplete: (url: string) => void;
  bucket: "avatars" | "venue-images";
  folder?: string;
  maxSizeMB?: number;
  shape?: "circle" | "square";
  label?: string;
}

export const ImageUpload = ({
  currentImage,
  onUploadComplete,
  bucket,
  folder,
  maxSizeMB = bucket === "avatars" ? 5 : 10,
  shape = "square",
  label = "Upload Image",
}: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPG, PNG, or WebP image.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size
    const maxSize = maxSizeMB * 1024 * 1024;
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: `Please upload an image smaller than ${maxSizeMB}MB.`,
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Generate unique filename
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      
      // Create path based on bucket type
      let filePath: string;
      if (bucket === "avatars") {
        filePath = `${user?.id}/${fileName}`;
      } else {
        filePath = folder ? `${folder}/${fileName}` : fileName;
      }

      // Upload to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      onUploadComplete(urlData.publicUrl);

      toast({
        title: "Upload successful! ✨",
        description: "Your image has been uploaded.",
      });
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
      setPreview(currentImage || null);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
        disabled={uploading}
      />

      {preview ? (
        <div className="relative inline-block">
          <img
            src={preview}
            alt="Preview"
            className={`w-40 h-40 object-cover border-2 border-border ${
              shape === "circle" ? "rounded-full" : "rounded-lg"
            }`}
          />
          {!uploading && (
            <Button
              variant="destructive"
              size="icon"
              className="absolute -top-2 -right-2 h-8 w-8 rounded-full"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      ) : (
        <div
          className={`w-40 h-40 border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors ${
            shape === "circle" ? "rounded-full" : "rounded-lg"
          }`}
          onClick={() => fileInputRef.current?.click()}
        >
          <ImageIcon className="w-12 h-12 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground text-center px-2">
            Click to upload
          </p>
        </div>
      )}

      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="gap-2"
        >
          {uploading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              {label}
            </>
          )}
        </Button>
      </div>

      <p className="text-xs text-muted-foreground">
        Supported: JPG, PNG, WebP. Max size: {maxSizeMB}MB
      </p>
    </div>
  );
};
