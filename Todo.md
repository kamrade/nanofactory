## Блок 1

1. ✅ projects-gallery nested route still называется [imageAnchor], хотя теперь там и markdown items.

Что неудачно: терминология расходится с моделью (kind: "image" | "markdown"), будет путать и людей, и тесты.

Что сделать: переименовать сегмент в [entryAnchor] + оставить совместимый редирект со старого пути.

Файл: page.tsx



2. ✅ Тип ProjectsGalleryImageItem теперь содержит и image, и markdown.

Что неудачно: имя типа уже не соответствует содержимому.

Что сделать: переименовать в ProjectsGalleryEntryItem (или union ImageEntry | MarkdownEntry) и обновить resolve/editor типы.

Файл: model.ts



3. ✅ ProjectRenderer содержит много закомментированного JSX, который критичен для e2e.

Что неудачно: легко случайно сломать поведение и не заметить в PR.

Что сделать: убрать “мертвые” комменты, выделить ProjectMetaHeader в отдельный компонент и покрыть его unit-тестом.

Файл: project-renderer.tsx



4. ✅ MdRenderer рендерит ссылки всегда target="_blank".

Что неудачно: для внутренних ссылок это часто не то UX-поведение.

Что сделать: для относительных URL не ставить target="_blank"; для внешних оставлять.

Файл: md-renderer.tsx



5. ✅ Markdown preview в UIKit зафиксирован по высоте (h-[420px]).

Что неудачно: жесткая высота может быть неудачной на разных брейкпоинтах.

Что сделать: заменить на min-h + max-h + адаптивные значения (md/lg) или CSS clamp.

Файл: showcase-client.tsx



6. ❌ Metadata для markdown nested item берет сырой markdown текст.

Что неудачно: в description могут попасть символы #, |, ``` и т.д.

Что сделать: добавлять helper stripMarkdownForMeta() и ограничивать длину (например, 160–200).

Файл: page.tsx



7. ❌ E2E завязаны на тексты UI (2 items, Published with Nanofactory).

Что неудачно: хрупкость при copy changes.

Что сделать: добавить data-testid на ключевые узлы и перевести критичные локаторы на них.

Файлы: projects-gallery-navigation.spec.ts, auth-dashboard.spec.ts



8. ✅ Нет отдельного unit-теста на backward compatibility descriptionMd <- description.

Что неудачно: можно сломать миграционную логику при следующем рефакторе модели.

Что сделать: добавить тесты на readProjectsGalleryProps для старого и нового payload.

Файл: model.ts

9. ✅ При открытии галлереи меняется mode на dark. 

## Блок 2

1. ✅ mode собирается вручную в нескольких местах (?mode=... строками).
Что неудачно: риск расхождения логики и регрессий.
Что сделать: вынести в единый helper buildModeQuery(mode) + appendModeToPath(path, mode) и использовать везде.

2. ✅ В projects-gallery поле imageAnchor используется как универсальный anchor для image и markdown.
Что неудачно: имя больше не отражает смысл.
Что сделать: переименовать в entryAnchor на уровне модели/resolve (не только route param).

3. ✅ В projects-gallery типы уже mixed (kind), но функция и нейминг частично еще “image-oriented” (getEffectiveProjectGalleryImageAnchor).
Что неудачно: когнитивный шум.
Что сделать: привести API к ...EntryAnchor/...EntryFromContent.

4. ✅ ProjectRenderer хранит часть неиспользуемой темы (button, heroCard, kicker) после удаления header-мета.
Что неудачно: мертвые поля в theme-contract.
Что сделать: минимизировать getThemeClasses до реально используемых токенов.

5. ✅ Ссылки в MdRenderer внешние определяются regex’ом.
Что неудачно: edge cases (javascript:, weird schemes).
Что сделать: явно whitelist (http:, https:, mailto:, tel:), остальное — как internal/blocked.

