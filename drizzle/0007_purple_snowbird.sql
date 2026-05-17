CREATE TYPE "public"."project_spacing_scale" AS ENUM('sm', 'md', 'lg');--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "spacing_scale" "project_spacing_scale" DEFAULT 'md' NOT NULL;