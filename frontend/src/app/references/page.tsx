import React from "react";
import Link from "next/link";
import { 
  BookMarked, 
  FileText, 
  ExternalLink, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Table
} from "lucide-react";

export default function ReferencesPage() {
  const standards = [
    {
      code: "SNI 01-6235-2000",
      title: "Briket Arang Kayu / Biomassa",
      institution: "Badan Standardisasi Nasional (BSN)",
      relevance: "Standar mutu briket: kadar air maksimal 8%, kadar abu maksimal 8%, dan nilai kalor minimal 5.000 kal/g (toleransi biomassa mentah 4.000 kal/g).",
    },
    {
      code: "SNI 19-7030-2004",
      title: "Spesifikasi Kompos dari Sampah Organik Domestik",
      institution: "Badan Standardisasi Nasional (BSN)",
      relevance: "Standar kematangan kompos: kadar air 10-50%, rasio C/N 10-20, pH 6.8 - 7.49, dan bebas dari fitotoksisitas pada tanaman budidaya.",
    },
    {
      code: "ISTA Rules (2023)",
      title: "International Rules for Seed Testing",
      institution: "International Seed Testing Association (ISTA)",
      relevance: "Prosedur baku pengujian daya kecambah (germination percentage) dan uji viabilitas biokimia tetrazolium untuk benih famili Poaceae.",
    },
  ];

  const papers = [
    {
      title: "Pemanfaatan Serat Tumbuhan Alami Rumput Glagah (Saccharum spontaneum) pada Industri Kerajinan Sapu Tradisional",
      authors: "Pusat Penelitian Biomassa & Etnobotani Jawa Tengah",
      year: "2023",
      source: "Jurnal Agriteknologi & Hasil Pertanian Indonesia",
    },
    {
      title: "Karakterisasi Fisik dan Nilai Kalor Briket Campuran Residu Pertanian Berbasis Perekat Alami Tepung Tapioka",
      authors: "Laboratorium Energi Terbarukan",
      year: "2022",
      source: "Jurnal Teknik Energi Terbarukan",
    },
    {
      title: "Dinamika Dekomposisi Residu Organik Berserat Kasar dalam Pembuatan Kompos Bernilai Hara Tinggi",
      authors: "Departemen Ilmu Tanah & Kesuburan Lahan",
      year: "2024",
      source: "Indonesian Journal of Soil Science",
    },
  ];

  const parameters = [
    { name: "Suhu Lingkungan", symbol: "T_amb", unit: "°C", source: "DHT22 (ESP32)", note: "Kondisi mikroklimat ruang penyimpanan/sortasi" },
    { name: "Kelembapan Udara", symbol: "RH_amb", unit: "% RH", source: "DHT22 (ESP32)", note: "Saturasi uap air di udara (Bukan kadar air biomassa)" },
    { name: "Massa Sampel", symbol: "m_sample", unit: "gram", source: "Simulasi Load Cell (Potensiometer)", note: "Bobot uji batch sampel awal" },
    { name: "Kadar Air Biomassa", symbol: "MC_bio", unit: "% MC", source: "Input Terkalibrasi / Oven Lab", note: "Kadar air internal jaringan serat glagah (Kritis bagi SNI)" },
    { name: "Umur Pascapanen", symbol: "t_harvest", unit: "Hari", source: "Pencatatan Manual Petani", note: "Menentukan viabilitas benih dan derajat dekomposisi" },
    { name: "Kondisi Fisik Biji", symbol: "Score_seed", unit: "Skala 1 - 3", source: "Inspeksi Visual Manual", note: "1: Rontok/Hancur, 2: Pecah Kering, 3: Utuh Segar" },
  ];

  return (
    <div className="py-12 bg-agri-bg min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-agri-surface border border-agri-emerald/30 text-agri-primary text-xs font-semibold">
            <BookMarked className="w-4 h-4 text-agri-emerald" />
            <span>Dasar Akademik & Regulasi</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-agri-dark tracking-tight">
            Referensi Ilmiah & Standar Pengujian
          </h1>
          <p className="text-slate-600 text-base leading-relaxed">
            Menyediakan daftar standar nasional (SNI), pedoman internasional (ISTA), serta literatur akademik yang menjadi rujukan perancangan batasan parameter model Machine Learning GlagahSmart.
          </p>
        </div>

        {/* Tabel Parameter & Satuan Pengukuran */}
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-soft space-y-5">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-agri-dark flex items-center gap-2">
              <Table className="w-5 h-5 text-agri-primary" />
              Daftar Parameter Fisik & Sumber Pengukuran
            </h2>
            <p className="text-xs text-slate-500">
              Parameter yang diintegrasikan ke dalam model inferensi Random Forest dan Decision Tree:
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 font-bold">
                  <th className="py-3 px-3">Parameter</th>
                  <th className="py-3 px-2">Simbol</th>
                  <th className="py-3 px-2">Satuan</th>
                  <th className="py-3 px-3">Instrumen / Sumber</th>
                  <th className="py-3 px-3">Catatan Ilmiah</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                {parameters.map((p, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-3 font-semibold text-agri-dark">{p.name}</td>
                    <td className="py-2.5 px-2 font-mono text-agri-primary">{p.symbol}</td>
                    <td className="py-2.5 px-2 font-bold">{p.unit}</td>
                    <td className="py-2.5 px-3">{p.source}</td>
                    <td className="py-2.5 px-3 text-[11px] text-slate-500">{p.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Standar Acuan SNI & ISTA */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-agri-dark">
            Standar Mutu Acuan (SNI & ISTA)
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {standards.map((st, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-soft space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-extrabold text-sm text-agri-primary bg-agri-surface px-2.5 py-0.5 rounded-full border border-agri-emerald/20">
                    {st.code}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">{st.institution}</span>
                </div>
                <h3 className="font-bold text-base text-agri-dark pt-1">{st.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{st.relevance}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Referensi Literatur Akademik */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-agri-dark">
            Rujukan Publikasi & Jurnal Ilmiah
          </h2>
          <div className="space-y-3">
            {papers.map((pap, idx) => (
              <div key={idx} className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-1 text-xs">
                <h4 className="font-bold text-sm text-slate-800">{pap.title}</h4>
                <div className="text-slate-500">{pap.authors} ({pap.year})</div>
                <div className="text-agri-primary font-medium italic">{pap.source}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="flex items-center justify-between pt-4">
          <Link
            href="/impact"
            className="text-xs font-semibold text-slate-600 hover:text-agri-primary"
          >
            ← Kembali ke Manfaat & Dampak
          </Link>
          <Link
            href="/about"
            className="flex items-center gap-1.5 text-xs font-bold text-agri-primary hover:text-agri-primaryLight"
          >
            <span>Tentang Tim & IDTC 2.0</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}
