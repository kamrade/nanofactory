1. Purpose

This document defines the initial domain model for the MVP of the landing page builder.

The goal is to keep the model:

simple
implementation-friendly
scalable enough for future growth
aligned with the product vision

This model is intentionally optimized for the MVP and does not attempt to solve all future requirements at once.

2. Core Product Context

The product is a Carrd-like SaaS landing page builder.

Key assumptions:

only one-page websites in MVP
structured block-based content
global themes
no versioning in MVP
no custom domains in MVP
no multi-page support in MVP
3. Core Entities
3.1 User

Represents the owner of projects.

Responsibility
authentication identity
project ownership
future billing/account linkage
Initial fields
id
email
displayName
createdAt
updatedAt
Notes
one user can own many projects
no teams, collaboration, or roles in MVP
3.2 Project

Represents a landing page project.

A project is the main business entity in the system.

Responsibility
stores project identity and metadata
stores publishing state
links user, content, and theme
Initial fields
id
userId
name
slug
themeKey
status
publishedAt
createdAt
updatedAt
Notes
slug is used for public publishing URLs
status is expected to be one of:
draft
published
one user can have many projects
3.3 ProjectContent

Represents the editable content of a project.

Responsibility
stores the landing page structure
stores the list of blocks and their props
acts as the source for rendering the page
Initial fields
id
projectId
contentJson
schemaVersion
createdAt
updatedAt
Notes
one project has one current content record in MVP
content is stored as JSONB
schemaVersion is included to support future evolution of the content format
4. Content Model

The landing page content is stored as structured JSON rather than HTML.

Conceptual shape
type PageContent = {
  blocks: Block[]
}

type Block = {
  id: string
  type: string
  props: Record<string, unknown>
}
Example
{
  "blocks": [
    {
      "id": "hero-1",
      "type": "hero",
      "props": {
        "title": "Build your idea",
        "subtitle": "Launch fast",
        "buttonText": "Get started"
      }
    },
    {
      "id": "features-1",
      "type": "features",
      "props": {
        "items": [
          { "title": "Fast", "description": "..." },
          { "title": "Simple", "description": "..." }
        ]
      }
    }
  ]
}
Why JSONB is used in MVP
different blocks have different prop structures
the system needs flexibility while block contracts are still evolving
storing structured content is simpler than normalizing blocks into many relational tables
it supports fast iteration in the editor and renderer
Important rule

The JSON content must be validated at the application layer.

5. Theme Model

In MVP, themes are represented as a theme key, not as a separate database-managed entity.

MVP decision

Store a field like:

themeKey

Example values:

classic-light
midnight
warm-editorial
Why
themes are platform-defined in MVP
this is simpler than introducing a themes table too early
themes can be defined in code as a registry/config
Future direction

A dedicated themes entity can be introduced later if themes need to become more dynamic or user-manageable.

6. Publishing Model

In MVP, publishing is handled directly on the Project entity.

MVP decision

Do not create a separate PublishedProject entity yet.

Use:

status
publishedAt
Why
there is no draft/published split yet
there is no version history yet
there is no scheduled publishing yet
the current content is the published content once the project is marked published
Future direction

Separate publish-related entities may be introduced later when the product adds:

draft vs published content
rollback
version history
scheduling
7. Relationships
User → Project
one-to-many
one user owns many projects
Project → ProjectContent
one-to-one in MVP
one project has one current editable content record
8. Constraints and Rules
Users
email must be unique
Projects
slug must be globally unique for public URL routing
status should be constrained to known values
userId must reference an existing user
ProjectContent
projectId must be unique in MVP
projectId must reference an existing project
9. MVP Flow Mapping
Create project
create Project
create empty ProjectContent
Edit project
user updates blocks/content in editor
application writes updated JSON into ProjectContent.contentJson
Publish project
set Project.status = published
set Project.publishedAt
Render public page
resolve project by slug
verify project is published
load ProjectContent
render blocks using the project theme
10. Asset Domain
10.1 Asset

Represents a file uploaded for use inside a project.

In MVP, assets are treated as project-owned.

Responsibility
stores metadata about uploaded files
links uploaded files to a project
supports rendering image-based blocks
keeps storage concerns separate from page content JSON
Initial fields
id
projectId
storageKey
originalFilename
mimeType
sizeBytes
width
height
alt
createdAt
updatedAt
Notes
the physical file should live in object storage, not in Postgres
the database stores metadata only
blocks inside ProjectContent should reference assets by assetId, not by raw storage URL
in MVP, assets belong to projects rather than to a user-wide media library
10.2 Asset Usage in Content

Assets should be referenced from structured content.

Example:

{
  "id": "hero-1",
  "type": "hero",
  "props": {
    "title": "Hello",
    "imageAssetId": "asset_123"
  }
}
10.3 Storage Direction

For MVP and beyond:

physical files should be stored in object storage
Postgres should store metadata only
uploaded images should be validated at the application layer
11. Deliberately Excluded from MVP Domain Model

The following are intentionally excluded for now:

domains
project_versions
pages
forms
analytics
teams
permissions
billing

These can be introduced later once the MVP loop is proven.

12. Future Evolution Path
Likely future additions
domains for platform subdomains and custom domains
project_versions for version history and rollback
pages if multi-page support is introduced
themes as a richer entity if needed
richer asset handling (transformations, variants, media library)
Important note

The MVP model should remain intentionally small. Future flexibility should not justify early overengineering.

13. Strategic Summary

The MVP domain model is intentionally centered around five concepts:

User — who owns the project
Project — what is being edited and published
ProjectContent — the structured page content
ThemeKey — the global visual style
Asset — project-owned uploaded files referenced by content

This gives the product a clean and practical foundation for:

editing
publishing
theming
asset management
future extensions

without introducing unnecessary complexity too early.