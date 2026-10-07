"use client";

import React, { useState } from 'react';
import { Calendar, Ticket, Plus, Users, MapPin, Trash2, Pencil, X } from 'lucide-react';

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
}

export const AgendaView = () => {
  const [events, setEvents] = useState<EventItem[]>([
    { id: 1, title: 'Prasasti Trowulan & Diskusi Artefak', date: 'Sabtu, 28 September 2026', time: '15:00 - 18:00 WIB', location: 'Pendopo Utama RBR', price: 'Rp 35.000', sold: 42, total: 50, status: 'Aktif' },
    { id: 2, title: 'Lokakarya Batik Tulis Canting Tradisional', date: 'Minggu, 29 September 2026', time: '09:00 - 12:00 WIB', location: 'Galeri Kriya RBR', price: 'Rp 75.000', sold: 30, total: 30, status: 'Penuh' },
    { id: 3, title: 'Malam Pagelaran Wayang Kulit Melenial', date: 'Sabtu, 05 Oktober 2026', time: '19:30 - Selesai', location: 'Halaman Kebun RBR', price: 'Rp 50.000', sold: 18, total: 100, status: 'Aktif' },
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
  });

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
    });
    setFormModalOpen(true);
  };

  const handleOpenEdit = (event: EventItem) => {
    setIsEditing(true);
    setCurrentEvent(event);
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-brand-text">Agenda Budaya & Kuota Tiket</h1>
          <p className="text-xs text-brand-muted">Atur penjadwalan acara kebudayaan dan pantau kuota penonton</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 rounded-xl bg-brand-gold px-4 py-2.5 text-xs font-bold text-brand-maroon shadow hover:bg-amber-400 transition-colors"
        >
          <Plus size={16} />
          <span>Tambah Event Baru</span>
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {events.map((event) => {
          const percentage = Math.round((event.sold / event.total) * 100);
          return (
            <div key={event.id} className="flex flex-col justify-between rounded-2xl border border-brand-cream-accent bg-white p-5 shadow-sm">
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                    event.status === 'Penuh' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {event.status}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-brand-maroon">{event.price}</span>
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

                <h3 className="text-sm font-bold text-brand-text leading-snug">{event.title}</h3>
                
                <div className="mt-3 space-y-1.5 text-xs text-brand-muted">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-brand-maroon" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-brand-maroon" />
                    <span>{event.location}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 border-t border-brand-cream-accent pt-4">
                <div className="mb-1 flex justify-between text-xs font-medium">
                  <span className="text-brand-muted">Tiket Terjual</span>
                  <span className="font-bold text-brand-text">{event.sold} / {event.total} ({percentage}%)</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-brand-cream-accent">
                  <div className="h-full bg-brand-maroon rounded-full" style={{ width: `${percentage}%` }}></div>
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
          <div className="w-full max-w-md rounded-2xl border border-brand-cream-accent bg-white p-6 shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <div className="mb-4 flex items-center justify-between border-b border-brand-cream-accent pb-3">
              <h3 className="text-sm font-bold text-brand-text">
                {isEditing ? 'Edit Agenda Budaya' : 'Tambah Event Baru'}
              </h3>
              <button
                type="button"
                onClick={() => setFormModalOpen(false)}
                className="rounded-lg p-1 text-brand-muted hover:bg-brand-cream-card hover:text-brand-text transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveEvent} className="space-y-3.5 text-xs">
              <div>
                <label className="mb-1 block font-semibold text-brand-text">Judul Acara</label>
                <input
                  type="text"
                  required
                  value={currentEvent.title || ''}
                  onChange={(e) => setCurrentEvent({ ...currentEvent, title: e.target.value })}
                  className="w-full rounded-xl border border-brand-cream-accent p-2.5 text-xs focus:border-brand-maroon focus:outline-none"
                  placeholder="Contoh: Diskusi Artefak Kuno"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block font-semibold text-brand-text">Tanggal</label>
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
                  <label className="mb-1 block font-semibold text-brand-text">Waktu</label>
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

              <div>
                <label className="mb-1 block font-semibold text-brand-text">Lokasi</label>
                <input
                  type="text"
                  required
                  value={currentEvent.location || ''}
                  onChange={(e) => setCurrentEvent({ ...currentEvent, location: e.target.value })}
                  className="w-full rounded-xl border border-brand-cream-accent p-2.5 text-xs focus:border-brand-maroon focus:outline-none"
                  placeholder="Pendopo Utama RBR"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="mb-1 block font-semibold text-brand-text">Harga Tiket</label>
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
                  <label className="mb-1 block font-semibold text-brand-text">Total Kuota</label>
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

              <div className="mt-5 flex items-center justify-end gap-2.5 pt-2">
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