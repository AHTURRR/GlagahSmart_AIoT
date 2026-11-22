import React from "react";
import Link from "next/link";
import { Sprout, MapPin, Award, ExternalLink, ShieldAlert } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          
          {/* Kolom 1: Profil Brand & Kompetisi */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-agri-primary flex items-center justify-center text-white">
                <Sprout className="w-6 h-6 text-agri-emeraldLight" />
              </div>
              <span className="font-bold text-xl text-white tracking-tight">
                Glagah<span className="text-agri-emeraldLight">Smart</span> AIoT
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Smart Classification for Sustainable Glagah Utilization. Inovasi AIoT agriteknologi untuk hilirisasi residu bunga glagah menjadi benih, briket biomassa, dan kompos.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-xs text-agri-emeraldLight">
              <Award className="w-4 h-4" />
              <span>IDTC 2.0 – AIoT Future Competition 2026</span>
            </div>
          </div>

          {/* Kolom 2: Lokasi Studi Kasus */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
              Lokasi Studi Kasus
            </h4>
            <div className="space-y-3 text-sm text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-agri-emerald shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-200 block">Kabupaten Purbalingga</strong>
                  <span>Sentra kerajinan sapu glagah/rayung tradisional (Kec. Bojongsari & Karangreja).</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-agri-emerald shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-200 block">Kabupaten Pemalang</strong>
                  <span>Kawasan hulu budidaya & penampungan bahan baku glagah (Kec. Belik & Bantarbolang).</span>
                </div>
              </div>
            </div>
          </div>

          {/* Kolom 3: Navigasi Cepat */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
              Eksplorasi Proyek
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/background" className="text-slate-400 hover:text-white transition-colors">
                  Latar Belakang & Potensi Glagah
                </Link>
              </li>
              <li>
                <Link href="/problem" className="text-slate-400 hover:text-white transition-colors">
                  Identifikasi Masalah & Rantai Pasok
                </Link>
              </li>
              <li>
                <Link href="/solution" className="text-slate-400 hover:text-white transition-colors">
                  Solusi 3 Jalur Hilirisasi Residu
                </Link>
              </li>
              <li>
                <Link href="/research" className="text-slate-400 hover:text-white transition-colors">
                  Metodologi Penelitian 10 Tahap
                </Link>
              </li>
              <li>
                <Link href="/simulation" className="text-slate-400 hover:text-white transition-colors">
                  Simulasi IoT Wokwi ESP32
                </Link>
              </li>
              <li>
                <Link href="/classification" className="text-slate-400 hover:text-white transition-colors">
                  Demonstrasi Machine Learning
                </Link>
              </li>
              <li>
                <Link href="/references" className="text-slate-400 hover:text-white transition-colors">
                  Standar SNI & Rujukan Ilmiah
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 4: Keterbukaan Ilmiah & Batasan */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-agri-amber" />
              Integritas & Batasan Riset
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Platform ini merupakan <strong>Research-Based Proof of Concept</strong>. Sistem Machine Learning menggunakan model numerik tabular (Random Forest & Decision Tree) yang dikalibrasi kaidah domain SNI/ISTA, bukan Computer Vision atau Deep Learning.
            </p>
            <p className="text-xs text-slate-500">
              Data simulasi Wokwi disajikan terpisah dan tidak diklaim sebagai hasil pengujian laboratorium lapangan definitif.
            </p>
          </div>

        </div>

        {/* Baris Hak Cipta & Status */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>
            &copy; {new Date().getFullYear()} GlagahSmart AIoT Team. IDTC 2.0 AIoT Future Competition. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-agri-emeraldLight font-medium">
              <span className="w-2 h-2 rounded-full bg-agri-emerald animate-pulse"></span>
              FastAPI & scikit-learn Ready
            </span>
            <span>•</span>
            <span>Jawa Tengah, Indonesia</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
