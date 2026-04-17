"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { getLocalizedText } from "@/lib/locale-utils";
import type { Locale, Project } from "@/lib/types";

export function ProjectFilterGrid({
  locale,
  projects,
}: {
  locale: Locale;
  projects: Project[];
}) {
  const [activeTag, setActiveTag] = useState<string>("All");

  const tags = useMemo(
    () => ["All", ...new Set(projects.flatMap((project) => project.tags))],
    [projects]
  );

  const filteredProjects = useMemo(
    () =>
      activeTag === "All"
        ? projects
        : projects.filter((project) => project.tags.includes(activeTag)),
    [activeTag, projects]
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => setActiveTag(tag)}
            className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
              activeTag === tag
                ? "border-primary bg-primary text-primary-foreground"
                : "border-white/10 bg-white/5 text-muted-foreground hover:text-foreground"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        {filteredProjects.map((project) => (
          <Card
            key={project.id}
            className="overflow-hidden border-white/10 bg-white/[0.03] backdrop-blur"
          >
            <div className="relative aspect-[16/10]">
              <Image
                src={project.coverImage}
                alt={getLocalizedText(project.title, locale)}
                fill
                className="object-cover"
              />
            </div>
            <CardContent className="space-y-4 p-6">
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl">
                  {getLocalizedText(project.title, locale)}
                </h3>
                <p className="text-sm leading-7 text-muted-foreground">
                  {getLocalizedText(project.summary, locale)}
                </p>
              </div>
              <Button asChild variant="outline">
                <Link href={`/projects/${project.slug}`} locale={locale}>
                  <span>Explore case study</span>
                  <ArrowUpRight className="size-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
