import { gsap } from "gsap";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrambleTextPlugin);
}

/** Glyphs cycled while text decodes — mono-label friendly, matches the preloader. */
export const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/_#";

/** Decode `el` into `text`. Longer strings take a little longer, capped. */
export function scramble(el: HTMLElement, text: string, vars: gsap.TweenVars = {}) {
  return gsap.to(el, {
    duration: Math.min(1.1, 0.35 + text.length * 0.035),
    ease: "none",
    overwrite: true,
    scrambleText: { text, chars: SCRAMBLE_CHARS, speed: 0.7 },
    ...vars,
  });
}
