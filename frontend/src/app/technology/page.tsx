import React from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import DossierHeader from "@/components/layout/DossierHeader";

const pipelineStages = [
  {
    num: "01",
    name: "ESP32 Wokwi",
    spec: "DS18B20 + DHT22 + 3x LED",
    role: "Probe & edge logic",
  },
  {
    num: "02",
    name: "MQTT / REST",
    spec: "JSON Telemetry",
    role: "Wi-Fi ingress",
  },
  {
    num: "03",
    name: "FastAPI Gateway",
    spec: "Pydantic v2 filter",
    role: "Buffer & preset",
  },
  {
    num: "04",
    name: "scikit-learn",
    spec: "Random Forest & DT",
    role: "Klasifikasi tabular",
  },
  {
    num: "05",
    name: "Next.js Dossier",
    spec: "Visual rekomendasi",
    role: "Presentasi & uji",
  },
];

const components = [
  {
    num: "01",
    title: "Edge Probe & Wokwi Simulation Layer",
    tech: "ESP32 DevKit-C v4 + DS18B20 + DHT22",
    desc: "Mensimulasikan Probe Pemantau Limbah Glagah berbasis ESP32 yang membaca suhu inti tumpukan via DS18B20 (GPIO 4 + Pull-Up 4.7kΩ) dan suhu/kelembapan udara via DHT22 (GPIO 15), lengkap dengan 3x LED indikator (GPIO 25–27) dan Piezo Buzzer (GPIO 14).",
    features: [
      "Firmware C++ Arduino di Wokwi (Project #478499231234367489)",
      "Klasifikasi lokal (LED + Buzzer) tetap bekerja saat internet terputus",
      "Transmisi JSON via MQTT (broker.hivemq.com) dan REST API backend",
    ],
  },
  {
    num: "02",
    title: "Ingress & REST API Gateway",
    tech: "FastAPI (Python 3.11+) + Pydantic v2",
    desc: "Menyediakan endpoint REST API asynchronous untuk menerima payload dari ESP32, memvalidasi rentang fisis data, serta mengelola buffer telemetri dan preset lapangan.",
    features: [
      "Endpoint POST /api/v1/telemetry/sample & POST /api/v1/predict",
      "Validasi skema ketat Pydantic v2 dan CORS allow-list",
      "Buffer pembacaan terakhir & katalog sampel Pemalang–Purbalingga",
    ],
  },
  {
    num: "03",
    title: "Machine Learning Analytics Engine",
    tech: "scikit-learn + Pandas + NumPy",
    desc: "Engine inferensi berbasis data tabular numerik. Menggunakan Random Forest Classifier sebagai model utama dan Decision Tree sebagai pembanding untuk menguji kesepakatan klasifikasi.",
    features: [
      "Model terlatih Random Forest & Decision Tree (.joblib)",
      "Distribusi probabilitas 3 kelas (Benih, Briket, Kompos)",
      "Modul eksplanasi faktor penentu dan rekomendasi uji lab",
    ],
  },
  {
    num: "04",
    title: "Interactive Presentation Layer",
    tech: "Next.js 14 + Tailwind CSS + TypeScript",
    desc: "Antarmuka dossier riset dan demonstrasi yang menghubungkan pengamat dengan skematik ESP32 Wokwi, telemetri langsung, serta kalkulator inferensi Machine Learning.",
    features: [
      "Tampilan kontras tinggi ramah proyektor maupun layar lapangan",
      "Sinkronisasi parameter langsung dari simulasi probe ke inferensi ML",
      "Struktur dokumentasi riset terpisah antara simulasi dan fakta lapangan",
    ],
  },
];

