"use client";

import React from 'react';
import { X } from 'lucide-react';

interface CouponFormData {
  code: string;
  desc: string;
  theme: 'maroon' | 'amber';
}

interface CouponModalProps {
  isOpen: boolean;
  formData: CouponFormData;
  onClose: () => void;
  onChange: (updated: Partial<CouponFormData>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const CouponModal: React.FC<CouponModalProps> = ({
  isOpen,
  formData,
  onClose,
  onChange,
  onSubmit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border border-brand-cream-accent bg-white p-5 sm:p-6 shadow-xl animate-in fade-in zoom-in-95 duration-150">
        <div className="mb-4 flex items-center justify-between border-b border-brand-cream-accent pb-3">
          <h3 className="text-sm font-bold text-brand-text">Buat Kupon Promo Baru</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-brand-muted hover:bg-brand-cream-card hover:text-brand-text transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="mb-1 block font-semibold text-brand-text">Kode Promo</label>
            <input
              type="text"
              required
              value={formData.code}
              onChange={(e) => onChange({ code: e.target.value.toUpperCase() })}
              className="w-full rounded-xl border border-brand-cream-accent p-2.5 text-xs focus:border-brand-maroon focus:outline-none uppercase font-bold tracking-wider"
              placeholder="Contoh: BUDAYA50"
            />
          </div>

          <div>
            <label className="mb-1 block font-semibold text-brand-text">Deskripsi Promo</label>
            <input
              type="text"
              required
              value={formData.desc}
              onChange={(e) => onChange({ desc: e.target.value })}
              className="w-full rounded-xl border border-brand-cream-accent p-2.5 text-xs focus:border-brand-maroon focus:outline-none"
              placeholder="Contoh: Diskon 50% Tiket Masuk Pagelaran"
            />
          </div>

          <div>
            <label className="mb-1 block font-semibold text-brand-text">Skema Tampilan</label>
            <select
              value={formData.theme}
              onChange={(e) => onChange({ theme: e.target.value as 'maroon' | 'amber' })}
              className="w-full rounded-xl border border-brand-cream-accent p-2.5 text-xs focus:border-brand-maroon focus:outline-none bg-white"
            >
              <option value="maroon">Maroon (Agenda &amp; Tiket Budaya)</option>
              <option value="amber">Amber (Kedai Kopi)</option>
            </select>
          </div>

          <div className="mt-5 flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-brand-cream-accent bg-brand-cream-card px-4 py-2.5 text-xs font-bold text-brand-muted hover:bg-brand-cream-accent hover:text-brand-text transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="rounded-xl bg-brand-maroon px-5 py-2.5 text-xs font-bold text-white shadow hover:bg-brand-maroon-light transition-colors cursor-pointer"
            >
              Simpan Kupon
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CouponModal;
