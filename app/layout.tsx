import type { Metadata } from "next";
import { Inter, Poppins, Roboto_Mono, Silkscreen } from "next/font/google";
import "./globals.css";
import ClientWrapper from "@/components/ClientWrapper";

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

export const metadata: Metadata = {
  title: "Azman's Portfolio",
  description: "Minimalist Love",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${poppins.variable} ${robotoMono.variable} ${silkscreen.variable} font-inter`}
      >
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  );
}
