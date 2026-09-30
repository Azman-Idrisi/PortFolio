# Future Scope

Animations and features that were proposed but not yet built. Already shipped (don't re-add): SplitText line reveals (`useSplitReveal`), ScrambleText labels and row meta (`lib/scramble.ts`), the project hover preview that flies into the drawer (`ProjectPreview`), the scroll thread with lamps (`ScrollLine`), and the hero parallax forest (`HeroForest`).

Tried and rejected — don't bring back: the per-element `data-parallax` system and the scroll-driven black hole.

All GSAP plugins are free (including commercial use) and ship in the `gsap` package already installed, so most items below need no new dependency.

---

## Animations

### 1. Clip-path wipes on project thumbnails
Reveal each drawer thumbnail with an `inset()` or angled `polygon()` clip-path wipe instead of a fade. Same technique the scroll thread already uses.
- **Where:** `ProjectDrawer` thumbnail. Must coordinate with `ProjectPreview`, which hides the real thumbnail during the flight and reveals it on landing — the wipe should only play when the drawer opens without a flight (touch, reduced pointer, WalletMate auto-open).
- **Effort:** low
- **Source:** [Codrops — From Shader Uniforms to Clip-Path Wipes](https://tympanus.net/codrops/2026/05/06/from-shader-uniforms-to-clip-path-wipes-how-gsap-drives-my-portfolio/)

### 2. SVG mask transitions on scroll
Full-width image revealed through a grid or blinds pattern as a section scrolls in. Good fit as a visual break between Work and Practice.
- **Effort:** medium
- **Source:** [Codrops — SVG Mask Transitions on Scroll with GSAP and ScrollTrigger](https://tympanus.net/codrops/2026/03/11/svg-mask-transitions-on-scroll-with-gsap-and-scrolltrigger/)

### 3. Dual-wave text
Two columns of words moving along opposing sine waves as the page scrolls. Candidate to replace the flat `HeroMarquee`, or as the Contact call-to-action.
- **Effort:** medium
- **Source:** [Codrops — Building a Scroll-Driven Dual-Wave Text Animation with GSAP](https://tympanus.net/codrops/2026/01/15/building-a-scroll-driven-dual-wave-text-animation-with-gsap/)

### 4. CSS scroll-driven micro-animations
Move small, purely decorative effects (divider lines drawing in, tag fades) to native `animation-timeline: view()` so they run off the main thread. Keep GSAP for pinning, scrubbing and timelines. Guard with `@supports (animation-timeline: view())`; ~84% global support.
- **Effort:** low
- **Sources:** [MDN — CSS scroll-driven animations](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll-driven_animations), [Josh W. Comeau — Scroll-Driven Animations](https://www.joshwcomeau.com/animation/scroll-driven-animations/)

### 5. Hero text scroll-out
As the hero leaves the viewport, move the text block as one layer (`y: -60`, `opacity` → 0.4, scrubbed) so it reads as an exit rather than a drift. Put the tween on a wrapper, not on the `[data-hero-anim]` children (they already tween `y`), and create it only after the `ma:loader:reveal` event.
- **Effort:** low

### 6. Firefly particles
Give the accent-coloured hero particles a slow, randomised blink so they read as fireflies over the forest. A tweak to `CFG` / the draw loop in `HeroParticles`.
- **Effort:** low

### 7. WebGL hover distortion on thumbnails (OGL)
Liquid flowmap distortion driven by cursor position and velocity. OGL is ~8KB. Heavy relative to the rest of the site — only worth it if it replaces, rather than stacks on, the existing hover preview.
- **Effort:** high
- **Sources:** [Codrops — Mouse Flowmap Deformation with OGL](https://tympanus.net/codrops/2019/09/25/mouse-flowmap-deformation-with-ogl/), [Codrops — OGL tag](https://tympanus.net/codrops/tag/ogl/)

### 8. Copy-in components (React Bits)
Source-copied (no package dependency) text effects, backgrounds and micro-interactions. Candidates: Shiny Text, Magnet Lines, Scroll Velocity. Pick one or two at most to keep the site coherent.
- **Effort:** low per component
- **Sources:** [reactbits.dev](https://reactbits.dev/), [GitHub — DavidHDev/react-bits](https://github.com/DavidHDev/react-bits)

---

## Features

### 9. Case-study pages + native page transitions
`/work/[slug]` pages with a full write-up per project. Morph the thumbnail into the page header with the View Transitions API (React's `<ViewTransition>` is still experimental — fall back to plain CSS view transitions). Pairs with the existing `?project=<slug>` deep link.
- **Effort:** high
- **Sources:** [Next.js — View transitions guide](https://nextjs.org/docs/app/guides/view-transitions), [next-view-transitions (npm)](https://www.npmjs.com/package/next-view-transitions)

### 10. Generated Open Graph image
`app/opengraph-image.tsx` — branded share card (name, role, accent) for links on LinkedIn, X, Slack.
- **Effort:** low

### 11. `app/sitemap.ts` and `app/robots.ts`
Basic crawlability. Include `/work/[slug]` if case-study pages land.
- **Effort:** low

### 12. JSON-LD `Person` schema
Structured data in `app/layout.tsx` (name, job title, `sameAs` social links) for better search presence.
- **Effort:** low

### 13. GitHub links for the full-stack projects
Add `githubUrl` for Job Scheduler, Driver, Resumix and Password Manager in `data/projects.ts` once the repos are public — the drawer renders the `Source ↗` button automatically.
- **Effort:** trivial (content)

### 14. Housekeeping
- Bump `tsconfig.json` `target` from `ES2017` to `ES2020`.
- Check the hero forest and scroll thread at phone width (only verified on desktop so far).
