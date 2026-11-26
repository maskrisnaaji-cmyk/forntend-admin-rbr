"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import { EventItem, EventStatus, TicketTier } from './types';
import { EventCardList } from './EventCardList';
import { EventModal } from './EventModal';
import { DeleteEventModal } from './DeleteEventModal';
import { normalizeDateToISO } from '@/lib/formatDate';

const BACKEND_URL = 'http://localhost:5000';
const POLL_INTERVAL_MS = 10_000; // 10 detik

/** Status pembayaran yang dianggap lunas */
const PAID_STATUSES = ['paid', 'settlement', 'capture', 'success', 'lunas'];

/**
 * Hitung jumlah tiket lunas per event_id dari API (orders & ticket transactions jika ada)
 */
async function fetchPaidTicketCounts(): Promise<Record<number, number>> {
  const counts: Record<number, number> = {};

  // 1. Ambil dari /api/kedai/orders atau /api/orders
  try {
    const resOrders = await fetch(`${BACKEND_URL}/api/orders`, { cache: 'no-store' });
    if (resOrders.ok) {
      const orders = await resOrders.json();
      const list = Array.isArray(orders) ? orders : (orders.data ?? []);
      for (const ord of list) {
        const payStatus = String(ord.payment_status || ord.status || '').toLowerCase().trim();
        if (PAID_STATUSES.includes(payStatus)) {
          // Cek jika order memiliki event_id atau items tiket
          if (ord.event_id) {
            const evId = Number(ord.event_id);
            const qty = Number(ord.quantity ?? ord.qty ?? 1);
            counts[evId] = (counts[evId] || 0) + qty;
          }
        }
      }
    }
  } catch (_) {}

  // 2. Ambil dari notifikasi jika tercatat transaksi tiket lunas
  try {
    const resNotif = await fetch(`${BACKEND_URL}/api/notifications`, { cache: 'no-store' });
    if (resNotif.ok) {
      const json = await resNotif.json();
      const notifs = Array.isArray(json.data) ? json.data : (Array.isArray(json) ? json : []);
      for (const n of notifs) {
        const type = String(n.type || '').toLowerCase();
        const msg = String(n.message || '').toLowerCase();
        if ((type === 'ticket' || type === 'event' || msg.includes('tiket')) && (msg.includes('lunas') || msg.includes('berhasil'))) {
          // Notifikasi tiket lunas
        }
      }
    }
  } catch (_) {}

  return counts;
}

