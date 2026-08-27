# AGENTS.md

## Project Overview
Next.js 16 (App Router) + React 19 + TypeScript portfolio. Heavy GSAP animations, custom cursor, custom fonts.

## Commands
- `npm run dev` — start dev server (localhost:3000)
- `npm run build` — production build
- `npm run start` — run production build
- `npm run lint` — ESLint (flat config, extends next/core-web-vitals + next/typescript)

## Architecture Notes
- **Entry point**: `app/page.tsx` — dynamically imports all major sections with `ssr: false` (GSAP needs client)
- **Fonts**: Inter, Poppins, Roboto Mono, Silkscreen via `next/font/google` + local Zentry & MyCustomFont in `globals.css`
- **Path alias**: `@/*` → `./*`
- **Cursor**: Globally hidden via CSS (`cursor: none !important` on `*`, `body`, interactive elements)
- **Dark mode**: Class-based (`darkMode: ["class"]` in tailwind.config.ts)

## Key Conventions
- All animated components use `dynamic(() => import(...), { ssr: false })`
- Reveal animations controlled via `RevealContext` + `PageReveal` wrapper
- Tailwind uses CSS variables for colors (shadcn-style palette in `globals.css`)
- Custom Tailwind animations/keyframes defined in `tailwind.config.ts`
- ESLint: `@typescript-eslint/no-unused-vars`, `prefer-const`, `react-hooks/exhaustive-deps` are warnings; `@typescript-eslint/no-explicit-any`, `@next/next/no-img-element` are off

## Gotchas
- No test suite configured
- GSAP + `motion` (Framer Motion) both installed — check which is used where
- `mini-svg-data-uri` used for programmatic SVG backgrounds in Tailwind plugins
- Custom fonts in `public/fonts/` — `zentry-regular.woff2` exists, `MyCustomFont` files referenced but verify they exist