import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Facebook, Instagram, Youtube, Linkedin, Twitter, Mail, Phone, MapPin, ArrowRight,
} from "lucide-react";
import { settingsQuery } from "@/lib/queries";
import { SERVICE_ORDER, SERVICE_SLUGS } from "@/lib/services.config";
import logo from "@/assets/logo.png";

const QUICK_LINKS = [
  { to: "/", label: "Home" },
  { to: "/about-us", label: "About Us" },
  { to: "/services", label: "Services" },
  { to: "/gallery", label: "Gallery" },
  { to: "/testimonials", label: "Testimonials" },
  { to: "/contact-us", label: "Contact" },
] as const;

const SERVICE_LINKS = SERVICE_ORDER.map(name => ({
  slug: SERVICE_SLUGS[name],
  label: name,
}));

export function SiteFooter() {
  const { data: s } = useQuery(settingsQuery);

  const socials = [
    { url: s?.instagram_url, Icon: Instagram, label: "Instagram" },
    { url: s?.facebook_url, Icon: Facebook, label: "Facebook" },
    { url: s?.youtube_url, Icon: Youtube, label: "YouTube" },
    { url: s?.linkedin_url, Icon: Linkedin, label: "LinkedIn" },
    { url: s?.twitter_url, Icon: Twitter, label: "Twitter" },
  ].filter((x) => x.url) as { url: string; Icon: typeof Instagram; label: string }[];

  return (
    <footer
      className="relative mt-20 overflow-hidden text-[#FFF8EE]"
      style={{ background: "linear-gradient(135deg, #7B552F 0%, #9D7140 45%, #B88745 100%)" }}
    >
      <div className="absolute inset-x-0 top-0 h-px" style={{ background: "rgba(255,248,238,0.35)" }} />

      <div className="container-prose grid gap-12 py-20 md:grid-cols-12">
        <div className="md:col-span-4">
          <Link to="/" className="inline-flex items-center overflow-visible">
            <img
              src={logo}
              alt={s?.business_name ?? "Elite Nest Interiors"}
              className="h-36 md:h-44 w-auto object-contain object-left scale-[2.2] md:scale-[2.6] origin-left transition-transform duration-300 hover:scale-[2.7]"
              style={{ mixBlendMode: "screen" }}
            />
          </Link>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-[#FFF8EE]/78">
            {s?.footer_about ??
              "End-to-end construction, architecture and interior solutions — crafted for those who notice the details. Trusted by homeowners and businesses across India."}
          </p>
          <div className="mt-7 flex items-center gap-2">
            {socials.map(({ url, Icon, label }) => (
              <a
                key={label}
                href={url}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={label}
                className="grid h-10 w-10 place-items-center rounded-full border border-[#FFF8EE]/35 text-[#FFF8EE] transition hover:bg-[#FFF8EE] hover:text-[#8A6338]"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Explore & Services — Side by side on mobile, distinct columns on desktop */}
        <div className="grid grid-cols-2 gap-6 md:col-span-5 md:grid-cols-5 md:gap-8">
          <div className="md:col-span-2">
            <p className="label-uppercase text-[#FFE2B0]">Explore</p>
            <ul className="mt-5 space-y-2.5 text-sm">
              {QUICK_LINKS.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="inline-block text-[#FFF8EE]/86 transition hover:translate-x-1 hover:text-white">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <p className="label-uppercase text-[#FFE2B0]">Services</p>
            <ul className="mt-5 space-y-2.5 text-sm">
              {SERVICE_LINKS.map((l) => (
                <li key={l.slug}>
                  <Link
                    to="/services/$slug"
                    params={{ slug: l.slug }}
                    className="inline-block text-[#FFF8EE]/86 transition hover:translate-x-1 hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="md:col-span-3">
          <p className="label-uppercase text-[#FFE2B0]">Get in touch</p>
          <ul className="mt-5 space-y-3 text-sm text-[#FFF8EE]/86">
            {s?.phone && (
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 text-[#FFE2B0]" />
                <a href={`tel:${s.phone.split('\n')[0].replace(/\s/g, "")}`} className="hover:text-white whitespace-pre-line">{s.phone}</a>
              </li>
            )}
            {s?.email && (
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 text-[#FFE2B0]" />
                <a href={`mailto:${s.email}`} className="hover:text-white">{s.email}</a>
              </li>
            )}
            {s?.address && (
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-[#FFE2B0]" />
                <span>{s.address}</span>
              </li>
            )}
          </ul>
          <Link
            to="/contact-us"
            className="mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#FFE2B0] transition hover:gap-3 hover:text-white"
          >
            Start a project <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      <div className="border-t border-[#FFF8EE]/22" style={{ background: "rgba(0,0,0,0.08)" }}>
        <div className="container-prose relative flex flex-col items-center justify-between gap-3 py-6 text-xs text-[#FFF8EE]/75 md:flex-row">
          <p>{s?.footer_copyright ?? `© ${new Date().getFullYear()} Elite Nest Interiors. All rights reserved.`}</p>
          <p className="md:absolute md:left-1/2 md:-translate-x-1/2 text-center">
            <a
              href="https://wa.me/919945379333"
              target="_blank"
              rel="noreferrer noopener"
              className="underline hover:text-white transition-colors"
            >
              Developed by ROI Infotech
            </a>
          </p>
          <p>Crafted with care · Premium turnkey design build studio</p>
        </div>
      </div>
    </footer>
  );
}
