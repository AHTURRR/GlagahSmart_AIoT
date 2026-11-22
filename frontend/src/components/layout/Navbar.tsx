"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Sprout, 
  Cpu, 
  FlaskConical, 
  Menu, 
  X, 
  ChevronRight, 
  Layers, 
  BookOpen, 
  Award 
} from "lucide-react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { label: "Beranda", href: "/" },
    { label: "Latar Belakang", href: "/background" },
    { label: "Masalah", href: "/problem" },
    { label: "Solusi Inovasi", href: "/solution" },
    { label: "Metodologi", href: "/research" },
    { label: "Arsitektur", href: "/technology" },
    { label: "Manfaat", href: "/impact" },
    { label: "Referensi", href: "/references" },
    { label: "Tentang", href: "/about" },
  ];

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-agri-primary flex items-center justify-center text-white shadow-md shadow-agri-primary/20 group-hover:scale-105 transition-transform">
              <Sprout className="w-6 h-6 text-agri-emeraldLight" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xl tracking-tight text-agri-dark">
                  Glagah<span className="text-agri-primary">Smart</span>
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-agri-emerald/10 text-agri-primary border border-agri-emerald/20">
                  AIoT
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                IDTC 2.0 • AIoT Future Competition 2026
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive(link.href)
                    ? "text-agri-primary bg-agri-surface font-semibold"
                    : "text-slate-600 hover:text-agri-primary hover:bg-slate-50"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA Demo Buttons */}
          <div className="hidden md:flex items-center gap-2.5">
            <Link
              href="/simulation"
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg border transition-all ${
                pathname === "/simulation"
                  ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                  : "bg-white text-slate-700 border-slate-300 hover:border-slate-400 hover:bg-slate-50"
              }`}
            >
              <Cpu className="w-4 h-4 text-agri-emerald" />
              <span>Simulasi Wokwi</span>
            </Link>

            <Link
              href="/classification"
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg text-white transition-all shadow-sm ${
                pathname === "/classification"
                  ? "bg-agri-primaryDark ring-2 ring-agri-emerald"
                  : "bg-agri-primary hover:bg-agri-primaryLight shadow-agri-primary/20 hover:shadow-md"
              }`}
            >
              <FlaskConical className="w-4 h-4 text-agri-emeraldLight" />
              <span>Klasifikasi ML</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-3">
          <div className="grid grid-cols-2 gap-2 pt-2 pb-3 border-b border-slate-100">
            <Link
              href="/simulation"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 p-2.5 rounded-lg bg-slate-100 text-xs font-semibold text-slate-800"
            >
              <Cpu className="w-4 h-4 text-agri-emerald" />
              Simulasi Wokwi
            </Link>
            <Link
              href="/classification"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 p-2.5 rounded-lg bg-agri-primary text-xs font-semibold text-white"
            >
              <FlaskConical className="w-4 h-4 text-agri-emeraldLight" />
              Klasifikasi ML
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive(link.href)
                    ? "bg-agri-surface text-agri-primary font-semibold"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <span>{link.label}</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
