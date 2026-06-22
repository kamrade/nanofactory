"use client";

import { OffsetRevealText } from "@/components/ui/offset-reveal-text";
import { TypewriterText } from "@/components/ui/typewriter-text";

type HeroAnimatedTextProps = {
  text: string;
  animateContent: boolean;
  animateMainText?: boolean;
  startDelay: number;
  visible: boolean;
  duration: number;
};

type HeroTextBlockProps = HeroAnimatedTextProps & {
  className: string;
};

type HeroEyebrowProps = {
  text: string;
  className: string;
  animateContent: boolean;
  startDelay: number;
  visible: boolean;
  duration: number;
};

type HeroCtaProps = {
  buttonText: string;
  buttonAnchor: string;
  buttonClassName: string;
  buttonRadiusVar: string;
  animateContent: boolean;
  startDelay: number;
  visible: boolean;
  duration: number;
};

function renderAnimatedText({
  text,
  animateContent,
  animateMainText = false,
  startDelay,
  visible,
  duration,
}: HeroAnimatedTextProps) {
  if (animateContent) {
    return (
      <OffsetRevealText
        text={text}
        direction="up"
        duration={duration}
        fade
        startDelay={startDelay}
        restartKey={visible ? 1 : 0}
      />
    );
  }

  if (animateMainText) {
    return (
      <TypewriterText
        text={text}
        startDelay={visible ? 0 : 10_000_000}
        restartKey={visible ? 1 : 0}
        loop={false}
        showCursor
      />
    );
  }

  return text;
}

export function HeroEyebrow({
  text,
  className,
  animateContent,
  startDelay,
  visible,
  duration,
}: HeroEyebrowProps) {
  if (text.trim().length === 0) {
    return null;
  }

  return (
    <p className={className}>
      {renderAnimatedText({
        text,
        animateContent,
        startDelay,
        visible,
        duration,
      })}
    </p>
  );
}

export function HeroHeadline({
  text,
  className,
  animateContent,
  animateMainText = false,
  startDelay,
  visible,
  duration,
}: HeroTextBlockProps) {
  return (
    <h1 className={className}>
      {renderAnimatedText({
        text,
        animateContent,
        animateMainText,
        startDelay,
        visible,
        duration,
      })}
    </h1>
  );
}

export function HeroSubtitle({
  text,
  className,
  animateContent,
  startDelay,
  visible,
  duration,
}: HeroTextBlockProps) {
  return (
    <p className={className}>
      {renderAnimatedText({
        text,
        animateContent,
        startDelay,
        visible,
        duration,
      })}
    </p>
  );
}

export function HeroCta({
  buttonText,
  buttonAnchor,
  buttonClassName,
  buttonRadiusVar,
  animateContent,
  startDelay,
  visible,
  duration,
}: HeroCtaProps) {
  const button = buttonAnchor.trim().length > 0 ? (
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

  if (!animateContent) {
    return button;
  }

  return (
    <OffsetRevealText
      text={buttonText}
      direction="up"
      duration={duration}
      fade
      startDelay={startDelay}
      restartKey={visible ? 1 : 0}
    >
      {button}
    </OffsetRevealText>
  );
}
