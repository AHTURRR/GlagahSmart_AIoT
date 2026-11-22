import React from "react";
import Link from "next/link";
import { 
  Cpu, 
  Layers, 
  Database, 
  Server, 
  Globe, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Code2
} from "lucide-react";

export default function TechnologyPage() {
  const components = [
    {
      title: "1. Edge Probe & Wokwi Simulation Layer",
      tech: "ESP32 DevKit-C v4 + DS18B20 + DHT22",
      icon: <Cpu className="w-6 h-6 text-agri-emerald" />,
      desc: "Mensimulasikan Probe Pemantau Limbah Glagah berbasis ESP32 yang membaca suhu inti tumpukan via DS18B20 (GPIO 4 + Pull-Up 4.7kΩ) dan suhu/kelembapan udara via DHT22 (GPIO 15), lengkap dengan 3x LED indikator (GPIO 25–27) dan Piezo Buzzer (GPIO 14).",
      features: [
        "Firmware C++ Arduino nyata di Wokwi (Project #478499231234367489)",
        "Klasifikasi lokal (LED + Buzzer) tetap bekerja walau internet putus",
        "Transmisi JSON via MQTT (broker.hivemq.com) & REST API backend"
      ]
    },
    {
      title: "2. Ingress & REST API Gateway",
      tech: "FastAPI (Python 3.11+) + Pydantic v2",
      icon: <Server className="w-6 h-6 text-sky-500" />,
      desc: "Menyediakan endpoint REST API asynchronous berkinerja tinggi untuk menerima payload data dari ESP32, memvalidasi integritas data fisis, dan mengelola buffer telemetri.",
      features: [
        "Endpoint POST /api/v1/telemetry/sample",
        "Validasi tipe ketat Pydantic v2",
        "Buffer data terkini & katalog preset lapangan"
      ]
    },
    {
      title: "3. Machine Learning Analytics Engine",
      tech: "scikit-learn + Pandas + NumPy",
      icon: <Sparkles className="w-6 h-6 text-amber-500" />,
      desc: "Engine inferensi berbasis data tabular numerik. Menggunakan Random Forest Classifier sebagai model utama dan Decision Tree sebagai pembanding untuk memastikan kesepakatan klasifikasi.",
      features: [
        "Model terlatih: Random Forest & Decision Tree (.joblib)",
        "Probabilitas 3 kelas (Benih, Briket, Kompos)",
        "Modul eksplanasi faktor penentu saintifik"
      ]
    },
    {
      title: "4. Interactive Presentation Layer",
      tech: "Next.js 14 + Tailwind CSS + TypeScript",
      icon: <Globe className="w-6 h-6 text-agri-primary" />,
      desc: "Antarmuka profil inovasi modern berbasis storytelling yang menghubungkan pengunjung dan dewan juri dengan simulasi akuisisi sensor Wokwi dan kalkulator Machine Learning.",
      features: [
        "Desain responsif ramah mobile & layar proyektor",
        "Visualisasi bar probabilitas & kartu rekomendasi",
        "Navigasi skenario presentasi terstruktur"
      ]
    }
  ];

  return (
    <div className="py-12 bg-agri-bg min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-agri-surface border border-agri-emerald/30 text-agri-primary text-xs font-semibold">
            <Layers className="w-4 h-4 text-agri-emerald" />
            <span>Arsitektur & Spesifikasi AIoT</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-agri-dark tracking-tight">
            Arsitektur Sistem & Alur Kerja Teknologi
          </h1>
          <p className="text-slate-600 text-base leading-relaxed">
            Menghubungkan mikrokontroler tepi, gateway backend API, engine Machine Learning tabular, dan antarmuka profil dalam arsitektur AIoT yang modular, terukur, dan akuntabel.
          </p>
        </div>

        {/* Diagram Alur Sistem */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-soft space-y-6">
          <h2 className="text-2xl font-bold text-agri-dark">
            Alur Integrasi Sistem End-to-End
          </h2>

          <div className="p-6 rounded-2xl bg-slate-900 text-white space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-center text-xs">
              
              <div className="p-4 rounded-xl bg-slate-800 border border-slate-700 space-y-1.5 flex flex-col justify-between">
                <div className="font-bold text-agri-emeraldLight">1. ESP32 Wokwi</div>
                <div className="text-[11px] text-slate-300">DS18B20 + DHT22 + LED</div>
                <div className="text-[10px] text-slate-400">Probe & Edge Logic</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-800 border border-slate-700 space-y-1.5 flex flex-col justify-between">
                <div className="font-bold text-sky-400">2. MQTT / REST</div>
                <div className="text-[11px] text-slate-300">JSON Telemetry</div>
                <div className="text-[10px] text-slate-400">Wi-Fi Ingress</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-800 border border-slate-700 space-y-1.5 flex flex-col justify-between">
                <div className="font-bold text-amber-400">3. FastAPI Gateway</div>
                <div className="text-[11px] text-slate-300">Pydantic v2 Filter</div>
                <div className="text-[10px] text-slate-400">Data Buffer</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-800 border border-slate-700 space-y-1.5 flex flex-col justify-between">
                <div className="font-bold text-emerald-400">4. scikit-learn</div>
                <div className="text-[11px] text-slate-300">Random Forest & DT</div>
                <div className="text-[10px] text-slate-400">ML Classification</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-800 border border-slate-700 space-y-1.5 flex flex-col justify-between">
                <div className="font-bold text-agri-emeraldLight">5. Next.js Web</div>
                <div className="text-[11px] text-slate-300">Visual Rekomendasi</div>
                <div className="text-[10px] text-slate-400">Presentasi Juri</div>
              </div>

            </div>

            <div className="text-center text-[11px] text-slate-400 border-t border-slate-800 pt-3">
              Alur data terisolasi secara bersih (Decoupled Architecture), memudahkan pemeliharaan dan pengujian independen.
            </div>
          </div>
        </div>

        {/* 4 Komponen Utama */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {components.map((c, i) => (
            <div key={i} className="bg-white rounded-2xl p-7 border border-slate-200 shadow-soft space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center">
                    {c.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-agri-dark">{c.title}</h3>
                    <div className="text-xs font-semibold text-agri-primary">{c.tech}</div>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {c.desc}
                </p>
              </div>

              <div className="space-y-1.5 pt-3 border-t border-slate-100 text-xs">
                <div className="font-semibold text-slate-800">Fitur Utama:</div>
                {c.features.map((f, fi) => (
                  <div key={fi} className="flex items-center gap-2 text-slate-600 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-agri-emerald shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Alasan Tidak Menggunakan Deep Learning / CV */}
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-soft space-y-4">
          <h2 className="text-xl font-bold text-agri-dark flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-agri-primary" />
            Justifikasi Pemilihan Teknologi Machine Learning
          </h2>
          <div className="text-slate-600 text-xs leading-relaxed space-y-3">
            <p>
              Keputusan untuk <strong>tidak menggunakan Computer Vision atau Deep Learning</strong> didasarkan pada prinsip rekayasa sistem yang tepat guna (*fit-for-purpose engineering*):
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                <strong>Karakteristik Data Alami:</strong> Penentu kelayakan briket biomassa dan kompos adalah parameter fisik-kimia kuantitatif (kadar air %, berat jenis, umur simpan) yang tidak dapat dinilai secara akurat hanya dari citra visual kamera.
              </li>
              <li>
                <strong>Efisiensi Komputasi & Biaya:</strong> Model Random Forest dan Decision Tree berbasis scikit-learn membutuhkan daya komputasi minimal, dapat dijalankan secara instan di edge gateway atau server mikro tanpa GPU mahal, sehingga sangat terjangkau bagi UMKM sapu di daerah.
              </li>
              <li>
                <strong>Interpretabilitas (Explainable AI):</strong> Random Forest dan Decision Tree memungkinkan kita melacak kontribusi setiap fitur (feature importance) sehingga dewan juri dan pengrajin dapat memahami alasan di balik setiap rekomendasi secara transparan.
              </li>
            </ul>
          </div>
        </div>

        {/* CTA */}
        <div className="flex items-center justify-between pt-4">
          <Link
            href="/research"
            className="text-xs font-semibold text-slate-600 hover:text-agri-primary"
          >
            ← Kembali ke Metodologi Riset
          </Link>
          <Link
            href="/impact"
            className="flex items-center gap-1.5 text-xs font-bold text-agri-primary hover:text-agri-primaryLight"
          >
            <span>Lanjut ke Manfaat & Dampak</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}
