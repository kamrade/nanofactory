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



5. Markdown preview в UIKit зафиксирован по высоте (h-[420px]).

Что неудачно: жесткая высота может быть неудачной на разных брейкпоинтах.

Что сделать: заменить на min-h + max-h + адаптивные значения (md/lg) или CSS clamp.

Файл: showcase-client.tsx



6. Metadata для markdown nested item берет сырой markdown текст.

Что неудачно: в description могут попасть символы #, |, ``` и т.д.

Что сделать: добавлять helper stripMarkdownForMeta() и ограничивать длину (например, 160–200).

Файл: page.tsx



7. E2E завязаны на тексты UI (2 items, Published with Nanofactory).

Что неудачно: хрупкость при copy changes.

Что сделать: добавить data-testid на ключевые узлы и перевести критичные локаторы на них.

Файлы: projects-gallery-navigation.spec.ts, auth-dashboard.spec.ts



8. Нет отдельного unit-теста на backward compatibility descriptionMd <- description.

Что неудачно: можно сломать миграционную логику при следующем рефакторе модели.

Что сделать: добавить тесты на readProjectsGalleryProps для старого и нового payload.

Файл: model.ts

9. При открытии галлереи меняется mode на dark. 