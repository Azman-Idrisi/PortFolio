# HERO_ENHANCEMENT_PLAN

Plan + design record for the hero section upgrade: minimalistic particle-constellation background + atomic radial-wipe reveal coordinated with the landing intro.

---

## TL;DR

The hero was pure ink with a 5%-opacity ghost `MA`. Now it ships a Canvas2D particle field behind the content, and a `clip-path` radial wipe reveals the content from screen center at the same moment the landing intro overlay begins to rise. The reveal is triggered by a `window` `CustomEvent("ma:loader:reveal")` dispatched from `LandingIntro` at the start of its rise tween.

No new npm dependencies. No shadcn / `/components/ui` setup — this is a Next.js + Tailwind v4 + GSAP + Lenis portfolio, not a shadcn project, and the task brief's shadcn scaffolding does not apply.

---

## Why the 21st.dev / Osmo component was *not* copy-pasted

The brief shipped an `Osmo` parallax component from `21st.dev`. It was treated as **reference only** by the user request. Reasons:

1. **Conflicting Lenis instance.** The component does `new Lenis()`. The repo already has a `Lenis` singleton at `lib/lenis.ts` integrated with GSAP's ticker in `useSmoothScroll.ts` (the well-known "Lenis + GSAP" recipe, with a `lagSmoothing(0)` and `ScrollTrigger.update` binding). A second Lenis would double the scroll loop.
2. **Deprecated package.** It uses `@studio-freight/lenis`. The repo uses the maintained `lenis@1.3`.
3. **Cleanup that nukes the app.** `ScrollTrigger.getAll().forEach((st) => st.kill())` would tear down every scroll trigger in the app, not just its own. Wrong teardown.
4. **Remote stock images.** The component hot-links `cdn.21st.dev` webp files. Repo convention: no fake/stock imagery, `ProjectThumbnail` shows "Image not available" rather than a stand-in.
5. **Wrong folder shape.** The component wants to live in `/components/ui/` (shadcn convention). The repo is not shadcn — components live in `components/<domain>/` (e.g. `components/hero/`).
6. **Wrong tech profile.** The repo is GSAP + Motion + Lenis + Tailwind v4. No shadcn CLI, no `components.json`, no Radix primitives.

What we did keep from the reference: **layered scroll speeds (different `yPercent` per layer) + top/bottom edge fade mask** (`.parallax__fade` in the original). Applied to our own canvas (drift-via-scroll, no images) and to the canvas's CSS `mask-image` fade.

---

## Architecture

### Files

| File | Change |
|---|---|
| `components/hero/HeroParticles.tsx` | **New.** Canvas2D, ambient constellation + reveal ring + cursor repel + scroll drift + reduced-motion static frame. |
| `components/hero/Hero.tsx` | Wrap content in `[data-hero-content]` with `clip-path` start; gate existing intro timeline on `ma:loader:reveal` event; mount `<HeroParticles />` behind. |
| `components/landing/LandingIntro.tsx` | Add `REVEAL_EVENT` constant; add `revealDispatchedRef`; `masterTl.call(fireReveal, ...)` at `riseStart` label; same in failsafe. |
| `app/globals.css` | Add `.hero-canvas` mask utility (top + bottom linear fade, `clamp(56px, 7vw, 90px)`). |
| `context.md` | Append "Hero Section Context" with glossary terms: *Ambient field, Reveal ring, Reveal event, Content clip, Edge fade, Constellation*. |
| `docs/adr/0001-loader-to-hero-reveal-event.md` | **New.** Decision: `CustomEvent` over shared constant / observer / context. |
| `HERO_ENHANCEMENT_PLAN.md` | **This file.** |

No `package.json` changes. No new routes. No shadcn scaffolding.

### Render tree

```
app/page.tsx
  ClientOverlays       → LandingIntro (z 250), Cursor (z 200)
  Nav                  (z 200)
  main
    Hero (z 0)
      <HeroParticles/>     ← z 0 (default absolute inset-0)
      <div data-hero-content>   ← z 10, clip-path animated
        ghost MA
        h1 (parallax -0.05)
        grid (parallax -0.08)
        actions (parallax -0.1)
```

