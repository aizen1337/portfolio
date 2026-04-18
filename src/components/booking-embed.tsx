import type { BookingProvider } from "@/lib/types";
import { getBookingEmbedUrl } from "@/lib/booking";

export function BookingEmbed({
  provider,
  bookingUrl,
}: {
  provider: BookingProvider;
  bookingUrl: string | null;
}) {
  const embedUrl = getBookingEmbedUrl(provider, bookingUrl);

  if (!embedUrl) {
    return null;
  }

  return (
    <iframe
      src={embedUrl}
      title={provider === "google-calendar" ? "Google Calendar booking" : "Booking"}
      className="min-h-[760px] w-full rounded-md border border-white/10 bg-background"
      allow="camera; microphone; fullscreen; payment"
      loading="lazy"
      referrerPolicy="strict-origin-when-cross-origin"
      sandbox="allow-forms allow-same-origin allow-scripts allow-popups allow-top-navigation-by-user-activation"
    />
  );
}
