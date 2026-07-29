import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/scroll-reveal";
import { SERVICE_ORDER, SERVICE_SLUGS, SERVICE_DESCRIPTIONS, SERVICE_IMAGES } from "@/lib/services.config";

export function ExploreMoreServices({ currentSlug }: { currentSlug: string }) {
  // Find 4 services that are not the current one
  const relatedNames = SERVICE_ORDER.filter(
    (name) => SERVICE_SLUGS[name] !== currentSlug
  ).slice(0, 4);

  return (
    <section className="bg-background py-16 md:py-24">
      <div className="container-prose">
        <Reveal>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Keep Exploring
              </span>
              <h2 className="mt-2 font-serif text-3xl text-foreground md:text-5xl">
                More from <span style={{ color: "#B88745" }}>Elite Nest</span>
              </h2>
            </div>
            <Link
              to="/services"
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-80 md:mt-0"
              style={{ color: "#B88745" }}
            >
              View all services <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {relatedNames.map((name, i) => {
            const slug = SERVICE_SLUGS[name];
            return (
              <Reveal key={slug} delay={i * 100}>
                <Link
                  to={`/services/${slug}`}
                  className="group relative block aspect-[4/5] overflow-hidden rounded-xl"
                >
                  <img
                    src={SERVICE_IMAGES[name]}
                    alt={name}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity duration-300 group-hover:from-black/90" />
                  <div className="absolute inset-x-0 bottom-0 p-6 transition-transform duration-300 group-hover:-translate-y-1">
                    <h3 className="font-serif text-xl text-white">
                      {name}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-white/80">
                      {SERVICE_DESCRIPTIONS[name]}
                    </p>
                    <span
                      className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider transition-colors"
                      style={{ color: "#D1A965" }}
                    >
                      View Details
                      <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
