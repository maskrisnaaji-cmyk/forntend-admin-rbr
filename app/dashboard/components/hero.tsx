"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Coffee } from 'lucide-react';

export const HeroBanner: React.FC = () => {
  const router = useRouter();

  return (
    <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between overflow-hidden rounded-2xl bg-brand-maroon p-6 text-white shadow-lg">
      {/* Background Subtle Accent */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
          backgroundSize: '18px 18px',
        }}
      />

      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-amber-200 border border-white/10 mb-2">
          <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
          <span>Pusat Kendali Operasional Terpadu</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold">Sugeng Rawuh, Admin Rumah Budaya</h1>
        <p className="mt-1 max-w-xl text-xs leading-relaxed text-white/80">
          Pantau seluruh operasional Kedai Kopi, pemesanan Tiket Acara, peminjaman Pustaka Naskah, dan verifikasi anggota dalam satu panel terpadu.
        </p>
      </div>
      <div className="relative z-10 flex flex-wrap items-center gap-2.5 sm:gap-3">
        <button 
          onClick={() => router.push('/agenda')}
          className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-medium text-white transition-colors hover:bg-white/20 cursor-pointer"
        >
          <Plus size={16} />
          <span>Tambah Agenda</span>
        </button>
        <button 
          onClick={() => router.push('/kedai')}
          className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-medium text-white transition-colors hover:bg-white/20 cursor-pointer"
        >
          <Coffee size={16} />
          <span>Kelola Kedai</span>
        </button>
      </div>
    </div>
  );
};

export default HeroBanner;