6. descriptionMd в metadata идет сырым markdown.
Что неудачно: SEO description может быть “грязным” (#, |, backticks).
Что сделать: stripMarkdownForMeta() + trim до ~160 chars.

7. ✅ Много e2e зависит от текстов UI и структуры DOM.
Что неудачно: хрупкость при copy/layout правках.
Что сделать: добавить data-testid на ключевые элементы (publish status, mode container, project-gallery counters, nav buttons).

8. ✅ Нет unit-тестов на mode-helpers после недавних фиксов (light/dark, referer/query priority).
Что неудачно: легко повторно сломать режимы.
Что сделать: unit suite для resolveGalleryItemMode, buildGalleryItemNavigationHrefs, buildGalleryItemPageViewModel.

9. ✅ В showcase-client.tsx большой монолитный компонент с кучей state.
Что неудачно: поддержка и тестирование усложняются.
Что сделать: выделить demo-секции в отдельные компоненты (MarkdownDemoCard, ModalDemoCard, etc.).

10. ✅ В projects-gallery editor много inline-логики в JSX.
Что неудачно: сложно читать и расширять.
Что сделать: вынести операции addImageEntry/addMarkdownEntry/updateEntry/removeEntry в чистые helper-функции и покрыть unit-тестами.

## Блок 3

1️⃣ ✅ Дублирование isUuid в трёх модулях 🔒
Файлы: projects.ts, assets.ts, background-scenes.ts

Проблема: одна и та же функция-валидатор UUID определена трижды с идентичным regex.

Решение: вынести в src/lib/validate.ts и импортировать.

2️⃣ ✅ Дублирование ensureProjectOwner в assets и background-scenes 🔒
Файлы: assets.ts, background-scenes.ts

Проблема: два модуля содержат идентичную функцию проверки владения проектом (тот же SQL, тот же isUuid guard). Разница только в классе ошибки (AssetUploadError vs BackgroundSceneError).

Решение: вынести в src/lib/projects/ownership.ts с параметризованным классом ошибки.

3️⃣ ❌ Избыточный boilerplate DI-контейнеров в actions.ts 🟡
Файл: actions.ts

Проблема: для каждого из 6 action-методов определён:

Интерфейс зависимостей (6 шт)
Объект зависимостей (6 шт)
*WithDependencies + публичная обёртка (12 функций)
Итого ~100 строк шаблонного кода. Пример:

Решение: одна factory withDeps(fn, deps), сокращает каждую пару до одной строки.

-- решил не делать, потому что так более очевидно и удобочитаемо.

4️⃣ ✅ Дублирование UI навигации в двух page.tsx 🔒
Файлы:

page.tsx
page.tsx
Проблема: обе страницы рендерят практически идентичную панель: кнопка Back, Previous/Next, счётчик Item X of Y. Различаются только data-testid и источник href.

Решение: выделить shared-компонент GalleryItemNav (или расширить существующий GalleryItemKeyboardNav).

5️⃣ ✅ Сырой Markdown в SEO-метаданных 🔒
Файлы:

page.tsx
page.tsx (в generateMetadata)
Проблема: в description метаданных может попасть сырой markdown с #, |, ` и т.д. для markdown-записей галереи. Уже отмечено как открытый пункт в Todo.md.

Решение: добавить helper stripMarkdownForMeta(md: string): string с обрезкой до ~160 символов.

## Блок 4

1️⃣ ✅ cx() — утилита склеивания классов определена в 3+ местах 🔒
Файлы: dialog.tsx, sticky-header.tsx, section-shell.tsx (возможно ещё modal.tsx, sheet.tsx)

Везде одно и то же:

Решение: вынести в src/lib/cn.ts (или src/lib/classnames.ts).

2️⃣ ✅ createBlockId / createStorageId / createId — три разных генератора ID 🔒
Файлы:

features/blocks/shared/base.ts → createBlockId() — crypto.randomUUID() / block-${Date.now()}-${random}
lib/storage/keys.ts → createStorageId() — crypto.randomUUID() / asset-${Date.now()}-${random}
components/assets/background-scene-defaults.ts → createId(prefix) — crypto.randomUUID().slice(0,8) / ${prefix}_${random}
Три разных реализации одного и того же с разными префиксами и fallback'ами.

Решение: единый src/lib/id.ts: createId(prefix?).

3️⃣ ✅ ProjectModeSwitcher — сложный inline-адаптер для DOM 🟡
Файл: components/projects/project-mode-switcher.tsx

Начальное состояние создаёт анонимный объект с методом closest прямо в useState:

Это смешивает чтение DOM с логикой компонента, сложно тестировать.

Решение: вынести в readModeFromDom() в отдельную функцию.

4️⃣ ✅ getBackgroundDefaultsPalette — тернарный взрыв 🔒
Файл: components/assets/background-scene-defaults.ts

Функция возвращает большой объект с цветами через вложенные themeKey === "nightfall" ? mode === "dark" ? A : B : C. 4 комбинации → ~80 строк.

Решение: lookup table Record<ThemeKey, Record<UiMode, Palette>>.

5️⃣ ✅ readEntryItems / readProjectItems — дублирование парсинга 🔒
Файл: features/blocks/projects-gallery/default/model.ts

Обе функции делают одно и то же: isPlainObject → читают поля через readOptionalString/readString → нормализуют anchor → filter(Boolean). Различаются только набором полей и типом результата.

Решение: общий helper mapPlainObjects<T>(input, fn).