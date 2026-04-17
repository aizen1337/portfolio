import { asc, desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import {
  inquiries,
  mediaAssets,
  projects,
  services,
  siteSettings,
  testimonials,
} from "@/db/schema";
import {
  defaultInquiries,
  defaultMediaAssets,
  defaultProjects,
  defaultServices,
  defaultSiteSettings,
  defaultTestimonials,
} from "@/lib/default-content";
import { isDatabaseConfigured } from "@/lib/env";
import type {
  Inquiry,
  InquiryStatus,
  MediaAsset,
  Project,
  Service,
  SiteSettings,
  Testimonial,
} from "@/lib/types";

function serializeDate(value: Date | string | null | undefined) {
  if (!value) return null;
  return typeof value === "string" ? value : value.toISOString();
}

function normalizeProject(project: typeof projects.$inferSelect): Project {
  return {
    ...project,
    repository: project.repository ?? null,
    liveUrl: project.liveUrl ?? null,
    demoUrl: project.demoUrl ?? null,
    repoDescription: project.repoDescription ?? null,
    repoStars: project.repoStars ?? null,
    repoForks: project.repoForks ?? null,
    repoUpdatedAt: serializeDate(project.repoUpdatedAt),
  };
}

function normalizeService(service: typeof services.$inferSelect): Service {
  return service;
}

function normalizeTestimonial(
  testimonial: typeof testimonials.$inferSelect
): Testimonial {
  return testimonial;
}

function normalizeMediaAsset(asset: typeof mediaAssets.$inferSelect): MediaAsset {
  return {
    ...asset,
    width: asset.width ?? null,
    height: asset.height ?? null,
    createdAt: serializeDate(asset.createdAt) ?? new Date().toISOString(),
  };
}

function normalizeInquiry(inquiry: typeof inquiries.$inferSelect): Inquiry {
  return {
    ...inquiry,
    company: inquiry.company ?? null,
    projectType: inquiry.projectType ?? null,
    budgetRange: inquiry.budgetRange ?? null,
    timeline: inquiry.timeline ?? null,
    locale: inquiry.locale as Inquiry["locale"],
    createdAt: serializeDate(inquiry.createdAt) ?? new Date().toISOString(),
  };
}

function normalizeSiteSettings(
  settings: typeof siteSettings.$inferSelect
): SiteSettings {
  return {
    ...settings,
    calendlyUrl: settings.calendlyUrl ?? null,
    resumeUrl: settings.resumeUrl ?? null,
  };
}

export async function getPortfolioData() {
  const [settings, projects, services, testimonials] = await Promise.all([
    getSiteSettings(),
    getProjects(),
    getServices(),
    getTestimonials(),
  ]);

  return { settings, projects, services, testimonials };
}

export async function getSiteSettings(): Promise<SiteSettings> {
  if (!isDatabaseConfigured()) {
    return defaultSiteSettings;
  }

  const row = await getDb().query.siteSettings.findFirst({
    where: eq(siteSettings.id, "main"),
  });

  return row ? normalizeSiteSettings(row) : defaultSiteSettings;
}

export async function getProjects(): Promise<Project[]> {
  if (!isDatabaseConfigured()) {
    return [...defaultProjects].sort((a, b) => a.sortOrder - b.sortOrder);
  }

  const rows = await getDb().select().from(projects).orderBy(asc(projects.sortOrder));
  return rows.map(normalizeProject);
}

export async function getFeaturedProjects() {
  const items = await getProjects();
  return items.filter((project) => project.featured);
}

export async function getProjectBySlug(slug: string) {
  if (!isDatabaseConfigured()) {
    return defaultProjects.find((project) => project.slug === slug) ?? null;
  }

  const row = await getDb().query.projects.findFirst({
    where: eq(projects.slug, slug),
  });

  return row ? normalizeProject(row) : null;
}

export async function getServices(): Promise<Service[]> {
  if (!isDatabaseConfigured()) {
    return [...defaultServices].sort((a, b) => a.sortOrder - b.sortOrder);
  }

  const rows = await getDb().select().from(services).orderBy(asc(services.sortOrder));
  return rows.map(normalizeService);
}

export async function getTestimonials(): Promise<Testimonial[]> {
  if (!isDatabaseConfigured()) {
    return [...defaultTestimonials].sort((a, b) => a.sortOrder - b.sortOrder);
  }

  const rows = await getDb()
    .select()
    .from(testimonials)
    .orderBy(asc(testimonials.sortOrder));
  return rows.map(normalizeTestimonial);
}

export async function getMediaAssets(): Promise<MediaAsset[]> {
  if (!isDatabaseConfigured()) {
    return defaultMediaAssets;
  }

  const rows = await getDb()
    .select()
    .from(mediaAssets)
    .orderBy(desc(mediaAssets.createdAt));
  return rows.map(normalizeMediaAsset);
}

export async function getInquiries(): Promise<Inquiry[]> {
  if (!isDatabaseConfigured()) {
    return defaultInquiries;
  }

  const rows = await getDb()
    .select()
    .from(inquiries)
    .orderBy(desc(inquiries.createdAt));
  return rows.map(normalizeInquiry);
}

export function requireDatabase() {
  if (!isDatabaseConfigured()) {
    throw new Error("DATABASE_URL is not configured.");
  }

  return getDb();
}

export async function updateInquiryStatus(id: string, status: InquiryStatus) {
  await requireDatabase()
    .update(inquiries)
    .set({ status })
    .where(eq(inquiries.id, id));
}
