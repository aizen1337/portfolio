import { Link } from "@/i18n/navigation";
import type { Locale, SiteSettings } from "@/lib/types";

export function SiteFooter({
  locale,
  settings,
}: {
  locale: Locale;
  settings: SiteSettings;
}) {
  return (
    <footer className="border-t border-white/10">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <p className="text-sm font-medium text-foreground">
            Built to speak to employers and clients without becoming two different people.
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {settings.contactEmail}
          </p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          {settings.socialLinks.map((link) => (
            <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
              {link.label}
            </a>
          ))}
          <Link href="/contact" locale={locale}>
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
