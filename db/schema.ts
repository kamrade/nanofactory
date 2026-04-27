import {
  pgTable,
  text,
  timestamp,
  uuid,
  integer,
  jsonb,
  varchar,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import type {
  PageBlock as BlockContentPageBlock,
  PageContent as BlockContentPageContent,
} from "@/features/blocks/shared/content";
import type { BackgroundScene } from "@/lib/background-scenes/types";

export type PageBlock = BlockContentPageBlock;
export type PageContent = BlockContentPageContent;

export const projectStatusEnum = pgEnum("project_status", ["draft", "published"]);
export const userRoleEnum = pgEnum("user_role", ["user", "admin"]);

// 1. Users
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: userRoleEnum("role").default("user").notNull(),
  displayName: text("display_name"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// 2. Projects
export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  name: text("name").notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  themeKey: text("theme_key").default("sunwash").notNull(),
  status: projectStatusEnum("status").default("draft").notNull(),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// 3. Project contents
export const projectContents = pgTable("project_contents", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .references(() => projects.id, { onDelete: "cascade" })
    .notNull()
    .unique(),
  contentJson: jsonb("content_json")
    .$type<PageContent>()
    .default({ blocks: [] })
    .notNull(),
  schemaVersion: integer("schema_version").default(1).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// 4. Assets
export const assets = pgTable("assets", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .references(() => projects.id, { onDelete: "cascade" })
    .notNull(),
  kind: text("kind").default("image").notNull(),
  storageKey: text("storage_key").notNull(),
  originalFilename: text("original_filename").notNull(),
  mimeType: text("mime_type").notNull(),
  sizeBytes: integer("size_bytes").notNull(),
  width: integer("width"),
  height: integer("height"),
  alt: text("alt"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const backgroundSceneLibrary = pgTable("background_scene_library", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  sceneJson: jsonb("scene_json").$type<BackgroundScene>().notNull(),
  createdByUserId: uuid("created_by_user_id").references(() => users.id, {
    onDelete: "set null",
  }),
  sourceProjectId: uuid("source_project_id").references(() => projects.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  projects: many(projects),
  libraryScenes: many(backgroundSceneLibrary),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  user: one(users, {
    fields: [projects.userId],
    references: [users.id],
  }),
  content: one(projectContents, {
    fields: [projects.id],
    references: [projectContents.projectId],
  }),
  assets: many(assets),
  libraryScenes: many(backgroundSceneLibrary),
}));

export const projectContentsRelations = relations(projectContents, ({ one }) => ({
  project: one(projects, {
    fields: [projectContents.projectId],
    references: [projects.id],
  }),
}));

export const assetsRelations = relations(assets, ({ one }) => ({
  project: one(projects, {
    fields: [assets.projectId],
    references: [projects.id],
  }),
}));

export const backgroundSceneLibraryRelations = relations(
  backgroundSceneLibrary,
  ({ one }) => ({
    createdByUser: one(users, {
      fields: [backgroundSceneLibrary.createdByUserId],
      references: [users.id],
    }),
    sourceProject: one(projects, {
      fields: [backgroundSceneLibrary.sourceProjectId],
      references: [projects.id],
    }),
  })
);
