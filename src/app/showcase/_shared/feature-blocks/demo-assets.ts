import type { ProjectAssetRecord } from "@/lib/assets";

const DEMO_ASSET_TIMESTAMP = new Date("2026-03-29T12:00:00.000Z");
const DEMO_PROJECT_ID = "showcase-feature-blocks";

function createDemoAsset(id: string, publicUrl: string, originalFilename: string): ProjectAssetRecord {
  return {
    id,
    projectId: DEMO_PROJECT_ID,
    kind: "image",
    storageKey: `public/showcase/${originalFilename}`,
    originalFilename,
    mimeType: originalFilename.endsWith(".svg") ? "image/svg+xml" : "image/avif",
    sizeBytes: 0,
    width: null,
    height: null,
    alt: originalFilename.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "),
    createdAt: DEMO_ASSET_TIMESTAMP,
    updatedAt: DEMO_ASSET_TIMESTAMP,
    publicUrl,
  };
}

export const featureBlocksDemoAssets: ProjectAssetRecord[] = [
  createDemoAsset("showcase-hero-media", "/showcase/image-example-05.avif", "image-example-05.avif"),
  createDemoAsset("showcase-hero-centered-media", "/showcase/image-example-04.avif", "image-example-04.avif"),
  createDemoAsset("showcase-feature-01", "/showcase/image-example-01.avif", "image-example-01.avif"),
  createDemoAsset("showcase-feature-02", "/showcase/image-example-02.avif", "image-example-02.avif"),
  createDemoAsset("showcase-feature-03", "/showcase/image-example-03.avif", "image-example-03.avif"),
  createDemoAsset("showcase-gallery-01", "/showcase/image-example-01.avif", "image-example-01.avif"),
  createDemoAsset("showcase-gallery-02", "/showcase/image-example-02.avif", "image-example-02.avif"),
  createDemoAsset("showcase-gallery-03", "/showcase/image-example-03.avif", "image-example-03.avif"),
  createDemoAsset("showcase-project-01", "/showcase/example-image.avif", "example-image.avif"),
  createDemoAsset("showcase-project-02", "/showcase/image-example-02.avif", "image-example-02.avif"),
  createDemoAsset("showcase-project-entry-01", "/showcase/image-example-01.avif", "image-example-01.avif"),
  createDemoAsset("showcase-project-entry-02", "/showcase/image-example-02.avif", "image-example-02.avif"),
  createDemoAsset("showcase-project-entry-03", "/showcase/image-example-03.avif", "image-example-03.avif"),
  createDemoAsset("showcase-testimonial-01", "/showcase/portrait-01.avif", "portrait-01.avif"),
  createDemoAsset("showcase-testimonial-02", "/showcase/portrait-02.avif", "portrait-02.avif"),
  createDemoAsset("showcase-testimonial-03", "/showcase/portrait-03.avif", "portrait-03.avif"),
  createDemoAsset("showcase-testimonial-04", "/showcase/portrait-04.avif", "portrait-04.avif"),
];
