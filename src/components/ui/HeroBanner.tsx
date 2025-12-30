import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import heroBg from "@/assets/hero-bible.jpg";

const HERO_BG_POSITION = "center 65%"; // ✅ LOCK: your chosen crop

interface CTAButton {
  text: string;
  link: string;
}

interface HeroBannerProps {
  title: string;
  titleSecondLine?: string;
  subtitle?: string;
  subtitleSecondLine?: string;
  location?: string;
  primaryCta?: CTAButton;
  secondaryCta?: CTAButton;
  logo?: string;
  logoAlt?: string;
  showCurvedDivider?: boolean;
}

export function HeroBanner({
  title,
  titleSecondLine,
  subtitle,
  subtitleSecondLine,
  location,
  primaryCta,
  secondaryCta,
  logo,
  logoAlt = "Logo",
  showCurvedDivider = true,
}: HeroBannerProps) {
  return (
    // ✅ LOCK: fixed heights => consistent hero sizing across all pages
    <section className="relative w-full h-[520px] sm:h-[560px] lg:h-[600px] flex items-start overflow-hidden">
      {/* Full-bleed Bible background */}
      <div
        className="absolute inset-0 bg-cover bg-no-repeat"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundPosition: HERO_BG_POSITION,
        }}
      />

      {/* Content container */}
      <div className="section-container relative z-10 pt-8 pb-36 md:pt-12 md:pb-44 lg:pb-52">
        <div className="max-w-2xl mx-auto bg-black/40 backdrop-blur-sm rounded-2xl ring-1 ring-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.45)] px-6 py-6 sm:px-8 sm:py-7 md:px-10 md:py-8">
          <div className="text-center">
            {/* Logo */}
            {logo && (
              <img
                src={logo}
                alt={logoAlt}
                className="block w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 object-contain mb-4 mx-auto animate-fade-in"
                style={{
                  background: "transparent",
                  boxShadow: "none",
                  border: "none",
                  padding: 0,
                  animationDelay: "0.1s",
                  animationFillMode: "both",
                }}
              />
            )}

            {/* Title Block - Cohesive Unit */}
            <div
              className="animate-fade-in"
              style={{
                animationDelay: "0.2s",
                animationFillMode: "both",
                textShadow: "0 6px 24px rgba(0,0,0,0.75)",
              }}
            >
              <h1>
                <span className="block text-4xl sm:text-5xl md:text-[3.5rem] lg:text-6xl font-extrabold text-white tracking-tight leading-[1.05] md:whitespace-nowrap" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                  {title}
                  {titleSecondLine && ` ${titleSecondLine}`}
                </span>
              </h1>
              {/* Location - immediately below as subtitle */}
              {location && (
                <p className="text-base sm:text-lg md:text-xl text-white/85 font-semibold mt-1.5 tracking-wide">
                  {location}
                </p>
              )}
            </div>

            {/* Subtitle */}
            {subtitle && (
              <p
                className="text-lg sm:text-xl md:text-2xl text-accent font-serif italic leading-relaxed mt-4 animate-fade-in"
                style={{
                  animationDelay: "0.4s",
                  animationFillMode: "both",
                  textShadow: "0 4px 16px rgba(0,0,0,0.8)",
                }}
              >
                {subtitle}
                {subtitleSecondLine && (
                  <>
                    <br />
                    {subtitleSecondLine}
                  </>
                )}
              </p>
            )}

            {/* CTA Buttons */}
            {(primaryCta || secondaryCta) && (
              <div
                className="flex flex-col sm:flex-row gap-3 justify-center mt-6 animate-fade-in"
                style={{ animationDelay: "0.6s", animationFillMode: "both" }}
              >
                {primaryCta && (
                  <Link
                    to={primaryCta.link}
                    className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-gold-dark text-foreground px-6 py-3 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                  >
                    {primaryCta.text}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}

                {secondaryCta && (
                  <Link
                    to={secondaryCta.link}
                    className="inline-flex items-center justify-center gap-2 bg-white/10 text-white border-2 border-white/40 hover:border-white/70 hover:bg-white/20 px-6 py-3 rounded-full font-semibold transition-all duration-300 backdrop-blur-sm"
                  >
                    {secondaryCta.text}
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Curved bottom divider */}
      {showCurvedDivider && (
        <svg viewBox="0 0 1440 60" className="absolute bottom-0 w-full h-10 md:h-14" preserveAspectRatio="none">
          <path d="M0,60 C480,0 960,0 1440,60 L1440,60 L0,60 Z" className="fill-background" />
        </svg>
      )}
    </section>
  );
}
