import { getTranslations } from "next-intl/server";
import { SectionHeading } from "@/components/section-heading";
import { BookingEmbed } from "@/components/booking-embed";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { getBookingExternalUrl, hasBookingConfig } from "@/lib/booking";
import { getSiteSettings } from "@/lib/data";
import type { Locale } from "@/lib/types";

export default async function ContactBookingPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  const settings = await getSiteSettings();
  const hasBooking = hasBookingConfig(settings);
  const externalUrl = getBookingExternalUrl(settings.bookingUrl);
  const contactPath = `/${locale}/contact`;

  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 py-20 sm:px-6 lg:grid lg:grid-cols-[0.8fr_1.2fr] lg:gap-10 lg:space-y-0 lg:px-8">
      <div className="space-y-6">
        <SectionHeading
          eyebrow={locale === "en" ? "Booking" : "Rezerwacja"}
          title={t("bookingTitle")}
          description={t("bookingDescription")}
        />
        <Card className="border-white/10 bg-white/[0.03]">
          <CardContent className="space-y-4 p-6 text-sm leading-7 text-muted-foreground">
            <p>{settings.contactEmail}</p>
            <p>{hasBooking ? t("bookingHint") : t("bookingFallback")}</p>
            <div className="flex flex-wrap gap-3">
              <Button asChild variant="outline">
                <Link href={contactPath}>
                  {t("bookingBack")}
                </Link>
              </Button>
              {externalUrl ? (
                <Button asChild>
                  <a href={externalUrl} target="_blank" rel="noreferrer">
                    {t("bookingExternal")}
                  </a>
                </Button>
              ) : null}
            </div>
          </CardContent>
        </Card>
      </div>
      <Card className="border-white/10 bg-white/[0.03]">
        <CardContent className="p-4 sm:p-6">
          {hasBooking && externalUrl ? (
            <BookingEmbed
              provider={settings.bookingProvider}
              bookingUrl={settings.bookingUrl}
            />
          ) : (
            <div className="flex min-h-[420px] items-center justify-center rounded-md border border-dashed border-white/10 px-6 text-center text-sm text-muted-foreground">
              {t("bookingFallback")}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
