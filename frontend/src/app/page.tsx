"use client";

import React from "react";
import Link from "next/link";
import { 
  Sprout, 
  Flame, 
  Recycle, 
  Cpu, 
  FlaskConical, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Award, 
  ChevronRight, 
  ShieldCheck, 
  Layers, 
  BarChart2, 
  Activity,
  Compass,
  FileText
} from "lucide-react";

export default function HomePage() {
  const steps = [
    {
      num: "01",
      title: "Pemanenan Glagah di Hulu",
      location: "Kabupaten Pemalang",
      desc: "Petani memanen malai bunga tanaman glagah liar maupun budidaya di lereng pegunungan.",
    },
    {
      num: "02",
      title: "Sortasi & Pengikatan Sapu",
      location: "Kabupaten Purbalingga",
      desc: "Pengrajin menyortir bunga glagah berkualitas untuk dijadikan sapu rayung tradisional bernilai ekspor.",
    },
    {
      num: "03",
      title: "Timbulan Residu Biomassa",
      location: "Workshop Pengrajin",
      desc: "Menghasilkan residu berupa serbuk rontokan bunga, spikelet malai rapuh, dan tangkai cacat yang terbengkalai.",
    },
    {
      num: "04",
      title: "Klasifikasi AIoT Cerdas",
      location: "Sistem GlagahSmart",
      desc: "Sensor ESP32 & Machine Learning menilai parameter fisik untuk menentukan pemanfaatan bernilai tinggi.",
    },
  ];

  const methodologyStages = [
    { id: 1, title: "Identifikasi Masalah Lapangan", status: "Selesai", type: "field" },
    { id: 2, title: "Wawancara & Observasi Pengrajin", status: "Selesai", type: "field" },
    { id: 3, title: "Pengumpulan Sampel Residu", status: "Selesai", type: "lab" },
    { id: 4, title: "Pengukuran Parameter Fisik Awal", status: "Berlangsung", type: "lab" },
    { id: 5, title: "Pengujian Laboratorium SNI/ISTA", status: "Berlangsung", type: "lab" },
    { id: 6, title: "Penyusunan Dataset Numerik Terstandar", status: "Berlangsung", type: "ml" },
    { id: 7, title: "Pelatihan Model Machine Learning (RF/DT)", status: "Selesai", type: "ml" },
    { id: 8, title: "Evaluasi & Validasi Model Inferensi", status: "Selesai", type: "ml" },
    { id: 9, title: "Integrasi IoT (ESP32 Wokwi) & Backend", status: "Selesai", type: "iot" },
    { id: 10, title: "Evaluasi Kelayakan Implementasi UMKM", status: "Direncanakan", type: "eval" },
  ];

  return (
    <div className="space-y-24 pb-20">
      
      {/* 1. Hero Section */}
      <section className="relative pt-12 sm:pt-20 pb-16 overflow-hidden agri-grid-pattern border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-6">
            
            {/* Competition Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-agri-surface border border-agri-emerald/30 text-agri-primary text-xs font-semibold shadow-sm">
              <Award className="w-4 h-4 text-agri-emerald" />
              <span>IDTC 2.0 – AIoT Future Competition 2026</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-600 font-normal">Research-Based Prototype</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-agri-dark tracking-tight leading-tight">
              Glagah<span className="text-agri-primary">Smart</span> AIoT
            </h1>
            
            <p className="text-xl sm:text-2xl font-semibold text-agri-emeraldDark">
              Smart Classification for Sustainable Glagah Utilization
            </p>

            <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
              Platform riset inovatif yang mengintegrasikan akuisisi data sensor mikrokontroler <strong>ESP32 (Wokwi)</strong> dan <strong>Machine Learning Tabular (Random Forest & Decision Tree)</strong> untuk merekomendasikan hilirisasi optimal residu bunga glagah di sentra sapu tradisional <strong>Kabupaten Pemalang & Purbalingga</strong>.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Link
                href="/simulation"
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-agri-primary text-white font-bold text-sm hover:bg-agri-primaryLight transition-all shadow-md shadow-agri-primary/25 hover:shadow-lg"
              >
                <Cpu className="w-4 h-4 text-agri-emeraldLight" />
                <span>Simulasi Wokwi IoT</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/classification"
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-sm hover:bg-slate-50 transition-all shadow-sm"
              >
                <FlaskConical className="w-4 h-4 text-agri-primary" />
                <span>Demonstrasi Machine Learning</span>
              </Link>

              <Link
                href="/background"
                className="px-4 py-3.5 text-xs font-semibold text-slate-600 hover:text-agri-primary transition-colors"
              >
                Baca Latar Belakang Riset →
              </Link>
            </div>

            {/* Key Stat Badges */}
            <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-slate-200/80">
              <div className="space-y-0.5">
                <div className="text-xs text-slate-500 font-medium">Fokus Masalah</div>
                <div className="text-sm font-bold text-agri-dark">Residu Sapu Glagah</div>
              </div>
              <div className="space-y-0.5">
                <div className="text-xs text-slate-500 font-medium">Lokasi Riset</div>
                <div className="text-sm font-bold text-agri-dark">Pemalang & Purbalingga</div>
              </div>
              <div className="space-y-0.5">
                <div className="text-xs text-slate-500 font-medium">Model Utama</div>
                <div className="text-sm font-bold text-agri-dark">Random Forest (scikit-learn)</div>
              </div>
              <div className="space-y-0.5">
                <div className="text-xs text-slate-500 font-medium">Metodologi</div>
                <div className="text-sm font-bold text-agri-dark">10 Tahap Transparan</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Tiga Alternatif Pemanfaatan Residu Glagah */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold text-agri-primary uppercase tracking-wider bg-agri-surface px-3 py-1 rounded-full border border-agri-emerald/20">
            Ekonomi Sirkular Biomassa
          </span>
          <h2 className="text-3xl font-extrabold text-agri-dark">
            Tiga Jalur Hilirisasi Nilai Tambah
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            Residu proses produksi sapu yang awalnya menjadi beban lingkungan diklasifikasikan ke dalam 3 potensi bernilai ekonomi tinggi:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1: Benih */}
          <div className="bg-white rounded-2xl p-7 border border-slate-200/80 shadow-soft hover:shadow-elevated transition-all space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                <Sprout className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-agri-dark">
                1. Benih Tanaman
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Bunga glagah segar dengan malai dan calon biji utuh yang berpotensi untuk perbanyakan tanaman. Mengurangi ketergantungan pada tanaman liar di alam.
              </p>
              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                <div className="font-semibold text-slate-800">Parameter Kunci:</div>
                <ul className="space-y-1 text-slate-600">
                  <li>• Umur panen segar (1 – 7 hari)</li>
                  <li>• Struktur calon biji utuh & viabel</li>
                  <li>• Kadar air stabil (10% – 18%)</li>
                </ul>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100 text-[11px] text-emerald-900 font-medium">
              Syarat Uji: Uji Perkembangan & Uji Tetrazolium ISTA.
            </div>
          </div>

          {/* Card 2: Briket Biomassa */}
          <div className="bg-white rounded-2xl p-7 border border-slate-200/80 shadow-soft hover:shadow-elevated transition-all space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                <Flame className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-agri-dark">
                2. Briket Biomassa
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Serbuk rontokan bunga dan spikelet kering hasil proses perontokan sapu yang berpotensi menjadi bahan bakar energi alternatif ramah lingkungan.
              </p>
              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                <div className="font-semibold text-slate-800">Parameter Kunci:</div>
                <ul className="space-y-1 text-slate-600">
                  <li>• Kadar air sangat rendah (&le; 12% MC)</li>
                  <li>• Struktur serbuk halus untuk densifikasi</li>
                  <li>• Standar acuan SNI 01-6235-2000</li>
                </ul>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-100 text-[11px] text-amber-900 font-medium">
              Syarat Uji: Bomb Kalorimeter, Kadar Abu, Ketahanan Tekan.
            </div>
          </div>

          {/* Card 3: Pupuk Kompos */}
          <div className="bg-white rounded-2xl p-7 border border-slate-200/80 shadow-soft hover:shadow-elevated transition-all space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-green-50 border border-green-200 flex items-center justify-center text-green-700">
                <Recycle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-agri-dark">
                3. Pupuk Kompos Organik
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Residu organik dengan kelembapan tinggi atau kondisi terdegradasi yang ideal sebagai bahan campuran kompos kaya serat untuk perbaikan struktur tanah.
              </p>
              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                <div className="font-semibold text-slate-800">Parameter Kunci:</div>
                <ul className="space-y-1 text-slate-600">
                  <li>• Kelembapan biomassa (&ge; 30% – 60%)</li>
                  <li>• Bahan terdegradasi atau umur lama</li>
                  <li>• Standar acuan SNI 19-7030-2004</li>
                </ul>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-green-50/70 border border-green-100 text-[11px] text-green-900 font-medium">
              Syarat Uji: Rasio C/N, Nilai pH, Uji Fitotoksisitas Tanaman.
            </div>
          </div>

        </div>
      </section>

      {/* 3. Infografis Rantai Pasok Glagah Pemalang & Purbalingga */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-soft space-y-8">
          
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold text-agri-primary uppercase tracking-wider">
              Konteks Industri Tradisional
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-agri-dark">
              Alur Produksi Sapu & Munculnya Residu
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Korelasi antara kawasan hulu di Pemalang dan hilir industri sapu di Purbalingga memperlihatkan titik kritis timbulan residu yang belum terkelola optimal:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, idx) => (
              <div key={s.num} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 relative space-y-3">
                <div className="text-3xl font-black text-slate-300">
                  {s.num}
                </div>
                <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-agri-primary bg-agri-surface px-2.5 py-0.5 rounded-full">
                  <MapPin className="w-3 h-3 text-agri-emerald" />
                  <span>{s.location}</span>
                </div>
                <h4 className="font-bold text-base text-agri-dark">
                  {s.title}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-agri-surface border border-agri-emerald/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-700 space-y-1">
              <strong className="text-agri-primary block">
                Kesenjangan Lapangan yang Menjadi Fokus Penelitian:
              </strong>
              <span>
                Selama ini penentuan nasib residu dilakukan secara subjektif tanpa pengukuran parameter objektif, sehingga potensi bernilai tinggi sering berakhir sebagai limbah bakar.
              </span>
            </div>
            <Link
              href="/problem"
              className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-lg bg-agri-primary text-white text-xs font-bold hover:bg-agri-primaryLight transition-colors"
            >
              <span>Pelajari Detail Analisis Masalah</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </section>

      {/* 4. Metodologi Penelitian 10 Tahap */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold text-agri-primary uppercase tracking-wider bg-agri-surface px-3 py-1 rounded-full border border-agri-emerald/20">
            Transparansi Riset
          </span>
          <h2 className="text-3xl font-extrabold text-agri-dark">
            Roadmap Metodologi Penelitian 10 Tahap
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            Menampilkan status eksekusi riset secara jujur dan transparan untuk dewan juri kompetisi IDTC 2.0:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {methodologyStages.map((st) => (
            <div key={st.id} className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-slate-400">#{st.id}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  st.status === "Selesai"
                    ? "bg-emerald-100 text-emerald-800"
                    : st.status === "Berlangsung"
                    ? "bg-amber-100 text-amber-800"
                    : "bg-slate-100 text-slate-600"
                }`}>
                  {st.status}
                </span>
              </div>
              <p className="text-xs font-semibold text-agri-dark leading-snug">
                {st.title}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/research"
            className="inline-flex items-center gap-2 text-xs font-bold text-agri-primary hover:text-agri-primaryLight"
          >
            <span>Lihat Dokumentasi Metodologi Lengkap & Catatan Laboratorium</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 5. Alur Integrasi Teknologi AIoT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 space-y-8">
          
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold text-agri-emeraldLight uppercase tracking-wider">
              Arsitektur Sistem
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Bagaimana AIoT Bekerja Menilai Residu?
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Integrasi end-to-end tanpa overengineering: Dari sensor fisik di tepi (edge) hingga rekomendasi saintifik di antarmuka web.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-800 border border-slate-700 space-y-2">
              <div className="font-bold text-agri-emeraldLight">1. Edge Simulator</div>
              <div className="text-slate-200 font-semibold">ESP32 + Wokwi</div>
              <p className="text-slate-400 text-[11px]">
                Membaca suhu & kelembapan ruang (DHT22) serta simulasi massa sampel (potensiometer).
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-800 border border-slate-700 space-y-2">
              <div className="font-bold text-agri-emeraldLight">2. Data Ingress</div>
              <div className="text-slate-200 font-semibold">FastAPI Gateway</div>
              <p className="text-slate-400 text-[11px]">
                Menerima payload JSON telemetri dan memvalidasi tipe data fisik menggunakan Pydantic v2.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-800 border border-slate-700 space-y-2">
              <div className="font-bold text-agri-emeraldLight">3. Analytics Engine</div>
              <div className="text-slate-200 font-semibold">scikit-learn Tabular</div>
              <p className="text-slate-400 text-[11px]">
                Random Forest & Decision Tree mengklasifikasi parameter terhadap batasan SNI/ISTA.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-800 border border-slate-700 space-y-2">
              <div className="font-bold text-agri-emeraldLight">4. Decision Presentation</div>
              <div className="text-slate-200 font-semibold">Next.js Web Profil</div>
              <p className="text-slate-400 text-[11px]">
                Menyajikan kelas rekomendasi, bar probabilitas, eksplanasi fitur, dan panduan uji lab.
              </p>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-slate-800">
            <span className="text-xs text-slate-400">
              * Tidak menggunakan Computer Vision atau Deep Learning — murni data fisik-kimia numerik.
            </span>
            <Link
              href="/technology"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-agri-emeraldLight hover:underline"
            >
              <span>Pelajari Diagram Arsitektur Detail</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* 6. Section Demonstrasi Dewan Juri */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-agri-surface to-emerald-50/70 border-2 border-agri-emerald/30 p-8 sm:p-12 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-agri-primary text-xs font-bold border border-slate-200 shadow-sm">
            <Award className="w-4 h-4 text-agri-emerald" />
            <span>Skenario Demonstrasi Khusus Dewan Juri IDTC 2.0</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-agri-dark tracking-tight">
            Siap Mengevaluasi Inovasi GlagahSmart?
          </h2>

          <p className="text-slate-600 max-w-2xl mx-auto text-sm leading-relaxed">
            Ikuti alur terstruktur mulai dari eksplorasi simulasi pengambilan data sensor Wokwi, penyesuaian parameter laboratorium terkalibrasi, hingga pengujian rekomendasi Machine Learning.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/simulation"
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-agri-primary text-white font-bold text-sm hover:bg-agri-primaryLight transition-all shadow-md shadow-agri-primary/20"
            >
              <Cpu className="w-4 h-4 text-agri-emeraldLight" />
              <span>Mulai dari Simulasi Wokwi</span>
            </Link>

            <Link
              href="/classification"
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-sm hover:bg-slate-50 transition-all shadow-sm"
            >
              <FlaskConical className="w-4 h-4 text-agri-primary" />
              <span>Langsung ke Klasifikasi ML</span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
