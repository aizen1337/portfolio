import { Download } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { getFeaturedProjects, getSiteSettings } from "@/lib/data";
import { getLocalizedText } from "@/lib/locale-utils";
import type { Locale } from "@/lib/types";

export default async function EmployersPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const [settings, projects] = await Promise.all([
    getSiteSettings(),
    getFeaturedProjects(),
  ]);

  return (
    <div className="mx-auto max-w-7xl space-y-12 px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow={locale === "en" ? "For employers" : "Dla pracodawców"}
        title={getLocalizedText(settings.employerIntro, locale)}
        description={
          locale === "en"
            ? "A quick route through strongest work, operating style, and technical range."
            : "Szybka ścieżka przez najmocniejsze realizacje, sposób pracy i zakres techniczny."
        }
      />
      <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <Card className="border-white/10 bg-white/[0.03]">
          <CardContent className="space-y-4 p-6">
            <h2 className="text-2xl">
              {locale === "en" ? "What you can expect from me" : "Czego możesz się po mnie spodziewać"}
            </h2>
            <p className="text-sm leading-7 text-muted-foreground">
              {getLocalizedText(settings.aboutBody, locale)}
            </p>
            <div className="flex flex-wrap gap-2">
              {["Next.js", "TypeScript", "Product Thinking", "Design Systems", "Postgres", "Vercel"].map((item) => (
                <Badge key={item} variant="secondary">
                  {item}
                </Badge>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/contact" locale={locale}>
                  {locale === "en" ? "Start a conversation" : "Zacznij rozmowę"}
                </Link>
              </Button>
              {settings.resumeUrl ? (
                <Button asChild variant="outline">
                  <a href={settings.resumeUrl} target="_blank" rel="noreferrer">
                    <Download className="size-4" />
                    {locale === "en" ? "Download resume" : "Pobierz CV"}
                  </a>
                </Button>
              ) : null}
            </div>
          </CardContent>
        </Card>
        <div className="grid gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="border-white/10 bg-white/[0.03]">
              <CardContent className="space-y-2 p-6">
                <h3 className="text-xl">{getLocalizedText(project.title, locale)}</h3>
                <p className="text-sm leading-7 text-muted-foreground">
                  {getLocalizedText(project.summary, locale)}
                </p>
                <Button asChild variant="ghost" className="px-0">
                  <Link href={`/projects/${project.slug}`} locale={locale}>
                    {locale === "en" ? "See the case study" : "Zobacz case study"}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
