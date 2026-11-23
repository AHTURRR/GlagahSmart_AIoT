"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight, BarChart3, Check, Cpu, FlaskConical, MapPin, Recycle, Sprout } from "lucide-react";

const routes = [
  { title: "Benih", note: "Bahan segar dengan struktur biji yang masih utuh.", signal: "Kadar air 10–18%", icon: Sprout, tone: "text-agri-primary" },
  { title: "Briket", note: "Serbuk kering yang siap diuji untuk densifikasi energi.", signal: "Kadar air ≤ 12%", icon: BarChart3, tone: "text-agri-clay" },
  { title: "Kompos", note: "Residu lembap untuk campuran organik dan perbaikan tanah.", signal: "Kelembapan 30–60%", icon: Recycle, tone: "text-agri-emeraldDark" },
];

const researchLog = [
  ["01", "Lapangan", "Pemanenan dan sortasi bahan"],
  ["02", "Sensor", "Suhu, kelembapan, dan kondisi inti"],
  ["03", "Model", "Random Forest dan Decision Tree"],
  ["04", "Validasi", "Uji SNI/ISTA masih berjalan"],
];

export default function HomePage() {
  return (
    <div className="pb-20">
      <section className="relative overflow-hidden border-b border-agri-primary/20 pb-16 pt-12 sm:pb-24 sm:pt-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-end lg:px-8">
          <div className="max-w-4xl space-y-7">
            <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-agri-clay"><span className="h-px w-10 bg-agri-clay" />Catatan riset · 2026</div>
            <h1 className="display-serif max-w-3xl text-5xl leading-[0.95] text-agri-ink sm:text-7xl lg:text-8xl">Dari residu,<br /><span className="text-agri-primary">baca nilainya.</span></h1>
            <p className="max-w-2xl text-xl font-semibold leading-snug text-agri-primary sm:text-2xl">GlagahSmart menghubungkan pembacaan sensor, konteks lapangan, dan klasifikasi yang dapat diuji.</p>
            <p className="max-w-2xl text-base leading-8 text-agri-muted sm:text-lg">Sebuah prototipe riset untuk menjawab pertanyaan praktis: apakah residu bunga glagah lebih masuk akal disiapkan sebagai <strong className="text-agri-ink">benih, briket, atau kompos</strong>? Data simulasi ditandai apa adanya; klaim lapangan menunggu validasi.</p>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link href="/simulation" className="flex min-h-12 items-center gap-2 bg-agri-primary px-5 text-sm font-bold text-white transition-colors hover:bg-agri-primaryLight"><Cpu className="h-4 w-4 text-agri-emeraldLight" />Lihat pembacaan sensor</Link>
              <Link href="/classification" className="flex min-h-12 items-center gap-2 border border-agri-primary/30 bg-white/60 px-5 text-sm font-bold text-agri-primary transition-colors hover:bg-white"><FlaskConical className="h-4 w-4" />Uji satu sampel</Link>
              <Link href="/background" className="min-h-12 px-2 py-3.5 text-sm font-semibold text-agri-muted transition-colors hover:text-agri-primary">Baca konteks lapangan <ArrowRight className="ml-1 inline h-4 w-4" /></Link>
            </div>
            <div className="field-rule grid grid-cols-2 gap-x-5 gap-y-5 pt-6 sm:grid-cols-4">
              <div><div className="text-xs font-medium text-agri-muted">Fokus</div><div className="text-sm font-bold text-agri-ink">Residu sapu glagah</div></div>
              <div><div className="text-xs font-medium text-agri-muted">Lokus</div><div className="text-sm font-bold text-agri-ink">Pemalang · Purbalingga</div></div>
              <div><div className="text-xs font-medium text-agri-muted">Model</div><div className="text-sm font-bold text-agri-ink">Random Forest</div></div>
              <div><div className="text-xs font-medium text-agri-muted">Status</div><div className="text-sm font-bold text-agri-ink">PoC terkalibrasi</div></div>
            </div>
          </div>
          <aside className="paper-panel relative p-6 lg:mb-1">
            <div className="flex items-center justify-between border-b border-agri-primary/15 pb-4 text-xs font-bold uppercase tracking-[0.16em] text-agri-muted"><span>Field note 01</span><span className="text-agri-clay">●</span></div>
            <p className="display-serif mt-6 text-2xl leading-tight text-agri-ink">“Yang dibuang belum tentu kehilangan nilai.”</p>
            <p className="mt-6 text-sm leading-6 text-agri-muted">Sistem memulai dari keadaan bahan, bukan dari asumsi produk akhirnya.</p>
            <div className="mt-8 border-t border-agri-primary/15 pt-4 text-xs text-agri-muted"><span className="font-bold text-agri-primary">3</span> kemungkinan hilirisasi untuk diuji</div>
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
          <div className="space-y-4"><p className="text-xs font-bold uppercase tracking-[0.18em] text-agri-clay">Keputusan yang ingin dibantu</p><h2 className="display-serif text-4xl leading-tight text-agri-ink sm:text-5xl">Bukan sekadar klasifikasi.</h2><p className="max-w-sm text-sm leading-7 text-agri-muted">Setiap hasil adalah arah kerja berikutnya, bukan klaim akhir. Sampel perlu dibaca bersama konteks dan diuji kembali.</p></div>
          <div className="grid gap-4 md:grid-cols-3">
            {routes.map((route) => { const Icon = route.icon; return <article key={route.title} className="paper-panel flex min-h-64 flex-col justify-between p-6 transition-transform hover:-translate-y-1"><div><Icon className={`h-7 w-7 ${route.tone}`} /><h3 className="mt-8 font-display text-3xl text-agri-ink">{route.title}</h3><p className="mt-3 text-sm leading-6 text-agri-muted">{route.note}</p></div><p className="mt-8 border-t border-agri-primary/15 pt-3 text-xs font-bold uppercase tracking-[0.12em] text-agri-primary">{route.signal}</p></article>; })}
          </div>
        </div>
      </section>

      <section className="border-y border-agri-primary/15 bg-white/45">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[0.7fr_1.3fr] lg:px-8">
          <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-agri-clay">Log kerja</p><h2 className="display-serif mt-4 text-4xl leading-tight text-agri-ink">Dari kebun ke keputusan.</h2><p className="mt-5 max-w-sm text-sm leading-7 text-agri-muted">Empat lapisan yang menjaga sistem tetap terbaca: apa yang diamati, apa yang diukur, apa yang dihitung, dan apa yang masih harus dibuktikan.</p></div>
          <div className="divide-y divide-agri-primary/15 border-y border-agri-primary/15">
            {researchLog.map(([number, label, title]) => <div key={number} className="grid gap-3 py-5 sm:grid-cols-[3.5rem_7rem_1fr] sm:items-center"><span className="font-display text-2xl text-agri-clay">{number}</span><span className="text-xs font-bold uppercase tracking-[0.15em] text-agri-muted">{label}</span><span className="text-sm font-semibold text-agri-ink">{title}</span></div>)}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-end">
          <div className="border-l-2 border-agri-clay pl-6"><p className="text-xs font-bold uppercase tracking-[0.18em] text-agri-clay">Batasan yang sengaja terlihat</p><h2 className="display-serif mt-4 max-w-2xl text-4xl leading-tight text-agri-ink sm:text-5xl">Data simulasi bukan bukti lapangan.</h2><p className="mt-5 max-w-xl text-base leading-8 text-agri-muted">Wokwi membantu demonstrasi alur sensor. Model menggunakan baseline sintetis. Uji laboratorium SNI/ISTA dan validasi dengan pengrajin tetap menjadi langkah penting.</p></div>
          <div className="paper-panel p-6"><div className="flex items-center gap-3 text-sm font-bold text-agri-primary"><Check className="h-5 w-5" /> Status prototipe terbuka</div><p className="mt-4 text-sm leading-7 text-agri-muted">Dokumentasi metodologi, arsitektur, dan sumber rujukan tersedia untuk ditinjau.</p><Link href="/research" className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-agri-primary hover:text-agri-clay">Buka catatan metodologi <ArrowUpRight className="h-4 w-4" /></Link></div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><div className="bg-agri-primary px-6 py-10 text-white sm:px-10"><div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-agri-emeraldLight">Mulai dari bahan yang ada</p><h2 className="display-serif mt-3 text-4xl leading-tight sm:text-5xl">Lihat sistemnya bekerja.</h2></div><div className="flex flex-wrap gap-3"><Link href="/simulation" className="flex min-h-11 items-center gap-2 bg-white px-4 text-sm font-bold text-agri-primary hover:bg-agri-bg">Buka simulasi <ArrowRight className="h-4 w-4" /></Link><Link href="/classification" className="flex min-h-11 items-center gap-2 border border-white/40 px-4 text-sm font-bold text-white hover:bg-white/10">Uji klasifikasi <ArrowRight className="h-4 w-4" /></Link></div></div></div></section>
    </div>
  );
}
