import React from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  Menu,
  X,
  Phone,
  ChevronDown,
  Facebook,
  Instagram,
  Youtube,
  Linkedin,
  ArrowRight,
  Calendar,
} from "lucide-react";
import { settingsQuery } from "@/lib/queries";
import { SERVICE_ORDER, SERVICE_SLUGS, SERVICE_IMAGES, SERVICE_DESCRIPTIONS } from "@/lib/services.config";
import logo from "@/assets/logo.png";

// Icon mapping per service
import {
  Package, Home, BriefcaseBusiness, Wrench, HardHat,
  Compass, Building2, ClipboardCheck, Play,
} from "lucide-react";

const SERVICE_ICONS: Record<string, React.FC<{ className?: string }>> = {
  "Turnkey Interior Solutions":       Package,
  "Residential Interior Design":      Home,
  "Commercial Interior Design":       BriefcaseBusiness,
  "Renovation & Remodeling":          Wrench,
  "Construction Services":            HardHat,
  "Architectural Design & Planning":  Compass,
  "Structural Design":                Building2,
  "Building Supervision":             ClipboardCheck,
  "3D Walkthrough Gallery":           Play,
};


type NavItem = { to: string; label: string; exact?: boolean; hasDropdown?: boolean };
const NAV: readonly NavItem[] = [
  { to: "/", label: "Home", exact: true },
  { to: "/about-us", label: "About Us" },
  { to: "/services", label: "Services", hasDropdown: true },
  { to: "/gallery", label: "Gallery" },
  { to: "/testimonials", label: "Testimonials" },
  { to: "/contact-us", label: "Contact" },
];

const SERVICE_LINKS = SERVICE_ORDER.map(name => ({
  to: `/services/${SERVICE_SLUGS[name]}`,
  label: name,
}));

// Pinterest icon
function PinterestIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 2C6.48 2 2 6.48 2 12c0 4.09 2.46 7.6 5.97 9.13-.08-.78-.16-1.97.03-2.82.18-.77 1.17-4.9 1.17-4.9s-.3-.6-.3-1.48c0-1.39.81-2.43 1.81-2.43.85 0 1.27.64 1.27 1.41 0 .86-.55 2.15-.83 3.35-.24 1 .5 1.81 1.49 1.81 1.79 0 3.16-1.89 3.16-4.61 0-2.41-1.73-4.1-4.21-4.1-2.87 0-4.55 2.15-4.55 4.37 0 .87.33 1.8.75 2.31.08.1.09.18.07.28-.08.32-.25 1-.28 1.14-.04.18-.15.22-.34.13-1.26-.59-2.05-2.42-2.05-3.9 0-3.17 2.3-6.08 6.64-6.08 3.48 0 6.19 2.48 6.19 5.8 0 3.46-2.18 6.25-5.21 6.25-1.02 0-1.97-.53-2.3-1.16l-.62 2.38c-.23.87-.85 1.96-1.26 2.62.95.29 1.96.45 3.01.45 5.52 0 10-4.48 10-10S17.52 2 12 2z" />
    </svg>
  );
}

