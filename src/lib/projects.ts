import "server-only";

import { and, desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { projectContents, projects, type PageContent } from "@/db/schema";
import {
  buildProjectSlugCandidate,
  isValidProjectSlug,
  slugifyProjectName,
} from "@/lib/projects/slug";
import { DEFAULT_THEME_KEY, type ThemeKey } from "@/lib/themes";

type CreateProjectInput = {
  name: string;
  themeKey?: ThemeKey;
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

export async function getPublishedProjectBySlug(slug: string) {
  const [project] = await db
    .select({
      id: projects.id,
      name: projects.name,
      slug: projects.slug,
      themeKey: projects.themeKey,
      status: projects.status,
      publishedAt: projects.publishedAt,
      updatedAt: projects.updatedAt,
      contentJson: projectContents.contentJson,
      schemaVersion: projectContents.schemaVersion,
    })
    .from(projects)
    .leftJoin(projectContents, eq(projectContents.projectId, projects.id))
    .where(and(eq(projects.slug, slug), eq(projects.status, "published")))
    .limit(1);

  if (!project) {
    return null;
  }

  return {
    ...project,
    contentJson: project.contentJson ?? { blocks: [] },
    schemaVersion: project.schemaVersion ?? 1,
  };
}

export async function publishProjectForUser(projectId: string, userId: string) {
  if (!isUuid(projectId)) {
    return null;
  }

  const now = new Date();
  const [project] = await db
    .update(projects)
    .set({
      status: "published",
      publishedAt: now,
      updatedAt: now,
    })
    .where(and(eq(projects.id, projectId), eq(projects.userId, userId)))
    .returning({
      id: projects.id,
      slug: projects.slug,
      status: projects.status,
      publishedAt: projects.publishedAt,
      updatedAt: projects.updatedAt,
    });

  return project ?? null;
}

export async function unpublishProjectForUser(projectId: string, userId: string) {
  if (!isUuid(projectId)) {
    return null;
  }

  const now = new Date();
  const [project] = await db
    .update(projects)
    .set({
      status: "draft",
      publishedAt: null,
      updatedAt: now,
    })
    .where(and(eq(projects.id, projectId), eq(projects.userId, userId)))
    .returning({
      id: projects.id,
      slug: projects.slug,
      status: projects.status,
      publishedAt: projects.publishedAt,
      updatedAt: projects.updatedAt,
    });

  return project ?? null;
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

export async function updateProjectThemeForUser(
  projectId: string,
  userId: string,
  themeKey: ThemeKey
) {
  if (!isUuid(projectId)) {
    return null;
  }

  const now = new Date();
  const [project] = await db
    .update(projects)
    .set({
      themeKey,
      updatedAt: now,
    })
    .where(and(eq(projects.id, projectId), eq(projects.userId, userId)))
    .returning({
      id: projects.id,
      slug: projects.slug,
      themeKey: projects.themeKey,
      updatedAt: projects.updatedAt,
    });

  return project ?? null;
}

export async function updateProjectNameForUser(
  projectId: string,
  userId: string,
  name: string,
  slug: string
) {
  if (!isUuid(projectId)) {
    return null;
  }

  const trimmedName = name.trim();
  const trimmedSlug = slug.trim();

  if (trimmedName.length === 0) {
    return null;
  }

  if (!isValidProjectSlug(trimmedSlug)) {
    return null;
  }

  const normalizedSlug = trimmedSlug.toLowerCase();

  const [existingProject] = await db
    .select({ id: projects.id })
    .from(projects)
    .where(eq(projects.slug, normalizedSlug))
    .limit(1);

  if (existingProject && existingProject.id !== projectId) {
    return null;
  }

  const now = new Date();
  const [project] = await db
    .update(projects)
    .set({
      name: trimmedName,
      slug: normalizedSlug,
      updatedAt: now,
    })
    .where(and(eq(projects.id, projectId), eq(projects.userId, userId)))
    .returning({
      id: projects.id,
      slug: projects.slug,
      name: projects.name,
      updatedAt: projects.updatedAt,
    });

  return project ?? null;
}

export async function createProjectForUser(userId: string, input: CreateProjectInput) {
  const name = input.name.trim();

  if (!name) {
    throw new Error("Project name is required");
  }

  const slug = await generateUniqueProjectSlug(name);
  const themeKey = input.themeKey ?? DEFAULT_THEME_KEY;

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
