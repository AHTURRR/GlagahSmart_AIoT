import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import DossierHeader from "@/components/layout/DossierHeader";

const targetUsers = [
  {
    title: "Petani Glagah",
    role: "Pelaku hulu",
    benefit:
      "Panduan waktu panen ideal serta identifikasi potensi benih perbanyakan mandiri.",
  },
  {
    title: "Pengrajin Sapu",
    role: "Pelaku hilir",
    benefit:
      "Membaca arah nilai ekonomi baru dari serbuk rontokan bunga hasil pemukulan sapu.",
  },
  {
    title: "Pengepul Glagah",
    role: "Rantai distribusi",
    benefit:
      "Standarisasi kadar air dan kondisi bunga sebelum didistribusikan ke pengrajin.",
  },
  {
    title: "Koperasi & Kelompok Tani",
    role: "Komunitas",
    benefit:
      "Dasar perencanaan unit usaha bersama pengolahan briket biomassa atau kompos.",
  },
  {
    title: "UMKM Biomassa",
    role: "Pemanfaat energi",
    benefit:
      "Pasokan bahan baku briket dengan spesifikasi kadar air yang lebih terukur.",
  },
  {
    title: "Peneliti & Akademisi",
    role: "Riset lanjutan",
    benefit:
      "Basis data numerik parameter glagah untuk riset agriteknologi terapan.",
  },
  {
    title: "Masyarakat Umum",
    role: "Edukasi lingkungan",
    benefit:
      "Wawasan ekonomi sirkular dan pengurangan pembakaran terbuka limbah pertanian.",
  },
  {
    title: "Dewan Juri IDTC 2.0",
    role: "Evaluator",
    benefit:
      "Demonstrasi sistem AIoT terpadu yang transparan, terukur, dan jujur secara ilmiah.",
  },
];

const systemGoals = [
  {
    title: "Mendukung penilaian awal karakteristik bunga glagah",
    desc: "Menyediakan instrumen pengukuran cepat berbasis sensor untuk membaca parameter fisis krusial pada tahap awal sebelum uji laboratorium.",
  },
  {
    title: "Memberikan rekomendasi potensi pemanfaatan berbasis data",
    desc: "Menggantikan perkiraan subjektif dengan klasifikasi Machine Learning tabular (Random Forest & Decision Tree).",
  },
  {
    title: "Mendemonstrasikan akuisisi data sensor mikroelektronika",
    desc: "Mengimplementasikan simulasi rangkaian ESP32 di Wokwi sebagai purwarupa terverifikasi sebelum fabrikasi PCB fisik.",
  },
  {
    title: "Mengimplementasikan Machine Learning yang ringkas & tepat guna",
    desc: "Menghindari overengineering (tanpa deep learning atau computer vision) dengan berfokus pada fitur numerik tabular.",
  },
  {
    title: "Mendorong ekonomi sirkular berkelanjutan di sentra glagah",
    desc: "Mengubah residu sortasi menjadi bahan baku terpilah yang berpotensi memberi nilai tambah di Pemalang dan Purbalingga.",
  },
];

export default function ObjectivesPage() {
  return (
    <div className="pb-20">
      <DossierHeader
        eyebrow="Tujuan & sasaran inovasi"
        title={
          <>
            Arah kerja sistem{" "}
            <span className="text-agri-primary">&amp; siapa yang terbantu.</span>
          </>
        }
        summary="Merumuskan lima sasaran teknis GlagahSmart AIoT beserta delapan kelompok pemangku kepentingan di sepanjang rantai nilai glagah Jawa Tengah."
        maxWidthClass="max-w-6xl"
      />

      <div className="mx-auto max-w-6xl space-y-16 px-4 pt-12 sm:px-6 lg:px-8">
        {/* Five System Objectives */}
        <section className="grid gap-8 lg:grid-cols-[0.65fr_1.35fr]">
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-agri-clay">
              Sasaran sistem
            </p>
            <h2 className="display-serif text-3xl leading-tight text-agri-ink sm:text-4xl">
              Lima tujuan utama pengembangan.
            </h2>
          </div>

          <div className="divide-y divide-agri-primary/15 border-y border-agri-primary/20 bg-white/60">
            {systemGoals.map((g, i) => (
              <article
                key={g.title}
                className="grid gap-3 px-5 py-5 sm:grid-cols-[3rem_1fr]"
              >
                <span className="display-serif text-3xl leading-none text-agri-clay">
                  0{i + 1}
                </span>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-agri-ink">
                    {g.title}
                  </h3>
                  <p className="text-xs leading-6 text-agri-muted sm:text-sm">
                    {g.desc}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Eight Target Stakeholder Groups */}
        <section className="space-y-6 border-t border-agri-primary/20 pt-10">
          <div className="max-w-2xl space-y-2">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-agri-clay">
              Ekosistem pengguna
            </p>
            <h2 className="display-serif text-3xl text-agri-ink sm:text-4xl">
              Delapan pemangku kepentingan sasaran.
            </h2>
          </div>

          <div className="grid border-l border-t border-agri-primary/20 bg-white/75 sm:grid-cols-2 lg:grid-cols-4">
            {targetUsers.map((u) => (
              <article
                key={u.title}
                className="flex flex-col justify-between border-b border-r border-agri-primary/20 p-5"
              >
                <div>
                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-agri-primary">
                    {u.role}
                  </span>
                  <h3 className="mt-1.5 text-sm font-bold text-agri-ink">
                    {u.title}
                  </h3>
                </div>
                <p className="mt-4 border-t border-agri-primary/10 pt-3 text-xs leading-6 text-agri-muted">
                  {u.benefit}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* Closing Band */}
        <section className="bg-agri-primary px-6 py-8 text-white sm:px-8">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-agri-emeraldLight">
                Langkah berikutnya
              </p>
              <h2 className="display-serif mt-1 text-3xl">
                Lihat realisasi solusi dalam tiga jalur produk biomassa.
              </h2>
            </div>
            <Link
              href="/solution"
              className="inline-flex min-h-11 shrink-0 items-center gap-2 bg-white px-5 text-xs font-bold text-agri-primary hover:bg-agri-bg sm:text-sm"
            >
              <span>Eksplorasi Solusi Inovasi</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
