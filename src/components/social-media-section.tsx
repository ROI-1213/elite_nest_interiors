import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { settingsQuery } from "@/lib/queries";

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className} width="24" height="24">
    <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    <path fill="#FFF" d="M16.671 15.542l.532-3.469h-3.328V9.82c0-.949.465-1.874 1.956-1.874h1.514V5.011s-1.374-.235-2.686-.235c-2.741 0-4.533 1.662-4.533 4.669v2.628H7.078v3.469h3.047v8.385a12.09 12.09 0 003.75 0v-8.385h2.796z"/>
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className} width="24" height="24">
    <defs>
      <radialGradient id="ig-grad" cx="0.27" cy="1.07" r="1.3" fx="0.27" fy="1.07" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#fd5"/>
        <stop offset="50%" stopColor="#ff543e"/>
        <stop offset="100%" stopColor="#c837ab"/>
      </radialGradient>
    </defs>
    <path fill="url(#ig-grad)" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z"/>
    <path fill="#fff" d="M12 7.312a4.688 4.688 0 100 9.375 4.688 4.688 0 000-9.375zm0 7.747a3.059 3.059 0 110-6.118 3.059 3.059 0 010 6.118zm3.228-6.953a1.08 1.08 0 11-2.16 0 1.08 1.08 0 012.16 0z"/>
  </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className} width="24" height="24">
    <path fill="#0A66C2" d="M22.225 0H1.77C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.77 24h20.453C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0zM7.12 20.452H3.558V9H7.12v11.452zM5.34 7.433a2.062 2.062 0 110-4.125 2.063 2.063 0 010 4.125zm15.112 13.019h-3.558v-5.57c0-1.326-.024-3.037-1.85-3.037-1.851 0-2.133 1.448-2.133 2.944v5.663H9.356V9h3.414v1.566h.048c.476-.9 1.637-1.85 3.37-1.85 3.605 0 4.265 2.37 4.265 5.455v6.281z"/>
  </svg>
);

const YoutubeIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className} width="24" height="24">
    <path fill="#FF0000" d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 00-2.122 2.136C0 8.07 0 12 0 12s0 3.93.501 5.814a3.016 3.016 0 002.122 2.136c1.871.55 9.377.55 9.377.55s7.505 0 9.377-.55a3.016 3.016 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z"/>
    <path fill="#FFF" d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const PinterestIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className} width="24" height="24">
    <path fill="#E60023" d="M12 0a12 12 0 00-4.368 23.184c.026-1.124.05-2.846.657-4.148.547-1.173 3.535-7.464 3.535-7.464s-.902-1.808-.902-4.48c0-4.202 2.439-7.334 5.474-7.334 2.583 0 3.829 1.94 3.829 4.269 0 2.597-1.653 6.48-2.505 10.081-.713 3.014 1.512 5.473 4.474 5.473 5.372 0 9.5-5.669 9.5-13.84 0-7.221-5.191-12.261-12.607-12.261-8.592 0-13.626 6.444-13.626 13.081 0 2.6.147 5.393 2.392 6.906.262.176.59.135.688-.242.068-.266.223-.9.294-1.189.096-.39.055-.516-.279-.906-1.179-1.374-1.89-3.136-1.89-5.508 0-4.492 3.266-8.625 8.948-8.625 5.128 0 9.095 3.651 9.095 8.528 0 5.097-3.208 9.196-7.66 9.196-1.498 0-2.909-.779-3.39-1.698 0 0-.742 2.825-.921 3.513-.334 1.282-1.235 2.883-1.843 3.856A11.97 11.97 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
  </svg>
);

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className} width="24" height="24">
    <path fill="#25D366" d="M20.52 3.449A11.97 11.97 0 0012 0C5.383 0 0 5.383 0 12.002c0 2.115.553 4.181 1.603 6l-1.6 5.845 5.98-1.567a11.956 11.956 0 006.015 1.621h.005c6.617 0 12-5.382 12-11.998a11.966 11.966 0 00-3.483-8.452z"/>
    <path fill="#FFF" d="M12.002 21.906h-.004a9.929 9.929 0 01-5.06-1.385l-.363-.215-3.766.987.998-3.67-.236-.375a9.932 9.932 0 01-1.517-5.242c0-5.485 4.464-9.95 9.953-9.95a9.887 9.887 0 017.039 2.915 9.88 9.88 0 012.913 7.037c0 5.484-4.466 9.948-9.953 9.948z"/>
    <path fill="#FFF" d="M17.481 15.011c-.301-.151-1.782-.879-2.058-.979-.276-.1-.478-.151-.678.151-.201.301-.778.979-.954 1.18-.176.201-.352.226-.653.075-.301-.151-1.272-.469-2.423-1.494-.895-.798-1.5-1.784-1.676-2.085-.176-.301-.019-.464.132-.614.135-.135.301-.351.452-.527.151-.176.201-.301.301-.502.1-.201.05-.377-.025-.527-.075-.151-.678-1.631-.929-2.233-.243-.585-.491-.506-.678-.515-.176-.008-.377-.01-.578-.01-.201 0-.527.075-.803.377-.276.301-1.054 1.03-1.054 2.511 0 1.482 1.079 2.914 1.23 3.115.151.201 2.122 3.238 5.138 4.54.717.311 1.277.496 1.713.635.72.228 1.376.196 1.895.118.583-.087 1.782-.729 2.033-1.433.251-.703.251-1.306.176-1.433-.075-.126-.276-.201-.578-.352z"/>
  </svg>
);

