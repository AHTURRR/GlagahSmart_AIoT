import React from "react";
import Link from "next/link";
import { 
  AlertTriangle, 
  Workflow, 
  Trash2, 
  Scale, 
  ArrowRight, 
  CheckCircle2, 
  HelpCircle 
} from "lucide-react";

export default function ProblemPage() {
  const problems = [
    {
      num: "01",
      title: "Belum Terpetakannya Karakteristik Residu Glagah Secara Menyeluruh",
      desc: "Tidak tersedianya basis data fisik dan kimia mengenai bunga glagah yang gugur, serbuk rontokan, dan tangkai cacat di tingkat petani dan pengrajin.",
    },
    {
      num: "02",
      title: "Belum Tersedianya Sistem Terintegrasi untuk Menilai Potensi Residu",
      desc: "Pengrajin tidak memiliki panduan cepat berbasis data untuk menentukan apakah residu layak disimpan untuk briket, dibuang ke kompos, atau disemai sebagai benih.",
    },
    {
      num: "03",
      title: "Kebutuhan Pengukuran Sejumlah Parameter Fisik Kritis",
      desc: "Parameter kunci seperti kadar air biomassa, massa jenis partikel, dan temperatur ruang penyimpanan sangat memengaruhi keberhasilan briketasi maupun dekomposisi kompos.",
    },
    {
      num: "04",
      title: "Terbatasnya Informasi yang Mudah Dipahami Masyarakat & UMKM",
      desc: "Penelitian biomassa sering kali tersaji dalam bentuk jurnal teoritis yang sulit diakses dan diaplikasikan langsung oleh pelaku usaha sapu tradisional.",
    },
    {
      num: "05",
      title: "Perlunya Validasi Data Sebelum Keputusan Pemanfaatan",
      desc: "Keputusan hilirisasi produk biomassa skala usaha memerlukan dasar data empiris agar investasi peralatan (mesin pres briket / komposter) tidak merugi.",
    },
  ];

  return (
    <div className="py-12 bg-agri-bg min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold">
            <AlertTriangle className="w-4 h-4 text-agri-amber" />
            <span>Kajian Masalah Lapangan</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-agri-dark tracking-tight">
            Identifikasi Masalah & Analisis Residu Produksi
          </h1>
          <p className="text-slate-600 text-base leading-relaxed">
            Menelusuri titik munculnya residu bunga glagah sepanjang rantai nilai produksi sapu tradisional serta merumuskan 5 fokus permasalahan yang menjadi landasan inovasi GlagahSmart AIoT.
          </p>
        </div>

        {/* Infografis Anatomi Tanaman Glagah: Dimanfaatkan vs Residu */}
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-soft space-y-6">
          <div className="max-w-2xl space-y-2">
            <h2 className="text-2xl font-bold text-agri-dark">
              Anatomi Tanaman Glagah dalam Industri Sapu
            </h2>
            <p className="text-slate-600 text-xs leading-relaxed">
              Dari satu batang tanaman glagah yang dipanen, tidak semua bagian memenuhi kriteria ketat pengrajin sapu rayung:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Bagian yang Dimanfaatkan */}
            <div className="p-6 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-4">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-base">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Bagian yang Dimanfaatkan (Komoditas Utama)</span>
              </div>
              <ul className="space-y-2.5 text-xs text-emerald-950">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0"></span>
                  <div>
                    <strong>Malai Bunga Glagah Utuh & Lentur:</strong> Serabut bunga yang tidak mudah rontok, diikat kuat pada gagang bambu untuk anyaman sapu.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0"></span>
                  <div>
                    <strong>Tangkai Bunga Lurus & Kuat:</strong> Menjadi struktur penyangga ikatan benang sapu tradisional.
                  </div>
                </li>
              </ul>
            </div>

            {/* Bagian Berpotensi Residu */}
            <div className="p-6 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-4">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-base">
                <Trash2 className="w-5 h-5 text-agri-amber" />
                <span>Bagian Berpotensi Menjadi Residu (Fokus AIoT)</span>
              </div>
              <ul className="space-y-2.5 text-xs text-amber-950">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-agri-amber mt-1.5 shrink-0"></span>
                  <div>
                    <strong>Serbuk Rontokan Bunga (Chaff/Debris):</strong> Debu dan serpihan serabut bunga halus yang rontok saat proses sortasi dan pemukulan.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-agri-amber mt-1.5 shrink-0"></span>
                  <div>
                    <strong>Spikelet Rapuh & Calon Biji Gugur:</strong> Bunga yang terlalu masak atau terlampau kering sehingga patah sebelum diikat.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-agri-amber mt-1.5 shrink-0"></span>
                  <div>
                    <strong>Tangkai Cacat & Daun Pelindung:</strong> Bagian tanaman yang bengkok, basah, atau berjamur saat penyimpanan.
                  </div>
                </li>
              </ul>
            </div>

          </div>
        </div>

        {/* 5 Fokus Permasalahan Penelitian */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-agri-dark">
            Lima Fokus Permasalahan yang Diteliti
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {problems.map((p) => (
              <div key={p.num} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-soft flex items-start gap-5">
                <span className="text-2xl font-black text-slate-300 shrink-0">
                  {p.num}
                </span>
                <div className="space-y-1">
                  <h3 className="font-bold text-base text-agri-dark">
                    {p.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA ke Solusi */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-600">
            Bagaimana GlagahSmart AIoT memecahkan masalah ini dengan pendekatan teknologi cerdas?
          </div>
          <Link
            href="/solution"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-agri-primary text-white font-bold text-xs hover:bg-agri-primaryLight transition-colors shrink-0"
          >
            <span>Lihat Solusi Inovasi GlagahSmart</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}
