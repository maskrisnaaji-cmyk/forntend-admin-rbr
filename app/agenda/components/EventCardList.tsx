"use client";

import React, { useState } from 'react';
import { Calendar, MapPin, Users, Ticket, Pencil, Trash2, Check, X as XIcon, User } from 'lucide-react';
import { EventItem } from './types';
import { formatISODateToIndonesian } from '@/lib/formatDate';

/**
 * Format harga tiket untuk kartu agenda secara utuh (contoh: "Rp 25.000", "Rp 35.000", atau "Gratis").
 * Mencegah angka ribuan terpangkas menjadi "Rp 25" dan menjaga tampilan tetap rapi di satu baris.
 */
export function formatCardPrice(event: EventItem): string {
  const priceStr = String(event.price || '').trim();
  if (
    priceStr.toLowerCase() === 'gratis' ||
    priceStr.toLowerCase() === 'free' ||
    (event.priceRaw === 0 && (priceStr === '' || priceStr === '0' || priceStr === 'Rp 0'))
  ) {
    return 'Gratis';
  }

  let num = typeof event.priceRaw === 'number' && event.priceRaw > 0
    ? event.priceRaw
    : 0;

  if (!num && priceStr) {
    const digits = priceStr.replace(/[^0-9]/g, '');
    num = Number(digits) || 0;
  }

  // Jika angka bernilai kecil (< 1000) dan > 0, berarti terjadi pemotongan ribuan (misal 25 untuk 25.000)
  if (num > 0 && num < 1000) {
    num = num * 1000;
  }

  if (num === 0) return 'Gratis';
  return `Rp ${new Intl.NumberFormat('id-ID').format(num)}`;
}

interface EventCardListProps {
  events: EventItem[];
  onEdit: (event: EventItem) => void;
  onDelete: (event: EventItem) => void;
  onApprove?: (event: EventItem) => void;
  onReject?: (event: EventItem) => void;
}

