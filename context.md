# context.md

## What this document is
Notes for the **human owner** and the **next OpenCode session** that picks this up. Where `AGENTS.md` describes the codebase as it stands, this file describes **why it stands that way** — the decisions, the trade-offs, the things that are intentionally unfinished, and the things the next session should know without re-deriving them.

If you're an agent: read `AGENTS.md` first for what you can do; read this file for why you should (or shouldn't) do it.

---

## 1. What was built

A complete visual + architectural rewrite of the portfolio, replacing the original Aceternity/Aceternity-inspired devfolio template (`Hero` + `BentoGrid` + `RecentProjects` with 3D pins + `PageReveal` + `following-pointer` + magic conic-gradient buttons) with an editorial Awwwards-style layout:

- **Hero**: oversized Fraunces name, scroll-scrubbed tagline, magnetic `View work ↓`, micro mono label.
- **About**: editorial paragraph + identity list + horizontal tech marquee.
- **Practice (Tech Stack)**: 5 GSAP-pinned horizontal panels + a tools chip panel. Vertical stack on mobile.
- **Selected Work (the signature)**: 12-row archive. Click to expand a single project drawer inline. Only one open at a time. `Esc` closes. URL deep-link via `?project=<slug>`. WalletMate auto-opens for 6s on first visit, then closes (or closes on first scroll, whichever comes first).
- **Experience**: 2 jobs from your resume, plus a quiet C++ line.
- **Contact**: oversized `Let's build something.` + magnetic copy-to-clipboard email + 4 socials + footer with resume link.
- **Lenis** smooth scroll wired to GSAP ScrollTrigger.
- **Custom cursor** (`mix-blend-difference`, scales on hover/text, hidden on touch + reduced motion).
- **Preloader**: yellow full-viewport overlay (~11.9s) — odometer wheels count to 100%, progress bar fills, then slides left + fades out. No session gate, no images, no headline. Plays on every load.

## 2. Key decisions (locked, do not relitigate)

| Decision | Value | Why |
|---|---|---|
| Theme | Dark-only | Matches the reference aesthetic. `next-themes` removed. |
| Accent | Acid lime `#E8FF8B` | Single accent, used sparingly (hover, active, links, copy feedback). |
| Display font | Fraunces (variable, opsz axis) | Reads as editorial, optical sizing gives the hero its scale. |
| Sans | Inter | Safe, variable, system-ubiquitous. |
| Mono | JetBrains Mono | Tags, meta, numbers. |
| Monogram | Zentry (local) | Kept for the "AZ" preloader/mark. |
| Smooth scroll | Lenis + GSAP ticker override | The reference feels Lenis-driven. Gated by `prefers-reduced-motion`. |
| State (drawer) | React state, mirrored to URL | `useUrlSyncedProject`. Single drawer, no auto-scroll on open. |
| Featured row | WalletMate auto-open for 6s on first visit | Real published Play Store app = strongest credibility anchor. Per your answer. Gated by `sessionStorage` key `azman-walletmate-seen`; suppressed if `?project=` deep link is present. |
| Project order | WalletMate → Job Scheduler → Driver → OLMS → TaskMate → Resumix → Password Manager → Zentry → Brainwave → Nike → Apple → Crypto | Per your answer (strongest first). |

## 3. Content rules that MUST stay in force

- **No invented data.** Every metric, every tech, every URL, every claim in this site traces back to one of three sources: (1) the resume payload you provided, (2) `data/index.ts` from the original repo, (3) explicit `key_metrics` in the resume JSON. If you add anything, ask first.
- **No placeholder thumbnails.** If `public/assets/projects/<slug>.webp` doesn't exist, `ProjectThumbnail` shows a 1px-bordered 4:3 slot with "Image not available" in mono. No gradients, no fake screenshots, no stock images. Five repo projects still use their existing `public/*` paths (zentry.jpg, brainwave.jpg, nike.png, p4.svg, p6.png) — leave those alone.
- **No fabricating URLs.** WalletMate, OLMS, and the 5 repo projects have actual links. The 4 unverified full-stack projects (Job Scheduler, Driver, Resumix, Password Manager) deliberately have no `projectUrl` in the data — the drawer will not render a "View project" button for them. Do not add demo links without verifying.
- **Instagram is in the socials row.** Per your answer. URL: `instagram.com/idr_azman/`.

## 4. What is NOT done yet (pending)

1. **Real project thumbnails.** `public/assets/projects/` is empty. The 7 verified projects have `thumbnail: "/assets/projects/<slug>.webp"` set in `data/projects.ts`. Drop files in as `<slug>.webp`:
   - `walletmate.webp`
   - `job-scheduler.webp`
   - `driver.webp`
   - `olms.webp`
   - `taskmate.webp`
   - `resumix.webp`
   - `password-manager.webp`

   The 5 repo projects (zentry, brainwave, nike, apple-iphone-3d, crypto-dashboard) use existing repo paths and need no work.

