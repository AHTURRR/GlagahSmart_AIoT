import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import DossierHeader from "@/components/layout/DossierHeader";

const stages = [
  {
    id: 1,
    title: "Identifikasi Masalah Lapangan",
    status: "Selesai",
    category: "Eksplorasi lapangan",
    desc: "Studi pustaka dan identifikasi awal limbah sapu rayung di sentra Bojongsari (Purbalingga) dan wilayah panen Belik (Pemalang).",
    deliverable: "Laporan pemetaan timbulan residu dan potensi masalah.",
  },
  {
    id: 2,
    title: "Wawancara & Observasi Pengguna",
    status: "Selesai",
    category: "Kajian pengguna",
    desc: "Diskusi mendalam dengan 12 pengrajin sapu dan 5 petani glagah terkait teknik sortasi, pemukulan sapu, dan perlakuan residu selama ini.",
    deliverable: "Catatan kebutuhan pengguna (User Needs Assessment).",
  },
  {
    id: 3,
    title: "Pengumpulan Sampel Bunga & Serbuk Glagah",
    status: "Selesai",
    category: "Sampling bahan",
    desc: "Pengambilan sampel fisik dari berbagai tahapan: malai segar panen, serbuk rontokan pemukulan, dan tumpukan residu lama.",
    deliverable: "Batch sampel terkodifikasi (Kandidat Benih, Briket, Kompos).",
  },
  {
    id: 4,
    title: "Pengukuran Parameter Fisik Awal",
    status: "Berlangsung",
    category: "Uji karakteristik",
    desc: "Pengukuran massa sampel, bulk density (massa jenis curah), suhu ruang simpan, serta kelembapan lingkungan menggunakan instrumen portabel.",
    deliverable: "Tabel karakteristik fisik awal residu biomassa.",
  },
  {
    id: 5,
    title: "Pengujian Laboratorium yang Relevan",
    status: "Berlangsung",
    category: "Verifikasi ilmiah",
    desc: "Pengujian kadar air gravimetri oven (SNI briket), uji daya kecambah petri dish (ISTA benih), dan pengamatan laju fermentasi organik.",
    deliverable: "Data sertifikat uji laboratorium terakreditasi.",
  },
  {
    id: 6,
    title: "Penyusunan Dataset Numerik Terstandar",
    status: "Berlangsung",
    category: "Data science",
    desc: "Integrasi data fisik dan batas-batas ilmiah SNI/ISTA ke dalam format tabular terstruktur untuk pelatihan algoritma klasifikasi.",
    deliverable: "Dataset 1.200 sampel (Train & Test split 80:20).",
  },
  {
    id: 7,
    title: "Pelatihan Model Machine Learning (RF & DT)",
    status: "Selesai",
    category: "Machine learning",
    desc: "Pengembangan pipeline pelatihan scikit-learn menggunakan Random Forest Classifier (100 estimators) dan Decision Tree Classifier sebagai baseline.",
    deliverable:
      "Binary model joblib (Akurasi evaluasi > 99% pada dataset terkalibrasi).",
  },
  {
    id: 8,
    title: "Evaluasi & Validasi Model Inferensi",
    status: "Selesai",
    category: "Machine learning",
    desc: "Pengujian confusion matrix, precision, recall, f1-score, serta perankingan feature importance untuk eksplanasi ilmiah keputusan model.",
    deliverable: "Laporan metrik model dan modul explainability.",
  },
  {
    id: 9,
    title: "Integrasi IoT (ESP32 Wokwi) & Backend Web",
    status: "Selesai",
    category: "Integrasi AIoT",
    desc: "Simulasi mikrokontroler ESP32 pada Wokwi mengirimkan data via REST API FastAPI, tersambung ke web frontend Next.js secara interaktif.",
    deliverable: "Prototipe AIoT dua arah fungsional siap demonstrasi.",
  },
  {
    id: 10,
    title: "Evaluasi Kelayakan Implementasi UMKM",
    status: "Direncanakan",
    category: "Hilirisasi lapangan",
    desc: "Uji coba penerapan alat akuisisi data fisik langsung di workshop pengrajin Purbalingga serta analisis tekno-ekonomi pembuatan briket skala kecil.",
    deliverable: "Kajian kelayakan adopsi teknologi bagi UMKM sapu.",
  },
];