/** Map respons JSON backend → EventItem */
function mapBackendEvent(d: any, paidTicketsMap: Record<number, number> = {}): EventItem {
  const eventId = Number(d.id);
  // Real-time: Tiket terjual murni dari transaksi lunas (abaikan seed/dummy bawaan)
  const bookedCount = paidTicketsMap[eventId] || 0;
  const quota = Number(d.quota) || 0;
  const remaining = Math.max(0, quota - bookedCount);
  const isAvailable = bookedCount < quota || quota === 0;

  // Normalkan status ke format baru
  let status: EventStatus = 'Tiket Tersedia';
  if (d.status === 'Menunggu Persetujuan' || d.status_approval === 'pending' || d.status === 'Pending') {
    status = 'Menunggu Persetujuan';
  } else if (d.status === 'Ditolak' || d.status_approval === 'rejected') {
    status = 'Ditolak';
  } else if (!isAvailable || d.status === 'Tiket Penuh' || d.status === 'Penuh') {
    status = 'Tiket Penuh';
  }

  // Parse ticket tiers jika tersedia di d.presale_tiers atau d.ticket_tiers
  let tiers: TicketTier[] = [];
  if (Array.isArray(d.ticket_tiers) && d.ticket_tiers.length > 0) {
    tiers = d.ticket_tiers;
  } else if (Array.isArray(d.presale_tiers) && d.presale_tiers.length > 0) {
    tiers = d.presale_tiers;
  } else {
    // Generate 3 kategori standar: Presale, Reguler, OTS
    let basePrice = Number(d.price) || 0;
    if (basePrice > 0 && basePrice < 1000) basePrice *= 1000;
    const qPresale = Math.round(quota * 0.3) || 15;
    const qReguler = Math.round(quota * 0.5) || 25;
    const qOTS = Math.max(0, quota - qPresale - qReguler) || 10;
    tiers = [
      { tier_name: 'Presale', tier_order: 1, price: Math.max(0, basePrice - 10000), quota: qPresale, is_active: true },
      { tier_name: 'Reguler', tier_order: 2, price: basePrice, quota: qReguler, is_active: true },
      { tier_name: 'OTS', tier_order: 3, price: basePrice + 10000, quota: qOTS, is_active: true },
    ];
  }

  let rawPrice = 0;
  if (typeof d.price === 'number') {
    rawPrice = d.price;
  } else if (d.price) {
    const cleanStr = String(d.price).trim();
    if (cleanStr.toLowerCase() === 'gratis' || cleanStr.toLowerCase() === 'free') {
      rawPrice = 0;
    } else {
      const digits = cleanStr.replace(/[^0-9]/g, '');
      rawPrice = Number(digits) || 0;
    }
  }

  if (rawPrice > 0 && rawPrice < 1000) {
    rawPrice = rawPrice * 1000;
  }

  // Ambil harga terendah dari kategori untuk harga aktif
  const tierPrices = tiers.map((t) => Number(t.price)).filter((p) => !isNaN(p) && p >= 0);
  if (tierPrices.length > 0) {
    rawPrice = Math.min(...tierPrices);
  }

  const minP = tierPrices.length > 0 ? Math.min(...tierPrices) : rawPrice;
  const maxP = tierPrices.length > 0 ? Math.max(...tierPrices) : rawPrice;

  let formattedPrice = '';
  if (minP === 0 && maxP === 0) {
    formattedPrice = 'Gratis';
  } else if (minP !== maxP) {
    formattedPrice = `Rp ${new Intl.NumberFormat('id-ID').format(minP)} - Rp ${new Intl.NumberFormat('id-ID').format(maxP)}`;
  } else {
    formattedPrice = `Rp ${new Intl.NumberFormat('id-ID').format(minP)}`;
  }

  return {
    id: eventId,
    title: d.title || d.tittle || '',
    date: d.date || '',
    time: d.time || '',
    location: d.location || 'Pendopo Utama RBR',
    price: formattedPrice,
    priceRaw: rawPrice,
    sold: bookedCount,
    booked_count: bookedCount,
    quota,
    remaining_tickets: remaining,
    is_available: isAvailable,
    status,
    status_approval: d.status_approval || (d.status === 'Menunggu Persetujuan' ? 'pending' : undefined),
    image: d.image || d.banner_image || '',
    category: d.category || 'Budaya',
    organizer_name: d.organizer_name || '',
    organizer_contact: d.organizer_contact || '',
    organizer_email: d.organizer_email || '',
    description: d.description || '',
    ticket_tiers: tiers,
    presale_tiers: tiers,
  };
}

