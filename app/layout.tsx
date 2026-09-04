import type { Metadata } from "next";
import { Hanken_Grotesk, Inter } from "next/font/google";
import { LangProvider } from "@/lib/LanguageContext";
import "./globals.css";

const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Marco Izaac — Käännöspalvelut | PT-BR ↔ FI",
  description:
    "Ammattimaiset kääntäjäpalvelut yksityishenkilöille ja yrityksille. Portugali–Suomi–Portugali ad hoc -käännökset.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fi" className={`${hankenGrotesk.variable} ${inter.variable} scroll-smooth`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body><LangProvider>{children}</LangProvider></body>
    </html>
  );
}
