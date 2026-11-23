"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, ChevronDown, Menu, Sprout, X } from "lucide-react";

const primaryLinks = [
  { label: "Masalah", href: "/problem" },
  { label: "Solusi", href: "/solution" },
  { label: "Metodologi", href: "/research" },
  { label: "Dampak", href: "/impact" },
];

const researchLinks = [
  { label: "Latar belakang", href: "/background" },
  { label: "Arsitektur", href: "/technology" },
  { label: "Referensi", href: "/references" },
  { label: "Tentang tim", href: "/about" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [researchOpen, setResearchOpen] = useState(false);
  const pathname = usePathname();
  const isActive = (path: string) => path === "/" ? pathname === "/" : pathname.startsWith(path);

  return (
    <header className="sticky top-0 z-50 border-b border-agri-primary/15 bg-agri-bg/95 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-[4.5rem] items-center justify-between gap-5">
          <Link href="/" className="group flex min-w-0 items-center gap-3" aria-label="GlagahSmart, kembali ke beranda">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-agri-primary text-agri-emeraldLight transition-transform group-hover:-rotate-6">
              <Sprout className="h-5 w-5" />
            </span>
            <span className="min-w-0">
              <span className="block truncate font-display text-lg leading-none text-agri-ink sm:text-xl">Glagah<span className="text-agri-primary">Smart</span></span>
              <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.16em] text-agri-muted">Field dossier · AIoT</span>
            </span>
          </Link>

          <nav aria-label="Navigasi utama" className="hidden items-center gap-5 lg:flex">
            {primaryLinks.map((link) => (
              <Link key={link.href} href={link.href} className={`relative py-5 text-sm font-semibold transition-colors ${isActive(link.href) ? "text-agri-primary" : "text-agri-muted hover:text-agri-ink"}`}>
                {link.label}
                {isActive(link.href) && <span className="absolute inset-x-0 bottom-0 h-0.5 bg-agri-clay" aria-hidden="true" />}
              </Link>
            ))}
            <div className="relative">
              <button type="button" onClick={() => setResearchOpen(!researchOpen)} className="flex min-h-11 items-center gap-1 py-2 text-sm font-semibold text-agri-muted transition-colors hover:text-agri-ink" aria-expanded={researchOpen} aria-haspopup="menu">
                Catatan riset <ChevronDown className={`h-4 w-4 transition-transform ${researchOpen ? "rotate-180" : ""}`} />
              </button>
              {researchOpen && <div className="absolute right-0 top-full w-52 border border-agri-primary/15 bg-white p-2 shadow-elevated" role="menu">
                {researchLinks.map((link) => <Link key={link.href} href={link.href} onClick={() => setResearchOpen(false)} className="flex min-h-11 items-center px-3 text-sm text-agri-muted hover:bg-agri-surface hover:text-agri-primary" role="menuitem">{link.label}</Link>)}
              </div>}
            </div>
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <Link href="/simulation" className={`inline-flex min-h-11 items-center gap-2 border px-3 text-xs font-bold transition-colors ${isActive("/simulation") ? "border-agri-primary bg-agri-primary text-white" : "border-agri-primary/25 bg-transparent text-agri-primary hover:bg-white"}`}>Simulasi</Link>
            <Link href="/classification" className="inline-flex min-h-11 items-center gap-2 bg-agri-clay px-3.5 text-xs font-bold text-white transition-colors hover:bg-[#98502e]">Uji sampel <ArrowUpRight className="h-4 w-4" /></Link>
          </div>

          <button type="button" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="inline-flex min-h-11 items-center gap-2 border border-agri-primary/25 px-3 text-sm font-semibold text-agri-primary md:hidden" aria-expanded={mobileMenuOpen} aria-controls="mobile-navigation">
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}<span>Menu</span>
          </button>
        </div>
      </div>

      {mobileMenuOpen && <div id="mobile-navigation" className="border-t border-agri-primary/15 bg-white px-4 pb-5 pt-3 md:hidden">
        <div className="grid grid-cols-2 gap-2 border-b border-agri-primary/10 pb-4">
          <Link href="/simulation" onClick={() => setMobileMenuOpen(false)} className="flex min-h-11 items-center justify-center border border-agri-primary/20 text-sm font-bold text-agri-primary">Simulasi</Link>
          <Link href="/classification" onClick={() => setMobileMenuOpen(false)} className="flex min-h-11 items-center justify-center bg-agri-clay text-sm font-bold text-white">Uji sampel</Link>
        </div>
        <nav aria-label="Navigasi mobile" className="grid gap-1 pt-3">
          {[...primaryLinks, ...researchLinks].map((link) => <Link key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)} className={`flex min-h-11 items-center justify-between border-b border-agri-primary/10 px-2 text-sm font-semibold ${isActive(link.href) ? "text-agri-primary" : "text-agri-muted"}`}>{link.label}<ArrowUpRight className="h-4 w-4" /></Link>)}
        </nav>
      </div>}
    </header>
  );
}
