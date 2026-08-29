export type Social = {
  id: string;
  label: string;
  href: string;
  iconKey: "github" | "linkedin" | "website" | "instagram";
};

export const socials: Social[] = [
  {
    id: "github",
    label: "GitHub",
    href: "https://github.com/Azman-Idrisi",
    iconKey: "github",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/azman-idrisi",
    iconKey: "linkedin",
  },
  {
    id: "website",
    label: "Website",
    href: "https://idrazman.in",
    iconKey: "website",
  },
  {
    id: "instagram",
    label: "Instagram",
    href: "https://www.instagram.com/idr_azman/",
    iconKey: "instagram",
  },
];

export const email = "azman.mohammad.dev@gmail.com";
export const resumeUrl =
  "https://drive.google.com/file/d/1FCSXzx8kSFstIXY-pQ98fuvZDRXaPw-o/view?usp=sharing";
