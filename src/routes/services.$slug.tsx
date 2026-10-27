import { createFileRoute, Link, notFound, redirect } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Check, Phone, MessageCircle } from "lucide-react";
import { SiteLayout } from "@/components/site-layout";
import { EnquiryForm } from "@/components/enquiry-form";
import { Reveal } from "@/components/scroll-reveal";
import {
  serviceBySlugQuery, servicesQuery, settingsQuery,
} from "@/lib/queries";

const SLUG_REDIRECTS: Record<string, string> = {
  "turnkey-interior-solution": "turnkey-interior-solutions",
  "turnkey-interiors": "turnkey-interior-solutions",
  "full-home-interior": "turnkey-interior-solutions",
  "residential-interior": "residential-interior-design",
  "commercial-interior": "commercial-interior-design",
  "commercial-interiors": "commercial-interior-design",
  "renovation": "renovation-remodeling",
  "remodeling": "renovation-remodeling",
  "constructions": "construction-services",
  "construction": "construction-services",
  "building-architectural-details": "architectural-design-planning",
  "architectural-details": "architectural-design-planning",
  "architectural-design": "architectural-design-planning",
  "walkthroughs": "3d-walkthrough-gallery",
  "3d-walkthrough": "3d-walkthrough-gallery",
};

export const Route = createFileRoute("/services/$slug")({
  loader: async ({ context, params }) => {
    if (SLUG_REDIRECTS[params.slug]) {
      throw redirect({ to: `/services/${SLUG_REDIRECTS[params.slug]}` as any, statusCode: 301 });
    }
    try {
      await Promise.all([
        context?.queryClient?.prefetchQuery(serviceBySlugQuery(params.slug)),
        context?.queryClient?.prefetchQuery(servicesQuery()),
        context?.queryClient?.prefetchQuery(settingsQuery),
      ]);
    } catch (_) {}
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: loaderData.service.seo_title || `${loaderData.service.title} — Elite Nest Interiors` },
          { name: "description", content: loaderData.service.seo_description || loaderData.service.short_description || "" },
          { property: "og:title", content: loaderData.service.seo_title || loaderData.service.title },
          { property: "og:description", content: loaderData.service.seo_description || loaderData.service.short_description || "" },
          ...(loaderData.service.image_url ? [{ property: "og:image" as const, content: loaderData.service.image_url }] : []),
        ]
      : [],
  }),
  notFoundComponent: () => (
    <SiteLayout>
      <div className="container-prose py-32 text-center">
        <p className="eyebrow">404</p>
        <h1 className="mt-3 font-serif text-4xl">Service not found</h1>
        <Link to="/services" className="btn-bronze mt-8">Browse services</Link>
      </div>
    </SiteLayout>
  ),
  component: ServiceDetailPage,
});

