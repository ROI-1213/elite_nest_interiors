import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import bedroomImg from "@/assets/cat-bedroom.jpg";
import kitchenImg from "@/assets/cat-kitchen.jpg";
import livingImg from "@/assets/cat-living.jpg";
import diningImg from "@/assets/cat-dining.jpg";
import wardrobeImg from "@/assets/cat-wardrobe.jpg";
import foyerImg from "@/assets/cat-foyer.jpg";

type Cat = { key: string; title: string; description: string; image: string };

const CATS: Cat[] = [
  { key: "bedroom", title: "Bedroom", description: "Calm and elegant bedroom interiors designed for comfort and relaxation.", image: bedroomImg },
  { key: "kitchen", title: "Kitchen", description: "Smart modular kitchens with premium finishes and practical layouts.", image: kitchenImg },
  { key: "living", title: "Living", description: "Sophisticated living spaces crafted for style, warmth, and everyday living.", image: livingImg },
  { key: "dining", title: "Dining", description: "Refined dining interiors designed for gathering, comfort, and elegance.", image: diningImg },
  { key: "wardrobe", title: "Wardrobe", description: "Functional and beautiful storage solutions tailored to your lifestyle.", image: wardrobeImg },
  { key: "foyer", title: "Foyer", description: "Stylish entrance spaces that create a welcoming first impression.", image: foyerImg },
];

export function InteriorCategoriesShowcase({
  eyebrow = "Our Interior Expertise",
  title = "Spaces Designed Around Your Lifestyle",
  subtitle = "Explore our curated interior solutions for every corner of your home.",
}: {
  eyebrow?: string | null;
  title?: string | null;
  subtitle?: string | null;
} = {}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = CATS.length;
  const touchStart = useRef<number | null>(null);
  const navigate = useNavigate();

  const go = useCallback((dir: 1 | -1) => {
    setIndex((i) => (i + dir + total) % total);
  }, [total]);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => go(1), 3800);
    return () => clearInterval(t);
  }, [go, paused]);

  const onTouchStart = (e: React.TouchEvent) => (touchStart.current = e.touches[0].clientX);
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStart.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStart.current;
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
    touchStart.current = null;
  };

  // relative offset (-2..2) for coverflow
  const offsetOf = (i: number) => {
    let d = i - index;
    if (d > total / 2) d -= total;
    if (d < -total / 2) d += total;
    return d;
  };

  const current = CATS[index];

  return (
    <section
      className="relative overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Backgrounds — cross-fade */}
      <div className="absolute inset-0">
        {CATS.map((c, i) => (
          <img
            key={c.key}
            src={c.image}
            alt=""
            aria-hidden
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1200ms] ease-out ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
            style={{ filter: "blur(18px) brightness(0.55) saturate(1.05)", transform: "scale(1.12)" }}
          />
        ))}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(31,26,22,0.55) 0%, rgba(31,26,22,0.35) 45%, rgba(31,26,22,0.75) 100%)",
          }}
        />
      </div>

      <div className="relative container-prose py-20 md:py-24">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[11px] font-medium uppercase tracking-[0.32em]" style={{ color: "#E6C892" }}>
            {eyebrow || "Our Interior Expertise"}
          </p>
          <h2 className="mt-4 font-serif text-4xl leading-[1.1] text-white sm:text-5xl md:text-6xl">
            {title || "Spaces Designed Around Your Lifestyle"}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-white/80">
            {subtitle}
          </p>
        </div>

        {/* Coverflow stage */}
        <div className="relative mt-12 md:mt-16" style={{ perspective: "1600px" }}>
          <div className="relative mx-auto flex h-[380px] items-center justify-center sm:h-[440px] md:h-[520px]">
            {CATS.map((c, i) => {
              const off = offsetOf(i);
              const abs = Math.abs(off);
              if (abs > 2) return null;
              const isActive = off === 0;
              const translateX = off * 240; // px
              const rotateY = off === 0 ? 0 : off > 0 ? -28 : 28;
              const scale = isActive ? 1 : abs === 1 ? 0.78 : 0.6;
              const zIndex = 20 - abs;
              const opacity = isActive ? 1 : abs === 1 ? 0.75 : 0.4;
              return (
                <button
                  key={c.key}
                  onClick={() => (isActive ? navigate({ to: "/services" }) : setIndex(i))}
                  aria-label={isActive ? `Go to services — ${c.title}` : c.title}
                  className="absolute left-1/2 top-1/2 origin-center cursor-pointer overflow-hidden rounded-[24px] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{
                    zIndex,
                    opacity,
                    width: "clamp(240px, 34vw, 440px)",
                    height: "clamp(320px, 46vw, 560px)",
                    transform: `translate(-50%, -50%) translateX(${translateX}px) rotateY(${rotateY}deg) scale(${scale})`,
                    boxShadow: isActive
                      ? "0 50px 100px -30px rgba(0,0,0,0.65), 0 0 0 1px rgba(230,200,146,0.35)"
                      : "0 30px 60px -30px rgba(0,0,0,0.55)",
                  }}
                >
                  <img
                    src={c.image}
                    alt={c.title}
                    loading="lazy"
                    className="h-full w-full object-cover"
                    draggable={false}
                  />
                  {/* caption on active slide */}
                  <div
                    className={`pointer-events-none absolute inset-x-0 bottom-0 p-5 text-left transition-opacity duration-500 md:p-6 ${
                      isActive ? "opacity-100" : "opacity-0"
                    }`}
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(15,10,5,0.82) 100%)",
                    }}
                  >
                    <p className="text-[10px] uppercase tracking-[0.28em]" style={{ color: "#E6C892" }}>
                      Category
                    </p>
                    <h3 className="mt-1 font-serif text-2xl text-white md:text-3xl">{c.title}</h3>
                    <p className="mt-2 max-w-sm text-[13px] leading-relaxed text-white/85">
                      {c.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Arrows */}
          <button
            onClick={() => go(-1)}
            aria-label="Previous"
            className="absolute left-2 top-1/2 z-30 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border text-white backdrop-blur-md transition hover:scale-105 md:left-6 md:h-14 md:w-14"
            style={{ backgroundColor: "rgba(31,26,22,0.45)", borderColor: "rgba(230,200,146,0.45)" }}
          >
            <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
          </button>
          <button
            onClick={() => go(1)}
            aria-label="Next"
            className="absolute right-2 top-1/2 z-30 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border text-white backdrop-blur-md transition hover:scale-105 md:right-6 md:h-14 md:w-14"
            style={{ backgroundColor: "rgba(31,26,22,0.45)", borderColor: "rgba(230,200,146,0.45)" }}
          >
            <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
          </button>
        </div>

        {/* Dots */}
        <div className="mt-8 flex items-center justify-center gap-2">
          {CATS.map((c, i) => (
            <button
              key={c.key}
              onClick={() => setIndex(i)}
              aria-label={`Go to ${c.title}`}
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: i === index ? 30 : 8,
                backgroundColor: i === index ? "#E6C892" : "rgba(255,255,255,0.35)",
              }}
            />
          ))}
        </div>

        {/* Active label under carousel (mobile-friendly redundancy) */}
        <p className="mt-6 text-center text-[11px] uppercase tracking-[0.3em] text-white/70">
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")} — {current.title}
        </p>
      </div>
    </section>
  );
}
