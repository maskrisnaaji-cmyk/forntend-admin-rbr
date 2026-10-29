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
    { id: 1, title: 'Napak Tanah', date: 'Sabtu, 28 September 2026', time: '15:00 - 18:00 WIB', location: 'Pendopo Utama RBR', price: 'Rp 35.000', sold: 42, total: 50, status: 'Aktif', image: '/napak_tanah.jpeg' },
    { id: 2, title: 'Pak Rungkad', date: 'Minggu, 29 September 2026', time: '09:00 - 12:00 WIB', location: 'Galeri Kriya RBR', price: 'Rp 75.000', sold: 30, total: 30, status: 'Penuh', image: '/pak_rungkad.jpeg' },
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
  const [selectedBannerFile, setSelectedBannerFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedBannerFile(file);
    const objectUrl = URL.createObjectURL(file);
    setBannerPreview(objectUrl);
    setCurrentEvent((prev) => ({ ...prev, image: objectUrl }));
  };

  const handleOpenCreate = () => {
    setIsEditing(false);
    setSelectedBannerFile(null);
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

  // Fetch events from backend on mount
  const fetchEventsFromBackend = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/events');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const mapped: EventItem[] = data.map((d: any) => ({
            id: d.id,
            title: d.title || d.tittle || '',
            date: d.date || '',
            time: d.time || '',
            location: d.location || 'Pendopo Utama RBR',
            price: typeof d.price === 'number' ? `Rp ${d.price.toLocaleString('id-ID')}` : (d.price || 'Rp 0'),
            sold: Number(d.sold) || 0,
            total: Number(d.quota) || 50,
            status: d.status || 'Aktif',
            image: d.image || d.banner_image || '',
          }));
          setEvents(mapped);
        }
      }
    } catch (e) {
      console.warn('Backend events offline, using local state:', e);
    }
  };

  React.useEffect(() => {
    fetchEventsFromBackend();
  }, []);

  const handleOpenEdit = (event: EventItem) => {
    setIsEditing(true);
    setSelectedBannerFile(null);
    setCurrentEvent(event);
    setBannerPreview(event.image || '');
    setFormModalOpen(true);
  };

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentEvent.title) return;

    const numericPrice = Number(String(currentEvent.price).replace(/[^0-9]/g, '')) || 0;
    const numericQuota = Number(currentEvent.total) || 50;
    const numericSold = Number(currentEvent.sold) || 0;
    let finalImageUrl = currentEvent.image || '';

    // 1. FORM DATA & UPLOAD: Kirim file gambar menggunakan FormData ke backend Vercel Blob jika ada file baru
    if (selectedBannerFile) {
      try {
        setIsUploading(true);
        const uploadFormData = new FormData();
        uploadFormData.append('file', selectedBannerFile);
        if (isEditing && currentEvent.id) {
          uploadFormData.append('entity', 'event');
          uploadFormData.append('entityId', String(currentEvent.id));
        }

        const uploadRes = await fetch('http://localhost:5000/api/upload', {
          method: 'POST',
          body: uploadFormData,
        });

        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          if (uploadData.url) {
            finalImageUrl = uploadData.url;
            setCurrentEvent((prev) => ({ ...prev, image: uploadData.url }));
          }
        } else {
          const errData = await uploadRes.json().catch(() => ({}));
          console.warn('Gagal upload banner agenda ke Vercel Blob:', errData.message);
        }
      } catch (uploadErr) {
        console.error('Error saat upload banner agenda:', uploadErr);
      } finally {
        setIsUploading(false);
      }
    }

    // 2. PENANGANAN URL CLOUD: Simpan URL cloud yang dikembalikan backend ke database
    try {
      if (isEditing && currentEvent.id) {
        await fetch(`http://localhost:5000/api/events/${currentEvent.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: currentEvent.title,
            date: currentEvent.date,
            time: currentEvent.time,
            location: currentEvent.location,
            price: numericPrice,
            quota: numericQuota,
            sold: numericSold,
            status: currentEvent.status,
            image: finalImageUrl,
            banner_image: finalImageUrl,
          }),
        });
      } else {
        await fetch('http://localhost:5000/api/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: currentEvent.title,
            date: currentEvent.date,
            time: currentEvent.time,
            location: currentEvent.location,
            price: numericPrice,
            quota: numericQuota,
            sold: numericSold,
            status: currentEvent.status,
            image: finalImageUrl,
            banner_image: finalImageUrl,
          }),
        });
      }
      fetchEventsFromBackend();
    } catch (e) {
      console.error('Gagal sync event ke backend:', e);
      if (isEditing && currentEvent.id) {
        setEvents((prev) =>
          prev.map((ev) => (ev.id === currentEvent.id ? ({ ...currentEvent, image: finalImageUrl } as EventItem) : ev))
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
          image: finalImageUrl,
        };
        setEvents((prev) => [newEvent, ...prev]);
      }
    }
    setSelectedBannerFile(null);
    setFormModalOpen(false);
  };

  const handleRequestDelete = (event: EventItem) => {
    setEventToDelete(event);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (eventToDelete) {
      try {
        await fetch(`http://localhost:5000/api/events/${eventToDelete.id}`, {
          method: 'DELETE',
        });
        fetchEventsFromBackend();
      } catch (e) {
        console.warn('Gagal hapus event di backend:', e);
        setEvents((prev) => prev.filter((ev) => ev.id !== eventToDelete.id));
      }
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
            className="flex items-center justify-center gap-2 rounded-xl bg-brand-maroon px-4 py-2.5 text-xs font-bold text-white shadow hover:bg-brand-maroon-light transition-colors cursor-pointer"
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
          isUploading={isUploading}
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
