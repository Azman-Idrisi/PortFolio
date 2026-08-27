export type Experience = {
  id: string;
  company: string;
  role: string;
  period: string;
  bullets: string[];
};

export const experience: Experience[] = [
  {
    id: "digital-guruji",
    company: "Digital Guruji",
    role: "Full Stack Developer",
    period: "2024 — 2025",
    bullets: [
      "Integrated multiple RESTful APIs to expand product feature coverage.",
      "Cut initial page load by 25% via server-side rendering with Node.js.",
      "Improved app load speed by 30% through front-end and infra optimization.",
      "Built and maintained responsive front-end interfaces with React.js and Tailwind CSS.",
    ],
  },
  {
    id: "connect-srm",
    company: "Connect SRM",
    role: "Android App Developer",
    period: "2024 — 2025",
    bullets: [
      "Shipped and maintained the Connect SRM app, lifting session duration by 15% and engagement by 30%.",
      "Scaled the platform to 1,000+ active users with 99% uptime.",
      "Managed app connectivity between web and mobile platforms.",
    ],
  },
];

export const education = {
  institution: "SRM Institute of Science and Technology",
  degree: "B.Tech in Computer Science and Engineering",
  location: "Kattankulathur, Tamil Nadu, India",
  expectedGraduation: 2027,
  gpa: 8.8,
};
