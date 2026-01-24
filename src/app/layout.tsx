import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AURA FIT - AI Powered Fashion E-commerce",
  description: "Premium kidswear and fashion e-commerce platform with AI Virtual Trial Room. Try before you buy with cutting-edge AI technology.",
  keywords: ["fashion", "kidswear", "e-commerce", "AI try-on", "virtual fitting room", "online shopping"],
  authors: [{ name: "NeverOld" }],
  creator: "NeverOld",
  publisher: "NeverOld",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "NeverOld - AI Powered Fashion E-commerce",
    description: "Premium kidswear and fashion e-commerce platform with AI Virtual Trial Room",
    siteName: "NeverOld",
  },
  twitter: {
    card: "summary_large_image",
    title: "NeverOld - AI Powered Fashion E-commerce",
    description: "Premium kidswear and fashion e-commerce platform with AI Virtual Trial Room",
    creator: "@neverold",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

import { NextAuthProvider } from "@/components/providers/SessionProvider";
import { CategoryProvider } from "@/contexts/CategoryContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body className="antialiased">
        <NextAuthProvider>
          <CategoryProvider>
            {children}
          </CategoryProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
