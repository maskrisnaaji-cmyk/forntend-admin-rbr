"use client";

import React from 'react';
import { Percent, Banknote, ShieldCheck, Users, Loader2 } from 'lucide-react';
import { AdminModal } from '@/components/ui/AdminModal';
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
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <span className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-maroon/10 text-brand-maroon shrink-0">
            <Percent size={15} />
          </span>
          <span>Buat Kupon Promo Baru</span>
        </span>
      }
      subtitle="Terbitkan kode kupon potongan harga untuk tiket acara atau transaksi kedai"
      size="lg"
      footer={
        <div className="flex items-center justify-end gap-2.5">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onClose}
            className="rounded-xl border border-stone-200 px-4 py-2 text-sm font-medium text-stone-600 hover:bg-stone-50 transition-colors cursor-pointer disabled:opacity-60"
          >
            Batal
          </button>
          <button
            type="submit"
            form="coupon-form"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-xl bg-[#5C1D24] px-5 py-2 text-sm font-semibold text-white hover:bg-[#4A161C] transition-colors cursor-pointer disabled:opacity-60"
          >
            {isSubmitting && <Loader2 size={13} className="animate-spin" />}
            <span>{isSubmitting ? 'Menyimpan...' : 'Simpan Kupon'}</span>
          </button>
        </div>
      }
    >
      <form id="coupon-form" onSubmit={onSubmit} className="space-y-3.5 text-xs">
        {/* Grid 2 Kolom: Kode Promo & Skema Tampilan */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
          </div>

          <div>
            <label className="mb-1 block font-semibold text-brand-text">Skema Tampilan</label>
            <select
              value={formData.theme}
              onChange={(e) => onChange({ theme: e.target.value as 'maroon' | 'amber' })}
              className="w-full rounded-xl border border-brand-cream-accent p-2.5 text-xs focus:border-brand-maroon focus:outline-none bg-white text-brand-text"
            >
              <option value="maroon">Nuansa Maroon (Agenda Budaya)</option>
              <option value="amber">Nuansa Amber (Kedai Kopi)</option>
            </select>
          </div>
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

        {/* Grid 2 Kolom: Jenis Diskon & Nilai Diskon */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block font-semibold text-brand-text">
              Jenis Diskon <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onChange({ discount_type: 'percent' })}
                className={`flex items-center justify-center gap-1.5 rounded-xl border p-2.5 text-xs font-bold transition-all cursor-pointer ${
                  formData.discount_type === 'percent'
                    ? 'border-brand-maroon bg-brand-maroon/10 text-brand-maroon'
                    : 'border-brand-cream-accent bg-white text-stone-600 hover:bg-brand-cream-card'
                }`}
              >
                <Percent size={13} />
                <span>Persen (%)</span>
              </button>
              <button
                type="button"
                onClick={() => onChange({ discount_type: 'fixed' })}
                className={`flex items-center justify-center gap-1.5 rounded-xl border p-2.5 text-xs font-bold transition-all cursor-pointer ${
                  formData.discount_type === 'fixed'
                    ? 'border-brand-maroon bg-brand-maroon/10 text-brand-maroon'
                    : 'border-brand-cream-accent bg-white text-stone-600 hover:bg-brand-cream-card'
                }`}
              >
                <Banknote size={13} />
                <span>Nominal (Rp)</span>
              </button>
            </div>
          </div>

          <div>
            <label className="mb-1 block font-semibold text-brand-text">
              Nilai Diskon{' '}
              <span className="font-normal text-brand-muted">
                ({formData.discount_type === 'percent' ? '%' : 'Rp'})
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
          </div>
        </div>

        {/* Target Pengguna */}
        <div>
          <label className="mb-1 block font-semibold text-brand-text">
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
              ? 'Hanya user dengan status Terverifikasi yang berhak mengklaim kupon ini.'
              : 'Dapat digunakan oleh seluruh pengguna.'}
          </p>
        </div>
      </form>
    </AdminModal>
  );
};

export default CouponModal;
