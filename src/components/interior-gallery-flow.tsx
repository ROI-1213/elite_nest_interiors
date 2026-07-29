const IMAGES = [
  "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1615874959474-d609969a20ed?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1558997519-83ea9252edf8?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1593476550610-87baa860004a?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=900&q=80",
];

export function InteriorGalleryFlow() {
  const loop = [...IMAGES, ...IMAGES];
  return (
    <section className="interior-gallery-flow relative w-full overflow-hidden" style={{ padding: "70px 0", background: "var(--ivory, #F8F3EC)" }}>
      {/* Edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 md:w-40" style={{ background: "linear-gradient(90deg, var(--ivory, #F8F3EC) 0%, rgba(248,243,236,0) 100%)" }} />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 md:w-40" style={{ background: "linear-gradient(270deg, var(--ivory, #F8F3EC) 0%, rgba(248,243,236,0) 100%)" }} />

      <div className="gallery-marquee w-full overflow-hidden">
        <div className="gallery-track flex gap-5 md:gap-7" style={{ width: "max-content" }}>
          {loop.map((src, i) => (
            <div
              key={i}
              className="gallery-card flex-none overflow-hidden rounded-2xl border border-black/5"
              style={{
                width: "clamp(220px, 30vw, 360px)",
                height: "clamp(320px, 55vw, 480px)",
                boxShadow: "0 20px 50px rgba(0,0,0,0.18)",
              }}
            >
              <img src={src} alt="" loading="lazy" draggable={false} className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes scrollGallery {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .gallery-track { animation: scrollGallery 45s linear infinite; }
        .gallery-marquee:hover .gallery-track { animation-play-state: paused; }
        @media (max-width: 768px) {
          .gallery-track { animation-duration: 35s; }
        }
        @media (prefers-reduced-motion: reduce) {
          .gallery-track { animation: none; }
        }
      `}</style>
    </section>
  );
}
