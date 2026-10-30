"use client";

import React from 'react';
import { Calendar, MapPin, Pencil, Trash2, Images } from 'lucide-react';
import { EventItem } from './types';

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
  const [failedImages, setFailedImages] = React.useState<Record<number, boolean>>({});

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
      <div className="rounded-2xl border border-dashed border-brand-cream-accent p-10 text-center bg-white/60">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-cream-card text-brand-muted mb-2">
          <Calendar size={24} />
        </div>
        <p className="text-sm font-bold text-brand-text">Belum Ada Agenda</p>
        <p className="mt-1 text-xs text-brand-muted">
          Klik tombol &ldquo;Tambah Event Baru&rdquo; untuk menambahkan acara budaya.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => {
        const percentage = Math.round((event.sold / event.total) * 100);
        return (
          <div
            key={event.id}
            className="flex flex-col justify-between rounded-2xl border border-brand-cream-accent bg-white overflow-hidden shadow-sm hover:shadow-md transition-all group"
          >
            {/* Banner Foto Event */}
            <div className="relative w-full h-36 bg-[#FAF6F0] flex items-center justify-center overflow-hidden">
              {resolveEventImage(event) ? (
                <img
                  src={resolveEventImage(event)}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={() => handleImageError(event.id)}
                />
              ) : (
                <div className="flex flex-col items-center gap-1.5 text-[#C59A3F]/60">
                  <Images size={32} strokeWidth={1.5} />
                  <span className="text-[10px] font-medium text-brand-muted">Belum ada banner</span>
                </div>
              )}
              {/* Status badge overlay di atas banner */}
              <span
                className={`absolute top-2.5 left-2.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold shadow ${
                  event.status === 'Penuh'
                    ? 'bg-rose-600 text-white'
                    : 'bg-emerald-500 text-white'
                }`}
              >
                {event.status}
              </span>
            </div>

            {/* Konten Kartu */}
            <div className="p-4 flex flex-col flex-1">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="text-sm font-bold text-brand-text leading-snug group-hover:text-brand-maroon transition-colors line-clamp-2 flex-1">
                  {event.title}
                </h3>
                <div className="flex items-center gap-1 shrink-0">
                  <span className="text-xs font-extrabold text-brand-maroon whitespace-nowrap">
                    {event.price}
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
                    {event.date} · {event.time}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-brand-maroon shrink-0" />
                  <span>{event.location}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-brand-cream-accent">
                <div className="mb-1 flex justify-between text-xs font-medium">
                  <span className="text-brand-muted">Tiket Terjual</span>
                  <span className="font-bold text-brand-text">
                    {event.sold} / {event.total} ({percentage}%)
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-brand-cream-accent">
                  <div
                    className={`h-full rounded-full transition-all ${
                      percentage >= 100 ? 'bg-rose-500' : 'bg-brand-maroon'
                    }`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
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