function ServiceDetailPage() {
  const { slug } = Route.useParams();
  const { data: dbService, isLoading } = useQuery(serviceBySlugQuery(slug));
  const { data: allServices = [] } = useQuery(servicesQuery());
  const { data: settings = { whatsapp: "", phone: "" } } = useQuery(settingsQuery);

  const fallbackService = allServices.find((s) => s.slug === slug);
  const service = dbService || fallbackService;

  if (!service && !isLoading) {
    return (
      <SiteLayout>
        <div className="container-prose py-32 text-center">
          <p className="eyebrow">404</p>
          <h1 className="mt-3 font-serif text-4xl">Service not found</h1>
          <Link to="/services" className="btn-bronze mt-8">Browse services</Link>
        </div>
      </SiteLayout>
    );
  }

  if (!service) {
    return (
      <SiteLayout>
        <div className="container-prose py-32 text-center">
          <p className="eyebrow">Loading...</p>
        </div>
      </SiteLayout>
    );
  }

  const related = allServices.filter((s) => s.id !== service.id).slice(0, 3);
  const wa = settings.whatsapp?.replace(/\D/g, "") || "919364048269";

  return (
    <SiteLayout transparentHeader>
      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        {service.image_url ? (
          <img src={service.image_url} alt={service.title} width={1600} height={1000} className="absolute inset-0 -z-10 h-full w-full object-cover animate-hero-zoom" />
        ) : (
          <div className="absolute inset-0 -z-10 bg-charcoal" />
        )}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-charcoal/70 via-charcoal/60 to-charcoal/95" />
        <div className="container-prose flex min-h-[72vh] flex-col justify-end pt-32 pb-20 text-ivory">
          <Reveal>
            <Link to="/services" className="text-xs uppercase tracking-[0.2em] text-ivory/70 transition hover:text-accent">
              ← All services
            </Link>
          </Reveal>
          <Reveal delay={1}>
            <h1 className="mt-6 max-w-4xl font-serif text-5xl text-balance md:text-7xl">{service.title}</h1>
          </Reveal>
          {service.short_description && (
            <Reveal delay={2}>
              <p className="mt-5 max-w-2xl text-ivory/80 md:text-lg">{service.short_description}</p>
            </Reveal>
          )}
        </div>
      </section>

      {/* Body */}
      <section className="container-prose grid gap-12 py-20 md:grid-cols-[1.4fr_1fr] md:gap-16 md:py-28">
        <div>
          {service.description && (
            <Reveal>
              <p className="eyebrow">Overview</p>
              <p className="mt-5 whitespace-pre-line text-base leading-relaxed text-foreground/85 md:text-lg">
                {service.description}
              </p>
            </Reveal>
          )}

          {service.features.length > 0 && (
            <Reveal delay={1}>
              <div className="mt-14">
                <p className="eyebrow">What's included</p>
                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {service.features.map((f: string) => (
                    <li key={f} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
                      <span className="mt-0.5 grid h-6 w-6 place-items-center rounded-full" style={{ background: "var(--gradient-bronze)" }}>
                        <Check className="h-3.5 w-3.5 text-white" />
                      </span>
                      <span className="text-sm text-foreground">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          )}

          {service.gallery.length > 0 && (
            <Reveal delay={2}>
              <div className="mt-14">
                <p className="eyebrow">Gallery</p>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {service.gallery.map((url: string) => (
                    <img key={url} src={url} alt={service.title} loading="lazy" className="aspect-[4/3] w-full rounded-xl object-cover" />
                  ))}
                </div>
              </div>
            </Reveal>
          )}
        </div>

        <aside className="md:sticky md:top-28 md:self-start">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <p className="eyebrow">Enquire</p>
            <h2 className="mt-3 font-serif text-2xl text-foreground">Start your {service.title.toLowerCase()} project.</h2>
            <p className="mt-2 text-sm text-muted-foreground">We respond within one business day.</p>
            <div className="mt-5">
              <EnquiryForm
                source={`service:${service.slug}`}
                serviceId={service.id}
                serviceTitle={service.title}
              />
            </div>
            <div className="mt-5 flex flex-col gap-2 border-t border-border pt-5 text-sm">
              {settings.phone && (
                <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-2 text-foreground hover:text-accent">
                  <Phone className="h-4 w-4 text-accent" /> {settings.phone}
                </a>
              )}
              {wa && (
                <a href={`https://wa.me/${wa}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-foreground hover:text-accent">
                  <MessageCircle className="h-4 w-4 text-accent" /> WhatsApp us
                </a>
              )}
            </div>
          </div>
        </aside>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="border-t border-border bg-bone">
          <div className="container-prose py-20">
            <p className="eyebrow">Continue exploring</p>
            <h2 className="mt-4 font-serif text-3xl text-foreground md:text-4xl">Related services</h2>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {related.map((s) => (
                <Link key={s.id} to="/services/$slug" params={{ slug: s.slug }} className="luxe-card group block overflow-hidden">
                  <div className="aspect-[5/4] overflow-hidden bg-muted">
                    {s.image_url && <img src={s.image_url} alt={s.title} loading="lazy" className="h-full w-full object-cover transition duration-1000 group-hover:scale-110" />}
                  </div>
                  <div className="p-5">
                    <h3 className="font-serif text-xl text-foreground transition group-hover:text-accent">{s.title}</h3>
                    <span className="mt-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                      Discover <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </SiteLayout>
  );
}
