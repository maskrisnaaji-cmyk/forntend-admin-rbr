"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  User, 
  KeyRound, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  HelpCircle, 
  ShieldCheck, 
  Loader2,
  AlertCircle
} from 'lucide-react';

interface VerifiedUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

export const ForgotForm: React.FC = () => {
  // Step state: 'verify' | 'new-password' | 'success'
  const [step, setStep] = useState<'verify' | 'new-password' | 'success'>('verify');

  // Step 1: Verification Form Fields
  const [identifier, setIdentifier] = useState('');
  const [securityPin, setSecurityPin] = useState('');
  const [showPin, setShowPin] = useState(false);

  // Step 2: New Password Fields
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Auth / Verification State
  const [verifiedUser, setVerifiedUser] = useState<VerifiedUser | null>(null);
  const [resetToken, setResetToken] = useState<string>('');

  // UI Feedback
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Step 1: Submit Identity Verification
  const handleVerifyIdentity = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const idVal = identifier.trim();
    const pinVal = securityPin.trim();

    if (!idVal) {
      setErrorMsg('Silakan masukkan Username, Email, atau ID Staf');
      return;
    }

    if (!pinVal) {
      setErrorMsg('Silakan masukkan Kode PIN Keamanan Khusus Internal');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/verify-reset-identity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier: idVal,
          securityPin: pinVal,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMsg(data.message || 'Verifikasi gagal. Data identitas atau PIN tidak cocok.');
        setIsLoading(false);
        return;
      }

      // Verifikasi berhasil
      setVerifiedUser(data.user);
      setResetToken(data.resetToken || '');
      setStep('new-password');
      setErrorMsg('');
    } catch (err) {
      console.error('Verification error:', err);
      setErrorMsg('Gagal terhubung ke server backend (http://localhost:5000). Pastikan server aktif.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Submit New Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const pass = newPassword.trim();
    const confirm = confirmPassword.trim();

    if (!pass) {
      setErrorMsg('Silakan masukkan kata sandi baru');
      return;
    }

    if (pass.length < 6) {
      setErrorMsg('Kata sandi baru minimal harus terdiri dari 6 karakter');
      return;
    }

    if (pass !== confirm) {
      setErrorMsg('Konfirmasi kata sandi tidak cocok dengan kata sandi baru');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: verifiedUser?.id,
          resetToken: resetToken,
          identifier: identifier.trim(),
          securityPin: securityPin.trim(),
          newPassword: pass,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMsg(data.message || 'Gagal memperbarui kata sandi di database.');
        setIsLoading(false);
        return;
      }

      // Berhasil update password langsung di DB
      setStep('success');
      setErrorMsg('');
    } catch (err) {
      console.error('Reset password error:', err);
      setErrorMsg('Gagal terhubung ke server backend (http://localhost:5000). Pastikan server aktif.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetAll = () => {
    setStep('verify');
    setIdentifier('');
    setSecurityPin('');
    setNewPassword('');
    setConfirmPassword('');
    setVerifiedUser(null);
    setResetToken('');
    setErrorMsg('');
  };

  return (
    <div className="flex w-full lg:w-125 shrink-0 flex-col justify-between bg-[#FDFBF7] p-8 md:p-12">
      {/* Top Header Right */}
      <div className="flex items-center justify-between text-xs text-stone-500 mb-6 lg:mb-0">
        <Link 
          href="/login" 
          className="inline-flex items-center gap-1.5 font-semibold text-[#6B1D2F] hover:underline cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>Kembali ke Login</span>
        </Link>
        <span className="font-semibold text-stone-700">Pusat Pemulihan Sandi Internal</span>
      </div>

      {/* Form Container */}
      <div className="my-auto py-6">
        {/* Step Progress Indicators */}
        <div className="mb-6 flex items-center gap-2">
          <div className={`flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider ${
            step === 'verify' ? 'text-[#6B1D2F]' : 'text-emerald-700'
          }`}>
            <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${
              step === 'verify' ? 'bg-[#6B1D2F] text-white' : 'bg-emerald-600 text-white'
            }`}>
              {step === 'verify' ? '1' : '✓'}
            </span>
            <span>Verifikasi Data</span>
          </div>

          <div className="h-0.5 flex-1 bg-stone-200" />

          <div className={`flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider ${
            step === 'new-password' ? 'text-[#6B1D2F]' : step === 'success' ? 'text-emerald-700' : 'text-stone-400'
          }`}>
            <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${
              step === 'new-password' ? 'bg-[#6B1D2F] text-white' : step === 'success' ? 'bg-emerald-600 text-white' : 'bg-stone-200 text-stone-600'
            }`}>
              {step === 'success' ? '✓' : '2'}
            </span>
            <span>Sandi Baru</span>
          </div>
        </div>

        {/* Global Error Banner */}
        {errorMsg && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-600 animate-in fade-in duration-150">
            <AlertCircle size={16} className="shrink-0 text-red-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* STEP 1: FORM VERIFIKASI DATA INTERNAL */}
        {step === 'verify' && (
          <div className="animate-in fade-in duration-200">
            <div className="mb-6">
              <span className="text-[10px] font-bold tracking-widest text-[#6B1D2F] uppercase">
                VERIFIKASI DATA INTERNAL
              </span>
              <h2 className="font-serif text-2xl font-bold text-stone-900 mt-1">
                Lupa Kata Sandi?
              </h2>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                Masukkan informasi identitas staf dan PIN Keamanan Khusus internal untuk memverifikasi hak akses tanpa pengiriman email.
              </p>
            </div>

            <form onSubmit={handleVerifyIdentity} className="space-y-4">
              {/* Input Identitas (Username / Email / ID Staf) */}
              <div>
                <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Username / Email / ID Staf
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 text-stone-400" size={16} />
                  <input
                    type="text"
                    required
                    disabled={isLoading}
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="admin@rbr.com atau Admin RBR"
                    className="w-full rounded-xl border border-stone-300 bg-white py-2.5 pl-10 pr-4 text-xs font-medium text-stone-800 placeholder-stone-400 focus:border-[#6B1D2F] focus:outline-none focus:ring-1 focus:ring-[#6B1D2F] disabled:opacity-50"
                  />
                </div>
                <p className="mt-1 text-[11px] text-stone-400">
                  Masukkan salah satu pengenal akun staf yang terdaftar di sistem.
                </p>
              </div>

              {/* Input PIN Keamanan Khusus Internal */}
              <div>
                <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Kode PIN Keamanan Khusus
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-3 text-stone-400" size={16} />
                  <input
                    type={showPin ? 'text' : 'password'}
                    required
                    disabled={isLoading}
                    value={securityPin}
                    onChange={(e) => setSecurityPin(e.target.value)}
                    placeholder="Masukkan PIN Keamanan (default: RBR2026)"
                    className="w-full rounded-xl border border-stone-300 bg-white py-2.5 pl-10 pr-10 text-xs font-medium text-stone-800 placeholder-stone-400 focus:border-[#6B1D2F] focus:outline-none focus:ring-1 focus:ring-[#6B1D2F] disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute right-3.5 top-3 text-stone-400 hover:text-stone-600 cursor-pointer"
                  >
                    {showPin ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <div className="mt-1 flex items-center justify-between text-[11px]">
                  <span className="text-stone-400">Kode otorisasi internal staf operasional.</span>
                  <span className="font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                    PIN default: RBR2026
                  </span>
                </div>
              </div>

              {/* Tombol Verifikasi Identitas */}
              <button
                type="submit"
                disabled={isLoading}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#6B1D2F] py-3 text-xs font-bold text-white shadow-lg transition-all hover:bg-[#541624] hover:shadow-xl active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Memverifikasi Data Staf...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck size={16} />
                    <span>Verifikasi Data Internal</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>

              <div className="pt-2 text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-[#6B1D2F] transition-colors cursor-pointer"
                >
                  <ArrowLeft size={13} />
                  <span>Batal dan kembali ke Login</span>
                </Link>
              </div>
            </form>
          </div>
        )}

        {/* STEP 2: FORM INPUT KATA SANDI BARU */}
        {step === 'new-password' && (
          <div className="animate-in fade-in duration-200">
            <div className="mb-5">
              <span className="text-[10px] font-bold tracking-widest text-[#6B1D2F] uppercase">
                TAHAP 2 DARI 2
              </span>
              <h2 className="font-serif text-2xl font-bold text-stone-900 mt-1">
                Input Kata Sandi Baru
              </h2>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                Identitas berhasil diverifikasi. Buat kata sandi baru untuk memperbarui kredensial Anda langsung di database.
              </p>
            </div>

            {/* Info Akun Terverifikasi */}
            {verifiedUser && (
              <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50/70 p-3 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 shrink-0">
                  <CheckCircle2 size={18} />
                </div>
                <div className="text-xs">
                  <p className="font-bold text-stone-800">{verifiedUser.name}</p>
                  <p className="text-[11px] text-stone-600">{verifiedUser.email} &bull; Role: <span className="uppercase font-semibold text-[#6B1D2F]">{verifiedUser.role}</span></p>
                </div>
              </div>
            )}

            <form onSubmit={handleResetPassword} className="space-y-4">
              {/* Input Kata Sandi Baru */}
              <div>
                <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Kata Sandi Baru
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 text-stone-400" size={16} />
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    disabled={isLoading}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    className="w-full rounded-xl border border-stone-300 bg-white py-2.5 pl-10 pr-10 text-xs font-medium text-stone-800 placeholder-stone-400 focus:border-[#6B1D2F] focus:outline-none focus:ring-1 focus:ring-[#6B1D2F] disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3.5 top-3 text-stone-400 hover:text-stone-600 cursor-pointer"
                  >
                    {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Input Konfirmasi Kata Sandi Baru */}
              <div>
                <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Konfirmasi Kata Sandi Baru
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 text-stone-400" size={16} />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    disabled={isLoading}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ulangi kata sandi baru"
                    className="w-full rounded-xl border border-stone-300 bg-white py-2.5 pl-10 pr-10 text-xs font-medium text-stone-800 placeholder-stone-400 focus:border-[#6B1D2F] focus:outline-none focus:ring-1 focus:ring-[#6B1D2F] disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-3 text-stone-400 hover:text-stone-600 cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Tombol Simpan Sandi */}
              <button
                type="submit"
                disabled={isLoading}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#6B1D2F] py-3 text-xs font-bold text-white shadow-lg transition-all hover:bg-[#541624] hover:shadow-xl active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Menyimpan ke Database...</span>
                  </>
                ) : (
                  <>
                    <Lock size={16} />
                    <span>Perbarui Kata Sandi di Database</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setStep('verify');
                    setErrorMsg('');
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-[#6B1D2F] transition-colors cursor-pointer"
                >
                  <ArrowLeft size={13} />
                  <span>Kembali ke Verifikasi Identitas</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 3: SUKSES UPDATE KATA SANDI */}
        {step === 'success' && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-6 text-center animate-in fade-in duration-200">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-3 shadow-inner">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="font-serif text-lg font-bold text-stone-900">
              Kata Sandi Berhasil Diperbarui!
            </h3>
            <p className="mt-2 text-xs text-stone-600 leading-relaxed max-w-sm mx-auto">
              Kata sandi untuk akun staf <span className="font-bold text-stone-800">{verifiedUser?.name || identifier}</span> telah berhasil diubah langsung pada database.
            </p>
            <div className="my-3 inline-block rounded-lg bg-white px-3.5 py-1 text-xs font-semibold text-emerald-800 border border-emerald-200 shadow-sm">
              Status: Database Updated &amp; Active
            </div>
            <p className="text-[11px] text-stone-500 leading-relaxed">
              Anda kini dapat masuk ke panel admin Rumah Budaya Ratna menggunakan kredensial kata sandi yang baru.
            </p>

            <div className="mt-6 flex flex-col gap-2.5">
              <Link
                href="/login"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#6B1D2F] py-3 text-xs font-bold text-white shadow-lg transition-all hover:bg-[#541624] hover:shadow-xl cursor-pointer"
              >
                <ArrowLeft size={15} />
                <span>Masuk dengan Kata Sandi Baru</span>
              </Link>
              <button
                type="button"
                onClick={handleResetAll}
                className="text-xs font-semibold text-stone-500 hover:text-stone-800 py-1.5 transition-colors cursor-pointer"
              >
                Reset Kata Sandi Akun Lain
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer Right */}
      <div className="text-center text-[11px] text-stone-400 border-t border-stone-200/60 pt-4">
        <p className="flex items-center justify-center gap-1">
          <HelpCircle size={13} className="text-stone-400" />
          <span>Butuh bantuan akses akun? Hubungi <span className="font-semibold text-stone-600">IT Support Rumah Budaya Ratna</span></span>
        </p>
      </div>
    </div>
  );
};

export default ForgotForm;