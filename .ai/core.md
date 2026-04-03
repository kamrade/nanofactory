# Как устроен механизм блоков

## Общая идея

В проекте страница не собирается из произвольного HTML.
Она собирается из **блоков**, которые хранятся как структурированные данные в `content_json`.

Каждый блок описывается так:

```ts
type PageBlock = {
  id: string;
  type: "hero" | "features" | "cta";
  variant?: string;
  props: Record<string, unknown>;
};
```

То есть блок имеет:

- `id` — уникальный идентификатор блока
- `type` — тип блока
- `variant` — вариант внутри типа
- `props` — данные блока

Вся страница хранится как:

```ts
type PageContent = {
  blocks: PageBlock[];
};
```

Типы контента сейчас лежат в:

- `features/blocks/shared/content.ts`
- реэкспортируются также через `db/schema.ts`

---

## Где хранятся данные страницы

Страница хранится в таблице `project_contents`, в поле:

- `project_contents.content_json`

Это описано в:

- `db/schema.ts`

Важный момент:

- в БД хранится не React-разметка
- в БД хранится JSON-структура блоков

Это позволяет:

- валидировать контент
- нормализовать его
- рендерить страницу на основе реестра блоков
- менять UI editor без смены формата хранения

---

## Главный принцип: type + variant

Сейчас блоки определяются не только по `type`, но и по `variant`.

Примеры:

- `hero/default`
- `hero/centered`
- `features/default`
- `features/cards`
- `cta/default`

Это значит:

- один тип блока может иметь несколько вариантов
- у каждого варианта может быть свой renderer
- у каждого варианта может быть свой editor
- у каждого варианта свои default props и normalize-логика

---

## Где лежит реестр блоков

Главная точка входа:

- `features/blocks/shared/registry.ts`

Этот файл отвечает за:

- сбор всех block definitions в один массив
- поиск definition по `type + variant`
- получение списка типов блоков
- получение списка вариантов для конкретного типа
- создание нового блока через `createPageBlock(...)`

Основные функции:

- `getBlockDefinition(type, variant)`
- `getBlockTypes()`
- `getBlockVariants(type)`
- `createPageBlock(type, variant)`

Для совместимости старые импорты идут через:

- `lib/editor/blocks.ts`

Этот файл сейчас просто реэкспортирует новый registry.

---

## Как организованы файлы блоков

Все блоки лежат в:

- `features/blocks/`

Структура по типам:

- `features/blocks/hero/`
- `features/blocks/features/`
- `features/blocks/cta/`

У каждого варианта блока обычно есть:

- `definition.ts`
- `render.tsx`
- `editor.tsx` если editor кастомный

Примеры:

- `features/blocks/hero/default/definition.ts`
- `features/blocks/hero/default/render.tsx`
- `features/blocks/hero/centered/definition.ts`
- `features/blocks/hero/centered/render.tsx`
- `features/blocks/hero/centered/editor.tsx`
- `features/blocks/features/cards/definition.ts`
- `features/blocks/features/cards/render.tsx`
- `features/blocks/features/cards/editor.tsx`

Также у каждого типа есть `index.ts`, который собирает его варианты:

- `features/blocks/hero/index.ts`
- `features/blocks/features/index.ts`
- `features/blocks/cta/index.ts`

---

## Что находится в definition.ts

`definition.ts` — это основное описание варианта блока.

Примерно там лежит:

- `type`
- `typeLabel`
- `variant`
- `label`
- `description`
- `fields`
- `createDefaultProps`
- `normalizeProps`
- `Editor`
- `Renderer`

То есть `definition.ts` отвечает за то, как вариант блока существует в системе.

Через definition система узнаёт:

- как создать новый блок
- как нормализовать сохранённые props
- какой editor рендерить в приватной зоне
- какой renderer рендерить на публичной странице

---

## Что такое normalizeProps

`normalizeProps` нужен для того, чтобы привести входные данные блока к ожидаемой форме.

Например:

- подставить default values
- почистить пустые значения
- убедиться, что список строк действительно список строк
- привести optional поля к понятной форме

Общие helper-функции для этого лежат в:

- `features/blocks/shared/base.ts`

Там находятся:

- `isPlainObject`
- `readString`
- `readOptionalString`
- `readStringList`
- `createBlockId`

---

## Как создаётся новый блок

Когда пользователь нажимает `Add block`, editor не создаёт объект блока вручную.

