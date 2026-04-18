import Image from "next/image";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
        <h1 className="max-w-4xl text-4xl leading-tight sm:text-5xl">
          {getLocalizedText(project.title, locale)}
        </h1>
        <p className="max-w-3xl text-lg leading-8 text-muted-foreground">
          {getLocalizedText(project.summary, locale)}
        </p>
      </div>
      <div className="relative aspect-[16/9] overflow-hidden rounded-lg border border-white/10">
        <Image
          src={project.coverImage}
          alt={getLocalizedText(project.title, locale)}
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <aside className="space-y-6 rounded-lg border border-white/10 bg-white/[0.03] p-6">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-primary">
              {locale === "en" ? "Role" : "Rola"}
            </p>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              {getLocalizedText(project.role, locale)}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-primary">
              Stack
            </p>
            <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
              {project.stack.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
          <div className="flex flex-wrap gap-3">
            {project.liveUrl ? (
              <Button asChild size="sm">
                <a href={project.liveUrl} target="_blank" rel="noreferrer">
                  Live site
                </a>
              </Button>
            ) : null}
            {project.demoUrl ? (
              <Button asChild size="sm" variant="outline">
                <a href={project.demoUrl} target="_blank" rel="noreferrer">
                  Demo
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
                  GitHub
                </a>
              </Button>
            ) : null}
          </div>
        </aside>
        <div className="space-y-8">
          {[
            ["Overview", getLocalizedText(project.overview, locale)],
            ["Challenge", getLocalizedText(project.challenge, locale)],
            ["Approach", getLocalizedText(project.approach, locale)],
            ["Outcome", getLocalizedText(project.outcome, locale)],
          ].map(([label, body]) => (
            <section key={label} className="space-y-2">
              <h2 className="text-2xl">{label}</h2>
              <p className="text-base leading-8 text-muted-foreground">{body}</p>
            </section>
          ))}
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {project.gallery.map((image) => (
          <div
            key={image}
            className="relative aspect-[4/3] overflow-hidden rounded-lg border border-white/10"
          >
            <Image
              src={image}
              alt={getLocalizedText(project.title, locale)}
              fill
              sizes="(max-width: 767px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
