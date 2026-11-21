"use client";

import React from 'react';
import { Coffee, Ticket, BookOpen, Users, TrendingUp, TrendingDown } from 'lucide-react';

export interface KedaiRevenue {
  total: number;
  today: number;
  formatted: string;
  todayFormatted: string;
  growthPercentage: number;
}

export interface TicketsSold {
  total: number;
  activeEventsCount: number;
  formatted: string;
  subtitle: string;
}

export interface BorrowedBooks {
  total: number;
  totalBooks: number;
  formatted: string;
  subtitle: string;
}

export interface TotalMembers {
  total: number;
  verifiedMembers: number;
  formatted: string;
  subtitle: string;
}

interface DashboardStatsProps {
  kedaiRevenue?: KedaiRevenue;
  ticketsSold?: TicketsSold;
  borrowedBooks?: BorrowedBooks;
  totalMembers?: TotalMembers;
  loading?: boolean;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  kedaiRevenue,
  ticketsSold,
  borrowedBooks,
  totalMembers,
  loading = false,
}) => {
  const skeletonClass = "animate-pulse bg-brand-cream-accent rounded h-4 w-24";
  const growthPct = kedaiRevenue?.growthPercentage ?? 0;
  const isPositive = growthPct >= 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Kartu 1: Total Omset Kedai */}
      <div className="flex items-center justify-between rounded-2xl border border-brand-cream-accent bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
        <div>
          <span className="text-[11px] font-medium uppercase tracking-wider text-brand-muted">Total Omset Kedai</span>
          {loading ? (
            <div className={`mt-1 ${skeletonClass}`} />
          ) : (
            <h2 className="mt-1 text-xl font-extrabold text-brand-text">
              {kedaiRevenue?.formatted ?? 'Rp 0'}
            </h2>
          )}
          {loading ? (
            <div className={`mt-1 ${skeletonClass} w-20`} />
          ) : (
            <span
              className={`mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold border ${
                isPositive
                  ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                  : 'bg-red-50 text-red-600 border-red-100'
              }`}
            >
              {isPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
              {isPositive ? '+' : ''}{growthPct}% hari ini
            </span>
          )}
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-100 bg-amber-50 text-brand-maroon">
          <Coffee size={22} />
        </div>
      </div>

      {/* Kartu 2: Tiket Terjual */}
      <div className="flex items-center justify-between rounded-2xl border border-brand-cream-accent bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
        <div>
          <span className="text-[11px] font-medium uppercase tracking-wider text-brand-muted">Tiket Terjual</span>
          {loading ? (
            <div className={`mt-1 ${skeletonClass}`} />
          ) : (
            <h2 className="mt-1 text-xl font-extrabold text-brand-text">
              {ticketsSold?.formatted ?? '0 Tiket'}
            </h2>
          )}
          {loading ? (
            <div className={`mt-1 ${skeletonClass} w-28`} />
          ) : (
            <span className="mt-1 block text-[10px] text-brand-muted">
              {ticketsSold?.subtitle ?? '0 Event Aktif'}
            </span>
          )}
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-rose-100 bg-rose-50 text-brand-maroon">
          <Ticket size={22} />
        </div>
      </div>

      {/* Kartu 3: Buku Terpinjam */}
      <div className="flex items-center justify-between rounded-2xl border border-brand-cream-accent bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
        <div>
          <span className="text-[11px] font-medium uppercase tracking-wider text-brand-muted">Buku Terpinjam</span>
          {loading ? (
            <div className={`mt-1 ${skeletonClass}`} />
          ) : (
            <h2 className="mt-1 text-xl font-extrabold text-brand-text">
              {borrowedBooks?.formatted ?? '0 Judul'}
            </h2>
          )}
          {loading ? (
            <div className={`mt-1 ${skeletonClass} w-28`} />
          ) : (
            <span className="mt-1 block text-[10px] text-brand-muted">
              {borrowedBooks?.subtitle ?? 'Dari total koleksi buku'}
            </span>
          )}
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-100 bg-amber-50 text-amber-700">
          <BookOpen size={22} />
        </div>
      </div>

      {/* Kartu 4: Member Terdaftar */}
      <div className="flex items-center justify-between rounded-2xl border border-brand-cream-accent bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
        <div>
          <span className="text-[11px] font-medium uppercase tracking-wider text-brand-muted">Member Baru</span>
          {loading ? (
            <div className={`mt-1 ${skeletonClass}`} />
          ) : (
            <h2 className="mt-1 text-xl font-extrabold text-brand-text">
              {totalMembers?.formatted ?? '0 Member'}
            </h2>
          )}
          {loading ? (
            <div className={`mt-1 ${skeletonClass} w-24`} />
          ) : (
            <span className="mt-1 block text-[10px] text-brand-muted">
              {totalMembers?.subtitle ?? 'Member terverifikasi'}
            </span>
          )}
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-700">
          <Users size={22} />
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
