"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Coffee, Ticket, BookOpen, Sparkles } from 'lucide-react';
import { LoginForm } from './components/LoginForm';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSplitting, setIsSplitting] = useState(false);

  useEffect(() => {
    // Bersihkan sesi lama saat masuk ke halaman login
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_logged_in');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      sessionStorage.removeItem('admin_logged_in');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const email = username.trim();
    const pass = password.trim();

    if (!email || !pass) {
      setErrorMsg('Silakan isi Email / Username dan Password');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: pass,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Kredensial tidak valid atau error dari server
        setErrorMsg(data.message || 'Email atau password salah.');
        setIsLoading(false);
        return;
      }

      // Validasi role: hanya role admin yang diizinkan mengakses admin-web
      if (data.user && data.user.role !== 'admin') {
        setErrorMsg('Akses ditolak. Akun ini tidak memiliki hak akses Administrator.');
        setIsLoading(false);
        return;
      }

      // Login berhasil, simpan token & user
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('admin_logged_in', 'true');

        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('user', JSON.stringify(data.user));
        sessionStorage.setItem('admin_logged_in', 'true');

        // Simpan rememberMe cookie/storage jika dicentang
        if (rememberMe) {
          localStorage.setItem('remember_admin', 'true');
        } else {
          localStorage.removeItem('remember_admin');
        }
      }

      // ─── EFEK SPLIT SCREEN / DOOR TRANSITION ───
      // Mengaktifkan pemisahan layar menjadi dua sisi sebelum redirect ke dashboard
      setIsSplitting(true);
      setTimeout(() => {
        router.push('/dashboard');
      }, 500);
    } catch (err: unknown) {
      console.error('Login error:', err);
      setErrorMsg('Gagal terhubung ke server backend (http://localhost:5000). Pastikan server aktif.');
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#2A0810] selection:bg-[#6B1D2F] selection:text-white">
      {/* ─── PORTAL BACKDROP (TERBUKA DI TENGAH SAAT LAYAR TERBELAH) ─── */}
      <div className="absolute inset-0 z-0 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#3D0A14] via-[#541624] to-[#1E050B]">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#D4AF37] p-2.5 shadow-2xl border-2 border-amber-300 animate-pulse">
          <img 
            src="/rbr.jpeg" 
            alt="Logo Rumah Budaya Ratna" 
            className="h-full w-full object-contain mix-blend-multiply" 
          />
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-amber-100 mt-4 tracking-wide">
          Rumah Budaya Ratna
        </h2>
        <p className="text-xs sm:text-sm text-amber-200/80 mt-1 font-medium">
          Membuka Gerbang Portal Operasional...
        </p>
        <div className="mt-4 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
          <span className="text-[11px] font-semibold text-white/70 uppercase tracking-widest">
            Mengalihkan ke Dashboard Admin
          </span>
        </div>
      </div>

      {/* ─── KONTTAINER SPLIT SCREEN (KIRI & KANAN TERBELAH KELUAR) ─── */}
      <div className="relative z-10 flex min-h-screen w-full flex-col lg:flex-row pointer-events-auto">
        {/* SISI KIRI (PINTU KIRI): BANNER MERAH MAROON DENGAN BACKGROUND FOTO */}
        <div
          className={`relative flex flex-1 flex-col justify-between overflow-hidden bg-[#5E1626] p-6 sm:p-10 lg:p-12 xl:p-16 text-white shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.7,0,0.84,0)] will-change-transform ${
            isSplitting
              ? '-translate-y-full lg:-translate-x-full opacity-0'
              : 'translate-y-0 lg:translate-x-0 opacity-100'
          }`}
        >
          {/* Foto Asli Rumah Budaya Ratna sebagai Background Atmosferik */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <img 
              src="/rbr.jpg" 
              alt="Atmosfer Rumah Budaya Ratna" 
              className="h-full w-full object-cover object-center filter blur-[1px] brightness-75 scale-105"
            />
            {/* Layer Gradient Elegan Maroon Khas Rumah Budaya Ratna */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#5E1626]/96 via-[#6B1D2F]/92 to-[#3A0D18]/96" />
            {/* Subtle Grid / Texture Dot Overlay */}
            <div 
              className="absolute inset-0 opacity-15"
              style={{
                backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            />
          </div>

          {/* Header Logo Left */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              {/* Wadah Logo Emas */}
              <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#D4AF37] p-1.5 shadow-md border border-amber-300/40">
                <img 
                  src="/rbr.jpeg" 
                  alt="Logo Rumah Budaya Ratna" 
                  className="h-full w-full object-contain mix-blend-multiply contrast-125"
                />
              </div>
              <div>
                <h2 className="font-serif text-base sm:text-lg font-bold leading-tight tracking-wide text-amber-100">
                  Rumah Budaya Ratna
                </h2>
                <p className="text-[10px] sm:text-[11px] font-medium tracking-widest text-amber-200/70 uppercase">
                  PUSAT OPERASIONAL &amp; MANAJEMEN
                </p>
              </div>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium text-white/85 border border-white/15 backdrop-blur-sm">
              <Sparkles size={13} className="text-amber-300" />
              Admin Portal v1.0
            </span>
          </div>

          {/* Main Content Left */}
          <div className="relative z-10 my-auto py-8 sm:py-10">
            <div className="mb-3.5 inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold text-amber-200 border border-white/15 backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
              SISTEM INTERNAL RUMAH BUDAYA
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold leading-tight text-white mb-3 sm:mb-4">
              Portal Akses Admin &amp; Staff
            </h1>

            <p className="max-w-lg text-xs sm:text-sm leading-relaxed text-amber-100/80 mb-6 sm:mb-8">
              Akses terintegrasi untuk pengelolaan Kedai Kopi, Agenda Budaya, Pustaka Naskah, dan verifikasi anggota dalam satu panel terpadu.
            </p>

            {/* 3 Cards Highlight (Responsive Grid) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3 max-w-2xl lg:max-w-lg">
              {/* Card 1 */}
              <div className="card-interactive animate-slide-up stagger-1 flex items-start sm:items-center gap-3.5 rounded-xl border border-white/15 bg-white/10 p-3.5 sm:p-4 backdrop-blur-md">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/25 text-amber-300 shadow-xs">
                  <Coffee size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white leading-snug">POS Kasir &amp; Monitor Kedai</h4>
                  <p className="text-[11px] text-amber-100/70 mt-0.5">Kelola pesanan dapur, racikan barista &amp; omset harian.</p>
                </div>
              </div>

              {/* Card 2 */}
              <div className="card-interactive animate-slide-up stagger-2 flex items-start sm:items-center gap-3.5 rounded-xl border border-white/15 bg-white/10 p-3.5 sm:p-4 backdrop-blur-md">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-rose-500/25 text-rose-300 shadow-xs">
                  <Ticket size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white leading-snug">Validator &amp; Pentas Budaya</h4>
                  <p className="text-[11px] text-amber-100/70 mt-0.5">Scan tiket kupon, reservasi kursi &amp; agenda seni.</p>
                </div>
              </div>

              {/* Card 3 */}
              <div className="card-interactive animate-slide-up stagger-3 flex items-start sm:items-center gap-3.5 rounded-xl border border-white/15 bg-white/10 p-3.5 sm:p-4 backdrop-blur-md">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-400/25 text-amber-200 shadow-xs">
                  <BookOpen size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white leading-snug">Sirkulasi Pustaka &amp; Naskah</h4>
                  <p className="text-[11px] text-amber-100/70 mt-0.5">Peminjaman buku, arsip Jawa &amp; keanggotaan.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Left */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 border-t border-white/15 pt-4 text-[11px] text-amber-100/60">
            <p>© Rumah Budaya Ratna - Hak Cipta Dilindungi</p>
            <p className="font-medium tracking-wide">Yogyakarta, Indonesia</p>
          </div>
        </div>

        {/* SISI KANAN (PINTU KANAN): FORM LOGIN ADMIN */}
        <div
          className={`flex shrink-0 transition-all duration-500 ease-[cubic-bezier(0.7,0,0.84,0)] will-change-transform ${
            isSplitting
              ? 'translate-y-full lg:translate-x-full opacity-0'
              : 'translate-y-0 lg:translate-x-0 opacity-100'
          }`}
        >
          <LoginForm
            username={username}
            setUsername={setUsername}
            password={password}
            setPassword={setPassword}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            rememberMe={rememberMe}
            setRememberMe={setRememberMe}
            errorMsg={errorMsg}
            isLoading={isLoading}
            isSplitting={isSplitting}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}
