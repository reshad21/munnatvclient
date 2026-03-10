import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Tiro_Bangla, Poppins } from "next/font/google";
import "./globals.css";

import Provider from "@/provider/Provider";
import { Toaster } from "sonner";
import ScrollToTop from "@/components/shared/ScrollToTop";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const tiroBangla = Tiro_Bangla({
  weight: ["400"],
  style: ["normal", "italic"],
  subsets: ["latin", "bengali"],
  variable: "--font-tiro-bangla",
  display: "swap",
});

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Munna IPTV - বরিশালের প্রথম আইপিটিভি চ্যানেল",
  description:
    "© 2024 Munna IPTV. বরিশালের প্রথম আইপিটিভি চ্যানেল। আমাদের সাথে থাকুন সর্বশেষ খবর, বিনোদন, এবং আরও অনেক কিছুতে।",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`
          ${geistSans.variable}
          ${geistMono.variable}
          ${tiroBangla.variable}
          ${poppins.variable}
          antialiased
        `}
      >
        <ScrollToTop />
        <Provider>{children}</Provider>
        <Toaster />
      </body>
    </html>
  );
}
