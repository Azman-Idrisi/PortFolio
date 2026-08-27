import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Fraunces } from "next/font/google";
import localFont from "next/font/local";
import { Suspense } from "react";
import "./globals.css";
import { SmoothScroll } from "@/components/SmoothScroll";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz"],
});

const zentry = localFont({
  src: "../public/fonts/zentry-regular.woff2",
  variable: "--font-zentry",
  display: "swap",
  weight: "400",
  style: "normal",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://idrazman.in"),
  title: {
    default: "Mohammad Azman — React Native & Full-Stack Developer",
    template: "%s — Mohammad Azman",
  },
  description:
    "React Native developer with 2+ years building and shipping cross-platform mobile apps to Google Play. Connect SRM, WalletMate, SRM OLMS, and more.",
  applicationName: "Mohammad Azman",
  keywords: [
    "Mohammad Azman",
    "React Native Developer",
    "Full-Stack Developer",
    "Mobile App Developer",
    "Next.js",
    "TypeScript",
    "Node.js",
    "Portfolio",
  ],
  authors: [{ name: "Mohammad Azman", url: "https://idrazman.in" }],
  creator: "Mohammad Azman",
  publisher: "Mohammad Azman",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://idrazman.in",
    siteName: "Mohammad Azman",
    title: "Mohammad Azman — React Native & Full-Stack Developer",
    description:
      "React Native developer with 2+ years building and shipping cross-platform mobile apps to Google Play.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mohammad Azman — React Native & Full-Stack Developer",
    description:
      "React Native developer with 2+ years building and shipping cross-platform mobile apps to Google Play.",
  },
  robots: { index: true, follow: true },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#0A0A0B",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrains.variable} ${fraunces.variable} ${zentry.variable}`}
    >
      <body className="bg-ink text-paper font-sans antialiased">
        <a
          href="#top"
          className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[99999] focus:bg-paper focus:text-ink focus:px-3 focus:py-2 focus:text-sm"
        >
          Skip to content
        </a>
        <Suspense fallback={null}>
          <SmoothScroll>{children}</SmoothScroll>
        </Suspense>
      </body>
    </html>
  );
}
