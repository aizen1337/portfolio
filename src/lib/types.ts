export const locales = ["en", "pl"] as const;

export type Locale = (typeof locales)[number];
export type LocalizedText = Record<Locale, string>;
export type LocalizedList = Record<Locale, string[]>;
export type InquiryStatus = "new" | "replied" | "archived";
export type InquiryType = "employer" | "client";

export interface Project {
  id: string;
  slug: string;
  featured: boolean;
  sortOrder: number;
  title: LocalizedText;
  summary: LocalizedText;
  overview: LocalizedText;
  challenge: LocalizedText;
  approach: LocalizedText;
  outcome: LocalizedText;
  role: LocalizedText;
  tags: string[];
  stack: string[];
  coverImage: string;
  gallery: string[];
  repository: string | null;
  liveUrl: string | null;
  demoUrl: string | null;
  repoDescription: string | null;
  repoStars: number | null;
  repoForks: number | null;
  repoUpdatedAt: string | null;
}

export interface Service {
  id: string;
  slug: string;
  icon: string;
  sortOrder: number;
  title: LocalizedText;
  summary: LocalizedText;
  outcomes: LocalizedList;
  process: LocalizedList;
  ctaLabel: LocalizedText;
}

export interface Testimonial {
  id: string;
  sortOrder: number;
  name: string;
  role: string;
  company: string;
  avatarUrl: string;
  quote: LocalizedText;
}

export interface MediaAsset {
  id: string;
  fileName: string;
  url: string;
  mimeType: string;
  width: number | null;
  height: number | null;
  alt: LocalizedText;
  createdAt: string;
}

export interface SocialLink {
  label: string;
  href: string;
}

export interface SiteSettings {
  id: string;
  heroEyebrow: LocalizedText;
  heroTitle: LocalizedText;
  heroBody: LocalizedText;
  aboutBody: LocalizedText;
  employerIntro: LocalizedText;
  servicesIntro: LocalizedText;
  contactIntro: LocalizedText;
  socialLinks: SocialLink[];
  contactEmail: string;
  calendlyUrl: string | null;
  resumeUrl: string | null;
}

export interface Inquiry {
  id: string;
  inquiryType: InquiryType;
  name: string;
  email: string;
  company: string | null;
  projectType: string | null;
  budgetRange: string | null;
  timeline: string | null;
  wantsCall: boolean;
  message: string;
  locale: Locale;
  status: InquiryStatus;
  createdAt: string;
}
