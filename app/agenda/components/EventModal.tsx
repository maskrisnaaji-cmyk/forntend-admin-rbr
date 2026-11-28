"use client";

import React from 'react';
import { Ticket, ImageUp } from 'lucide-react';
import { AdminModal } from '@/components/ui/AdminModal';
import { EventItem } from './types';
import { normalizeDateToISO } from '@/lib/formatDate';

interface EventModalProps {
  isOpen: boolean;
  isEditing: boolean;
  isSaving?: boolean;
  currentEvent: Partial<EventItem>;
  bannerPreview: string;
  isUploading?: boolean;
  saveError?: string | null;
  onClose: () => void;
  onChange: (updated: Partial<EventItem>) => void;
  onBannerChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  isEditing,
  isSaving = false,
  currentEvent,
  bannerPreview,
  isUploading = false,
  saveError,
  onClose,
  onChange,
  onBannerChange,
  onSubmit,
}) => {
  if (!isOpen) return null;

  const displayImage = bannerPreview || currentEvent.image || '';

  // Ambil list tier aktif (Presale 1, Presale 2, Reguler)
  const currentTiersList = (currentEvent.presale_tiers && currentEvent.presale_tiers.length > 0)
    ? currentEvent.presale_tiers
    : (currentEvent.ticket_tiers && currentEvent.ticket_tiers.length > 0)
    ? currentEvent.ticket_tiers
    : [
        { tier_name: 'Presale 1', tier_order: 1, price: 15000, quota: 15, is_active: true },
        { tier_name: 'Presale 2', tier_order: 2, price: 25000, quota: 20, is_active: true },
        { tier_name: 'Reguler', tier_order: 3, price: 35000, quota: 15, is_active: true },
      ];

  const getTier = (name: 'Presale 1' | 'Presale 2' | 'Reguler') => {
    return (
      currentTiersList.find((t) => t.tier_name === name) ||
      currentTiersList.find((t) => name === 'Presale 1' && t.tier_name.toLowerCase().includes('presale 1')) ||
      currentTiersList.find((t) => name === 'Presale 2' && t.tier_name.toLowerCase().includes('presale 2')) ||
      currentTiersList.find((t) => name === 'Reguler' && t.tier_name.toLowerCase().includes('reguler')) ||
      (name === 'Presale 1' ? currentTiersList.find((t) => t.tier_name === 'Presale') : undefined)
    );
  };

  const handleTierChange = (
    name: 'Presale 1' | 'Presale 2' | 'Reguler',
    field: 'price' | 'quota',
    value: number
  ) => {
    const defaultTiers = [
      { tier_name: 'Presale 1', tier_order: 1, price: 15000, quota: 15, is_active: true },
      { tier_name: 'Presale 2', tier_order: 2, price: 25000, quota: 20, is_active: true },
      { tier_name: 'Reguler', tier_order: 3, price: 35000, quota: 15, is_active: true },
    ];

    const updated = defaultTiers.map((dt) => {
      const existing = getTier(dt.tier_name as any);
      return {
        ...dt,
        price: existing?.price !== undefined ? existing.price : dt.price,
        quota: existing?.quota !== undefined ? existing.quota : dt.quota,
      };
    });

    const targetIdx = updated.findIndex((t) => t.tier_name === name);
    if (targetIdx >= 0) {
      updated[targetIdx][field] = value;
    }

    const totalQuota = updated.reduce((acc, t) => acc + (Number(t.quota) || 0), 0);
    const activePrices = updated.map((t) => Number(t.price)).filter((p) => !isNaN(p) && p >= 0);
    const minPrice = activePrices.length > 0 ? Math.min(...activePrices) : 0;

    onChange({
      ticket_tiers: updated,
      presale_tiers: updated,
      quota: totalQuota,
      priceRaw: minPrice,
      price: String(minPrice),
    });
  };

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <span className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-maroon/10 text-brand-maroon shrink-0">
            <Ticket size={15} />
          </span>
          <span>{isEditing ? 'Edit Event' : 'Tambah Event Baru'}</span>
        </span>
      }
      subtitle={isEditing ? 'Perbarui jadwal, kuota, atau rincian tiket acara' : 'Buat jadwal acara dan reservasi tiket budaya baru'}
      size="xl"
      footer={
        <div className="space-y-2">
          {saveError && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-[11px] font-semibold text-rose-700">
              ⚠ {saveError}
            </div>
          )}
          <div className="flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-stone-200 px-4 py-2 text-sm font-medium text-stone-600 hover:bg-stone-50 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              form="event-form"
              disabled={isUploading || isSaving}
              className="rounded-xl bg-[#5C1D24] px-5 py-2 text-sm font-semibold text-white hover:bg-[#4A161C] transition-colors cursor-pointer disabled:opacity-60 flex items-center gap-1.5"
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
      }
    >
      <form id="event-form" onSubmit={onSubmit} className="space-y-3.5 text-xs">
        {/* Judul Event */}
        <div>
          <label className="mb-1 block font-semibold text-brand-text">
            Judul Acara <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            value={currentEvent.title || ''}
            onChange={(e) => onChange({ title: e.target.value })}
            className="w-full rounded-xl border border-brand-cream-accent p-2.5 text-xs focus:border-brand-maroon focus:outline-none"
            placeholder="Contoh: Diskusi Artefak Kuno"
          />
        </div>

        {/* Tanggal & Waktu (Grid 2 Kolom) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block font-semibold text-brand-text">
              Tanggal Acara <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              required
              value={normalizeDateToISO(currentEvent.date)}
              onChange={(e) => onChange({ date: e.target.value })}
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
              value={currentEvent.time || ''}
              onChange={(e) => onChange({ time: e.target.value })}
              className="w-full rounded-xl border border-brand-cream-accent p-2.5 text-xs focus:border-brand-maroon focus:outline-none"
              placeholder="15:00 - 18:00 WIB"
            />
          </div>
        </div>

        {/* 3 Kategori Tiket: Presale 1, Presale 2, Reguler */}
        <div className="rounded-xl border border-brand-cream-accent bg-brand-cream-card/30 p-3.5 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-bold text-brand-text text-xs block">
                Pengaturan Kuota &amp; Harga Tiket (Presale 1, Presale 2, Reguler)
              </span>
              <span className="text-[10px] text-brand-muted">
                Penjualan otomatis berurutan: Presale 1 &rarr; Presale 2 &rarr; Reguler
              </span>
            </div>
            <span className="rounded-lg bg-brand-maroon/10 px-2 py-0.5 text-[11px] font-bold text-brand-maroon shrink-0">
              Total Kuota: {currentEvent.quota ?? 0} Tiket
            </span>
          </div>

          {/* Baris 1: Presale 1 */}
          <div className="grid grid-cols-12 gap-2.5 items-center bg-white p-2.5 rounded-xl border border-brand-cream-accent">
            <div className="col-span-12 sm:col-span-4 flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500 shrink-0" />
              <div>
                <p className="font-bold text-brand-text text-xs leading-none">Presale 1</p>
                <p className="text-[10px] text-brand-muted mt-0.5">Tier Pertama (Early Bird)</p>
              </div>
            </div>
            <div className="col-span-6 sm:col-span-4">
              <label className="block text-[10px] font-medium text-brand-muted mb-0.5">
                Harga Presale 1 (Rp)
              </label>
              <input
                type="number"
                min="0"
                step="1"
                required
                value={getTier('Presale 1')?.price ?? 15000}
                onChange={(e) => handleTierChange('Presale 1', 'price', Math.max(0, Number(e.target.value)))}
                className="w-full rounded-lg border border-brand-cream-accent p-1.5 text-xs focus:border-brand-maroon focus:outline-none"
                placeholder="15000"
              />
            </div>
            <div className="col-span-6 sm:col-span-4">
              <label className="block text-[10px] font-medium text-brand-muted mb-0.5">
                Kuota Tiket
              </label>
              <input
                type="number"
                min="1"
                step="1"
                required
                value={getTier('Presale 1')?.quota ?? 15}
                onChange={(e) => handleTierChange('Presale 1', 'quota', Math.max(1, Number(e.target.value)))}
                className="w-full rounded-lg border border-brand-cream-accent p-1.5 text-xs focus:border-brand-maroon focus:outline-none"
                placeholder="15"
              />
            </div>
          </div>

          {/* Baris 2: Presale 2 */}
          <div className="grid grid-cols-12 gap-2.5 items-center bg-white p-2.5 rounded-xl border border-brand-cream-accent">
            <div className="col-span-12 sm:col-span-4 flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-indigo-500 shrink-0" />
              <div>
                <p className="font-bold text-brand-text text-xs leading-none">Presale 2</p>
                <p className="text-[10px] text-brand-muted mt-0.5">Tier Kedua (Mid Presale)</p>
              </div>
            </div>
            <div className="col-span-6 sm:col-span-4">
              <label className="block text-[10px] font-medium text-brand-muted mb-0.5">
                Harga Presale 2 (Rp)
              </label>
              <input
                type="number"
                min="0"
                step="1"
                required
                value={getTier('Presale 2')?.price ?? 25000}
                onChange={(e) => handleTierChange('Presale 2', 'price', Math.max(0, Number(e.target.value)))}
                className="w-full rounded-lg border border-brand-cream-accent p-1.5 text-xs focus:border-brand-maroon focus:outline-none"
                placeholder="25000"
              />
            </div>
            <div className="col-span-6 sm:col-span-4">
              <label className="block text-[10px] font-medium text-brand-muted mb-0.5">
                Kuota Tiket
              </label>
              <input
                type="number"
                min="1"
                step="1"
                required
                value={getTier('Presale 2')?.quota ?? 20}
                onChange={(e) => handleTierChange('Presale 2', 'quota', Math.max(1, Number(e.target.value)))}
                className="w-full rounded-lg border border-brand-cream-accent p-1.5 text-xs focus:border-brand-maroon focus:outline-none"
                placeholder="20"
              />
            </div>
          </div>

          {/* Baris 3: Reguler */}
          <div className="grid grid-cols-12 gap-2.5 items-center bg-white p-2.5 rounded-xl border border-brand-cream-accent">
            <div className="col-span-12 sm:col-span-4 flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-600 shrink-0" />
              <div>
                <p className="font-bold text-brand-text text-xs leading-none">Reguler</p>
                <p className="text-[10px] text-brand-muted mt-0.5">Tier Terakhir (Standar)</p>
              </div>
            </div>
            <div className="col-span-6 sm:col-span-4">
              <label className="block text-[10px] font-medium text-brand-muted mb-0.5">
                Harga Reguler (Rp)
              </label>
              <input
                type="number"
                min="0"
                step="1"
                required
                value={getTier('Reguler')?.price ?? 35000}
                onChange={(e) => handleTierChange('Reguler', 'price', Math.max(0, Number(e.target.value)))}
                className="w-full rounded-lg border border-brand-cream-accent p-1.5 text-xs focus:border-brand-maroon focus:outline-none"
                placeholder="35000"
              />
            </div>
            <div className="col-span-6 sm:col-span-4">
              <label className="block text-[10px] font-medium text-brand-muted mb-0.5">
                Kuota Tiket
              </label>
              <input
                type="number"
                min="1"
                step="1"
                required
                value={getTier('Reguler')?.quota ?? 15}
                onChange={(e) => handleTierChange('Reguler', 'quota', Math.max(1, Number(e.target.value)))}
                className="w-full rounded-lg border border-brand-cream-accent p-1.5 text-xs focus:border-brand-maroon focus:outline-none"
                placeholder="15"
              />
            </div>
          </div>
        </div>

        {/* Lokasi & Kategori (Grid 2 Kolom) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block font-semibold text-brand-text">
              Lokasi <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={currentEvent.location || ''}
              onChange={(e) => onChange({ location: e.target.value })}
              className="w-full rounded-xl border border-brand-cream-accent p-2.5 text-xs focus:border-brand-maroon focus:outline-none"
              placeholder="Pendopo Utama RBR"
            />
          </div>
          <div>
            <label className="mb-1 block font-semibold text-brand-text">Kategori</label>
            <select
              value={currentEvent.category || 'Budaya'}
              onChange={(e) => onChange({ category: e.target.value })}
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
        </div>

        {/* Status Tiket & Tiket Terjual (Grid 2 Kolom) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block font-semibold text-brand-text">Status Tiket</label>
            <select
              value={currentEvent.status || 'Tiket Tersedia'}
              onChange={(e) =>
                onChange({ status: e.target.value as 'Tiket Tersedia' | 'Tiket Penuh' })
              }
              className="w-full rounded-xl border border-brand-cream-accent p-2.5 text-xs focus:border-brand-maroon focus:outline-none bg-white"
            >
              <option value="Tiket Tersedia">Tiket Tersedia</option>
              <option value="Tiket Penuh">Tiket Penuh (Tutup Penjualan)</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block font-semibold text-brand-text">
              Tiket Terjual <span className="text-[10px] text-brand-muted font-normal">(Lunas Real-Time)</span>
            </label>
            <input
              type="number"
              min="0"
              readOnly
              value={currentEvent.booked_count ?? currentEvent.sold ?? 0}
              className="w-full rounded-xl border border-brand-cream-accent p-2.5 text-xs bg-stone-100 text-stone-600 cursor-not-allowed focus:outline-none"
              title="Tiket terjual dihitung otomatis dari transaksi lunas (read-only)"
            />
          </div>
        </div>

        {/* URL & Upload Banner Event (Grid 2 Kolom) */}
        <div>
          <label className="mb-1 block font-semibold text-brand-text">
            URL / Upload Banner Event
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
            <input
              type="text"
              value={currentEvent.image || ''}
              onChange={(e) => onChange({ image: e.target.value })}
              className="w-full rounded-xl border border-brand-cream-accent p-2.5 text-xs focus:border-brand-maroon focus:outline-none"
              placeholder="URL gambar (contoh: https://...)"
            />
            <label
              htmlFor="banner-upload"
              className={`flex w-full h-[38px] cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed transition-colors overflow-hidden px-3 ${
                displayImage
                  ? 'border-brand-maroon bg-rose-50/20'
                  : 'border-brand-cream-accent bg-[#FAF6F0] hover:border-brand-maroon hover:bg-rose-50/10'
              }`}
            >
              {displayImage ? (
                <div className="flex items-center gap-2 w-full justify-between">
                  <img
                    src={
                      displayImage.startsWith('assets/images/')
                        ? `/${displayImage.replace('assets/images/', '')}`
                        : displayImage
                    }
                    alt="Preview"
                    className="h-6 w-10 object-cover rounded shrink-0"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <span className="text-[11px] font-semibold text-brand-maroon truncate">Ganti Banner</span>
                  <ImageUp size={14} className="text-brand-maroon shrink-0" />
                </div>
              ) : (
                <div className="flex items-center gap-2 text-brand-muted">
                  <ImageUp size={14} className="text-brand-maroon" />
                  <span className="text-[11px] font-semibold text-brand-text">Upload Banner</span>
                </div>
              )}
              <input
                id="banner-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onBannerChange}
              />
            </label>
          </div>
        </div>
      </form>
    </AdminModal>
  );
};

export default EventModal;
