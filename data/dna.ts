export type DNAConcept = {
  id: string;
  index: string;
  title: string;
  body: string;
  evidence: string[];
  image: string;
  // Default position within the kinetic canvas (percentages).
  position: { left: string; top: string };
};

export const dnaConcepts: DNAConcept[] = [
  {
    id: "mobile",
    index: "01",
    title: "MOBILE",
    body: "React Native, Expo, Android, Google Play. 2+ years building cross-platform apps people actually use.",
    evidence: ["WalletMate", "SRM Hostel OLMS", "TaskMate"],
    image: "/assets/dna/mobile.webp",
    position: { left: "8%", top: "18%" },
  },
  {
    id: "fullstack",
    index: "02",
    title: "FULL-STACK",
    body: "Next.js, React, TypeScript on the front. Node.js, Express, REST APIs on the back. MongoDB, PostgreSQL, Supabase, Firebase, Redis for data.",
    evidence: ["Driver", "Password Manager", "Connect SRM"],
    image: "/assets/dna/fullstack.webp",
    position: { left: "52%", top: "8%" },
  },
  {
    id: "systems",
    index: "03",
    title: "SYSTEMS",
    body: "Distributed Job Scheduler: Node.js, Redis Streams, and BullMQ. Retries, delayed execution, concurrency control, fault tolerance, Docker-packaged workers.",
    evidence: ["Job Scheduler"],
    image: "/assets/dna/systems.webp",
    position: { left: "20%", top: "62%" },
  },
  {
    id: "security",
    index: "04",
    title: "SECURITY",
    body: "WalletMate. AES-256 encryption, secure keychain storage, biometric authentication. Zero plaintext card data on device.",
    evidence: ["WalletMate", "Password Manager"],
    image: "/assets/dna/security.webp",
    position: { left: "64%", top: "70%" },
  },
  {
    id: "performance",
    index: "05",
    title: "PERFORMANCE",
    body: "30% load-speed improvement and 25% reduction in initial page load at Digital Guruji. 99% uptime and 30% engagement lift on Connect SRM.",
    evidence: ["Digital Guruji", "Connect SRM"],
    image: "/assets/dna/performance.webp",
    position: { left: "4%", top: "44%" },
  },
  {
    id: "ai",
    index: "06",
    title: "AI",
    body: "Resumix. AI-powered resume analysis, storage, and automated candidate-to-job matching.",
    evidence: ["Resumix"],
    image: "/assets/dna/ai.webp",
    position: { left: "70%", top: "40%" },
  },
];
