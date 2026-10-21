"use client";

import React from 'react';
import { X, BookOpen, ImageUp } from 'lucide-react';
import { BookItem } from './types';

interface BookModalProps {
  isOpen: boolean;
  isEditing: boolean;
  currentBook: Partial<BookItem>;
  coverPreview: string;
  onClose: () => void;
  onChange: (updated: Partial<BookItem>) => void;
  onCoverChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const BookModal: React.FC<BookModalProps> = ({
  isOpen,
  isEditing,
  currentBook,
  coverPreview,
  onClose,
  onChange,
  onCoverChange,
  onSubmit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-brand-cream-accent bg-white p-5 sm:p-6 shadow-xl animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between border-b border-brand-cream-accent pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-maroon/10 text-brand-maroon">
              <BookOpen size={16} />
            </div>
            <h3 className="text-sm font-bold text-brand-text">
              {isEditing ? `Edit Pustaka ${currentBook.code}` : 'Tambah Judul Pustaka'}
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
          {/* Kode & Kategori */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block font-semibold text-brand-text">
                Kode Buku <span className="text-rose-500">*</span>
              </label>
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
                <option value="Seni & Budaya">Seni &amp; Budaya</option>
                <option value="Linguistik">Linguistik</option>
              </select>
            </div>
          </div>

          {/* Judul Pustaka */}
          <div>
            <label className="mb-1 block font-semibold text-brand-text">
              Judul Pustaka <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={currentBook.title || ''}
              onChange={(e) => onChange({ title: e.target.value })}
              className="w-full rounded-xl border border-brand-cream-accent p-2.5 text-xs focus:border-brand-maroon focus:outline-none"
              placeholder="Contoh: Serat Centhini Jilid 1"
            />
          </div>

          {/* Status & Peminjam */}
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

          {/* Upload Sampul Buku */}
          <div>
            <label className="mb-1.5 block font-semibold text-brand-text">
              Sampul / Foto Buku
            </label>
            <label
              htmlFor="cover-upload"
              className={`flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed transition-colors overflow-hidden ${
                coverPreview
                  ? 'border-brand-maroon bg-rose-50/30'
                  : 'border-brand-cream-accent bg-[#FAF6F0] hover:border-brand-maroon hover:bg-rose-50/20'
              }`}
            >
              {coverPreview ? (
                <div className="relative w-full flex justify-center py-3">
                  <img
                    src={coverPreview}
                    alt="Preview sampul buku"
                    className="h-36 w-24 object-cover rounded-lg shadow-md"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity rounded-xl">
                    <span className="text-white text-[10px] font-bold flex items-center gap-1">
                      <ImageUp size={14} /> Ganti Sampul
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1.5 py-5 px-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-maroon/10 text-brand-maroon">
                    <ImageUp size={20} />
                  </div>
                  <span className="text-[11px] font-semibold text-brand-text">
                    Klik untuk upload sampul buku
                  </span>
                  <span className="text-[10px] text-brand-muted">PNG, JPG, JPEG hingga 5MB</span>
                </div>
              )}
              <input
                id="cover-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onCoverChange}
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
