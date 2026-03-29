1. Project Overview
Name: Nanofactory (Carrd-like SaaS builder)

Tech Stack: Next.js (App Router), Drizzle ORM, PostgreSQL (Dokploy), Cloudflare R2 (Storage).

Core Logic: Opinionated, block-based landing page builder. Structured JSON content over freeform HTML.

2. Infrastructure & Environments
Deployment: Dokploy on Hetzner.

DB Strategy: * Local: .env -> Local Postgres / Dev DB via SSH Tunnel (localhost:5433).

Dev/Prod: Isolated databases within Dokploy.

Schema Source of Truth: db/schema.ts (Drizzle).

Rule: Use db:push for local iteration; generate + migrate for stable Dev/Prod.

3. Domain Model (MVP)
User: Owner of projects.

Project: Main entity. Contains slug (for URL /p/[slug]), themeKey, and status (draft/published).

ProjectContent: Linked 1:1 to Project. Stores contentJson (JSONB).

Asset: Metadata for files in R2. Linked to projectId.

Constraint: Content JSON references assets by assetId, not raw URLs.

4. Content & Theme Model
Content Structure: ```typescript
{ blocks: Array<{ id: string, type: string, props: Record<string, any> }> }

Themes: Global only. Managed via themeKey (CSS variables mapping). No per-block styling freedom in MVP.

5. Asset Handling
Storage: Cloudflare R2 (S3-compatible).

Logic: Assets are project-owned. Only safe images (JPG, PNG, WEBP) allowed. Max 10MB.

Path: projects/<projectId>/assets/<uuid>.

6. Development Rules
No Feature Creep: No multi-page, no custom domains, no complex forms in Phase 1.

Design First: User should not be able to "break" the layout. Constraints are features.

JSON Integrity: Application layer must validate contentJson against block schemas.
