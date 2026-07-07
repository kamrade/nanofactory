import { TypewriterText } from "@/components/ui/typewriter-text";
import { HeroHeadline } from "./hero-headline";

type HeroContentProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonAnchor: string;
  buttonTargetType: "inner-anchor" | "link";
  animate: boolean;
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
  buttonTargetType,
  animate,
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
      {animate ? (
        <TypewriterText text={eyebrowText} showCursor={false} typingSpeed={100} />
      ) : (
        eyebrowText
      )}
    </p>
  ) : null;
  const subtitleNode = <p className={subtitleClassName}>{subtitle}</p>;
  const resolvedButtonAnchor = buttonAnchor.trim();
  const ctaNode =
    resolvedButtonAnchor.length > 0 ? (
      <a
        href={
          buttonTargetType === "link"
            ? resolvedButtonAnchor
            : resolvedButtonAnchor.startsWith("#")
              ? resolvedButtonAnchor
              : `#${resolvedButtonAnchor}`
        }
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
        animate={animate}
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
