import { SectionHeading } from "@/components/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { getPortfolioData } from "@/lib/data";
import { getLocalizedList, getLocalizedText } from "@/lib/locale-utils";
import type { Locale } from "@/lib/types";

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const { settings, services, testimonials } = await getPortfolioData();

  return (
    <div className="mx-auto max-w-7xl space-y-12 px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow={locale === "en" ? "Client work" : "Współpraca z klientem"}
        title={getLocalizedText(settings.servicesIntro, locale)}
        description={
          locale === "en"
            ? "Custom engagements built around real constraints, sharper product thinking, and a frontend that feels like someone cared."
            : "Współpraca dopasowana do realnych ograniczeń, ostrzejszego myślenia o produkcie i frontendu, po którym czuć troskę."
        }
      />
      <div className="grid gap-6 lg:grid-cols-3">
        {services.map((service) => (
          <Card key={service.id} className="border-white/10 bg-white/[0.03]">
            <CardContent className="space-y-4 p-6">
              <Badge variant="secondary">{service.slug.replaceAll("-", " ")}</Badge>
              <h2 className="text-2xl">{getLocalizedText(service.title, locale)}</h2>
              <p className="text-sm leading-7 text-muted-foreground">
                {getLocalizedText(service.summary, locale)}
              </p>
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.2em] text-primary">
                  {locale === "en" ? "Typical outcomes" : "Typowe efekty"}
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {getLocalizedList(service.outcomes, locale).map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>
              <Button asChild>
                <Link href="/contact" locale={locale}>
                  {getLocalizedText(service.ctaLabel, locale)}
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="border-white/10 bg-white/[0.03]">
        <CardContent className="grid gap-8 p-8 lg:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-primary">
              {locale === "en" ? "How I work" : "Jak pracuję"}
            </p>
            <h2 className="mt-3 text-3xl">
              {locale === "en"
                ? "Clear scope, honest tradeoffs, and delivery that still feels designed."
                : "Jasny zakres, uczciwe trade-offy i delivery, które wciąż czuć jako zaprojektowane."}
            </h2>
          </div>
          <div className="space-y-4">
            {services[0] ? (
              getLocalizedList(services[0].process, locale).map((step) => (
                <div key={step} className="rounded-lg border border-white/10 bg-background/40 p-4 text-sm text-muted-foreground">
                  {step}
                </div>
              ))
            ) : null}
          </div>
        </CardContent>
      </Card>
      <div className="grid gap-6 lg:grid-cols-2">
        {testimonials.map((testimonial) => (
          <Card key={testimonial.id} className="border-white/10 bg-white/[0.03]">
            <CardContent className="space-y-3 p-6">
              <p className="text-lg leading-8">“{getLocalizedText(testimonial.quote, locale)}”</p>
              <p className="text-sm text-muted-foreground">
                {testimonial.name} · {testimonial.role}, {testimonial.company}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