export const EventCardList: React.FC<EventCardListProps> = ({
  events,
  onEdit,
  onDelete,
  onApprove,
  onReject,
}) => {
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});

  const handleImageError = (id: number) => {
    setFailedImages((prev) => ({ ...prev, [id]: true }));
  };

  const resolveEventImage = (event: EventItem) => {
    const raw = event.image?.trim();
    if (raw && !failedImages[event.id]) {
      if (
        raw.startsWith('http://') ||
        raw.startsWith('https://') ||
        raw.startsWith('blob:') ||
        raw.startsWith('data:')
      ) {
        return raw;
      }
      if (raw.startsWith('assets/images/')) {
        return `/${raw.replace('assets/images/', '')}`;
      }
      return raw.startsWith('/') ? raw : `/${raw}`;
    }

    // Fallback: tebak dari judul/tanggal (kompatibel dengan asset mobile)
    const t = (event.title || '').toLowerCase();
    const d = (event.date || '').toLowerCase();
    if (t.includes('napak')) return '/napak_tanah.jpeg';
    if (t.includes('rungkad') || t.includes('teater')) return '/pak_rungkad.jpeg';
    if (t.includes('obrolan') || t.includes('kearifan') || d.includes('10-08')) return '/oktober_08_obrolan_budaya.jpg';
    if (t.includes('batik') || t.includes('pameran') || d.includes('10-09')) return '/oktober_09_pameran_batik.jpg';
    if (t.includes('keramik') || t.includes('workshop') || d.includes('10-11')) return '/oktober_11_workshop_keramik.jpg';
    if (t.includes('akustik') || t.includes('puisi') || d.includes('10-12')) return '/oktober_12_malam_akustik.jpg';
    if (t.includes('sabtu') || t.includes('gotong') || d.includes('10-13')) return '/oktober_13_sabtu_budaya.jpg';
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
        const quota = event.quota || 0;
        const booked = event.booked_count ?? event.sold ?? 0;
        const percent = quota > 0 ? Math.min(100, Math.round((booked / quota) * 100)) : 0;
        // Gunakan is_available dari backend; fallback dari status
        const isFull = !event.is_available || event.status === 'Tiket Penuh';
        const isPending =
          event.status_approval === 'pending' ||
          event.status === 'Menunggu Persetujuan' ||
          (event.status as string) === 'Pending';
        const isRejected =
          event.status_approval === 'rejected' || event.status === 'Ditolak';
        const bannerSrc = resolveEventImage(event);

        return (
          <div
            key={event.id}
            className="group flex flex-col rounded-2xl border border-brand-cream-accent bg-white overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
          >
            {/* Banner */}
            <div className="relative h-44 w-full bg-stone-100 overflow-hidden">
              <img
                src={bannerSrc}
                alt={event.title}
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
                decoding="async"
                onError={() => handleImageError(event.id)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

              {/* Badge Status */}
              <div className="absolute top-3 left-3">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold shadow-sm backdrop-blur-sm ${
                    isPending
                      ? 'bg-amber-500/95 text-white'
                      : isRejected
                      ? 'bg-rose-600/95 text-white'
                      : isFull
                      ? 'bg-rose-500/90 text-white'
                      : 'bg-emerald-600/90 text-white'
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      isPending
                        ? 'bg-amber-100 animate-pulse'
                        : isFull
                        ? 'bg-white'
                        : 'bg-emerald-200 animate-pulse'
                    }`}
                  />
                  {isPending
                    ? 'Menunggu Persetujuan'
                    : isRejected
                    ? 'Ditolak'
                    : isFull
                    ? 'Tiket Penuh'
                    : 'Tiket Tersedia'}
                </span>
              </div>

              {/* Badge Kuota sisa (pojok kanan) */}
              {!isFull && quota > 0 && (
                <div className="absolute top-3 right-3">
                  <span className="inline-flex items-center gap-1 rounded-full bg-black/40 backdrop-blur-sm px-2 py-0.5 text-[10px] font-semibold text-white">
                    {event.remaining_tickets} sisa
                  </span>
                </div>
              )}
            </div>

            {/* Konten */}
            <div className="p-4 flex flex-col flex-1">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="text-sm font-bold text-brand-text leading-snug group-hover:text-brand-maroon transition-colors line-clamp-2 flex-1">
                  {event.title}
                </h3>
                <div className="flex items-center gap-1 shrink-0">
                  <span className="text-xs font-extrabold text-brand-maroon whitespace-nowrap shrink-0">
                    {formatCardPrice(event)}
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
                {event.organizer_name && (
                  <div className="flex items-center gap-2 text-brand-text font-medium">
                    <User size={14} className="text-brand-gold shrink-0" />
                    <span className="line-clamp-1">
                      Fasilitator: {event.organizer_name}
                      {event.organizer_contact
                        ? ` (${event.organizer_contact})`
                        : ''}
                    </span>
                  </div>
                )}
              </div>

              {/* Progress Bar Kuota */}
              <div className="mt-4 pt-3 border-t border-brand-cream-accent/60">
                <div className="flex items-center justify-between text-[11px] font-medium text-brand-muted mb-1.5">
                  <span className="flex items-center gap-1">
                    <Users size={12} className="text-brand-maroon" /> Kuota Pengunjung
                  </span>
                  <span className="font-bold text-brand-text">
                    {booked} / {quota > 0 ? quota : '∞'} Tiket{quota > 0 ? ` (${percent}%)` : ''}
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-brand-cream-accent overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isFull ? 'bg-rose-500' : percent >= 80 ? 'bg-amber-500' : 'bg-brand-maroon'
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
                {/* Teks sisa tiket */}
                {quota > 0 && (
                  <p className={`mt-1 text-[10px] font-semibold ${isFull ? 'text-rose-500' : 'text-emerald-700'}`}>
                    {isFull ? 'Semua tiket telah habis terjual' : `${event.remaining_tickets} tiket masih tersedia`}
                  </p>
                )}
              </div>

              {/* Action Bar Persetujuan Lokakarya */}
              {isPending && onApprove && (
                <div className="mt-3 pt-2.5 border-t border-amber-200/60 flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                    Pengajuan Lokakarya
                  </span>
                  <div className="flex items-center gap-1.5">
                    {onReject && (
                      <button
                        type="button"
                        onClick={() => onReject(event)}
                        title="Tolak Pengajuan"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
                      >
                        <XIcon size={12} /> Tolak
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => onApprove(event)}
                      title="Setujui Lokakarya agar Tayang Publik"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-colors cursor-pointer"
                    >
                      <Check size={12} /> Setujui
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default EventCardList;