export function SocialMediaSection() {
  const { data: settings } = useQuery(settingsQuery);
  const [isVisible, setIsVisible] = useState(true);

  // Use phone number from whatsapp if available, and convert it to wa.me link
  const getWhatsAppUrl = (phone: string | null | undefined) => {
    if (!phone) return null;
    const digits = phone.replace(/[^0-9]/g, "");
    if (!digits) return null;
    return `https://wa.me/${digits}`;
  };

  // HARDCODED social links — set URL to null if no link exists (will render as non-clickable)
  const socialLinks = [
    {
      name: "Instagram",
      url: "https://www.instagram.com/elitenest5?igsh=MXdqbDBjaDlwOGYyZQ%3D%3D&utm_source=qr",
      icon: InstagramIcon,
    },
    {
      name: "Facebook",
      url: null,           // No Facebook page yet — not clickable
      icon: FacebookIcon,
    },
    {
      name: "LinkedIn",
      url: null,           // No LinkedIn page yet — not clickable
      icon: LinkedinIcon,
    },
    {
      name: "YouTube",
      url: "https://youtube.com/@elitenestarchitectsinteriors?si=mNi5o-4Xiko1eLiN",
      icon: YoutubeIcon,
    },
    {
      name: "Pinterest",
      url: null,           // No Pinterest page yet — not clickable
      icon: PinterestIcon,
    },
    {
      name: "WhatsApp",
      url: `https://wa.me/919364048269`,
      icon: WhatsAppIcon,
    },
  ];

  // If we haven't loaded settings yet, we can still render the layout immediately
  // with fallback links, which will be populated once settings are fetched.

  return (
    <section className="relative w-full overflow-hidden bg-background py-10 md:py-14">
      <div className="container-prose mx-auto px-4">
        {/* ── Premium Card Wrapper ── */}
        <div className="relative overflow-hidden rounded-3xl border border-[#c9a96e]/30 bg-[#1a1410] px-8 py-10 shadow-[0_8px_60px_rgba(0,0,0,0.35)] md:px-16 md:py-14">

          {/* Decorative blur orbs */}
          <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-[#b8894d]/20 blur-[80px]" />
          <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-[#b8894d]/15 blur-[80px]" />
          <div className="pointer-events-none absolute left-1/2 top-0 h-40 w-96 -translate-x-1/2 rounded-full bg-[#b8894d]/10 blur-[60px]" />

          {/* Subtle dot-grid texture */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: "radial-gradient(circle, #c9a96e 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />

          {/* Gold top border line */}
          <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#c9a96e]/70 to-transparent" />

          {/* Content */}
          <div className="relative z-10 text-center">
            {/* Header */}
            <div className="mb-10 space-y-4">
              <div
                className={`flex items-center justify-center gap-4 transition-all duration-700 ease-out ${
                  isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                }`}
              >
                <div className="h-px w-8 bg-[#c9a96e]/50 sm:w-16" />
                <span className="text-xs font-semibold uppercase tracking-widest text-[#c9a96e]">
                  Follow Our Journey
                </span>
                <div className="h-px w-8 bg-[#c9a96e]/50 sm:w-16" />
              </div>

              <h2
                className={`font-serif text-3xl text-ivory md:text-5xl transition-all duration-700 delay-100 ease-out ${
                  isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                }`}
              >
                Discover Our Latest{" "}
                <span style={{ color: "#c9a96e" }}>Spaces &amp; Stories</span>
              </h2>

              <p
                className={`mx-auto max-w-xl text-sm text-ivory/60 md:text-base transition-all duration-700 delay-200 ease-out ${
                  isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                }`}
              >
                Follow Elite Nest Interiors for design inspiration, completed projects,
                behind-the-scenes updates and interior transformation stories.
              </p>
            </div>

            {/* Social Icons */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-5">
              {socialLinks.map((link, index) => {
                const Icon = link.icon;
                const hasUrl = !!link.url;
                const sharedClass = `group relative flex h-14 w-14 items-center justify-center rounded-2xl border border-[#c9a96e]/20 bg-white/5 shadow-sm backdrop-blur-sm transition-all duration-300 ease-out ${
                  isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                } ${hasUrl ? "hover:-translate-y-1.5 hover:scale-105 hover:border-[#c9a96e]/60 hover:bg-white/10 hover:shadow-[0_6px_30px_rgba(201,169,110,0.25)] cursor-pointer" : "opacity-35 cursor-not-allowed"
                }`;
                const sharedStyle = { transitionDelay: isVisible ? `${300 + index * 80}ms` : "0ms" };

                const inner = (
                  <>
                    <Icon className="h-6 w-6 transition-transform duration-300 group-hover:scale-110" />
                    {hasUrl && (
                      <span className="pointer-events-none absolute -top-10 scale-95 rounded bg-[#c9a96e] px-2.5 py-1 text-xs font-medium text-[#1a1410] opacity-0 shadow-lg transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
                        {link.name}
                        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#c9a96e]" />
                      </span>
                    )}
                  </>
                );

                return hasUrl ? (
                  <a
                    key={link.name}
                    href={link.url!}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.name}
                    className={sharedClass}
                    style={sharedStyle}
                  >
                    {inner}
                  </a>
                ) : (
                  <div
                    key={link.name}
                    aria-label={`${link.name} (coming soon)`}
                    title="Coming soon"
                    className={sharedClass}
                    style={sharedStyle}
                  >
                    {inner}
                  </div>
                );
              })}
            </div>

            {/* Bottom tagline */}
            <p
              className={`mt-10 text-xs tracking-widest text-ivory/30 uppercase transition-all duration-700 delay-700 ease-out ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
            >
              Elite Nest Interiors · Bengaluru
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
