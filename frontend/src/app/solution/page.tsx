import React from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import DossierHeader from "@/components/layout/DossierHeader";

const pathways = [
  {
    num: "01",
    tag: "Perbanyakan budidaya terencana",
    title: "Benih Tanaman",
    subtitle: "Seed propagation",
    description:
      "Bahan bunga yang mengandung calon biji utuh yang dipanen saat kematangan fisiologis prima. Memungkinkan petani melakukan budidaya glagah secara terencana di lahan marjinal tanpa terus bergantung pada pencarian glagah liar di tebing terjal.",
    parameters: [
      ["Umur pascapanen", "1 – 7 hari"],
      ["Skor kondisi biji", "3 (Utuh / segar)"],
      ["Kadar air biomassa", "10% – 18% MC"],
    ],
    validations: [
      {
        name: "Uji Daya Berkecambah (Germination Test)",
        detail:
          "Mengikuti kaidah International Seed Testing Association (ISTA).",
      },
      {
        name: "Uji Tetrazolium",
        detail: "Pengujian biokimia viabilitas embrio biji secara cepat.",
      },
    ],
  },
  {
    num: "02",
    tag: "Energi terbarukan pengganti kayu / fosil",
    title: "Briket Biomassa",
    subtitle: "Bio-energy pellets",
    description:
      "Serbuk rontokan bunga dan spikelet kering hasil pemukulan sapu memiliki kandungan selulosa dan lignin tinggi. Bahan ini sesuai untuk dipadatkan menjadi briket bahan bakar bagi pengeringan tembakau, pembakaran genteng, atau tungku UMKM.",
    parameters: [
      ["Kadar air biomassa", "≤ 12% MC (kering optimal)"],
      ["Struktur fisik", "Serbuk rontokan / serabut halus"],
      ["Standar acuan", "SNI 01-6235-2000"],
    ],
    validations: [
      {
        name: "Uji Bomb Kalorimeter",
        detail:
          "Memastikan nilai kalor di atas 4.000 kal/g sesuai standar briket biomassa.",
      },
      {
        name: "Uji Kadar Air & Kadar Abu SNI",
        detail:
          "Memastikan pembakaran lebih bersih dengan residu abu minimal.",
      },
    ],
  },
  {
    num: "03",
    tag: "Restorasi kesuburan tanah pertanian",
    title: "Pupuk Kompos Organik",
    subtitle: "Organic soil amendment",
    description:
      "Residu organik yang telah disimpan lama, basah, atau mulai berjamur tidak efisien untuk dibakar, tetapi kaya karbon organik. Bahan ini diarahkan ke komposting aerobik bersama kotoran ternak sapi atau kambing.",
    parameters: [
      ["Kadar air biomassa", "25% – 60% MC (lembap)"],
      ["Umur pascapanen", "> 15 hari (terdegradasi)"],
      ["Standar acuan", "SNI 19-7030-2004"],
    ],
    validations: [
      {
        name: "Uji Rasio C/N",
        detail:
          "Memastikan keseimbangan karbon dan nitrogen berkisar 10 – 20:1 pada kompos matang.",
      },
      {
        name: "Uji Fitotoksisitas",
        detail:
          "Memastikan kompos tidak menghambat perkecambahan benih tanaman uji.",
      },
    ],
  },
];

export default function SolutionPage() {
  return (
    <div className="pb-20">
      <DossierHeader
        eyebrow="Konsep teknologi · Solusi"
        title={
          <>
            Tiga jalur hilirisasi{" "}
            <span className="text-agri-primary">yang bisa diuji.</span>
          </>
        }
        summary={
          <>
            GlagahSmart membaca parameter fisik-kimia numerik residu bunga
            glagah untuk mengarahkan keputusan awal antara{" "}
            <strong>Benih</strong>, <strong>Briket Biomassa</strong>, atau{" "}
            <strong>Pupuk Kompos</strong> — lengkap dengan syarat verifikasi
            laboratorium masing-masing.
          </>
        }
        maxWidthClass="max-w-6xl"
      />

      <div className="mx-auto max-w-6xl px-4 pt-12 sm:px-6 lg:px-8">
        <div className="divide-y divide-agri-primary/20 border-b border-agri-primary/20">
          {pathways.map((p) => (
            <section
              key={p.num}
              className="grid gap-8 py-12 first:pt-2 lg:grid-cols-[0.72fr_1.28fr]"
            >
              <div className="space-y-3">
                <div className="flex items-baseline gap-3">
                  <span className="display-serif text-4xl leading-none text-agri-clay">
                    {p.num}
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-agri-muted">
                    {p.subtitle}
                  </span>
                </div>
                <h2 className="display-serif text-4xl leading-tight text-agri-ink">
                  {p.title}
                </h2>
                <p className="border-l-2 border-agri-primary/40 pl-3 text-xs font-semibold text-agri-primary">
                  {p.tag}
                </p>
              </div>

              <div className="space-y-6">
                <p className="text-sm leading-7 text-agri-muted">
                  {p.description}
                </p>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="paper-panel p-5">
                    <h3 className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-agri-ink">
                      Parameter kunci model
                    </h3>
                    <dl className="mt-3 divide-y divide-agri-primary/15 text-xs">
                      {p.parameters.map(([label, value]) => (
                        <div
                          key={label}
                          className="flex items-baseline justify-between gap-3 py-2.5 first:pt-0 last:pb-0"
                        >
                          <dt className="text-agri-muted">{label}</dt>
                          <dd className="text-right font-semibold text-agri-ink">
                            {value}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>

                  <div className="border border-agri-primary/20 bg-white/60 p-5">
                    <h3 className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-agri-primary">
                      Syarat validasi laboratorium
                    </h3>
                    <ul className="mt-3 space-y-3 text-xs leading-6 text-agri-muted">
                      {p.validations.map((v) => (
                        <li key={v.name} className="flex items-start gap-2">
                          <Check className="mt-1 h-3.5 w-3.5 shrink-0 text-agri-primary" />
                          <span>
                            <strong className="text-agri-ink">{v.name}:</strong>{" "}
                            {v.detail}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          ))}
        </div>

        {/* Closing Band */}
        <section className="mt-14 bg-agri-primary px-6 py-9 text-white sm:px-9">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-agri-emeraldLight">
                Uji langsung
              </p>
              <h2 className="display-serif mt-1 text-3xl sm:text-4xl">
                Coba lihat alur sensor hingga rekomendasi kelas.
              </h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/simulation"
                className="inline-flex min-h-11 items-center gap-2 bg-white px-5 text-xs font-bold text-agri-primary hover:bg-agri-bg sm:text-sm"
              >
                <span>Simulasi Wokwi</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/classification"
                className="inline-flex min-h-11 items-center gap-2 border border-white/40 px-5 text-xs font-bold text-white hover:bg-white/10 sm:text-sm"
              >
                <span>Uji klasifikasi ML</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
