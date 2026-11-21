"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Calendar } from 'lucide-react';

export interface EventOccupancyItem {
  id: number;
  title: string;
  date: string;
  formatted_date: string;
  time: string;
  location: string;
  category: string;
  price: number;
  quota: number;
  booked_count: number;
  percentage: number;
  status: string;
}

interface EventOccupancyProps {
  eventOccupancy?: EventOccupancyItem[];
  loading?: boolean;
}

function getBadgeColor(percentage: number) {
  if (percentage >= 100) return 'bg-rose-100 text-brand-maroon';
  if (percentage >= 70) return 'bg-amber-100 text-amber-800';
  return 'bg-emerald-50 text-emerald-800';
}

export const EventOccupancy: React.FC<EventOccupancyProps> = ({
  eventOccupancy = [],
  loading = false,
}) => {
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
        {loading && (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="animate-pulse rounded-xl border border-brand-cream-accent bg-brand-cream-card p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="space-y-1">
                    <div className="h-3 w-20 bg-brand-cream-accent rounded" />
                    <div className="h-4 w-40 bg-brand-cream-accent rounded" />
                    <div className="h-3 w-32 bg-brand-cream-accent rounded" />
                  </div>
                  <div className="h-4 w-10 bg-brand-cream-accent rounded" />
                </div>
                <div className="h-2 w-full bg-brand-cream-accent rounded-full mt-3" />
              </div>
            ))}
          </div>
        )}

        {!loading && eventOccupancy.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-center rounded-xl border border-dashed border-brand-cream-accent">
            <Calendar size={28} className="text-brand-muted/60 mb-2" />
            <p className="text-xs font-medium text-brand-muted">Tidak ada event aktif mendatang</p>
          </div>
        )}

        {!loading && eventOccupancy.map((event) => {
          const pct = Math.min(Math.max(event.percentage || 0, 0), 100);
          return (
            <div key={event.id} className="rounded-xl border border-brand-cream-accent bg-brand-cream-card p-4 hover:border-brand-maroon/30 transition-colors">
              <div className="mb-2 flex items-start justify-between">
                <div>
                  <span className={`rounded px-2 py-0.5 text-[10px] font-bold ${getBadgeColor(pct)}`}>
                    {event.formatted_date || event.date}
                  </span>
                  <h4 className="mt-1 text-xs font-bold text-brand-text line-clamp-1">{event.title}</h4>
                  <p className="text-[10px] text-brand-muted">
                    {event.category} • {event.location} • {event.booked_count}/{event.quota} Kursi
                  </p>
                </div>
                <span className="text-xs font-extrabold text-brand-maroon">{pct}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-brand-cream-accent">
                <div
                  className="h-full rounded-full bg-brand-maroon transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EventOccupancy;
