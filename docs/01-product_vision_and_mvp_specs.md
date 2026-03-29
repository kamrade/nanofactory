# Product Vision & MVP Spec

## 1. Product Summary

We are building a **Carrd-like SaaS landing page builder**.

The core idea is:

* simple
* opinionated
* visually polished
* based on predefined components
* optimized for one-page websites

This is **not** a fully flexible no-code builder.
The user should not be able to break the design easily.

---

## 2. Product Principles

### Core principles

* **One-page sites only**
* **Predefined sections / blocks**
* **Strong design constraints**
* **Theme applies to the whole site**
* **Fast publishing**
* **Good default taste**

### Non-goals for the early product

* freeform canvas editing
* pixel-perfect layout tools
* multipage websites
* advanced integrations
* forms/CRM in MVP
* custom domains in MVP
* version history in MVP

---

## 3. Product Type

This is a **B2C/B2B-lite SaaS product** in the spirit of **Carrd**.

The target experience is:

* very fast onboarding
* easy page creation
* beautiful output with minimal effort

---

## 4. User Flow

1. User signs in
2. User creates a new project or opens an existing one
3. User builds the page using predefined blocks
4. User applies a site-wide theme
5. User publishes the project
6. Published project is available on a platform URL
7. Later, user can connect a custom domain

---

## 5. Builder Model

### Core builder philosophy

The product should be an **opinionated structured builder**, not a freeform design tool.

### Editing model

* user adds blocks
* user reorders blocks
* user edits block content/settings
* user chooses a global theme
* layout freedom is intentionally limited

### Block examples

* Hero
* Features
* CTA
* Pricing
* Testimonials
* FAQ
* Footer

Initial focus should be on a **small, high-quality block library**, not a huge catalog.

---

## 6. Theme Model

Themes are **global**, not per-component.

A theme should control the visual language of the whole page, including things like:

* colors
* typography
* spacing rhythm
* border radius
* shadows
* button styles

Goal:

> themes should make the whole site feel coherent by default.

---

## 7. Content Model

A landing page should be represented as structured data, not as arbitrary HTML.

Conceptually:

* a page is a list of blocks
* each block has a type and props
* the page is rendered from structured JSON/data

This makes the system easier to:

* store
* render
* validate
* evolve
* publish

---

## 8. Publishing Strategy

### MVP publishing

Use a simple path-based public URL:

`nanofactory24.com/p/<slug>`

Why:

* easiest to implement
* simplest routing model
* no wildcard DNS dependency for MVP

### Later publishing stages

1. `nanofactory24.com/p/<slug>`
2. `<slug>.nanofactory24.com`
3. custom domains

---

## 9. Custom Domains Strategy

Custom domains are **important**, but **not part of MVP**.

### Why they are deferred

They require additional infrastructure:

* DNS guidance/verification
* SSL certificate issuance and renewal
* host-based routing
* domain ownership/status management

### Long-term goal

Users should be able to connect their own domain or subdomain to a published project.

### Recommended future domain model

Domains should likely be a separate entity from projects, with fields like:

* project reference
* host
* type
* status
* primary flag
* verification token

---

## 10. Auth Strategy

Auth is recommended early, because the product needs:

* project ownership
* user-specific dashboards
* publishing ownership
* future support for domains and billing

### MVP auth philosophy

Keep auth simple:

* single-user ownership model
* no teams
* no complex permissions
* no advanced roles

Possible options:

* email/password
* magic link

---

## 11. MVP Scope

### Included in MVP

* authentication
* create/open project
* simple project dashboard
* block-based editor
* global themes
* reorder blocks
* publish landing page
* public page at `/p/[slug]`

### Excluded from MVP

* version history
* custom domains
* multipage support
* forms/integrations
* analytics
* billing
* AI generation
* collaboration/team features

---

## 12. Data / Domain Direction

At a high level, the platform should evolve around concepts like:

* users
* projects
* page content
* themes
* published pages
* domains (later)

A useful conceptual direction is:

* **Project** = container
* **Page** = currently one page per project
* **Content** = structured block data
* **Theme** = site-wide design system configuration

Even if only one landing page exists initially, this separation helps future growth.

---

## 13. UX Direction for the Editor

The editor should prioritize:

* clarity
* speed
* low cognitive load
* attractive defaults

Recommended early UX:

* add block from a curated list
* edit content in forms/panels
* move blocks up/down or reorder simply
* preview while editing

Avoid in early versions:

* drag-anywhere canvas
* complex positioning
* too many knobs

---

## 14. Product Quality Strategy

The product should prioritize:

* fewer blocks, but better blocks
* fewer themes, but more coherent themes
* strict constraints over excessive flexibility

Key principle:

> users should get a good-looking landing page by default.

---

## 15. Suggested Release Phases

### Phase 1 — MVP

* auth
* projects
* editor
* small block set
* global themes
* publish to path URL

### Phase 2

* better editor UX
* draft/published separation
* block duplication
* better previewing

### Phase 3

* platform subdomains
* custom domains

### Phase 4

* forms/integrations
* analytics
* billing
* advanced publishing features

---

## 16. Strategic Summary

We are building:

* a focused landing page builder
* inspired by Carrd
* based on constraints, not maximum freedom
* optimized for speed and taste
* with global themes and structured blocks
* with simple publishing first and custom domains later

### Final product direction

A user should be able to go from:
**sign in → create project → add blocks → choose theme → publish**
in a very short amount of time, while getting a polished result.
