import React from "react";
import Link from "next/link";
import { ArrowRight, GraduationCap, Building2, FileText, Cpu, Globe, CheckCircle2 } from "lucide-react";
import DossierHeader from "@/components/layout/DossierHeader";

interface TeamMember {
  name: string;
  role: string;
  badge: string;
  institution: string;
  focus: string;
  contributions: string[];
}

const teamMembers: TeamMember[] = [
  {
    name: "Riska Yuliyanti",
    role: "Team Lead & Proposal Strategist",
    badge: "Ketua Tim",
    institution: "UIN K.H. Abdurrahman Wahid Pekalongan",
    focus:
      "Kepemimpinan tim inovasi Nox Labs, formulasi naskah proposal ilmiah GLAGORA, perumusan business case brief ekonomi sirkular, dan penyelarasan dokumen kompetisi.",
    contributions: [
      "Perumusan business case brief dan identifikasi masalah limbah bunga glagah",
      "Penyusunan naskah proposal ilmiah, estimasi biaya, dan studi kelayakan ekonomi",
      "Penyelarasan narasi inovasi dengan kriteria penilaian dewan juri",
      "Koordinasi linimasa pengerjaan proyek dan komunikasi tim Nox Labs",
    ],
  },
  {
    name: "Abdul Muhis",
    role: "IoT & Embedded Systems Engineer",
    badge: "Hardware & Firmware",
    institution: "UIN K.H. Abdurrahman Wahid Pekalongan",
    focus:
      "Perancangan node pemantau berbasis ESP32-CAM dalam wadah sampel berpenutup, integrasi sensor DHT22 & probe DS18B20, serta logika peringatan lokal.",
    contributions: [
      "Perancangan arsitektur node perangkat keras berbasis ESP32-CAM",
      "Pengkondisian jalur data sensor: DHT22 (GPIO13) dan bus 1-wire DS18B20 (GPIO14)",
      "Penerapan sistem umpan balik lokal mandiri: LED indikator (GPIO2) dan buzzer aktif (GPIO15)",
      "Desain tata letak komponen wadah sampel berpenutup dengan kamera overhead",
    ],
  },
  {
    name: "Ahmad Turmudi",
    role: "Full-Stack Developer & AI Systems Engineer",
    badge: "Web Dev & AI/ML",
    institution: "UIN K.H. Abdurrahman Wahid Pekalongan",
    focus:
      "Pengembangan web dashboard Next.js, arsitektur backend FastAPI & SQLite, perancangan model Machine Learning & Deep Learning, serta integrasi Sensor & Vision Fusion.",
    contributions: [
      "Pengembangan antarmuka web dashboard interaktif dan field dossier Next.js 14",
      "Arsitektur server REST API FastAPI, validasi Pydantic v2, dan database SQLite",
      "Perancangan model ganda: Machine Learning data sensor & Deep Learning citra kamera",
      "Implementasi matriks Sensor & Vision Fusion serta penanganan status 'Perlu Verifikasi'",
    ],
  },
];

const roadmap = [
  {
    year: "2026",
    phase: "Fase saat ini",
    title: "Proof of Concept & Validasi Skala Rumah Tangga",
    desc: "Finalisasi purwarupa AIoT GLAGORA (ESP32-CAM, DHT22, DS18B20) dan permodelan Sensor-Vision Fusion untuk studi kasus Desa Tlagasana, Watukumpul, Pemalang.",
    status: "Berlangsung",
  },
  {
    year: "2027",
    phase: "Fase fabrikasi",
    title: "Fabrikasi Wadah Terstandar & Pengujian BUMDes",
    desc: "Produksi wadah sampel berpenutup terstandar dengan pencahayaan LED seragam dan implementasi percontohan pada kelompok tani atau BUMDes Desa Tlagasana.",
    status: "Direncanakan",
  },
  {
    year: "2028",
    phase: "Fase scale-up",
    title: "Kemitraan Koperasi & Unit Usaha Kompos/Briket Mandiri",
    desc: "Ekspansi adopsi sistem ke sentra glagah di Jawa Tengah serta hilirisasi produk pupuk organik dan briket biomassa bernilai ekonomi tinggi.",
    status: "Direncanakan",
  },
];