export default function TechnologyPage() {
  return (
    <div className="pb-20">
      <DossierHeader
        eyebrow="Arsitektur & spesifikasi AIoT"
        title={
          <>
            Alur sistem modular{" "}
            <span className="text-agri-primary">dari probe ke model.</span>
          </>
        }
        summary="Menghubungkan mikrokontroler tepi, gateway API, engine klasifikasi tabular, dan antarmuka dokumentasi secara terpisah agar setiap lapisan mudah diuji."
        maxWidthClass="max-w-6xl"
      />

      <div className="mx-auto max-w-6xl space-y-14 px-4 pt-10 sm:px-6 lg:px-8">
        {/* End-to-End Architectural Pipeline */}
        <section className="border border-agri-ink/25 bg-agri-dark text-agri-bg">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-agri-bg/15 px-6 py-4">
            <h2 className="display-serif text-2xl text-agri-bg">
              Alur Integrasi End-to-End (Decoupled Architecture)
            </h2>
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-agri-emeraldLight">
              5 lapisan terpisah
            </span>
          </div>

          <div className="grid divide-y divide-agri-bg/15 md:grid-cols-5 md:divide-x md:divide-y-0">
            {pipelineStages.map((st) => (
              <div key={st.num} className="flex flex-col justify-between p-5">
                <div className="flex items-center justify-between font-mono text-[11px] text-agri-amberLight">
                  <span>{st.num}</span>
                  <span className="text-agri-bg/35">→</span>
                </div>
                <div className="mt-5">
                  <div className="text-sm font-bold text-white">{st.name}</div>
                  <div className="mt-1 font-mono text-[11px] text-agri-emeraldLight">
                    {st.spec}
                  </div>
                </div>
                <div className="mt-4 border-t border-agri-bg/10 pt-2.5 text-[11px] text-agri-bg/65">
                  {st.role}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4 Subsystem Specifications */}
        <section className="grid border border-agri-primary/20 bg-white/80 md:grid-cols-2">
          {components.map((c, idx) => (
            <article
              key={c.num}
              className={`flex flex-col justify-between border-b border-agri-primary/15 p-6 sm:p-8 ${
                idx % 2 === 0 ? "md:border-r" : ""
              } ${idx >= 2 ? "md:border-b-0" : ""}`}
            >
              <div className="space-y-3">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="display-serif text-3xl leading-none text-agri-clay">
                    {c.num}
                  </span>
                  <span className="font-mono text-[11px] font-semibold text-agri-primary">
                    {c.tech}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-agri-ink">{c.title}</h3>
                <p className="text-xs leading-6 text-agri-muted sm:text-sm">
                  {c.desc}
                </p>
              </div>

              <ul className="mt-6 space-y-2 border-t border-agri-primary/15 pt-4 text-xs text-agri-ink">
                {c.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-agri-primary" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        {/* Engineering Justification: Tabular ML over DL/CV */}
        <section className="grid gap-8 border-t border-agri-primary/20 pt-10 lg:grid-cols-[0.65fr_1.35fr]">
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-agri-clay">
              Keputusan rekayasa
            </p>
            <h2 className="display-serif text-3xl leading-tight text-agri-ink">
              Mengapa tanpa Deep Learning atau Computer Vision.
            </h2>
          </div>

          <div className="space-y-4 text-sm leading-7 text-agri-muted">
            <p>
              Pemilihan model tabular mengikuti prinsip rekayasa tepat guna (
              <em>fit-for-purpose engineering</em>):
            </p>
            <ul className="divide-y divide-agri-primary/15 border-y border-agri-primary/20">
              <li className="py-4">
                <strong className="text-agri-ink">
                  Karakteristik data alami:
                </strong>{" "}
                Penentu kelayakan briket biomassa dan kompos adalah parameter
                fisik-kimia kuantitatif (kadar air %, massa, suhu inti, umur
                simpan) yang tidak dapat dibaca secara akurat dari foto kamera
                saja.
              </li>
              <li className="py-4">
                <strong className="text-agri-ink">
                  Efisiensi komputasi &amp; biaya:
                </strong>{" "}
                Random Forest dan Decision Tree berjalan ringan di server mikro
                maupun edge gateway tanpa GPU mahal, jauh lebih realistis untuk
                konteks UMKM sapu di daerah.
              </li>
              <li className="py-4">
                <strong className="text-agri-ink">
                  Interpretabilitas keputusan:
                </strong>{" "}
                Kontribusi tiap fitur (<em>feature importance</em>) dapat
                ditelusuri langsung sehingga dewan juri dan pengrajin memahami
                alasan di balik setiap rekomendasi.
              </li>
            </ul>
          </div>
        </section>

        {/* Footer Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-agri-primary/20 pt-6 text-xs font-semibold">
          <Link
            href="/research"
            className="text-agri-muted transition-colors hover:text-agri-primary"
          >
            ← Kembali ke Metodologi Riset
          </Link>
          <Link
            href="/impact"
            className="inline-flex items-center gap-1.5 font-bold text-agri-primary hover:text-agri-clay"
          >
            <span>Lanjut ke Manfaat &amp; Dampak</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
