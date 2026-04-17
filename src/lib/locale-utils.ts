import type { LocalizedList, LocalizedText, Locale } from "@/lib/types";

export function getLocalizedText(value: LocalizedText, locale: Locale) {
  return value[locale] ?? value.en;
}

export function getLocalizedList(value: LocalizedList, locale: Locale) {
  return value[locale] ?? value.en;
}