2. **`app/opengraph-image.tsx`** — generated OG image (1200×630). Currently falling back to default. Recommended: use `next/og` with the same dark + lime accent + "Mohammad Azman / React Native & Full-Stack" treatment as the hero.

3. **`app/sitemap.ts` and `app/robots.ts`** — not created. Single page so impact is minimal, but should exist for SEO completeness.

4. **JSON-LD `Person` schema** — not yet injected into `layout.tsx`. Metadata is good but structured data would improve discoverability.

5. **GitHub URLs for the 4 full-stack projects** — the data has `githubUrl?: string` but no values. If/when you publish repos, add them in `data/projects.ts` and the drawer will render the `Source ↗` button automatically.

## 5. What was intentionally removed

- `components/ui/*` (BentoGrid, FloatingNav, following-pointer, GradientBg, MagicButton, Spotlight, TextGenerateEffect, 3d-pin) — all replaced.
- `components/moving-border.tsx` — used only in the old Experience cards.
- `components/Hero.tsx` (root) — replaced by `components/hero/Hero.tsx`.
- `components/Experience.tsx`, `Footer.tsx`, `Grid.tsx`, `RecentProjects.tsx` (all root) — replaced.
- `components/Intro.tsx`, `PageReveal.tsx`, `ClientWrapper.tsx` — replaced by `components/intro/Preloader.tsx`.
- `app/provider.tsx` — `next-themes` no longer used.
- `utils/RevealContext.tsx`, `utils/useRevealAnimation.ts` — replaced by per-section GSAP within components and Motion's `whileInView`.
- `data/index.ts` — old generic devfolio data. Replaced by typed `data/projects.ts`, `data/socials.ts`, `data/experience.ts`, `data/content.ts`.
- `data/confetti.json` — was used by the Lottie email copy. Replaced with Motion + state.
- `tailwind.config.ts` — Tailwind v4 is configured in `app/globals.css` via `@theme`. There's no JS config.

If you see references to any of these in old docs or branches, they are stale.

## 6. Known trade-offs

