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
- **Dark-only theme** — no theme provider. CSS variables in `app/globals.css` `@theme` block. The landing intro is a fully-namespaced exception (`.landing-*` block in `globals.css`); it uses only the paper/ink tokens for its cream/ink cells, plus an inline-SVG cross pattern for texture — nothing else from the dark theme.
- **Landing intro**: a full-viewport fixed overlay (`<LandingIntro />`) sits at z=250 on top of the portfolio and runs a sstr-style 2×2 grid preloader: brand cell (top-left, ink, `// MA` + `// PLEASE WAIT` / `// LOADING...`), pattern cell (top-right, cream, `0%` counter + blinking square, fill driven by `--preloader-load` CSS var via the 51-point `fakeLoadEase` curve in `lib/fakeLoadEase.ts`), and two annotation cards (bottom-left `// INITIALIZING` + square mark, bottom-right `// CALIBRATING` + rotated square mark). Reveal sequence: overlay (initially sized to pattern cell, with `.preloader__overlay-fill` clone so the cell→overlay handoff is visually seamless) squeezes left 1.4s → cards drop y 80% + fade 0.5s staggered 0.1s → overlay expands down 0.9s → settle 0.4s → whole overlay rises `yPercent: -100` 1.4s to reveal the dark portfolio underneath. All four reveal tweens use the `cctpOut` custom ease (cubic-bezier `0.625, 0.05, 0, 1`, registered once via `CustomEase.create` at module load) — fast launch, long glide, mirrors sstr. A failsafe timer (REAL_TOTAL + 4s = 13.2s) force-unmounts if tweens get killed. No Barba, no sessionStorage gate, no images, no per-cell headings. Plays on every page load. Total ~8s. Timing constants live in `CFG` at the top of `LandingIntro.tsx`.

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
  hero/               Hero.tsx, HeroMarquee.tsx, HeroParticles.tsx, HeroForest.tsx (parallax forest bg)
  about/About.tsx
  skills/TechStack.tsx
  work/               ProjectArchive.tsx, ProjectRow.tsx, ProjectDrawer.tsx, ProjectThumbnail.tsx, ProjectPreview.tsx (cursor preview → flies into drawer)
  experience/Experience.tsx
  contact/Contact.tsx
  cursor/Cursor.tsx
  landing/LandingIntro.tsx  2×2 grid preloader (brand + pattern + 2 cards → overlay squeeze/expand → rise-up)
  primitives/         Button.tsx, Tag.tsx, Meta.tsx, Divider.tsx, SectionLabel.tsx, Marquee.tsx, RevealText.tsx, SocialIcon.tsx
hooks/
  useSmoothScroll.ts  Lenis + GSAP integration
  useMagnetic.tsx     magnetic hover wrapper
  useUrlSyncedProject.ts  ?project=<slug> deep-link
  useSplitReveal.ts   SplitText masked reveal for [data-split] elements
  useActiveSection.ts IntersectionObserver-based active section
  useReducedMotion.ts
  useMedia.ts
lib/
  lenis.ts            Lenis singleton
  motion.ts           easing + duration presets
  scramble.ts         ScrambleText helper (scramble(el, text)) + glyph set
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
- **Thumbnails**: `ProjectThumbnail` shows "Image not available" placeholder when file missing — no gradients, no fake screenshots. Never replace with stock images. Images are mixed shapes (3:2, 4:3, ~2:1), so the box takes each image's natural aspect ratio (`width`/`height` + `h-auto`) — never force a fixed `aspect-*` with `object-cover`, it crops them. `ProjectPreview` sizes its box to the active image the same way.
- **Tailwind v4**: config is CSS-based via `@theme` in `globals.css`. There is no `tailwind.config.ts` (was removed in the dep-upgrade).
- **Vertical rhythm**: section padding is driven by two shared utilities in `app/globals.css`:
  - `.section-pad-y` → `clamp(64px, 10vw, 140px)` for major sections (About, ProjectArchive, Experience, Contact)
  - `.section-pad-y-sm` → `clamp(48px, 7vw, 96px)` for the TechStack top wrapper
  - Do not introduce new `py-[clamp(...)]` values; reuse these or add a new utility to `globals.css`.
