# Roadmap: автоматизация custom domains для multi-tenant Next.js app

## Контекст

Есть одно Next.js приложение, которое хостит много одностраничных лендингов.

Внутри приложения проекты доступны по route:

```txt
/p/my-project
```

Но нужно, чтобы кастомный домен открывал этот же проект:

```txt
https://my-domain.com
```

Фактически:

```txt
my-domain.com → Next.js app → project lookup → render /p/my-project
```

Текущая ручная схема:

1. Домен вручную добавляется в Dokploy в раздел Domains конкретного приложения.
2. Mapping домена вручную прописывается в `proxy.ts`.

Например:

```ts
const DOMAIN_TO_PROJECT = {
  'my-domain.com': 'my-project',
}
```

Цель — постепенно убрать ручное редактирование кода и прийти к схеме, где новый домен можно подключить через админку без redeploy приложения.

---

# 1. Термины

## Custom domain mapping

Привязка внешнего домена к конкретному проекту внутри SaaS-приложения.

Пример:

```txt
my-domain.com → my-project
client-site.com → another-project
```

## Host-based routing

Routing на основе HTTP `Host` header.

Пример:

```txt
Host: my-domain.com
```

Приложение смотрит на hostname и решает, какой проект нужно отрендерить.

## Multi-tenant custom domains

Архитектура, где одно приложение обслуживает много клиентов/проектов, а каждый проект может иметь свой домен.

---

# 2. Текущая рабочая MVP-схема

```txt
my-domain.com
  ↓ DNS A record
Hetzner server
  ↓
Dokploy / Traefik
  ↓
Next.js app
  ↓
proxy.ts
  ↓
/p/my-project
```

Текущий `proxy.ts` может выглядеть так:

```ts
import { NextRequest, NextResponse } from 'next/server'

export function proxy(req: NextRequest) {
  const url = req.nextUrl.clone()

  const host = req.headers.get('host') || ''
  const hostname = host.split(':')[0].toLowerCase()

  if (hostname === 'my-domain.com' || hostname === 'www.my-domain.com') {
    url.pathname = '/p/my-project'
    return NextResponse.rewrite(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
```

Для первого теста это нормально.

Но для масштабирования плохо, потому что при каждом новом домене нужно:

```txt
1. Менять код.
2. Делать commit.
3. Делать redeploy.
```

---

# 3. Целевая архитектура

Итоговая схема должна быть такой:

```txt
custom-domain.com
  ↓
Dokploy / Traefik / Caddy / Cloudflare
  ↓
Next.js app
  ↓
proxy.ts
  ↓
/domain/[hostname]/[[...path]]
  ↓
PostgreSQL lookup
  ↓
Project
  ↓
PublishedVersion
  ↓
SiteRenderer
```

Главная идея:

```txt
domain → projectId → publishedVersionId → render
```

А не:

```txt
domain → hardcoded route
```

---

# 4. Что должно быть автоматизировано

Есть два разных уровня автоматизации.

## 4.1. Application-level mapping

Это связь:

```txt
my-domain.com → projectId
```

Эту часть нужно хранить в PostgreSQL.

Это первый и самый важный шаг.

## 4.2. Infrastructure-level routing / TLS

Это то, что сейчас делает Dokploy:

```txt
my-domain.com → Next.js container
HTTPS certificate
Traefik routing
```

Эту часть можно сначала оставить ручной.

То есть на первом этапе:

```txt
Dokploy domain добавляется вручную
но domain → project уже хранится в базе
```

---

# 5. Этап 1 — убрать mapping из `proxy.ts`

## Сейчас плохо

```ts
const DOMAIN_TO_PROJECT = {
  'my-domain.com': 'my-project',
}
```

Такой подход плохо масштабируется.

## Нужно

`proxy.ts` не должен знать, какой домен к какому проекту относится.

Он должен только:

1. Получить `hostname`.
2. Понять, является ли это основным доменом платформы.
3. Если это custom domain — переписать запрос во внутренний renderer.

Например:

```txt
my-domain.com
  → /domain/my-domain.com
```

или с path:

```txt
my-domain.com/about
  → /domain/my-domain.com/about
```

---

# 6. Этап 2 — универсальный `proxy.ts`

Пример:

