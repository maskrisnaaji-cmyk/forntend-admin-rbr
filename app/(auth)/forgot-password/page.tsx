"use client";

import React from 'react';
import { 
  KeyRound, 
  ShieldCheck, 
  Lock 
} from 'lucide-react';
import { ForgotForm } from './components/ForgotForm';

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row bg-[#FDFBF7]">
      {/* SISI KIRI: BANNER MERAH MAROON (INFORMASI PEMULIHAN AKSES INTERNAL) */}
      <div className="relative flex flex-1 flex-col justify-between bg-[#6B1D2F] p-8 md:p-12 text-white shadow-2xl">
        {/* Background Overlay / Ornament Subtle */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />

        {/* Header Logo Left */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Wadah Logo Emas */}
            <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-[#D4AF37] p-1.5 shadow-md border border-amber-300/30">
              <img 
                src="/rbr.jpeg" 
                alt="Logo Rumah Budaya Ratna" 
                className="h-full w-full object-contain mix-blend-multiply contrast-125 scale-110"
              />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold leading-tight tracking-wide text-amber-100">
                Rumah Budaya Ratna
              </h2>
              <p className="text-[10px] font-medium tracking-widest text-white/60 uppercase">
                PUSAT OPERASIONAL &amp; MANAJEMEN
              </p>
            </div>
          </div>
          <span className="hidden sm:inline-block rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium text-white/80 border border-white/10">
            Admin Portal v1.0
          </span>
        </div>

        {/* Main Content Left */}
        <div className="relative z-10 my-auto py-8">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-amber-200 border border-white/10">
            <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
            KEAMANAN &amp; PEMULIHAN AKUN INTERNAL
          </div>

          <h1 className="font-serif text-3xl md:text-4xl font-extrabold leading-tight text-white mb-4">
            Pemulihan Akses Akun Staff
          </h1>

          <p className="max-w-md text-xs leading-relaxed text-white/80 mb-8">
            Kehilangan kata sandi? Ikuti langkah verifikasi identitas internal untuk mengatur ulang kata sandi operasional secara langsung dan aman di database.
          </p>

          {/* 3 Highlight Cards Info */}
          <div className="space-y-3 max-w-lg">
            <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-sm transition-all hover:bg-white/10">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/20 text-amber-300">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Verifikasi Data Internal Langsung</h4>
                <p className="text-[11px] text-white/60">Cukup masukkan Username/Email/ID Staf serta Kode PIN Keamanan Khusus tanpa pengiriman email.</p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-sm transition-all hover:bg-white/10">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/20 text-amber-200">
                <KeyRound size={20} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Pembaruan Sandi Langsung ke Database</h4>
                <p className="text-[11px] text-white/60">Setelah verifikasi valid, kata sandi baru langsung disimpan ke database dan aktif seketika.</p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-sm transition-all hover:bg-white/10">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-rose-500/20 text-rose-300">
                <Lock size={20} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Standar Perlindungan Terenkripsi</h4>
                <p className="text-[11px] text-white/60">Data akun dan kata sandi baru dienkripsi menyeluruh sesuai standar otentikasi internal.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Left */}
        <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-4 text-[11px] text-white/50">
          <p>© Rumah Budaya Ratna - Hak Cipta Dilindungi</p>
          <p>Yogyakarta</p>
        </div>
      </div>

      {/* SISI KANAN: FORM VERIFIKASI INTERNAL & RESET PASSWORD */}
      <ForgotForm />
    </div>
  );
}