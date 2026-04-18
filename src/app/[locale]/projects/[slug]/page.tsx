import Image from "next/image";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProjectGalleryCarousel } from "@/components/project-gallery-carousel";
import { getProjectBySlug } from "@/lib/data";
import { getLocalizedText } from "@/lib/locale-utils";
import type { Locale } from "@/lib/types";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const projectTitle = getLocalizedText(project.title, locale);
  const labels = {
    role: locale === "en" ? "Role" : "Rola",
    stack: "Stack",
    liveSite: locale === "en" ? "Live site" : "Live site",
    demo: "Demo",
    github: "GitHub",
    overview: locale === "en" ? "Overview" : "Przeglad",
    challenge: locale === "en" ? "Challenge" : "Wyzwanie",
    approach: locale === "en" ? "Approach" : "Podejscie",
    outcome: locale === "en" ? "Outcome" : "Efekt",
  };

  return (
    <div className="mx-auto max-w-6xl space-y-12 px-4 py-20 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
        <h1 className="max-w-4xl text-4xl leading-tight sm:text-5xl">{projectTitle}</h1>
        <p className="max-w-3xl text-lg leading-8 text-muted-foreground">
          {getLocalizedText(project.summary, locale)}
        </p>
      </div>
      <div className="relative aspect-[16/9] overflow-hidden rounded-lg border border-white/10">
        <Image
          src={project.coverImage}
          alt={projectTitle}
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <aside className="space-y-6 rounded-lg border border-white/10 bg-white/[0.03] p-6">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-primary">{labels.role}</p>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              {getLocalizedText(project.role, locale)}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-primary">{labels.stack}</p>
            <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
              {project.stack.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </div>
          <div className="flex flex-wrap gap-3">
            {project.liveUrl ? (
              <Button asChild size="sm">
                <a href={project.liveUrl} target="_blank" rel="noreferrer">
                  {labels.liveSite}
                </a>
              </Button>
            ) : null}
            {project.demoUrl ? (
              <Button asChild size="sm" variant="outline">
                <a href={project.demoUrl} target="_blank" rel="noreferrer">
                  {labels.demo}
                </a>
              </Button>
            ) : null}
            {project.repository ? (
              <Button asChild size="sm" variant="ghost">
                <a
                  href={`https://github.com/${project.repository}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {labels.github}
                </a>
              </Button>
            ) : null}
          </div>
        </aside>
        <div className="space-y-8">
          {[
            [labels.overview, getLocalizedText(project.overview, locale)],
            [labels.challenge, getLocalizedText(project.challenge, locale)],
            [labels.approach, getLocalizedText(project.approach, locale)],
            [labels.outcome, getLocalizedText(project.outcome, locale)],
          ].map(([label, body]) => (
            <section key={label} className="space-y-2">
              <h2 className="text-2xl">{label}</h2>
              <p className="text-base leading-8 text-muted-foreground">{body}</p>
            </section>
          ))}
        </div>
      </div>
      <ProjectGalleryCarousel
        items={project.gallery}
        locale={locale}
        projectTitle={projectTitle}
      />
    </div>
  );
}
