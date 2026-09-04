# 0001 — Loader→Hero reveal handoff via `window` CustomEvent

## Status
Accepted.

## Context
The landing intro (`components/landing/LandingIntro.tsx`) plays an ~8s sequence and then needs to signal the hero (`components/hero/Hero.tsx`) that the reveal moment has arrived. Before this decision, the hero's intro timeline started on mount and played *underneath* the 8s overlay — wasted motion, wrong timing, no coordination if the user scrolled during the loader.

The two trees (`LandingIntro` in `ClientOverlays` and `Hero` in `app/page.tsx`) are siblings — there is no parent component to thread state through without restructuring `app/page.tsx`.

## Decision
`LandingIntro` dispatches a single `window` `CustomEvent("ma:loader:reveal")` at the **start of the rise tween** (the `riseStart` label in the master timeline, just before the overlay begins to slide up). `Hero` and `HeroParticles` each add a `window` listener on mount and trigger their reveals on the event.

The event is also dispatched from the failsafe path (`FAILSAFE_MS` timeout) so both natural and stalled sequences produce exactly one signal — a `revealDispatchedRef` dedupes.

## Alternatives considered
- **Shared timing constant** (export `REAL_TOTAL` from `LandingIntro`, `Hero` uses it as its timeline delay). Simple, but it desyncs when the loader is mid-flight, when StrictMode restarts the timeline in dev, and when the failsafe fires early. Fragile coupling on a value that already drifted once.
- **State via DOM attribute** (LandingIntro sets `data-revealed="true"` on `<html>`, hero observes with `MutationObserver`). More wiring than the event, no benefit, harder to reason about.
- **React Context provider** in `app/page.tsx`. Cleanest, but adds a render-tree level just to pass one boolean and forces both components to live under the same provider. Two siblings that should stay siblings shouldn't share a parent for one signal.
- **`postMessage` to `window`**. Equivalent to `CustomEvent` here but adds the cross-origin / origin-check baggage for no gain — same-origin only.

## Consequences
- `Hero` mounts in the same paint as before but the intro timeline is `paused: true` until the event fires. The hero content is clipped to `circle(0% at 50% 50%)` until reveal.
- `HeroParticles` also waits for the event to spawn the reveal ring, but renders the ambient field immediately (the field is the living background; it does not need a "start" moment).
- Under `prefers-reduced-motion` the landing intro unmounts immediately and never fires the event. The hero is already visible by its reduced-motion path; `HeroParticles` renders one static frame.
- `revealDispatchedRef` makes the event a one-shot per LandingIntro mount, so StrictMode double-mount in dev does not double-fire. `Hero`'s `revealedRef` is the matching dedupe on the receive side.
- Event name is a contract. `docs/adr/0001` is the place to change it; `HeroParticles` and `Hero` both reference the same constant (`REVEAL_EVENT`) in their own files. A future refactor could move it to a shared `lib/events.ts` if a third subscriber appears.

## Reversibility
Moderate. The event name `ma:loader:reveal` and its payload (none) are a small surface. A future change to e.g. an `IntersectionObserver`-driven reveal would mean removing the listener from both `Hero` and `HeroParticles` and reverting the clip-path wrapper. Cost is bounded to the hero subtree.
