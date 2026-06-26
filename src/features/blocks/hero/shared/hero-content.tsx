import { ViewportAnimation } from "@/components/motion/viewport-animation";
import { VIEWPORT_WORD_STAGGER_PRESETS } from "@/components/motion/viewport-animation-presets";
import { HeroHeadline } from "./hero-headline";

type HeroContentProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonAnchor: string;
  animateMainText: boolean;
  headlineVariant: "default" | "centered";
  contentStackClassName: string;
  eyebrowClassName: string;
  headingGroupClassName?: string;
  subtitleClassName: string;
  buttonClassName: string;
  buttonRadiusVar: string;
};

export function HeroContent({
  eyebrow,
  title,
  subtitle,
  buttonText,
  buttonAnchor,
  animateMainText,
  headlineVariant,
  contentStackClassName,
  eyebrowClassName,
  headingGroupClassName,
  subtitleClassName,
  buttonClassName,
  buttonRadiusVar,
}: HeroContentProps) {
  const eyebrowText = eyebrow.trim();
  const eyebrowNode = eyebrowText.length > 0 ? (
    <p className={eyebrowClassName}>
      {animateMainText ? (
        <ViewportAnimation
          type="word-stagger"
          text={eyebrowText}
          triggerMode="immediate"
          {...VIEWPORT_WORD_STAGGER_PRESETS.heroEyebrow}
        />
      ) : (
        eyebrowText
      )}
    </p>
  ) : null;
  const subtitleNode = <p className={subtitleClassName}>{subtitle}</p>;
  const ctaNode =
    buttonAnchor.trim().length > 0 ? (
      <a
        href={`#${buttonAnchor}`}
        className={buttonClassName}
        style={{ borderRadius: `var(${buttonRadiusVar})` }}
      >
        {buttonText}
      </a>
    ) : (
      <span className={buttonClassName} style={{ borderRadius: `var(${buttonRadiusVar})` }}>
        {buttonText}
      </span>
    );

  const headingAndSubtitle = (
    <>
      <HeroHeadline
        text={title}
        variant={headlineVariant}
        animateMainText={animateMainText}
      />
      {subtitleNode}
    </>
  );

  return (
    <div className={contentStackClassName}>
      {eyebrowNode}
      {headingGroupClassName ? (
        <div className={headingGroupClassName}>{headingAndSubtitle}</div>
      ) : (
        headingAndSubtitle
      )}
      <div>
        {ctaNode}
      </div>
    </div>
  );
}
