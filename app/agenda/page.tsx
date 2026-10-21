"use client";

import React, { useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Plus } from 'lucide-react';
import { EventItem } from './components/types';
import { EventCardList } from './components/EventCardList';
import { EventModal } from './components/EventModal';
import { DeleteEventModal } from './components/DeleteEventModal';

export default function AgendaPage() {
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
    <AdminLayout activeTab="agenda">
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold text-brand-text">Agenda Budaya &amp; Kuota Tiket</h1>
            <p className="text-xs text-brand-muted">
              Atur penjadwalan acara kebudayaan dan pantau kuota penonton
            </p>
          </div>
          <button
            onClick={handleOpenCreate}
            className="flex items-center justify-center gap-2 rounded-xl bg-brand-gold px-4 py-2.5 text-xs font-bold text-brand-maroon shadow hover:bg-amber-400 transition-colors cursor-pointer"
          >
            <Plus size={16} />
            <span>Tambah Event Baru</span>
          </button>
        </div>

        {/* List Card Event */}
        <EventCardList
          events={events}
          onEdit={handleOpenEdit}
          onDelete={handleRequestDelete}
        />

        {/* Modal Tambah / Edit */}
        <EventModal
          isOpen={formModalOpen}
          isEditing={isEditing}
          currentEvent={currentEvent}
          bannerPreview={bannerPreview}
          onClose={() => setFormModalOpen(false)}
          onChange={(upd) => setCurrentEvent((prev) => ({ ...prev, ...upd }))}
          onBannerChange={handleBannerChange}
          onSubmit={handleSaveEvent}
        />

        {/* Modal Konfirmasi Hapus */}
        <DeleteEventModal
          isOpen={deleteModalOpen}
          eventToDelete={eventToDelete}
          onClose={() => {
            setDeleteModalOpen(false);
            setEventToDelete(null);
          }}
          onConfirm={handleConfirmDelete}
        />
      </div>
    </AdminLayout>
  );
}