Он делает это через registry:

- `createPageBlock(type, variant)`

Логика находится в:

- `features/blocks/shared/registry.ts`

Что происходит:

1. Находится нужный `definition`
2. Вызывается `definition.createDefaultProps()`
3. Создаётся новый `id`
4. Возвращается готовый объект блока

Именно поэтому новый блок сразу имеет корректную форму.

---

## Как работает валидация и нормализация content_json

За это отвечает:

- `lib/editor/content.ts`

Этот файл делает несколько вещей:

1. Проверяет, что payload вообще объект
2. Проверяет, что `blocks` — массив
3. Проверяет, что у блока есть `id`
4. Проверяет, что `type` существует
5. Находит `definition` через `getBlockDefinition(type, variant)`
6. Возвращает уже нормализованный блок

Ключевой момент:

- если `variant` в старых данных отсутствует, система подставляет `default`

Это позволяет эволюционировать block system без немедленной миграции всех старых записей.

Основные функции:

- `validatePageContent(...)`
- `parsePageContentJson(...)`
- `normalizePageContent(...)`

---

## Как работает editor

Главный файл editor:

- `components/editor/project-editor.tsx`

`ProjectEditor` сейчас больше не знает детали конкретных блоков.
Он работает как coordinator.

Что он делает:

- хранит локальное состояние `content`
- показывает список блоков
- добавляет блоки
- удаляет блоки
- обновляет `props` блока
- сериализует `content` в JSON
- отправляет данные на сохранение

Что он больше **не** делает:

- не строит поля block editor вручную
- не решает, как выглядит editor каждого варианта
- не содержит бизнес-логику конкретного блока

---

## Как editor понимает, что рендерить

Для каждого блока `ProjectEditor` делает:

1. Берёт `block.type` и `block.variant`
2. Находит `definition` через `getBlockDefinition(...)`
3. Берёт из него `definition.Editor`
4. Рендерит этот editor

То есть схема такая:

```ts
block -> definition -> Editor
```

Если говорить по файлам:

- блоки берутся из `content`
- definition находится через `lib/editor/blocks.ts` -> `features/blocks/shared/registry.ts`
- editor-компонент лежит в `definition.ts`

---

## Как устроен Add block

В `ProjectEditor` добавление блока уже двухшаговое:

1. сначала выбирается тип блока
2. потом выбирается вариант этого типа

Для этого используются:

- `getBlockTypes()`
- `getBlockVariants(type)`

И это снова идёт через registry, а не через хардкод списка кнопок.

---

## Три слоя editor architecture

Сейчас editor логически разбит на три уровня.

### 1. ProjectEditor

Файл:

- `components/editor/project-editor.tsx`

Роль:

- orchestration
- state management
- save flow
- add/remove/update block

### 2. BlockChrome

Файл:

- `features/blocks/shared/block-chrome.tsx`

Роль:

- внешняя оболочка блока в editor
- block index
- title
- meta
- delete action

`BlockChrome` не знает ничего о конкретном block type.
Это просто shell для блока в editor.

### 3. Variant Editor

Файлы:

- `features/blocks/.../editor.tsx`

Роль:

- UI именно этого варианта блока
- управление его props
- специфический UX для конкретного варианта

---

## Какие editor-ы сейчас существуют

### Generic fallback editor

Файл:

- `features/blocks/shared/generic-editor.tsx`

Он используется для простых вариантов.

Что делает:

- рендерит поля из `definition.fields`
- обновляет `props`
- при необходимости подключает asset picker

### Custom editors

Уже есть кастомные variant-specific editor-компоненты:

- `features/blocks/features/cards/editor.tsx`
- `features/blocks/hero/centered/editor.tsx`

Это значит, что вариант блока может иметь полностью свой editing experience.

Примеры:

- `features/cards` редактируется как набор карточек с `Add card` / `Remove`
- `hero/centered` редактируется как headline-first layout с optional image section

---

## Shared editor primitives

Общие editor primitives лежат в:

- `features/blocks/shared/`

Сейчас там уже есть:

- `asset-picker.tsx`
- `block-chrome.tsx`
- `generic-editor.tsx`

### AssetPicker

Файл:

- `features/blocks/shared/asset-picker.tsx`

Роль:

- показать список ассетов
- показать selected state
- показать preview
- дать `Select` / `Clear`
- поддерживать разные layout options

