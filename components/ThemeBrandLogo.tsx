import Logo from "./Logo";

export default function ThemeBrandLogo({
  darkSrc,
  lightSrc,
  className = "",
  compact = false,
}: {
  darkSrc: string;
  lightSrc: string;
  className?: string;
  compact?: boolean;
}) {
  return (
    <>
      <Logo
        src={darkSrc}
        compact={compact}
        className={`theme-brand-logo theme-brand-logo-dark ${className}`}
      />
      <Logo
        src={lightSrc}
        compact={compact}
        className={`theme-brand-logo theme-brand-logo-light ${className}`}
      />
    </>
  );
}
