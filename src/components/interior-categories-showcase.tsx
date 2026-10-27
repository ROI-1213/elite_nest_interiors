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

export function InteriorCategoriesShowcase({
  eyebrow = "Our Interior Expertise",
  title = "Spaces Designed Around Your Lifestyle",
  subtitle = "Explore our curated interior solutions for every corner of your home.",
  bedroomImage,
  kitchenImage,
  livingImage,
  diningImage,
  wardrobeImage,
  foyerImage,
}: {
  eyebrow?: string | null;
  title?: string | null;
  subtitle?: string | null;
  bedroomImage?: string | null;
  kitchenImage?: string | null;
  livingImage?: string | null;
  diningImage?: string | null;
  wardrobeImage?: string | null;
  foyerImage?: string | null;
} = {}) {
  const CATS: Cat[] = [
    { key: "bedroom", title: "Bedroom", description: "Calm and elegant bedroom interiors designed for comfort and relaxation.", image: bedroomImage || bedroomImg },
    { key: "kitchen", title: "Kitchen", description: "Smart modular kitchens with premium finishes and practical layouts.", image: kitchenImage || kitchenImg },
    { key: "living", title: "Living", description: "Sophisticated living spaces crafted for style, warmth, and everyday living.", image: livingImage || livingImg },
    { key: "dining", title: "Dining", description: "Refined dining interiors designed for gathering, comfort, and elegance.", image: diningImage || diningImg },
    { key: "wardrobe", title: "Wardrobe", description: "Functional and beautiful storage solutions tailored to your lifestyle.", image: wardrobeImage || wardrobeImg },
    { key: "foyer", title: "Foyer", description: "Stylish entrance spaces that create a welcoming first impression.", image: foyerImage || foyerImg },
  ];

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
          {subtitle && (
            <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-white/80">
              {subtitle}
            </p>
          )}
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
              const translateZ = -abs * 160; // px depth
              const rotateY = off * -28; // deg
              const scale = 1 - abs * 0.12;
              const opacity = 1 - abs * 0.28;

              return (
                <div
                  key={c.key}
                  onClick={() => (isActive ? navigate({ to: "/services" }) : setIndex(i))}
                  className="absolute cursor-pointer transition-all duration-700 ease-out"
                  style={{
                    transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                    zIndex: 20 - abs,
                    opacity,
                    filter: isActive ? "none" : "brightness(0.75)",
                  }}
                >
                  <div
                    className="relative overflow-hidden rounded-3xl bg-[#2B231D] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] transition-all duration-500"
                    style={{
                      width: "clamp(260px, 44vw, 360px)",
                      height: "clamp(340px, 58vw, 460px)",
                      border: isActive ? "1.5px solid rgba(230,200,146,0.65)" : "1px solid rgba(255,255,255,0.12)",
                      boxShadow: isActive ? "0 30px 70px -10px rgba(0,0,0,0.7), 0 0 40px rgba(230,200,146,0.25)" : undefined,
                    }}
                  >
                    <img
                      src={c.image}
                      alt={c.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 ease-out hover:scale-105"
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(180deg, rgba(0,0,0,0) 45%, rgba(18,14,11,0.75) 75%, rgba(18,14,11,0.95) 100%)",
                      }}
                    />
                    <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                      <p className="text-[11px] font-medium uppercase tracking-[0.25em]" style={{ color: "#E6C892" }}>
                        Space
                      </p>
                      <h3 className="mt-1 font-serif text-2xl font-normal sm:text-3xl">{c.title}</h3>
                      <p className="mt-2 text-xs leading-relaxed text-white/75 sm:text-sm">{c.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Controls */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              type="button"
              aria-label="Previous space"
              onClick={() => go(-1)}
              className="grid h-11 w-11 place-items-center rounded-full border border-white/25 bg-black/40 text-white backdrop-blur transition hover:scale-105 hover:bg-black/60 active:scale-95"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2">
              {CATS.map((c, i) => (
                <button
                  key={c.key}
                  type="button"
                  aria-label={`Go to ${c.title}`}
                  onClick={() => setIndex(i)}
                  className="h-2 rounded-full transition-all duration-300"
                  style={{
                    width: i === index ? 28 : 8,
                    backgroundColor: i === index ? "#E6C892" : "rgba(255,255,255,0.35)",
                  }}
                />
              ))}
            </div>
            <button
              type="button"
              aria-label="Next space"
              onClick={() => go(1)}
              className="grid h-11 w-11 place-items-center rounded-full border border-white/25 bg-black/40 text-white backdrop-blur transition hover:scale-105 hover:bg-black/60 active:scale-95"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
