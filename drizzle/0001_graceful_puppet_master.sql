ALTER TABLE "projects" ALTER COLUMN "theme_key" SET DEFAULT 'sunwash';
UPDATE "projects" SET "theme_key" = 'sunwash' WHERE "theme_key" = 'classic-light';
