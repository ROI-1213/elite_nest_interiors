import { SERVICE_ORDER, SERVICE_SLUGS, SERVICE_IMAGES } from "@/lib/services.config";

type ServiceCard = {
  title: string;
  image: string;
  slug: string;
};

const CATEGORIES: ServiceCard[] = SERVICE_ORDER.map((name) => ({
  title: name,
  slug: SERVICE_SLUGS[name],
  image: SERVICE_IMAGES[name],
}));


export function EndToEndServices() {
  const loop = [...CATEGORIES, ...CATEGORIES];

  return (
    <section
      className="relative overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #FBF6EC 0%, #F6EEDD 55%, #FBF6EC 100%)",
        paddingTop: 40,
        paddingBottom: 56,
      }}
    >
      <div className="container-prose">
        <div className="text-center">
          <span
            className="text-[11px] font-semibold uppercase tracking-[0.28em]"
            style={{ color: "#8A7458" }}
          >
            What we offer
          </span>
          <h2
            className="mx-auto mt-3 max-w-3xl font-serif leading-tight"
            style={{ color: "#221912", fontSize: "clamp(1.5rem, 3vw, 2.25rem)" }}
          >
            Our End-to-End Home Interior Design{" "}
            <span style={{ color: "#B8894D" }}>Services In Bangalore</span>
          </h2>
        </div>
      </div>

      {/* Marquee */}
      <div className="services-wrapper relative mt-8 md:mt-10">
        {/* Edge fades */}
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 md:w-28"
          style={{ background: "linear-gradient(90deg, #FBF6EC 0%, rgba(251,246,236,0) 100%)" }}
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 md:w-28"
          style={{ background: "linear-gradient(270deg, #FBF6EC 0%, rgba(251,246,236,0) 100%)" }}
        />

        <div className="services-track flex w-max gap-5">
          {loop.map((c, i) => (
            <a
              key={`${c.slug}-${i}`}
              href={`/services/${c.slug}`}
              aria-label={c.title}
              className="services-card group relative flex shrink-0 flex-col overflow-hidden rounded-[18px] border bg-[#FFFAF2] shadow-[0_12px_28px_-16px_rgba(120,90,40,0.35)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_18px_34px_-16px_rgba(120,90,40,0.45)]"
              style={{
                borderColor: "rgba(184,135,69,0.25)",
                width: 190,
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
                    // Fallback: hide the broken image and show a gradient placeholder
                    t.style.opacity = "0";
                  }}
                  className="h-full w-full object-cover transition duration-[1200ms] ease-out group-hover:scale-[1.08]"
                />
                {/* Gradient placeholder shown behind image (visible if image fails) */}
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
      </div>

      <style>{`
        @keyframes marqueeServices {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .services-track {
          animation: marqueeServices 45s linear infinite;
        }
        .services-wrapper:hover .services-track {
          animation-play-state: paused;
        }
        @media (max-width: 768px) {
          .services-track { animation-duration: 35s; }
        }
        @media (prefers-reduced-motion: reduce) {
          .services-track { animation: none; }
        }
      `}</style>
    </section>
  );
}
