import React from "react";
import Link from "next/link";
import { 
  BookOpen, 
  MapPin, 
  CheckCircle2, 
  HelpCircle, 
  FileText, 
  ArrowRight,
  ShieldCheck,
  ChevronRight
} from "lucide-react";

export default function BackgroundPage() {
  return (
    <div className="py-12 bg-agri-bg min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-agri-surface border border-agri-emerald/30 text-agri-primary text-xs font-semibold">
            <BookOpen className="w-4 h-4 text-agri-emerald" />
            <span>Konteks Lapangan & Wilayah Studi</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-agri-dark tracking-tight">
            Latar Belakang & Potensi Tanaman Glagah
          </h1>
          <p className="text-slate-600 text-base leading-relaxed">
            Menelusuri keterkaitan ekologis dan ekonomis antara budidaya tanaman glagah di Kabupaten Pemalang serta industri kerajinan sapu rayung tradisional di Kabupaten Purbalingga.
          </p>
        </div>

        {/* Pembedaan Fakta, Observasi & Hipotesis (Transparansi Ilmiah) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
            <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
              Fakta Terverifikasi
            </span>
            <h4 className="font-bold text-sm text-slate-800">Komoditas Budidaya & Kerajinan</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tanaman glagah (<em>Saccharum spontaneum</em>) secara nyata menjadi tulang punggung kerajinan sapu rayung Purbalingga yang telah menembus pasar nasional dan ekspor mancanegara.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
            <span className="px-2.5 py-1 rounded-full bg-sky-100 text-sky-800 text-[10px] font-bold uppercase tracking-wider">
              Hasil Observasi
            </span>
            <h4 className="font-bold text-sm text-slate-800">Timbulan Residu Massal</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Pada workshop pengrajin di Bojongsari dan Karangreja, proses sortasi, pengikatan, dan pemukulan sapu selalu meninggalkan timbulan serbuk bunga dan malai rontok dalam jumlah besar.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
            <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold uppercase tracking-wider">
              Hipotesis Riset
            </span>
            <h4 className="font-bold text-sm text-slate-800">Kesesuaian 3 Jalur Nilai Tambah</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Residu tersebut memiliki karakteristik fisik-kimia yang apabila dipilah secara presisi dapat memenuhi standar benih perbanyakan, briket biomassa (SNI), atau pupuk kompos organik.
            </p>
          </div>
        </div>

        {/* Konten Utama 1: Mengenal Tanaman Glagah */}
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-soft space-y-4">
          <h2 className="text-2xl font-bold text-agri-dark">
            1. Mengenal Tanaman Glagah (Saccharum spontaneum)
          </h2>
          <div className="text-slate-600 text-sm leading-relaxed space-y-3">
            <p>
              Tanaman glagah atau biasa disebut <strong>rayung</strong> adalah jenis rumput perennial liar berkayu dari famili <em>Poaceae</em> yang berkerabat dekat dengan tebu. Tanaman ini memiliki daya adaptasi tinggi terhadap lahan marjinal, lereng perbukitan, serta sempadan sungai.
            </p>
            <p>
              Bagian yang paling bernilai ekonomis adalah <strong>malai bunganya yang berserat lentur dan berserabut halus</strong>. Setelah dipanen, malai dikeringkan kemudian diikat kuat pada gagang bambu untuk membentuk sapu lantai tradisional yang awet dan memiliki daya sapu halus istimewa.
            </p>
          </div>
        </div>

        {/* Konten Utama 2: Konteks Geografis Pemalang & Purbalingga */}
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-soft space-y-6">
          <h2 className="text-2xl font-bold text-agri-dark">
            2. Simbiosis Rantai Pasok: Pemalang dan Purbalingga
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center gap-2 text-agri-primary font-bold">
                <MapPin className="w-5 h-5 text-agri-emerald" />
                <span>Kabupaten Pemalang (Sektor Hulu)</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Wilayah perbukitan seperti Kecamatan Belik, Bantarbolang, dan Watukumpul merupakan daerah pemasok utama bunga glagah. Petani memanen bunga saat mekar penuh sebelum biji terlepas secara alami oleh angin.
              </p>
              <div className="text-[11px] text-slate-500 border-t border-slate-200 pt-2">
                Fokus riset: Karakteristik kematangan bunga dan potensi calon biji untuk perbanyakan benih mandiri.
              </div>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center gap-2 text-agri-primary font-bold">
                <MapPin className="w-5 h-5 text-agri-emerald" />
                <span>Kabupaten Purbalingga (Sektor Hilir)</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Kecamatan Bojongsari dan Karangreja adalah sentra klaster industri kecil menengah (IKM) sapu rayung terkemuka di Indonesia. Ratusan pengrajin bergantung pada pasokan glagah berkualitas untuk produksi harian.
              </p>
              <div className="text-[11px] text-slate-500 border-t border-slate-200 pt-2">
                Fokus riset: Timbulan serbuk rontokan hasil sortasi dan pemukulan sapu untuk briket biomassa.
              </div>
            </div>
          </div>
        </div>

        {/* Konten Utama 3: Mengapa Butuh Teknologi AIoT? */}
        <div className="bg-slate-900 text-white rounded-2xl p-8 space-y-4">
          <h2 className="text-2xl font-bold text-white">
            3. Urgensi Pengambilan Keputusan Berbasis Data
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Hingga saat ini, residu bunga glagah belum dimanfaatkan secara optimal karena keterbatasan metode pengujian di tingkat UMKM. Membedakan apakah suatu residu lebih tepat dijadikan briket atau kompos membutuhkan pengukuran kuantitatif seperti kadar air biomassa, massa jenis, dan umur simpan.
          </p>
          <p className="text-slate-300 text-sm leading-relaxed">
            Inovasi <strong>GlagahSmart AIoT</strong> hadir untuk menjembatani kesenjangan ini dengan menyediakan sistem akuisisi data sederhana (IoT) dan logika klasifikasi Machine Learning yang objektif, transparan, dan mudah digunakan.
          </p>
          <div className="pt-4 flex items-center gap-4">
            <Link
              href="/problem"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-agri-emerald text-slate-950 font-bold text-xs hover:bg-agri-emeraldLight transition-colors"
            >
              <span>Lanjut ke Identifikasi Masalah</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
