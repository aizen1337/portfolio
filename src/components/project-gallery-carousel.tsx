"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Locale, ProjectGalleryItem } from "@/lib/types";

interface ProjectGalleryCarouselProps {
  items: ProjectGalleryItem[];
  locale: Locale;
  projectTitle: string;
}

export function ProjectGalleryCarousel({
  items,
  locale,
  projectTitle,
}: ProjectGalleryCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const container = scrollRef.current;

    if (!container) {
      return;
    }

    const scrollContainer = container;

    function updateActiveIndex() {
      const nextIndex = Math.round(
        scrollContainer.scrollLeft / Math.max(scrollContainer.clientWidth, 1)
      );
      setActiveIndex(Math.min(Math.max(nextIndex, 0), items.length - 1));
    }

    updateActiveIndex();
    scrollContainer.addEventListener("scroll", updateActiveIndex, { passive: true });

    return () => {
      scrollContainer.removeEventListener("scroll", updateActiveIndex);
    };
  }, [items.length]);

  function scrollToIndex(index: number) {
    const container = scrollRef.current;

    if (!container) {
      return;
    }

    const boundedIndex = Math.min(Math.max(index, 0), items.length - 1);
    container.scrollTo({
      left: container.clientWidth * boundedIndex,
      behavior: "smooth",
    });
    setActiveIndex(boundedIndex);
  }

  if (items.length === 0) {
    return null;
  }

  const activeItem = items[activeIndex] ?? items[0];
  const activeDescription = activeItem.description[locale];
  const galleryLabel = locale === "en" ? "Project gallery" : "Galeria projektu";
  const previousLabel = locale === "en" ? "Previous image" : "Poprzedni obraz";
  const nextLabel = locale === "en" ? "Next image" : "Nastepny obraz";

  if (items.length === 1) {
    const singleDescription = items[0].description[locale];

    return (
      <section className="space-y-4" aria-label={galleryLabel}>
        <div className="relative aspect-[16/10] overflow-hidden rounded-lg border border-white/10">
          <Image
            src={items[0].image}
            alt={singleDescription ? `${projectTitle} - ${singleDescription}` : projectTitle}
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
        {singleDescription ? (
          <p className="max-w-3xl text-sm leading-7 text-muted-foreground">{singleDescription}</p>
        ) : null}
      </section>
    );
  }

  return (
    <section className="space-y-4" aria-label={galleryLabel}>
      <div className="space-y-4 rounded-lg border border-white/10 bg-white/[0.02] p-3 sm:p-4">
        <div className="relative">
          <div
            ref={scrollRef}
            className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth rounded-lg [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {items.map((item, index) => {
              const description = item.description[locale];

              return (
                <div key={`${item.image}-${index}`} className="min-w-full snap-center">
                  <div className="relative aspect-[16/10] overflow-hidden rounded-lg border border-white/10">
                    <Image
                      src={item.image}
                      alt={description ? `${projectTitle} - ${description}` : projectTitle}
                      fill
                      sizes="100vw"
                      className="object-cover"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pointer-events-none absolute inset-y-0 left-0 right-0 hidden items-center justify-between px-3 md:flex">
            <Button
              type="button"
              size="icon"
              variant="secondary"
              className="pointer-events-auto"
              onClick={() => scrollToIndex(activeIndex - 1)}
              disabled={activeIndex === 0}
              aria-label={previousLabel}
            >
              <ChevronLeft />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="secondary"
              className="pointer-events-auto"
              onClick={() => scrollToIndex(activeIndex + 1)}
              disabled={activeIndex === items.length - 1}
              aria-label={nextLabel}
            >
              <ChevronRight />
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2">
          {items.map((item, index) => (
            <button
              key={`${item.image}-dot-${index}`}
              type="button"
              className={cn(
                "h-2.5 w-2.5 rounded-full border border-white/20 bg-white/20 transition-colors",
                index === activeIndex && "bg-primary border-primary"
              )}
              onClick={() => scrollToIndex(index)}
              aria-label={`${galleryLabel} ${index + 1}`}
              aria-pressed={index === activeIndex}
            />
          ))}
        </div>
      </div>

      {activeDescription ? (
        <p className="max-w-3xl text-sm leading-7 text-muted-foreground">{activeDescription}</p>
      ) : null}
    </section>
  );
}
