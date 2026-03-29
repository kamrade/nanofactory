# 📦 Database & Environment Strategy (Spec)

## 1. Overview

We are building a Next.js application with a PostgreSQL database managed via **Drizzle ORM**.

The database is **owned by this application**, and its schema is controlled through code (`schema.ts`) and migrations.

---

## 2. Environments

We maintain three main environments:

### Local

* Next.js runs locally
* Can connect to:

  * Local database (default)
  * Dev database (via SSH tunnel)

### Dev

* Next.js deployed in Dokploy
* Uses dedicated Dev database

### Prod

* Next.js deployed in separate Dokploy project
* Uses dedicated Prod database

---

## 3. Environment Rules

| Environment | App Location | Database    | Notes                  |
| ----------- | ------------ | ----------- | ---------------------- |
| Local       | Local        | Local / Dev | Can switch via env     |
| Dev         | Server       | Dev         | Shared dev environment |
| Prod        | Server       | Prod        | Fully isolated         |

### Key Principles

* Dev and Prod databases are strictly separated
* Local development should prefer local DB for safety
* Dev DB can be used for integration testing

---

## 4. Database Source of Truth

We follow:

👉 **Code-first approach (Drizzle schema is the source of truth)**

### Workflow

1. Update `db/schema.ts`
2. Generate migration (`db:generate`)
3. Apply migration (`db:migrate`)
4. Deploy

---

## 5. Migrations Strategy

### Development Phase

* Local: `db:push` allowed for fast iteration

### Stable Phase

* Dev: use `generate + migrate`
* Prod: use **only migrations**

### Rules

* Never use `push` in production
* Always review generated SQL before applying
* Migrations must be committed to repo

---

## 6. Seeding Strategy

### Definition

Seeds are scripts that populate the database with initial or test data.

---

### Types of Seeds

#### 1. System Seeds

Required for application to function

* roles
* system configs
* enums / statuses

#### 2. Dev Seeds

Used for development

* test users
* demo content
* sample data

#### 3. Local Seeds

Used only locally

* large datasets
* UI testing data

---

## 7. Seed Execution Rules

| Environment | Seeds                |
| ----------- | -------------------- |
| Local       | system + dev + local |
| Dev         | system + dev         |
| Prod        | system only          |

### Requirements

* Seeds must be **idempotent** (safe to run multiple times)
* No duplicate data
* No destructive operations in Prod

---

## 8. Project Structure

```
db/
  schema.ts
  index.ts
  seeds/
    system.ts
    dev.ts
    local.ts
```

---

## 9. Connection Strategy

Connection is controlled via `DATABASE_URL`.

### Local switching:

* `.env` → local DB
* `.env.dev` → dev DB (via SSH tunnel)

---

## 10. Safety Rules

* Never run destructive operations on Prod manually
* Always test migrations on Dev before Prod
* Avoid using Dev DB for experiments when possible
* Prefer local DB for schema experimentation

---

## 11. Future Improvements

* Add automated migration pipeline (CI/CD)
* Add seed scripts CLI (`seed:dev`, `seed:prod`)
* Add backup strategy for Prod DB

---

## ✅ Summary

* Drizzle schema is the source of truth
* Migrations control schema changes
* Seeds control initial data
* Environments are isolated (especially Prod)
* Local can switch between DBs for flexibility
