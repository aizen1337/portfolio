"use client";

import { useLocale, useTranslations } from "next-intl";
import { routing } from "@/i18n/routing";
import { usePathname, useRouter } from "@/i18n/navigation";

export function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("common");

  return (
    <label className="flex items-center gap-2 text-xs text-muted-foreground">
      <span>{t("language")}</span>
      <select
        className="rounded-md border border-border bg-background px-2 py-1 text-foreground"
        value={locale}
        onChange={(event) =>
          router.replace(pathname, { locale: event.target.value as (typeof routing.locales)[number] })
        }
      >
        {routing.locales.map((item) => (
          <option key={item} value={item}>
            {item.toUpperCase()}
          </option>
        ))}
      </select>
    </label>
  );
}
