"use client";

import React from 'react';
import { Coffee, Ticket, BookOpen, Users } from 'lucide-react';

export const DashboardStats: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="flex items-center justify-between rounded-2xl border border-brand-cream-accent bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
        <div>
          <span className="text-[11px] font-medium uppercase tracking-wider text-brand-muted">Total Omset Kedai</span>
          <h2 className="mt-1 text-xl font-extrabold text-brand-text">Rp 3.420.000</h2>
          <span className="mt-1 inline-block rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 border border-emerald-100">+12% hari ini</span>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-100 bg-amber-50 text-brand-maroon">
          <Coffee size={22} />
        </div>
      </div>

      <div className="flex items-center justify-between rounded-2xl border border-brand-cream-accent bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
        <div>
          <span className="text-[11px] font-medium uppercase tracking-wider text-brand-muted">Tiket Terjual</span>
          <h2 className="mt-1 text-xl font-extrabold text-brand-text">85 Tiket</h2>
          <span className="mt-1 block text-[10px] text-brand-muted">3 Event Aktif Minggu Ini</span>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-rose-100 bg-rose-50 text-brand-maroon">
          <Ticket size={22} />
        </div>
      </div>

      <div className="flex items-center justify-between rounded-2xl border border-brand-cream-accent bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
        <div>
          <span className="text-[11px] font-medium uppercase tracking-wider text-brand-muted">Buku Terpinjam</span>
          <h2 className="mt-1 text-xl font-extrabold text-brand-text">18 Judul</h2>
          <span className="mt-1 block text-[10px] text-brand-muted">Rata-rata pinjam 4 hari</span>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-100 bg-amber-50 text-amber-700">
          <BookOpen size={22} />
        </div>
      </div>

      <div className="flex items-center justify-between rounded-2xl border border-brand-cream-accent bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
        <div>
          <span className="text-[11px] font-medium uppercase tracking-wider text-brand-muted">Member Baru</span>
          <h2 className="mt-1 text-xl font-extrabold text-brand-text">128 Member</h2>
          <span className="mt-1 inline-block rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 border border-emerald-100">+18 bulan ini</span>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-700">
          <Users size={22} />
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
