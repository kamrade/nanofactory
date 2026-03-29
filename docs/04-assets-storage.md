# Assets Storage Spec

## 1. Purpose

This document defines how uploaded assets should be handled in the landing page builder.

The goal is to keep the system:

* simple in MVP
* safe
* scalable
* compatible with future image optimization needs

---

## 2. Scope

In MVP, assets are primarily:

* images
* logos
* simple visual files used inside landing page blocks

Typical use cases:

* hero images
* logos
* section illustrations
* favicon later
* OG images later

---

## 3. Storage Strategy

### Decision

Physical files should be stored in **object storage**, not in Postgres.

Postgres should store only **asset metadata**.

### Why

* better scalability
* smaller and cleaner database backups
* easier public delivery
* better compatibility with CDN and future optimization pipelines
* simpler long-term architecture

---

## 4. Storage Provider

### MVP choice

Use **Cloudflare R2** as the primary object storage.

### Why

* S3-compatible API
* simple integration with Node.js / Next.js
* no egress charges to the internet
* good fit for public asset delivery
* strong enough for MVP and later stages

### Notes

* do not rely on `r2.dev` for production delivery
* production assets should be served through a custom domain such as:

  * `assets.nanofactory24.com`

---

## 5. Ownership Model

### MVP decision

Assets are **project-owned**.

This means:

* every asset belongs to a project
* assets are uploaded in the context of a project
* asset cleanup can be tied to project lifecycle

### Why

* simpler than a user-wide media library
* easier ownership rules
* simpler UI and access control in MVP

### Future direction

Later, assets may evolve into a shared media library or become user-owned with optional project linkage.

---

## 6. Database Model

The database should store metadata about uploaded files.

### Asset fields

* `id`
* `projectId`
* `storageKey`
* `originalFilename`
* `mimeType`
* `sizeBytes`
* `width`
* `height`
* `alt`
* `createdAt`
* `updatedAt`

### Notes

* `storageKey` points to the object path in R2
* width/height are useful for rendering and editor previews
* `alt` can support accessibility and SEO later

---

## 7. Content Integration

Page content should not store raw object URLs.

### Decision

Blocks should reference uploaded files by `assetId`.

### Example

```json
{
  "id": "hero-1",
  "type": "hero",
  "props": {
    "title": "Hello",
    "imageAssetId": "asset_123"
  }
}
```

### Why

* storage provider can change without rewriting content
* public delivery URL can change later
* assets can be validated and owned properly
* future transformations can be resolved dynamically

---

## 8. Object Key Strategy

Stored files should use generated storage keys, not raw original filenames.

### Recommended shape

Examples:

* `projects/<projectId>/assets/<uuid>`
* `projects/<projectId>/assets/<uuid>.webp`

### Why

* avoids filename collisions
* avoids unsafe naming issues
* makes storage layout predictable

---

## 9. Upload Validation Rules

In MVP, uploads should be restricted.

### Allowed formats

* `image/jpeg`
* `image/png`
* `image/webp`

### Not allowed initially

* SVG
* arbitrary documents
* video

### Suggested limits

* max file size: 10 MB
* validate MIME type
* validate extension
* validate image dimensions if needed

### Why SVG is excluded in MVP

SVG can introduce sanitization and security complexity.
It can be revisited later with proper handling.

---

## 10. Delivery Strategy

### MVP

* upload original file
* store as-is
* serve from object storage through a custom domain

### Early non-goals

* thumbnails
* transformations
* automatic format conversion
* background processing pipeline

### Future direction

Possible later additions:

* generated variants
* responsive image sizes
* WebP/AVIF conversions
* image optimization pipeline

---

## 11. Upload Flow

### Recommended flow

1. user selects a file in the editor
2. application validates file type and size
3. file is uploaded to object storage
4. metadata record is created in Postgres
5. editor stores/references `assetId`
6. renderer resolves `assetId` to a public URL

---

## 12. Rendering Model

At render time:

* content contains `assetId`
* application resolves the corresponding asset metadata
* application builds or reads the public delivery URL
* component renders image using resolved URL

This keeps page content clean and storage-agnostic.

---

## 13. Safety and Operations

### Rules

* do not store binary files in Postgres
* validate uploads on the server
* restrict allowed MIME types
* use generated storage keys
* keep delivery domain separate from app domain if helpful

### Future operational concerns

* orphaned asset cleanup
* replacing/deleting project assets
* usage quotas
* per-project storage limits

---

## 14. MVP Summary

For MVP:

* assets are project-owned
* files are stored in Cloudflare R2
* metadata is stored in Postgres
* blocks reference files by `assetId`
* uploads are limited to safe image formats
* no advanced optimization pipeline yet

This provides a clean and scalable foundation without overengineering early asset handling.
