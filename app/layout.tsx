import type { Metadata } from "next";
import { Archivo, Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import PageIntro from "@/components/PageIntro";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],

})

// display face for big titles; variable weight and width (the uppercase poster titles use it condensed)
const display = Archivo({
  variable: "--font-display",
  subsets: ["latin"],
  axes: ["wdth"],
})

export const metadata: Metadata = {
  metadataBase: new URL("https://afrobalogun.com"),
  title: {
    default: "Obasa Temiloluwa — Design & Full-stack Engineer",
    template: "%s | afroBalogun",
  },
  description: "Design and full-stack engineer in Lagos building products end to end, from interface and motion to APIs, payments and data. React, Next.js, GSAP, Node.",
  keywords: [
    "Obasa Temiloluwa",
    "creative developer",
    "frontend developer",
    "fullstack developer",
    "UI designer",
    "web design",
    "creative development",
    "interactive design",
    "motion design",
    "React developer",
    "Next.js developer",
  ],
  openGraph: {
    siteName: "afroBalogun",
    title: "Obasa Temiloluwa — Design & Full-stack Engineer",
    description: "Design and full-stack engineer in Lagos building products end to end, from interface and motion to APIs, payments and data.",
  },
  twitter: {
    card: "summary_large_image",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased bg-primary text-secondary ${inter.variable} ${display.variable} font-inter`}
    >
      <body className="min-h-full flex flex-col">
        <PageIntro />
        <Navbar />
        {children}</body>
    </html>
  );
}
