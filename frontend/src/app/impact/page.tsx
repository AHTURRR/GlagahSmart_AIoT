import React from "react";
import Link from "next/link";
import { 
  Sparkles, 
  TrendingUp, 
  Leaf, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowRight,
  Globe,
  Award
} from "lucide-react";

export default function ImpactPage() {
  const impacts = [
    {
      title: "Membantu Pengambilan Keputusan Cepat & Terstandar",
      desc: "Menghilangkan kebingungan pengrajin sapu dengan panduan rekomendasi berbasis data numerik mengenai potensi hilirisasi residu yang dihasilkan setiap hari."
    },
    {
      title: "Mendukung Identifikasi Alternatif Pengolahan Biomassa",
      desc: "Membuka wawasan bagi UMKM bahwa sisa rontokan bunga tidak harus dibakar atau dibuang, melainkan dapat dipilah menjadi tiga komoditas bernilai tinggi."
    },
    {
      title: "Membuka Peluang Peningkatan Nilai Tambah Ekonomi",
      desc: "Menciptakan aliran pendapatan sekunder bagi koperasi desa melalui produksi briket biomassa pengganti kayu bakar dan penyediaan pupuk kompos organik."
    },
    {
      title: "Mendukung Upaya Pengurangan Residu Pertanian",
      desc: "Mengurangi timbulan biomassa liar dan polusi asap akibat pembakaran terbuka (*open burning*) di sekitar bengkel pengrajin sapu."
    },
    {
      title: "Mengembangkan Aplikasi Machine Learning yang Relevan",
      desc: "Membuktikan bahwa Machine Learning di sektor pertanian tidak harus selalu berbasis citra berat, melainkan sangat efektif menggunakan data fisik-kimia tabular."
    },
    {
      title: "Fondasi Sistem Pemilahan Mekanis Otomatis Masa Depan",
      desc: "Data parameter dan logika model klasifikasi ini menjadi dasar desain mesin sortasi konveyor otomatis pada roadmap pengembangan jangka panjang."
    }
  ];

  const sdgs = [
    { num: "SDG 7", title: "Energi Bersih & Terjangkau", desc: "Produksi briket biomassa berkalori dari residu glagah." },
    { num: "SDG 8", title: "Pekerjaan Layak & Pertumbuhan Ekonomi", desc: "Pemberdayaan klaster UMKM sapu rayung Pemalang-Purbalingga." },
    { num: "SDG 9", title: "Industri, Inovasi & Infrastruktur", desc: "Penerapan AIoT tepat guna pada sentra industri tradisional." },
    { num: "SDG 12", title: "Konsumsi & Produksi Bertanggung Jawab", desc: "Prinsip ekonomi sirkular: Zero waste pemanfaatan glagah." },
    { num: "SDG 13", title: "Penanganan Perubahan Iklim", desc: "Substitusi bahan bakar fosil dan pengurangan emisi pembakaran." },
  ];

  return (
    <div className="py-12 bg-agri-bg min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-agri-surface border border-agri-emerald/30 text-agri-primary text-xs font-semibold">
            <TrendingUp className="w-4 h-4 text-agri-emerald" />
            <span>Dampak & Keberlanjutan</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-agri-dark tracking-tight">
            Manfaat & Dampak Inovasi GlagahSmart
          </h1>
          <p className="text-slate-600 text-base leading-relaxed">
            Menghadirkan dampak multifaset bagi pengrajin lokal, kelestarian lingkungan hidup, dan kemajuan riset agriteknologi tepat guna.
          </p>
        </div>

        {/* Peringatan Integritas Ilmiah Terkait Klaim Angka */}
        <div className="p-5 rounded-2xl bg-amber-50/90 border border-amber-200 text-amber-950 flex items-start gap-3.5 shadow-sm">
          <ShieldAlert className="w-5 h-5 text-agri-amber shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <strong className="font-bold text-amber-900 block text-sm">
              Batasan Klaim Kuantitatif (Scientific Integrity Note):
            </strong>
            <p className="leading-relaxed text-amber-800">
              Sesuai kaidah etika ilmiah kompetisi IDTC 2.0, platform GlagahSmart AIoT <strong>secara sadar tidak mencantumkan persentase fiktif peningkatan pendapatan ekonomi atau persentase reduksi limbah</strong> sebelum studi validasi empiris di lapangan diselesaikan secara utuh. Dampak yang kami paparkan merupakan analisis potensi nilai tambah kualitatif dan arah kebermanfaatan jangka panjang.
            </p>
          </div>
        </div>

        {/* 6 Manfaat Utama Inovasi */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-agri-dark">
            Enam Potensi Manfaat Utama Inovasi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {impacts.map((imp, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-soft space-y-2 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-agri-surface text-agri-primary font-bold text-xs flex items-center justify-center">
                    0{idx + 1}
                  </div>
                  <h3 className="font-bold text-sm text-agri-dark">{imp.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{imp.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Penyelarasan SDGs (Sustainable Development Goals) */}
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-soft space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold text-agri-primary uppercase tracking-wider">
              Kontribusi Global
            </span>
            <h2 className="text-2xl font-bold text-agri-dark flex items-center gap-2">
              <Globe className="w-6 h-6 text-agri-emerald" />
              Penyelarasan dengan Target SDGs
            </h2>
            <p className="text-xs text-slate-600">
              Inovasi GlagahSmart AIoT mendukung 5 pilar pembangunan berkelanjutan PBB:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sdgs.map((s, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="text-[10px] font-bold text-agri-primary bg-agri-surface px-2 py-0.5 rounded">
                  {s.num}
                </span>
                <h4 className="font-bold text-xs text-agri-dark pt-1">{s.title}</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="flex items-center justify-between pt-4">
          <Link
            href="/technology"
            className="text-xs font-semibold text-slate-600 hover:text-agri-primary"
          >
            ← Kembali ke Arsitektur Sistem
          </Link>
          <Link
            href="/references"
            className="flex items-center gap-1.5 text-xs font-bold text-agri-primary hover:text-agri-primaryLight"
          >
            <span>Lanjut ke Referensi & Standar SNI</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}
