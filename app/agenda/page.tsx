"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Plus, RefreshCw, Ticket, X, Trash2, ImageUp } from 'lucide-react';
import { EventItem, EventStatus } from './components/types';
import { EventCardList } from './components/EventCardList';
import { formatRupiah } from '@/lib/formatCurrency';
import { normalizeDateToISO } from '@/lib/formatDate';

const BACKEND_URL = 'http://localhost:5000';
const POLL_INTERVAL_MS = 10_000;

function mapBackendEvent(d: any): EventItem {
  const bookedCount = Number(d.booked_count ?? d.sold ?? 0);
  const quota = Number(d.quota) || 0;
  const remaining = Number(d.remaining_tickets ?? Math.max(0, quota - bookedCount));
  const isAvailable = typeof d.is_available === 'boolean'
    ? d.is_available
    : bookedCount < quota || quota === 0;

  let status: EventStatus = 'Tiket Tersedia';
  if (!isAvailable || d.status === 'Tiket Penuh' || d.status === 'Penuh') {
    status = 'Tiket Penuh';
  }

  return {
    id: Number(d.id),
    title: d.title || d.tittle || '',
    date: d.date || '',
    time: d.time || '',
    location: d.location || 'Pendopo Utama RBR',
    price: formatRupiah(d.price),
    priceRaw: Number(d.price) || 0,
    sold: bookedCount,
    booked_count: bookedCount,
    quota,
    remaining_tickets: remaining,
    is_available: isAvailable,
    status,
    image: d.image || d.banner_image || '',
    category: d.category || 'Budaya',
  };
}