```ts
// proxy.ts

import { NextRequest, NextResponse } from 'next/server'

const PLATFORM_HOSTS = [
  'your-platform.com',
  'www.your-platform.com',
  'app.your-platform.com',
]

function normalizeHostname(host: string) {
  return host
    .split(':')[0]
    .trim()
    .toLowerCase()
    .replace(/\.$/, '')
}

export function proxy(req: NextRequest) {
  const url = req.nextUrl.clone()

  const host = req.headers.get('host') || ''
  const hostname = normalizeHostname(host)

  // Основные домены платформы не трогаем.
  // Они продолжают открывать админку, dashboard, login и т.д.
  if (PLATFORM_HOSTS.includes(hostname)) {
    return NextResponse.next()
  }

  const path = url.pathname

  // Все кастомные домены отправляем во внутренний renderer.
  url.pathname = `/domain/${hostname}${path === '/' ? '' : path}`

  return NextResponse.rewrite(url)
}

export const config = {
  matcher: [
    '/((?!api|debug|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
}
```

После этого `proxy.ts` больше не нужно менять при добавлении нового домена.

---

# 7. Этап 3 — создать internal route для custom domains

Нужна структура:

```txt
app/
  domain/
    [hostname]/
      [[...path]]/
        page.tsx
```

Этот route будет скрытым внутренним renderer'ом.

Пользователь его не видит.

Пользователь открывает:

```txt
https://my-domain.com
```

А Next.js внутри рендерит:

```txt
/domain/my-domain.com
```

Если пользователь открывает:

```txt
https://my-domain.com/about
```

Next.js внутри рендерит:

```txt
/domain/my-domain.com/about
```

---

# 8. Этап 4 — renderer через PostgreSQL lookup

Пример:

```tsx
// app/domain/[hostname]/[[...path]]/page.tsx

import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { SiteRenderer } from '@/components/SiteRenderer'

export default async function DomainPage({
  params,
}: {
  params: Promise<{
    hostname: string
    path?: string[]
  }>
}) {
  const { hostname, path } = await params

  const domain = await prisma.projectDomain.findUnique({
    where: {
      hostname,
    },
    include: {
      project: {
        include: {
          publishedVersion: true,
        },
      },
    },
  })

  if (!domain || domain.status !== 'active') {
    notFound()
  }

  if (!domain.project.publishedVersion) {
    notFound()
  }

  return (
    <SiteRenderer
      project={domain.project}
      version={domain.project.publishedVersion}
      path={path ?? []}
    />
  )
}
```

Важно: Prisma лучше использовать не в `proxy.ts`, а в server component / route handler.

`proxy.ts` должен быть легким.

---

# 9. Этап 5 — добавить таблицу `ProjectDomain`

Пример Prisma-модели:

```prisma
model ProjectDomain {
  id        String   @id @default(cuid())
  hostname  String   @unique
  status    String   @default("pending")

  projectId String
  project   Project  @relation(fields: [projectId], references: [id])

  isPrimary Boolean  @default(false)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

Пример данных:

```txt
hostname: my-domain.com
projectId: project_123
status: active
```

Для `www` можно хранить отдельную запись:

```txt
hostname: www.my-domain.com
projectId: project_123
status: active
```

---

# 10. Этап 6 — сделать ручной script для привязки домена

Для начала можно без UI.

Пример:

```ts
// scripts/link-domain.ts

import { prisma } from '../lib/prisma'

async function main() {
  const project = await prisma.project.findUnique({
    where: {
      slug: 'my-project',
    },
  })

  if (!project) {
    throw new Error('Project not found')
  }

  await prisma.projectDomain.upsert({
    where: {
      hostname: 'my-domain.com',
    },
    update: {
      projectId: project.id,
      status: 'active',
    },
    create: {
      hostname: 'my-domain.com',
      projectId: project.id,
      status: 'active',
    },
  })

  await prisma.projectDomain.upsert({
    where: {
      hostname: 'www.my-domain.com',
    },
    update: {
      projectId: project.id,
      status: 'active',
    },
    create: {
      hostname: 'www.my-domain.com',
      projectId: project.id,
      status: 'active',
    },
  })
}

