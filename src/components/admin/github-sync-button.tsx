"use client";

import { RefreshCw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function GitHubSyncButton({
  projectId,
  repository,
}: {
  projectId: string;
  repository: string | null;
}) {
  const [isPending, setIsPending] = useState(false);

  async function handleClick() {
    if (!repository) {
      toast.error("Add a repository first, e.g. owner/name.");
      return;
    }

    setIsPending(true);
    const response = await fetch("/api/github/sync", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ projectId, repository }),
    });
    setIsPending(false);

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      toast.error(payload?.error ?? "GitHub sync failed.");
      return;
    }

    toast.success("GitHub metadata synced.");
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleClick}
      disabled={isPending}
    >
      <RefreshCw className={`size-4 ${isPending ? "animate-spin" : ""}`} />
      Sync GitHub
    </Button>
  );
}