export default function AgendaPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Modal State Tambah / Edit
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [editingEvent, setEditingEvent] = useState<Partial<EventItem>>({
    title: '',
    category: 'Budaya',
    date: '',
    time: '',
    location: '',
    price: '',
    priceRaw: 0,
    sold: 0,
    booked_count: 0,
    quota: 50,
    status: 'Tiket Tersedia',
    image: '',
  });

  // Modal State Hapus
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<EventItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Banner Preview & Upload State
  const [bannerPreview, setBannerPreview] = useState<string>('');
  const [selectedBannerFile, setSelectedBannerFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const getAuthToken = () => {
    if (typeof window === 'undefined') return '';
    return (
      localStorage.getItem('token') ||
      localStorage.getItem('adminToken') ||
      localStorage.getItem('authToken') ||
      ''
    );
  };

  // ─── Fetch Events dari backend ──────────────────────────────────────────────
  const fetchEvents = useCallback(async (silent = false) => {
    if (!silent) setIsLoading(true);
    else setIsFetching(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/events`, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setEvents(data.map(mapBackendEvent));
        setFetchError(null);
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      if (!silent) setFetchError(`Gagal memuat data agenda: ${msg}`);
      console.warn('[AgendaPage] fetch events error:', msg);
    } finally {
      if (!silent) setIsLoading(false);
      else setIsFetching(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents(false);
    pollingRef.current = setInterval(() => {
      fetchEvents(true);
    }, POLL_INTERVAL_MS);
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [fetchEvents]);

  // ─── Banner File Change Handler ─────────────────────────────────────────────
  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedBannerFile(file);
    setBannerPreview(URL.createObjectURL(file));
  };

  // ─── Buka Modal Tambah Event ────────────────────────────────────────────────
  const handleOpenCreate = () => {
    setIsEditing(false);
    setSaveError(null);
    setSelectedBannerFile(null);
    setBannerPreview('');
    setEditingEvent({
      title: '',
      category: 'Budaya',
      date: new Date().toISOString().split('T')[0],
      time: '15:00 - 18:00 WIB',
      location: 'Pendopo Utama RBR',
      price: '50000',
      priceRaw: 50000,
      sold: 0,
      booked_count: 0,
      quota: 50,
      status: 'Tiket Tersedia',
      image: '',
    });
    setIsFormOpen(true);
  };

  // ─── Buka Modal Edit Event ──────────────────────────────────────────────────
  const handleOpenEdit = (event: EventItem) => {
    setIsEditing(true);
    setSaveError(null);
    setSelectedBannerFile(null);
    setEditingEvent({
      ...event,
      category: event.category || 'Budaya',
      price: String(event.priceRaw || 0),
    });
    setBannerPreview(event.image || '');
    setIsFormOpen(true);
  };

  // ─── Buka Modal Hapus Event ─────────────────────────────────────────────────
  const handleRequestDelete = (event: EventItem) => {
    setEventToDelete(event);
    setDeleteModalOpen(true);
  };

  // ─── Eksekusi Hapus Event (DELETE) ──────────────────────────────────────────
  const handleConfirmDelete = async () => {
    if (!eventToDelete) {
      setDeleteModalOpen(false);
      return;
    }
    setIsDeleting(true);
    try {
      const token = getAuthToken();
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${BACKEND_URL}/api/events/${eventToDelete.id}`, {
        method: 'DELETE',
        headers,
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        const errMsg = errJson?.message || `HTTP ${res.status}: Gagal menghapus agenda.`;
        alert(`Gagal menghapus agenda: ${errMsg}`);
        return;
      }

      setEvents((prev) => prev.filter((e) => e.id !== eventToDelete.id));
      setDeleteModalOpen(false);
      setEventToDelete(null);
      await fetchEvents(false);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      alert(`Gagal menghapus agenda: ${msg}`);
    } finally {
      setIsDeleting(false);
    }
  };

  // ─── Eksekusi Simpan Tambah / Edit (POST / PUT) ──────────────────────────────
  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent.title) return;
    setIsSaving(true);
    setSaveError(null);

    const numericPrice = Number(String(editingEvent.price).replace(/[^0-9]/g, '')) || 0;
    const numericQuota = Number(editingEvent.quota) || 50;
    const numericBooked = Number(editingEvent.booked_count ?? editingEvent.sold) || 0;
    const isoDate = normalizeDateToISO(editingEvent.date);

    let statusVal: EventStatus = (editingEvent.status as EventStatus) || 'Tiket Tersedia';
    if (numericBooked >= numericQuota && numericQuota > 0) {
      statusVal = 'Tiket Penuh';
    }

    let finalImageUrl = editingEvent.image || '';
    if (finalImageUrl.startsWith('blob:')) finalImageUrl = '';

    // Upload banner jika ada file baru yang dipilih
    if (selectedBannerFile) {
      try {
        setIsUploading(true);
        const uploadFormData = new FormData();
        uploadFormData.append('file', selectedBannerFile);
        if (isEditing && editingEvent.id) {
          uploadFormData.append('entity', 'event');
          uploadFormData.append('entityId', String(editingEvent.id));
        }

        let uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData,
        }).catch(() => null);

        if (!uploadRes || !uploadRes.ok) {
          uploadRes = await fetch(`${BACKEND_URL}/api/upload`, {
            method: 'POST',
            body: uploadFormData,
          }).catch(() => null);
        }

        if (uploadRes && uploadRes.ok) {
          const uploadData = await uploadRes.json();
          if (uploadData.url && (uploadData.url.startsWith('http') || uploadData.url.startsWith('/'))) {
            finalImageUrl = uploadData.url;
          }
        }
      } catch (uploadErr) {
        console.warn('[AgendaPage] Upload banner gagal:', uploadErr);
      } finally {
        setIsUploading(false);
      }
    }

    const payload = {
      title: editingEvent.title,
      category: editingEvent.category || 'Budaya',
      date: isoDate,
      time: editingEvent.time || '',
      location: editingEvent.location || 'Pendopo Utama RBR',
      price: numericPrice,
      quota: numericQuota,
      booked_count: numericBooked,
      sold: numericBooked,
      status: statusVal,
      image: finalImageUrl,
      banner_image: finalImageUrl,
    };

    const token = getAuthToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      let res: Response;
      if (isEditing && editingEvent.id) {
        res = await fetch(`${BACKEND_URL}/api/events/${editingEvent.id}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`${BACKEND_URL}/api/events`, {
          method: 'POST',
          headers,
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        const errMsg = errJson?.message || `HTTP ${res.status}: Gagal menyimpan event.`;
        setSaveError(errMsg);
        return; // jangan tutup modal jika API gagal
      }

      // Berhasil disimpan
      await fetchEvents(false);
      setIsFormOpen(false);
      setSelectedBannerFile(null);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setSaveError(`Gagal terhubung ke server: ${msg}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminLayout activeTab="agenda">
      <div className="space-y-6 sm:space-y-8">
        {/* Header */}
        <header className="stagger-item stagger-0 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-brand-cream-accent pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-brand-gold animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-maroon">
                Manajemen Program &amp; Acara
              </span>
            </div>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-brand-text">
              Agenda &amp; Tiket Budaya
            </h1>
            <p className="mt-1 text-xs text-brand-muted">
              Kelola jadwal pementasan, lokakarya, kuota pengunjung, dan reservasi tiket.
              {isFetching && (
                <span className="ml-2 inline-flex items-center gap-1 text-brand-gold">
                  <RefreshCw size={10} className="animate-spin" />
                  Memperbarui…
                </span>
              )}
            </p>
          </div>
          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-maroon px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-brand-maroon-light transition-all cursor-pointer"
          >
            <Plus size={16} />
            <span>Tambah Event Baru</span>
          </button>
        </header>

        {/* Loading / Error / Data */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20 text-brand-muted text-sm gap-2">
            <RefreshCw size={18} className="animate-spin text-brand-maroon" />
            <span>Memuat data agenda dari server…</span>
          </div>
        ) : fetchError ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center text-xs text-rose-700">
            <p className="font-bold mb-1">Gagal memuat agenda</p>
            <p>{fetchError}</p>
            <button
              type="button"
              onClick={() => fetchEvents(false)}
              className="mt-3 rounded-lg bg-rose-600 px-4 py-1.5 text-white font-bold hover:bg-rose-700 transition-colors cursor-pointer"
            >
              Coba Lagi
            </button>
          </div>
        ) : (
          <section aria-label="Daftar Jadwal Acara dan Tiket" className="stagger-item stagger-1">
            <EventCardList
              events={events}
              onEdit={handleOpenEdit}
              onDelete={handleRequestDelete}
            />
          </section>
        )}

        {/* =========================================================================
            MODAL TAMBAH / EDIT EVENT (RENDER EKSPLISIT DENGAN ANIMATE-MODAL-POP)
           ========================================================================= */}
        {isFormOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-transparent p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsFormOpen(false);
            }}
          >
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 border border-stone-200 shadow-2xl animate-modal-pop max-h-[90vh] overflow-y-auto">
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
                  onClick={() => setIsFormOpen(false)}
                  className="rounded-lg p-1 text-brand-muted hover:bg-brand-cream-card hover:text-brand-text transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSaveEvent} className="space-y-3.5 text-xs">
                {/* Judul Event (title) */}
                <div>
                  <label className="mb-1 block font-semibold text-brand-text">
                    Judul Acara <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editingEvent.title || ''}
                    onChange={(e) => {
                      setEditingEvent((prev) => ({ ...prev, title: e.target.value }));
                      setSaveError(null);
                    }}
                    className="w-full rounded-xl border border-brand-cream-accent p-2.5 text-xs focus:border-brand-maroon focus:outline-none"
                    placeholder="Contoh: Diskusi Artefak Kuno Nusantara"
                  />
                </div>

                {/* Kategori (category) */}
                <div>
                  <label className="mb-1 block font-semibold text-brand-text">Kategori</label>
                  <select
                    value={editingEvent.category || 'Budaya'}
                    onChange={(e) => {
                      setEditingEvent((prev) => ({ ...prev, category: e.target.value }));
                      setSaveError(null);
                    }}
                    className="w-full rounded-xl border border-brand-cream-accent p-2.5 text-xs focus:border-brand-maroon focus:outline-none bg-white"
                  >
                    <option value="Budaya">Budaya</option>
                    <option value="Teater">Teater</option>
                    <option value="Pameran">Pameran</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Musik">Musik</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>

                {/* Tanggal (date) & Waktu (time) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block font-semibold text-brand-text">
                      Tanggal Acara (ISO YYYY-MM-DD) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={normalizeDateToISO(editingEvent.date)}
                      onChange={(e) => {
                        setEditingEvent((prev) => ({ ...prev, date: e.target.value }));
                        setSaveError(null);
                      }}
                      className="w-full rounded-xl border border-brand-cream-accent p-2.5 text-xs focus:border-brand-maroon focus:outline-none bg-white"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block font-semibold text-brand-text">
                      Waktu <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={editingEvent.time || ''}
                      onChange={(e) => {
                        setEditingEvent((prev) => ({ ...prev, time: e.target.value }));
                        setSaveError(null);
                      }}
                      className="w-full rounded-xl border border-brand-cream-accent p-2.5 text-xs focus:border-brand-maroon focus:outline-none"
                      placeholder="15:00 - 18:00 WIB"
                    />
                  </div>
                </div>

                {/* Lokasi (location) */}
                <div>
                  <label className="mb-1 block font-semibold text-brand-text">
                    Lokasi <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editingEvent.location || ''}
                    onChange={(e) => {
                      setEditingEvent((prev) => ({ ...prev, location: e.target.value }));
                      setSaveError(null);
                    }}
                    className="w-full rounded-xl border border-brand-cream-accent p-2.5 text-xs focus:border-brand-maroon focus:outline-none"
                    placeholder="Pendopo Utama RBR"
                  />
                </div>

                {/* Harga Tiket (price), Tiket Terjual (booked_count), Total Kuota (quota) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                  <div>
                    <label className="mb-1 block font-semibold text-brand-text">
                      Harga Tiket (Rp) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={editingEvent.price || ''}
                      onChange={(e) => {
                        setEditingEvent((prev) => ({ ...prev, price: e.target.value }));
                        setSaveError(null);
                      }}
                      className="w-full rounded-xl border border-brand-cream-accent p-2.5 text-xs focus:border-brand-maroon focus:outline-none"
                      placeholder="misal: 25000"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block font-semibold text-brand-text">Tiket Terjual</label>
                    <input
                      type="number"
                      min="0"
                      value={editingEvent.booked_count ?? editingEvent.sold ?? 0}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setEditingEvent((prev) => ({ ...prev, booked_count: val, sold: val }));
                        setSaveError(null);
                      }}
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
                      value={editingEvent.quota ?? 50}
                      onChange={(e) => {
                        setEditingEvent((prev) => ({ ...prev, quota: Number(e.target.value) }));
                        setSaveError(null);
                      }}
                      className="w-full rounded-xl border border-brand-cream-accent p-2.5 text-xs focus:border-brand-maroon focus:outline-none"
                    />
                  </div>
                </div>

                {/* Status Tiket (status) */}
                <div>
                  <label className="mb-1 block font-semibold text-brand-text">Status Tiket</label>
                  <select
                    value={editingEvent.status || 'Tiket Tersedia'}
                    onChange={(e) => {
                      setEditingEvent((prev) => ({
                        ...prev,
                        status: e.target.value as EventStatus,
                      }));
                      setSaveError(null);
                    }}
                    className="w-full rounded-xl border border-brand-cream-accent p-2.5 text-xs focus:border-brand-maroon focus:outline-none bg-white"
                  >
                    <option value="Tiket Tersedia">Tiket Tersedia</option>
                    <option value="Tiket Penuh">Tiket Penuh (Tutup Penjualan)</option>
                  </select>
                  <p className="mt-1 text-[10px] text-brand-muted">
                    Status &quot;Tiket Penuh&quot; otomatis jika tiket terjual ≥ kuota.
                  </p>
                </div>

                {/* URL / Upload Gambar (image) */}
                <div className="space-y-2">
                  <label className="block font-semibold text-brand-text">
                    URL / Upload Banner Event
                  </label>
                  <input
                    type="text"
                    value={editingEvent.image || ''}
                    onChange={(e) => {
                      setEditingEvent((prev) => ({ ...prev, image: e.target.value }));
                      setSaveError(null);
                    }}
                    className="w-full rounded-xl border border-brand-cream-accent p-2.5 text-xs focus:border-brand-maroon focus:outline-none"
                    placeholder="URL gambar (contoh: /oktober_08_obrolan_budaya.jpg atau https://...)"
                  />
                  <label
                    htmlFor="agenda-banner-upload"
                    className={`flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed transition-colors overflow-hidden ${
                      bannerPreview || editingEvent.image
                        ? 'border-brand-gold bg-amber-50/50'
                        : 'border-brand-cream-accent bg-[#FAF6F0] hover:border-brand-gold hover:bg-amber-50/30'
                    }`}
                  >
                    {bannerPreview || editingEvent.image ? (
                      <div className="relative w-full overflow-hidden rounded-xl bg-stone-100 flex items-center justify-center">
                        <img
                          src={
                            (bannerPreview || editingEvent.image || '').startsWith('assets/images/')
                              ? `/${(bannerPreview || editingEvent.image || '').replace('assets/images/', '')}`
                              : (bannerPreview || editingEvent.image || '')
                          }
                          alt="Preview banner"
                          className="w-full h-32 object-cover"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
                          <span className="text-white text-[10px] font-bold flex items-center gap-1">
                            <ImageUp size={14} /> Ganti Foto / Upload File
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-1.5 py-5 px-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-gold/20 text-brand-maroon">
                          <ImageUp size={20} />
                        </div>
                        <span className="text-[11px] font-semibold text-brand-text">
                          Klik untuk upload foto banner dari perangkat
                        </span>
                        <span className="text-[10px] text-brand-muted">PNG, JPG, JPEG hingga 5MB</span>
                      </div>
                    )}
                    <input
                      id="agenda-banner-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleBannerChange}
                    />
                  </label>
                </div>

                {/* Action Buttons */}
                <div className="mt-5 pt-2 border-t border-brand-cream-accent space-y-2.5">
                  {saveError && (
                    <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-[11px] font-semibold text-rose-700">
                      ⚠ {saveError}
                    </div>
                  )}
                  <div className="flex items-center justify-end gap-2.5">
                    <button
                      type="button"
                      onClick={() => setIsFormOpen(false)}
                      className="rounded-xl border border-brand-cream-accent bg-brand-cream-card px-4 py-2.5 text-xs font-bold text-brand-muted hover:bg-brand-cream-accent hover:text-brand-text transition-colors cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={isUploading || isSaving}
                      className="rounded-xl bg-brand-maroon px-5 py-2.5 text-xs font-bold text-white shadow hover:bg-brand-maroon-light transition-colors cursor-pointer disabled:opacity-60 flex items-center gap-1.5"
                    >
                      {isUploading ? (
                        <>
                          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          <span>Mengunggah file...</span>
                        </>
                      ) : isSaving ? (
                        <>
                          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          <span>Menyimpan...</span>
                        </>
                      ) : (
                        <span>{isEditing ? 'Simpan Perubahan' : 'Simpan Agenda'}</span>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* =========================================================================
            MODAL KONFIRMASI HAPUS (RENDER EKSPLISIT DENGAN ANIMATE-MODAL-POP)
           ========================================================================= */}
        {deleteModalOpen && eventToDelete && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-transparent p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setDeleteModalOpen(false);
                setEventToDelete(null);
              }
            }}
          >
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 border border-stone-200 shadow-2xl animate-modal-pop">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-600 mb-3">
                <Trash2 size={22} />
              </div>
              <h3 className="text-center text-sm font-bold text-brand-text">Konfirmasi Hapus Agenda</h3>
              <p className="mt-2 text-center text-xs text-brand-muted leading-relaxed">
                Apakah Anda yakin ingin menghapus agenda{' '}
                <span className="font-semibold text-brand-text">
                  &ldquo;{eventToDelete.title}&rdquo;
                </span>
                ? Tindakan ini tidak dapat dibatalkan.
              </p>
              <div className="mt-6 flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setDeleteModalOpen(false);
                    setEventToDelete(null);
                  }}
                  disabled={isDeleting}
                  className="flex-1 rounded-xl border border-brand-cream-accent bg-brand-cream-card py-2.5 text-xs font-bold text-brand-muted hover:bg-brand-cream-accent hover:text-brand-text transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  disabled={isDeleting}
                  className="flex-1 rounded-xl bg-rose-600 py-2.5 text-xs font-bold text-white shadow hover:bg-rose-700 transition-colors cursor-pointer disabled:opacity-60 flex items-center justify-center gap-1"
                >
                  {isDeleting ? (
                    <>
                      <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>Menghapus...</span>
                    </>
                  ) : (
                    <span>Ya, Hapus</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
