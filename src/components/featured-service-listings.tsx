import { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { resolveFeaturedCategories } from "@/lib/featured-listings.config";

const GOLD = "#B88745";
const GOLD_LIGHT = "#E9C98A";
const GOLD_BORDER = "rgba(184,135,69,0.4)";

export function FeaturedServiceListings({
  eyebrow = "Featured Service Listings",
  title = "Featured Listings",
  subtitle = "Explore our curated work across interiors, construction, supervision, and design execution.",
  cardsJson,
}: {
  eyebrow?: string | null;
  title?: string | null;
  subtitle?: string | null;
  cardsJson?: string | null;
} = {}) {
  const categories = resolveFeaturedCategories(cardsJson);
  const [activeKey, setActiveKey] = useState("turnkey");
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const category = categories.find((c) => c.key === activeKey) ?? categories[0];

  const checkScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 5);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
  }, []);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll]);

  const scrollBy = (amount: number) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: amount, behavior: "smooth" });
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (scrollContainerRef.current && Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      scrollContainerRef.current.scrollLeft += e.deltaY;
      checkScroll();
    }
  };

  const topCards = category.cards.slice(0, 2);
  const bottomCards = category.cards.slice(2, 5);

  return (
    <section
      style={{
        background: "linear-gradient(180deg,#FFFAF2 0%,#F6EFE4 100%)",
        padding: "60px 0 80px 0",
      }}
    >
      <div className="container-prose">

        {/* Heading */}
        <div>
          <span style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.32em", color: GOLD }}>
            {eyebrow || "Featured Service Listings"}
          </span>
          <h2 className="mt-3 font-serif" style={{ fontSize: "clamp(2rem,4.5vw,4rem)", color: "#2B211B", lineHeight: 1.08, letterSpacing: "-0.01em" }}>
            {title || "Featured Listings"}
          </h2>
          <p style={{ marginTop: 10, fontSize: 14.5, lineHeight: 1.7, color: "#6F6258", maxWidth: 480 }}>
            {subtitle || "Explore our curated work across interiors, construction, supervision, and design execution."}
          </p>
        </div>

        {/* ── Filter Buttons with Manual Scroll Controls ───────────────────── */}
        <div style={{ position: "relative", marginTop: 28 }}>
          {/* Scroll Left Button */}
          <button
            type="button"
            aria-label="Scroll category filters left"
            onClick={() => scrollBy(-260)}
            disabled={!canScrollLeft}
            style={{
              position: "absolute",
              left: -16,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 20,
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "#FFFAF2",
              border: `1px solid ${GOLD_BORDER}`,
              color: canScrollLeft ? "#8A6338" : "#D4C5B0",
              cursor: canScrollLeft ? "pointer" : "default",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 14px rgba(43,33,27,0.12)",
              opacity: canScrollLeft ? 1 : 0.35,
              transition: "opacity 0.2s, background 0.2s, color 0.2s, transform 0.2s",
              outline: "none",
            }}
          >
            <ChevronLeft size={18} />
          </button>

          {/* Scroll Right Button */}
          <button
            type="button"
            aria-label="Scroll category filters right"
            onClick={() => scrollBy(260)}
            disabled={!canScrollRight}
            style={{
              position: "absolute",
              right: -16,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 20,
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "#FFFAF2",
              border: `1px solid ${GOLD_BORDER}`,
              color: canScrollRight ? "#8A6338" : "#D4C5B0",
              cursor: canScrollRight ? "pointer" : "default",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 14px rgba(43,33,27,0.12)",
              opacity: canScrollRight ? 1 : 0.35,
              transition: "opacity 0.2s, background 0.2s, color 0.2s, transform 0.2s",
              outline: "none",
            }}
          >
            <ChevronRight size={18} />
          </button>

          <div
            ref={scrollContainerRef}
            onWheel={handleWheel}
            className="category-scroll-bar"
            style={{
              display: "flex",
              gap: 10,
              overflowX: "auto",
              overflowY: "hidden",
              paddingBottom: 10,
              paddingLeft: 6,
              paddingRight: 6,
              scrollBehavior: "smooth",
              WebkitOverflowScrolling: "touch" as never,
            }}
          >
            {categories.map((cat) => {
              const isActive = cat.key === activeKey;
              return (
                <button
                  key={cat.key}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setActiveKey(cat.key)}
                  style={{
                    flexShrink: 0,
                    whiteSpace: "nowrap",
                    borderRadius: 9999,
                    padding: "7px 18px",
                    fontSize: 12.5,
                    fontWeight: 500,
                    cursor: "pointer",
                    border: `1px solid ${GOLD_BORDER}`,
                    background: isActive ? GOLD : "rgba(255,250,242,0.9)",
                    color: isActive ? "#fff" : "#8A6338",
                    boxShadow: isActive ? "0 8px 20px rgba(184,135,69,0.28)" : "none",
                    transition: "background 0.2s, color 0.2s, box-shadow 0.2s",
                    pointerEvents: "auto",
                    position: "relative",
                    zIndex: 10,
                    outline: "none",
                  }}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Cards Grid: 2 Cards Above + 3 Cards Below ──────────────────────── */}
        <div key={activeKey} className="mt-6 flex flex-col gap-3.5 sm:gap-4">
          
          {/* Row 1: 2 Cards Above */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
            {topCards.map((card, idx) => (
              <div
                key={idx}
                className="group relative overflow-hidden rounded-xl sm:rounded-2xl border border-[rgba(196,154,90,0.25)] bg-[#1a140e] transition-transform duration-300 hover:-translate-y-1"
                style={{ height: "clamp(180px, 32vw, 290px)" }}
              >
                <img
                  src={card.image}
                  alt={card.title}
                  loading={idx === 0 ? "eager" : "lazy"}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                {/* Gradient overlay */}
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background: "linear-gradient(to top, rgba(15,10,6,0.92) 0%, rgba(15,10,6,0.35) 60%, transparent 100%)",
                  }}
                />
                {/* Content */}
                <div className="absolute inset-x-3 bottom-3 z-10 sm:inset-x-5 sm:bottom-4">
                  {card.tag && (
                    <span
                      className="inline-block rounded-full px-2 py-0.5 text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-[#E9C98A] border border-[#C58B45]/40 bg-[#C58B45]/20 mb-1 sm:mb-1.5"
                    >
                      {card.tag}
                    </span>
                  )}
                  <h3 className="font-serif text-xs sm:text-base md:text-xl font-medium leading-tight text-white line-clamp-1 sm:line-clamp-2">
                    {card.title}
                  </h3>
                  <p className="mt-1 hidden sm:block text-[11px] sm:text-xs text-white/75 line-clamp-1 md:line-clamp-2">
                    {card.description}
                  </p>
                  <Link
                    to={category.to}
                    className="mt-1.5 sm:mt-2 inline-flex items-center gap-1 text-[9px] sm:text-[11px] font-bold uppercase tracking-wider text-[#E9C98A] hover:underline"
                  >
                    View <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Row 2: 3 Cards Below */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            {bottomCards.map((card, idx) => (
              <div
                key={idx}
                className="group relative overflow-hidden rounded-lg sm:rounded-2xl border border-[rgba(196,154,90,0.25)] bg-[#1a140e] transition-transform duration-300 hover:-translate-y-1"
                style={{ height: "clamp(150px, 26vw, 240px)" }}
              >
                <img
                  src={card.image}
                  alt={card.title}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                {/* Gradient overlay */}
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background: "linear-gradient(to top, rgba(15,10,6,0.92) 0%, rgba(15,10,6,0.3) 65%, transparent 100%)",
                  }}
                />
                {/* Content */}
                <div className="absolute inset-x-2 bottom-2.5 z-10 sm:inset-x-4 sm:bottom-4">
                  {card.tag && (
                    <span
                      className="inline-block rounded-full px-1.5 py-0.5 text-[8px] sm:text-[9.5px] font-semibold uppercase tracking-wider text-[#E9C98A] border border-[#C58B45]/40 bg-[#C58B45]/20 mb-1"
                    >
                      {card.tag}
                    </span>
                  )}
                  <h3 className="font-serif text-[11px] sm:text-sm md:text-lg font-medium leading-tight text-white line-clamp-1 sm:line-clamp-2">
                    {card.title}
                  </h3>
                  <Link
                    to={category.to}
                    className="mt-1 inline-flex items-center gap-0.5 text-[8.5px] sm:text-[10px] font-bold uppercase tracking-wider text-[#E9C98A] hover:underline"
                  >
                    View <ArrowUpRight className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
