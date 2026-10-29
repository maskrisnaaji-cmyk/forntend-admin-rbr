"use client";

import React from 'react';
import { Trash2, BookOpen } from 'lucide-react';
import { BookItem } from './types';

interface BookTableProps {
  books: BookItem[];
  onEdit: (book: BookItem) => void;
  onDelete: (book: BookItem) => void;
}

export const BookTable: React.FC<BookTableProps> = ({ books, onEdit, onDelete }) => {
  const [failedImages, setFailedImages] = React.useState<Record<string, boolean>>({});

  const handleImageError = (code: string) => {
    setFailedImages((prev) => ({ ...prev, [code]: true }));
  };

  const getImageUrl = (url?: string) => {
    if (!url) return '';
    // Cloud URL Vercel Blob / Full URL
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('blob:') || url.startsWith('data:')) {
      return url;
    }
    // Fallback path legacy
    if (url.startsWith('assets/images/')) {
      return `/${url.replace('assets/images/', '')}`;
    }
    return url;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-full text-left text-xs">
        <thead>
          <tr className="border-b border-brand-cream-accent text-brand-muted">
            <th className="py-3 px-2">Sampul</th>
            <th className="py-3 px-2">Kode Buku</th>
            <th className="py-3 px-2">Judul Pustaka</th>
            <th className="py-3 px-2">Kategori</th>
            <th className="py-3 px-2">Status</th>
            <th className="py-3 px-2">Peminjam saat ini</th>
            <th className="py-3 px-2 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-brand-cream-accent">
          {books.map((buku) => (
            <tr key={buku.code} className="hover:bg-brand-cream-card/50 transition-colors">
              {/* Kolom Sampul / Gambar */}
              <td className="py-2.5 px-2">
                <div className="h-12 w-9 shrink-0 overflow-hidden rounded-md border border-brand-cream-accent shadow-sm bg-brand-cream-card flex items-center justify-center">
                  {buku.coverImage && !failedImages[buku.code] ? (
                    <img
                      src={getImageUrl(buku.coverImage)}
                      alt={`Sampul ${buku.title}`}
                      className="h-full w-full object-cover"
                      onError={() => handleImageError(buku.code)}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-brand-muted">
                      <BookOpen size={14} />
                    </div>
                  )}
                </div>
              </td>
              <td className="py-3.5 px-2 font-bold text-brand-maroon">{buku.code}</td>
              <td className="py-3.5 px-2 font-semibold text-brand-text">{buku.title}</td>
              <td className="py-3.5 px-2 text-brand-muted">{buku.category}</td>
              <td className="py-3.5 px-2">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                    buku.status === 'Tersedia'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {buku.status}
                </span>
              </td>
              <td className="py-3.5 px-2 text-brand-text">{buku.borrower}</td>
              <td className="py-3.5 px-2 text-right">
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(buku)}
                    className="text-xs font-bold text-brand-maroon hover:underline cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(buku)}
                    title="Hapus Judul Pustaka"
                    className="rounded-lg p-1 text-brand-muted transition-colors hover:bg-rose-50 hover:text-rose-600 cursor-pointer"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {books.length === 0 && (
            <tr>
              <td colSpan={7} className="py-8 text-center text-brand-muted">
                Tidak ada judul pustaka yang ditemukan.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BookTable;
