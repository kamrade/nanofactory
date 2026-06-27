# Animations

Краткая справка по анимационным компонентам Nanofactory. Здесь перечислены текущие UI-компоненты, их назначение и где они используются в Showcase.

## Базовые компоненты

### `TypewriterText`
- Путь: `src/components/ui/typewriter-text/typewriter-text.tsx`
- Назначение: печатает текст по символам и может удалять его обратно.
- Ключевые пропсы:
  - `text` / `texts`
  - `typingSpeed`, `deletingSpeed`
  - `pauseBeforeDelete`, `pauseBeforeNext`
  - `startDelay`
  - `direction: "in" | "out"`
  - `showCursor`, `cursorCharacter`, `cursorBlinkSpeed`
  - `restartKey`
- Поддержка:
  - `src/components/ui/typewriter-text/use-typewriter.ts`
  - `src/components/ui/typewriter-text/typewriter-text.css`
- Где используется:
  - `src/app/showcase/uikit-sections/typewriter-section.tsx`
  - `src/app/showcase/uikit-sections/typewriter-viewport-section.tsx`

### `HighlightSweepText`
- Путь: `src/components/ui/highlight-sweep-text/highlight-sweep-text.tsx`
- Назначение: анимация подсветки текста sweep-баром.
- Ключевые пропсы:
  - `text`
  - `color`
  - `duration`
  - `startDelay`
  - `direction`
  - `thickness`
  - `offsetY`
  - `rounded`
  - `disabled`
  - `restartKey`
- Поддержка:
  - `src/components/ui/highlight-sweep-text/highlight-sweep-text.css`
- Где используется:
  - `src/app/showcase/uikit-sections/highlight-sweep-section.tsx`

### `OffsetReveal`
- Путь: `src/components/ui/offset-reveal-text/offset-reveal-text.tsx`
- Алиас: `OffsetRevealText`
- Назначение: универсальный reveal-эффект для текста и любых JSX-объектов.
- Ключевые пропсы:
  - `text` или `children`
  - `as`
  - `direction`
  - `offset`
  - `duration`
  - `startDelay`
  - `fade`
  - `blur`
  - `disabled`
  - `restartKey`
- Поддержка:
  - `src/components/ui/offset-reveal-text/offset-reveal-text.css`
- Где используется:
  - `src/app/showcase/uikit-sections/offset-reveal-section.tsx`

### `WordStaggerReveal`
- Путь: `src/components/ui/word-stagger-reveal/word-stagger-reveal.tsx`
- Назначение: reveal по словам с задержкой между словами.
- Ключевые пропсы:
  - `text`
  - `direction`
  - `offset`
  - `duration`
  - `stagger`
  - `startDelay`
  - `reverse`
  - `fade`
  - `blur`
  - `active`
  - `disabled`
  - `restartKey`
- Поддержка:
  - `src/components/ui/word-stagger-reveal/word-stagger-reveal.css`
- Где используется:
  - `src/app/showcase/uikit-sections/word-stagger-reveal-section.tsx`

### `UIImageZoomReveal`
- Путь: `src/components/ui/image-zoom-reveal/image-zoom-reveal.tsx`
- Назначение: image reveal с zoom-in → zoom-out внутри статичных границ.
- Ключевые пропсы:
  - `src`, `alt`
  - `fit`
  - `radius`
  - `duration`, `startDelay`
  - `startScale`, `peakScale`, `endScale`
  - `animate`
  - `restartKey`
- Где используется:
  - `src/app/showcase/uikit-sections/image-zoom-reveal-section.tsx`

### `UISlider`
- Путь: `src/components/ui/slider/slider.tsx`
- Назначение: нативный `range`-контрол для настройки параметров анимаций и других числовых значений.
- Ключевые пропсы:
  - `value`, `defaultValue`
  - `onValueChange`
  - `label`
  - `showValue`
  - `valueFormatter`
  - стандартные `min`, `max`, `step`
- Где используется:
  - Showcase-анимации для настройки параметров `TypewriterText`, `HighlightSweepText`, `OffsetReveal`, `WordStaggerReveal`

## Viewport helpers

### `useVisibleOnce`
- Путь: `src/hooks/use-visible-once.ts`
- Назначение: одноразовый viewport-trigger. Элемент становится `visible=true` один раз и больше не сбрасывается.
- Используется для scroll-trigger showcase-блоков, где анимация должна проиграться только при первом появлении.

### `useViewportVisible`
- Путь: `src/hooks/use-viewport-visible.ts`
- Назначение: live viewport-trigger. Возвращает `visible=true/false` при входе и выходе элемента из viewport.
- Используется для блоков, где анимация должна проигрываться при появлении и исчезновении.

## Showcase-блоки

### `TypewriterText`
- `src/app/showcase/uikit-sections/typewriter-section.tsx`
- Настройки текста, скорости, пауз, cursor и restart.

### `TypewriterText / Viewport Trigger`
- `src/app/showcase/uikit-sections/typewriter-viewport-section.tsx`
- Появление при входе в viewport, удаление при выходе.

### `HighlightSweepText`
- `src/app/showcase/uikit-sections/highlight-sweep-section.tsx`
- Настройки цвета, duration, delay, thickness, offsetY, restart.

### `HighlightSweepText / Scroll Trigger`
- `src/app/showcase/uikit-sections/highlight-sweep-section.tsx`
- Одноразовый viewport reveal.

### `HighlightSweepText / Hover Trigger`
- `src/app/showcase/uikit-sections/highlight-sweep-section.tsx`
- Анимация по hover.

### `OffsetRevealText`
- `src/app/showcase/uikit-sections/offset-reveal-section.tsx`
- Настройки direction, offset, duration, start delay, fade, blur.

### `OffsetReveal`
- `src/app/showcase/uikit-sections/offset-reveal-section.tsx`
- Отдельный пример, что эффект применим не только к тексту.

### `OffsetRevealText / Scroll Trigger`
- `src/app/showcase/uikit-sections/offset-reveal-section.tsx`
- Одноразовые scroll-trigger примеры.

### `WordStaggerReveal`
- `src/app/showcase/uikit-sections/word-stagger-reveal-section.tsx`
- Настройки offset, duration, stagger, start delay, reverse, fade, blur.

### `WordStaggerReveal / Scroll Trigger`
- `src/app/showcase/uikit-sections/word-stagger-reveal-scroll-section.tsx`
- Одноразовые scroll-trigger примеры.

### `Viewport Reveal`
- `src/app/showcase/uikit-sections/viewport-reveal-section.tsx`
- Демонстрация live-viewport анимации: появление при входе и исчезновение при выходе.

### `Image Zoom Reveal`
- `src/app/showcase/uikit-sections/image-zoom-reveal-section.tsx`
- Демонстрация image-анимации с фиксированными границами и zoom-in → zoom-out.

## Практика

- Для one-shot reveal используй `useVisibleOnce`.
- Для enter/exit поведения используй `useViewportVisible`.
- Для перезапуска конкретного эффекта в Showcase безопаснее всего менять `key` у компонента.
- Если эффект должен работать на любом UI-объекте, предпочитай wrapper-компонент с `children`, а не текстовый API.
