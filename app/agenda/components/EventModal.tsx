"use client";

import React from 'react';
import { Ticket, X, ImageUp } from 'lucide-react';
import { EventItem } from './types';

interface EventModalProps {
  isOpen: boolean;
  isEditing: boolean;
  currentEvent: Partial<EventItem>;
  bannerPreview: string;
  isUploading?: boolean;
  onClose: () => void;
  onChange: (updated: Partial<EventItem>) => void;
  onBannerChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  isEditing,
  currentEvent,
  bannerPreview,
  isUploading = false,
  onClose,
  onChange,
  onBannerChange,
  onSubmit,
}) => {
  if (!isOpen) return null;

  return (
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
            onClick={onClose}
            className="rounded-lg p-1 text-brand-muted hover:bg-brand-cream-card hover:text-brand-text transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-3.5 text-xs">
          {/* Judul Acara */}
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
                onChange={(e) => onChange({ date: e.target.value })}
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
                onChange={(e) => onChange({ time: e.target.value })}
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
              onChange={(e) => onChange({ location: e.target.value })}
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
                onChange={(e) => onChange({ price: e.target.value })}
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
                onChange={(e) => onChange({ sold: Number(e.target.value) })}
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
                onChange={(e) => onChange({ total: Number(e.target.value) })}
                className="w-full rounded-xl border border-brand-cream-accent p-2.5 text-xs focus:border-brand-maroon focus:outline-none"
              />
            </div>
          </div>

          {/* Status Kuota */}
          <div>
            <label className="mb-1 block font-semibold text-brand-text">Status Kuota</label>
            <select
              value={currentEvent.status || 'Aktif'}
              onChange={(e) => onChange({ status: e.target.value })}
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
              className={`flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed transition-colors overflow-hidden ${
                bannerPreview
                  ? 'border-brand-gold bg-amber-50/50'
                  : 'border-brand-cream-accent bg-[#FAF6F0] hover:border-brand-gold hover:bg-amber-50/30'
              }`}
            >
              {bannerPreview ? (
                <div className="relative w-full overflow-hidden rounded-xl bg-stone-100 flex items-center justify-center">
                  <img
                    src={bannerPreview.startsWith('assets/images/') ? `/${bannerPreview.replace('assets/images/', '')}` : bannerPreview}
                    alt="Preview banner"
                    className="w-full h-32 object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
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
                  <span className="text-[11px] font-semibold text-brand-text">
                    Klik untuk upload foto banner
                  </span>
                  <span className="text-[10px] text-brand-muted">PNG, JPG, JPEG hingga 5MB</span>
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

          {/* Action Buttons */}
          <div className="mt-5 flex items-center justify-end gap-2.5 pt-2 border-t border-brand-cream-accent">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-brand-cream-accent bg-brand-cream-card px-4 py-2.5 text-xs font-bold text-brand-muted hover:bg-brand-cream-accent hover:text-brand-text transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="rounded-xl bg-brand-maroon px-5 py-2.5 text-xs font-bold text-white shadow hover:bg-brand-maroon-light transition-colors cursor-pointer disabled:opacity-60 flex items-center gap-1.5"
            >
              {isUploading ? (
                <>
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Mengunggah Banner...</span>
                </>
              ) : (
                <span>{isEditing ? 'Simpan Perubahan' : 'Simpan Agenda'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal;
