import React from "react";
import Link from "next/link";
import { 
  Sprout, 
  Flame, 
  Recycle, 
  ArrowRight, 
  CheckCircle2, 
  FileCheck, 
  Cpu, 
  FlaskConical, 
  AlertCircle 
} from "lucide-react";

export default function SolutionPage() {
  return (
    <div className="py-12 bg-agri-bg min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-agri-surface border border-agri-emerald/30 text-agri-primary text-xs font-semibold">
            <Sprout className="w-4 h-4 text-agri-emerald" />
            <span>Konsep Utama Teknologi</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-agri-dark tracking-tight">
            Solusi Inovasi GlagahSmart: Tiga Jalur Hilirisasi
          </h1>
          <p className="text-slate-600 text-base leading-relaxed">
            Menganalisis parameter numerik fisik-kimia sampel bunga glagah untuk memperkirakan potensi pemanfaatannya menjadi <strong>Benih</strong>, <strong>Briket Biomassa</strong>, atau <strong>Pupuk Kompos</strong>.
          </p>
        </div>

        {/* 3 Detail Produk Solusi */}
        <div className="space-y-8">
          
          {/* 1. Benih */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-soft space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                  <Sprout className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                    Jalur Alternatif 1
                  </span>
                  <h2 className="text-2xl font-extrabold text-agri-dark">
                    Benih Tanaman (Seed Propagation)
                  </h2>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                Tujuan: Perbanyakan Budidaya Terencana
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-600">
              <div className="space-y-3">
                <h4 className="font-bold text-sm text-slate-800">Deskripsi & Potensi:</h4>
                <p className="leading-relaxed">
                  Bahan bunga yang mengandung calon biji utuh yang dipanen saat kematangan fisiologis prima. Memungkinkan petani melakukan budidaya glagah secara intensif di lahan-lahan marjinal tanpa harus bergantung pada pencarian glagah liar di tebing terjal.
                </p>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="font-bold text-slate-800">Parameter Kunci Model:</div>
                  <div>• Umur pascapanen: <strong>1 – 7 hari</strong></div>
                  <div>• Skor kondisi biji: <strong>3 (Utuh/Segar)</strong></div>
                  <div>• Kadar air biomassa: <strong>10% – 18% MC</strong></div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-sm text-slate-800">Syarat Uji Validasi Ilmiah:</h4>
                <p className="leading-relaxed">
                  Kelayakan sebenarnya memerlukan verifikasi laboratorium benih untuk memastikan daya kecambah aktif:
                </p>
                <div className="space-y-2">
                  <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-950 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Uji Daya Berkecambah (Germination Test):</strong> Berdasarkan kaidah ISTA (International Seed Testing Association).</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-950 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Uji Tetrazolium:</strong> Pengujian biokimia viabilitas embrio biji secara cepat.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Briket Biomassa */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-soft space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                  <Flame className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                    Jalur Alternatif 2
                  </span>
                  <h2 className="text-2xl font-extrabold text-agri-dark">
                    Briket Biomassa (Bio-Energy Pellets)
                  </h2>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
                Tujuan: Energi Terbarukan Pengganti Fosil
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-600">
              <div className="space-y-3">
                <h4 className="font-bold text-sm text-slate-800">Deskripsi & Potensi:</h4>
                <p className="leading-relaxed">
                  Sisa serbuk rontokan bunga dan spikelet kering hasil proses pemukulan sapu memiliki kandungan selulosa dan lignin tinggi. Bahan ini sangat cocok dipadatkan (densifikasi) menjadi briket bahan bakar untuk pengeringan tembakau, pembakaran genteng, atau tungku UMKM.
                </p>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="font-bold text-slate-800">Parameter Kunci Model:</div>
                  <div>• Kadar air biomassa: <strong>&le; 12% MC</strong> (Kering optimal)</div>
                  <div>• Struktur fisik: <strong>Serbuk rontokan / serabut halus</strong></div>
                  <div>• Standar acuan: <strong>SNI 01-6235-2000</strong></div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-sm text-slate-800">Syarat Uji Validasi Ilmiah:</h4>
                <p className="leading-relaxed">
                  Kelayakan komersial memerlukan uji proksimat dan nilai kalor bahan bakar padat:
                </p>
                <div className="space-y-2">
                  <div className="p-2.5 rounded-lg bg-amber-50 text-amber-950 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span><strong>Uji Bomb Kalorimeter:</strong> Memastikan nilai kalor di atas 4.000 kal/g sesuai standar briket biomassa.</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-amber-50 text-amber-950 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span><strong>Uji Kadar Air & Kadar Abu SNI:</strong> Memastikan pembakaran bersih dengan residu abu minimal.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Pupuk Kompos */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-soft space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-green-50 border border-green-200 flex items-center justify-center text-green-700">
                  <Recycle className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-xs font-bold text-green-800 uppercase tracking-wider">
                    Jalur Alternatif 3
                  </span>
                  <h2 className="text-2xl font-extrabold text-agri-dark">
                    Pupuk Kompos Organik (Organic Soil Amendment)
                  </h2>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-green-100 text-green-900 text-xs font-bold">
                Tujuan: Restorasi Kesuburan Tanah Pertanian
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-600">
              <div className="space-y-3">
                <h4 className="font-bold text-sm text-slate-800">Deskripsi & Potensi:</h4>
                <p className="leading-relaxed">
                  Residu organik yang telah mengalami penyimpanan lama, basah, atau berjamur tidak efisien untuk dibakar, namun memiliki nilai karbon organik melimpah. Sangat baik diolah melalui komposting aerobik bersama kotoran ternak sapi/kambing.
                </p>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="font-bold text-slate-800">Parameter Kunci Model:</div>
                  <div>• Kadar air biomassa: <strong>&ge; 25% – 60% MC</strong> (Lembap)</div>
                  <div>• Umur pascapanen: <strong>&gt; 15 hari</strong> (Terdegradasi)</div>
                  <div>• Standar acuan: <strong>SNI 19-7030-2004</strong></div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-sm text-slate-800">Syarat Uji Validasi Ilmiah:</h4>
                <p className="leading-relaxed">
                  Kematangan kompos harus dinilai berdasarkan parameter biokimia fermentasi:
                </p>
                <div className="space-y-2">
                  <div className="p-2.5 rounded-lg bg-green-50 text-green-950 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-700 shrink-0 mt-0.5" />
                    <span><strong>Uji Rasio C/N:</strong> Memastikan keseimbangan karbon dan nitrogen berkisar 10 – 20:1 pada kompos matang.</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-green-50 text-green-950 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-700 shrink-0 mt-0.5" />
                    <span><strong>Uji Fitotoksisitas:</strong> Memastikan kompos tidak menghambat perkecambahan benih tanaman uji.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* CTA Demonstrasi */}
        <div className="p-8 rounded-3xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">
              Coba Klasifikasikan Sampel Nyata
            </h3>
            <p className="text-xs text-slate-400">
              Gunakan simulasi Wokwi untuk membaca sensor atau masukkan parameter secara manual pada demonstrasi Machine Learning.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/simulation"
              className="px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-white hover:bg-slate-700 transition-colors"
            >
              Simulasi Wokwi
            </Link>
            <Link
              href="/classification"
              className="px-5 py-2.5 rounded-xl bg-agri-emerald text-slate-950 text-xs font-bold hover:bg-agri-emeraldLight transition-colors"
            >
              Uji Klasifikasi ML →
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
