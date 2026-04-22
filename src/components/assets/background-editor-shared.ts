"use client";

import {
  createDefaultDotsLayer,
  createDefaultGlowLayer,
  createDefaultGradientLayer,
  createDefaultGridLayer,
  createDefaultNoiseLayer,
  createDefaultStripesLayer,
} from "@/components/assets/background-scene-defaults";
import type { BackgroundSceneLayer } from "@/lib/background-scenes/types";

export const effectOptions = [
  { key: "stripes", label: "Stripes" },
  { key: "dots", label: "Dots" },
  { key: "grid", label: "Grid" },
  { key: "gradient", label: "Gradient" },
  { key: "glow", label: "Glow" },
  { key: "noise", label: "Noise" },
] as const;

export type EffectType = (typeof effectOptions)[number]["key"];

export function normalizeHex(input: string, fallback: string) {
  const value = input.trim();
  return /^#(?:[0-9a-fA-F]{3}){1,2}$/.test(value) ? value : fallback;
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function downloadJson(filename: string, json: string) {
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function createLayerByType(type: EffectType) {
  if (type === "dots") {
    return createDefaultDotsLayer();
  }

  if (type === "grid") {
    return createDefaultGridLayer();
  }

  if (type === "gradient") {
    return createDefaultGradientLayer();
  }

  if (type === "glow") {
    return createDefaultGlowLayer();
  }

  if (type === "noise") {
    return createDefaultNoiseLayer();
  }

  return createDefaultStripesLayer();
}

export function createLayerId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `layer_${crypto.randomUUID().slice(0, 8)}`;
  }

  return `layer_${Math.random().toString(36).slice(2, 10)}`;
}

export function getLayerCssSnippet(layer: BackgroundSceneLayer) {
  if (layer.type === "stripes") {
    const { stripeColor, stripeWidth, gapWidth, angle } = layer.config;
    return `repeating-linear-gradient(${angle}deg, ${stripeColor} 0 ${stripeWidth}px, transparent ${stripeWidth}px ${stripeWidth + gapWidth}px)`;
  }

  if (layer.type === "dots") {
    const { dotColor, dotSize, gap } = layer.config;
    return `radial-gradient(circle, ${dotColor} ${dotSize}px, transparent ${dotSize + 1}px) 0 0 / ${gap}px ${gap}px`;
  }

  if (layer.type === "grid") {
    const { lineColor, lineWidth, cellSize } = layer.config;
    return `linear-gradient(${lineColor} ${lineWidth}px, transparent ${lineWidth}px), linear-gradient(90deg, ${lineColor} ${lineWidth}px, transparent ${lineWidth}px) 0 0 / ${cellSize}px ${cellSize}px`;
  }

  if (layer.type === "gradient") {
    const { colorA, colorB, angle } = layer.config;
    return `linear-gradient(${angle}deg, ${colorA}, ${colorB})`;
  }

  if (layer.type === "glow") {
    const { glowColor, x, y, radius } = layer.config;
    return `radial-gradient(circle at ${x}% ${y}%, ${glowColor} 0%, transparent ${radius}%)`;
  }

  const { intensity, size } = layer.config;
  return `repeating-radial-gradient(circle at 0 0, rgba(255,255,255,${Math.max(
    0.02,
    Math.min(0.4, intensity / 255)
  )}) 0 1px, transparent 1px ${size}px)`;
}
