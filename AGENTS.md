# AGENTS.md

## Project Overview
Next.js 16 (App Router) + React 19 + TypeScript portfolio for **Mohammad Azman** — React Native & Full-Stack Developer. Dark-only, editorial Awwwards-style design. GSAP + Motion (Framer Motion) + Lenis smooth scroll. Drop-in real project thumbnails via `public/assets/projects/<slug>.webp`.

## Commands
- `npm run dev` — start dev server (localhost:3000)
- `npm run build` — production build
- `npm run start` — run production build
- `npm run lint` — `npx eslint .` (lint script `next lint` is broken in Next 16; use eslint directly)
- `npx eslint .` — preferred way to run lint

## Architecture Notes
- **Entry point**: `app/page.tsx` is a server component. It composes:
  - `<ClientOverlays />` (`<LandingIntro />` + `<Cursor />`, lazy) and `<Nav />` rendered directly
  - `<Hero />` rendered directly (client component, but small enough to ship)
  - `<Sections />` (client) dynamically-imports `About`, `ProjectArchive`, `TechStack`, `Experience`, `Contact` with `ssr: false`
- **SmoothScroll**: `app/layout.tsx` wraps children in `<SmoothScroll>` which calls `useSmoothScroll` — initializes Lenis + GSAP ScrollTrigger sync, gated by `prefers-reduced-motion`.
- **Fonts**: `next/font/google` for Fraunces (variable, opsz axis), Inter, JetBrains Mono. `next/font/local` for Zentry (`public/fonts/zentry-regular.woff2`).
- **Path alias**: `@/*` → `./*`
- **Dark-only theme** — no theme provider. CSS variables in `app/globals.css` `@theme` block. The yellow landing intro is a fully-namespaced exception (`.landing-*` block in `globals.css`); it does not use the ink/paper tokens.
- **Landing intro**: a full-viewport fixed yellow overlay (`<LandingIntro />`) sits at z=250 on top of the portfolio and runs a ~11.9s GSAP sequence: three odometer wheels count to 100%, a progress bar fills, then the whole overlay slides left (`xPercent: -100`) + fades out to reveal the portfolio underneath. No images, no nav/headline, no sessionStorage gate. It plays on every page load.

## File Tree (key paths)
```
app/
  layout.tsx          fonts, metadata, viewport, SmoothScroll wrapper
  page.tsx            composition (server)
  globals.css         Tailwind v4 @theme tokens (ink/paper/accent) + .landing-* block
  opengraph-image.tsx (not yet created — TODO)
components/
  ClientOverlays.tsx  LandingIntro + Cursor (client, lazy)
  Sections.tsx        dynamic-imports all major sections
  SmoothScroll.tsx    calls useSmoothScroll
  nav/                Nav.tsx, MobileMenu.tsx
  hero/               Hero.tsx, HeroMarquee.tsx
  about/About.tsx
  skills/TechStack.tsx
  work/               ProjectArchive.tsx, ProjectRow.tsx, ProjectDrawer.tsx, ProjectThumbnail.tsx
  experience/Experience.tsx
  contact/Contact.tsx
  cursor/Cursor.tsx
  landing/LandingIntro.tsx  yellow ~11.9s landing overlay (odometer → progress bar → slide-left+fade)
  primitives/         Button.tsx, Tag.tsx, Meta.tsx, Divider.tsx, SectionLabel.tsx, Marquee.tsx, RevealText.tsx, SocialIcon.tsx
hooks/
  useSmoothScroll.ts  Lenis + GSAP integration
  useMagnetic.tsx     magnetic hover wrapper
  useUrlSyncedProject.ts  ?project=<slug> deep-link
  useActiveSection.ts IntersectionObserver-based active section
  useReducedMotion.ts
  useMedia.ts
lib/
  lenis.ts            Lenis singleton
  motion.ts           easing + duration presets
data/
  projects.ts         12 projects (7 verified, 5 repo-only)
  socials.ts          typed social links
  experience.ts       2 jobs + education
  content.ts          nav, about, tech panels, hero copy, marquee
public/
  fonts/              zentry-regular.woff2 (only)
  assets/projects/    EMPTY — drop <slug>.webp files here for each project
```

## Key Conventions
- **Sections are client components, dynamically imported** via `<Sections />` wrapper. Don't `dynamic()` from `app/page.tsx` directly — `ssr: false` is not allowed in Server Components.
- **Animation split**: GSAP for scroll-driven (ScrollTrigger, pin, scrub, timelines, marquee). Motion for component-level (drawer expand/collapse, mobile menu, magnetic, nav underline `layoutId`).
- **Project archive interaction** is the visual signature. State held in `useUrlSyncedProject` (mirrors to `?project=<slug>`). WalletMate auto-opens once per session via `sessionStorage` key `azman-walletmate-seen`.
- **Thumbnails**: `ProjectThumbnail` shows "Image not available" placeholder when file missing — no gradients, no fake screenshots. Never replace with stock images.
- **Tailwind v4**: config is CSS-based via `@theme` in `globals.css`. There is no `tailwind.config.ts` (was removed in the dep-upgrade).
- **Vertical rhythm**: section padding is driven by two shared utilities in `app/globals.css`:
  - `.section-pad-y` → `clamp(64px, 10vw, 140px)` for major sections (About, ProjectArchive, Experience, Contact)
  - `.section-pad-y-sm` → `clamp(48px, 7vw, 96px)` for the TechStack top wrapper
  - Do not introduce new `py-[clamp(...)]` values; reuse these or add a new utility to `globals.css`.
