import type { Metadata } from "next";
import { bodyFont, headingFont } from "@/lib/fonts";
import "../globals.css";

export const metadata: Metadata = {
  title: "Admin — Etno selo Raonica",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="me" className={`${bodyFont.variable} ${headingFont.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-cream-200 text-forest-950">{children}</body>
    </html>
  );
}
