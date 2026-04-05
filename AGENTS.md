<!-- BEGIN:nextjs-agent-rules -->
For more information about the project, see the MD files in the .ai folder

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# 🤖 Project Agent Guidelines

## Overview

This project is a Next.js application using PostgreSQL with Drizzle ORM.

The database is **owned by this application** and follows a **code-first approach**.

---

## 🧠 Source of Truth

- Database schema is defined in: `db/schema.ts`
- Schema changes must go through migrations
- Do NOT modify database structure manually in production

---

## 🛠️ Migrations

### Allowed:
- Local: `db:push` (for fast iteration only)
- Dev: `db:generate` + `db:migrate`
- Prod: `db:migrate` ONLY

### запрещено:
- ❌ `db:push` in production
- ❌ manual schema changes in DB

---

## 🌱 Seeding

### Seed types:
- **system** → required for app (roles, configs)
- **dev** → demo/test data
- **local** → large/test datasets

### Usage:
- Local → system + dev + local
- Dev → system + dev
- Prod → system only

### Rules:
- Seeds must be idempotent
- No destructive operations in production

---

## 🌍 Environments

| Env   | App        | Database |
|-------|------------|----------|
| Local | local      | local/dev |
| Dev   | server     | dev      |
| Prod  | server     | prod     |

### Notes:
- Local can switch DB via `DATABASE_URL`
- Dev and Prod must remain isolated
- Never use Prod DB for development/testing

---

## 🔌 Database Access

- Connection is defined via `DATABASE_URL`
- Never expose DB credentials to client-side code
- DB access must remain server-only

---

## ⚠️ Safety Rules

- Always test migrations on Dev before Prod
- Prefer local DB for experiments
- Do not run destructive queries on Prod
- Review generated SQL before applying migrations

---

## 📂 Key Paths

- Schema: `db/schema.ts`
- DB connection: `db/index.ts`
- Seeds: `db/seeds/*`
- Full strategy: `docs/database-strategy.md`

---

## 🚀 Recommended Workflow

1. Update schema
2. Generate migration
3. Apply migration (Dev)
4. Verify
5. Apply migration (Prod)

---

## 📌 Notes for Agents

- Do not assume DB structure outside `schema.ts`
- Do not introduce schema changes without migrations
- Prefer existing query patterns over raw SQL
- Keep changes minimal and explicit.