- **Lenis on mobile**: we don't enable `syncTouch`, so touch scrolling is native. Lenis only smooths wheel events. This is correct behavior — sync-touch on Lenis usually feels worse than native.
- **Auto-open WalletMate**: gated by `sessionStorage`, so it only happens once per browser session. If the user opens a deep link (`?project=...`), WalletMate's auto-open is suppressed. If the user scrolls within 6s, the drawer closes early and the session is marked "seen".
- **TechStack horizontal scroll** is desktop-only (≥768px). Mobile gets a vertical stack. This is intentional — pinned horizontal scroll on mobile is a usability trap.
- **Hero is NOT in the dynamic-import list.** It's server-rendered-friendly enough that we ship it eagerly, and putting it behind a dynamic import would cause a flash on first paint.
- **Magnetic uses a `<motion.span>` wrapping an `<a>`** for anchor links, rather than `motion.a` directly. This was a TS workaround for Framer Motion's strict prop typing on `href`/event handlers. The visual result is identical; don't refactor unless the TS errors resurface differently.
- **StrictMode + Lenis**: the `initialized.current = false` reset in `useSmoothScroll` cleanup was removed. It caused double-init in React 19 StrictMode (cleanup of mount #1 runs before mount #2, resetting the guard). The Lenis singleton in `lib/lenis.ts` already prevents true duplicates — the ref guard was redundant and harmful.

## 6a. Vertical rhythm (the layout pass)

After the initial build, a visual review surfaced three spacing issues:

1. **Hero → About** had ~360–400px of dead space. Caused by `min-h-screen` on the hero (which was already overflowed by its own content, so `min-h-screen` added another full viewport on top) plus `py-[clamp(96px,14vw,200px)]` on About.
2. **Marquee → Selected Work** had ~360px of dead space. Same `clamp(... 200px)` padding was applied to BOTH About's bottom and ProjectArchive's top, paying the cost twice.
3. **Technology marquee** was vertically clipping text. The Marquee had no explicit height; uppercase tracked mono at 14px with no `leading-*` was overflowing the line box.

### What was changed (8 files, no new components)

- **`app/globals.css`** — added two shared utilities:
  - `.section-pad-y` → `clamp(64px, 10vw, 140px)` (down from `clamp(96px, 14vw, 200px)` per section)
  - `.section-pad-y-sm` → `clamp(48px, 7vw, 96px)` for the TechStack top wrapper
- **`components/hero/Hero.tsx`** — removed `min-h-screen` and `justify-center`; switched to `pt-24 pb-16 md:pt-32 md:pb-20 justify-start`. The hero now ends where its content ends.
- **`components/primitives/Marquee.tsx`** — outer wrapper `h-12 flex items-center`; each text span `h-12 leading-none`; separator spacing switched from `gap-6` (wrong flex axis) to `ml-6` (correct).
- **`components/about/About.tsx`** — `py-[clamp(...)]` → `section-pad-y`; marquee wrapper `mt-20` → `mt-12 md:mt-16`; dropped `py-4` (the marquee's own `h-12` handles vertical rhythm now).
- **`components/work/ProjectArchive.tsx`**, **`components/experience/Experience.tsx`**, **`components/contact/Contact.tsx`** — all `py-[clamp(...)]` → `section-pad-y`.
- **`components/skills/TechStack.tsx`** — top wrapper: `pt-[clamp(...)] pb-12` → `section-pad-y-sm`; bottom track padding: `pb-[clamp(...)]` → `pb-[clamp(64px,10vw,140px)]`; panel min-h `[60vh] md:[70vh]` → `[60vh] md:[80vh]` (description + footer needed more room); Tools panel same `70vh` → `80vh`.

### Net effect

- Hero → About: ~360–400px → ~140–180px (still spacious, no longer dead).
- Marquee → Selected Work: ~360px → ~140px + section label breathing room.
- Marquee clipping: fixed. `h-12` outer + `h-12 leading-none` inner; horizontal GSAP animation untouched.
- All section padding now lives in two utility classes — the next agent can tune the whole site's spacing from one place (`globals.css`).

### Conventions to preserve

- **Do not re-add `min-h-screen`** to any section. The hero is the only candidate and it's already at content-height. Adding `min-h-screen` will recreate the dead zone.
- **Do not re-add `justify-center`** to the hero. `justify-start` is correct because the content sizes naturally.
- **Do not re-introduce ad-hoc `py-[clamp(...)]` values.** Use `.section-pad-y` (default) or `.section-pad-y-sm` (when followed by a section that has its own big top, like TechStack's pinned panels). If a third rhythm tier is needed, add it to `globals.css` as a utility — don't inline.
- **Do not remove the marquee's `h-12`**. The vertical clipping bug will return.
- **TechStack's pinned panels need their `min-h` to be ≥ `70vh` on desktop** to fit the panel name + description + footer without truncation. Don't shrink them.

---

## 7. Where to look first if something is wrong

- **Animation glitch**: the offending component is the one with the closest GSAP `ScrollTrigger.create` or Motion `whileInView` block. TechStack has the most complex GSAP (pinned horizontal).
- **Lint warning about unused imports**: usually a recently-added icon or hook. Don't disable the rule — fix the import.
- **Hydration warning**: almost always `Math.random()` or `Date.now()` in render. We don't have any, but if you add one, gate it behind `useEffect`.
- **Font not loading**: Fraunces uses `axes: ["opsz"]` without a `weight` array (variable font requirement). Don't add `weight: ["300", ...]` — it breaks the build.
- **Lenis not smoothing**: check that `useSmoothScroll` is mounted (it's in `<SmoothScroll>` which wraps `{children}` in `layout.tsx`), that `reduced` is `false`, and that `gsap.registerPlugin(ScrollTrigger)` ran before the ticker callback.

## 8. Build history (chronological)

- **v1 — initial rewrite**: replaced Aceternity template with editorial Awwwards layout. 7 verified + 5 repo-only projects in the archive. Lenis + GSAP + Motion. Dark-only with acid-lime accent.
- **v2 — layout rhythm pass**: resolved 3 spacing issues (Hero → About dead space, Marquee → Selected Work dead space, marquee vertical clipping). Introduced shared `.section-pad-y` / `.section-pad-y-sm` utilities. Removed `min-h-screen` + `justify-center` from the hero. See §6a for full diff.
- **v3 — loader + scroll-lock fix**: stripped the landing intro to odometer + progress bar + slide-left fade (removed 7-image carousel, nav drop, headline rise, 13.2s sequence). Dropped the `createPortal` into `document.body` — the section is `position: fixed; z-index: 250` so it overlays without escaping the React tree (the portal caused `removeChild`/`insertBefore` React 19 reconciliation crashes in `Sections`). Fixed `useSmoothScroll` StrictMode double-init by removing the `initialized.current = false` reset in cleanup. See AGENTS.md "Gotchas" for the current rules.

## 9. Original brief (for reference)

The full design direction lived in earlier planning turns. The TL;DR:

- Editorial, Awwwards-style, dark, monochrome with single acid-lime accent
- Oversized Fraunces, mono tags, scroll as choreography
- Work section as an interactive archive (the visual signature)
- Only what's verified; no fabrication
- GSAP for scroll-driven, Motion for component-level, Lenis for smoothness
- `prefers-reduced-motion` respected everywhere
- Performance: transform/opacity only, dynamic imports for heavy sections, no layout-prop animation
- Recruiter-friendly: legible, fast, accessible, mobile-tested

---

**If you're the next session**: read `AGENTS.md` for the code-level rules, read this file for the why, and if the user asks for changes, prefer modifying `data/*.ts` over touching components — the data layer is intentionally the single source of truth for content, and the components are designed to render whatever shape the data has, including the missing-asset fallback.
