CREATE TYPE "public"."project_surface_style" AS ENUM('default', 'flat');--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "surface_style" "project_surface_style" DEFAULT 'default' NOT NULL;