import { useEffect, useRef, type HTMLAttributes, type ReactNode } from "react";

type Props = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  delay?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  as?: "div" | "section" | "article" | "li" | "header";
};

export function Reveal({ children, delay = 0, as: Tag = "div", ...rest }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // If IntersectionObserver is not available (old browser / SSR edge case), show immediately
    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("is-visible");
      return;
    }

    // If element is already in the viewport (above the fold), show it immediately
    // without waiting for the observer callback — prevents flash of invisible content
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.classList.add("is-visible");
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        }
      },
      // Larger rootMargin so elements just below the fold get triggered earlier
      { threshold: 0.05, rootMargin: "0px 0px 60px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const Comp = Tag as unknown as "div";
  return (
    <Comp ref={ref as never} data-reveal data-reveal-delay={delay} {...rest}>
      {children}
    </Comp>
  );
}
