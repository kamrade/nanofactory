import { ViewportAnimation } from "@/components/motion/viewport-animation";
import { VIEWPORT_WORD_STAGGER_PRESETS } from "@/components/motion/viewport-animation-presets";
import styles from "./block-section-title.module.css";

type BlockSectionTitleProps = {
  title: string;
  fontWeight?: 400 | 600;
  animate?: boolean;
  animationPreset?: keyof typeof VIEWPORT_WORD_STAGGER_PRESETS;
};

export function BlockSectionTitle({
  title,
  fontWeight = 400,
  animate = false,
  animationPreset = "cta",
}: BlockSectionTitleProps) {
  if (!title.trim()) return null;
  return (
    <h2
      className={styles.title}
      style={fontWeight !== 400 ? { fontWeight } : undefined}
    >
      {animate ? (
        <ViewportAnimation
          type="word-stagger"
          text={title}
          {...VIEWPORT_WORD_STAGGER_PRESETS[animationPreset]}
        />
      ) : (
        title
      )}
    </h2>
  );
}
