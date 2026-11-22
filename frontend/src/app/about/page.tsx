import React from "react";
import Link from "next/link";
import { 
  Users, 
  Award, 
  MapPin, 
  Calendar, 
  ArrowRight, 
  Sparkles, 
  Cpu, 
  Code2, 
  CheckCircle2, 
  Compass 
} from "lucide-react";

export default function AboutPage() {
  const teamMembers = [
    {
      role: "System Analyst & Lead Researcher",
      focus: "Kajian rantai pasok glagah Pemalang-Purbalingga, perumusan metodologi, dan formulasi batasan SNI.",
    },
    {
      role: "IoT & Embedded Systems Engineer",
      focus: "Perancangan firmware ESP32 Wokwi, sensor DHT22, kalibrasi analog, dan transmisi protokol HTTP/MQTT.",
    },
    {
      role: "Machine Learning Engineer",
      focus: "Pengembangan dataset terstandar, pelatihan model Random Forest & Decision Tree scikit-learn, dan explainable AI.",
    },
    {
      role: "Full-Stack Software Engineer",
      focus: "Pengembangan REST API FastAPI asynchronous, integrasi Pydantic v2, dan aplikasi Next.js TypeScript.",
    },
    {
      role: "Agritechnology & UI/UX Specialist",
      focus: "Karakterisasi biomassa, desain interaksi pengguna, visual storytelling, dan pengujian aksesibilitas WCAG 2.1.",
    },
  ];

  const roadmap = [
    {
      year: "2026 (Fase Saat Ini)",
      title: "Proof of Concept & Validasi Laboratorium Terpadu",
      desc: "Finalisasi prototipe AIoT Wokwi dan Machine Learning untuk kompetisi IDTC 2.0, dilanjutkan dengan pengujian sampel fisik di laboratorium pengujian benih dan biomassa.",
      status: "Berlangsung",
    },
    {
      year: "2027 (Fase Fabrikasi)",
      title: "Fabrikasi Hardware Fisik & Pilot Sortasi Konveyor",
      desc: "Implementasi prototipe hardware ESP32 fisik dengan enclosure industri (IP65) dan perancangan konveyor pemilah mekanis otomatis di salah satu bengkel pengrajin Purbalingga.",
      status: "Direncanakan",
    },
    {
      year: "2028 (Fase Scale-Up)",
      title: "Kemitraan Koperasi & Unit Usaha Briket Sirkular",
      desc: "Replikasi sistem ke seluruh sentra kerajinan sapu di Bojongsari dan Karangreja, serta pendirian unit produksi briket biomassa berbasis koperasi desa.",
      status: "Direncanakan",
    },
  ];

  return (
    <div className="py-12 bg-agri-bg min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-agri-surface border border-agri-emerald/30 text-agri-primary text-xs font-semibold">
            <Users className="w-4 h-4 text-agri-emerald" />
            <span>Profil Inovasi & Pengembang</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-agri-dark tracking-tight">
            Tentang GlagahSmart AIoT & Tim Pengembang
          </h1>
          <p className="text-slate-600 text-base leading-relaxed">
            Dedikasi kolaboratif lintas disiplin untuk memajukan agriteknologi lokal, memberdayakan pengrajin tradisional, dan mengoptimalkan ekonomi sirkular biomassa di Indonesia.
          </p>
        </div>

        {/* Informasi Kompetisi IDTC 2.0 */}
        <div className="rounded-3xl bg-slate-900 text-white p-8 sm:p-10 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-agri-emeraldLight text-xs font-bold uppercase tracking-wider">
              <Award className="w-5 h-5 text-agri-emerald" />
              <span>Kompetisi Resmi</span>
            </div>
            <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-700">
              Tahun Penyelenggaraan: 2026
            </span>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              IDTC 2.0 – AIoT Future Competition 2026
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed max-w-3xl">
              Proyek ini dikembangkan khusus sebagai karya kompetisi riset terapan pada kategori <strong>Agriteknologi & AIoT Terapan</strong>, dengan studi kasus sentra kerajinan sapu glagah Kabupaten Pemalang dan Kabupaten Purbalingga, Jawa Tengah.
            </p>
          </div>

          <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center gap-6 text-xs text-slate-400">
            <div>Fokus: <strong>AIoT Project Profiling & Verification</strong></div>
            <div>•</div>
            <div>Status: <strong>Research-Based Prototype (PoC)</strong></div>
          </div>
        </div>

        {/* Tim Pengembang & Peran Disiplin */}
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-soft space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-agri-dark flex items-center gap-2.5">
              <Sparkles className="w-6 h-6 text-agri-primary" />
              Komposisi Tim & Keahlian Interdisipliner
            </h2>
            <p className="text-xs text-slate-500">
              Pengembangan GlagahSmart menggabungkan 5 pilar kompetensi utama:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {teamMembers.map((m, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="text-[10px] font-bold text-agri-primary uppercase tracking-wider bg-agri-surface px-2 py-0.5 rounded">
                  Pilar {idx + 1}
                </span>
                <h4 className="font-bold text-sm text-agri-dark pt-1">{m.role}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{m.focus}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Roadmap Pengembangan Jangka Panjang */}
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-soft space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-agri-dark flex items-center gap-2.5">
              <Compass className="w-6 h-6 text-agri-emerald" />
              Roadmap Pengembangan Jangka Panjang
            </h2>
            <p className="text-xs text-slate-500">
              Tahapan evolusi GlagahSmart dari tahap purwarupa kompetisi menuju adopsi massal UMKM:
            </p>
          </div>

          <div className="space-y-4">
            {roadmap.map((rm, idx) => (
              <div key={idx} className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-bold text-xs text-agri-primary bg-agri-surface px-2.5 py-0.5 rounded-full border border-agri-emerald/20">
                    {rm.year}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                    {rm.status}
                  </span>
                </div>
                <h3 className="font-bold text-sm text-agri-dark">{rm.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{rm.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Skenario Presentasi Juri */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-agri-primary to-agri-primaryDark text-white flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">
              Mulai Penilaian Skenario Demonstrasi
            </h3>
            <p className="text-xs text-slate-200">
              Akses modul demonstrasi interaktif Wokwi ESP32 dan klasifikasi Machine Learning.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/simulation"
              className="px-5 py-2.5 rounded-xl bg-white text-agri-primary font-bold text-xs hover:bg-slate-100 transition-colors shadow-sm"
            >
              Simulasi Wokwi
            </Link>
            <Link
              href="/classification"
              className="px-5 py-2.5 rounded-xl bg-agri-emerald text-slate-950 font-bold text-xs hover:bg-agri-emeraldLight transition-colors shadow-sm"
            >
              Klasifikasi ML
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
