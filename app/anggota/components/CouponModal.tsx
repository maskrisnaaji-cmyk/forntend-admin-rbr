"use client";

import React from 'react';
import { X, Percent, Banknote, ShieldCheck, Users, Loader2 } from 'lucide-react';
import { CouponFormData } from './types';

interface CouponModalProps {
  isOpen: boolean;
  formData: CouponFormData;
  isSubmitting?: boolean;
  onClose: () => void;
  onChange: (updated: Partial<CouponFormData>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const CouponModal: React.FC<CouponModalProps> = ({
  isOpen,
  formData,
  isSubmitting = false,
  onClose,
  onChange,
  onSubmit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent p-4">
      <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border border-stone-200 bg-white p-5 sm:p-6 shadow-2xl animate-modal-pop">
        <div className="mb-4 flex items-center justify-between border-b border-brand-cream-accent pb-3">
          <div>
            <h3 className="text-sm font-bold text-brand-text">Buat Kupon Promo Baru</h3>
            <p className="text-[11px] text-brand-muted">
              Tambahkan kupon diskon untuk tiket acara atau pesanan kedai
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-brand-muted hover:bg-brand-cream-card hover:text-brand-text transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 text-xs">
          {/* Kode Promo */}
          <div>
            <label className="mb-1 block font-semibold text-brand-text">
              Kode Promo <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.code}
              onChange={(e) =>
                onChange({ code: e.target.value.toUpperCase().replace(/\s+/g, '') })
              }
              className="w-full rounded-xl border border-brand-cream-accent p-2.5 text-xs font-mono font-bold tracking-wider text-brand-text uppercase focus:border-brand-maroon focus:outline-none"
              placeholder="Contoh: BUDAYA20"
            />
            <p className="mt-1 text-[10px] text-brand-muted">
              Otomatis dikonversi ke huruf kapital tanpa spasi.
            </p>
          </div>

          {/* Deskripsi Promo */}
          <div>
            <label className="mb-1 block font-semibold text-brand-text">
              Deskripsi Promo <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.desc}
              onChange={(e) => onChange({ desc: e.target.value })}
              className="w-full rounded-xl border border-brand-cream-accent p-2.5 text-xs text-brand-text focus:border-brand-maroon focus:outline-none"
              placeholder="Contoh: Diskon 20% Khusus Tiket Pagelaran Seni"
            />
          </div>

          {/* Jenis Diskon */}
          <div>
            <label className="mb-1.5 block font-semibold text-brand-text">
              Jenis Diskon <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onChange({ discount_type: 'percent' })}
                className={`flex items-center justify-center gap-2 rounded-xl border p-2.5 text-xs font-bold transition-all cursor-pointer ${
                  formData.discount_type === 'percent'
                    ? 'border-brand-maroon bg-brand-maroon/10 text-brand-maroon'
                    : 'border-brand-cream-accent bg-white text-stone-600 hover:bg-brand-cream-card'
                }`}
              >
                <Percent size={14} />
                <span>Persentase (%)</span>
              </button>
              <button
                type="button"
                onClick={() => onChange({ discount_type: 'fixed' })}
                className={`flex items-center justify-center gap-2 rounded-xl border p-2.5 text-xs font-bold transition-all cursor-pointer ${
                  formData.discount_type === 'fixed'
                    ? 'border-brand-maroon bg-brand-maroon/10 text-brand-maroon'
                    : 'border-brand-cream-accent bg-white text-stone-600 hover:bg-brand-cream-card'
                }`}
              >
                <Banknote size={14} />
                <span>Nominal (Rp)</span>
              </button>
            </div>
          </div>

          {/* Nilai Diskon */}
          <div>
            <label className="mb-1 block font-semibold text-brand-text">
              Nilai Diskon{' '}
              <span className="font-normal text-brand-muted">
                ({formData.discount_type === 'percent' ? 'dalam persen %' : 'dalam rupiah Rp'})
              </span>{' '}
              <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                min="1"
                max={formData.discount_type === 'percent' ? 100 : undefined}
                required
                value={formData.discount_value}
                onChange={(e) => onChange({ discount_value: e.target.value })}
                className="w-full rounded-xl border border-brand-cream-accent p-2.5 text-xs text-brand-text focus:border-brand-maroon focus:outline-none"
                placeholder={formData.discount_type === 'percent' ? '20' : '15000'}
              />
              <span className="absolute right-3 top-2.5 text-xs font-semibold text-brand-muted">
                {formData.discount_type === 'percent' ? '%' : 'IDR'}
              </span>
            </div>
            <p className="mt-1 text-[10px] text-brand-muted">
              {formData.discount_type === 'percent'
                ? 'Potongan persentase dari total transaksi (maksimal 100%).'
                : 'Potongan nilai tetap langsung dalam Rupiah.'}
            </p>
          </div>

          {/* Target Pengguna */}
          <div>
            <label className="mb-1.5 block font-semibold text-brand-text">
              Target Pengguna <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onChange({ target_member: 'all' })}
                className={`flex items-center justify-center gap-1.5 rounded-xl border p-2.5 text-xs font-semibold transition-all cursor-pointer ${
                  formData.target_member === 'all'
                    ? 'border-brand-maroon bg-brand-maroon/10 text-brand-maroon font-bold'
                    : 'border-brand-cream-accent bg-white text-stone-600 hover:bg-brand-cream-card'
                }`}
              >
                <Users size={13} />
                <span>Semua User</span>
              </button>
              <button
                type="button"
                onClick={() => onChange({ target_member: 'verified' })}
                className={`flex items-center justify-center gap-1.5 rounded-xl border p-2.5 text-xs font-semibold transition-all cursor-pointer ${
                  formData.target_member === 'verified'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-bold'
                    : 'border-brand-cream-accent bg-white text-stone-600 hover:bg-brand-cream-card'
                }`}
              >
                <ShieldCheck size={13} />
                <span>Member Terverifikasi</span>
              </button>
            </div>
            <p className="mt-1 text-[10px] text-brand-muted">
              {formData.target_member === 'verified'
                ? 'Hanya user dengan status Terverifikasi yang berhak mengklaim kupon ini saat checkout.'
                : 'Dapat digunakan oleh seluruh pengunjung dan pengguna.'}
            </p>
          </div>

          {/* Skema Tampilan Kupon */}
          <div>
            <label className="mb-1 block font-semibold text-brand-text">Skema Tampilan</label>
            <select
              value={formData.theme}
              onChange={(e) => onChange({ theme: e.target.value as 'maroon' | 'amber' })}
              className="w-full rounded-xl border border-brand-cream-accent p-2.5 text-xs focus:border-brand-maroon focus:outline-none bg-white text-brand-text"
            >
              <option value="maroon">Nuansa Maroon (Agenda &amp; Tiket Budaya)</option>
              <option value="amber">Nuansa Amber (Kedai Kopi &amp; F&amp;B)</option>
            </select>
          </div>

          {/* Tombol Aksi */}
          <div className="mt-5 flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={onClose}
              className="rounded-xl border border-brand-cream-accent bg-brand-cream-card px-4 py-2.5 text-xs font-bold text-brand-muted hover:bg-brand-cream-accent hover:text-brand-text transition-colors cursor-pointer disabled:opacity-60"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-xl bg-brand-maroon px-5 py-2.5 text-xs font-bold text-white shadow hover:bg-brand-maroon-light transition-colors cursor-pointer disabled:opacity-60"
            >
              {isSubmitting && <Loader2 size={13} className="animate-spin" />}
              <span>{isSubmitting ? 'Menyimpan...' : 'Simpan Kupon'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CouponModal;
