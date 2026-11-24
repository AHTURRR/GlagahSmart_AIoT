import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import DossierHeader from "@/components/layout/DossierHeader";

const teamMembers = [
  {
    role: "System Analyst & Lead Researcher",
    focus:
      "Kajian rantai pasok glagah Pemalang–Purbalingga, perumusan metodologi, dan formulasi batasan SNI.",
  },
  {
    role: "IoT & Embedded Systems Engineer",
    focus:
      "Perancangan firmware ESP32 Wokwi, sensor DHT22 & DS18B20, kalibrasi sinyal, dan transmisi HTTP/MQTT.",
  },
  {
    role: "Machine Learning Engineer",
    focus:
      "Pengembangan dataset terstandar, pelatihan Random Forest & Decision Tree scikit-learn, serta explainability.",
  },
  {
    role: "Full-Stack Software Engineer",
    focus:
      "Pengembangan REST API FastAPI asynchronous, validasi Pydantic v2, dan antarmuka Next.js TypeScript.",
  },
  {
    role: "Agritechnology & UI/UX Specialist",
    focus:
      "Karakterisasi biomassa, desain interaksi pengguna, komunikasi ilmiah, dan aksesibilitas antarmuka.",
  },
];

const roadmap = [
  {
    year: "2026",
    phase: "Fase saat ini",
    title: "Proof of Concept & Validasi Laboratorium Terpadu",
    desc: "Finalisasi prototipe AIoT Wokwi dan Machine Learning untuk kompetisi IDTC 2.0, dilanjutkan dengan pengujian sampel fisik di laboratorium benih dan biomassa.",
    status: "Berlangsung",
  },
  {
    year: "2027",
    phase: "Fase fabrikasi",
    title: "Fabrikasi Hardware Fisik & Pilot Sortasi Konveyor",
    desc: "Implementasi hardware ESP32 fisik dengan enclosure industri (IP65) dan perancangan konveyor pemilah mekanis di salah satu bengkel pengrajin Purbalingga.",
    status: "Direncanakan",
  },
  {
    year: "2028",
    phase: "Fase scale-up",
    title: "Kemitraan Koperasi & Unit Usaha Briket Sirkular",
    desc: "Replikasi sistem ke sentra kerajinan sapu di Bojongsari dan Karangreja, serta pendirian unit produksi briket biomassa berbasis koperasi desa.",
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
            Tim lintas disiplin{" "}
            <span className="text-agri-primary">di balik GlagahSmart.</span>
          </>
        }
        summary="Kolaborasi riset agriteknologi, rekayasa perangkat tertanam, pembelajaran mesin tabular, dan pengembangan web untuk hilirisasi residu glagah Jawa Tengah."
        maxWidthClass="max-w-6xl"
      />

      <div className="mx-auto max-w-6xl space-y-16 px-4 pt-10 sm:px-6 lg:px-8">
        {/* Competition Dossier Block */}
        <section className="border border-agri-ink/25 bg-agri-dark p-6 text-agri-bg sm:p-9">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-agri-bg/15 pb-4 font-mono text-[11px] uppercase tracking-[0.14em]">
            <span className="text-agri-emeraldLight">Kompetisi resmi</span>
            <span className="text-agri-bg/70">Penyelenggaraan · 2026</span>
          </div>

          <div className="mt-6 max-w-3xl space-y-3">
            <h2 className="display-serif text-3xl text-white sm:text-5xl">
              IDTC 2.0 – AIoT Future Competition 2026
            </h2>
            <p className="text-sm leading-7 text-agri-bg/80">
              Dikembangkan sebagai karya riset terapan pada kategori{" "}
              <strong className="text-white">
                Agriteknologi &amp; AIoT Terapan
              </strong>
              , dengan studi kasus sentra kerajinan sapu glagah Kabupaten
              Pemalang dan Kabupaten Purbalingga, Jawa Tengah.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-x-8 gap-y-2 border-t border-agri-bg/15 pt-4 font-mono text-xs text-agri-bg/70">
            <span>
              Fokus: <strong className="text-agri-bg">AIoT Profiling &amp; Verification</strong>
            </span>
            <span>
              Status: <strong className="text-agri-bg">Research-Based Prototype (PoC)</strong>
            </span>
          </div>
        </section>

        {/* Interdisciplinary Team Directory */}
        <section className="grid gap-8 lg:grid-cols-[0.65fr_1.35fr]">
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-agri-clay">
              Struktur peran
            </p>
            <h2 className="display-serif text-3xl leading-tight text-agri-ink sm:text-4xl">
              Lima pilar kompetensi tim.
            </h2>
          </div>

          <div className="divide-y divide-agri-primary/15 border-y border-agri-primary/20 bg-white/65">
            {teamMembers.map((m, idx) => (
              <div
                key={m.role}
                className="grid gap-2 px-5 py-4 sm:grid-cols-[3rem_1fr]"
              >
                <span className="display-serif text-2xl leading-none text-agri-clay">
                  0{idx + 1}
                </span>
                <div>
                  <h3 className="text-sm font-bold text-agri-ink">{m.role}</h3>
                  <p className="mt-1 text-xs leading-6 text-agri-muted">
                    {m.focus}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Long-Term Roadmap */}
        <section className="grid gap-8 border-t border-agri-primary/20 pt-10 lg:grid-cols-[0.65fr_1.35fr]">
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-agri-clay">
              Peta jalan
            </p>
            <h2 className="display-serif text-3xl leading-tight text-agri-ink sm:text-4xl">
              Evolusi dari purwarupa menuju adopsi UMKM.
            </h2>
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
                <span>Klasifikasi ML</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
