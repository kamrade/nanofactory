import { isPlainObject, readOptionalString } from "@/features/blocks/shared/base";
import type { BackgroundScene, BackgroundSceneLayer } from "@/lib/background-scenes/types";

function isFiniteNumber(input: unknown): input is number {
  return typeof input === "number" && Number.isFinite(input);
}

function clampOpacity(input: number) {
  return Math.max(0, Math.min(1, input));
}

function clampPositive(input: number, fallback: number) {
  if (!isFiniteNumber(input)) {
    return fallback;
  }

  return Math.max(1, Math.round(input));
}

function clampRange(input: number, fallback: number, min: number, max: number) {
  if (!isFiniteNumber(input)) {
    return fallback;
  }

  return Math.max(min, Math.min(max, Math.round(input)));
}

function normalizeAngle(input: number) {
  if (!isFiniteNumber(input)) {
    return 45;
  }

  return Math.max(0, Math.min(180, Math.round(input)));
}

function isHexColor(input: string) {
  return /^#(?:[0-9a-fA-F]{3}){1,2}$/.test(input.trim());
}

function normalizeSceneLayer(input: unknown): BackgroundSceneLayer | null {
  if (!isPlainObject(input)) {
    return null;
  }

  const id = readOptionalString(input.id);
  const type = readOptionalString(input.type);
  const name = readOptionalString(input.name);
  const visible = typeof input.visible === "boolean" ? input.visible : true;
  const opacity = isFiniteNumber(input.opacity) ? clampOpacity(input.opacity) : 0.35;

  if (!id || !type || !name) {
    return null;
  }

  if (!isPlainObject(input.config)) {
    return null;
  }

  if (type === "stripes") {
    const stripeColor = readOptionalString(input.config.stripeColor);
    const stripeWidth = clampPositive(
      isFiniteNumber(input.config.stripeWidth) ? input.config.stripeWidth : 12,
      12
    );
    const gapWidth = clampPositive(
      isFiniteNumber(input.config.gapWidth) ? input.config.gapWidth : 12,
      12
    );
    const angle = normalizeAngle(isFiniteNumber(input.config.angle) ? input.config.angle : 45);

    if (!stripeColor || !isHexColor(stripeColor)) {
      return null;
    }

    return {
      id,
      type: "stripes",
      name,
      visible,
      opacity,
      config: {
        stripeColor,
        stripeWidth,
        gapWidth,
        angle,
      },
    };
  }

  if (type === "dots") {
    const dotColor = readOptionalString(input.config.dotColor);
    const dotSize = clampPositive(
      isFiniteNumber(input.config.dotSize) ? input.config.dotSize : 4,
      4
    );
    const gap = clampPositive(isFiniteNumber(input.config.gap) ? input.config.gap : 20, 20);

    if (!dotColor || !isHexColor(dotColor)) {
      return null;
    }

    return {
      id,
      type: "dots",
      name,
      visible,
      opacity,
      config: {
        dotColor,
        dotSize,
        gap,
      },
    };
  }

  if (type === "grid") {
    const lineColor = readOptionalString(input.config.lineColor);
    const lineWidth = clampPositive(
      isFiniteNumber(input.config.lineWidth) ? input.config.lineWidth : 1,
      1
    );
    const cellSize = clampPositive(
      isFiniteNumber(input.config.cellSize) ? input.config.cellSize : 28,
      28
    );

    if (!lineColor || !isHexColor(lineColor)) {
      return null;
    }

    return {
      id,
      type: "grid",
      name,
      visible,
      opacity,
      config: {
        lineColor,
        lineWidth,
        cellSize,
      },
    };
  }

  if (type === "gradient") {
    const colorA = readOptionalString(input.config.colorA);
    const colorB = readOptionalString(input.config.colorB);
    const angle = normalizeAngle(isFiniteNumber(input.config.angle) ? input.config.angle : 135);

    if (!colorA || !isHexColor(colorA) || !colorB || !isHexColor(colorB)) {
      return null;
    }

    return {
      id,
      type: "gradient",
      name,
      visible,
      opacity,
      config: {
        colorA,
        colorB,
        angle,
      },
    };
  }

  if (type === "glow") {
    const glowColor = readOptionalString(input.config.glowColor);
    const x = clampRange(
      isFiniteNumber(input.config.x) ? input.config.x : 50,
      50,
      0,
      100
    );
    const y = clampRange(
      isFiniteNumber(input.config.y) ? input.config.y : 35,
      35,
      0,
      100
    );
    const radius = clampPositive(
      isFiniteNumber(input.config.radius) ? input.config.radius : 42,
      42
    );

    if (!glowColor || !isHexColor(glowColor)) {
      return null;
    }

    return {
      id,
      type: "glow",
      name,
      visible,
      opacity,
      config: {
        glowColor,
        x,
        y,
        radius,
      },
    };
  }

  if (type === "noise") {
    const intensity = clampPositive(
      isFiniteNumber(input.config.intensity) ? input.config.intensity : 100,
      100
    );
    const size = clampPositive(isFiniteNumber(input.config.size) ? input.config.size : 140, 140);

    return {
      id,
      type: "noise",
      name,
      visible,
      opacity,
      config: {
        intensity,
        size,
      },
    };
  }

  return null;
}

export function validateBackgroundScene(input: unknown): BackgroundScene | null {
  if (!isPlainObject(input)) {
    return null;
  }

  const version = input.version;
  const id = readOptionalString(input.id);
  const name = readOptionalString(input.name);

  if (version !== 1 || !id || !name) {
    return null;
  }

  if (!isPlainObject(input.canvas)) {
    return null;
  }

  const backgroundColor = readOptionalString(input.canvas.backgroundColor);
  const width = clampPositive(isFiniteNumber(input.canvas.width) ? input.canvas.width : 1200, 1200);
  const height = clampPositive(
    isFiniteNumber(input.canvas.height) ? input.canvas.height : 630,
    630
  );

  if (!backgroundColor || !isHexColor(backgroundColor)) {
    return null;
  }

  if (!Array.isArray(input.layers)) {
    return null;
  }

  const layers: BackgroundSceneLayer[] = [];

  for (const layerInput of input.layers) {
    const layer = normalizeSceneLayer(layerInput);

    if (!layer) {
      return null;
    }

    layers.push(layer);
  }

  return {
    version: 1,
    id,
    name,
    canvas: {
      backgroundColor,
      width,
      height,
    },
    layers,
  };
}
