import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "GlagahSmart AIoT | Smart Classification for Sustainable Glagah Utilization",
  description: "Website profil inovasi AIoT untuk hilirisasi residu bunga glagah di Pemalang dan Purbalingga. IDTC 2.0 AIoT Future Competition 2026.",
  keywords: [
    "GlagahSmart",
    "AIoT",
    "Sapu Glagah",
    "Purbalingga",
    "Pemalang",
    "Briket Biomassa",
    "Kompos",
    "Benih Glagah",
    "Random Forest",
    "Wokwi ESP32",
    "IDTC 2.0"
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="min-h-screen flex flex-col bg-agri-bg text-agri-dark antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