Используется в:

- `GenericBlockEditor`
- `HeroCenteredEditor`

Это важно, потому что asset UI уже не дублируется вручную в нескольких редакторах.

---

## Как блок обновляет свои props

Variant editor не меняет весь `content` сам.
Он отдаёт только новые `props`.

Схема:

1. `ProjectEditor` передаёт в variant editor:
   - `block`
   - `assets`
   - `definition`
   - `onChange(nextProps)`

2. Variant editor вызывает `onChange(...)`

3. `ProjectEditor` обновляет именно нужный блок внутри `content.blocks`

Это важно, потому что:

- orchestration остаётся наверху
- variant editor остаётся изолированным
- block editor не знает про весь page state

---

## Как работает публичный рендер

За публичный вывод отвечает:

- `components/projects/project-renderer.tsx`

Схема там почти такая же, как в editor:

1. Берётся блок из `content.blocks`
2. Находится `definition` через `getBlockDefinition(type, variant)`
3. Из него берётся `definition.Renderer`
4. Renderer получает:
   - `block`
   - `assetMap`
   - `theme`

То есть:

```ts
block -> definition -> Renderer
```

Это значит, что editor и public render симметричны:

- editor использует `definition.Editor`
- public page использует `definition.Renderer`

---

## Как подключаются ассеты на публичной странице

Публичная страница не хранит URL изображения прямо в `content_json`.

Что происходит:

1. В блоке лежит `imageAssetId`
2. Публичный route загружает список asset metadata проекта
3. `ProjectRenderer` строит `assetMap`
4. Variant renderer резолвит нужный asset через `assetId`

Основные файлы:

- `app/p/[slug]/page.tsx`
- `components/projects/project-renderer.tsx`
- `lib/assets.ts`
- `lib/assets/resolution.ts`

Это позволяет:

- не хранить raw URLs в content
- централизовать asset resolution
- безопасно держать assets привязанными к проекту

---

## Полный путь блока: от создания до отображения

### 1. Создание

Пользователь в editor нажимает `Add block`.

Файл:

- `components/editor/project-editor.tsx`

Система:

- получает список типов и вариантов из registry
- вызывает `createPageBlock(type, variant)`

### 2. Локальное редактирование

`ProjectEditor` держит блок внутри локального `content` state.

Дальше конкретный variant editor меняет только `props` этого блока.

### 3. Сохранение

`ProjectEditor` сериализует `content` в JSON и отправляет его через server action.

Файлы:

- `components/editor/project-editor.tsx`
- `app/(protected)/projects/[projectId]/actions.ts`

### 4. Серверная валидация

JSON проходит через:

- `lib/editor/content.ts`

Там:

- проверяется структура
- подставляется `default` variant при необходимости
- props нормализуются через `definition.normalizeProps`

### 5. Хранение

Нормализованный JSON записывается в:

- `project_contents.content_json`

### 6. Публичный рендер

Публичная страница загружает проект и вызывает:

- `components/projects/project-renderer.tsx`

Там для каждого блока используется `definition.Renderer`.

---

## Какие файлы читать в первую очередь

Если нужно быстро понять block system, читать в таком порядке:

1. `features/blocks/shared/content.ts`
2. `features/blocks/shared/types.ts`
3. `features/blocks/shared/registry.ts`
4. `lib/editor/content.ts`
5. `components/editor/project-editor.tsx`
6. `features/blocks/shared/block-chrome.tsx`
7. `features/blocks/shared/generic-editor.tsx`
8. `features/blocks/shared/asset-picker.tsx`
9. `components/projects/project-renderer.tsx`

Потом уже сами варианты:

- `features/blocks/hero/default/definition.ts`
- `features/blocks/hero/centered/definition.ts`
- `features/blocks/features/default/definition.ts`
- `features/blocks/features/cards/definition.ts`
- `features/blocks/cta/default/definition.ts`

---

## Коротко в одном абзаце

Система блоков сейчас устроена так:

- данные страницы хранятся как `content_json`
- каждый блок определяется через `type + variant`
- registry находит definition варианта
- definition знает, как блок нормализовать, как его редактировать и как его рендерить
- editor использует `definition.Editor`
- public page использует `definition.Renderer`
- `ProjectEditor` отвечает за orchestration
- shared primitives уменьшают дублирование

Именно это сейчас является техническим ядром проекта.
