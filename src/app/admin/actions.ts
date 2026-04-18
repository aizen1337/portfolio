"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import {
  projects,
  services,
  siteSettings,
  testimonials,
} from "@/db/schema";
import { requireDatabase, updateInquiryStatus } from "@/lib/data";
import { buildGitHubProjectSyncFields } from "@/lib/github";
import { requireAdmin } from "@/lib/admin";
import type {
  BookingProvider,
  InquiryStatus,
  LocalizedList,
  LocalizedText,
  ProjectGalleryItem,
  SocialLink,
} from "@/lib/types";

function textValue(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function checkboxValue(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

function numberValue(formData: FormData, key: string) {
  return Number.parseInt(String(formData.get(key) ?? "0"), 10) || 0;
}

function parseCsv(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseLines(value: string) {
  return value
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseProjectGallery(formData: FormData): ProjectGalleryItem[] {
  const count = numberValue(formData, "galleryCount");
  const items: ProjectGalleryItem[] = [];

  for (let index = 0; index < count; index += 1) {
    const image = textValue(formData, `galleryImage-${index}`);
    const descriptionEn = textValue(formData, `galleryDescriptionEn-${index}`);
    const descriptionPl = textValue(formData, `galleryDescriptionPl-${index}`);

    if (!image && !descriptionEn && !descriptionPl) {
      continue;
    }

    if (!image) {
      continue;
    }

    items.push({
      image,
      description: {
        en: descriptionEn,
        pl: descriptionPl,
      },
    });
  }

  return items;
}

function localizedText(formData: FormData, prefix: string): LocalizedText {
  return {
    en: textValue(formData, `${prefix}En`),
    pl: textValue(formData, `${prefix}Pl`),
  };
}

function localizedList(formData: FormData, prefix: string): LocalizedList {
  return {
    en: parseLines(textValue(formData, `${prefix}En`)),
    pl: parseLines(textValue(formData, `${prefix}Pl`)),
  };
}

function revalidateAll() {
  revalidatePath("/admin");
  revalidatePath("/en");
  revalidatePath("/en/projects");
  revalidatePath("/en/services");
  revalidatePath("/en/employers");
  revalidatePath("/en/contact");
  revalidatePath("/en/contact/book");
  revalidatePath("/pl");
  revalidatePath("/pl/projects");
  revalidatePath("/pl/services");
  revalidatePath("/pl/employers");
  revalidatePath("/pl/contact");
  revalidatePath("/pl/contact/book");
}

export async function saveProjectAction(formData: FormData) {
  await requireAdmin();
  const db = requireDatabase();
  const id = textValue(formData, "id");
  const repository = textValue(formData, "repository") || null;
  const liveUrl = textValue(formData, "liveUrl") || null;
  const demoUrl = textValue(formData, "demoUrl") || null;

  const values = {
    slug: textValue(formData, "slug"),
    featured: checkboxValue(formData, "featured"),
    sortOrder: numberValue(formData, "sortOrder"),
    title: localizedText(formData, "title"),
    summary: localizedText(formData, "summary"),
    overview: localizedText(formData, "overview"),
    challenge: localizedText(formData, "challenge"),
    approach: localizedText(formData, "approach"),
    outcome: localizedText(formData, "outcome"),
    role: localizedText(formData, "role"),
    tags: parseCsv(textValue(formData, "tags")),
    stack: parseCsv(textValue(formData, "stack")),
    coverImage: textValue(formData, "coverImage"),
    gallery: parseProjectGallery(formData),
    repository,
    liveUrl,
    demoUrl,
  };

  const syncedValues = repository
    ? await buildGitHubProjectSyncFields(repository, {
        liveUrl,
        demoUrl,
      }).catch(() => null)
    : null;

  const nextValues = syncedValues ? { ...values, ...syncedValues } : values;

  if (id) {
    await db.update(projects).set(nextValues).where(eq(projects.id, id));
  } else {
    await db.insert(projects).values(nextValues);
  }

  revalidateAll();
}

export async function deleteProjectAction(formData: FormData) {
  await requireAdmin();
  await requireDatabase()
    .delete(projects)
    .where(eq(projects.id, textValue(formData, "id")));
  revalidateAll();
}

export async function saveServiceAction(formData: FormData) {
  await requireAdmin();
  const db = requireDatabase();
  const id = textValue(formData, "id");
  const values = {
    slug: textValue(formData, "slug"),
    icon: textValue(formData, "icon") || "Sparkles",
    sortOrder: numberValue(formData, "sortOrder"),
    title: localizedText(formData, "title"),
    summary: localizedText(formData, "summary"),
    outcomes: localizedList(formData, "outcomes"),
    process: localizedList(formData, "process"),
    ctaLabel: localizedText(formData, "ctaLabel"),
  };

  if (id) {
    await db.update(services).set(values).where(eq(services.id, id));
  } else {
    await db.insert(services).values(values);
  }

  revalidateAll();
}

export async function deleteServiceAction(formData: FormData) {
  await requireAdmin();
  await requireDatabase()
    .delete(services)
    .where(eq(services.id, textValue(formData, "id")));
  revalidateAll();
}

export async function saveTestimonialAction(formData: FormData) {
  await requireAdmin();
  const db = requireDatabase();
  const id = textValue(formData, "id");
  const values = {
    sortOrder: numberValue(formData, "sortOrder"),
    name: textValue(formData, "name"),
    role: textValue(formData, "role"),
    company: textValue(formData, "company"),
    avatarUrl: textValue(formData, "avatarUrl"),
    quote: localizedText(formData, "quote"),
  };

  if (id) {
    await db.update(testimonials).set(values).where(eq(testimonials.id, id));
  } else {
    await db.insert(testimonials).values(values);
  }

  revalidateAll();
}

export async function deleteTestimonialAction(formData: FormData) {
  await requireAdmin();
  await requireDatabase()
    .delete(testimonials)
    .where(eq(testimonials.id, textValue(formData, "id")));
  revalidateAll();
}

export async function saveSettingsAction(formData: FormData) {
  await requireAdmin();
  const values = {
    id: "main",
    heroEyebrow: localizedText(formData, "heroEyebrow"),
    heroTitle: localizedText(formData, "heroTitle"),
    heroBody: localizedText(formData, "heroBody"),
    aboutBody: localizedText(formData, "aboutBody"),
    employerIntro: localizedText(formData, "employerIntro"),
    servicesIntro: localizedText(formData, "servicesIntro"),
    contactIntro: localizedText(formData, "contactIntro"),
    socialLinks: parseLines(textValue(formData, "socialLinks")).map((item) => {
      const [label, href] = item.split("|").map((part) => part.trim());
      return { label, href } satisfies SocialLink;
    }),
    contactEmail: textValue(formData, "contactEmail"),
    bookingEnabled: checkboxValue(formData, "bookingEnabled"),
    bookingProvider: "google-calendar" as BookingProvider,
    bookingUrl: textValue(formData, "bookingUrl") || null,
    resumeUrl: textValue(formData, "resumeUrl") || null,
  };

  await requireDatabase()
    .insert(siteSettings)
    .values(values)
    .onConflictDoUpdate({
      target: siteSettings.id,
      set: values,
    });

  revalidateAll();
}

export async function updateInquiryStatusAction(formData: FormData) {
  await requireAdmin();
  const id = textValue(formData, "id");
  const status = textValue(formData, "status") as InquiryStatus;
  await updateInquiryStatus(id, status);
  revalidatePath("/admin");
}
