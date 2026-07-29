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

export function ServicesAccordionShowcase() {
  const [active, setActive] = useState<string>(PANELS[0].slug);

  // Timer ref — used to debounce the reset-to-first on mouse leave
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelLeave = useCallback(() => {
    if (leaveTimer.current) {
      clearTimeout(leaveTimer.current);
      leaveTimer.current = null;
    }
  }, []);

  const handleContainerLeave = useCallback(() => {
    if (window.innerWidth < 768) return;
    // Delay the reset so moving between sibling panels doesn't flicker
    leaveTimer.current = setTimeout(() => {
      setActive(PANELS[0].slug);
    }, 120);
  }, []);

  const handlePanelEnter = useCallback((slug: string) => {
    if (window.innerWidth < 768) return;
    cancelLeave(); // cancel any pending reset
    setActive(slug);
  }, [cancelLeave]);

  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: "#FFFFFF",
        paddingTop: 80,
        paddingBottom: 80,
      }}
    >
      <div className="container-prose">
        <div className="max-w-3xl">
          <span
            className="text-[11px] font-semibold uppercase tracking-[0.32em]"
            style={{ color: "#C49A5A" }}
          >
            Our Services
          </span>
          <h2
            className="mt-3 font-serif leading-[1.1]"
            style={{ fontSize: "clamp(1.75rem, 3.4vw, 2.75rem)", color: "#2D241F" }}
          >
            Crafting Bengaluru Spaces With{" "}
            <span style={{ color: "#B8894D" }}>Design, Precision &amp; Execution</span>
          </h2>
          <p
            className="mt-4 max-w-2xl text-[14.5px] leading-relaxed"
            style={{ color: "rgba(45,36,31,0.72)" }}
          >
            Explore our premium architecture, construction, supervision, and interior
            design services tailored for modern Bengaluru living and working spaces.
          </p>
        </div>

        {/* Unified Responsive Accordion */}
        <div
          className="mt-10 flex flex-col md:flex-row w-full gap-2 md:gap-3 md:h-[500px] lg:h-[600px] overflow-hidden"
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
                    ? "h-[360px] md:h-full md:flex-[8_8_0%] md:min-w-[280px]" 
                    : "h-[68px] md:h-full md:flex-[1_1_0%] md:min-w-[54px] md:max-w-[76px]"
                  }
                `}
                style={{
                  WebkitBackfaceVisibility: "hidden",
                  backfaceVisibility: "hidden",
                }}
              >
                {/* Invisible link overlay — pointer-events set to none on collapsed panels 
                    so only the expanded card is fully clickable */}
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
                  className={`absolute inset-0 hidden md:flex items-end justify-center p-4 transition-opacity duration-300 pointer-events-none ${
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

                {/* Collapsed Title - Mobile (Horizontal) */}
                <div
                  className={`absolute inset-0 flex md:hidden items-center justify-start px-6 transition-opacity duration-300 pointer-events-none ${
                    isActive ? "opacity-0" : "opacity-100"
                  }`}
                >
                  <h3 className="font-serif text-[16px] tracking-wide text-white/95">
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
