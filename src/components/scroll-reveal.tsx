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

    // Always add is-visible immediately on mount to prevent any first-load invisible content frame
    el.classList.add("is-visible");

    if (typeof IntersectionObserver === "undefined") {
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
      { threshold: 0.01, rootMargin: "100px 0px 100px 0px" },
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
