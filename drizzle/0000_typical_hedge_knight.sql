CREATE TABLE "inquiries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"inquiry_type" text NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"company" text,
	"project_type" text,
	"budget_range" text,
	"timeline" text,
	"wants_call" boolean DEFAULT false NOT NULL,
	"message" text NOT NULL,
	"locale" text NOT NULL,
	"status" text DEFAULT 'new' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "media_assets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"file_name" text NOT NULL,
	"url" text NOT NULL,
	"mime_type" text NOT NULL,
	"width" integer,
	"height" integer,
	"alt" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"title" jsonb NOT NULL,
	"summary" jsonb NOT NULL,
	"overview" jsonb NOT NULL,
	"challenge" jsonb NOT NULL,
	"approach" jsonb NOT NULL,
	"outcome" jsonb NOT NULL,
	"role" jsonb NOT NULL,
	"tags" jsonb NOT NULL,
	"stack" jsonb NOT NULL,
	"cover_image" text NOT NULL,
	"gallery" jsonb NOT NULL,
	"repository" text,
	"live_url" text,
	"demo_url" text,
	"repo_description" text,
	"repo_stars" integer,
	"repo_forks" integer,
	"repo_updated_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "projects_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "services" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"icon" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"title" jsonb NOT NULL,
	"summary" jsonb NOT NULL,
	"outcomes" jsonb NOT NULL,
	"process" jsonb NOT NULL,
	"cta_label" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "services_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "site_settings" (
	"id" text PRIMARY KEY NOT NULL,
	"hero_eyebrow" jsonb NOT NULL,
	"hero_title" jsonb NOT NULL,
	"hero_body" jsonb NOT NULL,
	"about_body" jsonb NOT NULL,
	"employer_intro" jsonb NOT NULL,
	"services_intro" jsonb NOT NULL,
	"contact_intro" jsonb NOT NULL,
	"social_links" jsonb NOT NULL,
	"contact_email" text NOT NULL,
	"calendly_url" text,
	"resume_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "testimonials" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"name" text NOT NULL,
	"role" text NOT NULL,
	"company" text NOT NULL,
	"avatar_url" text NOT NULL,
	"quote" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