main()
  .then(() => {
    console.log('Domain linked')
    process.exit(0)
  })
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
```

Запуск:

```bash
npx tsx scripts/link-domain.ts
```

После этого новый домен можно добавить без изменения `proxy.ts`.

---

# 11. Этап 7 — сделать UI в админке

В админке проекта добавить раздел:

```txt
Project Settings → Domains
```

Минимальный функционал:

```txt
- Add domain
- Delete domain
- Set active/inactive
- Set primary
- Show DNS instructions
```

Первый MVP-flow:

```txt
1. Ты вручную добавляешь домен в Dokploy.
2. В админке добавляешь domain → project.
3. Запись появляется в ProjectDomain.
4. proxy.ts больше не меняется.
5. Redeploy приложения больше не нужен.
```

---

# 12. Этап 8 — добавить статусы домена

Рекомендуемые статусы:

```txt
pending
verified
active
failed
blocked
```

Пример расширенной модели:

```prisma
model ProjectDomain {
  id                String    @id @default(cuid())
  hostname          String    @unique
  status            String    @default("pending")

  verificationToken String?
  verifiedAt        DateTime?

  projectId         String
  project           Project   @relation(fields: [projectId], references: [id])

  isPrimary         Boolean   @default(false)

  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
}
```

---

# 13. Этап 9 — добавить DNS verification

Когда пользователь добавляет домен, система создает verification token.

Например:

```txt
verificationToken = abc123
```

Пользователю показывается инструкция:

```txt
Добавьте TXT record:

TXT _yourapp.my-domain.com = abc123
```

После этого пользователь нажимает:

```txt
Check DNS
```

Система проверяет TXT-запись.

Если запись найдена:

```txt
status = verified
```

или сразу:

```txt
status = active
```

---

# 14. Этап 10 — DNS-инструкции для пользователя

Для ручного MVP можно показывать так:

```txt
A @   → YOUR_SERVER_IP
A www → YOUR_SERVER_IP
```

или:

```txt
A my-domain.com     → YOUR_SERVER_IP
A www.my-domain.com → YOUR_SERVER_IP
```

Если домен использует Cloudflare, на первом этапе можно рекомендовать:

```txt
Proxy status: DNS only
```

Позже это можно доработать под разные сценарии.

---

# 15. Этап 11 — что делать с Dokploy

## MVP-вариант

Dokploy-домены пока добавляются вручную.

То есть автоматизируется только application-level mapping:

```txt
domain → project
```

А infrastructure-level routing остается ручным:

```txt
Dokploy → Domains → Add domain
```

Это нормально для первых доменов.

---

# 16. Этап 12 — как автоматизировать Dokploy позже

В будущем есть несколько вариантов.

## Вариант A. Dokploy API

Если Dokploy API позволяет добавлять домены к приложению, можно сделать так:

```txt
User adds domain
  ↓
Your app calls Dokploy API
  ↓
Dokploy adds domain to Next.js app
  ↓
Traefik handles routing/TLS
  ↓
ProjectDomain becomes active
```

Минусы:

```txt
- нужно проверить возможности API;
- возможно, потребуется redeploy;
- зависит от Dokploy.
```

## Вариант B. Traefik catch-all router

Настроить Traefik так, чтобы все неизвестные домены шли в Next.js app.

```txt
any-custom-domain.com
  ↓
Traefik catch-all
  ↓
Next.js
  ↓
DB allowlist
  ↓
render or 404
```

Плюсы:

```txt
- не нужно добавлять каждый домен вручную;
- Next.js сам решает, активен домен или нет.
```

Минусы:

```txt
- сложнее TLS;
- можно случайно сломать routing Dokploy;
- нужно аккуратно настроить security.
```

## Вариант C. Caddy On-Demand TLS

Поставить Caddy как reverse proxy для custom domains.

Caddy может выпускать сертификаты on-demand, но перед этим спрашивать твое приложение:

```txt
GET /api/internal/caddy/ask?domain=my-domain.com
```

Если домен есть в базе и активен:

```txt
200 OK
```

Если нет:

```txt
403 Forbidden
```

Схема:

```txt
custom-domain.com
  ↓
Caddy
  ↓
Next.js
  ↓
