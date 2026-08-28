# instructions.md

How to update the portfolio with new content — new projects, internships, social links, contact details, and copy.

The portfolio's content layer is **typed and centralized** in the `data/` directory. You almost never need to touch components to update what's shown on the site. Edit the appropriate file, save, and the page picks it up on the next reload.

> **If you only remember one thing:** everything visible on the site that changes over time lives in `data/`. The components are intentionally dumb and read from there.

---

## Table of contents

1. [Quick map: which file controls which part of the site](#quick-map)
2. [Add a new project](#add-a-new-project)
3. [Add a new internship / job](#add-a-new-internship--job)
4. [Update education (GPA, graduation year, etc.)](#update-education)
5. [Update social links or contact details](#update-social-links-or-contact-details)
6. [Update the hero tagline or "About" paragraph](#update-hero-tagline-or-about-paragraph)
7. [Update the technology stack panels or marquee items](#update-technology-stack-panels-or-marquee-items)
8. [Update the nav links](#update-the-nav-links)
9. [Add a project thumbnail image](#add-a-project-thumbnail-image)
10. [Reorder projects](#reorder-projects)
11. [Verification checklist after editing data](#verification-checklist-after-editing-data)
12. [Common pitfalls](#common-pitfalls)

---

## Quick map

| You want to change… | File | Section / export |
|---|---|---|
| Project list (archive) | `data/projects.ts` | `projects` array |
| Internships / jobs | `data/experience.ts` | `experience` array |
| Education details (institution, GPA, expected graduation) | `data/experience.ts` | `education` object |
| Social links (GitHub, LinkedIn, website, Instagram) | `data/socials.ts` | `socials` array |
| Email address | `data/socials.ts` | `email` constant |
| Resume link (Google Drive / hosted PDF) | `data/socials.ts` | `resumeUrl` constant |
| Hero tagline | `data/content.ts` | `heroTaglines` array |
| Hero meta line ("Based in…", "Open to…", "X apps on Play Store") | `data/content.ts` | `heroMeta` object |
| About paragraph | `data/content.ts` | `aboutParagraph` string |
| About identity list (Role, Mobile, Frontend, Backend, …) | `data/content.ts` | `aboutIdentity` array |
| Technology stack panels (the horizontally-pinned section) | `data/content.ts` | `techPanels` array |
| Tools chip cloud | `data/content.ts` | `techChips` array |
| Technology marquee (the strip below About) | `data/content.ts` | `marqueeItems` array |
| Nav links | `data/content.ts` | `navItems` array |

> Most of the visual design — colors, fonts, spacing, animations — is locked. Edit the data files and the components pick up the change automatically.

---

## Add a new project

File: **`data/projects.ts`**

The archive renders projects in the order they appear in the `projects` array. The first one (`index 0`) becomes the **default-open featured row on first visit**.

### 1. Pick the project's position
- If this is your **strongest** new piece, put it at the top of the list and mark it `featured: true`. (Be selective — only one project should be `featured: true` at a time, otherwise the auto-open behavior gets confusing.)
- Otherwise, insert it where it belongs in your story. The existing order is: mobile apps first → full-stack → AI/infra → exploratory web work.

### 2. Add a thumbnail (or skip — see below)
If you have a screenshot/cover, drop it at `public/assets/projects/<slug>.webp` (e.g. `public/assets/projects/myapp.webp`). The site expects `.webp` for best performance, but `.png`/`.jpg` also work.

If you don't have one yet, **leave the file path pointing to `/assets/projects/<slug>.webp`** anyway. The component will gracefully show "Image not available" in a 4:3 slot — no broken-image icon, no gradient. Drop the file in later and it will pick up automatically.

### 3. Append this template to the `projects` array
```ts
{
  id: "myapp",                          // kebab-case slug, used for the URL deep-link (?project=myapp)
  number: "13",                         // 2-digit string, increments naturally
  name: "MyApp",                        // what shows as the row title
  category: "Mobile · Productivity",    // free-form, keep it short (1-3 words separated by ·)
  year: "2025",                         // year shipped or last major update
  role: "Design · Build",               // your contribution, short (1-3 words)
  description:
    "One or two sentences explaining what it is and why it matters.",
  thumbnail: "/assets/projects/myapp.webp",
  technologies: ["React Native", "Expo", "TypeScript"],
  features: [                           // optional — only include real, verifiable features
    "Push notifications",
    "Offline-first sync",
    "Biometric login",
  ],
  metrics: [                            // optional — only real numbers from real usage
    "1,000+ downloads",
    "4.7★ Play Store rating",
  ],
  projectUrl: "https://play.google.com/store/apps/details?id=...",   // optional
  githubUrl: "https://github.com/you/myapp",                          // optional
  featured: true,                      // optional — only true for the strongest project
},
```

### 4. What each field does

| Field | Required | Shown where |
|---|---|---|
| `id` | yes | URL deep-link, internal React key |
| `number` | yes | Big numeral on the left of each archive row (`01`, `02`, …) |
| `name` | yes | Row title + drawer heading |
| `category` | yes | Mono label on the row |
| `year` | yes | Right of the row |
| `role` | yes | Second-line meta on the row |
| `description` | yes | Drawer — first thing visitors read when they open the project |
| `thumbnail` | yes | Drawer — left half. If the file doesn't exist, you see "Image not available" |
| `technologies` | yes | Drawer — stack chips at the bottom |
| `features` | no | Drawer — 2-column bullet list. **Only add things you actually built.** |
| `metrics` | no | Drawer — pill chips with real impact numbers. Skip this if you don't have them. |
| `projectUrl` | no | Drawer — `View project ↗` button. Without it, the button doesn't render. |
| `githubUrl` | no | Drawer — `Source ↗` button. Without it, the button doesn't render. |
| `featured` | no | Marks the project's drawer to auto-open for 6s on first visit. Only one project should have this. |

### 5. Save the file. Reload the page. Done.

**Don't add a demo link unless you have a real one** — the site will hide the "View project" button if `projectUrl` is missing, and that's by design. Same for `githubUrl`.

---

## Add a new internship / job

File: **`data/experience.ts`**

The Experience section renders jobs in the order they appear, top to bottom. Most-recent usually goes first.

### Append this template to the `experience` array
```ts
{
  id: "company-slug",                          // kebab-case, internal
  company: "Acme Corp",
  role: "Software Engineer Intern",
  period: "May 2025 — Aug 2025",                // free-form, "YYYY — YYYY" or "Month YYYY — Month YYYY"
  bullets: [
    "Did the thing. Measurable result.",
    "Did another thing. Measurable result.",
    "Did a third thing.",
  ],
},
```

### Rules of thumb for the bullets
- **3–5 bullets per role.** More than 5 starts to feel like a resume dump.
- **Lead with the outcome, not the activity.** "Reduced load time by 30% via SSR" beats "Implemented SSR".
- **Be honest about numbers.** Only include metrics you're confident are real. The portfolio will show them exactly as you write them.
- **One sentence each.** The section uses tight spacing; long sentences will wrap awkwardly.

### Save and reload.

---

## Update education

File: **`data/experience.ts`** — the `education` object at the bottom.

```ts
export const education = {
  institution: "SRM Institute of Science and Technology",
  degree: "B.Tech in Computer Science and Engineering",
  location: "Kattankulathur, Tamil Nadu, India",
  expectedGraduation: 2027,        // number — your expected graduation year
  gpa: 8.8,                        // number — your current GPA
};
```

These two values (GPA and graduation year) are the only ones used directly on the site — the rest of the object is there for completeness. The About section renders the GPA inline:

```
B.Tech CSE · SRM IST — GPA 8.8 · Class of 2027
```

If your GPA changes, update the `gpa` value here **and** the line in `data/content.ts`'s `aboutIdentity` array (search for `Education`).

---

## Update social links or contact details

File: **`data/socials.ts`**

```ts
export const socials: Social[] = [
  // ...existing entries...
];
```

### To change an existing link
Edit its `href`. The label and icon key stay the same.

### To add a new social
Pick an `iconKey`. Only these four are currently supported: `"github" | "linkedin" | "website" | "instagram"`. If you want a different platform (Twitter, Dribbble, YouTube), add a new icon to `components/primitives/SocialIcon.tsx` first, then add a new social here.

```ts
{
  id: "twitter",                   // unique
  label: "Twitter",                 // what shows on the site
  href: "https://twitter.com/you",
  iconKey: "website",               // reuse globe for "other" until you add a Twitter icon
},
```

### To change the email or resume
```ts
export const email = "you@example.com";
export const resumeUrl = "https://drive.google.com/file/d/YOUR_FILE_ID/view?usp=sharing";
```

The email is the big clickable line in the Contact section (clicking copies it to clipboard). The resume link is the small `Resume ↗` in the footer and the `Resume ↓` in the nav.

---

## Update hero tagline or About paragraph

File: **`data/content.ts`**

### Hero tagline
```ts
export const heroTaglines = [
  "I build and ship mobile and full-stack products — from the interface to the API.",
];
```

Only the first entry is used right now. (The array is shaped for future rotation; leave it with one item unless you want to add a slider later.)

### Hero meta line
```ts
export const heroMeta = {
  based: "Based in Kanpur, India",
  status: "Open to internships and freelance work",
  publishedApps: "3+ apps live on the Play Store",
};
```

Update these when you move, change your availability, or ship more apps.

### About paragraph
```ts
export const aboutParagraph =
  "I'm Mohammad — a React Native and full-stack developer with 2+ years building and shipping cross-platform apps to Google Play. I work across the stack, from the interfaces people touch to the APIs and databases behind them. I care about the details that make software feel finished.";
```

Keep it to **1–2 sentences, ~40–60 words**. It's set in oversized Fraunces, so longer paragraphs will dominate the page.

### About identity list
```ts
export const aboutIdentity = [
  { label: "Role", value: "React Native & full-stack developer" },
  { label: "Mobile", value: "React Native, Expo, Android, Play Store" },
  // ...
];
```

Each entry is a `label` / `value` pair. The label is rendered in muted mono, the value in paper-white. Add or remove entries as needed — the list flows naturally.

If you change the GPA or graduation year, **also update the `Education` line in this array** (currently: `B.Tech CSE · SRM IST — GPA 8.8 · Class of 2027`).

---

## Update technology stack panels or marquee items

File: **`data/content.ts`**

### Pinned horizontal panels (Practice section)
```ts
export const techPanels = [
  { name: "React Native", description: "2+ years shipping cross-platform apps..." },
  // ...
];
```

Each panel has a `name` (the giant heading) and a `description` (the line of supporting text). The section is pinned horizontally on desktop, so **3–6 panels** is the right number. Fewer than 3 and the pin feels pointless; more than 6 and it drags.

### Tools chip cloud
```ts
export const techChips = [
  "Git", "GitHub Actions", "Docker", "Vercel", "Postman", "Redis", "Supabase", "Firebase",
];
```

This is the last panel in the Practice section. Add or remove freely — chips wrap naturally.

### Technology marquee (the strip below About)
```ts
export const marqueeItems = [
  "React Native", "Next.js", "TypeScript", "Node.js", "Express", "MongoDB",
  "PostgreSQL", "GSAP", "Tailwind CSS", "Docker", "Supabase", "Expo",
];
```

This is the moving strip that scrolls right-to-left as the page loads. Keep it short and readable — long lists become noise.

---

## Update the nav links

File: **`data/content.ts`**

```ts
export const navItems = [
  { id: "index", label: "Index", href: "#top" },
  { id: "about", label: "About", href: "#about" },
  { id: "work", label: "Work", href: "#work" },
  { id: "practice", label: "Practice", href: "#practice" },
  { id: "contact", label: "Contact", href: "#contact" },
];
```

The `href` values are anchor links to **section IDs on the page**. The available section IDs are:

- `#top` (Hero)
- `#about` (About)
- `#work` (Selected Work)
- `#practice` (Tech Stack)
- `#contact` (Contact)

Don't link to anything that doesn't have a matching `id` on the page — the smooth-scroll will silently fail.

To add a new nav item pointing to a new section, you also need to:
1. Add a section to `app/page.tsx` (in the `Sections` component) with a matching `id`.
2. Add the nav item here.
3. Update the `sectionIds` array in `components/nav/Nav.tsx` (around line 5) so the active-section observer knows about it.

---

## Add a project thumbnail image

This is the most common data update. The site's thumbnail paths in `data/projects.ts` point to `public/assets/projects/<slug>.webp`.

### Steps

1. **Prepare the image.**
   - Aspect ratio: **4:3** (the slot is hard-coded to this ratio in `ProjectThumbnail.tsx`).
   - Format: `.webp` is preferred (smaller). `.png` and `.jpg` also work.
   - Recommended size: at least **1200×900px**. The component uses `next/image` and will downscale; don't go below 800×600 or it'll look soft on retina.

2. **Name the file.** It must match the project's `id` in `data/projects.ts`. So for a project with `id: "walletmate"`, the file is `walletmate.webp`.

3. **Drop it in** at `public/assets/projects/`. The full path becomes `public/assets/projects/<id>.webp`, which the browser sees as `/assets/projects/<id>.webp`.

4. **Save `data/projects.ts` if needed.** If the existing `thumbnail` field already points to `/assets/projects/<id>.webp`, you don't need to edit anything. The new file just appears on the next reload.

5. **If the asset doesn't exist yet**, the slot will show a 1px-bordered 4:3 box with "Image not available" in mono. This is intentional — better than a broken image, a gradient, or a stock photo. Drop the real file in whenever you have it.

### To use a different filename or location
Update the `thumbnail` field in `data/projects.ts` to match. The path is relative to the `public/` directory, e.g. `thumbnail: "/assets/projects/myapp.webp"` resolves to `public/assets/projects/myapp.webp`.

### To remove a project's existing fallback (used by 5 of the 12 projects)
Five projects (zentry, brainwave, nike, apple-iphone-3d, crypto-dashboard) currently point to old `public/<file>` paths (e.g. `thumbnail: "/zentry.jpg"`). To migrate them to the new `public/assets/projects/<slug>.webp` convention, drop the new file in and update the `thumbnail` field to `/assets/projects/zentry.webp` (or whatever slug you prefer).

---

## Reorder projects

File: **`data/projects.ts`**

Just rearrange the entries in the `projects` array. The `number` field on each project is a string and doesn't auto-update — **bump the numbers manually** to keep them sequential (or leave them as-is if you don't care about the visual sequence).

The first project in the array is the one that auto-opens for 6s on first visit (if it has `featured: true`).

---

## Verification checklist after editing data

After any content change, run through this in your browser:

1. **Build still passes** — `npm run build` should complete with zero errors.
2. **Lint still passes** — `npx eslint .` should return zero warnings.
3. **Dev server shows the change** — `npm run dev`, reload, scroll to the relevant section.
4. **Project archive (if you edited projects)** — click the new/modified row, verify the drawer opens, check that the thumbnail loads or shows the "Image not available" slot correctly.
5. **Deep link still works** — visit `/?project=<new-slug>` and verify the new project opens.
6. **Mobile** — open Chrome DevTools, switch to iPhone or Pixel preset, verify nothing overflows horizontally.
7. **Reduced motion** — DevTools → Rendering → Emulate `prefers-reduced-motion: reduce`. Reload. Verify no animation glitches and the site is still usable.

If anything looks wrong, check [Common pitfalls](#common-pitfalls) below before asking for help.

---

## Common pitfalls

### "My project doesn't show up in the archive"
- Did you add a comma after the previous entry? Array items must be comma-separated.
- Did you use the right `id`? The URL `?project=<id>` deep-link must match.
- Hard-reload (Cmd-Shift-R / Ctrl-Shift-R). Next.js dev sometimes caches old data.

### "The thumbnail shows 'Image not available' even though the file exists"
- Filename mismatch. The `thumbnail` field must match the file on disk exactly (case-sensitive on Linux/macOS servers).
- File not in the right folder. Should be `public/assets/projects/<id>.webp` (or whatever path you specified).
- After dropping a new image, hard-reload — the browser will cache the old 404.

### "I added a new social but no icon shows up"
- `iconKey` must be one of the four supported values (`"github" | "linkedin" | "website" | "instagram"`). For anything else, edit `components/primitives/SocialIcon.tsx` first to add a new case.

### "Lint complains about my changes"
- Almost always: a trailing comma, a missing field, or a typo in an `iconKey`. Read the error — it tells you the line and the rule.

### "I want to remove a section entirely"
- Remove the entry from the relevant data array.
- If the array becomes empty (e.g. you remove all projects), the archive will render an empty state. That's fine — but if the section is supposed to disappear from the page, also remove the import from `components/Sections.tsx` and the usage in `app/page.tsx`.

### "I edited a string but it doesn't render with the right line breaks"
- Newlines in JS strings (`\n`) work for plain text but not for paragraphs set in oversized type. If you need a forced line break in the hero tagline, use an array of strings in `heroTaglines` instead (currently only the first is shown, but the infrastructure supports more).

### "Build fails after I add a project"
- Most common cause: trailing comma at the end of the last array entry, or a missing comma between entries. TypeScript's array literal syntax requires commas everywhere except after the very last item.
- Second most common: forgetting to close a string with a quote, or escaping a quote inside a string with `\"`.

### "My new project is at the top but I want it lower"
- Cut the entry from the top and paste it where you want it. Don't forget to update its `number` if you care about that.

---

## Where to look if something deeper is broken

- **`context.md`** — narrative of why the code is the way it is. Read this if you want to understand a decision before changing it.
- **`AGENTS.md`** — code-level conventions and gotchas. Read this if an agent or build is doing something unexpected.
- **`app/globals.css`** — design tokens (colors, spacing utilities). Don't add inline `py-[clamp(...)]` values; use the shared `.section-pad-y` utility instead.

---

**TL;DR for the impatient:**
- New project → `data/projects.ts`, drop thumbnail in `public/assets/projects/<slug>.webp`.
- New job → `data/experience.ts`.
- New social or change email → `data/socials.ts`.
- Change hero/about/tech copy → `data/content.ts`.
- The components will pick it up on reload. No code changes needed.
