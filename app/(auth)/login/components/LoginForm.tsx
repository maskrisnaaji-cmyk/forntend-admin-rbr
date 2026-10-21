"use client";

import React from 'react';
import Link from 'next/link';
import { User, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

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
  onSubmit,
}) => {
  return (
    <div className="flex w-full lg:w-120 shrink-0 flex-col justify-between bg-[#FDFBF7] p-8 md:p-12">
      {/* Top Header Right */}
      <div className="flex items-center justify-between text-xs text-stone-500 mb-6 lg:mb-0">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span>Sistem Operasional</span>
        </div>
        <span className="font-semibold text-stone-700">Pusat Otentikasi Admin</span>
      </div>

      {/* Form Container */}
      <div className="my-auto py-6">
        <div className="mb-6">
          <span className="text-[10px] font-bold tracking-widest text-[#6B1D2F] uppercase">
            AKSES TERRESTRIAL
          </span>
          <h2 className="font-serif text-2xl font-bold text-stone-900 mt-1">
            Selamat Datang, Masuk ke Akun
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Gunakan Email/Username dan Password staff untuk mengakses sistem operasional.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-600">
            {errorMsg}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          {/* Input Email / Username */}
          <div>
            <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Email / Username
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-3 text-stone-400" size={16} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin@rumahbudayaratna.com atau admin"
                className="w-full rounded-xl border border-stone-300 bg-white py-2.5 pl-10 pr-4 text-xs font-medium text-stone-800 placeholder-stone-400 focus:border-[#6B1D2F] focus:outline-none focus:ring-1 focus:ring-[#6B1D2F]"
              />
            </div>
          </div>

          {/* Input Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider">
                Password (Kata Sandi)
              </label>
              <Link href="/forgot-password" className="text-[11px] font-semibold text-[#6B1D2F] hover:underline cursor-pointer">
                Lupa Password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 text-stone-400" size={16} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-xl border border-stone-300 bg-white py-2.5 pl-10 pr-10 text-xs font-medium text-stone-800 placeholder-stone-400 focus:border-[#6B1D2F] focus:outline-none focus:ring-1 focus:ring-[#6B1D2F]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-stone-400 hover:text-stone-600 cursor-pointer"
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
                className="h-4 w-4 rounded border-stone-300 text-[#6B1D2F] focus:ring-[#6B1D2F]"
              />
              <span className="text-xs text-stone-600">Ingat Saya di Perangkat Ini</span>
            </label>
          </div>

          {/* Button Submit */}
          <button
            type="submit"
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#6B1D2F] py-3 text-xs font-bold text-white shadow-lg transition-all hover:bg-[#541624] hover:shadow-xl active:scale-[0.99] cursor-pointer"
          >
            <span>Login ke Dashboard</span>
            <ArrowRight size={16} />
          </button>
        </form>
      </div>

      {/* Footer Right */}
      <div className="text-center text-[11px] text-stone-400 border-t border-stone-200/60 pt-4">
        <p>Kendala akses akun? Hubungi <span className="font-semibold text-stone-600">Teknisi / IT Support</span></p>
      </div>
    </div>
  );
};

export default LoginForm;
