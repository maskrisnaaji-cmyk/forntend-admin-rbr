"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Clock } from 'lucide-react';

export const ActiveOrders: React.FC = () => {
  const router = useRouter();

  return (
    <div className="lg:col-span-7 rounded-2xl border border-brand-cream-accent bg-white p-5 sm:p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-brand-text">Pesanan Aktif Kedai Kopi</h3>
          <p className="text-xs text-brand-muted">Monitor antrean dapur &amp; barista secara real-time</p>
        </div>
        <button 
          onClick={() => router.push('/kedai')} 
          className="inline-flex items-center gap-1 text-xs font-bold text-brand-maroon hover:underline cursor-pointer"
        >
          <span>Lihat Semua</span>
          <ArrowRight size={13} />
        </button>
      </div>

      <div className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-brand-cream-accent bg-brand-cream-card p-4">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <span className="rounded bg-brand-maroon px-2 py-0.5 text-xs font-bold text-white">Meja 04</span>
              <span className="text-xs font-semibold text-brand-text">Order #RBR-1042</span>
              <span className="text-[10px] text-brand-muted">• 10 mnt lalu</span>
            </div>
            <p className="text-xs text-brand-muted">1x Kopi Susu Creamy Gula Aren, 1x Americano Origin, 1x Pisang Goreng</p>
            <p className="mt-1 text-xs font-extrabold text-brand-maroon">Rp 65.000</p>
          </div>
          <div>
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-[11px] font-bold text-amber-700">
              <Clock size={12} /> Disiapkan Barista
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-brand-cream-accent bg-brand-cream-card p-4">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <span className="rounded bg-brand-maroon px-2 py-0.5 text-xs font-bold text-white">Meja 09</span>
              <span className="text-xs font-semibold text-brand-text">Order #RBR-1043</span>
              <span className="text-[10px] text-brand-muted">• 5 mnt lalu</span>
            </div>
            <p className="text-xs text-brand-muted">2x Wedang Uwuh Rempah Khas, 1x Jadah Bakar Serundeng Gurih</p>
            <p className="mt-1 text-xs font-extrabold text-brand-maroon">Rp 45.000</p>
          </div>
          <div>
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-[11px] font-bold text-blue-700">
              <Clock size={12} /> Menunggu Bayar
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveOrders;