export function SiteHeader({ transparent = false }: { transparent?: boolean }) {
  const { data: settings } = useQuery(settingsQuery);
  const pathname = useLocation({ select: (l) => l.pathname });
  const isHome = pathname === "/";
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [dropdown, setDropdown] = useState(false);

  const phone = settings?.phone ?? "+91 98765 43210";

  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 24);
        // Hide only when scrolling DOWN past 120px; show immediately on any upward scroll.
        if (y > lastY && y > 120) setHidden(true);
        else if (y < lastY) setHidden(false);
        lastY = y;
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const socials = [
    { href: (settings as any)?.facebook_url ?? "#", label: "Facebook", Icon: Facebook },
    { href: (settings as any)?.instagram_url ?? "#", label: "Instagram", Icon: Instagram },
    { href: (settings as any)?.pinterest_url ?? "#", label: "Pinterest", Icon: PinterestIcon },
    { href: (settings as any)?.youtube_url ?? "#", label: "YouTube", Icon: Youtube },
    { href: (settings as any)?.linkedin_url ?? "#", label: "LinkedIn", Icon: Linkedin },
  ];

  return (
    <>
      <div aria-hidden className="h-[90px] md:h-[110px]" />
      <header
        className={`fixed inset-x-0 top-0 z-50 flex justify-center transition-transform duration-500 will-change-transform ${
          hidden ? "-translate-y-full" : "translate-y-0"
        } ${scrolled ? "pt-2 md:pt-4" : "pt-4 md:pt-6"}`}
      >
        <div
          className={`relative transition-all duration-500 overflow-visible flex items-center 
            ${scrolled 
              ? "w-[98%] rounded-[30px] p-0 shadow-[0_16px_40px_rgba(45,32,20,0.1)] bg-[#FFFDF9]" 
              : "w-[96%] max-w-[1920px] rounded-[24px] md:rounded-[40px] p-1 md:p-2 bg-white/20 shadow-[0_24px_50px_rgba(45,32,20,0.12)]"
            }`}
        >
          {/* Outer frame background (only visible at top) */}
          <div className={`absolute inset-0 transition-opacity duration-500 rounded-[inherit] overflow-hidden -z-10 ${scrolled ? "opacity-0" : "opacity-100"}`}>
            {isHome && settings?.hero_image_url && (
              <img
                src={settings.hero_image_url}
                alt=""
                className="w-full h-full object-cover opacity-15 mix-blend-multiply pointer-events-none"
              />
            )}
            <div className="absolute inset-0 bg-[#F6F0E7]/85 backdrop-blur-[4px]" />
            <div className="absolute inset-0 rounded-[inherit] border border-[#B98232]/15" />
          </div>

          {/* Inner white navigation bar */}
          <div
            className={`relative z-10 flex w-full items-center justify-between rounded-[18px] md:rounded-[32px] bg-[#FFFDF9] transition-all duration-500 ${
              scrolled
                ? "h-[54px] md:h-[64px] border border-[#B98232]/10"
                : "h-[60px] md:h-[72px] border border-[#B98232]/25 shadow-[inset_0_2px_4px_rgba(255,255,255,0.5)]"
            }`}
          >
            {/* LOGO AREA with slanted separator */}
            <div className="relative flex h-full items-center justify-center pl-8 pr-6 md:pl-11 md:pr-8 lg:pl-14 lg:pr-10 shrink-0 z-20">
              {/* Slanted Gold Divider */}
              <div
                className="absolute right-0 top-0 bottom-0 w-[1.5px] bg-[#B98232] origin-bottom transform -skew-x-[22deg] hidden lg:block"
                style={{ clipPath: "inset(0)" }}
              />
              
              <Link to="/" className="h-full flex items-center justify-center my-auto">
                <img
                  src={logo}
                  alt={settings?.business_name ?? "Elite Nest Interiors"}
                  className="h-full w-auto max-h-[78%] md:max-h-[84%] object-contain object-center scale-[3.0] md:scale-[2.4] origin-center transition-transform duration-300 hover:scale-[3.2]"
                  style={{ mixBlendMode: "multiply" }}
                />
              </Link>
            </div>

            {/* NAVIGATION LINKS (Desktop) */}
            <nav className="relative hidden lg:flex flex-1 items-center justify-center gap-6 xl:gap-9 px-4 z-10">
              {NAV.map((n) => (
                <div
                  key={n.to}
                  className="relative group"
                  onMouseEnter={() => n.hasDropdown && setDropdown(true)}
                  onMouseLeave={() => n.hasDropdown && setDropdown(false)}
                >
                  <Link
                    to={n.to}
                    className="relative flex items-center gap-1.5 py-2 text-[13px] xl:text-[14px] font-medium text-[#1D1A17] transition-colors duration-300 hover:text-[#B98232]"
                    activeProps={{ className: "text-[#B98232]" }}
                    activeOptions={{ exact: n.exact ?? false }}
                  >
                    {({ isActive }) => (
                      <>
                        {n.label}
                        {n.hasDropdown && <ChevronDown className="h-[14px] w-[14px] transition-transform duration-300 group-hover:rotate-180" />}
                        <span
                          className={`absolute bottom-0 left-0 h-[1.5px] bg-[#B98232] transition-all duration-300 ease-out ${
                            isActive ? "w-full" : "w-0 group-hover:w-full"
                          }`}
                        />
                      </>
                    )}
                  </Link>
                </div>
              ))}

              {dropdown && (
                <div
                  className="absolute left-1/2 top-full pt-2 -translate-x-1/2 w-[900px] max-w-[95vw]"
                  style={{ zIndex: 9999 }}
                  onMouseEnter={() => setDropdown(true)}
                  onMouseLeave={() => setDropdown(false)}
                >
                  <div
                    className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-[#B98232]/15 bg-[#FFFDF9] shadow-[0_32px_80px_rgba(45,32,20,0.18)]"
                    style={{ animation: "megaFadeIn 0.22s cubic-bezier(0.22,1,0.36,1) both" }}
                  >
                    <style>{`
                      @keyframes megaFadeIn {
                        from { opacity:0; transform:translateY(-6px) scale(0.98); }
                        to   { opacity:1; transform:translateY(0) scale(1); }
                      }
                    `}</style>

                    {/* Bronze accent bar */}
                    <div className="h-1 w-full" style={{ background: "linear-gradient(90deg,#B98232,#D4A96A,#B98232)" }} />

                    {/* Header row */}
                    <div className="flex items-center justify-between px-6 pt-4 pb-3 border-b border-[#E8D9C0]">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.3em] text-[#B98232] font-medium">Our Services</p>
                        <p className="text-[13px] text-[#6F6257] mt-0.5">Premium interior & construction solutions in Bengaluru</p>
                      </div>
                      <Link
                        to="/services"
                        onClick={() => setDropdown(false)}
                        className="flex items-center gap-1.5 rounded-full border border-[#B98232] px-4 py-1.5 text-[12px] font-medium text-[#B98232] hover:bg-[#B98232] hover:text-white transition-all duration-200"
                      >
                        View All <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>

                    {/* Services grid */}
                    <div className="grid grid-cols-3 gap-0 p-4">
                      {SERVICE_ORDER.map((name) => {
                        const slug = SERVICE_SLUGS[name];
                        const img  = SERVICE_IMAGES[name];
                        const desc = SERVICE_DESCRIPTIONS[name];
                        const Icon = SERVICE_ICONS[name];
                        return (
                          <Link
                            key={name}
                            to={`/services/${slug}`}
                            onClick={() => setDropdown(false)}
                            className="group flex items-start gap-3 rounded-xl p-3 transition-all duration-200 hover:bg-[#F6F0E7]"
                          >
                            {/* Thumbnail */}
                            <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg">
                              <img
                                src={img}
                                alt={name}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                              />
                              <div className="absolute inset-0 bg-charcoal/30" />
                              {Icon && (
                                <span className="absolute inset-0 flex items-center justify-center">
                                  <Icon className="h-4 w-4 text-white drop-shadow" />
                                </span>
                              )}
                            </div>
                            {/* Text */}
                            <div className="min-w-0 flex-1">
                              <p className="text-[12.5px] font-semibold text-[#1D1A17] leading-tight group-hover:text-[#B98232] transition-colors duration-200 truncate">{name}</p>
                              <p className="mt-0.5 text-[11px] leading-snug text-[#6F6257] line-clamp-2">{desc}</p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>

                    {/* Footer CTA */}
                    <div className="flex items-center justify-between border-t border-[#E8D9C0] px-6 py-3 bg-[#FAF5EC]">
                      <p className="text-[11px] text-[#9E8C7A]">Serving Bengaluru — Koramangala, Indiranagar, Whitefield & more</p>
                      <Link
                        to="/contact-us"
                        onClick={() => setDropdown(false)}
                        className="flex items-center gap-1.5 text-[12px] font-medium text-[#B98232] hover:underline"
                      >
                        Book Free Consultation <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </nav>

            {/* CONTACT SECTION (Desktop) */}
            <div className="hidden lg:flex items-center gap-5 xl:gap-7 pr-4 lg:pr-6 shrink-0 z-10">
              {/* Divider */}
              <div className="h-8 w-[1px] bg-[#E5D4BD]" />
              
              {/* Phone */}
              <a
                href={`tel:${phone.replace(/\s/g, "")}`}
                className="group flex items-center gap-3 text-[#1D1A17] hover:text-[#B98232] transition-colors"
                aria-label="Call us"
              >
                <span className="grid place-items-center w-8 h-8 rounded-full border border-[#B98232] text-[#B98232] group-hover:bg-[#B98232] group-hover:text-white transition-colors duration-300">
                  <Phone className="w-3.5 h-3.5" />
                </span>
                <span className="font-medium text-[13px] xl:text-[14px]">{phone}</span>
              </a>

              {/* Consultation Button */}
              <Link
                to="/contact-us"
                className="group flex items-center gap-2 bg-[#B98232] hover:bg-[#A5732A] text-white rounded-full px-4 py-2 xl:px-5 xl:py-2.5 shadow-[0_8px_20px_rgba(185,130,50,0.25)] transition-all duration-300 hover:shadow-[0_8px_25px_rgba(185,130,50,0.4)]"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span className="font-medium text-[13px] xl:text-[14px]">Book a Free Consultation</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>

            {/* MOBILE MENU TOGGLE */}
            <div className="flex items-center gap-3 pr-4 lg:hidden z-10">
              <a
                href={`tel:${phone.replace(/\s/g, "")}`}
                className="grid place-items-center w-10 h-10 rounded-full border border-[#B98232] text-[#B98232]"
                aria-label="Call us"
              >
                <Phone className="w-[18px] h-[18px]" />
              </a>
              
              <button
                onClick={() => setOpen(!open)}
                aria-label="Menu"
                aria-expanded={open}
                className="text-[#1D1A17] p-1.5 focus:outline-none"
              >
                {open ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE FULLSCREEN MENU */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-500 lg:hidden ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />
      <div
        className={`fixed inset-y-0 right-0 z-40 w-full max-w-sm bg-[#FFFDF9] shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.2,0.7,0.2,1)] lg:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto px-6 py-28">
          <nav className="flex flex-col gap-6">
            {NAV.map((n) => (
              <div key={n.to}>
                <Link
                  to={n.to}
                  onClick={() => !n.hasDropdown && setOpen(false)}
                  className="block text-[22px] font-serif text-[#1D1A17] transition-colors hover:text-[#B98232]"
                  activeProps={{ className: "text-[#B98232]" }}
                  activeOptions={{ exact: n.exact ?? false }}
                >
                  {n.label}
                </Link>
                {n.hasDropdown && (
                  <div className="mt-4 flex flex-col gap-3 pl-4 border-l border-[#E5D4BD]">
                    {SERVICE_LINKS.map((s) => (
                      <Link
                        key={s.to}
                        to={s.to}
                        onClick={() => setOpen(false)}
                        className="block text-[15px] text-[#6F6257] transition-colors hover:text-[#B98232]"
                      >
                        {s.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
          
          <div className="mt-auto pt-10 flex flex-col gap-6">
            <div className="h-px w-full bg-[#E5D4BD]" />
            <a
              href={`tel:${phone.replace(/\s/g, "")}`}
              className="flex items-center justify-center gap-3 w-full rounded-full border border-[#B98232] py-4 text-[#B98232] font-medium"
            >
              <Phone className="w-5 h-5" />
              {phone}
            </a>
            <Link
              to="/contact-us"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-3 w-full rounded-full bg-[#B98232] py-4 text-white font-medium shadow-[0_8px_20px_rgba(185,130,50,0.25)]"
            >
              <Calendar className="w-5 h-5" />
              Book a Free Consultation
            </Link>
            

          </div>
        </div>
      </div>
    </>
  );
}
