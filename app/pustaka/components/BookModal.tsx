"use client";

import React from 'react';
import { X } from 'lucide-react';
import { BookItem } from './types';

interface BookModalProps {
  isOpen: boolean;
  isEditing: boolean;
  currentBook: Partial<BookItem>;
  onClose: () => void;
  onChange: (updated: Partial<BookItem>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const BookModal: React.FC<BookModalProps> = ({
  isOpen,
  isEditing,
  currentBook,
  onClose,
  onChange,
  onSubmit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border border-brand-cream-accent bg-white p-5 sm:p-6 shadow-xl animate-in fade-in zoom-in-95 duration-150">
        <div className="mb-4 flex items-center justify-between border-b border-brand-cream-accent pb-3">
          <h3 className="text-sm font-bold text-brand-text">
            {isEditing ? `Edit Pustaka ${currentBook.code}` : 'Tambah Judul Pustaka'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-brand-muted hover:bg-brand-cream-card hover:text-brand-text transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-3.5 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block font-semibold text-brand-text">Kode Buku</label>
              <input
                type="text"
                required
                value={currentBook.code || ''}
                onChange={(e) => onChange({ code: e.target.value })}
                className="w-full rounded-xl border border-brand-cream-accent p-2.5 text-xs focus:border-brand-maroon focus:outline-none"
                placeholder="Contoh: NSS-020"
              />
            </div>
            <div>
              <label className="mb-1 block font-semibold text-brand-text">Kategori</label>
              <select
                value={currentBook.category || 'Naskah Kuno'}
                onChange={(e) => onChange({ category: e.target.value })}
                className="w-full rounded-xl border border-brand-cream-accent p-2.5 text-xs focus:border-brand-maroon focus:outline-none bg-white"
              >
                <option value="Naskah Kuno">Naskah Kuno</option>
                <option value="Sejarah">Sejarah</option>
                <option value="Seni &amp; Budaya">Seni &amp; Budaya</option>
                <option value="Linguistik">Linguistik</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block font-semibold text-brand-text">Judul Pustaka</label>
            <input
              type="text"
              required
              value={currentBook.title || ''}
              onChange={(e) => onChange({ title: e.target.value })}
              className="w-full rounded-xl border border-brand-cream-accent p-2.5 text-xs focus:border-brand-maroon focus:outline-none"
              placeholder="Contoh: Serat Centhini Jilid 1"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block font-semibold text-brand-text">Status Peminjaman</label>
              <select
                value={currentBook.status || 'Tersedia'}
                onChange={(e) =>
                  onChange({
                    status: e.target.value,
                    borrower: e.target.value === 'Tersedia' ? '-' : currentBook.borrower,
                  })
                }
                className="w-full rounded-xl border border-brand-cream-accent p-2.5 text-xs focus:border-brand-maroon focus:outline-none bg-white"
              >
                <option value="Tersedia">Tersedia</option>
                <option value="Dipinjam">Dipinjam</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block font-semibold text-brand-text">Nama Peminjam</label>
              <input
                type="text"
                disabled={currentBook.status === 'Tersedia'}
                value={currentBook.borrower || '-'}
                onChange={(e) => onChange({ borrower: e.target.value })}
                className="w-full rounded-xl border border-brand-cream-accent p-2.5 text-xs focus:border-brand-maroon focus:outline-none disabled:bg-gray-100 disabled:text-gray-400"
                placeholder="Nama peminjam"
              />
            </div>
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
              {isEditing ? 'Simpan Perubahan' : 'Simpan Pustaka'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookModal;
