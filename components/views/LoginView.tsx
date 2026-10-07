"use client";

import { useState } from 'react';
import { 
  Coffee, 
  Ticket, 
  BookOpen, 
  Lock, 
  User, 
  ArrowRight, 
  Eye, 
  EyeOff
} from 'lucide-react';

interface LoginViewProps {
  onLoginSuccess: () => void;
}

export default function LoginView({ onLoginSuccess }: LoginViewProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setErrorMsg('Silakan isi ID Pengguna / Email dan Kata Sandi');
      return;
    }
    
    // Berhasil Login
    setErrorMsg('');
    onLoginSuccess();
  };

  return (
    <div className="flex min-h-screen w-full bg-[#fdfbf7]">
      {/* SISI KIRI: BANNER MERAH MAROON (PORTAL AKSES ADMIN & STAFF) */}
      <div className="relative flex flex-1 flex-col justify-between bg-[#6A1B1A] p-12 text-white shadow-2xl">
        {/* Background Overlay / Ornament Subtle */}
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
            {/* Wadah Logo Emas Berlekuk Sesuai Frame */}
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
                PUSAT OPERASIONAL & MANAJEMEN
              </p>
            </div>
          </div>
          <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium text-white/80 border border-white/10">
           
          </span>
        </div>

        {/* Main Content Left */}
        <div className="relative z-10 my-auto py-8">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-amber-200 border border-white/10">
            <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
            SISTEM INTERNAL RUMAH BUDAYA
          </div>

          <h1 className="font-serif text-4xl font-extrabold leading-tight text-white mb-4">
            Portal Akses Admin & Staff
          </h1>

          <p className="max-w-md text-xs leading-relaxed text-white/80 mb-8">
            Akses terintegrasi untuk pengelolaan KEDAI KOPI, Agenda Budaya & Pustaka Naskah dalam satu panel.
          </p>

          {/* 3 Cards Highlight */}
          <div className="space-y-3 max-w-lg">
            {/* Card 1 */}
            <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-sm transition-all hover:bg-white/10">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/20 text-amber-300">
                <Coffee size={20} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">POS Kasir & Monitor Meja Kedai</h4>
                <p className="text-[11px] text-white/60">Kelola pesanan dapur, racikan barista & rekap omset harian.</p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-sm transition-all hover:bg-white/10">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-rose-500/20 text-rose-300">
                <Ticket size={20} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Validator & Tiket Pentas Pembacaan</h4>
                <p className="text-[11px] text-white/60">Scan QR kupon tiket, reservasi kursi & jadwal acara budaya.</p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-sm transition-all hover:bg-white/10">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/20 text-amber-200">
                <BookOpen size={20} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Sirkulasi Naskah & Preservasi Pustaka</h4>
                <p className="text-[11px] text-white/60">Peminjaman buku, arsip Jawa kuno & registrasi keanggotaan.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Left */}
        <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-4 text-[11px] text-white/50">
          <p>© Rumah Budaya Ratna - Hak Cipta Dilindungi</p>
          <p></p>
        </div>
      </div>

      {/* SISI KANAN: FORM LOGIN ADMIN (BACKGROUND CREAM PALE) */}
      <div className="flex w-120 shrink-0 flex-col justify-between bg-[#FAF7F2] p-12">
        {/* Top Header Right */}
        <div className="flex items-center justify-between text-xs text-stone-500">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>Sistem Operasional</span>
          </div>
          <span className="font-semibold text-stone-700">Pusat Otentikasi Admin</span>
        </div>

        {/* Form Container */}
        <div className="my-auto">
          <div className="mb-6">
            <span className="text-[10px] font-bold tracking-widest text-[#6A1B1A] uppercase">
              AKSES TERRESTRIAL
            </span>
            <h2 className="font-serif text-2xl font-bold text-stone-900 mt-1">
              Selamat Datang, Masuk ke Akun
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Gunakan ID Akun Resmi atau Email Staff untuk mengakses sistem operasional.
            </p>
          </div>

          {errorMsg && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-600">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Input Username / Email */}
            <div>
              <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                ID Pengguna / Email Staff
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 text-stone-400" size={16} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan ID / Email Staff"
                  className="w-full rounded-xl border border-stone-300 bg-white py-2.5 pl-10 pr-4 text-xs font-medium text-stone-800 placeholder-stone-400 focus:border-[#6A1B1A] focus:outline-none focus:ring-1 focus:ring-[#6A1B1A]"
                />
              </div>
            </div>

            {/* Input Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider">
                  Kata Sandi
                </label>
                <a href="#" className="text-[11px] font-semibold text-[#6A1B1A] hover:underline">
                  Lupa Password?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 text-stone-400" size={16} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-xl border border-stone-300 bg-white py-2.5 pl-10 pr-10 text-xs font-medium text-stone-800 placeholder-stone-400 focus:border-[#6A1B1A] focus:outline-none focus:ring-1 focus:ring-[#6A1B1A]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-stone-400 hover:text-stone-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Checkbox Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-stone-300 text-[#6A1B1A] focus:ring-[#6A1B1A]"
                />
                <span className="text-xs text-stone-600">Ingat Saya di Perangkat Ini</span>
              </label>
            </div>

            {/* Button Submit */}
            <button
              type="submit"
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#6A1B1A] py-3 text-xs font-bold text-white shadow-lg transition-all hover:bg-[#521413] hover:shadow-xl active:scale-[0.99]"
            >
              <span>MASUK KE DASHBOARD</span>
              <ArrowRight size={16} />
            </button>
          </form>
        </div>

        {/* Footer Right */}
        <div className="text-center text-[11px] text-stone-400 border-t border-stone-200/60 pt-4">
          <p>Kendala akses akun? Hubungi <span className="font-semibold text-stone-600">Teknisi/IT Support</span></p>
        </div>
      </div>
    </div>
  );
}