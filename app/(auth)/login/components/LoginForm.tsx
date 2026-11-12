"use client";

import React from 'react';
import Link from 'next/link';
import { User, Lock, Eye, EyeOff, ArrowRight, Loader2, ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';

interface LoginFormProps {
  username: string;
  setUsername: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  showPassword: boolean;
  setShowPassword: (val: boolean) => void;
  rememberMe: boolean;
  setRememberMe: (val: boolean) => void;
  errorMsg: string;
  isLoading?: boolean;
  isSplitting?: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  username,
  setUsername,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  rememberMe,
  setRememberMe,
  errorMsg,
  isLoading = false,
  isSplitting = false,
  onSubmit,
}) => {
  return (
    <div className="flex w-full lg:w-[460px] xl:w-[500px] 2xl:w-[540px] shrink-0 flex-col justify-between bg-[#FDFBF7] p-6 sm:p-10 lg:p-12 xl:p-14 border-t lg:border-t-0 lg:border-l border-stone-200/80 shadow-sm animate-fade-in">
      {/* Top Header Right */}
      <div className="flex items-center justify-between text-xs text-stone-500 mb-6 lg:mb-0">
        <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 border border-emerald-200 text-emerald-700 font-medium">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Sistem Operasional Aktif</span>
        </div>
        <span className="font-semibold text-stone-600 flex items-center gap-1">
          <ShieldCheck size={14} className="text-[#6B1D2F]" />
          Portal Otentikasi
        </span>
      </div>

      {/* Form Container */}
      <div className="my-auto py-4 sm:py-6">
        <div className="mb-6">
          <span className="text-[10px] font-bold tracking-widest text-[#6B1D2F] uppercase bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
            AUTENTIKASI AMAN
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-2">
            Selamat Datang, Masuk ke Akun
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1.5">
            Gunakan Email/Username dan Password staff untuk mengakses panel operasional.
          </p>
        </div>

        {errorMsg && (
          <div className="animate-slide-down mb-5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs font-semibold text-red-700 flex items-start gap-2.5 shadow-xs">
            <AlertCircle size={17} className="text-red-500 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{errorMsg}</span>
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          {/* Input Email / Username */}
          <div>
            <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Email / Username Admin
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-3 text-stone-400" size={16} />
              <input
                type="text"
                disabled={isLoading || isSplitting}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin@rbr.com"
                autoComplete="username"
                className="w-full rounded-xl border border-stone-300 bg-white py-2.5 pl-10 pr-4 text-xs font-medium text-stone-800 placeholder-stone-400 focus:border-[#6B1D2F] focus:outline-none focus:ring-2 focus:ring-[#6B1D2F]/15 transition-all duration-200 disabled:opacity-50"
              />
            </div>
          </div>

          {/* Input Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider">
                Password (Kata Sandi)
              </label>
              <Link href="/forgot-password" className="text-[11px] font-semibold text-[#6B1D2F] hover:underline cursor-pointer transition-colors">
                Lupa Password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 text-stone-400" size={16} />
              <input
                type={showPassword ? 'text' : 'password'}
                disabled={isLoading || isSplitting}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                autoComplete="current-password"
                className="w-full rounded-xl border border-stone-300 bg-white py-2.5 pl-10 pr-10 text-xs font-medium text-stone-800 placeholder-stone-400 focus:border-[#6B1D2F] focus:outline-none focus:ring-2 focus:ring-[#6B1D2F]/15 transition-all duration-200 disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-stone-400 hover:text-stone-600 cursor-pointer transition-colors"
                title={showPassword ? "Sembunyikan password" : "Lihat password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Checkbox Remember Me & Demo Helper */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                disabled={isLoading || isSplitting}
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-stone-300 text-[#6B1D2F] focus:ring-[#6B1D2F] cursor-pointer"
              />
              <span className="text-xs text-stone-600 font-medium">Ingat Saya di Perangkat Ini</span>
            </label>
          </div>

          {/* Button Submit */}
          <button
            type="submit"
            disabled={isLoading || isSplitting}
            className={`mt-2 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold text-white shadow-md transition-all duration-300 active:scale-[0.99] disabled:cursor-not-allowed cursor-pointer ${
              isSplitting
                ? 'bg-amber-600 shadow-amber-500/30 shadow-lg scale-[1.02]'
                : 'bg-[#6B1D2F] hover:bg-[#541624] hover:shadow-lg disabled:opacity-70'
            }`}
          >
            {isSplitting ? (
              <>
                <Sparkles size={16} className="animate-spin text-amber-200" />
                <span className="tracking-wide">Akses Terbuka • Membuka Gerbang...</span>
              </>
            ) : isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Memverifikasi Kredensial...</span>
              </>
            ) : (
              <>
                <span>Login ke Dashboard Admin</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Footer Right */}
      <div className="text-center text-[11px] text-stone-400 border-t border-stone-200/70 pt-4">
        <p>Kendala akses akun? Hubungi <span className="font-semibold text-stone-600">Teknisi / Administrator Sistem</span></p>
      </div>
    </div>
  );
};

export default LoginForm;
