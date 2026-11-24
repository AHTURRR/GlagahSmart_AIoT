import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import DossierHeader from "@/components/layout/DossierHeader";

const epistemicBlocks = [
  {
    tag: "Fakta terverifikasi",
    tone: "border-agri-primary text-agri-primary",
    title: "Komoditas budidaya & kerajinan",
    body: (
      <>
        Tanaman glagah (<em>Saccharum spontaneum</em>) secara nyata menjadi
        tulang punggung kerajinan sapu rayung Purbalingga yang telah menembus
        pasar nasional hingga ekspor.
      </>
    ),
  },
  {
    tag: "Hasil observasi",
    tone: "border-agri-ink text-agri-ink",
    title: "Timbulan residu massal",
    body: "Pada bengkel pengrajin di Bojongsari dan Karangreja, proses sortasi, pengikatan, dan pemukulan sapu selalu menyisakan timbulan serbuk bunga dan malai rontok dalam jumlah besar.",
  },
  {
    tag: "Hipotesis riset",
    tone: "border-agri-clay text-agri-clay",
    title: "Kesesuaian 3 jalur nilai tambah",
    body: "Residu tersebut memiliki karakteristik fisik-kimia yang bila dipilah secara terukur berpotensi memenuhi standar benih perbanyakan, briket biomassa (SNI), atau pupuk kompos organik.",
  },
];

export default function BackgroundPage() {
  return (
    <div className="pb-20">
      <DossierHeader
        eyebrow="Konteks lapangan · Wilayah studi"
        title={
          <>
            Dari lereng Pemalang{" "}
            <span className="text-agri-primary">ke bengkel Purbalingga.</span>
          </>
        }
        summary="Menelusuri keterkaitan ekologis dan ekonomis antara panen bunga glagah di sektor hulu Pemalang dengan industri kerajinan sapu rayung di sektor hilir Purbalingga."
        maxWidthClass="max-w-6xl"
      />

      <div className="mx-auto max-w-6xl space-y-16 px-4 pt-12 sm:px-6 lg:px-8">
        {/* Epistemic Distinction Rail */}
        <section className="grid gap-6 md:grid-cols-3">
          {epistemicBlocks.map((item) => (
            <article
              key={item.tag}
              className={`border-t-2 bg-white/75 p-5 ${item.tone}`}
            >
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.14em]">
                {item.tag}
              </span>
              <h2 className="mt-2.5 text-base font-bold text-agri-ink">
                {item.title}
              </h2>
              <p className="mt-2 text-xs leading-6 text-agri-muted">
                {item.body}
              </p>
            </article>
          ))}
        </section>

        {/* Section 01: Saccharum spontaneum */}
        <section className="grid gap-8 border-t border-agri-primary/20 pt-10 lg:grid-cols-[0.65fr_1.35fr]">
          <div>
            <span className="display-serif text-4xl leading-none text-agri-clay">
              01
            </span>
            <h2 className="display-serif mt-2 text-3xl leading-tight text-agri-ink sm:text-4xl">
              Mengenal tanaman glagah (<em>Saccharum spontaneum</em>).
            </h2>
          </div>
          <div className="space-y-4 text-sm leading-8 text-agri-muted sm:text-base">
            <p>
              Tanaman glagah atau <strong>rayung</strong> adalah rumput
              perennial berkayu dari famili <em>Poaceae</em> yang berkerabat
              dekat dengan tebu. Tanaman ini memiliki daya adaptasi tinggi pada
              lahan marjinal, lereng perbukitan, serta sempadan sungai.
            </p>
            <p>
              Bagian yang paling bernilai ekonomis adalah{" "}
              <strong className="text-agri-ink">
                malai bunganya yang berserat lentur dan berserabut halus
              </strong>
              . Setelah dipanen dan dikeringkan, malai diikat kuat pada gagang
              bambu untuk membentuk sapu lantai tradisional yang awet dengan
              daya sapu halus.
            </p>
          </div>
        </section>

        {/* Section 02: Pemalang & Purbalingga Supply Chain */}
        <section className="space-y-6 border-t border-agri-primary/20 pt-10">
          <div className="max-w-2xl space-y-2">
            <span className="display-serif text-4xl leading-none text-agri-clay">
              02
            </span>
            <h2 className="display-serif text-3xl text-agri-ink sm:text-4xl">
              Simbiosis rantai pasok: Pemalang dan Purbalingga.
            </h2>
          </div>

          <div className="grid border border-agri-primary/20 bg-white/80 md:grid-cols-2">
            <div className="border-b border-agri-primary/15 p-6 sm:p-8 md:border-b-0 md:border-r">
              <div className="flex items-center justify-between border-b border-agri-primary/15 pb-3">
                <h3 className="text-base font-bold text-agri-ink">
                  Kabupaten Pemalang
                </h3>
                <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-agri-primary">
                  Sektor hulu
                </span>
              </div>
              <p className="mt-4 text-sm leading-7 text-agri-muted">
                Wilayah perbukitan seperti Kecamatan Belik, Bantarbolang, dan
                Watukumpul merupakan pemasok utama bunga glagah. Petani memanen
                bunga saat mekar penuh sebelum biji terlepas alami oleh angin.
              </p>
              <p className="mt-5 border-t border-agri-primary/15 pt-3 text-xs text-agri-primary">
                <strong>Fokus riset:</strong> Karakteristik kematangan bunga
                dan potensi calon biji untuk perbanyakan benih mandiri.
              </p>
            </div>

            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-between border-b border-agri-primary/15 pb-3">
                <h3 className="text-base font-bold text-agri-ink">
                  Kabupaten Purbalingga
                </h3>
                <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-agri-clay">
                  Sektor hilir
                </span>
              </div>
              <p className="mt-4 text-sm leading-7 text-agri-muted">
                Kecamatan Bojongsari dan Karangreja merupakan sentra klaster IKM
                sapu rayung terkemuka di Indonesia. Ratusan pengrajin bergantung
                pada pasokan glagah berkualitas untuk produksi harian.
              </p>
              <p className="mt-5 border-t border-agri-primary/15 pt-3 text-xs text-agri-primary">
                <strong>Fokus riset:</strong> Timbulan serbuk rontokan hasil
                sortasi dan pemukulan sapu untuk briket biomassa maupun kompos.
              </p>
            </div>
          </div>
        </section>

        {/* Section 03: Why Data-Driven AIoT */}
        <section className="bg-agri-primary px-6 py-9 text-white sm:px-9">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-3xl space-y-3">
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-agri-emeraldLight">
                03 · Urgensi pengukuran
              </p>
              <h2 className="display-serif text-3xl leading-tight sm:text-4xl">
                Mengapa keputusan pemilahan membutuhkan data kuantitatif.
              </h2>
              <p className="text-sm leading-7 text-agri-bg/85">
                Hingga kini, residu bunga glagah belum dimanfaatkan secara
                optimal karena keterbatasan metode uji di tingkat UMKM.
                Membedakan kelayakan briket, benih, atau kompos menuntut
                pembacaan kadar air biomassa, kondisi suhu tumpukan, dan umur
                simpan secara objektif.
              </p>
            </div>
            <Link
              href="/problem"
              className="inline-flex min-h-11 shrink-0 items-center gap-2 bg-white px-5 text-xs font-bold text-agri-primary hover:bg-agri-bg sm:text-sm"
            >
              <span>Lanjut ke Identifikasi Masalah</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
