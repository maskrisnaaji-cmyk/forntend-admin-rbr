"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

export const EventOccupancy: React.FC = () => {
  const router = useRouter();

  return (
    <div className="lg:col-span-5 rounded-2xl border border-brand-cream-accent bg-white p-5 sm:p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-brand-text">Event &amp; Okupansi</h3>
          <p className="text-xs text-brand-muted">Status kuota tiket agenda mendatang</p>
        </div>
        <button 
          onClick={() => router.push('/agenda')} 
          className="inline-flex items-center gap-1 text-xs font-bold text-brand-maroon hover:underline cursor-pointer"
        >
          <span>Semua Agenda</span>
          <ArrowRight size={13} />
        </button>
      </div>

      <div className="space-y-4">
        <div className="rounded-xl border border-brand-cream-accent bg-brand-cream-card p-4">
          <div className="mb-2 flex items-start justify-between">
            <div>
              <span className="rounded bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-brand-maroon">SABTU, 28 SEP</span>
              <h4 className="mt-1 text-xs font-bold text-brand-text">Prasasti Trowulan Pak Rangkuti</h4>
              <p className="text-[10px] text-brand-muted">Sesi Diskusi Naskah &amp; Artefak</p>
            </div>
            <span className="text-xs font-extrabold text-brand-maroon">85%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-brand-cream-accent">
            <div className="h-full rounded-full bg-brand-maroon w-[85%]"></div>
          </div>
        </div>

        <div className="rounded-xl border border-brand-cream-accent bg-brand-cream-card p-4">
          <div className="mb-2 flex items-start justify-between">
            <div>
              <span className="rounded bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">MINGGU, 29 SEP</span>
              <h4 className="mt-1 text-xs font-bold text-brand-text">Lokakarya Batik Tulis Canting</h4>
              <p className="text-[10px] text-brand-muted">Galeri Kriya RBR • Kuota Penuh</p>
            </div>
            <span className="text-xs font-extrabold text-brand-maroon">100%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-brand-cream-accent">
            <div className="h-full rounded-full bg-brand-maroon w-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventOccupancy;
