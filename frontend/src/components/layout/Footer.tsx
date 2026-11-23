import React from "react";
import Link from "next/link";
import { ArrowUpRight, MapPin, ShieldAlert, Sprout } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-agri-primary/20 bg-agri-dark text-agri-bg">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-agri-primary text-agri-emeraldLight"><Sprout className="h-5 w-5" /></span>
              <span className="font-display text-2xl">Glagah<span className="text-agri-emeraldLight">Smart</span></span>
            </div>
            <p className="mt-5 max-w-md text-sm leading-7 text-agri-bg/70">Catatan kerja untuk membaca residu bunga glagah dengan lebih jernih: data sensor, konteks lapangan, dan rekomendasi yang bisa diuji.</p>
            <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold uppercase tracking-[0.14em] text-agri-emeraldLight"><span>IDTC 2.0</span><span>Jawa Tengah</span><span>PoC riset</span></div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-agri-emeraldLight">Baca berikutnya</p>
            <nav className="mt-4 grid gap-3 text-sm text-agri-bg/75" aria-label="Navigasi footer">
              <Link href="/background" className="transition-colors hover:text-white">Latar belakang</Link>
              <Link href="/research" className="transition-colors hover:text-white">Metodologi</Link>
              <Link href="/simulation" className="transition-colors hover:text-white">Simulasi Wokwi</Link>
              <Link href="/classification" className="transition-colors hover:text-white">Uji klasifikasi</Link>
            </nav>
          </div>

          <div>
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-agri-amberLight"><ShieldAlert className="h-4 w-4" /> Batasan data</p>
            <p className="mt-4 text-sm leading-7 text-agri-bg/70">Wokwi adalah simulasi. Model memakai baseline sintetis. Rekomendasi tetap memerlukan uji lapangan dan laboratorium.</p>
            <p className="mt-4 flex items-center gap-2 text-xs text-agri-bg/55"><MapPin className="h-4 w-4" /> Pemalang · Purbalingga</p>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-5 text-xs text-agri-bg/45 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} GlagahSmart AIoT Team</span>
          <Link href="/references" className="inline-flex items-center gap-1 hover:text-white">Sumber & standar <ArrowUpRight className="h-3.5 w-3.5" /></Link>
        </div>
      </div>
    </footer>
  );
}
