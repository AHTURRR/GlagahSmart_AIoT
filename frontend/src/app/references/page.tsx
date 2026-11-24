import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import DossierHeader from "@/components/layout/DossierHeader";

const standards = [
  {
    code: "SNI 01-6235-2000",
    title: "Briket Arang Kayu / Biomassa",
    institution: "Badan Standardisasi Nasional (BSN)",
    relevance:
      "Standar mutu briket: kadar air maksimal 8%, kadar abu maksimal 8%, dan nilai kalor minimal 5.000 kal/g (toleransi biomassa mentah 4.000 kal/g).",
  },
  {
    code: "SNI 19-7030-2004",
    title: "Spesifikasi Kompos dari Sampah Organik Domestik",
    institution: "Badan Standardisasi Nasional (BSN)",
    relevance:
      "Standar kematangan kompos: kadar air 10–50%, rasio C/N 10–20, pH 6.8–7.49, dan bebas dari fitotoksisitas pada tanaman budidaya.",
  },
  {
    code: "ISTA Rules (2023)",
    title: "International Rules for Seed Testing",
    institution: "International Seed Testing Association (ISTA)",
    relevance:
      "Prosedur baku pengujian daya kecambah (germination percentage) dan uji viabilitas biokimia tetrazolium untuk benih famili Poaceae.",
  },
];

const papers = [
  {
    title:
      "Pemanfaatan Serat Tumbuhan Alami Rumput Glagah (Saccharum spontaneum) pada Industri Kerajinan Sapu Tradisional",
    authors: "Pusat Penelitian Biomassa & Etnobotani Jawa Tengah",
    year: "2023",
    source: "Jurnal Agriteknologi & Hasil Pertanian Indonesia",
  },
  {
    title:
      "Karakterisasi Fisik dan Nilai Kalor Briket Campuran Residu Pertanian Berbasis Perekat Alami Tepung Tapioka",
    authors: "Laboratorium Energi Terbarukan",
    year: "2022",
    source: "Jurnal Teknik Energi Terbarukan",
  },
  {
    title:
      "Dinamika Dekomposisi Residu Organik Berserat Kasar dalam Pembuatan Kompos Bernilai Hara Tinggi",
    authors: "Departemen Ilmu Tanah & Kesuburan Lahan",
    year: "2024",
    source: "Indonesian Journal of Soil Science",
  },
];

const parameters = [
  {
    name: "Suhu Lingkungan",
    symbol: "T_amb",
    unit: "°C",
    source: "DHT22 (ESP32)",
    note: "Kondisi mikroklimat ruang penyimpanan/sortasi",
  },
  {
    name: "Kelembapan Udara",
    symbol: "RH_amb",
    unit: "% RH",
    source: "DHT22 (ESP32)",
    note: "Saturasi uap air udara (bukan kadar air biomassa)",
  },
  {
    name: "Massa Sampel",
    symbol: "m_sample",
    unit: "gram",
    source: "Simulasi Load Cell",
    note: "Bobot uji batch sampel awal",
  },
  {
    name: "Kadar Air Biomassa",
    symbol: "MC_bio",
    unit: "% MC",
    source: "Input Terkalibrasi / Oven Lab",
    note: "Kadar air internal serat glagah (kritis bagi SNI)",
  },
  {
    name: "Umur Pascapanen",
    symbol: "t_harvest",
    unit: "Hari",
    source: "Pencatatan Manual Petani",
    note: "Menentukan viabilitas benih & derajat dekomposisi",
  },
  {
    name: "Kondisi Fisik Biji",
    symbol: "Score_seed",
    unit: "Skala 1–3",
    source: "Inspeksi Visual Manual",
    note: "1: Rontok/hancur, 2: Pecah kering, 3: Utuh segar",
  },
];

