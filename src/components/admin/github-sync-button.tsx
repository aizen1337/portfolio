"use client";

import { RefreshCw } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function GitHubSyncButton({
  projectId,
  repository,
  syncAll = false,
}: {
  projectId?: string;
  repository?: string | null;
  syncAll?: boolean;
}) {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  async function handleClick() {
    if (!syncAll && !repository) {
      toast.error("Add a repository first, e.g. owner/name.");
      return;
    }

    setIsPending(true);
    const response = await fetch("/api/github/sync", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(syncAll ? { syncAll: true } : { projectId, repository }),
    });
    setIsPending(false);

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      toast.error(payload?.error ?? "GitHub sync failed.");
      return;
    }

    const payload = (await response.json().catch(() => null)) as {
      synced?: number;
      failed?: number;
    } | null;
    if (syncAll) {
      const synced = payload?.synced ?? 0;
      const failed = payload?.failed ?? 0;
      toast.success(
        failed > 0
          ? `Synced ${synced} repos. ${failed} failed.`
          : `Synced ${synced} GitHub repositories.`
      );
    } else {
      toast.success("GitHub metadata synced.");
    }
    router.refresh();
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
      {syncAll ? "Sync all repos" : "Sync GitHub"}
    </Button>
  );
}
