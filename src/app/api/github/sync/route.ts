import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { projects } from "@/db/schema";
import { authOptions } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/env";
import { requireDatabase } from "@/lib/data";

function buildHeaders() {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
  };

  if (process.env.GITHUB_SYNC_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_SYNC_TOKEN}`;
  }

  return headers;
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { projectId, repository } = (await request.json()) as {
    projectId?: string;
    repository?: string;
  };

  if (!repository || !repository.includes("/")) {
    return NextResponse.json({ error: "Repository must look like owner/name." }, { status: 400 });
  }

  const response = await fetch(`https://api.github.com/repos/${repository}`, {
    headers: buildHeaders(),
    next: { revalidate: 0 },
  });

  if (!response.ok) {
    return NextResponse.json({ error: "GitHub repository not found." }, { status: 404 });
  }

  const repo = (await response.json()) as {
    description: string | null;
    stargazers_count: number;
    forks_count: number;
    updated_at: string;
    homepage: string | null;
    html_url: string;
  };

  if (projectId && isDatabaseConfigured()) {
    await requireDatabase()
      .update(projects)
      .set({
        repository,
        repoDescription: repo.description,
        repoStars: repo.stargazers_count,
        repoForks: repo.forks_count,
        repoUpdatedAt: new Date(repo.updated_at),
        liveUrl: repo.homepage || null,
        demoUrl: repo.html_url,
      })
      .where(eq(projects.id, projectId));
  }

  return NextResponse.json({
    ok: true,
    repository,
    repoDescription: repo.description,
    repoStars: repo.stargazers_count,
    repoForks: repo.forks_count,
    repoUpdatedAt: repo.updated_at,
    homepage: repo.homepage,
    htmlUrl: repo.html_url,
  });
}
