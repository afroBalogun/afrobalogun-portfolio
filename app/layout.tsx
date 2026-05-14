import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

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

export const metadata: Metadata = {
  title: {
    default: "Obasa Temiloluwa",
    template: "%s | Obasa Temiloluwa",
  },
  description: "Creative developer portfolio.",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased bg-primary text-secondary ${inter.variable} font-inter`}
    >
      <body className="min-h-full flex flex-col">
        <Navbar />
        {children}</body>
    </html>
  );
}
