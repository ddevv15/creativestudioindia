import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import { SITE } from "@/constants/site";
import { siteUrl } from "@/lib/seo";
import { Providers } from "./providers";
import "./globals.css";

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-display",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: SITE.name,
  description: SITE.description,
  openGraph: {
    title: SITE.name,
    description: SITE.description,
    images: [SITE.ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.name,
    description: SITE.description,
    images: [SITE.ogImage],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorantGaramond.variable} ${dmSans.variable}`}>
      <body className="bg-offwhite text-ink">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
