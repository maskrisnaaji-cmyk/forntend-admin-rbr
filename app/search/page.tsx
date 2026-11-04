"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/AdminLayout';
import { 
  Search, 
  BookOpen, 
  Coffee, 
  Calendar, 
  Users, 
  Clock, 
  Loader2, 
  ArrowRight,
  Filter,
  ExternalLink
} from 'lucide-react';
import { SearchResults } from '@/components/GlobalSearchBar';

function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get('q') || '';

  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [activeCategory, setActiveCategory] = useState<'all' | 'books' | 'kedai' | 'events' | 'users'>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SearchResults>({
    books: [],
    menus: [],
    orders: [],
    events: [],
    users: [],
  });

  const performSearch = async (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) {
      setResults({ books: [], menus: [], orders: [], events: [], users: [] });
      return;
    }

    setIsLoading(true);
    try {
      let res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`);
      if (!res.ok) {
        res = await fetch(`http://localhost:5000/api/search?q=${encodeURIComponent(trimmed)}`);
      }
      if (res.ok) {
        const data = await res.json();
        setResults(data.results || { books: [], menus: [], orders: [], events: [], users: [] });
      }
    } catch (err) {
      console.error('[SearchPage] Error fetching search:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      setSearchTerm(initialQuery);
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      performSearch(searchTerm.trim());
    }
  };

  const totalResults =
    (results.books?.length || 0) +
    (results.menus?.length || 0) +
    (results.orders?.length || 0) +
    (results.events?.length || 0) +
    (results.users?.length || 0);

  const kedaiTotal = (results.menus?.length || 0) + (results.orders?.length || 0);

  return (
    <div className="space-y-6">
      {/* Header & Search Input Box */}
      <div className="rounded-2xl border border-brand-cream-accent bg-white p-6 shadow-xs">
        <h1 className="text-xl font-bold text-brand-text mb-1">Pencarian Universal Sistem</h1>
        <p className="text-xs text-brand-muted mb-5">
          Cari data terpadu dari seluruh modul: Pustaka Buku, Menu &amp; Pesanan Kedai, Agenda Budaya, hingga Akun Member.
        </p>

        <form onSubmit={handleSearchSubmit} className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 text-brand-muted" size={17} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Masukkan judul buku, penulis, nama menu kopi, agenda seni, atau email user..."
              className="w-full rounded-xl border border-brand-cream-accent bg-brand-cream/30 py-2.5 pl-10 pr-4 text-sm text-brand-text placeholder:text-brand-muted/70 focus:border-brand-maroon focus:bg-white focus:outline-none transition-all"
            />
          </div>
          <button
            type="submit"
            className="flex items-center gap-2 rounded-xl bg-brand-maroon px-6 py-2.5 text-xs font-bold text-white shadow hover:bg-brand-maroon-dark transition-colors cursor-pointer shrink-0"
          >
            {isLoading ? <Loader2 size={15} className="animate-spin" /> : <Search size={15} />}
            <span>Cari</span>
          </button>
        </form>

        {/* Tab Kategori */}
        <div className="flex flex-wrap items-center gap-2 mt-5 pt-4 border-t border-brand-cream-accent">
          <button
            type="button"
            onClick={() => setActiveCategory('all')}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-brand-maroon text-white shadow-xs'
                : 'bg-brand-cream text-brand-muted border border-brand-cream-accent hover:text-brand-text'
            }`}
          >
            Semua Hasil ({totalResults})
          </button>

          <button
            type="button"
            onClick={() => setActiveCategory('books')}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
              activeCategory === 'books'
                ? 'bg-brand-maroon text-white shadow-xs'
                : 'bg-brand-cream text-brand-muted border border-brand-cream-accent hover:text-brand-text'
            }`}
          >
            <BookOpen size={13} />
            <span>Pustaka ({results.books?.length || 0})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveCategory('kedai')}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
              activeCategory === 'kedai'
                ? 'bg-brand-maroon text-white shadow-xs'
                : 'bg-brand-cream text-brand-muted border border-brand-cream-accent hover:text-brand-text'
            }`}
          >
            <Coffee size={13} />
            <span>Kedai &amp; Pesanan ({kedaiTotal})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveCategory('events')}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
              activeCategory === 'events'
                ? 'bg-brand-maroon text-white shadow-xs'
                : 'bg-brand-cream text-brand-muted border border-brand-cream-accent hover:text-brand-text'
            }`}
          >
            <Calendar size={13} />
            <span>Agenda &amp; Tiket ({results.events?.length || 0})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveCategory('users')}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
              activeCategory === 'users'
                ? 'bg-brand-maroon text-white shadow-xs'
                : 'bg-brand-cream text-brand-muted border border-brand-cream-accent hover:text-brand-text'
            }`}
          >
            <Users size={13} />
            <span>Anggota ({results.users?.length || 0})</span>
          </button>
        </div>
      </div>

      {/* Loading Indicator */}
      {isLoading && (
        <div className="flex items-center justify-center p-12 bg-white rounded-2xl border border-brand-cream-accent">
          <div className="flex items-center gap-3 text-brand-maroon font-bold text-sm">
            <Loader2 className="animate-spin" size={20} />
            <span>Mencari di seluruh basis data Rumah Budaya Ratna...</span>
          </div>
        </div>
      )}

      {/* State Tidak Ada Hasil */}
      {!isLoading && searchTerm && totalResults === 0 && (
        <div className="p-12 text-center rounded-2xl border border-brand-cream-accent bg-white shadow-xs">
          <div className="w-12 h-12 mx-auto rounded-full bg-brand-cream flex items-center justify-center text-brand-muted mb-3">
            <Search size={22} />
          </div>
          <h3 className="text-base font-bold text-brand-text">Tidak Ada Hasil Ditemukan</h3>
          <p className="text-xs text-brand-muted max-w-md mx-auto mt-1">
            Tidak ditemukan data yang cocok dengan &ldquo;{searchTerm}&rdquo; pada Buku, Menu, Agenda, maupun Anggota.
          </p>
        </div>
      )}

      {/* Konten Hasil Terstruktur */}
      {!isLoading && totalResults > 0 && (
        <div className="space-y-6">
          {/* SEKSI 1: BUKU / PUSTAKA */}
          {(activeCategory === 'all' || activeCategory === 'books') && results.books?.length > 0 && (
            <div className="rounded-2xl border border-brand-cream-accent bg-white p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-brand-cream-accent pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-brand-maroon/10 text-brand-maroon">
                    <BookOpen size={18} />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-brand-text">Koleksi Pustaka &amp; Buku</h2>
                    <p className="text-[11px] text-brand-muted">Hasil pencarian judul, penulis, dan lokasi rak</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => router.push('/pustaka')}
                  className="inline-flex items-center gap-1 text-xs font-bold text-brand-maroon hover:underline cursor-pointer"
                >
                  <span>Buka Modul Pustaka</span>
                  <ArrowRight size={13} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {results.books.map((book) => (
                  <div
                    key={book.id}
                    onClick={() => router.push('/pustaka')}
                    className="p-3.5 rounded-xl border border-brand-cream-accent bg-brand-cream/20 hover:bg-brand-cream/60 transition-all cursor-pointer flex items-start justify-between gap-3"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold text-brand-maroon bg-brand-maroon/10 px-1.5 py-0.5 rounded">
                          {book.code || `BK-${book.id}`}
                        </span>
                        <span className="text-[10px] text-brand-muted">• Rak: {book.rack_location || 'Utama'}</span>
                      </div>
                      <h4 className="text-xs font-bold text-brand-text truncate">{book.title}</h4>
                      <p className="text-[11px] text-brand-muted">
                        Penulis: <span className="font-medium text-brand-text">{book.author}</span> {book.year ? `(${book.year})` : ''}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                        (book.status || '').toLowerCase().includes('tersedia')
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {book.status || 'Tersedia'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SEKSI 2: MENU KEDAI & PESANAN */}
          {(activeCategory === 'all' || activeCategory === 'kedai') && kedaiTotal > 0 && (
            <div className="rounded-2xl border border-brand-cream-accent bg-white p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-brand-cream-accent pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-700">
                    <Coffee size={18} />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-brand-text">Menu Kedai Kopi &amp; Pesanan</h2>
                    <p className="text-[11px] text-brand-muted">Daftar sajian minuman, camilan nusantara, dan antrean transaksi</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => router.push('/kedai')}
                  className="inline-flex items-center gap-1 text-xs font-bold text-brand-maroon hover:underline cursor-pointer"
                >
                  <span>Buka Modul Kedai</span>
                  <ArrowRight size={13} />
                </button>
              </div>

              {/* Sub-grid Menu */}
              {results.menus?.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2">
                    Item Menu ({results.menus.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {results.menus.map((menu) => (
                      <div
                        key={`menu-${menu.id}`}
                        onClick={() => router.push('/kedai')}
                        className="p-3 rounded-xl border border-brand-cream-accent bg-brand-cream/20 hover:bg-brand-cream/60 transition-all cursor-pointer space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                            {menu.category}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              menu.status === 'Habis'
                                ? 'bg-red-50 text-red-600 border border-red-200'
                                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            }`}
                          >
                            {menu.status || 'Tersedia'}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-brand-text">{menu.name}</h4>
                        <p className="text-xs font-extrabold text-brand-maroon">
                          Rp {Number(menu.price).toLocaleString('id-ID')}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sub-grid Pesanan */}
              {results.orders?.length > 0 && (
                <div className="pt-2">
                  <h3 className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2">
                    Pesanan / Transaksi ({results.orders.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {results.orders.map((order) => (
                      <div
                        key={`order-${order.id}`}
                        onClick={() => router.push('/kedai')}
                        className="p-3.5 rounded-xl border border-brand-cream-accent bg-brand-cream/30 hover:bg-brand-cream/80 transition-all cursor-pointer flex items-center justify-between gap-3"
                      >
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-brand-maroon">
                              #{order.id}
                            </span>
                            <span className="text-xs font-semibold text-brand-text">
                              {order.table_number}
                            </span>
                            <span className="text-[10px] text-brand-muted">• {order.time}</span>
                          </div>
                          <p className="text-[11px] text-brand-muted truncate">{order.items}</p>
                          <p className="text-xs font-extrabold text-brand-maroon">{order.total}</p>
                        </div>
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full capitalize shrink-0 ${
                            order.status === 'disiapkan'
                              ? 'bg-amber-100 text-amber-700'
                              : order.status === 'selesai'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          <Clock size={11} /> {order.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SEKSI 3: AGENDA & TIKET */}
          {(activeCategory === 'all' || activeCategory === 'events') && results.events?.length > 0 && (
            <div className="rounded-2xl border border-brand-cream-accent bg-white p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-brand-cream-accent pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-purple-500/10 text-purple-700">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-brand-text">Agenda &amp; Tiket Budaya</h2>
                    <p className="text-[11px] text-brand-muted">Jadwal lokakarya, pameran seni, dan pertunjukan</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => router.push('/agenda')}
                  className="inline-flex items-center gap-1 text-xs font-bold text-brand-maroon hover:underline cursor-pointer"
                >
                  <span>Buka Modul Agenda</span>
                  <ArrowRight size={13} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {results.events.map((event) => (
                  <div
                    key={event.id}
                    onClick={() => router.push('/agenda')}
                    className="p-3.5 rounded-xl border border-brand-cream-accent bg-brand-cream/20 hover:bg-brand-cream/60 transition-all cursor-pointer flex items-center justify-between gap-3"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200">
                          {event.category || 'Budaya'}
                        </span>
                        <span className="text-[10px] text-brand-muted">• {event.date}</span>
                      </div>
                      <h4 className="text-xs font-bold text-brand-text truncate">{event.title}</h4>
                      <p className="text-[11px] text-brand-muted">
                        {event.time} @ {event.location}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-bold text-brand-maroon block">
                        {Number(event.price) === 0 ? 'Gratis' : `Rp ${Number(event.price).toLocaleString('id-ID')}`}
                      </span>
                      <span className="text-[10px] text-brand-muted">
                        Terjual: {event.sold ?? 0}/{event.quota ?? 50}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SEKSI 4: ANGGOTA / MEMBER */}
          {(activeCategory === 'all' || activeCategory === 'users') && results.users?.length > 0 && (
            <div className="rounded-2xl border border-brand-cream-accent bg-white p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-brand-cream-accent pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-700">
                    <Users size={18} />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-brand-text">Anggota &amp; Pengguna Komunitas</h2>
                    <p className="text-[11px] text-brand-muted">Data akun terdaftar, hak akses, dan kontak member</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => router.push('/anggota')}
                  className="inline-flex items-center gap-1 text-xs font-bold text-brand-maroon hover:underline cursor-pointer"
                >
                  <span>Buka Modul Anggota</span>
                  <ArrowRight size={13} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {results.users.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => router.push('/anggota')}
                    className="p-3.5 rounded-xl border border-brand-cream-accent bg-brand-cream/20 hover:bg-brand-cream/60 transition-all cursor-pointer space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-brand-text truncate">{user.name}</h4>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                          user.role === 'admin'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}
                      >
                        {user.role}
                      </span>
                    </div>
                    <p className="text-[11px] text-brand-muted truncate">{user.email}</p>
                    {user.phone && (
                      <p className="text-[10px] text-brand-muted">📞 {user.phone}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <AdminLayout activeTab="search">
      <Suspense
        fallback={
          <div className="flex min-h-[400px] items-center justify-center">
            <Loader2 className="animate-spin text-brand-maroon" size={24} />
          </div>
        }
      >
        <SearchPageContent />
      </Suspense>
    </AdminLayout>
  );
}
