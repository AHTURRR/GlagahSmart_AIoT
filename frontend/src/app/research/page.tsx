import React from "react";
import Link from "next/link";
import { 
  Microscope, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  FileText, 
  ArrowRight,
  ShieldAlert,
  Layers
} from "lucide-react";

export default function ResearchPage() {
  const stages = [
    {
      id: 1,
      title: "Identifikasi Masalah Lapangan",
      status: "Selesai",
      category: "Eksplorasi Lapangan",
      desc: "Studi pustaka dan identifikasi awal limbah sapu rayung di sentra Bojongsari (Purbalingga) dan wilayah panen Belik (Pemalang).",
      deliverable: "Laporan pemetaan timbulan residu dan potensi masalah.",
    },
    {
      id: 2,
      title: "Wawancara & Observasi Pengguna",
      status: "Selesai",
      category: "Kajian Pengguna",
      desc: "Diskusi mendalam dengan 12 pengrajin sapu dan 5 petani glagah terkait teknik sortasi, pemukulan sapu, dan perlakuan residu selama ini.",
      deliverable: "Catatan kebutuhan pengguna (User Needs Assessment).",
    },
    {
      id: 3,
      title: "Pengumpulan Sampel Bunga & Serbuk Glagah",
      status: "Selesai",
      category: "Sampling Bahan",
      desc: "Pengambilan sampel fisik dari berbagai tahapan: malai segar panen, serbuk rontokan pemukulan, dan tumpukan residu lama.",
      deliverable: "Batch sampel terkodifikasi (Kandidat Benih, Briket, Kompos).",
    },
    {
      id: 4,
      title: "Pengukuran Parameter Fisik Awal",
      status: "Berlangsung",
      category: "Uji Karakteristik",
      desc: "Pengukuran massa sampel, bulk density (massa jenis curah), suhu ruang simpan, serta kelembapan lingkungan menggunakan instrumen portabel.",
      deliverable: "Tabel karakteristik fisik awal residu biomassa.",
    },
    {
      id: 5,
      title: "Pengujian Laboratorium yang Relevan",
      status: "Berlangsung",
      category: "Verifikasi Ilmiah",
      desc: "Pengujian kadar air gravimetri oven (SNI briket), uji daya kecambah petri dish (ISTA benih), dan pengamatan laju fermentasi organik.",
      deliverable: "Data sertifikat uji laboratorium terakreditasi.",
    },
    {
      id: 6,
      title: "Penyusunan Dataset Numerik Terstandar",
      status: "Berlangsung",
      category: "Data Science",
      desc: "Integrasi data fisik dan batas-batas ilmiah SNI/ISTA ke dalam format tabular terstruktur untuk pelatihan algoritma klasifikasi.",
      deliverable: "Dataset 1.200 sampel (Train & Test split 80:20).",
    },
    {
      id: 7,
      title: "Pelatihan Model Machine Learning (RF & DT)",
      status: "Selesai",
      category: "Machine Learning",
      desc: "Pengembangan pipeline pelatihan scikit-learn menggunakan Random Forest Classifier (100 estimators) dan Decision Tree Classifier sebagai baseline.",
      deliverable: "Binary model joblib (Akurasi evaluasi > 99% pada dataset terkalibrasi).",
    },
    {
      id: 8,
      title: "Evaluasi & Validasi Model Inferensi",
      status: "Selesai",
      category: "Machine Learning",
      desc: "Pengujian confusion matrix, precision, recall, f1-score, serta perankingan feature importance untuk eksplanasi ilmiah keputusan model.",
      deliverable: "Laporan metrik model dan modul explainability.",
    },
    {
      id: 9,
      title: "Integrasi IoT (ESP32 Wokwi) & Backend Web",
      status: "Selesai",
      category: "AIoT Integration",
      desc: "Simulasi mikrokontroler ESP32 pada Wokwi mengirimkan data via REST API FastAPI, tersambung ke web frontend Next.js secara interaktif.",
      deliverable: "Prototipe AIoT dua arah fungsional siap demonstrasi.",
    },
    {
      id: 10,
      title: "Evaluasi Kelayakan Implementasi UMKM",
      status: "Direncanakan",
      category: "Hilirisasi Lapangan",
      desc: "Uji coba penerapan alat akuisisi data fisik langsung di workshop pengrajin Purbalingga serta analisis tekno-ekonomi pembuatan briket skala kecil.",
      deliverable: "Kajian kelayakan adopsi teknologi bagi UMKM sapu.",
    },
  ];

  return (
    <div className="py-12 bg-agri-bg min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-agri-surface border border-agri-emerald/30 text-agri-primary text-xs font-semibold">
            <Microscope className="w-4 h-4 text-agri-emerald" />
            <span>Keterbukaan Metodologi</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-agri-dark tracking-tight">
            Metodologi Penelitian 10 Tahap
          </h1>
          <p className="text-slate-600 text-base leading-relaxed">
            Pengembangan inovasi GlagahSmart AIoT dilaksanakan dengan metodologi riset bertahap yang akuntabel, memadukan observasi lapangan, kaidah standar laboratorium, dan rekayasa kecerdasan buatan.
          </p>
        </div>

        {/* Ringkasan Status Progres */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 text-center space-y-1 shadow-sm">
            <div className="text-3xl font-black text-emerald-600">6</div>
            <div className="text-xs font-bold text-slate-700">Tahap Selesai</div>
            <div className="text-[10px] text-slate-500">Fondasi riset & sistem AIoT siap</div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-slate-200 text-center space-y-1 shadow-sm">
            <div className="text-3xl font-black text-amber-600">3</div>
            <div className="text-xs font-bold text-slate-700">Tahap Berlangsung</div>
            <div className="text-[10px] text-slate-500">Validasi fisik & dataset komparasi</div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-slate-200 text-center space-y-1 shadow-sm">
            <div className="text-3xl font-black text-slate-400">1</div>
            <div className="text-xs font-bold text-slate-700">Direncanakan</div>
            <div className="text-[10px] text-slate-500">Uji coba implementasi UMKM lapangan</div>
          </div>
        </div>

        {/* Detail 10 Tahapan */}
        <div className="space-y-4">
          {stages.map((st) => (
            <div
              key={st.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-soft space-y-3 hover:border-slate-300 transition-all"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-slate-100 text-slate-800 font-extrabold text-xs flex items-center justify-center">
                    #{st.id}
                  </span>
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      {st.category}
                    </span>
                    <h3 className="font-bold text-base text-agri-dark">
                      {st.title}
                    </h3>
                  </div>
                </div>

                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  st.status === "Selesai"
                    ? "bg-emerald-100 text-emerald-800"
                    : st.status === "Berlangsung"
                    ? "bg-amber-100 text-amber-800"
                    : "bg-slate-100 text-slate-600"
                }`}>
                  {st.status}
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed pl-11">
                {st.desc}
              </p>

              <div className="pl-11 pt-1 text-[11px] text-agri-primary font-medium flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-agri-emerald" />
                <span>Keluaran: <strong>{st.deliverable}</strong></span>
              </div>
            </div>
          ))}
        </div>

        {/* Catatan untuk Dewan Juri */}
        <div className="p-6 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-950 text-xs space-y-2">
          <div className="font-bold text-sm flex items-center gap-2 text-amber-900">
            <ShieldAlert className="w-5 h-5 text-agri-amber" />
            Catatan Kejujuran Ilmiah (Jury Review Note):
          </div>
          <p className="leading-relaxed text-amber-800">
            Tim GlagahSmart AIoT secara terbuka menegaskan bahwa status model Machine Learning saat ini adalah <strong>Synthetic Baseline Model</strong> yang dikalibrasi secara ketat terhadap standar SNI 01-6235-2000 dan kaidah pengujian ISTA. Kami tidak mengklaim data simulasi Wokwi sebagai data hasil survei laboratorium riil. Uji laboratorium lanjutan sedang berjalan sesuai roadmap penelitian di atas.
          </p>
        </div>

        {/* CTA ke Teknologi */}
        <div className="flex items-center justify-between pt-4">
          <Link
            href="/solution"
            className="text-xs font-semibold text-slate-600 hover:text-agri-primary"
          >
            ← Kembali ke Solusi Inovasi
          </Link>
          <Link
            href="/technology"
            className="flex items-center gap-1.5 text-xs font-bold text-agri-primary hover:text-agri-primaryLight"
          >
            <span>Lanjut ke Arsitektur Sistem AIoT</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}
