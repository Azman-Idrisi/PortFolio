export type ProofMetric = {
  id: string;
  index: string;
  number: string;
  unit?: string;
  label: string;
  source: string;
  note: string;
};

export const proofMetrics: ProofMetric[] = [
  {
    id: "active-users",
    index: "01",
    number: "1,000+",
    label: "Active users",
    source: "Connect SRM",
    note: "Scaled and maintained as Android App Developer.",
  },
  {
    id: "uptime",
    index: "02",
    number: "99%",
    label: "Uptime",
    source: "Connect SRM",
    note: "Reliability across the live mobile + web stack.",
  },
  {
    id: "engagement",
    index: "03",
    number: "30%",
    label: "Engagement lift",
    source: "Connect SRM",
    note: "Session duration also rose 15% in the same period.",
  },
  {
    id: "students",
    index: "04",
    number: "200+",
    label: "Students · 90% simpler leave flow",
    source: "SRM Hostel OLMS",
    note: "Replaced a paper-driven hostel leave process with a mobile app.",
  },
];

export const proofSecondary: { label: string; value: string }[] = [
  { label: "Years in React Native", value: "2+" },
  { label: "Apps on Google Play", value: "3+" },
  { label: "Initial page-load reduction", value: "25%" },
  { label: "Load-speed improvement", value: "30%" },
  { label: "Process simplification", value: "90%" },
];
