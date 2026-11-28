"use client";

import React from 'react';
import { BookOpen, ImageUp } from 'lucide-react';
import { AdminModal } from '@/components/ui/AdminModal';
import { BookItem } from './types';

interface BookModalProps {
  isOpen: boolean;
  isEditing: boolean;
  currentBook: Partial<BookItem>;
  coverPreview: string;
  isUploading?: boolean;
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
  isUploading = false,
  onClose,
  onChange,
  onCoverChange,
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
            <BookOpen size={15} />
          </span>
          <span>{isEditing ? `Edit Pustaka ${currentBook.code}` : 'Tambah Judul Pustaka'}</span>
        </span>
      }
      subtitle={isEditing ? 'Perbarui data naskah, kategori, peminjam, atau tautan digital' : 'Tambahkan naskah kuno atau koleksi pustaka baru ke katalog'}
      size="lg"
      footer={
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
            form="book-form"
            disabled={isUploading}
            className="rounded-xl bg-[#5C1D24] px-5 py-2 text-sm font-semibold text-white hover:bg-[#4A161C] transition-colors cursor-pointer disabled:opacity-60 flex items-center gap-1.5"
          >
            {isUploading ? (
              <>
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Mengunggah Sampul...</span>
              </>
            ) : (
              <span>{isEditing ? 'Simpan Perubahan' : 'Simpan Pustaka'}</span>
            )}
          </button>
        </div>
      }
    >
      <form id="book-form" onSubmit={onSubmit} className="space-y-3.5 text-xs">
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
              value={currentBook.status?.toUpperCase() === 'DIPINJAM' ? 'DIPINJAM' : 'TERSEDIA'}
              onChange={(e) => {
                const nextVal = e.target.value;
                onChange({
                  status: nextVal,
                  borrower: nextVal === 'TERSEDIA' ? '-' : (currentBook.borrower === '-' ? '' : currentBook.borrower),
                });
              }}
              className="w-full rounded-xl border border-brand-cream-accent p-2.5 text-xs focus:border-brand-maroon focus:outline-none bg-white font-medium"
            >
              <option value="TERSEDIA">TERSEDIA</option>
              <option value="DIPINJAM">DIPINJAM</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block font-semibold text-brand-text">Nama Peminjam</label>
            <input
              type="text"
              disabled={currentBook.status?.toUpperCase() !== 'DIPINJAM'}
              value={currentBook.status?.toUpperCase() !== 'DIPINJAM' ? '-' : (currentBook.borrower || '')}
              onChange={(e) => onChange({ borrower: e.target.value })}
              className="w-full rounded-xl border border-brand-cream-accent p-2.5 text-xs focus:border-brand-maroon focus:outline-none disabled:bg-gray-100 disabled:text-gray-400 font-medium"
              placeholder={currentBook.status?.toUpperCase() === 'DIPINJAM' ? "Nama peminjam saat ini" : "-"}
            />
          </div>
        </div>

        {/* Link E-Faksimili */}
        <div>
          <label className="mb-1 block font-semibold text-brand-text">
            Link E-Faksimili
          </label>
          <input
            type="url"
            value={currentBook.digital_url || ''}
            onChange={(e) => onChange({ digital_url: e.target.value })}
            className="w-full rounded-xl border border-brand-cream-accent p-2.5 text-xs focus:border-brand-maroon focus:outline-none"
            placeholder="Contoh: https://example.com/dokumen-faksimili.pdf"
          />
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
                  src={coverPreview.startsWith('assets/images/') ? `/${coverPreview.replace('assets/images/', '')}` : coverPreview}
                  alt="Preview sampul buku"
                  className="h-36 w-24 object-cover rounded-lg shadow-md"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
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
      </form>
    </AdminModal>
  );
};

export default BookModal;