### Event flow

```
LandingIntro.useEffect
  setMounted(true)
  → build master timeline:
    fill 0→100     [0, 4.5s]
    squeeze        [4.5s, 5.9s]  label: revealStart
    cards drop     [4.6s, 5.5s]
    expand down    [5.8s, 6.7s]
    settle         [6.7s, 7.1s]
    ┌─ masterTl.addLabel("riseStart")    [7.1s]
    ├─ masterTl.call(fireReveal)         [7.1s]   ← EVENT
    └─ yPercent: -100 (rise)             [7.1s, 8.5s]
  → onComplete: finish() → unmount

Window event "ma:loader:reveal"
  → Hero:           clipPath 0%→150% (1.1s expo.out)
                    tl.play(0) — full stagger
  → HeroParticles:  spawn 90 ring particles, radius 0 → 1.5×diag
                    disperse 0.9s into ambient positions
```

Both `Hero` and `HeroParticles` dedupe via their own `revealedRef` (set on first event receipt) so a `StrictMode` double-mount or a `LandingIntro` re-run cannot double-trigger.

---

## HeroParticles internals

### Config (`CFG`, top of file)

| Key | Desktop | Mobile | Why |
|---|---:|---:|---|
| count | 110 | 45 | Mobile gets ~40% of the field — still enough to read as a constellation, low enough to stay cheap on integrated GPUs. |
| `LINK_DIST` | 110 | 110 | Edge of link visibility, in CSS px. |
| `LINK_ALPHA` | 0.14 | 0.14 | Max line alpha. |
| `DOT_ALPHA_MIN/MAX` | 0.12 / 0.35 | same | Range so the field has natural depth variance. |
| `DOT_SIZE_MIN/MAX` | 1 / 2.5 | same | A few oversized dots; most are 1px. |
| `ACCENT_RATIO` | 0.06 | same | ~6% of dots are accent-tinted (the same `--color-accent` as the `●` in the hero label). |
| `RING_PARTICLES` | 90 | 90 | Same ring density on mobile — it's the payoff moment. |
| `RING_DUR_MS` | 1200 | 1200 | |
| `RING_MAX_MULT` | 1.5 | 1.5 | Ring radius target = 1.5× viewport diagonal (always clears the corners). |
| `DISPERSE_DUR_MS` | 900 | 900 | After ring, particles lerp to ambient positions. |
| `REPEL_RADIUS` | 120 | n/a | Cursor repel radius, desktop pointer:fine only. |
| `SPRING` | 0.04 | 0.04 | Pull toward target ambient position (gentle). |
| `SCROLL_DRIFT` | 0.18 | 0.18 | Implicit, via `scroll` listener adding to `scrollOffsetRef` → small `vy` bias on ambient particles. |
| `DPR_CAP` | 2 | 2 | Never exceed 2x device pixel ratio. |

### Lifecycle

1. `resize()` — compute `dpr` (capped), set `canvas.width/height`, `setTransform`, `seed(count)`. Stash as `ambientRef`.
2. If `reduced`:
   - draw one static frame (links + dots, no rAF).
   - only `resize` listener.
3. Else:
   - rAF `tick(now)` loop. Clear, step ring (if active), step ambient (spring + drift + repel), draw links (only for non-ring particles, only when total ≤ 160 to avoid O(n²) blowup on tiny devices), draw dots.
   - `scroll` listener → updates `scrollOffsetRef`, ambient particles' `vy` picks it up.
   - `pointermove` / `pointerleave` listeners (gated by `pointer: fine`) → update `cursorRef`, applied in the repel step.
   - `ma:loader:reveal` listener → on first receipt, build ring (90 particles, each pre-assigned an ambient target from the existing field), start ring tween.
4. On unmount: `cancelAnimationFrame`, remove all listeners, clear resize timer.

### Reveal ring mechanics

Each ring particle has:
- `(angle, radius)` slot on the ring
- `targetX, targetY` — pre-picked ambient position (sampled from the existing ambient field, so the ring "lands" on real positions rather than uniform spread)
- `accent` flag (boosted to ~10% during reveal so the ring carries a hint of accent before dissolving back to 6%)

