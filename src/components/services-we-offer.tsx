import { useState } from "react";
import { SERVICE_ORDER, SERVICE_SLUGS, SERVICE_IMAGES } from "@/lib/services.config";

type Service = { key: string; label: string; image: string };

const SERVICES: Service[] = SERVICE_ORDER.map(name => ({
  key: SERVICE_SLUGS[name],
  label: name,
  image: SERVICE_IMAGES[name],
}));

export function ServicesWeOffer() {
  const [active, setActive] = useState(SERVICES[0].key);

  return (
    <section style={{ backgroundColor: "#FBF6EC" }}>
      <div className="container-prose py-14 md:py-20">
        <div className="text-center mb-10 md:mb-14">
          <h2 className="font-serif text-3xl md:text-5xl text-[#1F1A16]">
            Services <span style={{ color: "#B8894D" }}>We Offer</span>
          </h2>
        </div>
        <div className="grid gap-8 md:grid-cols-[24%_1fr] md:gap-10">
          {/* Left menu */}
          <div className="flex flex-col">

            {/* Mobile: horizontal scroll */}
            <div className="-mx-4 mt-6 flex gap-2 overflow-x-auto px-4 md:hidden">
              {SERVICES.map((s) => {
                const isActive = s.key === active;
                return (
                  <button
                    key={s.key}
                    onClick={() => setActive(s.key)}
                    className="shrink-0 rounded-full border px-4 py-2 text-sm transition"
                    style={{
                      backgroundColor: isActive ? "#F6ECD9" : "#FFFCF7",
                      borderColor: isActive ? "#B98545" : "#E5D4BD",
                      color: isActive ? "#1F1A16" : "#3A322A",
                    }}
                  >
                    {s.label}
                  </button>
                );
              })}
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

          {/* Right image */}
          <div>
            <div
              className="relative w-full overflow-hidden rounded-2xl"
              style={{ height: "clamp(280px, 42vw, 480px)" }}
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
            </div>
            {/* Dots */}
            <div className="mt-5 flex items-center justify-center gap-2">
              {SERVICES.map((s) => {
                const isActive = s.key === active;
                return (
                  <button
                    key={s.key}
                    onClick={() => setActive(s.key)}
                    aria-label={`Show ${s.label}`}
                    className="h-2 rounded-full transition-all duration-300"
                    style={{
                      width: isActive ? 26 : 8,
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
