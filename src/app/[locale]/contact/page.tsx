import { ContactForm } from "@/components/contact-form";
import { SectionHeading } from "@/components/section-heading";
import { Card, CardContent } from "@/components/ui/card";
import { getSiteSettings } from "@/lib/data";
import { getLocalizedText } from "@/lib/locale-utils";
import type { Locale } from "@/lib/types";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const settings = await getSiteSettings();

  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 py-20 sm:px-6 lg:grid lg:grid-cols-[0.8fr_1.2fr] lg:gap-10 lg:space-y-0 lg:px-8">
      <div className="space-y-6">
        <SectionHeading
          eyebrow={locale === "en" ? "Contact" : "Kontakt"}
          title={locale === "en" ? "A smart brief beats a vague thread every time." : "Konkretny brief wygrywa z ogólnikowym wątkiem za każdym razem."}
          description={getLocalizedText(settings.contactIntro, locale)}
        />
        <Card className="border-white/10 bg-white/[0.03]">
          <CardContent className="space-y-3 p-6 text-sm leading-7 text-muted-foreground">
            <p>{settings.contactEmail}</p>
            <p>
              {locale === "en"
                ? "Use this form for hiring inquiries, product collaborations, advisory work, or a more custom brief."
                : "Użyj tego formularza do zapytań rekrutacyjnych, współpracy produktowej, doradztwa albo bardziej niestandardowego briefu."}
            </p>
          </CardContent>
        </Card>
      </div>
      <Card className="border-white/10 bg-white/[0.03]">
        <CardContent className="p-6">
          <ContactForm
            locale={locale}
            bookingEnabled={settings.bookingEnabled}
            bookingUrl={settings.bookingUrl}
          />
        </CardContent>
      </Card>
    </div>
  );
}
