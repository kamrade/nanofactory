# Nanofactory

Nanofactory is a minimal landing-page builder with a block-based editor, PostgreSQL persistence, and Cloudflare R2 asset storage.

## Stack

- Next.js App Router
- React
- PostgreSQL
- Drizzle ORM
- NextAuth
- Cloudflare R2
- Vitest
- Playwright

## Product Scope

Nanofactory lets an authenticated user:

- sign in
- create projects
- edit page content through structured blocks
- upload image assets for a project
- publish a project to a public URL

Public pages are served by slug at `/p/[slug]`.

## Project Structure

- `app/` - routes, pages, route handlers, server actions
- `components/` - UI components for auth, editor, assets, rendering
- `lib/` - domain logic for projects, assets, editor content, auth, storage
- `db/` - schema, database connection, seeds
- `drizzle/` - generated SQL migrations
- `tests/` - unit, integration, and e2e tests
- `docs/` - product and architecture notes

## Environment

The app uses server-side environment variables through `DATABASE_URL` and auth/storage config.

Main values:

- `DATABASE_URL`
- `AUTH_SECRET`
- `NEXTAUTH_URL`
- `R2_ENDPOINT`
- `R2_BUCKET_NAME`
- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY`
- `R2_PUBLIC_BASE_URL`

Use:

- `.env.example` for local app defaults
- `.env.test.example` for test environment defaults

## Development

Install dependencies:

```bash
npm ci
```

Start the app:

```bash
npm run dev
```

The app runs on `http://localhost:3010`.

## Database Workflow

Schema source of truth:

- `db/schema.ts`

Recommended workflow:

1. Update schema
2. Generate migration
3. Apply migration in dev
4. Verify
5. Apply migration in prod

Available commands:

```bash
npm run db:push
npm run db:generate
npm run db:migrate
```

Notes:

- `db:push` is for local iteration only
- use migrations for stable dev/prod changes
- do not manually change production schema

## Seeds

Available seed/test helpers:

```bash
npm run db:seed:test-user
npm run test:db:setup
npm run test:db:reset
```

Seed policy:

- local: system + dev + local
- dev: system + dev
- prod: system only

## Testing

Run unit and integration tests:

```bash
npm test
```

Watch mode:

```bash
npm run test:watch
```

Coverage:

```bash
npm run test:coverage
```

End-to-end tests:

```bash
npm run test:e2e
```

Run everything:

```bash
npm run test:all
```

## Auth

Authentication is implemented with NextAuth credentials flow.

Key files:

- `auth.ts`
- `app/api/auth/[...nextauth]/route.ts`
- `types/next-auth.d.ts`

## Assets

Assets are project-owned and stored in Cloudflare R2.

Current rules:

- image uploads only
- ownership enforced server-side
- content JSON stores `assetId`, not raw storage URLs

Key files:

- `lib/assets.ts`
- `lib/storage/*`
- `app/api/projects/[projectId]/assets/route.ts`

## Notes

- DB access must remain server-only
- prefer existing query patterns over raw SQL
- keep schema changes explicit and migration-backed

## Related Docs

- `AGENTS.md`
- `docs/02-database-strategy.md`
- `docs/04-assets-storage.md`
