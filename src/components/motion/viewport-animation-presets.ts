export const VIEWPORT_TRIGGER_THRESHOLD = 0.5;

export const VIEWPORT_WORD_STAGGER_DEFAULTS = {
  direction: "up",
  offset: "16px",
  duration: 700,
  stagger: 80,
  startDelay: 0,
  reverse: false,
  fade: true,
  blur: false,
} as const;

export const VIEWPORT_WORD_STAGGER_PRESETS = {
  heroEyebrow: {
    duration: 1000,
    stagger: 60,
    offset: "10px",
    direction: "left",
    fade: true,
  },
  featureCardTitle: {
    duration: 1100,
    stagger: 70,
    offset: "10px",
    direction: "left",
    fade: true,
  },
  hero: {
    duration: 2200,
    stagger: 120,
    offset: "14px",
    direction: "left",
    fade: true,
  },
  cta: {
    duration: 2000,
    stagger: 100,
    offset: "14px",
    direction: "left",
    fade: true,
  },
} as const;
