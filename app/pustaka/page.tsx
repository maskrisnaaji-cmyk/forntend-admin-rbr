"use client";

import React, { useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Plus } from 'lucide-react';
import { BookItem } from './components/types';
import { BookSearchToolbar } from './components/BookSearchToolbar';
import { BookTable } from './components/BookTable';
import { BookModal } from './components/BookModal';
import { DeleteBookModal } from './components/DeleteBookModal';

export default function PustakaPage() {
  const [books, setBooks] = useState<BookItem[]>([
    { code: 'NSS-001', title: 'Dokumen Jibril', category: 'Naskah Kuno', status: 'Tersedia', borrower: '-', coverImage: '/dokumen_jibril.jpg' },
    { code: 'NSS-008', title: 'Anjing-Anjing Menyerbu Lek Zul', category: 'Sejarah', status: 'Dipinjam', borrower: 'Dimas Anggara', coverImage: '/anjing_anjing_menyerbu_lek_zul.jpg' },
    { code: 'NSS-012', title: 'Lipstik di Tas Doni', category: 'Seni & Budaya', status: 'Dipinjam', borrower: 'Siti Rahma', coverImage: '/lipstik_di_tas_doni.jpg' },
    { code: 'NSS-015', title: 'Laki-Laki yang Kawin dengan Peri', category: 'Linguistik', status: 'Tersedia', borrower: '-', coverImage: '/laki_laki_yang_kawin_dengan_peri.jpg' },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<BookItem | null>(null);

  const [formModalOpen, setFormModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentBook, setCurrentBook] = useState<Partial<BookItem>>({
    code: '',
    title: '',
    category: 'Naskah Kuno',
    status: 'Tersedia',
    borrower: '-',
    coverImage: '',
  });

  const [coverPreview, setCoverPreview] = useState<string>('');

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setCoverPreview(objectUrl);
    setCurrentBook((prev) => ({ ...prev, coverImage: objectUrl }));
  };

  const handleOpenCreate = () => {
    setIsEditing(false);
    const nextCode = `NSS-${String(books.length + 1).padStart(3, '0')}`;
    setCurrentBook({
      code: nextCode,
      title: '',
      category: 'Naskah Kuno',
      status: 'Tersedia',
      borrower: '-',
      coverImage: '',
    });
    setCoverPreview('');
    setFormModalOpen(true);
  };

  const handleOpenEdit = (buku: BookItem) => {
    setIsEditing(true);
    setCurrentBook(buku);
    setCoverPreview(buku.coverImage || '');
    setFormModalOpen(true);
  };

  const handleSaveBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentBook.title || !currentBook.code) return;

    if (isEditing) {
      setBooks((prev) =>
        prev.map((b) => (b.code === currentBook.code ? (currentBook as BookItem) : b))
      );
    } else {
      const newBook: BookItem = {
        code: currentBook.code || `NSS-${Date.now()}`,
        title: currentBook.title || '',
        category: currentBook.category || 'Naskah Kuno',
        status: currentBook.status || 'Tersedia',
        borrower: currentBook.borrower || '-',
        coverImage: currentBook.coverImage || '',
      };
      setBooks((prev) => [newBook, ...prev]);
    }
    setFormModalOpen(false);
  };

  const handleRequestDelete = (buku: BookItem) => {
    setBookToDelete(buku);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (bookToDelete) {
      setBooks((prev) => prev.filter((b) => b.code !== bookToDelete.code));
      setBookToDelete(null);
    }
    setDeleteModalOpen(false);
  };

  const filteredBooks = books.filter((b) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      b.code.toLowerCase().includes(query) ||
      b.title.toLowerCase().includes(query) ||
      b.borrower.toLowerCase().includes(query) ||
      b.category.toLowerCase().includes(query)
    );
  });

  return (
    <AdminLayout activeTab="pustaka">
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold text-brand-text">Pustaka &amp; Katalog Naskah</h1>
            <p className="text-xs text-brand-muted">
              Kelola koleksi naskah kuno, buku sejarah, dan aktivitas peminjaman
            </p>
          </div>
          <button
            onClick={handleOpenCreate}
            className="flex items-center justify-center gap-2 rounded-xl bg-brand-maroon px-4 py-2.5 text-xs font-bold text-white shadow hover:bg-brand-maroon-light transition-colors cursor-pointer"
          >
            <Plus size={16} />
            <span>Tambah Judul Pustaka</span>
          </button>
        </div>

        <div className="rounded-2xl border border-brand-cream-accent bg-white p-4 sm:p-5 shadow-sm">
          <BookSearchToolbar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            totalBooks={books.length}
          />
          <BookTable
            books={filteredBooks}
            onEdit={handleOpenEdit}
            onDelete={handleRequestDelete}
          />
        </div>

        {/* Modal Tambah / Edit */}
        <BookModal
          isOpen={formModalOpen}
          isEditing={isEditing}
          currentBook={currentBook}
          coverPreview={coverPreview}
          onClose={() => setFormModalOpen(false)}
          onChange={(upd) => setCurrentBook((prev) => ({ ...prev, ...upd }))}
          onCoverChange={handleCoverChange}
          onSubmit={handleSaveBook}
        />

        {/* Modal Konfirmasi Hapus */}
        <DeleteBookModal
          isOpen={deleteModalOpen}
          bookToDelete={bookToDelete}
          onClose={() => {
            setDeleteModalOpen(false);
            setBookToDelete(null);
          }}
          onConfirm={handleConfirmDelete}
        />
      </div>
    </AdminLayout>
  );
}
