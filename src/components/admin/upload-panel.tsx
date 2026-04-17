"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function UploadPanel({
  kind,
  title,
  description,
}: {
  kind: "media" | "resume";
  title: string;
  description: string;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [altEn, setAltEn] = useState("");
  const [altPl, setAltPl] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  async function handleUpload() {
    if (!file) {
      toast.error("Pick a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("kind", kind);
    formData.append("altEn", altEn);
    formData.append("altPl", altPl);

    setIsUploading(true);
    const response = await fetch("/api/uploads", {
      method: "POST",
      body: formData,
    });
    setIsUploading(false);

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      toast.error(payload?.error ?? "Upload failed.");
      return;
    }

    toast.success(kind === "resume" ? "Resume uploaded." : "Asset uploaded.");
    setFile(null);
    setAltEn("");
    setAltPl("");
  }

  return (
    <div className="space-y-4 rounded-lg border border-white/10 bg-white/[0.03] p-4">
      <div>
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="space-y-2">
        <Label>File</Label>
        <Input
          type="file"
          onChange={(event) => setFile(event.target.files?.[0] ?? null)}
        />
      </div>
      {kind === "media" ? (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Alt text (EN)</Label>
            <Input value={altEn} onChange={(event) => setAltEn(event.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Alt text (PL)</Label>
            <Input value={altPl} onChange={(event) => setAltPl(event.target.value)} />
          </div>
        </div>
      ) : null}
      <Button type="button" onClick={handleUpload} disabled={isUploading}>
        {isUploading ? "Uploading..." : "Upload"}
      </Button>
    </div>
  );
}
