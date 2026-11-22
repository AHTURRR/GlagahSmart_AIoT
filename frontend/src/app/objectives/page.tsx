import React from "react";
import Link from "next/link";
import { 
  Target, 
  Users, 
  CheckCircle2, 
  Award, 
  ArrowRight,
  Sparkles,
  Cpu,
  Layers
} from "lucide-react";

export default function ObjectivesPage() {
  const targetUsers = [
    { title: "Petani Glagah", role: "Pelaku Hulu", benefit: "Mendapat panduan waktu panen ideal & potensi benih perbanyakan mandiri." },
    { title: "Pengrajin Sapu", role: "Pelaku Hilir", benefit: "Menemukan nilai ekonomi baru dari serbuk rontokan bunga hasil pemukulan sapu." },
    { title: "Pengepul Hasil Glagah", role: "Rantai Distribusi", benefit: "Standarisasi kadar air dan kualitas bunga sebelum didistribusikan ke pengrajin." },
    { title: "Koperasi & Kelompok Tani", role: "Organisasi Komunitas", benefit: "Dasar perencanaan unit usaha bersama pembuatan briket atau pupuk organik." },
    { title: "UMKM Pengolahan Biomassa", role: "Pemanfaat Energi", benefit: "Pasokan bahan baku briket berkalori tinggi dengan spesifikasi kadar air teruji." },
    { title: "Peneliti & Akademisi", role: "Riset Lanjutan", benefit: "Basis data numerik parameter glagah untuk riset agriteknologi terapan." },
    { title: "Masyarakat Umum", role: "Edukasi Lingkungan", benefit: "Wawasan ekonomi sirkular dan pengurangan pembakaran limbah pertanian." },
    { title: "Dewan Juri IDTC 2.0", role: "Evaluator Kompetisi", benefit: "Demonstrasi sistem AIoT terpadu yang transparan, terukur, dan saintifik." },
  ];

  const systemGoals = [
    {
      title: "Mendukung Penilaian Awal Karakteristik Bunga Glagah",
      desc: "Menyediakan instrumen pengukuran cepat berbasis sensor untuk membaca parameter fisis krusial tanpa alat laboratorium yang mahal di tahap awal."
    },
    {
      title: "Memberikan Rekomendasi Potensi Pemanfaatan Berdasarkan Data",
      desc: "Menghilangkan perkiraan subjektif pengrajin dengan menyajikan klasifikasi berbasis Machine Learning tabular (Random Forest & Decision Tree)."
    },
    {
      title: "Mendemonstrasikan Akuisisi Data Sensor Mikroelektronika",
      desc: "Mengimplementasikan simulasi sirkuit mikrokontroler ESP32 pada Wokwi sebagai prototipe siap pakai sebelum fabrikasi hardware PCB fisik."
    },
    {
      title: "Mengimplementasikan Machine Learning yang Relevan & Ringkas",
      desc: "Menghindari overengineering (tanpa deep learning atau computer vision yang boros daya) dan berfokus pada data numerik tabular yang tepat guna."
    },
    {
      title: "Mendorong Terwujudnya Ekonomi Sirkular Berkelanjutan",
      desc: "Mengubah status residu dari limbah nir-nilai menjadi bahan baku bernilai tambah tinggi di Kabupaten Pemalang dan Purbalingga."
    }
  ];

  return (
    <div className="py-12 bg-agri-bg min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-agri-surface border border-agri-emerald/30 text-agri-primary text-xs font-semibold">
            <Target className="w-4 h-4 text-agri-emerald" />
            <span>Tujuan & Sasaran Inovasi</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-agri-dark tracking-tight">
            Tujuan Pengembangan Sistem & Target Pengguna
          </h1>
          <p className="text-slate-600 text-base leading-relaxed">
            Menegaskan arah strategis inovasi GlagahSmart AIoT dalam menciptakan dampak nyata bagi seluruh pemangku kepentingan rantai nilai glagah di Jawa Tengah.
          </p>
        </div>

        {/* 5 Tujuan Utama Sistem */}
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-soft space-y-6">
          <h2 className="text-2xl font-bold text-agri-dark flex items-center gap-2.5">
            <Sparkles className="w-6 h-6 text-agri-primary" />
            Lima Tujuan Utama Sistem GlagahSmart AIoT
          </h2>

          <div className="space-y-4">
            {systemGoals.map((g, i) => (
              <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-4">
                <span className="w-8 h-8 rounded-lg bg-agri-surface text-agri-primary font-bold text-sm flex items-center justify-center shrink-0 mt-0.5">
                  0{i + 1}
                </span>
                <div className="space-y-1">
                  <h3 className="font-bold text-sm text-agri-dark">{g.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{g.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 8 Target Pengguna (Audiens Ekosistem) */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-agri-dark flex items-center gap-2.5">
              <Users className="w-6 h-6 text-agri-emerald" />
              Kelompok Pengguna & Sasaran Manfaat
            </h2>
            <p className="text-xs text-slate-600">
              Sistem dirancang agar dapat diakses dan memberi manfaat langsung bagi 8 pemangku kepentingan:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {targetUsers.map((u, i) => (
              <div key={i} className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-2 flex flex-col justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-agri-primary uppercase tracking-wider bg-agri-surface px-2 py-0.5 rounded">
                    {u.role}
                  </span>
                  <h4 className="font-bold text-sm text-agri-dark pt-1">{u.title}</h4>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed pt-2 border-t border-slate-100">
                  {u.benefit}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Action Link */}
        <div className="p-6 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-300">
            Ingin melihat bagaimana solusi inovasi ini direalisasikan dalam 3 jalur produk biomassa?
          </div>
          <Link
            href="/solution"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-agri-emerald text-slate-950 font-bold text-xs hover:bg-agri-emeraldLight transition-colors shrink-0"
          >
            <span>Eksplorasi Solusi Inovasi</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}
