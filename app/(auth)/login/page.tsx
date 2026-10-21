"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Coffee, Ticket, BookOpen } from 'lucide-react';
import { LoginForm } from './components/LoginForm';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

      // Redirect ke dashboard
      router.push('/dashboard');
    } catch (err: unknown) {
      console.error('Login error:', err);
      setErrorMsg('Gagal terhubung ke server backend (http://localhost:5000). Pastikan server aktif.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row bg-[#FDFBF7]">
      {/* SISI KIRI: BANNER MERAH MAROON (PORTAL AKSES ADMIN & STAFF) */}
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
            SISTEM INTERNAL RUMAH BUDAYA
          </div>

          <h1 className="font-serif text-3xl md:text-4xl font-extrabold leading-tight text-white mb-4">
            Portal Akses Admin &amp; Staff
          </h1>

          <p className="max-w-md text-xs leading-relaxed text-white/80 mb-8">
            Akses terintegrasi untuk pengelolaan Kedai Kopi, Agenda Budaya, Pustaka Naskah, dan verifikasi anggota dalam satu panel.
          </p>

          {/* 3 Cards Highlight */}
          <div className="space-y-3 max-w-lg">
            {/* Card 1 */}
            <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-sm transition-all hover:bg-white/10">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/20 text-amber-300">
                <Coffee size={20} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">POS Kasir &amp; Monitor Meja Kedai</h4>
                <p className="text-[11px] text-white/60">Kelola pesanan dapur, racikan barista &amp; rekap omset harian.</p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-sm transition-all hover:bg-white/10">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-rose-500/20 text-rose-300">
                <Ticket size={20} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Validator &amp; Tiket Pentas Pembacaan</h4>
                <p className="text-[11px] text-white/60">Scan QR tiket kupon, reservasi kursi &amp; jadwal acara budaya.</p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-sm transition-all hover:bg-white/10">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/20 text-amber-200">
                <BookOpen size={20} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Sirkulasi Naskah &amp; Preservasi Pustaka</h4>
                <p className="text-[11px] text-white/60">Peminjaman buku, arsip Jawa kuno &amp; keanggotaan.</p>
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

      {/* SISI KANAN: FORM LOGIN ADMIN DARI KOMPONEN MODULAR */}
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
        onSubmit={handleSubmit}
      />
    </div>
  );
}
