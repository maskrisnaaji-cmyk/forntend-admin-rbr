"use client";

import React, { useState } from 'react';
import { 
  KeyRound, 
  Clock, 
  ShieldCheck 
} from 'lucide-react';
import { ForgotForm } from './components/ForgotForm';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMsg('Silakan masukkan alamat email yang terdaftar');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMsg('Format alamat email tidak valid');
      return;
    }

    setErrorMsg('');
    setIsSubmitting(true);

    // Simulasi pengiriman instruksi reset password
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 800);
  };

  const handleResetAgain = () => {
    setIsSubmitted(false);
    setEmail('');
    setErrorMsg('');
  };

  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row bg-[#FDFBF7]">
      {/* SISI KIRI: BANNER MERAH MAROON (INFORMASI PEMULIHAN AKSES) */}
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
            KEAMANAN &amp; PEMULIHAN AKUN
          </div>

          <h1 className="font-serif text-3xl md:text-4xl font-extrabold leading-tight text-white mb-4">
            Pemulihan Akses Akun Staff
          </h1>

          <p className="max-w-md text-xs leading-relaxed text-white/80 mb-8">
            Kehilangan kata sandi? Ikuti langkah verifikasi terenkripsi untuk mendapatkan kembali hak akses ke panel operasional Rumah Budaya Ratna.
          </p>

          {/* 3 Highlight Cards Info */}
          <div className="space-y-3 max-w-lg">
            <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-sm transition-all hover:bg-white/10">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/20 text-amber-300">
                <KeyRound size={20} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Tautan Reset Satu Kali Pakai</h4>
                <p className="text-[11px] text-white/60">Tautan pemulihan unik akan dikirimkan langsung ke email resmi staf yang terdata.</p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-sm transition-all hover:bg-white/10">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-rose-500/20 text-rose-300">
                <Clock size={20} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Batas Waktu Validasi 30 Menit</h4>
                <p className="text-[11px] text-white/60">Demi keamanan sistem, tautan pemulihan hanya berlaku selama 30 menit sejak dibuat.</p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-sm transition-all hover:bg-white/10">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/20 text-amber-200">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Standar Perlindungan Terenkripsi</h4>
                <p className="text-[11px] text-white/60">Data akun terlindungi dengan enkripsi menyeluruh sesuai standar otentikasi internal.</p>
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

      {/* SISI KANAN: FORM LUPA PASSWORD DARI KOMPONEN MODULAR */}
      <ForgotForm
        email={email}
        setEmail={setEmail}
        errorMsg={errorMsg}
        isSubmitting={isSubmitting}
        isSubmitted={isSubmitted}
        onSubmit={handleSubmit}
        onResetAgain={handleResetAgain}
      />
    </div>
  );
}
