"use client";

import {
  GlowingStarsBackgroundCard,
  GlowingStarsDescription,
  GlowingStarsTitle,
} from "@/components/ui/glowing-stars";
import type { Locale } from "@/lib/types";

export function GlowingCardPreview({ locale }: { locale: Locale }) {
  const title =
    locale === "en"
      ? "Signal, clarity, and delivery"
      : "Sygnał, klarowność i dowóz";

  const description =
    locale === "en"
      ? "The builds I like most usually sit where product taste, technical discipline, and business reality finally stop arguing with each other."
      : "Najbardziej lubię projekty, w których wyczucie produktu, dyscyplina techniczna i realia biznesowe wreszcie zaczynają grać do jednej bramki.";

  return (
    <GlowingStarsBackgroundCard className="max-w-none border-white/10 bg-[linear-gradient(110deg,#141824_0.6%,#0b1020)]">
      <GlowingStarsTitle className="text-xl">{title}</GlowingStarsTitle>
      <GlowingStarsDescription className="mt-2 max-w-none text-sm text-zinc-300">
        {description}
      </GlowingStarsDescription>
    </GlowingStarsBackgroundCard>
  );
}
