import { eq, isNotNull } from "drizzle-orm";
import { projects } from "@/db/schema";
import type { requireDatabase } from "@/lib/data";

export interface GitHubRepositorySnapshot {
  description: string | null;
  stars: number;
  forks: number;
  updatedAt: string;
  homepage: string | null;
  htmlUrl: string;
}

function buildHeaders() {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
  };

  if (process.env.GITHUB_SYNC_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_SYNC_TOKEN}`;
  }

  return headers;
}

export async function fetchGitHubRepositorySnapshot(
  repository: string
): Promise<GitHubRepositorySnapshot> {
  const response = await fetch(`https://api.github.com/repos/${repository}`, {
    headers: buildHeaders(),
    next: { revalidate: 0 },
  });

  if (!response.ok) {
    throw new Error("GitHub repository not found.");
  }

  const repo = (await response.json()) as {
    description: string | null;
    stargazers_count: number;
    forks_count: number;
    updated_at: string;
    homepage: string | null;
    html_url: string;
  };

  return {
    description: repo.description,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    updatedAt: repo.updated_at,
    homepage: repo.homepage,
    htmlUrl: repo.html_url,
  };
}

export async function buildGitHubProjectSyncFields(
  repository: string,
  currentValues?: {
    liveUrl?: string | null;
    demoUrl?: string | null;
  }
) {
  const snapshot = await fetchGitHubRepositorySnapshot(repository);

  return {
    repository,
    repoDescription: snapshot.description,
    repoStars: snapshot.stars,
    repoForks: snapshot.forks,
    repoUpdatedAt: new Date(snapshot.updatedAt),
    liveUrl: currentValues?.liveUrl || snapshot.homepage || null,
    demoUrl: currentValues?.demoUrl || snapshot.htmlUrl,
  };
}

type Database = ReturnType<typeof requireDatabase>;

export async function syncProjectRepositoryById(
  db: Database,
  projectId: string,
  repository: string
) {
  const existing = await db.query.projects.findFirst({
    where: eq(projects.id, projectId),
  });

  if (!existing) {
    throw new Error("Project not found.");
  }

  const syncFields = await buildGitHubProjectSyncFields(repository, {
    liveUrl: existing.liveUrl,
    demoUrl: existing.demoUrl,
  });

  await db
    .update(projects)
    .set(syncFields)
    .where(eq(projects.id, projectId));

  return syncFields;
}

export async function syncAllProjectRepositories(db: Database) {
  const syncedProjects = await db.query.projects.findMany({
    where: isNotNull(projects.repository),
    columns: {
      id: true,
      repository: true,
    },
  });

  let synced = 0;
  let failed = 0;

  for (const project of syncedProjects) {
    if (!project.repository) {
      continue;
    }

    try {
      await syncProjectRepositoryById(db, project.id, project.repository);
      synced += 1;
    } catch {
      failed += 1;
    }
  }

  return { synced, failed };
}
