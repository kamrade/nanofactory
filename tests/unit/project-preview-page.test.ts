import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ProjectPreviewPageWithDependencies } from "@/app/(protected)/projects/[projectId]/preview/page";

const dependencies = {
  requireCurrentUser: vi.fn(),
  getProjectByIdForUser: vi.fn(),
  getAssetsByProjectIdForUser: vi.fn(),
  getPreviewDraft: vi.fn(),
  normalizePageContent: vi.fn((input: unknown) => input),
};

describe("ProjectPreviewPageWithDependencies theme resolution", () => {
  beforeEach(() => {
    dependencies.requireCurrentUser.mockReset();
    dependencies.getProjectByIdForUser.mockReset();
    dependencies.getAssetsByProjectIdForUser.mockReset();
    dependencies.getPreviewDraft.mockReset();
    dependencies.normalizePageContent.mockClear();

    dependencies.requireCurrentUser.mockResolvedValue({ id: "user-1" });
    dependencies.getProjectByIdForUser.mockResolvedValue({
      id: "project-1",
      userId: "user-1",
      name: "My Project",
      slug: "my-project",
      themeKey: "sunwash",
      status: "draft",
      publishedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      contentId: "content-1",
      contentJson: { blocks: [] },
      schemaVersion: 1,
    });
    dependencies.getAssetsByProjectIdForUser.mockResolvedValue([]);
    dependencies.getPreviewDraft.mockReturnValue(null);
  });

  it("applies query theme override when theme key is valid", async () => {
    const element = await ProjectPreviewPageWithDependencies(
      {
        params: Promise.resolve({ projectId: "project-1" }),
        searchParams: Promise.resolve({ theme: "nightfall" }),
      },
      dependencies
    );

    const html = renderToStaticMarkup(element);

    expect(html).toContain('data-theme="nightfall"');
    expect(html).toContain("Theme preview: nightfall.");
  });

  it("uses project theme when theme query is missing", async () => {
    const element = await ProjectPreviewPageWithDependencies(
      {
        params: Promise.resolve({ projectId: "project-1" }),
        searchParams: Promise.resolve({}),
      },
      dependencies
    );

    const html = renderToStaticMarkup(element);

    expect(html).toContain('data-theme="sunwash"');
    expect(html).toContain("Theme: sunwash.");
  });

  it("ignores invalid query theme and falls back to project theme", async () => {
    const element = await ProjectPreviewPageWithDependencies(
      {
        params: Promise.resolve({ projectId: "project-1" }),
        searchParams: Promise.resolve({ theme: "unknown-theme" }),
      },
      dependencies
    );

    const html = renderToStaticMarkup(element);

    expect(html).toContain('data-theme="sunwash"');
    expect(html).toContain("Theme: sunwash.");
  });
});
