"use client";

import {
  GlowingStarsBackgroundCard,
  GlowingStarsDescription,
  GlowingStarsTitle,
} from "@/components/ui/glowing-stars";

export function GlowingCardPreview() {
  return (
    <GlowingStarsBackgroundCard className="max-w-none border-white/10 bg-[linear-gradient(110deg,#141824_0.6%,#0b1020)]">
      <GlowingStarsTitle className="text-xl">
        Signal, clarity, and delivery
      </GlowingStarsTitle>
      <GlowingStarsDescription className="mt-2 max-w-none text-sm text-zinc-300">
        The builds I like most usually sit where product taste, technical discipline,
        and business reality finally stop arguing with each other.
      </GlowingStarsDescription>
    </GlowingStarsBackgroundCard>
  );
}