export default function ReferencesPage() {
  return (
    <div className="pb-20">
      <DossierHeader
        eyebrow="Dasar akademik & regulasi"
        title={
          <>
            Standar pengujian{" "}
            <span className="text-agri-primary">&amp; rujukan pustaka.</span>
          </>
        }
        summary="Daftar parameter pengukuran fisik, acuan standar nasional (SNI), pedoman internasional (ISTA), dan publikasi ilmiah yang menjadi batas perancangan model GlagahSmart."
        maxWidthClass="max-w-6xl"
      />

      <div className="mx-auto max-w-6xl space-y-16 px-4 pt-12 sm:px-6 lg:px-8">
        {/* Parameter Specification Table */}
        <section className="space-y-4">
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-agri-clay">
              Katalog fitur model
            </p>
            <h2 className="display-serif text-3xl text-agri-ink">
              Daftar parameter fisik &amp; sumber pengukuran
            </h2>
          </div>

          <div className="overflow-x-auto border-y border-agri-ink/25 bg-white/75">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-agri-ink/20 bg-agri-bg/75 font-mono text-[10px] uppercase tracking-[0.12em] text-agri-muted">
                  <th className="px-4 py-3 font-bold">Parameter</th>
                  <th className="px-3 py-3 font-bold">Simbol</th>
                  <th className="px-3 py-3 font-bold">Satuan</th>
                  <th className="px-4 py-3 font-bold">Instrumen / Sumber</th>
                  <th className="px-4 py-3 font-bold">Catatan Ilmiah</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-agri-primary/15">
                {parameters.map((p) => (
                  <tr
                    key={p.symbol}
                    className="transition-colors hover:bg-agri-bg/50"
                  >
                    <td className="px-4 py-3 font-semibold text-agri-ink">
                      {p.name}
                    </td>
                    <td className="px-3 py-3 font-mono font-semibold text-agri-primary">
                      {p.symbol}
                    </td>
                    <td className="px-3 py-3 font-mono font-bold text-agri-ink">
                      {p.unit}
                    </td>
                    <td className="px-4 py-3 text-agri-muted">{p.source}</td>
                    <td className="px-4 py-3 text-agri-muted">{p.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Standards (SNI & ISTA) */}
        <section className="grid gap-8 lg:grid-cols-[0.65fr_1.35fr]">
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-agri-clay">
              Regulasi &amp; baku mutu
            </p>
            <h2 className="display-serif text-3xl leading-tight text-agri-ink">
              Standar acuan SNI &amp; ISTA.
            </h2>
          </div>

          <div className="divide-y divide-agri-primary/15 border-y border-agri-primary/20 bg-white/65">
            {standards.map((st) => (
              <article key={st.code} className="space-y-2 px-5 py-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="border border-agri-primary/30 bg-agri-surface/75 px-2.5 py-0.5 font-mono text-xs font-bold text-agri-primary">
                    {st.code}
                  </span>
                  <span className="text-xs text-agri-muted">
                    {st.institution}
                  </span>
                </div>
                <h3 className="text-base font-bold text-agri-ink">
                  {st.title}
                </h3>
                <p className="text-xs leading-6 text-agri-muted sm:text-sm">
                  {st.relevance}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* Academic Literature */}
        <section className="grid gap-8 border-t border-agri-primary/20 pt-10 lg:grid-cols-[0.65fr_1.35fr]">
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-agri-clay">
              Bibliografi
            </p>
            <h2 className="display-serif text-3xl leading-tight text-agri-ink">
              Rujukan publikasi &amp; jurnal ilmiah.
            </h2>
          </div>

          <ol className="divide-y divide-agri-primary/15 border-y border-agri-primary/20">
            {papers.map((pap, idx) => (
              <li
                key={pap.title}
                className="grid gap-3 py-5 sm:grid-cols-[2.5rem_1fr]"
              >
                <span className="font-mono text-xs font-bold text-agri-clay">
                  [0{idx + 1}]
                </span>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold leading-6 text-agri-ink">
                    {pap.title}
                  </h3>
                  <p className="text-xs text-agri-muted">
                    {pap.authors} ({pap.year}) —{" "}
                    <em className="text-agri-primary">{pap.source}</em>
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Footer Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-agri-primary/20 pt-6 text-xs font-semibold">
          <Link
            href="/impact"
            className="text-agri-muted transition-colors hover:text-agri-primary"
          >
            ← Kembali ke Manfaat &amp; Dampak
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center gap-1.5 font-bold text-agri-primary hover:text-agri-clay"
          >
            <span>Tentang Tim &amp; IDTC 2.0</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
