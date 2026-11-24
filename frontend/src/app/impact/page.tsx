import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import DossierHeader from "@/components/layout/DossierHeader";

const impacts = [
  {
    title: "Membantu pengambilan keputusan cepat & terstandar",
    desc: "Memberi panduan rekomendasi berbasis parameter numerik bagi pengrajin sapu untuk menilai arah pemanfaatan residu harian.",
  },
  {
    title: "Mendukung identifikasi alternatif pengolahan biomassa",
    desc: "Memperlihatkan kepada UMKM bahwa serbuk rontokan bunga tidak harus dibakar atau dibuang, melainkan dapat dipilah menjadi tiga komoditas berguna.",
  },
  {
    title: "Membuka peluang peningkatan nilai tambah ekonomi",
    desc: "Menciptakan peluang aliran pendapatan sekunder bagi koperasi desa melalui briket biomassa pengganti kayu bakar dan pupuk kompos organik.",
  },
  {
    title: "Mendukung upaya pengurangan residu pertanian",
    desc: (
      <>
        Mengurangi timbulan biomassa liar dan polusi asap akibat pembakaran
        terbuka (<em>open burning</em>) di sekitar bengkel pengrajin sapu.
      </>
    ),
  },
  {
    title: "Mengembangkan aplikasi Machine Learning yang relevan",
    desc: "Menunjukkan bahwa Machine Learning di sektor pertanian tidak harus selalu berbasis citra berat, melainkan efektif memakai data fisik-kimia tabular.",
  },
  {
    title: "Fondasi sistem pemilahan mekanis otomatis masa depan",
    desc: "Parameter dan logika model klasifikasi menjadi dasar perancangan mesin sortasi konveyor pada tahap pengembangan jangka panjang.",
  },
];

const sdgs = [
  {
    num: "SDG 7",
    title: "Energi Bersih & Terjangkau",
    desc: "Produksi briket biomassa berkalori dari residu glagah.",
  },
  {
    num: "SDG 8",
    title: "Pekerjaan Layak & Pertumbuhan Ekonomi",
    desc: "Pemberdayaan klaster UMKM sapu rayung Pemalang–Purbalingga.",
  },
  {
    num: "SDG 9",
    title: "Industri, Inovasi & Infrastruktur",
    desc: "Penerapan AIoT tepat guna pada sentra industri tradisional.",
  },
  {
    num: "SDG 12",
    title: "Konsumsi & Produksi Bertanggung Jawab",
    desc: "Prinsip ekonomi sirkular: pengurangan limbah pengolahan glagah.",
  },
  {
    num: "SDG 13",
    title: "Penanganan Perubahan Iklim",
    desc: "Substitusi bahan bakar fosil dan pengurangan emisi pembakaran terbuka.",
  },
];

export default function ImpactPage() {
  return (
    <div className="pb-20">
      <DossierHeader
        eyebrow="Dampak & keberlanjutan"
        title={
          <>
            Arah manfaat tanpa{" "}
            <span className="text-agri-primary">angka yang dibuat-buat.</span>
          </>
        }
        summary="Memetakan nilai tambah kualitatif bagi pengrajin lokal, lingkungan sekitar bengkel sapu, serta keselarasan inovasi terhadap tujuan pembangunan berkelanjutan."
        maxWidthClass="max-w-6xl"
      />

      <div className="mx-auto max-w-6xl space-y-14 px-4 pt-10 sm:px-6 lg:px-8">
        {/* Quantitative Claims Boundary */}
        <div className="dossier-note grid gap-3 px-5 py-5 md:grid-cols-[13.5rem_1fr]">
          <div>
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-agri-clay">
              Batasan klaim angka
            </p>
            <p className="mt-0.5 text-xs text-agri-muted">
              Etika ilmiah IDTC 2.0
            </p>
          </div>
          <p className="text-sm leading-7 text-agri-ink">
            GlagahSmart AIoT{" "}
            <strong>
              secara sadar tidak mencantumkan persentase fiktif peningkatan
              pendapatan ekonomi atau persentase reduksi limbah
            </strong>{" "}
            sebelum validasi empiris lapangan diselesaikan secara utuh. Dampak
            di halaman ini adalah analisis potensi nilai tambah kualitatif dan
            arah kebermanfaatan jangka panjang.
          </p>
        </div>

        {/* Six Potential Benefits */}
        <section className="space-y-6">
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-agri-clay">
              Potensi manfaat
            </p>
            <h2 className="display-serif text-3xl text-agri-ink sm:text-4xl">
              Enam kontribusi utama inovasi.
            </h2>
          </div>

          <div className="grid border-t border-agri-primary/20 md:grid-cols-2">
            {impacts.map((imp, idx) => (
              <article
                key={idx}
                className={`border-b border-agri-primary/15 py-6 ${
                  idx % 2 === 0
                    ? "md:border-r md:pr-8"
                    : "md:pl-8"
                }`}
              >
                <div className="flex items-baseline gap-3">
                  <span className="display-serif text-3xl leading-none text-agri-clay">
                    0{idx + 1}
                  </span>
                  <h3 className="text-base font-bold text-agri-ink">
                    {imp.title}
                  </h3>
                </div>
                <p className="mt-2.5 pl-9 text-sm leading-7 text-agri-muted">
                  {imp.desc}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* SDGs Alignment Ledger */}
        <section className="grid gap-8 border-t border-agri-primary/20 pt-12 lg:grid-cols-[0.65fr_1.35fr]">
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-agri-clay">
              Penyelarasan global
            </p>
            <h2 className="display-serif text-3xl leading-tight text-agri-ink sm:text-4xl">
              Lima target SDGs yang terhubung.
            </h2>
            <p className="text-sm leading-7 text-agri-muted">
              Setiap pilar merujuk langsung pada jalur pemanfaatan residu
              glagah dan konteks UMKM Pemalang–Purbalingga.
            </p>
          </div>

          <div className="divide-y divide-agri-primary/15 border-y border-agri-primary/20 bg-white/60">
            {sdgs.map((s) => (
              <div
                key={s.num}
                className="grid gap-3 px-4 py-4 sm:grid-cols-[5.5rem_1fr] sm:items-baseline"
              >
                <span className="font-mono text-xs font-bold text-agri-primary">
                  {s.num}
                </span>
                <div>
                  <h3 className="text-sm font-bold text-agri-ink">{s.title}</h3>
                  <p className="mt-0.5 text-xs leading-6 text-agri-muted">
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-agri-primary/20 pt-6 text-xs font-semibold">
          <Link
            href="/technology"
            className="text-agri-muted transition-colors hover:text-agri-primary"
          >
            ← Kembali ke Arsitektur Sistem
          </Link>
          <Link
            href="/references"
            className="inline-flex items-center gap-1.5 font-bold text-agri-primary hover:text-agri-clay"
          >
            <span>Lanjut ke Referensi &amp; Standar SNI</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
