export type ApproachStage = {
  id: string;
  index: string;
  title: string;
  body: string;
  tools?: string[];
};

export const approachStages: ApproachStage[] = [
  {
    id: "understand",
    index: "01",
    title: "Understand",
    body: "Start with the problem, the users, and the constraints before writing the solution.",
  },
  {
    id: "design",
    index: "02",
    title: "Design",
    body: "Think through the experience, architecture, data flow, and edge cases before implementation.",
  },
  {
    id: "build",
    index: "03",
    title: "Build",
    body: "Turn the idea into maintainable, production-oriented software across the interface, APIs, and data layer.",
  },
  {
    id: "ship",
    index: "04",
    title: "Ship",
    body: "Git, GitHub, GitHub Actions, CI/CD, Vercel, Docker, Play Store. Shipping is part of the work, not the end of it.",
    tools: ["Git", "GitHub", "GitHub Actions", "CI/CD", "Vercel", "Docker", "Play Store"],
  },
  {
    id: "improve",
    index: "05",
    title: "Improve",
    body: "Performance, reliability, security, feedback, iteration. The product is the loop.",
  },
];
