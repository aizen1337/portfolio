import Image from "next/image";
import { ArrowRight, BriefcaseBusiness, Download, Sparkles } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { GlowingCardPreview } from "@/components/glowing-card-preview";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { Spotlight } from "@/components/ui/spotlight";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeading } from "@/components/section-heading";
import { Link } from "@/i18n/navigation";
import {
  getFeaturedProjects,
  getPortfolioData,
} from "@/lib/data";
import { getLocalizedList, getLocalizedText } from "@/lib/locale-utils";
import type { Locale } from "@/lib/types";

export default async function LocaleHomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const { settings, services, testimonials } = await getPortfolioData();
  const featuredProjects = await getFeaturedProjects();
  const t = await getTranslations({ locale, namespace: "common" });

  return (
    <div className="relative overflow-hidden">
      <section className="relative isolate">
        <Spotlight className="-top-48 left-0 md:-top-32 md:left-60" fill="#5eead4" />
        <BackgroundBeams className="opacity-30" />
        <div className="mx-auto grid min-h-[82svh] max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-8">
          <div className="space-y-8">
            <Badge className="rounded-full bg-primary/15 text-primary hover:bg-primary/15">
              {getLocalizedText(settings.heroEyebrow, locale)}
            </Badge>
            <TextGenerateEffect
              words={getLocalizedText(settings.heroTitle, locale)}
              className="max-w-4xl text-4xl sm:text-6xl"
            />
            <p className="max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
              {getLocalizedText(settings.heroBody, locale)}
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/services" locale={locale}>
                  <Sparkles className="size-4" />
                  <span>{locale === "en" ? "Work with me" : "Współpracujmy"}</span>
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/employers" locale={locale}>
                  <BriefcaseBusiness className="size-4" />
                  <span>{locale === "en" ? "Hiring?" : "Rekrutujesz?"}</span>
                </Link>
              </Button>
              <Button asChild variant="ghost" size="lg">
                <Link href="/projects" locale={locale}>
                  <span>{t("allProjects")}</span>
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="overflow-hidden border-white/10 bg-white/[0.04]">
              <CardContent className="p-4">
                <div className="relative aspect-[4/5] overflow-hidden rounded-md">
                  <Image
                    src={featuredProjects[0]?.coverImage ?? "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80"}
                    alt={featuredProjects[0] ? getLocalizedText(featuredProjects[0].title, locale) : "Project preview"}
                    fill
                    className="object-cover"
                  />
                </div>
                {featuredProjects[0] ? (
                  <div className="mt-4 space-y-2">
                    <p className="text-xs uppercase tracking-[0.2em] text-primary">
                      {t("featured")}
                    </p>
                    <h2 className="text-xl">{getLocalizedText(featuredProjects[0].title, locale)}</h2>
                  </div>
                ) : null}
              </CardContent>
            </Card>
            <div className="space-y-4">
              <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-primary">
                  {locale === "en" ? "About" : "O mnie"}
                </p>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {getLocalizedText(settings.aboutBody, locale)}
                </p>
              </div>
              <GlowingCardPreview />
              <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">
                    {locale === "en" ? "Resume ready" : "CV gotowe"}
                  </p>
                  {settings.resumeUrl ? (
                    <Button asChild variant="ghost" size="sm">
                      <a href={settings.resumeUrl} target="_blank" rel="noreferrer">
                        <Download className="size-4" />
                        {t("resume")}
                      </a>
                    </Button>
                  ) : null}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {locale === "en"
                    ? "Structured for both hiring reviews and client conversations."
                    : "Ułożone tak, by działało i w procesie rekrutacji, i w rozmowie z klientem."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl space-y-10 px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={locale === "en" ? "Featured work" : "Wybrane realizacje"}
          title={
            locale === "en"
              ? "A few projects where design taste and engineering discipline had to meet in the middle."
              : "Kilka projektów, w których wyczucie designu i dyscyplina inżynierska musiały spotkać się pośrodku."
          }
        />
        <div className="grid gap-6 lg:grid-cols-3">
          {featuredProjects.map((project) => (
            <Card key={project.id} className="overflow-hidden border-white/10 bg-white/[0.03]">
              <div className="relative aspect-[4/3]">
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
                  <h3 className="text-xl">{getLocalizedText(project.title, locale)}</h3>
                  <p className="text-sm leading-7 text-muted-foreground">
                    {getLocalizedText(project.summary, locale)}
                  </p>
                </div>
                <Button asChild variant="outline">
                  <Link href={`/projects/${project.slug}`} locale={locale}>
                    {t("viewCaseStudy")}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl space-y-10 px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={locale === "en" ? "Services" : "Usługi"}
          title={getLocalizedText(settings.servicesIntro, locale)}
        />
        <div className="grid gap-6 lg:grid-cols-3">
          {services.map((service) => (
            <Card key={service.id} className="border-white/10 bg-white/[0.03]">
              <CardContent className="space-y-4 p-6">
                <p className="text-xs uppercase tracking-[0.2em] text-primary">
                  {service.slug.replaceAll("-", " ")}
                </p>
                <h3 className="text-2xl">{getLocalizedText(service.title, locale)}</h3>
                <p className="text-sm leading-7 text-muted-foreground">
                  {getLocalizedText(service.summary, locale)}
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {getLocalizedList(service.outcomes, locale).map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl space-y-10 px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={locale === "en" ? "Testimonials" : "Opinie"}
          title={
            locale === "en"
              ? "What working together tends to feel like."
              : "Jak zwykle wygląda współpraca ze mną."
          }
          align="center"
        />
        <div className="grid gap-6 lg:grid-cols-2">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="border-white/10 bg-white/[0.03]">
              <CardContent className="space-y-5 p-6">
                <p className="text-lg leading-8 text-foreground">
                  “{getLocalizedText(testimonial.quote, locale)}”
                </p>
                <div>
                  <p className="font-medium">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role} · {testimonial.company}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
