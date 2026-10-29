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
  const [selectedCoverFile, setSelectedCoverFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedCoverFile(file);
    const objectUrl = URL.createObjectURL(file);
    setCoverPreview(objectUrl);
    setCurrentBook((prev) => ({ ...prev, coverImage: objectUrl }));
  };

  const handleOpenCreate = () => {
    setIsEditing(false);
    setSelectedCoverFile(null);
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
    setSelectedCoverFile(null);
    setCurrentBook(buku);
    setCoverPreview(buku.coverImage || '');
    setFormModalOpen(true);
  };

  // Fetch books from backend on mount
  const fetchBooksFromBackend = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/books');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const mapped: BookItem[] = data.map((d: any) => ({
            code: d.code || `NSS-${String(d.id).padStart(3, '0')}`,
            title: d.title || '',
            category: d.category || 'Naskah Kuno',
            status: d.status || 'Tersedia',
            borrower: d.borrower || '-',
            coverImage: d.cover_image || '',
          }));
          setBooks(mapped);
        }
      }
    } catch (e) {
      console.warn('Backend books offline, using local state:', e);
    }
  };

  React.useEffect(() => {
    fetchBooksFromBackend();
  }, []);

  const handleSaveBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentBook.title || !currentBook.code) return;

    let finalCoverUrl = currentBook.coverImage || '';

    // 1. FORM DATA & UPLOAD: Kirim file gambar menggunakan FormData ke backend Vercel Blob jika ada file baru
    if (selectedCoverFile) {
      try {
        setIsUploading(true);
        const uploadFormData = new FormData();
        uploadFormData.append('file', selectedCoverFile);

        const uploadRes = await fetch('http://localhost:5000/api/upload', {
          method: 'POST',
          body: uploadFormData,
        });

        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          if (uploadData.url) {
            finalCoverUrl = uploadData.url;
            setCurrentBook((prev) => ({ ...prev, coverImage: uploadData.url }));
          }
        } else {
          const errData = await uploadRes.json().catch(() => ({}));
          console.warn('Gagal upload sampul buku ke Vercel Blob:', errData.message);
        }
      } catch (uploadErr) {
        console.error('Error saat upload sampul buku:', uploadErr);
      } finally {
        setIsUploading(false);
      }
    }

    // 2. PENANGANAN URL CLOUD: Simpan URL cloud yang dikembalikan backend ke database
    try {
      if (isEditing) {
        await fetch(`http://localhost:5000/api/books/${currentBook.code}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            code: currentBook.code,
            title: currentBook.title,
            category: currentBook.category,
            status: currentBook.status,
            borrower: currentBook.borrower,
            cover_image: finalCoverUrl,
          }),
        });
      } else {
        await fetch('http://localhost:5000/api/books', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            code: currentBook.code,
            title: currentBook.title,
            category: currentBook.category,
            status: currentBook.status,
            borrower: currentBook.borrower,
            cover_image: finalCoverUrl,
          }),
        });
      }
      fetchBooksFromBackend();
    } catch (e) {
      console.error('Gagal sync buku ke backend:', e);
      if (isEditing) {
        setBooks((prev) =>
          prev.map((b) => (b.code === currentBook.code ? ({ ...currentBook, coverImage: finalCoverUrl } as BookItem) : b))
        );
      } else {
        const newBook: BookItem = {
          code: currentBook.code || `NSS-${Date.now()}`,
          title: currentBook.title || '',
          category: currentBook.category || 'Naskah Kuno',
          status: currentBook.status || 'Tersedia',
          borrower: currentBook.borrower || '-',
          coverImage: finalCoverUrl,
        };
        setBooks((prev) => [newBook, ...prev]);
      }
    }
    setSelectedCoverFile(null);
    setFormModalOpen(false);
  };

  const handleRequestDelete = (buku: BookItem) => {
    setBookToDelete(buku);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (bookToDelete) {
      try {
        await fetch(`http://localhost:5000/api/books/${bookToDelete.code}`, {
          method: 'DELETE',
        });
        fetchBooksFromBackend();
      } catch (e) {
        console.warn('Gagal hapus buku di backend:', e);
        setBooks((prev) => prev.filter((b) => b.code !== bookToDelete.code));
      }
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
          isUploading={isUploading}
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
