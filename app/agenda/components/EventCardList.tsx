"use client";

import React, { useState } from 'react';
import { Calendar, MapPin, Users, Ticket, Pencil, Trash2 } from 'lucide-react';
import { EventItem } from './types';
import { formatRupiah } from '@/lib/formatCurrency';
import { formatISODateToIndonesian } from '@/lib/formatDate';

interface EventCardListProps {
  events: EventItem[];
  onEdit: (event: EventItem) => void;
  onDelete: (event: EventItem) => void;
}

export const EventCardList: React.FC<EventCardListProps> = ({
  events,
  onEdit,
  onDelete,
}) => {
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});

  const handleImageError = (id: number) => {
    setFailedImages((prev) => ({ ...prev, [id]: true }));
  };

  const resolveEventImage = (event: EventItem) => {
    const raw = event.image?.trim();
    if (raw && !failedImages[event.id]) {
      // Cloud URL Vercel Blob / Full URL
      if (raw.startsWith('http://') || raw.startsWith('https://') || raw.startsWith('blob:') || raw.startsWith('data:')) {
        return raw;
      }
      // Fallback path legacy
      if (raw.startsWith('assets/images/')) {
        return `/${raw.replace('assets/images/', '')}`;
      }
      return raw.startsWith('/') ? raw : `/${raw}`;
    }

    // Penyelarasan gambar banner presisi sama dengan mobile_app
    const t = (event.title || '').toLowerCase();
    const d = (event.date || '').toLowerCase();
    if (t.includes('napak')) return '/napak_tanah.jpeg';
    if (t.includes('rungkad') || t.includes('teater')) return '/pak_rungkad.jpeg';
    if (t.includes('obrolan') || t.includes('kearifan') || d.includes('08')) return '/oktober_08_obrolan_budaya.jpg';
    if (t.includes('batik') || t.includes('pameran') || d.includes('09')) return '/oktober_09_pameran_batik.jpg';
    if (t.includes('keramik') || t.includes('workshop') || d.includes('11')) return '/oktober_11_workshop_keramik.jpg';
    if (t.includes('akustik') || t.includes('puisi') || d.includes('12')) return '/oktober_12_malam_akustik.jpg';
    if (t.includes('sabtu budaya') || t.includes('gotong royong') || d.includes('13')) return '/oktober_13_sabtu_budaya.jpg';
    return '/rbr_frontt.jpg';
  };

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-brand-cream-accent bg-white p-12 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-gold/20 text-brand-maroon mb-3">
          <Ticket size={24} />
        </div>
        <h3 className="text-sm font-bold text-brand-text">Belum Ada Agenda Budaya</h3>
        <p className="mt-1 text-xs text-brand-muted max-w-sm">
          Klik tombol &quot;Tambah Event Baru&quot; di atas untuk menjadwalkan acara baru.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      {events.map((event) => {
        const percent = Math.min(100, Math.round((event.sold / event.total) * 100));
        const isFull = event.status === 'Penuh' || event.sold >= event.total;
        const bannerSrc = resolveEventImage(event);

        return (
          <div
            key={event.id}
            className="group flex flex-col rounded-2xl border border-brand-cream-accent bg-white overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
          >
            {/* Foto Banner Agenda */}
            <div className="relative h-44 w-full bg-stone-100 overflow-hidden">
              <img
                src={bannerSrc}
                alt={event.title}
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={() => handleImageError(event.id)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {/* Tag Status di atas Banner */}
              <div className="absolute top-3 left-3">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold shadow-sm backdrop-blur-sm ${
                    isFull
                      ? 'bg-rose-500/90 text-white'
                      : 'bg-emerald-600/90 text-white'
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      isFull ? 'bg-white' : 'bg-emerald-200 animate-pulse'
                    }`}
                  />
                  {isFull ? 'Tiket Penuh' : 'Tiket Tersedia'}
                </span>
              </div>
            </div>

            {/* Konten Kartu */}
            <div className="p-4 flex flex-col flex-1">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="text-sm font-bold text-brand-text leading-snug group-hover:text-brand-maroon transition-colors line-clamp-2 flex-1">
                  {event.title}
                </h3>
                <div className="flex items-center gap-1 shrink-0">
                  <span className="text-xs font-extrabold text-brand-maroon whitespace-nowrap">
                    {formatRupiah(event.price)}
                  </span>
                  <button
                    type="button"
                    onClick={() => onEdit(event)}
                    title="Edit Agenda"
                    className="rounded-lg p-1 text-brand-muted transition-colors hover:bg-brand-cream-card hover:text-brand-maroon cursor-pointer"
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(event)}
                    title="Hapus Agenda"
                    className="rounded-lg p-1 text-brand-muted transition-colors hover:bg-rose-50 hover:text-rose-600 cursor-pointer"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-brand-muted">
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-brand-maroon shrink-0" />
                  <span>
                    {formatISODateToIndonesian(event.date)} · {event.time}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-brand-maroon shrink-0" />
                  <span className="line-clamp-1">{event.location}</span>
                </div>
              </div>

              {/* Progress Bar Kuota Tiket */}
              <div className="mt-4 pt-3 border-t border-brand-cream-accent/60">
                <div className="flex items-center justify-between text-[11px] font-medium text-brand-muted mb-1.5">
                  <span className="flex items-center gap-1">
                    <Users size={12} className="text-brand-maroon" /> Kuota Pengunjung
                  </span>
                  <span className="font-bold text-brand-text">
                    {event.sold} / {event.total} Tiket ({percent}%)
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-brand-cream-accent overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isFull ? 'bg-rose-500' : 'bg-brand-maroon'
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default EventCardList;
