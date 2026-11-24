import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import DossierHeader from "@/components/layout/DossierHeader";

const problems = [
  {
    num: "01",
    title: "Belum terpetakannya karakteristik residu glagah secara menyeluruh",
    desc: "Tidak tersedianya basis data fisik dan kimia mengenai bunga glagah yang gugur, serbuk rontokan, dan tangkai cacat di tingkat petani maupun pengrajin.",
  },
  {
    num: "02",
    title: "Belum tersedianya sistem terintegrasi untuk menilai potensi residu",
    desc: "Pengrajin tidak memiliki panduan cepat berbasis data untuk menentukan apakah residu layak disimpan untuk briket, diolah ke kompos, atau disemai sebagai benih.",
  },
  {
    num: "03",
    title: "Kebutuhan pengukuran sejumlah parameter fisik kritis",
    desc: "Parameter kunci seperti kadar air biomassa, massa jenis partikel, dan temperatur ruang penyimpanan sangat menentukan keberhasilan briketasi maupun dekomposisi kompos.",
  },
  {
    num: "04",
    title: "Terbatasnya informasi yang mudah dipahami masyarakat dan UMKM",
    desc: "Penelitian biomassa sering tersaji dalam bentuk jurnal teoritis yang sulit diaplikasikan langsung oleh pelaku usaha sapu tradisional.",
  },
  {
    num: "05",
    title: "Perlunya validasi data sebelum keputusan pemanfaatan",
    desc: "Keputusan hilirisasi produk biomassa skala usaha memerlukan dasar data empiris agar investasi peralatan (mesin pres briket atau komposter) tidak merugi.",
  },
];

export default function ProblemPage() {
  return (
    <div className="pb-20">
      <DossierHeader
        eyebrow="Kajian lapangan · Masalah"
        title={
          <>
            Di mana residu muncul,{" "}
            <span className="text-agri-primary">dan mengapa belum terbaca.</span>
          </>
        }
        summary="Menelusuri titik munculnya residu bunga glagah sepanjang rantai produksi sapu rayung serta merumuskan lima persoalan lapangan yang melandasi perancangan GlagahSmart AIoT."
        maxWidthClass="max-w-6xl"
      />

      <div className="mx-auto max-w-6xl space-y-16 px-4 pt-12 sm:px-6 lg:px-8">
        {/* Anatomy Comparison: Two-column Field Ledger */}
        <section className="space-y-6">
          <div className="max-w-2xl space-y-2">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-agri-clay">
              Anatomi bahan baku
            </p>
            <h2 className="display-serif text-3xl text-agri-ink sm:text-4xl">
              Dari satu batang panen, tidak semuanya menjadi sapu.
            </h2>
          </div>

          <div className="grid border border-agri-primary/20 bg-white/80 md:grid-cols-2">
            <div className="border-b border-agri-primary/15 p-6 sm:p-8 md:border-b-0 md:border-r">
              <div className="flex items-center justify-between border-b border-agri-primary/15 pb-3">
                <h3 className="font-bold text-sm uppercase tracking-[0.12em] text-agri-primary">
                  Komoditas utama (dipakai)
                </h3>
                <span className="font-mono text-[11px] text-agri-muted">
                  Sapu rayung
                </span>
              </div>
              <ul className="mt-5 space-y-4 text-sm leading-6 text-agri-muted">
                <li>
                  <strong className="block text-agri-ink">
                    Malai bunga glagah utuh &amp; lentur
                  </strong>
                  Serabut bunga yang tidak mudah rontok, diikat kuat pada gagang
                  bambu untuk anyaman sapu lantai.
                </li>
                <li>
                  <strong className="block text-agri-ink">
                    Tangkai bunga lurus &amp; kuat
                  </strong>
                  Berfungsi sebagai struktur penyangga ikatan benang sapu
                  tradisional.
                </li>
              </ul>
            </div>

            <div className="bg-[#F8F2E8]/70 p-6 sm:p-8">
              <div className="flex items-center justify-between border-b border-agri-clay/25 pb-3">
                <h3 className="font-bold text-sm uppercase tracking-[0.12em] text-agri-clay">
                  Berpotensi residu (fokus AIoT)
                </h3>
                <span className="font-mono text-[11px] text-agri-clay">
                  Hilirisasi
                </span>
              </div>
              <ul className="mt-5 space-y-4 text-sm leading-6 text-agri-muted">
                <li>
                  <strong className="block text-agri-ink">
                    Serbuk rontokan bunga (chaff / debris)
                  </strong>
                  Serpihan serabut halus yang rontok saat proses sortasi dan
                  pemukulan sapu di bengkel pengrajin.
                </li>
                <li>
                  <strong className="block text-agri-ink">
                    Spikelet rapuh &amp; calon biji gugur
                  </strong>
                  Bunga yang terlalu masak atau terlampau kering sehingga patah
                  sebelum sempat diikat.
                </li>
                <li>
                  <strong className="block text-agri-ink">
                    Tangkai cacat &amp; daun pelindung
                  </strong>
                  Bagian tanaman yang bengkok, lembap, atau mulai berjamur
                  selama penyimpanan.
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Five Core Problems: Ruled Index */}
        <section className="grid gap-10 lg:grid-cols-[0.65fr_1.35fr] lg:items-start">
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-agri-clay">
              Rumusan masalah
            </p>
            <h2 className="display-serif text-3xl leading-tight text-agri-ink sm:text-4xl">
              Lima celah yang perlu dijawab sistem.
            </h2>
            <p className="text-sm leading-7 text-agri-muted">
              Setiap persoalan di bawah terhubung langsung ke pilihan sensor,
              model klasifikasi tabular, dan alur uji laboratorium.
            </p>
          </div>

          <div className="divide-y divide-agri-primary/15 border-y border-agri-primary/20">
            {problems.map((p) => (
              <article
                key={p.num}
                className="grid gap-3 py-6 sm:grid-cols-[3.5rem_1fr]"
              >
                <span className="display-serif text-3xl leading-none text-agri-clay">
                  {p.num}
                </span>
                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-agri-ink">
                    {p.title}
                  </h3>
                  <p className="text-sm leading-7 text-agri-muted">{p.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Next Section Band */}
        <section className="bg-agri-primary px-6 py-8 text-white sm:px-8">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-agri-emeraldLight">
                Langkah berikutnya
              </p>
              <h2 className="display-serif mt-1 text-3xl">
                Bagaimana residu ini diarahkan ke tiga jalur nilai tambah?
              </h2>
            </div>
            <Link
              href="/solution"
              className="inline-flex min-h-11 shrink-0 items-center gap-2 bg-white px-5 text-xs font-bold text-agri-primary transition-colors hover:bg-agri-bg sm:text-sm"
            >
              <span>Baca solusi tiga jalur</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
