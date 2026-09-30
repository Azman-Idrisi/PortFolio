// Generates the hero's parallax forest layers as SVG silhouettes.
// Run: node scripts/gen-forest.mjs  →  public/assets/hero/forest-*.svg
// Deterministic (seeded), so re-running produces identical files. Tweak the
// LAYERS table and re-run to reshape the forest.

import { mkdirSync, writeFileSync } from "node:fs";

const W = 2400;
const H = 1000;
const OUT = "public/assets/hero";

// Farther layers are lighter and hazier (atmospheric perspective).
const LAYERS = [
  {
    name: "far",
    seed: 11,
    color: "#14261e",
    mist: "#1f382d",
    base: 700,
    hillAmp: 40,
    height: [60, 130],
    width: [0.3, 0.4],
    gap: [18, 38],
  },
  {
    name: "mid",
    seed: 23,
    color: "#0e1c15",
    mist: "#172d23",
    base: 800,
    hillAmp: 45,
    height: [120, 240],
    width: [0.3, 0.38],
    gap: [40, 80],
  },
  {
    name: "near",
    seed: 37,
    color: "#09140f",
    mist: "#11231a",
    base: 900,
    hillAmp: 30,
    height: [200, 380],
    width: [0.28, 0.36],
    gap: [95, 170],
  },
  {
    // Framing trees at the edges only — the centre stays clear for the h1.
    name: "front",
    seed: 53,
    color: "#050b08",
    mist: null,
    base: 965,
    hillAmp: 18,
    height: [720, 1050],
    width: [0.26, 0.32],
    gap: [70, 150],
    edgesOnly: 0.13,
  },
];

function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const r1 = (n) => Math.round(n * 10) / 10;
const lerp = (a, b, t) => a + (b - a) * t;

// Rolling ground line: two sine waves with random phase.
function hill(layer, rand) {
  const p1 = rand() * Math.PI * 2;
  const p2 = rand() * Math.PI * 2;
  return (x) =>
    layer.base +
    layer.hillAmp * (0.65 * Math.sin((x / W) * Math.PI * 2.2 + p1) + 0.35 * Math.sin((x / W) * Math.PI * 5.3 + p2));
}

// One pine: stacked drooping tiers with ragged needle edges, plus a trunk.
function pine(x, base, h, w, rand) {
  const tiers = Math.round(lerp(5, 9, rand()) * Math.min(1, 0.6 + h / 600));
  const top = base - h;
  const crown = h * 0.9;
  const step = crown / tiers;
  const trunk = Math.max(1.5, w * 0.05);

  const side = (dir) => {
    const pts = [];
    for (let i = 0; i < tiers; i++) {
      const t = (i + 1) / tiers;
      const y = top + crown * t;
      const half = (w / 2) * (0.22 + 0.78 * t) * lerp(0.8, 1.15, rand());
      const innerPrev = i === 0 ? 0 : (w / 2) * (0.22 + 0.78 * (i / tiers)) * 0.38;
      const yPrev = y - step;
      // Ragged slope from the previous notch out to this tier's tip.
      for (const k of [0.35, 0.7]) {
        pts.push([
          x + dir * (lerp(innerPrev, half, k) + (rand() - 0.5) * half * 0.12),
          lerp(yPrev, y, k) + (rand() - 0.5) * step * 0.2,
        ]);
      }
      const droop = step * lerp(0.05, 0.25, rand());
      pts.push([x + dir * half, y + droop]);
      if (i < tiers - 1) pts.push([x + dir * half * 0.38, y - step * lerp(0.05, 0.2, rand())]);
    }
    pts.push([x + dir * trunk, top + crown], [x + dir * trunk * 1.3, base + 4]);
    return pts;
  };

  const left = side(-1);
  const right = side(1).reverse();
  const pts = [[x + (rand() - 0.5) * 2, top], ...left, ...right];
  return "M" + pts.map(([px, py]) => `${r1(px)} ${r1(py)}`).join("L") + "Z";
}

function layerSvg(layer) {
  const rand = rng(layer.seed);
  const ground = hill(layer, rand);
  const paths = [];

  for (let x = -40; x < W + 40; x += lerp(layer.gap[0], layer.gap[1], rand())) {
    if (layer.edgesOnly && x > W * layer.edgesOnly && x < W * (1 - layer.edgesOnly)) continue;
    // Taller trees cluster toward the frame on the front layer.
    let h = lerp(layer.height[0], layer.height[1], rand());
    if (layer.edgesOnly) {
      const edge = Math.min(x, W - x) / (W * layer.edgesOnly);
      h *= lerp(1.1, 0.75, Math.max(0, Math.min(1, edge)));
    }
    const w = h * lerp(layer.width[0], layer.width[1], rand());
    paths.push(pine(x, ground(x) + rand() * 12, h, w, rand));
  }

  const groundPts = [];
  for (let x = 0; x <= W; x += 40) groundPts.push(`${x} ${r1(ground(x))}`);
  const groundPath = `M0 ${H}L${groundPts.join("L")}L${W} ${H}Z`;

  // Mist pooling around the roots: fades in toward the ground line.
  const mist = layer.mist
    ? `<defs><linearGradient id="m" x1="0" y1="0" x2="0" y2="1">` +
      `<stop offset="0" stop-color="${layer.mist}" stop-opacity="0"/>` +
      `<stop offset="1" stop-color="${layer.mist}" stop-opacity=".4"/>` +
      `</linearGradient></defs>` +
      `<rect x="0" y="${layer.base - layer.hillAmp - layer.height[1] * 0.6}" width="${W}" height="${layer.height[1] * 0.6 + layer.hillAmp * 2}" fill="url(#m)"/>`
    : "";

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMax slice">` +
    `<g fill="${layer.color}"><path d="${groundPath}"/><path d="${paths.join("")}"/></g>` +
    mist +
    `</svg>\n`
  );
}

mkdirSync(OUT, { recursive: true });
for (const layer of LAYERS) {
  const svg = layerSvg(layer);
  writeFileSync(`${OUT}/forest-${layer.name}.svg`, svg);
  console.log(`forest-${layer.name}.svg  ${(svg.length / 1024).toFixed(1)} KB`);
}
