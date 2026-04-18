import {
  boolean,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import type {
  BookingProvider,
  InquiryStatus,
  InquiryType,
  LocalizedList,
  LocalizedText,
  ProjectGalleryItem,
  SocialLink,
} from "@/lib/types";

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
};

export const projects = pgTable("projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull().unique(),
  featured: boolean("featured").default(false).notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  title: jsonb("title").$type<LocalizedText>().notNull(),
  summary: jsonb("summary").$type<LocalizedText>().notNull(),
  overview: jsonb("overview").$type<LocalizedText>().notNull(),
  challenge: jsonb("challenge").$type<LocalizedText>().notNull(),
  approach: jsonb("approach").$type<LocalizedText>().notNull(),
  outcome: jsonb("outcome").$type<LocalizedText>().notNull(),
  role: jsonb("role").$type<LocalizedText>().notNull(),
  tags: jsonb("tags").$type<string[]>().notNull(),
  stack: jsonb("stack").$type<string[]>().notNull(),
  coverImage: text("cover_image").notNull(),
  gallery: jsonb("gallery").$type<ProjectGalleryItem[]>().notNull(),
  repository: text("repository"),
  liveUrl: text("live_url"),
  demoUrl: text("demo_url"),
  repoDescription: text("repo_description"),
  repoStars: integer("repo_stars"),
  repoForks: integer("repo_forks"),
  repoUpdatedAt: timestamp("repo_updated_at", { withTimezone: true }),
  ...timestamps,
});

export const services = pgTable("services", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull().unique(),
  icon: text("icon").notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  title: jsonb("title").$type<LocalizedText>().notNull(),
  summary: jsonb("summary").$type<LocalizedText>().notNull(),
  outcomes: jsonb("outcomes").$type<LocalizedList>().notNull(),
  process: jsonb("process").$type<LocalizedList>().notNull(),
  ctaLabel: jsonb("cta_label").$type<LocalizedText>().notNull(),
  ...timestamps,
});

export const testimonials = pgTable("testimonials", {
  id: uuid("id").defaultRandom().primaryKey(),
  sortOrder: integer("sort_order").default(0).notNull(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  company: text("company").notNull(),
  avatarUrl: text("avatar_url").notNull(),
  quote: jsonb("quote").$type<LocalizedText>().notNull(),
  ...timestamps,
});

export const mediaAssets = pgTable("media_assets", {
  id: uuid("id").defaultRandom().primaryKey(),
  fileName: text("file_name").notNull(),
  url: text("url").notNull(),
  mimeType: text("mime_type").notNull(),
  width: integer("width"),
  height: integer("height"),
  alt: jsonb("alt").$type<LocalizedText>().notNull(),
  ...timestamps,
});

export const siteSettings = pgTable("site_settings", {
  id: text("id").primaryKey(),
  heroEyebrow: jsonb("hero_eyebrow").$type<LocalizedText>().notNull(),
  heroTitle: jsonb("hero_title").$type<LocalizedText>().notNull(),
  heroBody: jsonb("hero_body").$type<LocalizedText>().notNull(),
  aboutBody: jsonb("about_body").$type<LocalizedText>().notNull(),
  employerIntro: jsonb("employer_intro").$type<LocalizedText>().notNull(),
  servicesIntro: jsonb("services_intro").$type<LocalizedText>().notNull(),
  contactIntro: jsonb("contact_intro").$type<LocalizedText>().notNull(),
  socialLinks: jsonb("social_links").$type<SocialLink[]>().notNull(),
  contactEmail: text("contact_email").notNull(),
  bookingEnabled: boolean("booking_enabled").default(true).notNull(),
  bookingProvider: text("booking_provider").$type<BookingProvider>().default("google-calendar").notNull(),
  bookingUrl: text("booking_url"),
  resumeUrl: text("resume_url"),
  ...timestamps,
});

export const inquiries = pgTable("inquiries", {
  id: uuid("id").defaultRandom().primaryKey(),
  inquiryType: text("inquiry_type").$type<InquiryType>().notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  company: text("company"),
  projectType: text("project_type"),
  budgetRange: text("budget_range"),
  timeline: text("timeline"),
  wantsCall: boolean("wants_call").default(false).notNull(),
  message: text("message").notNull(),
  locale: text("locale").notNull(),
  status: text("status").$type<InquiryStatus>().default("new").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
