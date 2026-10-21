"use client";

import React from 'react';
import Link from 'next/link';
import { Mail, ArrowRight, ArrowLeft, CheckCircle2, HelpCircle } from 'lucide-react';

interface ForgotFormProps {
  email: string;
  setEmail: (val: string) => void;
  errorMsg: string;
  isSubmitting: boolean;
  isSubmitted: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onResetAgain: () => void;
}

export const ForgotForm: React.FC<ForgotFormProps> = ({
  email,
  setEmail,
  errorMsg,
  isSubmitting,
  isSubmitted,
  onSubmit,
  onResetAgain,
}) => {
  return (
    <div className="flex w-full lg:w-120 shrink-0 flex-col justify-between bg-[#FDFBF7] p-8 md:p-12">
      {/* Top Header Right */}
      <div className="flex items-center justify-between text-xs text-stone-500 mb-6 lg:mb-0">
        <Link 
          href="/login" 
          className="inline-flex items-center gap-1.5 font-semibold text-[#6B1D2F] hover:underline cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>Kembali ke Login</span>
        </Link>
        <span className="font-semibold text-stone-700">Pusat Pemulihan Sandi</span>
      </div>

      {/* Form Container */}
      <div className="my-auto py-6">
        <div className="mb-6">
          <span className="text-[10px] font-bold tracking-widest text-[#6B1D2F] uppercase">
            BANTUAN OTENTIKASI
          </span>
          <h2 className="font-serif text-2xl font-bold text-stone-900 mt-1">
            Lupa Kata Sandi?
          </h2>
          <p className="text-xs text-stone-500 mt-1 leading-relaxed">
            Masukkan alamat email akun staf Anda. Kami akan mengirimkan instruksi untuk menyetel ulang kata sandi.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-600">
            {errorMsg}
          </div>
        )}

        {isSubmitted ? (
          /* Tampilan Berhasil Kirim */
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5 text-center animate-in fade-in duration-200">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-3">
              <CheckCircle2 size={26} />
            </div>
            <h3 className="text-sm font-bold text-stone-900">Email Pemulihan Terkirim</h3>
            <p className="mt-1.5 text-xs text-stone-600 leading-relaxed">
              Tautan pengaturan ulang kata sandi telah dikirimkan ke:
            </p>
            <div className="my-2.5 inline-block rounded-lg bg-white px-3 py-1 text-xs font-bold text-[#6B1D2F] border border-emerald-200">
              {email}
            </div>
            <p className="text-[11px] text-stone-500 leading-relaxed">
              Silakan periksa kotak masuk atau folder spam email Anda dalam beberapa saat. Tautan berlaku selama 30 menit.
            </p>

            <div className="mt-5 flex flex-col gap-2">
              <Link
                href="/login"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#6B1D2F] py-2.5 text-xs font-bold text-white shadow transition-all hover:bg-[#541624] cursor-pointer"
              >
                <ArrowLeft size={15} />
                <span>Kembali ke Halaman Login</span>
              </Link>
              <button
                type="button"
                onClick={onResetAgain}
                className="text-xs font-semibold text-stone-600 hover:text-stone-900 py-1.5 transition-colors cursor-pointer"
              >
                Kirim ke email lain
              </button>
            </div>
          </div>
        ) : (
          /* Form Input Email */
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Email Akun Terdaftar
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 text-stone-400" size={16} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@rumahbudayaratna.com"
                  className="w-full rounded-xl border border-stone-300 bg-white py-2.5 pl-10 pr-4 text-xs font-medium text-stone-800 placeholder-stone-400 focus:border-[#6B1D2F] focus:outline-none focus:ring-1 focus:ring-[#6B1D2F]"
                />
              </div>
              <p className="mt-1 text-[11px] text-stone-400">
                Pastikan email yang Anda masukkan sesuai dengan akun operasional admin yang sudah aktif.
              </p>
            </div>

            {/* Tombol Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#6B1D2F] py-3 text-xs font-bold text-white shadow-lg transition-all hover:bg-[#541624] hover:shadow-xl active:scale-[0.99] disabled:opacity-70 cursor-pointer"
            >
              {isSubmitting ? (
                <span>Mengirimkan Tautan...</span>
              ) : (
                <>
                  <span>Kirim Tautan Pemulihan</span>
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
        )}
      </div>

      {/* Footer Right */}
      <div className="text-center text-[11px] text-stone-400 border-t border-stone-200/60 pt-4">
        <p className="flex items-center justify-center gap-1">
          <HelpCircle size={13} className="text-stone-400" />
          <span>Butuh bantuan akses akun? Hubungi <span className="font-semibold text-stone-600">IT Support</span></span>
        </p>
      </div>
    </div>
  );
};

export default ForgotForm;