PostgreSQL allowlist
```

Плюсы:

```txt
- не нужно вручную добавлять домены;
- автоматический TLS;
- хорошо подходит для self-hosted.
```

Минусы:

```txt
- нужно внедрять Caddy;
- может конфликтовать с текущим Traefik/Dokploy;
- требует аккуратной настройки.
```

## Вариант D. Cloudflare for SaaS

Production-вариант для большого количества custom domains.

Схема:

```txt
User adds domain
  ↓
Your app creates custom hostname in Cloudflare
  ↓
Cloudflare verifies DNS
  ↓
Cloudflare issues SSL
  ↓
Traffic goes to Hetzner origin
  ↓
Next.js renders by Host
```

Плюсы:

```txt
- Cloudflare берет на себя SSL;
- хорошо масштабируется на тысячи доменов;
- меньше TLS/ACME-проблем на сервере.
```

Минусы:

```txt
- сложнее интеграция;
- зависит от Cloudflare;
- может требовать платный план.
```

---

# 17. Рекомендуемый порядок внедрения

## Сейчас

```txt
1. Создать ProjectDomain table.
2. Создать /domain/[hostname]/[[...path]] renderer.
3. Переделать proxy.ts на universal host rewrite.
4. Сделать script/admin action для добавления domain → project.
5. Убрать hardcoded DOMAIN_TO_PROJECT из кода.
```

## Потом

```txt
6. Добавить UI Project Settings → Domains.
7. Добавить domain statuses.
8. Добавить DNS instructions.
9. Добавить DNS verification.
```

## Еще позже

```txt
10. Автоматизировать infrastructure layer:
    - Dokploy API
    - Traefik dynamic config
    - Caddy On-Demand TLS
    - Cloudflare for SaaS
```

---

# 18. Безопасность

Важно:

```txt
1. Не доверять любому Host header.
2. Рендерить только домены, которые есть в ProjectDomain.
3. Не показывать админку на custom domains.
4. Unknown domains должны вести на 404.
5. Custom domains не должны открывать /admin, /dashboard, /login.
6. Перед public self-service подключением доменов нужна DNS verification.
```

Правильная логика:

```txt
Host пришел
  ↓
normalize hostname
  ↓
если это platform host → обычное приложение
  ↓
если custom host → /domain/[hostname]
  ↓
lookup в ProjectDomain
  ↓
если active → render project
  ↓
если нет → 404
```

---

# 19. Что делать с unknown domains

Нельзя делать так:

```ts
return NextResponse.next()
```

для неизвестного custom domain, если это может открыть админку.

Лучше:

```ts
url.pathname = '/404'
return NextResponse.rewrite(url)
```

или внутри `/domain/[hostname]` делать:

```ts
notFound()
```

Главное правило:

```txt
unknown custom domain не должен попадать в dashboard/admin/login
```

---

# 20. Что делать с `/login`, `/admin`, `/dashboard` на custom domain

Custom domain должен быть только публичным доменом лендинга.

То есть:

```txt
my-domain.com/        → landing
my-domain.com/about   → landing page route or 404
my-domain.com/login   → не login приложения
my-domain.com/admin   → не admin приложения
my-domain.com/dashboard → не dashboard приложения
```

Админка должна быть только на platform host:

```txt
app.your-platform.com
```

---

# 21. Что делать с `www`

Для MVP проще хранить оба домена отдельно:

```txt
my-domain.com
www.my-domain.com
```

Обе записи ведут на один project.

Позже можно добавить primary domain и redirects:

```txt
www.my-domain.com → my-domain.com
```

или наоборот:

```txt
my-domain.com → www.my-domain.com
```

---

# 22. Что делать с project slug

Не стоит завязывать кастомный домен напрямую на slug.

Лучше:

```txt
domain → projectId
```

А не:

```txt
domain → projectSlug
```

Почему:

```txt
- slug может измениться;
- у проекта может быть несколько доменов;
- домен может быть primary/non-primary;
- позже появятся redirects;
- projectId стабильнее.
```

---

# 23. Финальное правило

`proxy.ts` не должен содержать список доменов.

Плохо:

```ts
const DOMAIN_TO_PROJECT = {
  'my-domain.com': 'my-project',
}
```

Хорошо:

```txt
proxy.ts:
  любой custom hostname → /domain/[hostname]

PostgreSQL:
  hostname → projectId
```

Итоговая цель:

```txt
Новый домен добавляется без изменения кода и без redeploy Next.js приложения.
```
