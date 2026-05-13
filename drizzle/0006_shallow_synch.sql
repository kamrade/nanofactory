CREATE TYPE "public"."project_border_radius_policy" AS ENUM('none', 'md', 'lg');--> statement-breakpoint
CREATE TYPE "public"."project_mode_policy" AS ENUM('switchable', 'light-only', 'dark-only');--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "mode_policy" "project_mode_policy" DEFAULT 'switchable' NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "border_radius_policy" "project_border_radius_policy" DEFAULT 'lg' NOT NULL;