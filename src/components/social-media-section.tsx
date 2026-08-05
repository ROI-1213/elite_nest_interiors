import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { settingsQuery } from "@/lib/queries";

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className} width="24" height="24" fill="none">
    {/* Outer rounded square */}
    <rect x="2" y="2" width="20" height="20" rx="5.5" stroke="#fff" strokeWidth="2" />
    {/* Inner circle */}
    <circle cx="12" cy="12" r="4.5" stroke="#fff" strokeWidth="2" />
    {/* Dot top-right */}
    <circle cx="17" cy="7" r="1.2" fill="#fff" />
  </svg>
);

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className} width="24" height="24">
    {/* Blue background */}
    <rect width="24" height="24" fill="#1877F2" />
    {/* White "f" letter */}
    <path fill="#fff" d="M22.675 0h-21.35C0.6 0 0 0.6 0 1.333v21.333C0 23.4 0.6 24 1.333 24h11.5v-9.333H9.8v-3.8h3.033V8.9c0-3.066 1.867-4.733 4.6-4.733 1.333 0 2.467 0.1 2.8 0.133v3.267h-1.933c-1.533 0-1.833 0.733-1.833 1.8v2.367h3.667l-0.467 3.8h-3.2V24h6.267c0.733 0 1.333-0.6 1.333-1.333V1.333C24 0.6 23.4 0 22.675 0z"/>
  </svg>
);

const YoutubeIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className} width="24" height="24">
    <path fill="#fff" d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 00-2.122 2.136C0 8.07 0 12 0 12s0 3.93.501 5.814a3.016 3.016 0 002.122 2.136c1.871.55 9.377.55 9.377.55s7.505 0 9.377-.55a3.016 3.016 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z"/>
    <path fill="#FF0000" d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className} width="24" height="24">
    <path fill="#fff" d="M20.52 3.449A11.97 11.97 0 0012 0C5.383 0 0 5.383 0 12.002c0 2.115.553 4.181 1.603 6l-1.6 5.845 5.98-1.567a11.956 11.956 0 006.015 1.621h.005c6.617 0 12-5.382 12-11.998a11.966 11.966 0 00-3.483-8.452z"/>
    <path fill="#25D366" d="M12.002 21.906h-.004a9.929 9.929 0 01-5.06-1.385l-.363-.215-3.766.987.998-3.67-.236-.375a9.932 9.932 0 01-1.517-5.242c0-5.485 4.464-9.95 9.953-9.95a9.887 9.887 0 017.039 2.915 9.88 9.88 0 012.913 7.037c0 5.484-4.466 9.948-9.953 9.948z"/>
    <path fill="#fff" d="M17.481 15.011c-.301-.151-1.782-.879-2.058-.979-.276-.1-.478-.151-.678.151-.201.301-.778.979-.954 1.18-.176.201-.352.226-.653.075-.301-.151-1.272-.469-2.423-1.494-.895-.798-1.5-1.784-1.676-2.085-.176-.301-.019-.464.132-.614.135-.135.301-.351.452-.527.151-.176.201-.301.301-.502.1-.201.05-.377-.025-.527-.075-.151-.678-1.631-.929-2.233-.243-.585-.491-.506-.678-.515-.176-.008-.377-.01-.578-.01-.201 0-.527.075-.803.377-.276.301-1.054 1.03-1.054 2.511 0 1.482 1.079 2.914 1.23 3.115.151.201 2.122 3.238 5.138 4.54.717.311 1.277.496 1.713.635.72.228 1.376.196 1.895.118.583-.087 1.782-.729 2.033-1.433.251-.703.251-1.306.176-1.433-.075-.126-.276-.201-.578-.352z"/>
  </svg>
);

export function SocialMediaSection() {
  const { data: settings } = useQuery(settingsQuery);
  const [isVisible] = useState(true);

  const socialLinks = [
    {
      name: "Instagram",
      url: "https://www.instagram.com/elitenest5?igsh=MXdqbDBjaDlwOGYyZQ%3D%3D&utm_source=qr",
      icon: InstagramIcon,
      bg: "linear-gradient(135deg, #f9ce34 0%, #ee2a7b 50%, #6228d7 100%)",
    },
    {
      name: "Facebook",
      url: null, // No Facebook page yet — not clickable
      icon: FacebookIcon,
      bg: "#1877F2",
    },
    {
      name: "YouTube",
      url: "https://youtube.com/@elitenestarchitectsinteriors?si=mNi5o-4Xiko1eLiN",
      icon: YoutubeIcon,
      bg: "#FF0000",
    },
    {
      name: "WhatsApp",
      url: `https://wa.me/919364048269`,
      icon: WhatsAppIcon,
      bg: "#25D366",
    },
  ];

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
            <div className="flex flex-wrap items-center justify-center gap-5">
              {socialLinks.map((link, index) => {
                const Icon = link.icon;
                const hasUrl = !!link.url;

                const sharedClass = `group relative flex h-14 w-14 items-center justify-center rounded-2xl shadow-lg transition-all duration-300 ease-out ${
                  isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                } ${
                  hasUrl
                    ? "hover:-translate-y-2 hover:scale-110 hover:shadow-[0_10px_35px_rgba(0,0,0,0.4)] cursor-pointer"
                    : "opacity-40 cursor-not-allowed grayscale"
                }`;

                const sharedStyle = {
                  transitionDelay: isVisible ? `${300 + index * 80}ms` : "0ms",
                  background: link.bg,
                };

                const inner = (
                  <>
                    <Icon className="social-icon transition-transform duration-300 group-hover:scale-110" />
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
