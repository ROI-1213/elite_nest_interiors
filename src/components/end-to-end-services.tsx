import { useRef, useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SERVICE_ORDER, SERVICE_SLUGS, SERVICE_IMAGES } from "@/lib/services.config";
import { servicesQuery } from "@/lib/queries";

type ServiceCard = {
  title: string;
  image: string;
  slug: string;
};

const DEFAULT_CATEGORIES: ServiceCard[] = SERVICE_ORDER.map((name) => ({
  title: name,
  slug: SERVICE_SLUGS[name],
  image: SERVICE_IMAGES[name],
}));

const CARD_W = 190; // card width
const GAP = 20;     // gap-5
const STEP = CARD_W + GAP;

export function EndToEndServices({
  eyebrow = "What we offer",
  title = "Our End-to-End Home Interior Design Services In Bangalore",
}: {
  eyebrow?: string | null;
  title?: string | null;
} = {}) {
  const { data: dbServices = [] } = useQuery(servicesQuery({ onlyActive: true }));

  const categoriesList: ServiceCard[] = dbServices && dbServices.length > 0
    ? dbServices.map((s) => ({
        title: s.title,
        slug: s.slug,
        image: s.image_url || SERVICE_IMAGES[s.title] || SERVICE_IMAGES[SERVICE_ORDER[0]],
      }))
    : DEFAULT_CATEGORIES;

  const LOOP = [...categoriesList, ...categoriesList, ...categoriesList];
  const SINGLE_SET = categoriesList.length * STEP;

  const trackRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number | null>(null);
  const pausedRef = useRef(false);
  const [canPrev, setCanPrev] = useState(true);
  const [canNext, setCanNext] = useState(true);

  // ── Auto-scroll ──────────────────────────────────────────────────
  const startAutoScroll = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;

    if (animRef.current) {
      cancelAnimationFrame(animRef.current);
      animRef.current = null;
    }

    const tick = () => {
      if (!pausedRef.current && el) {
        el.scrollLeft -= 0.8;

        if (el.scrollLeft <= SINGLE_SET) {
          el.scrollLeft += SINGLE_SET;
        }
      }
      animRef.current = requestAnimationFrame(tick);
    };

    animRef.current = requestAnimationFrame(tick);
  }, [SINGLE_SET]);

  const stopAutoScroll = useCallback(() => {
    if (animRef.current) {
      cancelAnimationFrame(animRef.current);
      animRef.current = null;
    }
  }, []);

  const pause = () => { pausedRef.current = true; };
  const resume = () => { pausedRef.current = false; };

  // Manual scroll with buttons
  const scroll = (direction: "prev" | "next") => {
    const el = trackRef.current;
    if (!el) return;
    pause();
    const distance = direction === "next" ? -STEP * 2 : STEP * 2;
    el.scrollBy({ left: distance, behavior: "smooth" });
    setTimeout(resume, 2500);
  };

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    // Start around the 2nd set
    el.scrollLeft = SINGLE_SET * 1.5;
    startAutoScroll();

    return () => stopAutoScroll();
  }, [startAutoScroll, stopAutoScroll, SINGLE_SET]);

  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #FBF6EC 0%, #F6EEDD 55%, #FBF6EC 100%)",
        paddingTop: 40,
        paddingBottom: 56,
      }}
    >
      {/* Heading */}
      <div className="container-prose">
        <div className="text-center">
          <span
            className="text-[11px] font-semibold uppercase tracking-[0.28em]"
            style={{ color: "#8A7458" }}
          >
            {eyebrow || "What we offer"}
          </span>
          <h2
            className="mx-auto mt-3 max-w-3xl font-serif leading-tight"
            style={{ color: "#221912", fontSize: "clamp(1.5rem, 3vw, 2.25rem)" }}
          >
            {title || "Our End-to-End Home Interior Design Services In Bangalore"}
          </h2>
        </div>
      </div>

      {/* Carousel */}
      <div
        className="relative mt-8 md:mt-10"
        onMouseEnter={pause}
        onMouseLeave={resume}
        onTouchStart={pause}
        onTouchEnd={resume}
      >
        {/* Edge fades */}
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 md:w-24"
          style={{ background: "linear-gradient(90deg, #FBF6EC 0%, rgba(251,246,236,0) 100%)" }}
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 md:w-24"
          style={{ background: "linear-gradient(270deg, #FBF6EC 0%, rgba(251,246,236,0) 100%)" }}
        />

        {/* Scrollable track — hide scrollbar */}
        <div
          ref={trackRef}
          className="flex gap-5 overflow-x-auto px-8 md:px-16 carousel-container"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {LOOP.map((c, i) => (
            <a
              key={`${c.slug}-${i}`}
              href={`/services/${c.slug}`}
              aria-label={c.title}
              className="group relative flex shrink-0 flex-col overflow-hidden rounded-[18px] border bg-[#FFFAF2] shadow-[0_12px_28px_-16px_rgba(120,90,40,0.35)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_18px_34px_-16px_rgba(120,90,40,0.45)] service-card"
              style={{
                borderColor: "rgba(184,135,69,0.25)",
                width: "var(--card-width)",
                height: 190,
              }}
            >
              <div className="relative w-full overflow-hidden" style={{ height: 118 }}>
                <img
                  src={c.image}
                  alt={c.title}
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    const t = e.currentTarget;
                    t.onerror = null;
                    t.style.opacity = "0";
                  }}
                  className="h-full w-full object-cover transition duration-[1200ms] ease-out group-hover:scale-[1.08]"
                />
                <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#EDE3D5] to-[#D6C6AE]" />
              </div>
              <div className="flex flex-1 items-center justify-center px-2.5 py-3 text-center">
                <h3
                  className="font-serif leading-tight"
                  style={{ color: "#2D241F", fontSize: 15 }}
                >
                  {c.title}
                </h3>
              </div>
            </a>
          ))}
        </div>

        {/* Prev Arrow */}
        <button
          onClick={() => scroll("prev")}
          aria-label="Previous services"
          className="absolute left-2 top-1/2 z-20 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border shadow-lg transition duration-300 hover:scale-110"
          style={{
            background: "linear-gradient(135deg,#C49A5A,#B8894D)",
            borderColor: "rgba(184,137,77,0.3)",
            color: "#fff",
          }}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {/* Next Arrow */}
        <button
          onClick={() => scroll("next")}
          aria-label="Next services"
          className="absolute right-2 top-1/2 z-20 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border shadow-lg transition duration-300 hover:scale-110"
          style={{
            background: "linear-gradient(135deg,#C49A5A,#B8894D)",
            borderColor: "rgba(184,137,77,0.3)",
            color: "#fff",
          }}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <style>{`
        div::-webkit-scrollbar { display: none; }
      `}</style>
    </section>
  );
}
