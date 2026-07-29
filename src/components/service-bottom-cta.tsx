import { Phone, MessageCircle } from "lucide-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Reveal } from "@/components/scroll-reveal";
import { settingsQuery } from "@/lib/queries";

/**
 * Shared bottom CTA banner used on every service page.
 * Sits just above the page's enquiry form section.
 */
export function ServiceBottomCTA() {
  const { data: settings } = useSuspenseQuery(settingsQuery);
  const tel = settings.phone?.replace(/\s/g, "");
  const wa = settings.whatsapp?.replace(/\D/g, "") || "919364048269";

  return (
    <section className="border-t border-border bg-bone">
      <div className="container-prose py-16 md:py-20">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-charcoal px-6 py-12 text-center text-ivory shadow-luxe md:px-12 md:py-16">
          <div
            className="pointer-events-none absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(214,176,116,0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(214,176,116,0.5) 1px, transparent 1px)",
              backgroundSize: "56px 56px",
            }}
          />
          <Reveal>
            <p className="eyebrow relative text-accent">Elite Nest Interiors</p>
            <h2 className="relative mx-auto mt-4 max-w-3xl font-serif text-3xl text-balance md:text-5xl">
              Ready To Start Your Project With Elite Nest?
            </h2>
            <p className="relative mx-auto mt-4 max-w-2xl text-ivory/75 md:text-lg">
              Whether you are planning construction, interiors, renovation, or complete turnkey
              execution, our team is here to guide you with clarity and care.
            </p>
            <div className="relative mt-8 flex flex-wrap justify-center gap-3">
              <a
                href="#enquire-form"
                className="btn-bronze transition-transform duration-300 hover:-translate-y-0.5"
              >
                Book A Free Consultation
              </a>
              {tel && (
                <a
                  href={`tel:${tel}`}
                  className="btn-ghost-dark transition-transform duration-300 hover:-translate-y-0.5"
                >
                  <Phone className="h-4 w-4" /> Call Now
                </a>
              )}
              {wa && (
                <a
                  href={`https://wa.me/${wa}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-ghost-dark transition-transform duration-300 hover:-translate-y-0.5"
                >
                  <MessageCircle className="h-4 w-4" /> WhatsApp Us
                </a>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