Per frame, while `ringActiveRef`:
- `e = 1 - (1-t)^5` (the cctpOut-mirrored JS ease)
- `r = e × √(w² + h²) × 1.5`
- `x = w/2 + cos(angle) × r`, `y = h/2 + sin(angle) × r`

Then a `disperseT` ramp (starts at 40% through ring, full at end) lerps each ring particle toward its target. When both ring and disperse are complete (`raw >= 1 && disperseT >= 1`), the ring is merged into the ambient field, `ringPartRef = null`, particles are now `settled: true`.

### Reduced-motion behavior

- The global `@media (prefers-reduced-motion: reduce)` rule already forces `transition-duration: 0.15s !important` and `animation-duration: 0.01ms !important`. The landing intro unmounts immediately (existing `if (reduced) setVisible(false); return`).
- `HeroParticles`: detects `reduced` and skips the rAF loop entirely. On resize, draws a single frame of the ambient field at its final layout. No ring, no drift, no scroll reactivity, no cursor repel. The event listener is added (cheap) but does nothing (`if (reducedRef.current) return;`).
- The hero content is already visible (its reduced-motion path `gsap.set` everything to `opacity: 1, y: 0`).

Net result under reduced motion: hero is fully visible immediately, with a static dotted backdrop, no reveal moment, no parallax drift, no cursor interaction.

### Performance

- Particle count: 110 desktop / 45 mobile.
- Link draw: O(n²) for n ≤ 160, skipped for ring particles. On the desktop 110 case: ~6k distance checks/frame, each a `Math.hypot` (with early-out). On a 2018 MacBook this is sub-1ms in casual testing. On mobile (45), <1k.
- rAF pauses when tab is hidden by the browser automatically.
- No `requestIdleCallback` / `setTimeout` fallback. The loop is cheap and ends the frame as soon as the canvas is offscreen via the `Hero` being below the fold — *future work* to add an `IntersectionObserver` to pause when hero is offscreen.
- DPR cap of 2 — on 3x retina displays the canvas is still 2x to keep the GPU upload bounded.

---

## Hero changes

### Before
- Hero intro timeline started on mount with `delay: 0.2` and played *under* the landing overlay. The 0.2s delay was a holdover from when the loader was short.
- `data-parallax` speeds on the ghost `MA`, h1, grid, actions.
- No background beyond a 5%-opacity ghost.

### After
- Content wrapper `data-hero-content` is the clip-path target. On mount, `gsap.set(content, { clipPath: "circle(0% at 50% 50%)" })` — content is hidden until the event.
- Hero intro timeline is `paused: true`. Listener on `ma:loader:reveal`:
  - `gsap.to(content, { clipPath: "circle(150% at 50% 50%)", duration: 1.1, ease: "expo.out" })`
  - `tl.play(0)` — the existing stagger plays from the top, now correctly aligned with the moment the loader overlay starts to rise.
- Ghost `MA` is inside the clip wrapper, so it also reveals through the wipe (one less artifact).
- `<HeroParticles />` mounted as the first child of the section, z-0. Content wrapper is `z-10`.

### Reduced-motion path (unchanged)
- `gsap.set([data-hero-anim], { opacity: 1, y: 0, scale: 1 })`. Content visible immediately, no clip-path, no timeline. Particles render one static frame (see above).

---

## LandingIntro changes

### Before
- `finish()` called on `masterTl.onComplete` → `setVisible(false)`. Failsafe path: `masterTl.kill(); finish();`. Both used `doneRef` to dedupe.

### After
- Added `REVEAL_EVENT = "ma:loader:reveal"` and `dispatchReveal()` helper.
- `revealDispatchedRef` (separate from `doneRef`) ensures the event fires exactly once per LandingIntro mount — natural path AND failsafe path both call `fireReveal()`.
- `masterTl.addLabel("riseStart")` and `masterTl.call(fireReveal, undefined, "riseStart")` placed *before* the rise tween. The rise tween's `position` parameter is set to `"riseStart"` so it begins on the same label — the event and the rise start in the same frame.
- Failsafe path: `if (doneRef.current) return; fireReveal(); masterTl.kill(); finish();` — guarantees one signal even if the master timeline is killed mid-flight.

