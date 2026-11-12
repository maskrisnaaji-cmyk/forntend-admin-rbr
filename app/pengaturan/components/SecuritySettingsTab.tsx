"use client";

import React, { useState } from 'react';
import { ShieldCheck, Lock, KeyRound, Smartphone, LogOut, Check, Eye, EyeOff } from 'lucide-react';

interface SecuritySettingsTabProps {
  onNotify: (msg: string) => void;
}

export const SecuritySettingsTab: React.FC<SecuritySettingsTabProps> = ({ onNotify }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState('4');
  const [loginAlerts, setLoginAlerts] = useState(true);

  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    if (!currentPassword) {
      setPasswordError('Silakan masukkan password saat ini.');
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError('Password baru minimal harus terdiri dari 8 karakter.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Konfirmasi password tidak cocok dengan password baru.');
      return;
    }

    setIsUpdatingPassword(true);
    setTimeout(() => {
      setIsUpdatingPassword(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      onNotify('Kata sandi administrator berhasil diperbarui!');
    }, 400);
  };

  const handleSaveSecurityPrefs = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('rbr_security_prefs', JSON.stringify({
        twoFactorEnabled,
        sessionTimeout,
        loginAlerts,
      }));
    }
    onNotify('Preferensi keamanan dan durasi sesi berhasil disimpan!');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* CARD 1: Perubahan Kata Sandi */}
      <form onSubmit={handlePasswordSubmit} className="rounded-2xl border border-brand-cream-accent bg-white p-5 sm:p-6 shadow-xs">
        <div className="flex items-center gap-2.5 pb-4 border-b border-brand-cream-accent">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/15 text-rose-700">
            <KeyRound size={18} />
          </div>
          <div>
            <h3 className="font-serif text-sm font-bold text-brand-text">Pembaruan Kata Sandi (Password)</h3>
            <p className="text-[11px] text-brand-muted">Ganti kata sandi secara berkala untuk menjaga integritas akses panel admin</p>
          </div>
        </div>

        {passwordError && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700">
            {passwordError}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs">
          <div>
            <label className="mb-1 block font-bold text-brand-text text-[11px] uppercase tracking-wider">
              Password Saat Ini
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 text-stone-400" size={15} />
              <input
                type={showCurrentPass ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-xl border border-brand-cream-accent bg-[#FCFAF6] py-2 pl-9 pr-9 text-xs text-brand-text focus:border-brand-maroon focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-maroon"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPass(!showCurrentPass)}
                className="absolute right-2.5 top-2.5 text-stone-400 hover:text-stone-600"
              >
                {showCurrentPass ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          <div>
            <label className="mb-1 block font-bold text-brand-text text-[11px] uppercase tracking-wider">
              Password Baru (Min 8 Karakter)
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 text-stone-400" size={15} />
              <input
                type={showNewPass ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-xl border border-brand-cream-accent bg-[#FCFAF6] py-2 pl-9 pr-9 text-xs text-brand-text focus:border-brand-maroon focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-maroon"
              />
              <button
                type="button"
                onClick={() => setShowNewPass(!showNewPass)}
                className="absolute right-2.5 top-2.5 text-stone-400 hover:text-stone-600"
              >
                {showNewPass ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          <div>
            <label className="mb-1 block font-bold text-brand-text text-[11px] uppercase tracking-wider">
              Ulangi Password Baru
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 text-stone-400" size={15} />
              <input
                type={showNewPass ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-xl border border-brand-cream-accent bg-[#FCFAF6] py-2 pl-9 pr-3 text-xs text-brand-text focus:border-brand-maroon focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-maroon"
              />
            </div>
          </div>
        </div>

        {/* Checklist Kekuatan Password */}
        <div className="mt-4 flex flex-wrap items-center gap-4 text-[11px] text-stone-500 bg-brand-cream/60 p-3 rounded-xl border border-brand-cream-accent">
          <span className="font-semibold text-stone-700">Kriteria Password Aman:</span>
          <span className={`inline-flex items-center gap-1 ${newPassword.length >= 8 ? 'text-emerald-700 font-semibold' : ''}`}>
            <Check size={13} className={newPassword.length >= 8 ? 'text-emerald-600' : 'text-stone-300'} />
            Minimal 8 Karakter
          </span>
          <span className={`inline-flex items-center gap-1 ${/\d/.test(newPassword) ? 'text-emerald-700 font-semibold' : ''}`}>
            <Check size={13} className={/\d/.test(newPassword) ? 'text-emerald-600' : 'text-stone-300'} />
            Memuat Angka
          </span>
          <span className={`inline-flex items-center gap-1 ${/[a-zA-Z]/.test(newPassword) ? 'text-emerald-700 font-semibold' : ''}`}>
            <Check size={13} className={/[a-zA-Z]/.test(newPassword) ? 'text-emerald-600' : 'text-stone-300'} />
            Memuat Huruf
          </span>
        </div>

        <div className="mt-4 pt-3 flex justify-end">
          <button
            type="submit"
            disabled={isUpdatingPassword}
            className="flex items-center gap-2 rounded-xl bg-brand-maroon px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-brand-maroon-light transition-all active:scale-[0.99] disabled:opacity-50 cursor-pointer"
          >
            {isUpdatingPassword ? 'Memperbarui Password...' : 'Perbarui Password Admin'}
          </button>
        </div>
      </form>

      {/* CARD 2: Otentikasi & Sesi Akses */}
      <div className="rounded-2xl border border-brand-cream-accent bg-white p-5 sm:p-6 shadow-xs">
        <div className="flex items-center gap-2.5 pb-4 border-b border-brand-cream-accent">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-700">
            <ShieldCheck size={18} />
          </div>
          <div>
            <h3 className="font-serif text-sm font-bold text-brand-text">Kebijakan Sesi & Keamanan Tambahan</h3>
            <p className="text-[11px] text-brand-muted">Pengaturan batas waktu idle dan perlindungan autentikasi multi-faktor</p>
          </div>
        </div>

        <div className="divide-y divide-brand-cream-accent text-xs">
          {/* Row 1: 2FA */}
          <div className="py-3.5 flex items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-brand-text">Otentikasi Dua Faktor (2FA)</h4>
              <p className="text-[11px] text-brand-muted">Mewajibkan kode verifikasi OTP saat masuk dari perangkat atau jaringan baru</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setTwoFactorEnabled(!twoFactorEnabled);
                setTimeout(handleSaveSecurityPrefs, 100);
              }}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                twoFactorEnabled ? 'bg-brand-maroon' : 'bg-stone-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  twoFactorEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Row 2: Session Timeout */}
          <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="font-bold text-brand-text">Batas Waktu Sesi Otomatis (Auto Logout)</h4>
              <p className="text-[11px] text-brand-muted">Sistem akan otomatis mengeluarkan akun jika tidak ada aktivitas dalam rentang waktu ini</p>
            </div>
            <select
              value={sessionTimeout}
              onChange={(e) => {
                setSessionTimeout(e.target.value);
                setTimeout(handleSaveSecurityPrefs, 100);
              }}
              className="rounded-xl border border-brand-cream-accent bg-[#FCFAF6] py-1.5 px-3 text-xs text-brand-text font-medium focus:border-brand-maroon focus:outline-none cursor-pointer"
            >
              <option value="1">1 Jam Tidak Aktif</option>
              <option value="4">4 Jam Tidak Aktif (Direkomendasikan)</option>
              <option value="8">8 Jam (1 Shift Kerja)</option>
              <option value="24">24 Jam Penuh</option>
            </select>
          </div>

          {/* Row 3: Login Alert */}
          <div className="py-3.5 flex items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-brand-text">Peringatan Login Perangkat Baru</h4>
              <p className="text-[11px] text-brand-muted">Kirimkan notifikasi saat akun diakses dari browser atau IP address yang belum dikenali</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setLoginAlerts(!loginAlerts);
                setTimeout(handleSaveSecurityPrefs, 100);
              }}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                loginAlerts ? 'bg-brand-maroon' : 'bg-stone-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  loginAlerts ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* CARD 3: Sesi Perangkat Aktif Saat Ini */}
      <div className="rounded-2xl border border-brand-cream-accent bg-white p-5 sm:p-6 shadow-xs">
        <div className="flex items-center gap-2.5 pb-4 border-b border-brand-cream-accent">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/15 text-blue-700">
            <Smartphone size={18} />
          </div>
          <div>
            <h3 className="font-serif text-sm font-bold text-brand-text">Sesi Perangkat Aktif</h3>
            <p className="text-[11px] text-brand-muted">Daftar perangkat yang saat ini sedang terhubung ke akun admin</p>
          </div>
        </div>

        <div className="pt-4 space-y-3 text-xs">
          <div className="flex items-center justify-between p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/60">
            <div className="flex items-center gap-3">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
              <div>
                <h4 className="font-bold text-stone-900">Perangkat Saat Ini (Browser Desktop)</h4>
                <p className="text-[11px] text-stone-600">Windows • Google Chrome • IP: 127.0.0.1 (Lokal)</p>
              </div>
            </div>
            <span className="rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-1 border border-emerald-300">
              Sesi Ini
            </span>
          </div>
        </div>

        <div className="mt-4 pt-3 flex justify-end">
          <button
            type="button"
            onClick={() => onNotify('Seluruh sesi pada perangkat lain berhasil dihentikan.')}
            className="flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-red-700 transition-colors p-1.5 cursor-pointer"
          >
            <LogOut size={14} />
            <span>Keluarkan Sesi di Perangkat Lain</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettingsTab;

