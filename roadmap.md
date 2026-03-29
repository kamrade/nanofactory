## Phase 0 — Foundation

Цель: привести проект в состояние, где можно спокойно строить продукт.

### Что сделать
- добить db/schema.ts
- миграции / сиды
- базовый app shell
- определить структуру папок
- env strategy
- подготовить R2 config contract
- зафиксировать theme registry и block registry как концепт

### Результат. У нас есть:
- рабочая база
- понятная структура проекта
- понятные domain boundaries

### Что не делать
- не делать пока сложный UI
- не делать пока upload pipeline целиком
- не делать пока custom domains

## Phase 1 — Minimal Auth + Dashboard

Цель: пользователь может войти и увидеть свои проекты.

### Что сделать
- простой auth
- current user
- protected area /app или /dashboard
- список проектов
- создание проекта
- открытие проекта
- Минимум по auth

### Я бы сделал:
- email/password или magic link
- без ролей
- без teams
- без permissions beyond owner-only

### Результат. Пользователь может:
- зайти
- создать проект
- увидеть список своих проектов

Почему это рано. Потому что без auth у тебя нет нормального владения проектами, а ты уже строишь SaaS.

## Phase 2 — Project Editor Skeleton

Цель: сделать первый рабочий editor, даже если он ещё некрасивый.

### Что сделать
- страница редактора проекта
- загрузка project + projectContent
- sidebar/block picker
- список блоков на странице
- добавление блока
- удаление блока
- редактирование props через form controls
- смена темы
- сохранение в project_contents.content_json
- MVP blocks

### Я бы начал с 3–4 блоков:
- Hero
- Features
- CTA
- Footer
- Важно

### Достаточно:
- add block
- move up/down
- edit fields
- preview on same page

### Результат. 
- Пользователь реально собирает страницу.

## Phase 3 — Public Rendering + Publish

Цель: редактор становится продуктом, потому что появляется публичный результат.

### Что сделать
- маршрут /p/[slug]
- загрузка published project по slug
- public renderer
- publish action
- unpublish action
- status handling (draft / published)
- basic 404 / unpublished behavior

### Результат. Полный цикл:
- создать проект
- наполнить
- опубликовать
- открыть публичную страницу

Это первая настоящая MVP-веха

Вот после этого у тебя уже не “заготовка”, а работающий продуктовый контур.

## Phase 4 — Assets MVP

Цель: пользователь может загружать картинки и использовать их в блоках.

### Что сделать
- Cloudflare R2 bucket setup
- server upload endpoint / server action
- валидация mime/size
- запись в assets
- asset picker в editor
- подстановка assetId в block props
- resolver assetId -> public URL

### Где использовать сначала
- Hero image
- Logo
- maybe image/text section

### Результат
- Лендинги перестают быть текстовыми демками.

## Phase 5 — Editor UX Upgrade
Цель: довести editor до состояния “приятно пользоваться”.
### Что сделать
- reorder blocks
- duplicate block
- better settings panels
- live preview polish
- empty states
- confirm delete
- auto-save или explicit save UX
- dirty state indicator

### Результат
- Редактор становится удобным, а не просто рабочим.

## Phase 6 — Theme System Proper

Цель: темы становятся сильной частью продукта, а не просто полем в БД.

### Что сделать
- theme registry in code
- 3 качественные темы
- нормальные tokens:
  - colors
  - typography
  - radius
  - spacing
  - buttons
  - все блоки должны корректно жить во всех темах

### Очень важно
- Не количество тем, а совместимость тем с блоками.

### Результат
- Продукт начинает ощущаться “со вкусом”.