export default function AboutPage() {
  return (
    <div className="pb-20">
      <DossierHeader
        eyebrow="Profil inovasi & tim"
        title={
          <>
            Nox Labs{" "}
            <span className="text-agri-primary">di balik GLAGORA.</span>
          </>
        }
        summary="Kolaborasi riset agriteknologi terapan, rekayasa perangkat tertanam ESP32-CAM, sistem kecerdasan buatan hibrida, dan pengembangan web dari UIN K.H. Abdurrahman Wahid Pekalongan."
        maxWidthClass="max-w-6xl"
      />

      <div className="mx-auto max-w-6xl space-y-16 px-4 pt-10 sm:px-6 lg:px-8">
        {/* Project & Institution Dossier Block */}
        <section className="border border-agri-ink/25 bg-agri-dark p-6 text-agri-bg sm:p-9">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-agri-bg/15 pb-4 font-mono text-[11px] uppercase tracking-[0.14em]">
            <div className="flex items-center gap-2 text-agri-emeraldLight">
              <Building2 className="h-4 w-4" />
              <span>Nox Labs · UIN K.H. Abdurrahman Wahid Pekalongan</span>
            </div>
            <span className="text-agri-bg/70">IDTC 2.0 · 2026</span>
          </div>

          <div className="mt-6 max-w-4xl space-y-3">
            <div className="inline-block border border-agri-emeraldLight/30 bg-agri-primary/40 px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider text-agri-emeraldLight">
              Judul Proposal Inovasi
            </div>
            <h2 className="display-serif text-2xl text-white sm:text-4xl">
              GLAGORA: Smart Biomass Management Sebagai Solusi Inovatif Pengelolaan Limbah Bunga Glagah Berorientasi Ekonomi Sirkular
            </h2>
            <p className="text-sm leading-7 text-agri-bg/80">
              Dikembangkan sebagai solusi AIoT skala rumah tangga untuk petani dan pekebun di{" "}
              <strong className="text-white">Dusun Tlaga Tengah, Desa Tlagasana, Kec. Watukumpul, Kab. Pemalang</strong>. 
              Sistem memadukan pembacaan kondisi fisik material (DHT22 &amp; DS18B20) dan analisis visual citra (ESP32-CAM) melalui pendekatan{" "}
              <strong className="text-white">Sensor &amp; Vision Fusion</strong> guna merekomendasikan tiga jalur hilirisasi: Kompos, Bahan Baku Briket, atau Pemisahan Benih.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 border-t border-agri-bg/15 pt-4 font-mono text-xs text-agri-bg/70 sm:grid-cols-4">
            <div>
              <span className="block text-[10px] uppercase tracking-wider text-agri-bg/50">Tim Pengembang</span>
              <strong className="text-white">Nox Labs</strong>
            </div>
            <div>
              <span className="block text-[10px] uppercase tracking-wider text-agri-bg/50">Asal Instansi</span>
              <strong className="text-white">UIN Gus Dur Pekalongan</strong>
            </div>
            <div>
              <span className="block text-[10px] uppercase tracking-wider text-agri-bg/50">Lokus Sasaran</span>
              <strong className="text-white">Desa Tlagasana, Pemalang</strong>
            </div>
            <div>
              <span className="block text-[10px] uppercase tracking-wider text-agri-bg/50">Status Kesiapan</span>
              <strong className="text-agri-emeraldLight">PoC &amp; Dual AI Modeling</strong>
            </div>
          </div>
        </section>

        {/* Team Directory (3 Members) */}
        <section className="space-y-8">
          <div className="border-b border-agri-primary/20 pb-4">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-agri-clay">
              Struktur Tim Pengembang
            </p>
            <h2 className="display-serif mt-1 text-3xl leading-tight text-agri-ink sm:text-4xl">
              Anggota Tim Nox Labs.
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-agri-muted">
              Tiga pilar kompetensi lintas disiplin yang bertanggung jawab atas formulasi strategi proposal, rekayasa perangkat keras IoT, dan arsitektur perangkat lunak kecerdasan buatan.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {teamMembers.map((member, idx) => (
              <article
                key={member.name}
                className="paper-panel flex flex-col justify-between p-6 transition-all duration-200 hover:border-agri-primary/40 hover:shadow-elevated"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-agri-primary/15 pb-3">
                    <span className="font-mono text-xs font-bold text-agri-clay">
                      MEMBER 0{idx + 1}
                    </span>
                    <span className="border border-agri-primary/20 bg-agri-primary/10 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-agri-primary">
                      {member.badge}
                    </span>
                  </div>

                  <div className="mt-4">
                    <h3 className="display-serif text-2xl text-agri-ink">
                      {member.name}
                    </h3>
                    <p className="mt-1 font-mono text-xs font-bold text-agri-primary">
                      {member.role}
                    </p>
                    <div className="mt-2 flex items-center gap-1.5 text-[11px] text-agri-muted">
                      <GraduationCap className="h-3.5 w-3.5 shrink-0 text-agri-clay" />
                      <span>{member.institution}</span>
                    </div>
                  </div>

                  <p className="mt-4 border-t border-agri-primary/10 pt-3 text-xs leading-5 text-agri-muted">
                    {member.focus}
                  </p>

                  <div className="mt-4 space-y-2 border-t border-agri-primary/10 pt-3">
                    <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-agri-ink">
                      Fokus Kontribusi:
                    </p>
                    <ul className="space-y-1.5">
                      {member.contributions.map((c, cIdx) => (
                        <li
                          key={cIdx}
                          className="flex items-start gap-1.5 text-[11px] leading-4 text-agri-ink/80"
                        >
                          <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-agri-primary" />
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-6 border-t border-agri-primary/15 pt-3 font-mono text-[10px] uppercase tracking-wider text-agri-muted">
                  Nox Labs · GLAGORA Core Team
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Long-Term Roadmap */}
        <section className="grid gap-8 border-t border-agri-primary/20 pt-10 lg:grid-cols-[0.65fr_1.35fr]">
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-agri-clay">
              Peta jalan inovasi
            </p>
            <h2 className="display-serif text-3xl leading-tight text-agri-ink sm:text-4xl">
              Dari skala rumah tangga menuju adopsi BUMDes.
            </h2>
            <p className="text-xs leading-6 text-agri-muted sm:text-sm">
              Tahapan implementasi GLAGORA yang dirancang realistis dan bertahap berdasarkan profil petani di Desa Tlagasana, Watukumpul, Pemalang.
            </p>
          </div>

          <div className="divide-y divide-agri-primary/15 border-y border-agri-primary/20">
            {roadmap.map((rm) => (
              <article
                key={rm.year}
                className="grid gap-4 py-6 sm:grid-cols-[6rem_1fr_auto] sm:items-start"
              >
                <div>
                  <div className="display-serif text-3xl leading-none text-agri-primary">
                    {rm.year}
                  </div>
                  <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-agri-muted">
                    {rm.phase}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-agri-ink">
                    {rm.title}
                  </h3>
                  <p className="text-xs leading-6 text-agri-muted sm:text-sm">
                    {rm.desc}
                  </p>
                </div>
                <span
                  className={`inline-block border px-2.5 py-0.5 font-mono text-[11px] font-bold ${
                    rm.status === "Berlangsung"
                      ? "border-agri-clay/40 bg-[#F5E6DC] text-agri-clay"
                      : "border-agri-ink/20 bg-agri-bg text-agri-muted"
                  }`}
                >
                  {rm.status}
                </span>
              </article>
            ))}
          </div>
        </section>

        {/* Closing Demo Band */}
        <section className="bg-agri-primary px-6 py-9 text-white sm:px-9">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-agri-emeraldLight">
                Skenario demonstrasi
              </p>
              <h2 className="display-serif mt-1 text-3xl sm:text-4xl">
                Uji langsung simulasi sensor dan model klasifikasi.
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
                <span>Uji Sampel Fusion</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