- **Hero height**: `min-h-screen` and `justify-center` are intentionally NOT used. The hero sizes to its content (`pt-24 pb-16 md:pt-32 md:pb-20 justify-start`). Don't re-add `min-h-screen` — it duplicates the bottom of an already-tall stack and creates the dead-zone problem.
- **Marquee rhythm**: `Marquee.tsx` uses `h-12` on the outer overflow wrapper AND on each text span, plus `leading-none`. The two heights must stay in sync; the inner span `h-12` is what prevents vertical clipping. The wrapper's `h-12` is what gives the GSAP translate a stable box to animate within.
- **ESLint**: zero warnings policy. The flat config in `eslint.config.mjs` uses `nextPlugin.configs.recommended` + `nextPlugin.configs["core-web-vitals"]` + `tseslint.configs.recommended` + `eslint-plugin-react-hooks`. No `FlatCompat` (causes circular-reference errors).

## Gotchas
- **TypeScript 7 is NOT supported** by `typescript-eslint`. Keep `typescript` at `^5.7.3`. Do not upgrade to TS 7.
- **ESLint 10 is NOT supported** by the flat config setup. Keep `eslint` at `^9.39.5`. Do not upgrade to ESLint 10.
- **`npm run lint` is broken** in Next 16 (`next lint` removed). Use `npx eslint .` directly.
- **`react-icons/hi2`** exports are `HiArrowUpRight` (prefixed), not `ArrowUpRight`. Same for other icons.
- **Magnetic** is a wrapper that renders `<motion.span>` containing an `<a>` (or `<motion.button>`). Don't pass `as` prop — it's been simplified. Use `href` for links, `onClick` for buttons.
- **`ssr: false`** in `next/dynamic` only works in client components. Use the `Sections` pattern.
- **Fraunces** must use `weight` omitted (variable font with `axes: ["opsz"]`) — specifying both `weight` array and `axes` causes a build error.
- **Lenis + GSAP** integration requires `gsap.ticker.add((t) => lenis.raf(t * 1000))` and `gsap.ticker.lagSmoothing(0)`. ScrollTrigger also needs `lenis.on("scroll", ScrollTrigger.update)`.
- **Cursor** is gated by `useMedia("(pointer: fine)")` and `useReducedMotion`. Hidden on touch.
- **Reduced motion**: `useSmoothScroll` no-ops, TechStack falls back to vertical stack, LandingIntro unmounts immediately (skips the 13.2s sequence), drawer uses 150ms fade, no auto-open of WalletMate.
- **LandingIntro z-index**: 250 — sits above the existing `<Nav />` (z=200) and `<Cursor />` (z=200). The overlay is inline in the React tree (not a portal), so StrictMode double-mount is handled by `gsap.context(rootRef)` + `ctx.revert()` on cleanup. `requestAnimationFrame` defers `setVisible(false)` so unmount happens in a clean commit phase.
- **Lenis StrictMode guard**: `useSmoothScroll.ts` does **not** reset `initialized.current` in cleanup — that caused double-init and broken scroll in dev. The singleton in `lib/lenis.ts` prevents true duplicates; the guard was redundant and harmful.
- **Reduced motion**: `useSmoothScroll` no-ops, TechStack falls back to vertical stack, LandingIntro unmounts immediately (skips the ~11.9s sequence), drawer uses 150ms fade, no auto-open of WalletMate.
- **No test suite** configured.

## Pending / TODO
- `app/opengraph-image.tsx` — generated OG image not yet implemented
- `public/assets/projects/*.webp` — 7 placeholder paths (`walletmate.webp`, `job-scheduler.webp`, `driver.webp`, `olms.webp`, `taskmate.webp`, `resumix.webp`, `password-manager.webp`) point to non-existent files. Drop real assets in as `<slug>.webp`. Existing 5 repo projects use existing `public/*` paths.
- `app/sitemap.ts` and `app/robots.ts` — not yet created
- `tsconfig.json` `target: "ES2017"` — may want to bump to ES2020 for newer syntax
- **JSON-LD `Person` schema** in `layout.tsx` — metadata is solid but structured data would improve discoverability
- **GitHub URLs for the 4 full-stack projects** (Job Scheduler, Driver, Resumix, Password Manager) — `data/projects.ts` has the `githubUrl?` field; add values when repos are published and the drawer will render the `Source ↗` button automatically

## Browser Debugging (MCP)
- **Chrome DevTools MCP** configured at `~/.config/opencode/opencode.json`. After restarting opencode, available tools: `chrome-devtools_navigate_page`, `take_screenshot`, `evaluate_script`, `list_console_messages`, `list_network_requests`.
- **Fallback**: `scripts/snap.mjs` (Playwright) — run `node scripts/snap.mjs` with dev server up; outputs screenshot + console + computed styles to `public/.debug/`.
