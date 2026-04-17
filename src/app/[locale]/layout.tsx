import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { routing } from "@/i18n/routing";
import { getSiteSettings } from "@/lib/data";
import type { Locale } from "@/lib/types";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "pl" ? "Portfolio" : "Portfolio",
    description:
      locale === "pl"
        ? "Dwujęzyczne portfolio z projektami, usługami i panelem kontaktowym."
        : "Bilingual portfolio with projects, services, and a lead capture flow.",
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const settings = await getSiteSettings();

  return (
    <NextIntlClientProvider messages={messages}>
      <div className="min-h-screen">
        <SiteHeader locale={locale as Locale} />
        <main>{children}</main>
        <SiteFooter locale={locale as Locale} settings={settings} />
      </div>
    </NextIntlClientProvider>
  );
}
