export type Project = {
  id: string;
  number: string;
  name: string;
  category: string;
  year: string;
  role: string;
  description: string;
  thumbnail: string;
  technologies: string[];
  features?: string[];
  metrics?: string[];
  projectUrl?: string;
  githubUrl?: string;
  featured?: boolean;
};

export const projects: Project[] = [
  {
    id: "walletmate",
    number: "01",
    name: "WalletMate",
    category: "Mobile · Security",
    year: "2025",
    role: "Design · Build · Ship",
    description:
      "A secure payment-card manager for Android, built around the constraint that no plaintext card data ever lives on the device.",
    thumbnail: "/assets/projects/walletmate.webp",
    technologies: ["React Native", "Expo", "TypeScript", "GitHub Actions", "CI/CD"],
    features: [
      "AES-256 encryption",
      "Secure keychain storage",
      "Biometric authentication",
      "Zero plaintext data on device",
      "Enterprise-grade mobile security",
    ],
    projectUrl:
      "https://play.google.com/store/apps/details?id=com.azman_idrisi.WalletMate&hl=en_IN",
    featured: true,
  },
  {
    id: "job-scheduler",
    number: "02",
    name: "Distributed Job Scheduler",
    category: "Backend · Infrastructure",
    year: "2025",
    role: "Architecture · Build",
    description:
      "An event-driven distributed job scheduler for high-throughput backend workflows, designed around reliability and fault tolerance.",
    thumbnail: "/assets/projects/job-scheduler.webp",
    technologies: [
      "Node.js",
      "Redis",
      "Redis Streams",
      "BullMQ",
      "Express.js",
      "Docker",
    ],
    features: [
      "Worker orchestration",
      "Automatic retries",
      "Delayed job execution",
      "Concurrency control",
      "Fault tolerance",
      "Event-driven task processing",
    ],
     projectUrl:
      "https://github.com/Azman-Idrisi/job-scheduler",
  },
  {
    id: "driver",
    number: "03",
    name: "Driver",
    category: "Web · Cloud Storage",
    year: "2025",
    role: "Design · Build",
    description:
      "A passwordless cloud-storage platform with controlled access to user files, built on Next.js 15 and Supabase.",
    thumbnail: "/assets/projects/driver.webp",
    technologies: ["Next.js 15", "TypeScript", "Tailwind CSS", "shadcn/ui", "Supabase"],
    features: [
      "Passwordless authentication",
      "File upload / download",
      "Access control",
      "File previews",
      "Scalable cloud storage architecture",
    ],
    projectUrl:
      "https://driver-umber-theta.vercel.app",
  },
  {
    id: "srm-olms",
    number: "04",
    name: "SRM Hostel OLMS",
    category: "Mobile · Student Platform",
    year: "2024",
    role: "Build · Maintain",
    description:
      "A student leave-management app for SRM Institute of Science and Technology that simplified the leave-application process.",
    thumbnail: "/olms.png",
    technologies: ["React Native", "Expo", "TypeScript", "GitHub Actions", "CI/CD"],
    features: [
      "Leave request flow",
      "Status tracking",
      "Authentication",
      "In-app notifications",
    ],
    metrics: ["200+ students", "90% process simplification"],
    projectUrl: "https://play.google.com/store/apps/details?id=com.srm.hostel.olms",
  },
  {
    id: "taskmate",
    number: "05",
    name: "TaskMate",
    category: "Mobile · Productivity",
    year: "2024",
    role: "Design · Build",
    description:
      "A cross-platform task management app with a modern BMW-style UI, backed by an Express API and MongoDB.",
    thumbnail: "/assets/projects/taskmate.webp",
    technologies: [
      "React Native",
      "Expo",
      "Express",
      "REST API",
      "MongoDB",
      "GitHub Actions",
      "CI/CD",
    ],
    features: [
      "Cross-platform iOS / Android",
      "REST API with Express",
      "MongoDB persistence",
      "Automated CI/CD pipeline",
    ],
      projectUrl: "https://play.google.com/store/apps/details?id=com.taskmate.com",
  },
  {
    id: "resumix",
    number: "06",
    name: "Resumix",
    category: "Web · AI",
    year: "2024",
    role: "Design · Build",
    description:
      "An AI-powered resume analyzer that scores resumes and matches candidates to jobs.",
    thumbnail: "/assets/projects/resumix.webp",
    technologies: ["React", "TypeScript", "Vite", "Puter.js", "Zustand", "React Router"],
    features: [
      "AI-powered resume analysis",
      "User authentication",
      "Resume storage",
      "Automated candidate-to-job matching",
    ],
    projectUrl: "https://resumix-analyze.vercel.app/",
  },
  {
    id: "password-manager",
    number: "07",
    name: "Password Manager",
    category: "Web · Security",
    year: "2024",
    role: "Design · Build",
    description:
      "A privacy-first password manager MVP with a personal vault and JWT authentication.",
    thumbnail: "/assets/projects/password-manager.webp",
    technologies: ["Next.js", "TypeScript", "JWT", "MongoDB", "Zustand"],
    features: [
      "Strong password generation",
      "Encrypted credential vault",
      "Password entry management",
      "JWT authentication",
    ],
    projectUrl: "https://treepass-password-vault.vercel.app",
  },
  {
    id: "zentry",
    number: "08",
    name: "Zentry Clone",
    category: "Web · Creative",
    year: "2024",
    role: "Build",
    description:
      "A visually captivating website inspired by Zentry, featuring scroll-triggered animations, geometric transitions, and engaging video storytelling.",
    thumbnail: "/zentry.jpg",
    technologies: ["React", "Tailwind CSS", "Vite", "GSAP"],
    projectUrl: "https://awards-peach.vercel.app",
  },
  {
    id: "brainwave",
    number: "09",
    name: "Brainwave",
    category: "Web · UI/UX",
    year: "2024",
    role: "Build",
    description:
      "A modern UI/UX website, developed using React.js and Tailwind CSS, exemplifying modern UI/UX principles.",
    thumbnail: "/brainwave.jpg",
    technologies: ["React", "Tailwind CSS", "Vite", "GSAP"],
    projectUrl: "https://brainwave-tau-two.vercel.app/",
  },
  {
    id: "nike",
    number: "10",
    name: "Nike Landing",
    category: "Web · Marketing",
    year: "2024",
    role: "Build",
    description:
      "A Nike landing page built while learning Tailwind CSS fundamentals, advanced techniques, and theming.",
    thumbnail: "/nike.png",
    technologies: ["React", "Tailwind CSS", "Vite", "GSAP"],
    projectUrl: "https://nike-weld-chi.vercel.app/",
  },
  {
    id: "apple-iphone-3d",
    number: "11",
    name: "Apple iPhone 3D",
    category: "Web · 3D · Animation",
    year: "2024",
    role: "Build",
    description:
      "Recreated the Apple iPhone 15 Pro website, combining GSAP animations and Three.js 3D effects.",
    thumbnail: "/p4.svg",
    technologies: ["React", "Tailwind CSS", "Vite", "GSAP"],
    projectUrl: "https://apple-six-ecru.vercel.app/",
  },
  {
    id: "crypto-dashboard",
    number: "12",
    name: "Crypto Dashboard",
    category: "Web · Crypto",
    year: "2024",
    role: "Build",
    description:
      "A modern, responsive cryptocurrency dashboard that provides real-time market data and visualization for crypto assets.",
    thumbnail: "/p6.png",
    technologies: ["React", "Tailwind CSS", "Redux", "Node.js"],
    projectUrl: "https://xiv-tech-seven.vercel.app/",
  },
];
