"use client";

import { useId, useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, LoaderCircle, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ImageDropInputProps {
  name: string;
  initialValue?: string;
  value?: string;
  onChange?: (nextValue: string) => void;
  aspectClassName?: string;
  emptyLabel?: string;
  className?: string;
}

export function ImageDropInput({
  name,
  initialValue = "",
  value,
  onChange,
  aspectClassName = "aspect-[16/9]",
  emptyLabel = "Drop an image here or choose a file",
  className,
}: ImageDropInputProps) {
  const inputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [internalValue, setInternalValue] = useState(initialValue);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const currentValue = value ?? internalValue;

  function setValue(nextValue: string) {
    if (value === undefined) {
      setInternalValue(nextValue);
    }

    onChange?.(nextValue);
  }

  async function uploadFile(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("kind", "media");
    formData.append("altEn", "");
    formData.append("altPl", "");

    setIsUploading(true);

    try {
      const response = await fetch("/api/uploads", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error ?? "Upload failed.");
      }

      const payload = (await response.json()) as { url: string };
      setValue(payload.url);
      toast.success("Image uploaded.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  function handleFileSelection(fileList: FileList | null) {
    const file = fileList?.[0];

    if (!file) {
      return;
    }

    void uploadFile(file);
  }

  return (
    <div className={cn("space-y-3", className)}>
      <input type="hidden" name={name} value={currentValue} />
      <input
        ref={fileInputRef}
        id={inputId}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(event) => handleFileSelection(event.target.files)}
      />

      <div
        role="button"
        tabIndex={0}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          handleFileSelection(event.dataTransfer.files);
        }}
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        className={cn(
          "relative overflow-hidden rounded-lg border border-dashed border-white/15 bg-white/[0.02] transition-colors",
          aspectClassName,
          isDragging && "border-primary bg-primary/5",
          currentValue && "border-white/10 border-solid",
          isUploading && "pointer-events-none opacity-80"
        )}
      >
        {currentValue ? (
          <Image
            src={currentValue}
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 px-4 text-center text-sm text-muted-foreground">
            <ImagePlus className="size-6" />
            <p>{emptyLabel}</p>
          </div>
        )}

        {isUploading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-background/70">
            <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm">
              <LoaderCircle className="size-4 animate-spin" />
              Uploading...
            </div>
          </div>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
          <Upload />
          {currentValue ? "Replace image" : "Choose image"}
        </Button>
        {currentValue ? (
          <Button type="button" variant="ghost" size="sm" onClick={() => setValue("")}>
            <Trash2 />
            Remove
          </Button>
        ) : null}
      </div>
    </div>
  );
}
