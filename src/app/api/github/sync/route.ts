import { NextResponse } from "next/server";
import { isDatabaseConfigured } from "@/lib/env";
import { getAuthSession } from "@/lib/auth";
import { requireDatabase } from "@/lib/data";
import {
  buildGitHubProjectSyncFields,
  fetchGitHubRepositorySnapshot,
  syncAllProjectRepositories,
  syncProjectRepositoryById,
} from "@/lib/github";

export async function POST(request: Request) {
  const session = await getAuthSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const payload = (await request.json().catch(() => ({}))) as {
    projectId?: string;
    repository?: string;
    syncAll?: boolean;
  };

  const db = isDatabaseConfigured() ? requireDatabase() : null;

  if (payload.syncAll) {
    if (!db) {
      return NextResponse.json({ error: "Database is not configured." }, { status: 503 });
    }

    const result = await syncAllProjectRepositories(db);
    return NextResponse.json({
      ok: true,
      synced: result.synced,
      failed: result.failed,
    });
  }

  if (!payload.repository || !payload.repository.includes("/")) {
    return NextResponse.json(
      { error: "Repository must look like owner/name." },
      { status: 400 }
    );
  }

  if (payload.projectId && db) {
    const syncFields = await syncProjectRepositoryById(db, payload.projectId, payload.repository);

    return NextResponse.json({
      ok: true,
      repository: payload.repository,
      repoDescription: syncFields.repoDescription,
      repoStars: syncFields.repoStars,
      repoForks: syncFields.repoForks,
      repoUpdatedAt: syncFields.repoUpdatedAt.toISOString(),
      homepage: syncFields.liveUrl,
      htmlUrl: syncFields.demoUrl,
    });
  }

  const snapshot = await fetchGitHubRepositorySnapshot(payload.repository);
  const syncFields = await buildGitHubProjectSyncFields(payload.repository);

  return NextResponse.json({
    ok: true,
    repository: payload.repository,
    repoDescription: snapshot.description,
    repoStars: snapshot.stars,
    repoForks: snapshot.forks,
    repoUpdatedAt: snapshot.updatedAt,
    homepage: syncFields.liveUrl,
    htmlUrl: syncFields.demoUrl,
  });
}
