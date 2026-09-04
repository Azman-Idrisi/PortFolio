# Portfolio — Landing Intro Context

The sstr-style 2×2 grid preloader that plays on every page load of Mohammad Azman's portfolio.

## Language

**Brand cell**:
The top-left quadrant of the landing grid — a dark (ink) panel carrying the `// MA` wordmark and a `// PLEASE WAIT` / `// LOADING…` status block.
_Avoid_: header cell, logo cell

**Pattern cell**:
The top-right quadrant — a cream panel that hosts the progress counter (`0% → 100%`) and a blinking square. Fill width is driven by the `--preloader-load` CSS custom property.
_Avoid_: counter cell, progress cell

**Annotation card**:
The two bottom quadrants of the landing grid, each anchored by a mono-cased status label (`// INITIALIZING…`, `// CALIBRATING…`) and a small geometric mark.
_Avoid_: status card, info card

**Fill curve**:
The 51-point hand-tuned table (`LOAD_POINTS`) that maps elapsed time to displayed percent, faking real network load — 50% at half-time, 79% at 70%, asymptote to 100% late.
_Avoid_: easing, linear fill

**Reveal overlay**:
A solid cream panel that begins life sized to the pattern cell, then squeezes left to cover the brand cell, expands down to cover the full viewport, and rises (`yPercent: -100`) to expose the portfolio underneath.
_Avoid_: curtain, exit panel

**Reveal sequence**:
The four-stage choreography of the overlay: squeeze (1.4s) → card drop (0.5s + 0.1s stagger) → overlay expand down (0.9s) → settle (0.4s) → rise (1.4s).
_Avoid_: exit animation, transition

**Failsafe**:
The forced-resolution timer (sequence length + 4s) that kills in-flight tweens and unmounts the overlay if the sequence stalls (StrictMode, hot reload, killed tweens).
_Avoid_: timeout, fallback

---

# Hero Section Context

The dark editorial hero that the landing intro hands off to. Previously pure ink with a 5% ghost `MA`; now anchored by a particle constellation canvas and a loader-driven atomic reveal.

## Language

**Ambient field**:
The persistent particle layer behind the hero — ~110 dim paper dots (1-2.5px, 12-35% alpha) with ~6% accent-tinted, joined by faint connecting lines under 110px (alpha by distance, max 14%). Drifts on scroll, gently repels from cursor on pointer:fine.
_Avoid_: background, stars

**Reveal ring**:
The ~90-particle expanding ring that emerges from screen center when the loader begins to rise. Radius grows to 1.5× the viewport diagonal over 1.2s (cctpOut-mirrored curve), then each ring particle lerps to a pre-assigned ambient slot over 0.9s and merges into the ambient field. Rides the circular clip-path wipe on the hero content.
_Avoid_: explosion, particles, atom

**Reveal event**:
The `ma:loader:reveal` `window` `CustomEvent` fired by `LandingIntro` at the start of the rise tween. Single resolution point — natural path and failsafe path both dispatch (dedupe via `revealDispatchedRef`). `HeroParticles` and `Hero` listen and play their reveals concurrently. Replaces the previous "play on mount under overlay" pattern.
_Avoid_: signal, callback, mount event

**Content clip**:
The `circle(0% → 150% at 50% 50%)` clip-path tween applied to the hero content wrapper. Starts at 0 (invisible), animates to 150% (fully visible) over 1.1s `expo.out` after the reveal event. The particle canvas sits behind, unclipped, so the ring edge stays visible.
_Avoid_: wipe, mask, curtain

**Edge fade**:
The top+bottom CSS `mask-image` linear-gradient on `.hero-canvas` so particles dissolve before the next section. Borrowed from the Osmo `.parallax__fade` lesson (its `.parallax__layers` are stacked images moving at different yPercent speeds on scroll; we keep the motion logic + fade mask, not the image markup).
_Avoid_: gradient overlay, vignette

**Constellation**:
The visual identity of the ambient field — sparse, low-contrast, geometry-forward. The first impression when the hero reveals: ink + paper + accent dots, faintly linked. Stays quiet after the reveal so the headline carries the hierarchy.
_Avoid_: noise, glitch, gradient mesh
