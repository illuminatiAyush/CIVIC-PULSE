import type { Metadata } from "next";
import "../styles/globals.css";
import { Providers } from "../components/Providers";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AccessibilityPanel from "../components/AccessibilityPanel";

import { Inter, Playfair_Display } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "Government of India | CivicPulse",
  description: "Official Smart City Civic Reporting Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} font-sans min-h-screen flex flex-col`}>
        <Providers>
          <Navbar />
          <main className="flex-1 flex flex-col">
            {children}
          </main>
          <Footer />
          <AccessibilityPanel />
        </Providers>
      </body>
    </html>
  );
}
