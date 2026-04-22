"use client";

import type { BackgroundScene } from "@/lib/background-scenes/types";
import type {
  DotsLayer,
  GlowLayer,
  GradientLayer,
  GridLayer,
  NoiseLayer,
  StripesLayer,
} from "@/lib/background-scenes/types";

function createId(prefix: string) {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `${prefix}_${crypto.randomUUID().slice(0, 8)}`;
  }

  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export function createDefaultStripesLayer(): StripesLayer {
  return {
    id: createId("layer"),
    type: "stripes" as const,
    name: "Stripes 45°",
    visible: true,
    opacity: 0.35,
    config: {
      stripeColor: "#ffffff",
      stripeWidth: 12,
      gapWidth: 12,
      angle: 45,
    },
  };
}

export function createDefaultDotsLayer(): DotsLayer {
  return {
    id: createId("layer"),
    type: "dots",
    name: "Dots",
    visible: true,
    opacity: 0.28,
    config: {
      dotColor: "#ffffff",
      dotSize: 4,
      gap: 20,
    },
  };
}

export function createDefaultGridLayer(): GridLayer {
  return {
    id: createId("layer"),
    type: "grid",
    name: "Grid",
    visible: true,
    opacity: 0.25,
    config: {
      lineColor: "#ffffff",
      lineWidth: 1,
      cellSize: 28,
    },
  };
}

export function createDefaultGradientLayer(): GradientLayer {
  return {
    id: createId("layer"),
    type: "gradient",
    name: "Gradient",
    visible: true,
    opacity: 0.5,
    config: {
      colorA: "#7c3aed",
      colorB: "#0ea5e9",
      angle: 135,
    },
  };
}

export function createDefaultGlowLayer(): GlowLayer {
  return {
    id: createId("layer"),
    type: "glow",
    name: "Glow",
    visible: true,
    opacity: 0.42,
    config: {
      glowColor: "#ffffff",
      x: 50,
      y: 35,
      radius: 42,
    },
  };
}

export function createDefaultNoiseLayer(): NoiseLayer {
  return {
    id: createId("layer"),
    type: "noise",
    name: "Noise",
    visible: true,
    opacity: 0.14,
    config: {
      intensity: 100,
      size: 140,
    },
  };
}

export function createDefaultBackgroundScene(): BackgroundScene {
  return {
    version: 1,
    id: createId("bg"),
    name: "Untitled Background",
    canvas: {
      backgroundColor: "#111111",
      width: 1200,
      height: 630,
    },
    layers: [createDefaultStripesLayer()],
  };
}
