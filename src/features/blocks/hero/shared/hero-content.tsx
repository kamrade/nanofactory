"use client";

import { useHeroAnimationState } from "./render";
import { HeroCta, HeroEyebrow, HeroHeadline, HeroSubtitle } from "./content";

type HeroContentProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonAnchor: string;
  animateMainText: boolean;
  animateContent: boolean;
  duration?: number;
  contentStackClassName: string;
  eyebrowClassName: string;
  headingGroupClassName?: string;
  headingClassName: string;
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
  animateContent,
  duration = 3000,
  contentStackClassName,
  eyebrowClassName,
  headingGroupClassName,
  headingClassName,
  subtitleClassName,
  buttonClassName,
  buttonRadiusVar,
}: HeroContentProps) {
  const { visibleRef, visible, eyebrowDelay, titleDelay, subtitleDelay, buttonDelay } =
    useHeroAnimationState(eyebrow, animateContent);

  const headingAndSubtitle = (
    <>
      <HeroHeadline
        text={title}
        className={headingClassName}
        animateContent={animateContent}
        animateMainText={animateMainText}
        startDelay={titleDelay}
        visible={visible}
        duration={duration}
      />
      <HeroSubtitle
        text={subtitle}
        className={subtitleClassName}
        animateContent={animateContent}
        startDelay={subtitleDelay}
        visible={visible}
        duration={duration}
      />
    </>
  );

  return (
    <div ref={visibleRef} className={contentStackClassName}>
      <HeroEyebrow
        text={eyebrow}
        className={eyebrowClassName}
        animateContent={animateContent}
        startDelay={eyebrowDelay}
        visible={visible}
        duration={duration}
      />
      {headingGroupClassName ? (
        <div className={headingGroupClassName}>{headingAndSubtitle}</div>
      ) : (
        headingAndSubtitle
      )}
      <div>
        <HeroCta
          buttonText={buttonText}
          buttonAnchor={buttonAnchor}
          buttonClassName={buttonClassName}
          buttonRadiusVar={buttonRadiusVar}
          animateContent={animateContent}
          startDelay={buttonDelay}
          visible={visible}
          duration={duration}
        />
      </div>
    </div>
  );
}
