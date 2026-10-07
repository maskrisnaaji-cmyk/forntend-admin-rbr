"use client";

import React, { useState } from 'react';
import { BookOpen, Plus, Search, BookMarked, Clock, Trash2, Pencil, X } from 'lucide-react';

interface BookItem {
  code: string;
  title: string;
  category: string;
  status: string;
  borrower: string;
}

export const PustakaView = () => {
  const [books, setBooks] = useState<BookItem[]>([
    { code: 'NSS-001', title: 'Dokuemn Jibril', category: 'Naskah Kuno', status: 'Tersedia', borrower: '-' },
    { code: 'NSS-008', title: 'Anjing-Anjing Menyerbu Lek Zul', category: 'Sejarah', status: 'Dipinjam', borrower: 'Dimas Anggara' },
    { code: 'NSS-012', title: 'Lipstik di Tas Doni', category: 'Seni & Budaya', status: 'Dipinjam', borrower: 'Siti Rahma' },
    { code: 'NSS-015', title: 'Laki-Laki yang Menikah dengan Peri', category: 'Linguistik', status: 'Tersedia', borrower: '-' },
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
  });

  const handleOpenCreate = () => {
    setIsEditing(false);
    const nextCode = `NSS-${String(books.length + 1).padStart(3, '0')}`;
    setCurrentBook({
      code: nextCode,
      title: '',
      category: 'Naskah Kuno',
      status: 'Tersedia',
      borrower: '-',
    });
    setFormModalOpen(true);
  };

  const handleOpenEdit = (buku: BookItem) => {
    setIsEditing(true);
    setCurrentBook(buku);
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-brand-text">Pustaka & Katalog Naskah</h1>
          <p className="text-xs text-brand-muted">Kelola koleksi naskah kuno, buku sejarah, dan aktivitas peminjaman</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 rounded-xl bg-brand-maroon px-4 py-2.5 text-xs font-bold text-white shadow hover:bg-brand-maroon-light transition-colors"
        >
          <Plus size={16} />
          <span>Tambah Judul Pustaka</span>
        </button>
      </div>

      <div className="rounded-2xl border border-brand-cream-accent bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div className="relative w-72">
            <Search className="absolute left-3 top-2.5 text-brand-muted" size={16} />
            <input
              type="text"
              placeholder="Cari judul buku atau nama peminjam..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-brand-cream-accent bg-brand-cream-card py-2 pl-9 pr-4 text-xs focus:border-brand-maroon focus:outline-none"
            />
          </div>
          <span className="text-xs font-semibold text-brand-muted">Total: {books.length} Judul Terdata</span>
        </div>

        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-brand-cream-accent text-brand-muted">
              <th className="py-3 px-2">Kode Buku</th>
              <th className="py-3 px-2">Judul Pustaka</th>
              <th className="py-3 px-2">Kategori</th>
              <th className="py-3 px-2">Status</th>
              <th className="py-3 px-2">Peminjam saat ini</th>
              <th className="py-3 px-2 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-cream-accent">
            {filteredBooks.map((buku) => (
              <tr key={buku.code} className="hover:bg-brand-cream-card/50">
                <td className="py-3.5 px-2 font-bold text-brand-maroon">{buku.code}</td>
                <td className="py-3.5 px-2 font-semibold text-brand-text">{buku.title}</td>
                <td className="py-3.5 px-2 text-brand-muted">{buku.category}</td>
                <td className="py-3.5 px-2">
                  <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                    buku.status === 'Tersedia' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {buku.status}
                  </span>
                </td>
                <td className="py-3.5 px-2 text-brand-text">{buku.borrower}</td>
                <td className="py-3.5 px-2 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(buku)}
                      className="text-xs font-bold text-brand-maroon hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRequestDelete(buku)}
                      title="Hapus Judul Pustaka"
                      className="rounded-lg p-1 text-brand-muted transition-colors hover:bg-rose-50 hover:text-rose-600"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredBooks.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-brand-muted">
                  Tidak ada judul pustaka yang ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Konfirmasi Hapus */}
      {deleteModalOpen && bookToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl border border-brand-cream-accent bg-white p-6 shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-600 mb-3">
              <Trash2 size={22} />
            </div>
            <h3 className="text-center text-sm font-bold text-brand-text">Konfirmasi Hapus Pustaka</h3>
            <p className="mt-2 text-center text-xs text-brand-muted leading-relaxed">
              Apakah Anda yakin ingin menghapus buku <span className="font-semibold text-brand-text">&ldquo;{bookToDelete.title}&rdquo; ({bookToDelete.code})</span>? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="mt-6 flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => { setDeleteModalOpen(false); setBookToDelete(null); }}
                className="flex-1 rounded-xl border border-brand-cream-accent bg-brand-cream-card py-2.5 text-xs font-bold text-brand-muted hover:bg-brand-cream-accent hover:text-brand-text transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 rounded-xl bg-rose-600 py-2.5 text-xs font-bold text-white shadow hover:bg-rose-700 transition-colors"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Tambah / Edit Pustaka */}
      {formModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-brand-cream-accent bg-white p-6 shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <div className="mb-4 flex items-center justify-between border-b border-brand-cream-accent pb-3">
              <h3 className="text-sm font-bold text-brand-text">
                {isEditing ? `Edit Pustaka ${currentBook.code}` : 'Tambah Judul Pustaka'}
              </h3>
              <button
                type="button"
                onClick={() => setFormModalOpen(false)}
                className="rounded-lg p-1 text-brand-muted hover:bg-brand-cream-card hover:text-brand-text transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveBook} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block font-semibold text-brand-text">Kode Buku</label>
                  <input
                    type="text"
                    required
                    value={currentBook.code || ''}
                    onChange={(e) => setCurrentBook({ ...currentBook, code: e.target.value })}
                    className="w-full rounded-xl border border-brand-cream-accent p-2.5 text-xs focus:border-brand-maroon focus:outline-none"
                    placeholder="Contoh: NSS-020"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-semibold text-brand-text">Kategori</label>
                  <select
                    value={currentBook.category || 'Naskah Kuno'}
                    onChange={(e) => setCurrentBook({ ...currentBook, category: e.target.value })}
                    className="w-full rounded-xl border border-brand-cream-accent p-2.5 text-xs focus:border-brand-maroon focus:outline-none bg-white"
                  >
                    <option value="Naskah Kuno">Naskah Kuno</option>
                    <option value="Sejarah">Sejarah</option>
                    <option value="Seni & Budaya">Seni & Budaya</option>
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
                  onChange={(e) => setCurrentBook({ ...currentBook, title: e.target.value })}
                  className="w-full rounded-xl border border-brand-cream-accent p-2.5 text-xs focus:border-brand-maroon focus:outline-none"
                  placeholder="Contoh: Serat Centhini Jilid 1"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block font-semibold text-brand-text">Status Peminjaman</label>
                  <select
                    value={currentBook.status || 'Tersedia'}
                    onChange={(e) => setCurrentBook({ ...currentBook, status: e.target.value, borrower: e.target.value === 'Tersedia' ? '-' : currentBook.borrower })}
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
                    onChange={(e) => setCurrentBook({ ...currentBook, borrower: e.target.value })}
                    className="w-full rounded-xl border border-brand-cream-accent p-2.5 text-xs focus:border-brand-maroon focus:outline-none disabled:bg-gray-100 disabled:text-gray-400"
                    placeholder="Nama peminjam"
                  />
                </div>
              </div>

              <div className="mt-5 flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setFormModalOpen(false)}
                  className="rounded-xl border border-brand-cream-accent bg-brand-cream-card px-4 py-2.5 text-xs font-bold text-brand-muted hover:bg-brand-cream-accent hover:text-brand-text transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-brand-maroon px-5 py-2.5 text-xs font-bold text-white shadow hover:bg-brand-maroon-light transition-colors"
                >
                  {isEditing ? 'Simpan Perubahan' : 'Simpan Pustaka'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};