ALTER TABLE "site_settings" RENAME COLUMN "calendly_url" TO "booking_url";
ALTER TABLE "site_settings" ADD COLUMN "booking_enabled" boolean DEFAULT true NOT NULL;
ALTER TABLE "site_settings" ADD COLUMN "booking_provider" text DEFAULT 'google-calendar' NOT NULL;
