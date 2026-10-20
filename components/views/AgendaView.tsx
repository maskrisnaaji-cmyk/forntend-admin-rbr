"use client";

import React, { useState } from 'react';
import { Calendar, Plus, MapPin, Trash2, Pencil, X, ImageUp, Images, Ticket } from 'lucide-react';

interface EventItem {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  price: string;
  sold: number;
  total: number;
  status: string;
  image?: string;
}

export const AgendaView = () => {
  const [events, setEvents] = useState<EventItem[]>([
    { id: 1, title: 'Prasasti Trowulan & Diskusi Artefak', date: 'Sabtu, 28 September 2026', time: '15:00 - 18:00 WIB', location: 'Pendopo Utama RBR', price: 'Rp 35.000', sold: 42, total: 50, status: 'Aktif', image: '/rbr.jpeg' },
    { id: 2, title: 'Lokakarya Batik Tulis Canting Tradisional', date: 'Minggu, 29 September 2026', time: '09:00 - 12:00 WIB', location: 'Galeri Kriya RBR', price: 'Rp 75.000', sold: 30, total: 30, status: 'Penuh', image: '/rbr.jpeg' },
    { id: 3, title: 'Malam Pagelaran Wayang Kulit Melenial', date: 'Sabtu, 05 Oktober 2026', time: '19:30 - Selesai', location: 'Halaman Kebun RBR', price: 'Rp 50.000', sold: 18, total: 100, status: 'Aktif', image: '/rbr.jpeg' },
  ]);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<EventItem | null>(null);

  const [formModalOpen, setFormModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<Partial<EventItem>>({
    title: '',
    date: '',
    time: '',
    location: '',
    price: '',
    sold: 0,
    total: 50,
    status: 'Aktif',
    image: '',
  });

  const [bannerPreview, setBannerPreview] = useState<string>('');

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setBannerPreview(objectUrl);
    setCurrentEvent((prev) => ({ ...prev, image: objectUrl }));
  };

  const handleOpenCreate = () => {
    setIsEditing(false);
    setCurrentEvent({
      title: '',
      date: 'Sabtu, 12 Oktober 2026',
      time: '15:00 - 18:00 WIB',
      location: 'Pendopo Utama RBR',
      price: 'Rp 50.000',
      sold: 0,
      total: 50,
      status: 'Aktif',
      image: '',
    });
    setBannerPreview('');
    setFormModalOpen(true);
  };

  const handleOpenEdit = (event: EventItem) => {
    setIsEditing(true);
    setCurrentEvent(event);
    setBannerPreview(event.image || '');
    setFormModalOpen(true);
  };

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentEvent.title) return;

    if (isEditing && currentEvent.id) {
      setEvents((prev) =>
        prev.map((ev) => (ev.id === currentEvent.id ? (currentEvent as EventItem) : ev))
      );
    } else {
      const newEvent: EventItem = {
        id: Date.now(),
        title: currentEvent.title || 'Event Baru',
        date: currentEvent.date || 'Sabtu, 12 Oktober 2026',
        time: currentEvent.time || '15:00 - 18:00 WIB',
        location: currentEvent.location || 'Pendopo Utama RBR',
        price: currentEvent.price || 'Rp 35.000',
        sold: Number(currentEvent.sold) || 0,
        total: Number(currentEvent.total) || 50,
        status: currentEvent.status || 'Aktif',
        image: currentEvent.image || '',
      };
      setEvents((prev) => [newEvent, ...prev]);
    }
    setFormModalOpen(false);
  };

  const handleRequestDelete = (event: EventItem) => {
    setEventToDelete(event);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (eventToDelete) {
      setEvents((prev) => prev.filter((ev) => ev.id !== eventToDelete.id));
      setEventToDelete(null);
    }
    setDeleteModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-brand-text">Agenda Budaya &amp; Kuota Tiket</h1>
          <p className="text-xs text-brand-muted">Atur penjadwalan acara kebudayaan dan pantau kuota penonton</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center justify-center gap-2 rounded-xl bg-brand-gold px-4 py-2.5 text-xs font-bold text-brand-maroon shadow hover:bg-amber-400 transition-colors"
        >
          <Plus size={16} />
          <span>Tambah Event Baru</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => {
          const percentage = Math.round((event.sold / event.total) * 100);
          return (
            <div key={event.id} className="flex flex-col justify-between rounded-2xl border border-brand-cream-accent bg-white overflow-hidden shadow-sm hover:shadow-md transition-all group">

              {/* Banner Foto Event */}
              <div className="relative w-full h-36 bg-[#FAF6F0] flex items-center justify-center overflow-hidden">
                {event.image ? (
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-1.5 text-[#C59A3F]/60">
                    <Images size={32} strokeWidth={1.5} />
                    <span className="text-[10px] font-medium text-brand-muted">Belum ada banner</span>
                  </div>
                )}
                {/* Status badge overlay di atas banner */}
                <span className={`absolute top-2.5 left-2.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold shadow ${event.status === 'Penuh' ? 'bg-rose-600 text-white' : 'bg-emerald-500 text-white'
                  }`}>
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
                    <span className="text-xs font-extrabold text-brand-maroon whitespace-nowrap">{event.price}</span>
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(event)}
                      title="Edit Agenda"
                      className="rounded-lg p-1 text-brand-muted transition-colors hover:bg-brand-cream-card hover:text-brand-maroon"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRequestDelete(event)}
                      title="Hapus Agenda"
                      className="rounded-lg p-1 text-brand-muted transition-colors hover:bg-rose-50 hover:text-rose-600"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-brand-muted">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-brand-maroon shrink-0" />
                    <span>{event.date} · {event.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-brand-maroon shrink-0" />
                    <span>{event.location}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-brand-cream-accent">
                  <div className="mb-1 flex justify-between text-xs font-medium">
                    <span className="text-brand-muted">Tiket Terjual</span>
                    <span className="font-bold text-brand-text">{event.sold} / {event.total} ({percentage}%)</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-brand-cream-accent">
                    <div
                      className={`h-full rounded-full transition-all ${percentage >= 100 ? 'bg-rose-500' : 'bg-brand-maroon'}`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Konfirmasi Hapus */}
      {deleteModalOpen && eventToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl border border-brand-cream-accent bg-white p-6 shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-600 mb-3">
              <Trash2 size={22} />
            </div>
            <h3 className="text-center text-sm font-bold text-brand-text">Konfirmasi Hapus Agenda</h3>
            <p className="mt-2 text-center text-xs text-brand-muted leading-relaxed">
              Apakah Anda yakin ingin menghapus agenda <span className="font-semibold text-brand-text">&ldquo;{eventToDelete.title}&rdquo;</span>? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="mt-6 flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => { setDeleteModalOpen(false); setEventToDelete(null); }}
                className="flex-1 rounded-xl border border-brand-cream-accent bg-brand-cream-card py-2.5 text-xs font-bold text-brand-muted hover:bg-brand-cream-accent hover:text-brand-text transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 rounded-xl bg-rose-600 py-2.5 text-xs font-bold text-white shadow hover:bg-rose-700 transition-colors"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Tambah / Edit Agenda */}
      {formModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-brand-cream-accent bg-white p-5 sm:p-6 shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <div className="mb-4 flex items-center justify-between border-b border-brand-cream-accent pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-gold/20 text-brand-maroon">
                  <Ticket size={16} />
                </div>
                <h3 className="text-sm font-bold text-brand-text">
                  {isEditing ? 'Edit Agenda Budaya' : 'Tambah Event Baru'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setFormModalOpen(false)}
                className="rounded-lg p-1 text-brand-muted hover:bg-brand-cream-card hover:text-brand-text transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveEvent} className="space-y-3.5 text-xs">

              {/* Judul Acara */}
              <div>
                <label className="mb-1 block font-semibold text-brand-text">
                  Judul Acara <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={currentEvent.title || ''}
                  onChange={(e) => setCurrentEvent({ ...currentEvent, title: e.target.value })}
                  className="w-full rounded-xl border border-brand-cream-accent p-2.5 text-xs focus:border-brand-maroon focus:outline-none"
                  placeholder="Contoh: Diskusi Artefak Kuno Nusantara"
                />
              </div>

              {/* Tanggal & Waktu */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block font-semibold text-brand-text">
                    Tanggal <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={currentEvent.date || ''}
                    onChange={(e) => setCurrentEvent({ ...currentEvent, date: e.target.value })}
                    className="w-full rounded-xl border border-brand-cream-accent p-2.5 text-xs focus:border-brand-maroon focus:outline-none"
                    placeholder="Sabtu, 28 September 2026"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-semibold text-brand-text">
                    Waktu <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={currentEvent.time || ''}
                    onChange={(e) => setCurrentEvent({ ...currentEvent, time: e.target.value })}
                    className="w-full rounded-xl border border-brand-cream-accent p-2.5 text-xs focus:border-brand-maroon focus:outline-none"
                    placeholder="15:00 - 18:00 WIB"
                  />
                </div>
              </div>

              {/* Lokasi */}
              <div>
                <label className="mb-1 block font-semibold text-brand-text">
                  Lokasi <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={currentEvent.location || ''}
                  onChange={(e) => setCurrentEvent({ ...currentEvent, location: e.target.value })}
                  className="w-full rounded-xl border border-brand-cream-accent p-2.5 text-xs focus:border-brand-maroon focus:outline-none"
                  placeholder="Pendopo Utama RBR"
                />
              </div>

              {/* Harga, Terjual, Kuota */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                <div>
                  <label className="mb-1 block font-semibold text-brand-text">
                    Harga Tiket <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={currentEvent.price || ''}
                    onChange={(e) => setCurrentEvent({ ...currentEvent, price: e.target.value })}
                    className="w-full rounded-xl border border-brand-cream-accent p-2.5 text-xs focus:border-brand-maroon focus:outline-none"
                    placeholder="Rp 35.000"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-semibold text-brand-text">Terjual</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={currentEvent.sold ?? 0}
                    onChange={(e) => setCurrentEvent({ ...currentEvent, sold: Number(e.target.value) })}
                    className="w-full rounded-xl border border-brand-cream-accent p-2.5 text-xs focus:border-brand-maroon focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-semibold text-brand-text">
                    Total Kuota <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={currentEvent.total ?? 50}
                    onChange={(e) => setCurrentEvent({ ...currentEvent, total: Number(e.target.value) })}
                    className="w-full rounded-xl border border-brand-cream-accent p-2.5 text-xs focus:border-brand-maroon focus:outline-none"
                  />
                </div>
              </div>

              {/* Status Kuota */}
              <div>
                <label className="mb-1 block font-semibold text-brand-text">Status Kuota</label>
                <select
                  value={currentEvent.status || 'Aktif'}
                  onChange={(e) => setCurrentEvent({ ...currentEvent, status: e.target.value })}
                  className="w-full rounded-xl border border-brand-cream-accent p-2.5 text-xs focus:border-brand-maroon focus:outline-none bg-white"
                >
                  <option value="Aktif">Aktif</option>
                  <option value="Penuh">Penuh</option>
                </select>
              </div>

              {/* Upload Banner Event */}
              <div>
                <label className="mb-1.5 block font-semibold text-brand-text">
                  Banner / Foto Event
                </label>
                <label
                  htmlFor="banner-upload"
                  className={`flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed transition-colors overflow-hidden ${bannerPreview
                      ? 'border-brand-gold bg-amber-50/50'
                      : 'border-brand-cream-accent bg-[#FAF6F0] hover:border-brand-gold hover:bg-amber-50/30'
                    }`}
                >
                  {bannerPreview ? (
                    <div className="relative w-full">
                      <img
                        src={bannerPreview}
                        alt="Preview banner"
                        className="w-full h-32 object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
                        <span className="text-white text-[10px] font-bold flex items-center gap-1">
                          <ImageUp size={14} /> Ganti Foto
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1.5 py-5 px-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-gold/20 text-brand-maroon">
                        <ImageUp size={20} />
                      </div>
                      <span className="text-[11px] font-semibold text-brand-text">Klik untuk upload foto banner</span>
                      <span className="text-[10px] text-brand-muted">PNG, JPG, JPEG hingga 5MB</span>
                    </div>
                  )}
                  <input
                    id="banner-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleBannerChange}
                  />
                </label>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 flex items-center justify-end gap-2.5 pt-2 border-t border-brand-cream-accent">
                <button
                  type="button"
                  onClick={() => setFormModalOpen(false)}
                  className="rounded-xl border border-brand-cream-accent bg-brand-cream-card px-4 py-2.5 text-xs font-bold text-brand-muted hover:bg-brand-cream-accent hover:text-brand-text transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-brand-maroon px-5 py-2.5 text-xs font-bold text-white shadow hover:bg-brand-maroon-light transition-colors"
                >
                  {isEditing ? 'Simpan Perubahan' : 'Simpan Agenda'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
