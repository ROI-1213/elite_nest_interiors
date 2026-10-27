import { useState, useRef, useCallback } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SERVICE_ORDER, SERVICE_SLUGS, SERVICE_DESCRIPTIONS, SERVICE_IMAGES } from "@/lib/services.config";

type Panel = {
  slug: string;
  title: string;
  description: string;
  image: string;
  to: string;
};

const PANELS: Panel[] = SERVICE_ORDER.map(name => ({
  slug: SERVICE_SLUGS[name],
  title: name,
  description: SERVICE_DESCRIPTIONS[name],
  image: SERVICE_IMAGES[name],
  to: `/services/${SERVICE_SLUGS[name]}`,
}));

export function ServicesAccordionShowcase({
  eyebrow = "Our Services",
  title = "Crafting Bengaluru Spaces With Design, Precision & Execution",
  subtitle = "Explore our premium architecture, construction, supervision, and interior design services tailored for modern Bengaluru living and working spaces.",
}: {
  eyebrow?: string | null;
  title?: string | null;
  subtitle?: string | null;
} = {}) {
  const [active, setActive] = useState<string>(PANELS[0].slug);

  const activePanel = PANELS.find((p) => p.slug === active) || PANELS[0];
  const otherPanels = PANELS.filter((p) => p.slug !== activePanel.slug);

  // Timer ref — used to debounce the reset-to-first on mouse leave for desktop
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelLeave = useCallback(() => {
    if (leaveTimer.current) {
      clearTimeout(leaveTimer.current);
      leaveTimer.current = null;
    }
  }, []);

  const handleContainerLeave = useCallback(() => {
    if (typeof window !== "undefined" && window.innerWidth < 768) return;
    leaveTimer.current = setTimeout(() => {
      setActive(PANELS[0].slug);
    }, 120);
  }, []);

  const handlePanelEnter = useCallback((slug: string) => {
    if (typeof window !== "undefined" && window.innerWidth < 768) return;
    cancelLeave();
    setActive(slug);
  }, [cancelLeave]);

  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: "#FFFFFF",
        paddingTop: 60,
        paddingBottom: 70,
      }}
    >
      <div className="container-prose">
        <div className="max-w-3xl">
          <span
            className="text-[11px] font-semibold uppercase tracking-[0.32em]"
            style={{ color: "#C49A5A" }}
          >
            {eyebrow || "Our Services"}
          </span>
          <h2
            className="mt-3 font-serif leading-[1.1]"
            style={{ fontSize: "clamp(1.75rem, 3.4vw, 2.75rem)", color: "#2D241F" }}
          >
            {title || "Crafting Bengaluru Spaces With Design, Precision & Execution"}

          </h2>
          <p
            className="mt-4 max-w-2xl text-[14.5px] leading-relaxed"
            style={{ color: "rgba(45,36,31,0.72)" }}
          >
            {subtitle}

          </p>
        </div>

        {/* ── Mobile Layout (< md): Big Featured Card + 2-Card Grid System Below ── */}
        <div className="mt-8 flex flex-col gap-4 md:hidden">
          {/* Active Featured Big Card */}
          <div className="relative overflow-hidden rounded-2xl border border-[#C49A5A]/30 bg-[#1D1A17] shadow-xl h-[340px]">
            <img
              src={activePanel.image}
              alt={activePanel.title}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(31,26,22,0.2) 0%, rgba(31,26,22,0.9) 100%)",
              }}
            />
            <div className="absolute inset-x-0 bottom-0 p-5 flex flex-col justify-end">
              <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#E9C98A]">
                Bengaluru · Elite Nest
              </span>
              <h3 className="mt-2 font-serif text-2xl font-medium leading-tight text-white">
                {activePanel.title}
              </h3>
              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-white/85 line-clamp-3">
                {activePanel.description}
              </p>
              <div className="mt-4">
                <Link
                  to={activePanel.to}
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#E9C98A] hover:underline"
                >
                  View Details
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* 2-Card Grid System Below the Big Image */}
          <div className="grid grid-cols-2 gap-3 mt-1">
            {otherPanels.map((p) => (
              <button
                key={p.slug}
                onClick={() => setActive(p.slug)}
                className="group relative overflow-hidden rounded-xl border border-[#C49A5A]/30 bg-[#1D1A17] text-left transition-all duration-300 active:scale-95 shadow-md h-[135px]"
              >
                <img
                  src={p.image}
                  alt={p.title}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(20,15,12,0.25) 0%, rgba(20,15,12,0.88) 100%)",
                  }}
                />
                <div className="absolute inset-x-3 bottom-3 z-10">
                  <h4 className="font-serif text-sm sm:text-base font-medium leading-snug text-white line-clamp-2 drop-shadow-sm">
                    {p.title}
                  </h4>
                  <span className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-[#E9C98A]">
                    Select <ArrowRight className="h-2.5 w-2.5" />
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ── Desktop Layout (>= md): Horizontal Expanding Accordion ── */}
        <div
          className="mt-10 hidden md:flex flex-row w-full gap-2 md:gap-3 md:h-[500px] lg:h-[600px] overflow-hidden"
          onMouseLeave={handleContainerLeave}
          onMouseEnter={cancelLeave}
        >
          {PANELS.map((p) => {
            const isActive = p.slug === active;
            return (
              <div
                key={p.slug}
                onMouseEnter={() => handlePanelEnter(p.slug)}
                onClick={() => {
                  if (!isActive) setActive(p.slug);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    if (!isActive) setActive(p.slug);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-expanded={isActive}
                className={`
                  group relative block overflow-hidden rounded-2xl md:rounded-[24px]
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8894D]
                  transition-[flex-grow,height,opacity,transform] duration-[600ms] ease-[cubic-bezier(0.25,1,0.5,1)]
                  border border-[#C49A5A]/25 cursor-pointer transform-gpu will-change-[flex-grow]
                  ${isActive 
                    ? "h-full flex-[8_8_0%] min-w-[280px]" 
                    : "h-full flex-[1_1_0%] min-w-[54px] max-w-[76px]"
                  }
                `}
                style={{
                  WebkitBackfaceVisibility: "hidden",
                  backfaceVisibility: "hidden",
                }}
              >
                <Link
                  to={p.to}
                  className="absolute inset-0 z-20"
                  aria-label={`View ${p.title}`}
                  style={{ pointerEvents: isActive ? "auto" : "none" }}
                />

                <img
                  src={p.image}
                  alt={p.title}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[700ms] ease-out transform-gpu will-change-transform"
                  style={{
                    transform: isActive ? "scale(1.05)" : "scale(1)",
                    WebkitBackfaceVisibility: "hidden",
                    backfaceVisibility: "hidden",
                  }}
                />

                <div
                  className="absolute inset-0 transition-opacity duration-[500ms] pointer-events-none transform-gpu"
                  style={{
                    background: isActive
                      ? "linear-gradient(180deg, rgba(31,26,22,0.15) 0%, rgba(31,26,22,0.85) 100%)"
                      : "linear-gradient(180deg, rgba(31,26,22,0.45) 0%, rgba(31,26,22,0.95) 100%)",
                  }}
                />

                {/* Collapsed Title - Desktop (Vertical) */}
                <div
                  className={`absolute inset-0 flex items-end justify-center p-4 transition-opacity duration-300 pointer-events-none ${
                    isActive ? "opacity-0" : "opacity-100"
                  }`}
                >
                  <h3
                    className="whitespace-nowrap font-serif text-[15px] tracking-wide text-white/95 xl:text-[16px]"
                    style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                  >
                    {p.title}
                  </h3>
                </div>

                {/* Expanded Content */}
                <div
                  className={`absolute inset-x-0 bottom-0 flex flex-col justify-end p-6 md:p-8 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] z-10 pointer-events-none transform-gpu ${
                    isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  }`}
                >
                  <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#E9C98A]">
                    Bengaluru · Elite Nest
                  </span>
                  <h3 className="mt-2 font-serif text-2xl leading-tight text-white md:text-3xl lg:text-4xl">
                    {p.title}
                  </h3>
                  <p className="mt-3 max-w-md text-[13.5px] leading-relaxed text-white/80 md:text-[15px] line-clamp-3 md:line-clamp-none">
                    {p.description}
                  </p>
                  <div className="mt-5">
                    <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#E9C98A]">
                      View Details
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
