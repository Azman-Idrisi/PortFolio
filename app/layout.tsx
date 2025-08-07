"use client";

import { Inter, Poppins, Roboto_Mono, Silkscreen } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./provider";
import { FollowerPointerCard } from "@/components/ui/following-pointer";
import Head from "next/head";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});
const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});
const silkscreen = Silkscreen({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-silkscreen",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <title>Azman&apos;s Portfolio</title>
        <meta name="description" content="Minimalist Love" />
      </Head>
      <body
        className={`${inter.variable} ${poppins.variable} ${robotoMono.variable} ${silkscreen.variable} font-inter`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <FollowerPointerCard
            className="min-h-screen w-full"
            title="Azman's Portfolio"
          >
            {children}
          </FollowerPointerCard>
        </ThemeProvider>
      </body>
    </html>
  );
}
