## Scope

This is a TanStack Start (SSR) app, not a Vite SPA. Several items in the brief don't apply — I'll note them and focus on the fixes that will actually change what you see in production. No redesign, no content changes, no Lovable Cloud, no Supabase changes.

## What doesn't apply here (and why)

- **SPA rewrite files** (`_redirects`, `netlify.toml`, `vercel.json`, `.htaccess`): TanStack Start deploys as an SSR worker. Every route is server-rendered — no rewrite config is needed or possible on Lovable hosting. Refresh-on-deep-link already works.
- **Vite `base` config**: managed by `@lovable.dev/vite-tanstack-config`. Manual edits will break the build.
- **`VITE_SUPABASE_*` env in production**: already injected by Lovable at build/deploy time. No manual dashboard step needed.
- **`window.location` navigation audit**: current header uses `<Link>` from `@tanstack/react-router` — already correct.

## Real root causes I can see in the code

1. **Header layout math is broken on the home page.** `SiteLayout` wraps the header in `absolute inset-x-0 top-0`, but inside `SiteHeader` a `useEffect` immediately flips it to `position: fixed` on mount. On first render (SSR + hydration) the header is out of normal flow with no reserved space, so hero content sits under it and the top-bar height (~36px + 112px nav) visually eats the hero title area at common laptop viewports.
2. **Header hides too aggressively.** `hidden` becomes true at any `scrollY >= 80`, regardless of direction — so scrolling down 80px and back up still leaves it hidden until you cross 0 again. Feels like "nav disappeared / clicks are slow" because the mobile menu button also disappears.
3. **Every home-page query is `useSuspenseQuery` + `prefetchQuery` (not `ensureQueryData`) in the loader.** `prefetchQuery` doesn't await — so Suspense boundaries fall back on first client render and the whole page appears blank/slow until 6 queries resolve. This is the biggest "hero text not visible / slow navigation" symptom in production where the network is slower than the sandbox.
4. **Hero background is imported as a static asset** — fine — but there's no `<link rel="preload" as="image">` for the LCP image, so it paints late.
5. **Google Fonts loaded via `<link rel="stylesheet">` in `__root.tsx`** without `font-display: swap` guarantee (Google's CSS does include it, so this is minor) and no preconnect issue — already preconnected. OK as-is.

## Fixes I'll implement

### A. Fix header positioning (invisible hero / layout jump)
- Remove the `absolute` wrapper in `SiteLayout` and let `SiteHeader` own its own positioning.
- In `SiteHeader`, use `position: fixed` from the first render (SSR-safe), and add a spacer div sized to the header height on non-home pages so content isn't hidden.
- On the home page keep the header transparent over the hero (current behavior), but guarantee hero content has `padding-top` matching header height so the H1 is never covered.

### B. Fix hide-on-scroll logic
- Track scroll direction: hide only when scrolling **down** past 80px, show immediately on any scroll **up**. Standard "smart header" behavior — matches what the user expects and stops the "nav is gone" feeling.

### C. Fix loader data fetching (the big one for perceived speed)
- In `src/routes/index.tsx` (and any other route using the same pattern), swap `prefetchQuery` → `ensureQueryData` inside `Promise.all` in the loader. Data is ready **before** the component mounts, so `useSuspenseQuery` resolves synchronously and the page renders in one paint instead of six Suspense fallbacks.
- Same fix for other routes that mix `prefetchQuery` + `useSuspenseQuery` (I'll grep and patch each).

### D. Preload the LCP hero image
- Add `{ rel: "preload", as: "image", href: heroImg, fetchpriority: "high" }` to the home route's `head().links`. Only the home route — not `__root`.

### E. Guard hero text visibility
- Ensure the hero content wrapper has `position: relative; z-index: 10` and the background/overlay layers are `z-0` / `z-[1]`. Verify no `opacity-0` animation state without a paired `animate-*` that always runs.

### F. Verify build
- Run `bun run build` and fix any TS/route errors introduced.

## Files I expect to touch

- `src/components/site-header.tsx` — positioning, hide-on-scroll direction, SSR-safe initial state
- `src/components/site-layout.tsx` — drop the `absolute` wrapper, add spacer for non-home
- `src/routes/index.tsx` — loader uses `ensureQueryData` + `Promise.all`; add hero image preload; verify hero z-index
- `src/routes/about-us.tsx`, `src/routes/gallery.tsx`, `src/routes/services.*.tsx`, `src/routes/testimonials.tsx`, `src/routes/contact-us.tsx` — same loader swap where the pattern is present

## What I will NOT change

- Colors, typography, section order, copy, images, animations (except any that keep content at `opacity: 0` indefinitely — none found on quick scan).
- Supabase client, RLS, queries, env vars.
- Vite config, hosting config.
- Route file names or navigation labels.

## Report at the end

After applying, I'll run `bun run build`, report exit status, list every changed file, and confirm no design/content was altered and Lovable Cloud remains disabled.

---

**Approve this plan and I'll implement it in the next turn.** If you want me to also touch a specific page you've seen the issue on (e.g. gallery), tell me which one and I'll include it explicitly.
