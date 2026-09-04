# LandingIntro — 100% Transition Feels Static: Diagnosis & Proposed Fix

## Symptom

The loader counts up, reaches 100%, and then the reveal reads as a frozen/hard-cut
sequence rather than a fluid transition: the counter becomes unreadable well
before 100%, the screen flashes from a dark cell to a flat cream panel in a
single frame, and the squeeze/rise motion feels stiff.

## Root causes (ranked)

### 1. The ink fill swallows the counter — PRIMARY BUG

`app/globals.css`:

```css
.landing-hero .preloader__fill {
  ...
  background-color: var(--color-ink);   /* <-- dark fill */
}
```

The fill sweeps left-to-right across the pattern cell as `--preloader-load`
ramps 0 → 1. The progress cluster (`.preloader__square` uses `currentColor`,
the `0%`–`100%` text inherits `--color-ink`) is **ink on top of an ink fill**.
The cluster sits at the horizontal center of the cell, so from ~50% load onward
the fill edge passes under the text and the counter + blinking square become
invisible. By 100% the entire cell is a blank dark block — the user never
actually sees "100%" land.

sstr's original never has this problem because its fill background is the
**same color as the cell** (invisible fill, `#2f3032` on `#2f3032`). Progress
is communicated purely by the % text, which stays readable the whole time.

### 2. One-frame hard cut: dark cell → flat cream overlay

At `revealStart` (LandingIntro.tsx:151-152) two zero-duration sets fire in the
same frame:

```ts
masterTl.set(overlayEl, { display: "flex" }, "revealStart");
masterTl.set(patternCell, { autoAlpha: 0 }, "revealStart");
```

Frame N: fully-dark pattern cell with invisible counter.
Frame N+1: pattern cell gone, flat cream overlay with "READY" in its place.

Because the fill made the cell 100% ink at that moment, this is a **black →
cream hard cut**. In sstr this same swap is imperceptible — their overlay is a
visual **clone** of the pattern cell (`.preloader__overlay-fill`, same bg +
same cross pattern via the same SVG data-URI). Cell hides, identical-looking
overlay appears, then the overlay grows. No visible cut.

My implementation dropped `.preloader__overlay-fill` during the port, so the
overlay is a plain `--color-paper` panel — visually a different object than
what it replaces.

### 3. Wrong ease: `power3.inOut` vs sstr's `cctpOut`

Every reveal tween (squeeze, card drop, expand, rise) uses `power3.inOut` — a
symmetric, slow-in/slow-out curve. sstr uses a single custom ease everywhere:

```js
CustomEase.create("cctpOut", "0.625, 0.05, 0, 1");
```

That curve launches fast, then glides out for a long settle. It is the main
reason sstr's reveal feels decisive while ours feels mushy. GSAP 3.13+ ships
all plugins (including CustomEase) free in the public package; the project is
on `gsap ^3.15.0`, so `gsap/CustomEase` is already importable. No new
dependency needed.

### 4. Layout-property animation (secondary)

The squeeze/expand animate `left`/`width`/`top`/`height` — layout + paint
every frame, never GPU-composited. sstr does the same thing and gets away with
it because the ease carries the motion. After Fix 3 the stiffness is mostly
gone; a `clip-path: inset()` conversion is possible but changes the label
choreography (see "Optional" below), so it is not recommended.

### 5. The 0.4s settle reads as a dead frame

`masterTl.to({}, { duration: CFG.SETTLE_DUR })` holds on a flat cream panel
where only the CSS square-blink is alive. With a patterned clone overlay
(Fix 2) and the cctpOut ease (Fix 3), this beat becomes intentional — sstr
keeps it deliberately. No change needed once 1–3 land.

## Proposed fix

### Fix 1 — make the fill invisible (sstr-faithful)

`app/globals.css`, `.landing-hero .preloader__fill`:

```css
background-color: var(--color-paper);  /* was var(--color-ink) */
```

Keep the cross-pattern background-image (paper-colored crosses on paper are
subtle but present, matching the cell's own texture). Result: the cell stays
cream, the ink counter + square are legible 0% → 100%, exactly like sstr.
Progress reads through the % text alone — that is by design.

### Fix 2 — restore the overlay as a clone of the pattern cell

**CSS** — add back inside the `.landing-*` block:

```css
.landing-hero .preloader__overlay-fill {
  position: absolute;
  inset: 0;
  background-color: var(--color-paper);
  background-image: url("data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M4 7h8v1H4zM7 4h1v8H7z' fill='%230a0a0b' fill-opacity='0.05'/%3E%3C/svg%3E");
  background-repeat: repeat;
  background-size: 16px 16px;
  pointer-events: none;
}
```

(Same tile as `.preloader__cell`, so overlay and cells are one continuous
surface while the overlay grows.)

**JSX** — inside `.preloader__overlay`, before the progress cluster:

```tsx
<div className="preloader__overlay-fill" />
```

And give the overlay's progress a `position: relative; z-index: 2` (it already
has it via `.preloader__progress`) so it paints above the fill.

With this, the `display:none → flex` + `autoAlpha: 0` swap at `revealStart`
stays in the code (it is how sstr does it) but becomes visually seamless:
the overlay appears looking exactly like the cell it replaces, then squeezes.

### Fix 3 — register `cctpOut` and use it across the reveal

`components/landing/LandingIntro.tsx`:

```ts
import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(CustomEase);
CustomEase.create("cctpOut", "0.625, 0.05, 0, 1");
```

Then swap every reveal-tween ease from `"power3.inOut"` to `"cctpOut"`:

- overlay squeeze (`left`/`width`)
- card drop (`y`/`autoAlpha` + stagger)
- overlay expand (`top`/`height`)
- rise (`yPercent: -100`)

sstr uses `cctpOut` for all four plus fallback `"power3.out"` when the plugin
is unavailable; a small `ez()` helper mirroring that guard is optional.

### Optional (not recommended for v1)

- **clip-path variant of squeeze/expand**: overlay pinned `inset: 0` from the
  start, squeeze = `clip-path: inset(0% 0% 50% 50%) → inset(0% 0% 50% 0%)`,
  expand = `→ inset(0% 0% 0% 0%)`. Paint-only, compositor-friendly. Downside:
  the centered READY label sits at viewport center and gets clipped away
  until the expand passes vertical center — different choreography from
  sstr, where the label rides the growing box.
- **Shorten SETTLE_DUR to 0.25s**: only if the beat still feels dead after
  Fixes 1–3.

## Files touched

| File | Change |
|---|---|
| `app/globals.css` | `.preloader__fill` bg → paper; add `.preloader__overlay-fill` rule |
| `components/landing/LandingIntro.tsx` | import + register CustomEase, create `cctpOut`, swap 4 eases, add overlay-fill div |
| `AGENTS.md` | note the cctpOut ease + overlay-clone convention in the LandingIntro bullet |

## Verification

```
npx tsc --noEmit
npx eslint .
npm run build
```

Manual smoke (after `npm run dev` + hard refresh):

1. Counter + square legible for the entire 0–100% run (no dark sweep, no vanishing text)
2. At 100%: no black→cream flash — the pattern cell hands off seamlessly to the overlay clone
3. Squeeze launches decisively and glides (fast start, long settle) instead of symmetric mush
4. Card drop + expand + rise all share the same motion character
5. Reduced-motion still unmounts instantly; mobile (≤767px) still single-cell