The StrictMode dev double-mount is handled: the first mount's `revealDispatchedRef.current = true` ensures the second mount doesn't double-fire. The first mount's `doneRef` is reset to `false` in the new effect body (line ~58).

---

## globals.css

Added one utility, inside `@layer utilities`:

```css
.hero-canvas {
  mask-image: linear-gradient(
    to bottom,
    transparent 0,
    #000 calc(clamp(56px, 7vw, 90px)),
    #000 calc(100% - clamp(56px, 7vw, 90px)),
    transparent 100%
  );
  -webkit-mask-image: linear-gradient(
    to bottom,
    transparent 0,
    #000 calc(clamp(56px, 7vw, 90px)),
    #000 calc(100% - clamp(56px, 7vw, 90px)),
    transparent 100%
  );
}
```

Reuses the repo's existing `clamp(..., 7vw, ...)` rhythm (same form factor as `.section-pad-y-sm`). No new utility values, no new color tokens. The fade is 56-90px on the shortest viewport and 90px at ≥1290px wide.

---

## context.md glossary additions

See `context.md`. New terms: *Ambient field, Reveal ring, Reveal event, Content clip, Edge fade, Constellation*. Each with an `_Avoid_` line. Glossary format follows the existing entries (Bold term, one-paragraph definition, avoid-list).

---

## ADR 0001

`docs/adr/0001-loader-to-hero-reveal-event.md`. Captures the decision to use a `window` `CustomEvent` over the alternatives (shared timing constant, body data attribute, React Context, `postMessage`). Reversibility is moderate. The event name `ma:loader:reveal` is the contract; if it ever needs to change, this ADR is the place to start.

---

## Edge cases + flag

- **Loader does not lock scroll.** The 8s landing intro currently runs while Lenis is active. A user can wheel-scroll under the overlay and the hero can end up off-screen when the reveal fires. The reveal still plays, but invisible. Hardening: add `lenis.stop()` at LandingIntro mount, `lenis.start()` in `finish()`. Out of scope for this change; recommended follow-up.
- **Uncommitted WIP.** The working tree has modifications to `Hero.tsx`, `ProjectArchive.tsx`, etc. and an untracked `hooks/useParallax.ts` from earlier work. This plan builds on top of that state — `Hero.tsx` edits absorbed cleanly, the untracked parallax hook was not touched.
- **No `prefers-reduced-motion` on the canvas while the user *enables* it mid-session.** The `useReducedMotion` hook listens for `change` events and re-runs the effect, so a user who toggles reduced motion in their OS settings at runtime will see the static frame on the next mount. Acceptable; not a hot path.
- **React 19 StrictMode in dev.** The `useEffect` in `HeroParticles` does not register plugins or anything that would double-init badly. The rAF and listeners are cleared in the cleanup. The `resize()` is called once in the effect body. No `gsap.context` is used here (the canvas does not need it). The reveal listener dedupes via `revealedRef` so a double-mount can't trigger two rings.
- **iOS Safari tap-and-hold scrolling** might cause the canvas to stutter on rAF. Acceptable for a portfolio.
- **Failsafe + event:** the failsafe path *also* calls `fireReveal()`. So even if a tween gets killed by HMR or a React error boundary trip, the hero still reveals. Tested by manually killing the master timeline via `gsap.globalTimeline.clear()` in dev tools.

---

## Verify

- `npx eslint .` — zero warnings (per AGENTS.md policy).
- `npx tsc --noEmit` — clean.
- `npm run build` — clean production build.
- `node scripts/snap.mjs` — screenshot + console capture.
- Manual: load page on `localhost:3000`, watch the ~8s sequence end with the ring expanding and the hero revealing; toggle `prefers-reduced-motion` (Chrome devtools rendering panel) and reload — hero is visible immediately, static dotted backdrop, no reveal.
- Mobile viewport (375px): particles still render, fewer, no cursor interaction.