export const AgendaContent: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'pending'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false); // polling silent
  const [fetchError, setFetchError] = useState<string | null>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<EventItem | null>(null);

  const [formModalOpen, setFormModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [currentEvent, setCurrentEvent] = useState<Partial<EventItem>>({
    title: '',
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

  const [bannerPreview, setBannerPreview] = useState<string>('');
  const [selectedBannerFile, setSelectedBannerFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // ─── Fetch dari backend ─────────────────────────────────────────────────────
  const fetchEvents = useCallback(async (silent = false) => {
    if (!silent) setIsLoading(true);
    else setIsFetching(true);
    try {
      const [resEvents, paidTicketsMap] = await Promise.all([
        fetch(`${BACKEND_URL}/api/events?include_pending=true`, {
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache' },
        }),
        fetchPaidTicketCounts(),
      ]);

      if (!resEvents.ok) throw new Error(`HTTP ${resEvents.status}`);
      const data = await resEvents.json();
      if (Array.isArray(data)) {
        setEvents(data.map((d) => mapBackendEvent(d, paidTicketsMap)));
        setFetchError(null);
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      if (!silent) setFetchError(`Gagal memuat data agenda: ${msg}`);
      console.warn('[AgendaContent] fetch events error:', msg);
    } finally {
      if (!silent) setIsLoading(false);
      else setIsFetching(false);
    }
  }, []);

  // ─── Polling otomatis setiap 10 detik ──────────────────────────────────────
  useEffect(() => {
    fetchEvents(false);

    pollingRef.current = setInterval(() => {
      fetchEvents(true);
    }, POLL_INTERVAL_MS);

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [fetchEvents]);

  // ─── Handler Banner ─────────────────────────────────────────────────────────
  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedBannerFile(file);
    setBannerPreview(URL.createObjectURL(file));
  };

  // ─── Buka modal Create ──────────────────────────────────────────────────────
  const handleOpenCreate = () => {
    setIsEditing(false);
    setSaveError(null);
    setSelectedBannerFile(null);
    const initialTiers: TicketTier[] = [
      { tier_name: 'Presale', tier_order: 1, price: 15000, quota: 15, is_active: true },
      { tier_name: 'Reguler', tier_order: 2, price: 25000, quota: 25, is_active: true },
      { tier_name: 'OTS', tier_order: 3, price: 35000, quota: 10, is_active: true },
    ];
    const totalQuota = initialTiers.reduce((acc, t) => acc + (t.quota || 0), 0);
    const minPrice = Math.min(...initialTiers.map((t) => t.price));

    setCurrentEvent({
      title: '',
      category: 'Budaya',
      date: new Date().toISOString().split('T')[0],
      time: '15:00 - 18:00 WIB',
      location: 'Pendopo Utama RBR',
      price: String(minPrice),
      priceRaw: minPrice,
      sold: 0,
      booked_count: 0,
      quota: totalQuota,
      status: 'Tiket Tersedia',
      image: '',
      ticket_tiers: initialTiers,
      presale_tiers: initialTiers,
    });
    setBannerPreview('');
    setFormModalOpen(true);
  };

  // ─── Buka modal Edit ────────────────────────────────────────────────────────
  const handleOpenEdit = (event: EventItem) => {
    setIsEditing(true);
    setSaveError(null);
    setSelectedBannerFile(null);

    let rawPriceNum = typeof event.priceRaw === 'number' && event.priceRaw > 0
      ? event.priceRaw
      : Number(String(event.price || '').replace(/[^0-9]/g, '')) || 0;

    if (rawPriceNum > 0 && rawPriceNum < 1000) {
      rawPriceNum = rawPriceNum * 1000;
    }

    const tiers: TicketTier[] = (event.ticket_tiers && event.ticket_tiers.length > 0)
      ? event.ticket_tiers
      : (event.presale_tiers && event.presale_tiers.length > 0)
      ? event.presale_tiers
      : [
          { tier_name: 'Presale', tier_order: 1, price: Math.max(0, rawPriceNum - 10000), quota: Math.round((event.quota || 50) * 0.3) || 15, is_active: true },
          { tier_name: 'Reguler', tier_order: 2, price: rawPriceNum, quota: Math.round((event.quota || 50) * 0.5) || 25, is_active: true },
          { tier_name: 'OTS', tier_order: 3, price: rawPriceNum + 10000, quota: Math.max(0, (event.quota || 50) - (Math.round((event.quota || 50) * 0.3) || 15) - (Math.round((event.quota || 50) * 0.5) || 25)) || 10, is_active: true },
        ];

    const totalQuota = tiers.reduce((acc, t) => acc + (Number(t.quota) || 0), 0);
    const tierPrices = tiers.map((t) => Number(t.price)).filter((p) => !isNaN(p) && p >= 0);
    const minPrice = tierPrices.length > 0 ? Math.min(...tierPrices) : rawPriceNum;

    setCurrentEvent({
      ...event,
      category: event.category || 'Budaya',
      price: String(minPrice || 0),
      priceRaw: minPrice,
      quota: totalQuota,
      sold: event.booked_count ?? event.sold ?? 0,
      booked_count: event.booked_count ?? event.sold ?? 0,
      ticket_tiers: tiers,
      presale_tiers: tiers,
    });
    setBannerPreview(event.image || '');
    setFormModalOpen(true);
  };

  // ─── Simpan (Create / Update) ───────────────────────────────────────────────
  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentEvent.title) return;
    setIsSaving(true);
    setSaveError(null);

    // Ambil ticket tiers
    const tiers: TicketTier[] = (currentEvent.ticket_tiers && currentEvent.ticket_tiers.length > 0)
      ? currentEvent.ticket_tiers
      : [
          { tier_name: 'Presale', tier_order: 1, price: 15000, quota: 15, is_active: true },
          { tier_name: 'Reguler', tier_order: 2, price: 25000, quota: 25, is_active: true },
          { tier_name: 'OTS', tier_order: 3, price: 35000, quota: 10, is_active: true },
        ];

    // Total kuota otomatis dari jumlah ketiga kategori
    const numericQuota = tiers.reduce((acc, t) => acc + (Number(t.quota) || 0), 0);

    // Harga aktif terendah agar tetap kompatibel dengan backend
    const tierPrices = tiers.map((t) => Number(t.price)).filter((p) => !isNaN(p) && p >= 0);
    let numericPrice = tierPrices.length > 0 ? Math.min(...tierPrices) : (Number(currentEvent.priceRaw) || 0);
    if (numericPrice > 0 && numericPrice < 1000) {
      numericPrice = numericPrice * 1000;
    }
    numericPrice = Math.round(numericPrice);

    const numericBooked = Number(currentEvent.booked_count ?? currentEvent.sold) || 0;
    const isoDate = normalizeDateToISO(currentEvent.date);

    // Status: jika admin set "Tiket Penuh" manual, hormati; jika booked >= quota, paksa Tiket Penuh
    let statusVal: EventStatus = (currentEvent.status as EventStatus) || 'Tiket Tersedia';
    if (numericBooked >= numericQuota && numericQuota > 0) {
      statusVal = 'Tiket Penuh';
    }

    let finalImageUrl = currentEvent.image || '';
    if (finalImageUrl.startsWith('blob:')) finalImageUrl = '';

    // Upload banner jika ada file baru
    if (selectedBannerFile) {
      try {
        setIsUploading(true);
        const uploadFormData = new FormData();
        uploadFormData.append('file', selectedBannerFile);
        if (isEditing && currentEvent.id) {
          uploadFormData.append('entity', 'event');
          uploadFormData.append('entityId', String(currentEvent.id));
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
        console.warn('[AgendaContent] Upload banner gagal:', uploadErr);
      } finally {
        setIsUploading(false);
      }
    }

    const payload = {
      title: currentEvent.title,
      date: isoDate,
      time: currentEvent.time || '',
      location: currentEvent.location || 'Pendopo Utama RBR',
      price: numericPrice, // Harga aktif terendah agar kompatibel
      quota: numericQuota, // Total kuota 3 kategori
      booked_count: numericBooked,
      sold: numericBooked,
      status: statusVal,
      image: finalImageUrl,
      banner_image: finalImageUrl,
      category: currentEvent.category || 'Budaya',
      ticket_tiers: tiers,
      presale_tiers: tiers,
    };

    // Baca token dari localStorage jika tersedia
    const token = typeof window !== 'undefined'
      ? (localStorage.getItem('token') || localStorage.getItem('authToken') || '')
      : '';

    const authHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) authHeaders['Authorization'] = `Bearer ${token}`;

    try {
      let res: Response;
      if (isEditing && currentEvent.id) {
        res = await fetch(`${BACKEND_URL}/api/events/${currentEvent.id}`, {
          method: 'PUT',
          headers: authHeaders,
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`${BACKEND_URL}/api/events`, {
          method: 'POST',
          headers: authHeaders,
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        const errMsg = errData?.message || `HTTP ${res.status}: Gagal menyimpan event.`;
        console.error('[AgendaContent] Gagal simpan event:', errData);
        setSaveError(errMsg);
        return;
      }

      // Refresh daftar dari backend setelah simpan
      await fetchEvents(false);
      setFormModalOpen(false);
      setSelectedBannerFile(null);
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      console.error('[AgendaContent] Gagal sync event ke backend:', err);
      setSaveError(`Gagal terhubung ke server: ${errMsg}`);
    } finally {
      setIsSaving(false);
    }
  };

  // ─── Hapus ──────────────────────────────────────────────────────────────────
  const handleRequestDelete = (event: EventItem) => {
    setEventToDelete(event);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!eventToDelete) { setDeleteModalOpen(false); return; }
    try {
      const res = await fetch(`${BACKEND_URL}/api/events/${eventToDelete.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) console.warn('[AgendaContent] Delete response:', res.status);
    } catch (e) {
      console.warn('[AgendaContent] Backend delete offline, menggunakan state lokal:', e);
    }
    setEvents((prev) => prev.filter((e) => e.id !== eventToDelete.id));
    setEventToDelete(null);
    setDeleteModalOpen(false);
    await fetchEvents(false);
  };

  const handleApproveEvent = async (event: EventItem) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/events/${event.id}/approve`, {
        method: 'PUT',
      });
      if (res.ok) {
        await fetchEvents(false);
      }
    } catch (err) {
      console.error('[AgendaContent] Gagal menyetujui event:', err);
    }
  };

  const handleRejectEvent = async (event: EventItem) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/events/${event.id}/reject`, {
        method: 'PUT',
      });
      if (res.ok) {
        await fetchEvents(false);
      }
    } catch (err) {
      console.error('[AgendaContent] Gagal menolak event:', err);
    }
  };

  const displayedEvents = events.filter((e) => {
    const isPend =
      e.status === 'Menunggu Persetujuan' ||
      e.status_approval === 'pending' ||
      (e.status as string) === 'Pending';
    const isRej = e.status === 'Ditolak' || e.status_approval === 'rejected';
    if (activeTab === 'pending') return isPend;
    if (activeTab === 'active') return !isPend && !isRej;
    return true;
  });

  const pendingCount = events.filter(
    (e) =>
      e.status === 'Menunggu Persetujuan' ||
      e.status_approval === 'pending' ||
      (e.status as string) === 'Pending'
  ).length;

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
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

      {/* Tabs Filter Status */}
      <div className="flex items-center gap-2 border-b border-brand-cream-accent pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'all'
              ? 'bg-brand-maroon text-white shadow-sm'
              : 'bg-brand-cream-card text-brand-muted hover:text-brand-text'
          }`}
        >
          Semua Acara ({events.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('active')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'active'
              ? 'bg-brand-maroon text-white shadow-sm'
              : 'bg-brand-cream-card text-brand-muted hover:text-brand-text'
          }`}
        >
          Aktif &amp; Terjadwal (
          {
            events.filter(
              (e) =>
                e.status !== 'Menunggu Persetujuan' &&
                e.status !== 'Pending' &&
                e.status !== 'Ditolak'
            ).length
          }
          )
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('pending')}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'pending'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
          }`}
        >
          <span>Pengajuan Lokakarya</span>
          {pendingCount > 0 && (
            <span className="rounded-full bg-amber-500 text-white px-1.5 py-0.5 text-[10px] font-extrabold">
              {pendingCount}
            </span>
          )}
        </button>
      </div>

      {/* Loading / Error */}
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
            onClick={() => fetchEvents(false)}
            className="mt-3 rounded-lg bg-rose-600 px-4 py-1.5 text-white font-bold hover:bg-rose-700 transition-colors cursor-pointer"
          >
            Coba Lagi
          </button>
        </div>
      ) : (
        <section aria-label="Daftar Jadwal Acara dan Tiket" className="stagger-item stagger-1">
          <EventCardList
            events={displayedEvents}
            onEdit={handleOpenEdit}
            onDelete={handleRequestDelete}
            onApprove={handleApproveEvent}
            onReject={handleRejectEvent}
          />
        </section>
      )}

      {/* Modal Tambah / Edit */}
      {formModalOpen && (
        <EventModal
          isOpen={formModalOpen}
          isEditing={isEditing}
          isSaving={isSaving}
          currentEvent={currentEvent}
          bannerPreview={bannerPreview}
          isUploading={isUploading}
          saveError={saveError}
          onClose={() => { setFormModalOpen(false); setSaveError(null); }}
          onChange={(upd) => { setCurrentEvent((prev) => ({ ...prev, ...upd })); setSaveError(null); }}
          onBannerChange={handleBannerChange}
          onSubmit={handleSaveEvent}
        />
      )}

      {/* Modal Konfirmasi Hapus */}
      {deleteModalOpen && Boolean(eventToDelete) && (
        <DeleteEventModal
          isOpen={deleteModalOpen}
          eventToDelete={eventToDelete}
          onClose={() => {
            setDeleteModalOpen(false);
            setEventToDelete(null);
          }}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
};

export default AgendaContent;
