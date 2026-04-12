export type CreateFeatureBlockStep = {
  id: number;
  title: string;
  details: string[];
};

export const createFeatureBlockSteps: CreateFeatureBlockStep[] = [
  {
    id: 1,
    title: "Создать папку блока",
    details: [
      "Путь: `features/blocks/<group>/<variant>/`.",
      "Пример: `features/blocks/testimonials/default/`.",
    ],
  },
  {
    id: 2,
    title: "Сделать `editor.tsx` и `render.tsx`",
    details: [
      "`Editor` отвечает за редактирование `props` блока в редакторе.",
      "`Render` отвечает за публичный рендер блока.",
      "Ориентироваться на типы из `features/blocks/shared/types.ts`.",
    ],
  },
  {
    id: 3,
    title: "Добавить definition в registry",
    details: [
      "Файл: `features/blocks/shared/registry.ts`.",
      "Заполнить: `type`, `variant`, `label`, `description`, `fields`, `createDefaultProps`, `normalizeProps`, `Editor`, `Renderer`.",
    ],
  },
  {
    id: 4,
    title: "Подключить тип в content-типах (если это новый type)",
    details: [
      "Файл: `features/blocks/shared/content.ts`.",
      "Добавить новый `SupportedBlockType` и при необходимости обновить нормализацию.",
    ],
  },
  {
    id: 5,
    title: "Проверить интеграцию editor helpers",
    details: [
      "Файл: `lib/editor/blocks.ts` использует registry.",
      "Обычно дополнительных изменений не требуется, если definition описан корректно.",
    ],
  },
  {
    id: 6,
    title: "Проверить в редакторе проекта",
    details: [
      "Открыть `/projects/[id]`.",
      "Через `Add block` добавить новый блок/вариант.",
      "Проверить создание, редактирование, сохранение и восстановление из `content_json`.",
    ],
  },
  {
    id: 7,
    title: "Проверить публичный рендер",
    details: [
      "Проверить `/preview` и `/p/...`.",
      "Проверить отображение в light/dark и разных themes.",
      "Проверить full-bleed, если блок должен его поддерживать.",
    ],
  },
  {
    id: 8,
    title: "Добавить unit-тесты",
    details: [
      "Минимум: тесты на `normalizeProps`.",
      "Минимум: тесты на `render` для ключевых сценариев.",
      "Добавить тесты editor-логики, если есть нетривиальное поведение.",
    ],
  },
];

export const createFeatureBlockChecklist = [
  "Папка + `editor.tsx` + `render.tsx` созданы",
  "Definition добавлен в registry",
  "Типы content обновлены (если нужно)",
  "Блок создается в editor через Add block",
  "Сохранение/загрузка работает",
  "Рендер на preview/public работает",
  "Тесты добавлены",
] as const;
