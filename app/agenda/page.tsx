"use client";

import React, { useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Plus } from 'lucide-react';
import { EventItem } from './components/types';
import { EventCardList } from './components/EventCardList';
import { EventModal } from './components/EventModal';
import { DeleteEventModal } from './components/DeleteEventModal';
import { formatRupiah } from '@/lib/formatCurrency';
import { normalizeDateToISO } from '@/lib/formatDate';

export default function AgendaPage() {
  const [events, setEvents] = useState<EventItem[]>([
    { id: 1, title: 'Napak Tanah', date: '2026-09-28', time: '15:00 - 18:00 WIB', location: 'Pendopo Utama RBR', price: 'Rp 35.000', sold: 42, total: 50, status: 'Aktif', image: '/napak_tanah.jpeg' },
    { id: 2, title: 'Pak Rungkad', date: '2026-09-29', time: '09:00 - 12:00 WIB', location: 'Galeri Kriya RBR', price: 'Rp 75.000', sold: 30, total: 30, status: 'Penuh', image: '/pak_rungkad.jpeg' },
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
    // Jangan simpan URL sementara "blob:..." ke data event
  };

  const handleOpenCreate = () => {
    setIsEditing(false);
    setSelectedBannerFile(null);
    setCurrentEvent({
      title: '',
      date: '2026-10-12',
      time: '15:00 - 18:00 WIB',
      location: 'Pendopo Utama RBR',
      price: '50000',
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
            price: formatRupiah(d.price),
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

    // Pastikan tidak ada sisa URL blob lokal
    if (finalImageUrl.startsWith('blob:')) {
      finalImageUrl = '';
    }

    // 1. INTEGRASI VERCEL BLOB: Upload ke cloud permanen
    if (selectedBannerFile) {
      try {
        setIsUploading(true);
        const uploadFormData = new FormData();
        uploadFormData.append('file', selectedBannerFile);
        if (isEditing && currentEvent.id) {
          uploadFormData.append('entity', 'event');
          uploadFormData.append('entityId', String(currentEvent.id));
        }

        // Coba upload ke endpoint lokal Next.js atau Express backend
        let uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData,
        }).catch(() => null);

        if (!uploadRes || !uploadRes.ok) {
          uploadRes = await fetch('http://localhost:5000/api/upload', {
            method: 'POST',
            body: uploadFormData,
          });
        }

        if (uploadRes && uploadRes.ok) {
          const uploadData = await uploadRes.json();
          if (uploadData.url && (uploadData.url.startsWith('https://') || uploadData.url.startsWith('http://'))) {
            finalImageUrl = uploadData.url;
            setCurrentEvent((prev) => ({ ...prev, image: uploadData.url }));
          } else {
            throw new Error('URL Vercel Blob tidak valid dari server.');
          }
        } else {
          const errData = await uploadRes?.json().catch(() => ({}));
          throw new Error(errData?.message || 'Gagal mengunggah banner ke Vercel Blob.');
        }
      } catch (uploadErr: any) {
        console.error('Error saat upload banner agenda:', uploadErr);
        alert(`Gagal mengunggah banner ke Vercel Blob: ${uploadErr.message || 'Terjadi kesalahan'}. Penyimpanan dibatalkan agar tidak menyimpan URL sementara.`);
        setIsUploading(false);
        return;
      } finally {
        setIsUploading(false);
      }
    }

    if (finalImageUrl.startsWith('blob:')) {
      alert('Banner belum berhasil diunggah ke cloud. Harap ulangi pemilihan file banner.');
      return;
    }

    // 3. FORMAT TANGGAL ISO STANDAR: Kirim format YYYY-MM-DD ke backend
    const isoDate = normalizeDateToISO(currentEvent.date) || currentEvent.date;

    // 2. PENANGANAN URL CLOUD: Simpan URL cloud yang dikembalikan backend ke database
    try {
      if (isEditing && currentEvent.id) {
        await fetch(`http://localhost:5000/api/events/${currentEvent.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: currentEvent.title,
            date: isoDate,
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
            date: isoDate,
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
          prev.map((ev) => (ev.id === currentEvent.id ? ({ ...currentEvent, date: isoDate, image: finalImageUrl } as EventItem) : ev))
        );
      } else {
        const newEvent: EventItem = {
          id: Date.now(),
          title: currentEvent.title || 'Event Baru',
          date: isoDate || '2026-10-12',
          time: currentEvent.time || '15:00 - 18:00 WIB',
          location: currentEvent.location || 'Pendopo Utama RBR',
          price: formatRupiah(numericPrice),
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
      } catch (e) {
        console.warn('Backend delete offline, using local state:', e);
      }
      setEvents((prev) => prev.filter((e) => e.id !== eventToDelete.id));
      setEventToDelete(null);
    }
    setDeleteModalOpen(false);
  };

  return (
    <AdminLayout activeTab="agenda">
      <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
        {/* Header Seksi Agenda */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-brand-cream-accent pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-brand-gold animate-pulse"></span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-maroon">
                Manajemen Program &amp; Acara
              </span>
            </div>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-brand-text">
              Agenda &amp; Tiket Budaya
            </h1>
            <p className="mt-1 text-xs text-brand-muted">
              Kelola jadwal pementasan, lokakarya, kuota pengunjung, dan reservasi tiket.
            </p>
          </div>
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-maroon px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-brand-maroon-light transition-all cursor-pointer"
          >
            <Plus size={16} />
            <span>Tambah Event Baru</span>
          </button>
        </div>

        {/* Daftar Kartu Event */}
        <EventCardList
          events={events}
          onEdit={handleOpenEdit}
          onDelete={handleRequestDelete}
        />

        {/* Modal Dialog Tambah / Edit Event */}
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

        {/* Modal Konfirmasi Hapus Event */}
        <DeleteEventModal
          isOpen={deleteModalOpen}
          eventToDelete={eventToDelete}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
        />
      </div>
    </AdminLayout>
  );
}
