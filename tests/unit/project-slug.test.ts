import { describe, expect, it } from "vitest";

import {
  buildProjectSlugCandidate,
  slugifyProjectName,
} from "../../lib/projects/slug";

describe("project slug helpers", () => {
  it("slugifies a regular project name", () => {
    expect(slugifyProjectName("My Project")).toBe("my-project");
  });

  it("collapses symbols and spaces into url-safe slugs", () => {
    expect(slugifyProjectName("  Hello, World! Landing Page  ")).toBe(
      "hello-world-landing-page"
    );
  });

  it('falls back to "project" when input has no slug characters', () => {
    expect(slugifyProjectName("!!!")).toBe("project");
  });

  it("builds predictable duplicate slug candidates", () => {
    expect(buildProjectSlugCandidate("my-project", 1)).toBe("my-project");
    expect(buildProjectSlugCandidate("my-project", 2)).toBe("my-project-2");
    expect(buildProjectSlugCandidate("my-project", 3)).toBe("my-project-3");
  });
});
