import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";

import { proxy } from "@/proxy";

function getRewritePathname(response: Response) {
  const rewriteHeader = response.headers.get("x-middleware-rewrite");
  if (!rewriteHeader) {
    return null;
  }
  return new URL(rewriteHeader).pathname;
}

describe("proxy", () => {
  it("rewrites custom domain root to project public route", () => {
    const request = new NextRequest("https://olala.beauty/", {
      headers: { host: "olala.beauty" },
    });

    const response = proxy(request);
    expect(getRewritePathname(response)).toBe("/p/project-n4");
  });

  it("preserves nested pathname for custom domain routes", () => {
    const request = new NextRequest("https://olala.beauty/gallery-1/gallery-1-item-1", {
      headers: { host: "olala.beauty" },
    });

    const response = proxy(request);
    expect(getRewritePathname(response)).toBe("/p/project-n4/gallery-1/gallery-1-item-1");
  });

  it("does not rewrite platform host", () => {
    const request = new NextRequest("https://app.olala.beauty/p/project-n4", {
      headers: { host: "app.olala.beauty" },
    });

    const response = proxy(request);
    expect(getRewritePathname(response)).toBeNull();
  });
});

