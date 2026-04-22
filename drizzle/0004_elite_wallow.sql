CREATE TYPE "public"."user_role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TABLE "background_scene_library" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"scene_json" jsonb NOT NULL,
	"created_by_user_id" uuid,
	"source_project_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "role" "user_role" DEFAULT 'user' NOT NULL;--> statement-breakpoint
ALTER TABLE "background_scene_library" ADD CONSTRAINT "background_scene_library_created_by_user_id_users_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "background_scene_library" ADD CONSTRAINT "background_scene_library_source_project_id_projects_id_fk" FOREIGN KEY ("source_project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint
UPDATE "users"
SET "role" = 'admin'
WHERE "email" = 'test.user@nanofactory.local';
--> statement-breakpoint
INSERT INTO "background_scene_library" (
  "id",
  "name",
  "scene_json",
  "created_by_user_id",
  "source_project_id",
  "created_at",
  "updated_at"
)
SELECT
  bs."id",
  bs."name",
  bs."scene_json",
  p."user_id",
  bs."project_id",
  bs."created_at",
  bs."updated_at"
FROM "background_scenes" bs
INNER JOIN "projects" p ON p."id" = bs."project_id"
ON CONFLICT ("id") DO NOTHING;
