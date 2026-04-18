import type { BookingProvider } from "@/lib/types";

export function getBookingPath() {
  return "/contact/book";
}

export function hasBookingConfig({
  bookingEnabled,
  bookingUrl,
}: {
  bookingEnabled: boolean;
  bookingUrl: string | null;
}) {
  return bookingEnabled && Boolean(bookingUrl?.trim());
}

export function getBookingExternalUrl(bookingUrl: string | null) {
  if (!bookingUrl) return null;

  try {
    const url = new URL(bookingUrl);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return null;
    }

    return url.toString();
  } catch {
    return null;
  }
}

export function getBookingEmbedUrl(
  provider: BookingProvider,
  bookingUrl: string | null
) {
  const normalizedUrl = getBookingExternalUrl(bookingUrl);
  if (!normalizedUrl) {
    return null;
  }

  const url = new URL(normalizedUrl);
  if (provider === "google-calendar") {
    return url.toString();
  }

  return url.toString();
}
