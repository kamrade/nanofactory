import "server-only";

import { and, desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { projectContents, projects, type PageContent } from "@/db/schema";
import { buildProjectSlugCandidate, slugifyProjectName } from "@/lib/projects/slug";

type CreateProjectInput = {
  name: string;
  themeKey?: string;
};

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );
}

async function generateUniqueProjectSlug(baseName: string) {
  const baseSlug = slugifyProjectName(baseName);
  let attempt = 1;

  while (true) {
    const slug = buildProjectSlugCandidate(baseSlug, attempt);
    const [existingProject] = await db
      .select({ id: projects.id })
      .from(projects)
      .where(eq(projects.slug, slug))
      .limit(1);

    if (!existingProject) {
      return slug;
    }

    attempt += 1;
  }
}

export async function getProjectsByUserId(userId: string) {
  return db
    .select({
      id: projects.id,
      name: projects.name,
      slug: projects.slug,
      themeKey: projects.themeKey,
      status: projects.status,
      publishedAt: projects.publishedAt,
      createdAt: projects.createdAt,
      updatedAt: projects.updatedAt,
    })
    .from(projects)
    .where(eq(projects.userId, userId))
    .orderBy(desc(projects.updatedAt), desc(projects.createdAt));
}

export async function getProjectByIdForUser(projectId: string, userId: string) {
  if (!isUuid(projectId)) {
    return null;
  }

  try {
    const [project] = await db
      .select({
        id: projects.id,
        userId: projects.userId,
        name: projects.name,
        slug: projects.slug,
        themeKey: projects.themeKey,
        status: projects.status,
        publishedAt: projects.publishedAt,
        createdAt: projects.createdAt,
        updatedAt: projects.updatedAt,
        contentId: projectContents.id,
        contentJson: projectContents.contentJson,
        schemaVersion: projectContents.schemaVersion,
      })
      .from(projects)
      .leftJoin(projectContents, eq(projectContents.projectId, projects.id))
      .where(and(eq(projects.id, projectId), eq(projects.userId, userId)))
      .limit(1);

    if (!project) {
      return null;
    }

    return {
      ...project,
      contentJson: project.contentJson ?? { blocks: [] },
      schemaVersion: project.schemaVersion ?? 1,
    };
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "cause" in error &&
      typeof error.cause === "object" &&
      error.cause !== null &&
      "code" in error.cause &&
      error.cause.code === "22P02"
    ) {
      return null;
    }

    throw error;
  }
}

export async function saveProjectContentForUser(
  projectId: string,
  userId: string,
  content: PageContent
) {
  if (!isUuid(projectId)) {
    return null;
  }

  const now = new Date();

  return db.transaction(async (tx) => {
    const [project] = await tx
      .select({
        id: projects.id,
      })
      .from(projects)
      .where(and(eq(projects.id, projectId), eq(projects.userId, userId)))
      .limit(1);

    if (!project) {
      return null;
    }

    const [existingContent] = await tx
      .select({
        id: projectContents.id,
      })
      .from(projectContents)
      .where(eq(projectContents.projectId, projectId))
      .limit(1);

    if (existingContent) {
      const [updatedContent] = await tx
        .update(projectContents)
        .set({
          contentJson: content,
          updatedAt: now,
        })
        .where(eq(projectContents.projectId, projectId))
        .returning({
          id: projectContents.id,
          projectId: projectContents.projectId,
          contentJson: projectContents.contentJson,
          schemaVersion: projectContents.schemaVersion,
          updatedAt: projectContents.updatedAt,
        });

      return updatedContent;
    }

    const [createdContent] = await tx
      .insert(projectContents)
      .values({
        projectId,
        contentJson: content,
        schemaVersion: 1,
        updatedAt: now,
      })
      .returning({
        id: projectContents.id,
        projectId: projectContents.projectId,
        contentJson: projectContents.contentJson,
        schemaVersion: projectContents.schemaVersion,
        updatedAt: projectContents.updatedAt,
      });

    return createdContent;
  });
}

export async function createProjectForUser(userId: string, input: CreateProjectInput) {
  const name = input.name.trim();

  if (!name) {
    throw new Error("Project name is required");
  }

  const slug = await generateUniqueProjectSlug(name);
  const themeKey = input.themeKey ?? "classic-light";

  return db.transaction(async (tx) => {
    const [project] = await tx
      .insert(projects)
      .values({
        userId,
        name,
        slug,
        themeKey,
        status: "draft",
      })
      .returning({
        id: projects.id,
        userId: projects.userId,
        name: projects.name,
        slug: projects.slug,
        themeKey: projects.themeKey,
        status: projects.status,
        createdAt: projects.createdAt,
        updatedAt: projects.updatedAt,
      });

    await tx.insert(projectContents).values({
      projectId: project.id,
      contentJson: {
        blocks: [],
      },
      schemaVersion: 1,
    });

    return project;
  });
}
