"use client";

import { useVisibleOnce } from "@/hooks/use-visible-once";
import { OffsetRevealText } from "@/components/ui/offset-reveal-text";
import { TypewriterText } from "@/components/ui/typewriter-text";

type HeroHeadlineProps = {
  text: string;
  className: string;
  animateContent?: boolean;
  animateMainText?: boolean;
};

type HeroEyebrowProps = {
  text: string;
  className: string;
};

type HeroSubtitleProps = {
  text: string;
  className: string;
};

type HeroCtaProps = {
  buttonText: string;
  buttonAnchor: string;
  buttonClassName: string;
  buttonRadiusVar: string;
};

export function HeroEyebrow({ text, className }: HeroEyebrowProps) {
  if (text.trim().length === 0) {
    return null;
  }
  return <p className={className}>{text}</p>;
}

export function HeroHeadline({
  text,
  className,
  animateContent = false,
  animateMainText = false,
}: HeroHeadlineProps) {
  const { ref, visible } = useVisibleOnce();

  return (
    <h1 ref={ref} className={className}>
      {animateContent ? (
        <OffsetRevealText
          text={text}
          direction="up"
          duration={3000}
          fade
          startDelay={visible ? 0 : 10_000_000}
          restartKey={visible ? 1 : 0}
        />
      ) : animateMainText ? (
        <TypewriterText
          text={text}
          startDelay={visible ? 0 : 10_000_000}
          restartKey={visible ? 1 : 0}
          loop={false}
          showCursor
        />
      ) : (
        text
      )}
    </h1>
  );
}

export function HeroSubtitle({ text, className }: HeroSubtitleProps) {
  return <p className={className}>{text}</p>;
}

export function HeroCta({ buttonText, buttonAnchor, buttonClassName, buttonRadiusVar }: HeroCtaProps) {
  if (buttonAnchor.trim().length > 0) {
    return (
      <a
        href={`#${buttonAnchor}`}
        className={buttonClassName}
        style={{ borderRadius: `var(${buttonRadiusVar})` }}
      >
        {buttonText}
      </a>
    );
  }
  return (
    <span className={buttonClassName} style={{ borderRadius: `var(${buttonRadiusVar})` }}>
      {buttonText}
    </span>
  );
}