export default function ResearchPage() {
  const statusStyle = (status: string) => {
    if (status === "Selesai") {
      return "border-agri-primary/30 bg-agri-surface/80 text-agri-primary";
    }
    if (status === "Berlangsung") {
      return "border-agri-clay/40 bg-[#F5E6DC] text-agri-clay";
    }
    return "border-agri-ink/20 bg-agri-bg text-agri-muted";
  };

  return (
    <div className="pb-20">
      <DossierHeader
        eyebrow="Keterbukaan metodologi · 10 tahap"
        title={
          <>
            Urutan kerja riset{" "}
            <span className="text-agri-primary">dan statusnya.</span>
          </>
        }
        summary="Pengembangan GlagahSmart dijalankan bertahap dengan membedakan secara terbuka bagian yang sudah selesai, sedang diverifikasi di laboratorium, dan masih direncanakan."
        maxWidthClass="max-w-6xl"
        aside={
          <div className="paper-panel grid grid-cols-3 divide-x divide-agri-primary/15 text-center">
            <div className="p-4">
              <div className="display-serif text-4xl leading-none text-agri-primary tabular-nums">
                06
              </div>
              <div className="mt-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-agri-ink">
                Selesai
              </div>
            </div>
            <div className="p-4">
              <div className="display-serif text-4xl leading-none text-agri-clay tabular-nums">
                03
              </div>
              <div className="mt-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-agri-ink">
                Berjalan
              </div>
            </div>
            <div className="p-4">
              <div className="display-serif text-4xl leading-none text-agri-muted tabular-nums">
                01
              </div>
              <div className="mt-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-agri-ink">
                Rencana
              </div>
            </div>
          </div>
        }
      />

      <div className="mx-auto max-w-6xl space-y-12 px-4 pt-10 sm:px-6 lg:px-8">
        {/* 10-Stage Research Ledger */}
        <section className="divide-y divide-agri-primary/15 border-y border-agri-primary/20 bg-white/55">
          {stages.map((st) => (
            <article
              key={st.id}
              className="grid gap-4 px-4 py-6 sm:grid-cols-[3.5rem_1fr_auto] sm:items-start sm:px-6"
            >
              <span className="display-serif text-3xl leading-none text-agri-clay tabular-nums">
                {String(st.id).padStart(2, "0")}
              </span>

              <div className="space-y-2">
                <div className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-agri-muted">
                  {st.category}
                </div>
                <h2 className="text-base font-bold text-agri-ink">
                  {st.title}
                </h2>
                <p className="max-w-2xl text-sm leading-6 text-agri-muted">
                  {st.desc}
                </p>
                <p className="pt-1 text-xs text-agri-primary">
                  <span className="font-mono uppercase tracking-[0.1em] text-agri-muted">
                    Keluaran:{" "}
                  </span>
                  <strong>{st.deliverable}</strong>
                </p>
              </div>

              <div className="sm:justify-self-end">
                <span
                  className={`inline-block border px-2.5 py-1 font-mono text-[11px] font-bold ${statusStyle(
                    st.status
                  )}`}
                >
                  {st.status}
                </span>
              </div>
            </article>
          ))}
        </section>

        {/* Jury Review Honesty Note */}
        <div className="dossier-note grid gap-3 px-5 py-5 md:grid-cols-[13rem_1fr]">
          <div>
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-agri-clay">
              Catatan dewan juri
            </p>
            <p className="mt-0.5 text-xs text-agri-muted">
              Status model &amp; data
            </p>
          </div>
          <p className="text-sm leading-7 text-agri-ink">
            Tim GlagahSmart AIoT menegaskan bahwa status model Machine Learning
            saat ini adalah <strong>Synthetic Baseline Model</strong> yang
            dikalibrasi terhadap standar SNI 01-6235-2000 dan kaidah pengujian
            ISTA. Kami tidak mengklaim data simulasi Wokwi sebagai data survei
            laboratorium riil; pengujian fisik berlanjut sesuai tahapan di atas.
          </p>
        </div>

        {/* Footer Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-agri-primary/20 pt-6 text-xs font-semibold">
          <Link
            href="/solution"
            className="text-agri-muted transition-colors hover:text-agri-primary"
          >
            ← Kembali ke Solusi
          </Link>
          <Link
            href="/technology"
            className="inline-flex items-center gap-1.5 font-bold text-agri-primary hover:text-agri-clay"
          >
            <span>Lanjut ke Arsitektur Sistem</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