- **Hero height**: `min-h-screen` and `justify-center` are intentionally NOT used. The hero sizes to its content (`pt-24 pb-16 md:pt-32 md:pb-20 justify-start`). Don't re-add `min-h-screen` — it duplicates the bottom of an already-tall stack and creates the dead-zone problem.
- **Marquee rhythm**: `Marquee.tsx` uses `h-12` on the outer overflow wrapper AND on each text span, plus `leading-none`. The two heights must stay in sync; the inner span `h-12` is what prevents vertical clipping. The wrapper's `h-12` is what gives the GSAP translate a stable box to animate within.
- **Scroll line**: `components/ScrollLine.tsx` — accent SVG wave spanning all of `<main>` (absolute, z-0, behind sections). Revealed by a `clip-path: inset()` wipe whose tip tracks 60% down the viewport (measured live via `getBoundingClientRect`, eased 0.8s) (not stroke-dashoffset: the viewBox is stretched with `preserveAspectRatio="none"`). Path is built in page pixels (viewBox = `<main>` size, rebuilt on resize + ScrollTrigger refresh) and routed through every `[data-thread-lamp]` (`.thread-lamp` in `globals.css`, used in Approach rows); lamps get `data-lit` when the tip passes. Elsewhere it waves every 900px. Sections must stay transparent for it to show. The old per-element `data-parallax` system was removed (Sep 2026) — do not re-add it.
- **Hero forest**: `components/hero/HeroForest.tsx` — layered parallax background behind `<HeroParticles />`. Sky + fog + shade are CSS (`.hero-forest-*` in `globals.css`); tree layers are SVGs in `public/assets/hero/forest-{far,mid,near,front}.svg`, generated by `node scripts/gen-forest.mjs` (seeded; edit its `LAYERS` table and re-run, never hand-edit the SVGs). Whole layers move via one scrubbed timeline (`lag` yPercent per layer), gated by `gsap.matchMedia` (desktop + no reduced motion). Front layer keeps the centre empty for the h1. It hides the scroll thread inside the hero.
- **Text reveals**: headings/paragraphs use `useSplitReveal(sectionRef, !reduced)` + `data-split` (lines, re-split on resize/font load) or `data-split="words"` (short titles); `data-split-start` overrides the ScrollTrigger start. Don't hand-roll word/line masks or add opacity/y tweens to a `data-split` element. Mask descender room: `.split-line-mask`/`.split-word-mask` in `globals.css`. The hero h1 keeps its own intro timeline.
- **Scramble text**: `lib/scramble.ts`. `SectionLabel` (client, `children: string`) types its index + label in on scroll; `ProjectRow` meta columns decode on hover. Scrambled spans are `aria-hidden` with an `sr-only` copy.
- **Project preview**: `ProjectPreview` (imperative handle: show/hide/move/flyTo) trails the cursor over archive rows; on open it flies into `[data-drawer-thumb="<id>"]`, re-reading the slot's rect every frame (the drawer height is animating and a drawer above may be closing), then dissolves over the real thumbnail. Not the GSAP Flip plugin — the slot is inside an `overflow: hidden` drawer, which would clip a reparented element. Fine pointer + ≥768px + no reduced motion only; images mount on first hover and use the same `sizes` as `ProjectThumbnail` so the handoff reuses the cached file.
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
- **Reduced motion**: `useSmoothScroll` no-ops, TechStack falls back to vertical stack, LandingIntro unmounts immediately (skips the ~8s sequence), drawer uses 150ms fade, no auto-open of WalletMate, scroll line shown fully drawn.
- **LandingIntro z-index**: 250 — sits above the existing `<Nav />` (z=200) and `<Cursor />` (z=200). The overlay is inline in the React tree (not a portal), so StrictMode double-mount is handled by tween kill + `gsap.set(..., { clearProps: "all" })` on cleanup (no `gsap.context` — plain tween registry). `requestAnimationFrame` defers `setVisible(false)` so unmount happens in a clean commit phase. A `doneRef` flag dedupes the natural `onComplete` vs the failsafe timer.
- **Lenis StrictMode guard**: `useSmoothScroll.ts` does **not** reset `initialized.current` in cleanup — that caused double-init and broken scroll in dev. The singleton in `lib/lenis.ts` prevents true duplicates; the guard was redundant and harmful.
- **No test runner** — there is no `npm test` script and no test-framework dep. Pure functions get tested via Node's built-in `node:test` + `--experimental-strip-types` (e.g. `lib/fakeLoadEase.test.ts`). Run a single test file: `node --experimental-strip-types --test lib/<file>.test.ts`. Test files import with the explicit `.ts` extension; `tsconfig.json` has `allowImportingTsExtensions: true` to make `tsc --noEmit` accept that. Keep the seam at pure functions only — React components and GSAP-driven side effects are not under test.

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

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
