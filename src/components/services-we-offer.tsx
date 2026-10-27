import { useState, useRef, useEffect } from "react";
import { SERVICE_ORDER, SERVICE_SLUGS, SERVICE_IMAGES } from "@/lib/services.config";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Service = { key: string; label: string; image: string };

const SERVICES: Service[] = SERVICE_ORDER.map(name => ({
  key: SERVICE_SLUGS[name],
  label: name,
  image: SERVICE_IMAGES[name],
}));

export function ServicesWeOffer({
  title = "Services We Offer",
  subtitle = null,
}: {
  title?: string | null;
  subtitle?: string | null;
} = {}) {
  const [active, setActive] = useState(SERVICES[0].key);
  const activeIndex = SERVICES.findIndex((s) => s.key === active);
  
  const navContainerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  
  // Touch swipe state for image
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Scroll active tab into view on mobile when active changes
  useEffect(() => {
    const activeBtn = buttonRefs.current[active];
    if (activeBtn && navContainerRef.current) {
      activeBtn.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [active]);

  const handleNext = () => {
    const nextIdx = (activeIndex + 1) % SERVICES.length;
    setActive(SERVICES[nextIdx].key);
  };

  const handlePrev = () => {
    const prevIdx = (activeIndex - 1 + SERVICES.length) % SERVICES.length;
    setActive(SERVICES[prevIdx].key);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 40;
    const isRightSwipe = distance < -40;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <section style={{ backgroundColor: "#FBF6EC" }}>
      <div className="container-prose py-10 md:py-16">
        <div className="text-center mb-6 md:mb-10">
          <h2 className="font-serif text-3xl md:text-5xl text-[#1F1A16]">
            {title || "Services We Offer"}
          </h2>
          {subtitle && (
            <p className="mt-3 max-w-2xl mx-auto text-sm md:text-base text-muted-foreground">
              {subtitle}
            </p>
          )}
        </div>
        <div className="grid gap-6 md:grid-cols-[28%_1fr] md:gap-10">
          {/* Left menu */}
          <div className="flex flex-col">

            {/* Mobile: Horizontal scrolling menu with arrows hint */}
            <div className="relative md:hidden mb-2">
              <div
                ref={navContainerRef}
                className="flex gap-2.5 overflow-x-auto pb-3 pt-1 px-1 scroll-smooth category-scroll-bar"
                style={{
                  WebkitOverflowScrolling: "touch",
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }}
              >
                {SERVICES.map((s) => {
                  const isActive = s.key === active;
                  return (
                    <button
                      key={s.key}
                      ref={(el) => (buttonRefs.current[s.key] = el)}
                      onClick={() => setActive(s.key)}
                      className="shrink-0 rounded-full border px-4 py-2 text-xs sm:text-sm font-medium transition-all shadow-sm duration-300"
                      style={{
                        backgroundColor: isActive ? "#B98545" : "#FFFCF7",
                        borderColor: isActive ? "#B98545" : "#E5D4BD",
                        color: isActive ? "#FFFFFF" : "#3A322A",
                        transform: isActive ? "scale(1.02)" : "scale(1)",
                      }}
                    >
                      {s.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Desktop: vertical list */}
            <ul className="hidden flex-col gap-2 md:flex">
              {SERVICES.map((s) => {
                const isActive = s.key === active;
                return (
                  <li key={s.key}>
                    <button
                      onClick={() => setActive(s.key)}
                      className={`w-full rounded-xl px-4 py-3 text-left text-[15px] transition-colors ${
                        isActive ? "" : "hover:text-[#B98545]"
                      }`}
                      style={{
                        border: isActive ? "1.5px solid #B98545" : "1.5px solid transparent",
                        backgroundColor: isActive ? "#F6ECD9" : "transparent",
                        color: isActive ? "#1F1A16" : "#3A322A",
                        fontWeight: isActive ? 600 : 500,
                      }}
                    >
                      {s.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Right image with swipe support & navigation arrows */}
          <div className="relative">
            <div
              className="relative w-full overflow-hidden rounded-2xl shadow-md touch-pan-y"
              style={{ height: "clamp(280px, 45vw, 480px)" }}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {SERVICES.map((s) => (
                <img
                  key={s.key}
                  src={s.image}
                  alt={`${s.label} interior by Elite Nest`}
                  loading="lazy"
                  className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out ${
                    s.key === active ? "opacity-100" : "opacity-0"
                  }`}
                />
              ))}

              {/* Mobile overlay arrow buttons for fast switching */}
              <button
                onClick={handlePrev}
                aria-label="Previous service"
                className="md:hidden absolute left-2 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm active:scale-95 transition"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={handleNext}
                aria-label="Next service"
                className="md:hidden absolute right-2 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm active:scale-95 transition"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            {/* Dots navigation */}
            <div className="mt-4 flex items-center justify-center gap-1.5 overflow-x-auto py-1">
              {SERVICES.map((s) => {
                const isActive = s.key === active;
                return (
                  <button
                    key={s.key}
                    onClick={() => setActive(s.key)}
                    aria-label={`Show ${s.label}`}
                    className="h-2 rounded-full transition-all duration-300"
                    style={{
                      width: isActive ? 24 : 8,
                      backgroundColor: isActive ? "#B98545" : "#E5D4BD",
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

