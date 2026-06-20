import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Creative Studio India",
  description:
    "Creative Studio India — Ahmedabad-based architecture firm led by principal architect Jignesh Patel.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
