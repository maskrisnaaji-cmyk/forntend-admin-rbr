"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  X, 
  Loader2, 
  BookOpen, 
  Coffee, 
  Calendar, 
  Users, 
  ArrowRight,
  Clock,
  ExternalLink,
  ShoppingBag
} from 'lucide-react';

export interface BookResult {
  id: number;
  code?: string;
  title: string;
  author: string;
  category?: string;
  rack_location?: string;
  status?: string;
  year?: string;
  cover_image?: string;
}

export interface MenuResult {
  id: number;
  name: string;
  category?: string;
  price: number;
  description?: string;
  status?: string;
  image?: string;
}

export interface OrderResult {
  id: string;
  table_number: string;
  items: string;
  total: string;
  status: string;
  time: string;
}

export interface EventResult {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  price: number;
  status: string;
  category?: string;
  image?: string;
  quota?: number;
  sold?: number;
}

export interface UserResult {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: string;
  createdAt?: string;
}

export interface SearchResults {
  books: BookResult[];
  menus: MenuResult[];
  orders: OrderResult[];
  events: EventResult[];
  users: UserResult[];
}

export const GlobalSearchBar: React.FC = () => {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SearchResults>({
    books: [],
    menus: [],
    orders: [],
    events: [],
    users: [],
  });
  const [totalCount, setTotalCount] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut: Ctrl + K atau Cmd + K atau '/' untuk langsung fokus ke search bar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      } else if (e.key === 'Escape') {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Tutup dropdown saat klik di luar area
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch pencarian real-time dengan debouncing (280ms)
  useEffect(() => {
    const trimmed = query.trim();

    if (!trimmed) {
      setResults({ books: [], menus: [], orders: [], events: [], users: [] });
      setTotalCount(0);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const handler = setTimeout(async () => {
      try {
        // Coba panggil relative Next.js route /api/search terlebih dahulu
        let res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`);
        
        // Fallback langsung ke Express backend jika proxy Next.js offline
        if (!res.ok) {
          res = await fetch(`http://localhost:5000/api/search?q=${encodeURIComponent(trimmed)}`);
        }

        if (res.ok) {
          const data = await res.json();
          const resData: SearchResults = data.results || {
            books: [],
            menus: [],
            orders: [],
            events: [],
            users: [],
          };
          setResults(resData);
          setTotalCount(
            (resData.books?.length || 0) +
            (resData.menus?.length || 0) +
            (resData.orders?.length || 0) +
            (resData.events?.length || 0) +
            (resData.users?.length || 0)
          );
        }
      } catch (err) {
        console.error('[GlobalSearchBar] Fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    }, 280);

    return () => clearTimeout(handler);
  }, [query]);

  const handleClear = () => {
    setQuery('');
    setResults({ books: [], menus: [], orders: [], events: [], users: [] });
    setTotalCount(0);
    inputRef.current?.focus();
  };

  const handleKeyDownInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim()) {
      e.preventDefault();
      setIsOpen(false);
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const navigateTo = (path: string) => {
    setIsOpen(false);
    router.push(path);
  };

  const hasAnyResults = totalCount > 0;
  const isQueryEmpty = query.trim().length === 0;

  return (
    <div ref={containerRef} className="relative flex-1 sm:flex-initial">
      {/* Input Field */}
      <div className="relative">
        <Search className="absolute left-3 top-2.5 text-brand-muted pointer-events-none" size={15} />
        
        <input 
          ref={inputRef}
          type="text" 
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDownInput}
          placeholder="Cari buku, menu, agenda, anggota..." 
          className="w-full sm:w-64 md:w-80 rounded-xl border border-brand-cream-accent bg-white py-2 pl-9 pr-16 text-xs text-brand-text placeholder:text-brand-muted/70 focus:border-brand-maroon focus:ring-1 focus:ring-brand-maroon focus:outline-none transition-all shadow-xs"
        />

        <div className="absolute right-2.5 top-2 flex items-center gap-1">
          {isLoading && (
            <Loader2 size={14} className="animate-spin text-brand-maroon" />
          )}

          {query && !isLoading && (
            <button
              type="button"
              onClick={handleClear}
              className="text-brand-muted hover:text-brand-text p-0.5 rounded cursor-pointer transition-colors"
              title="Hapus pencarian"
            >
              <X size={13} />
            </button>
          )}

          <kbd className="hidden md:inline-flex items-center rounded border border-brand-cream-accent bg-brand-cream px-1.5 py-0.5 text-[9px] font-semibold text-brand-muted">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Autocomplete Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-[460px] md:w-[540px] max-h-[75dvh] overflow-y-auto rounded-2xl border border-brand-cream-accent bg-white shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
          {/* Header Panel */}
          <div className="p-3.5 border-b border-brand-cream-accent/60 bg-brand-cream/40 flex items-center justify-between text-xs">
            <span className="font-semibold text-brand-text">
              {isQueryEmpty
                ? 'Pencarian Universal'
                : isLoading
                ? 'Mencari di seluruh sistem...'
                : `Ditemukan ${totalCount} hasil`}
            </span>
            {query.trim() && (
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  router.push(`/search?q=${encodeURIComponent(query.trim())}`);
                }}
                className="text-[11px] font-bold text-brand-maroon hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <span>Halaman Hasil Lengkap</span>
                <ArrowRight size={12} />
              </button>
            )}
          </div>

          {/* Body Konten Autocomplete */}
          <div className="p-3 space-y-4">
            {/* Keadaan Saat Query Kosong */}
            {isQueryEmpty && (
              <div className="py-4 text-center">
                <p className="text-xs text-brand-muted mb-3">
                  Ketik kata kunci untuk mencari di berbagai modul sistem:
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setQuery('Dokumen');
                      inputRef.current?.focus();
                    }}
                    className="rounded-lg bg-brand-cream px-2.5 py-1 text-[11px] font-medium text-brand-text border border-brand-cream-accent hover:border-brand-maroon transition-colors cursor-pointer"
                  >
                    📚 Dokumen Jibril
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setQuery('Kopi');
                      inputRef.current?.focus();
                    }}
                    className="rounded-lg bg-brand-cream px-2.5 py-1 text-[11px] font-medium text-brand-text border border-brand-cream-accent hover:border-brand-maroon transition-colors cursor-pointer"
                  >
                    ☕ Kopi Tubruk
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setQuery('Pameran');
                      inputRef.current?.focus();
                    }}
                    className="rounded-lg bg-brand-cream px-2.5 py-1 text-[11px] font-medium text-brand-text border border-brand-cream-accent hover:border-brand-maroon transition-colors cursor-pointer"
                  >
                    🎭 Pameran Seni
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setQuery('Admin');
                      inputRef.current?.focus();
                    }}
                    className="rounded-lg bg-brand-cream px-2.5 py-1 text-[11px] font-medium text-brand-text border border-brand-cream-accent hover:border-brand-maroon transition-colors cursor-pointer"
                  >
                    👤 Admin RBR
                  </button>
                </div>
              </div>
            )}

            {/* Keadaan Tidak Ada Hasil */}
            {!isQueryEmpty && !isLoading && !hasAnyResults && (
              <div className="py-8 text-center space-y-2">
                <div className="w-10 h-10 mx-auto rounded-full bg-brand-cream flex items-center justify-center text-brand-muted">
                  <Search size={18} />
                </div>
                <p className="text-xs font-semibold text-brand-text">
                  Tidak ditemukan hasil untuk &ldquo;{query}&rdquo;
                </p>
                <p className="text-[11px] text-brand-muted max-w-xs mx-auto">
                  Pastikan ejaan kata kunci benar atau cari nama penulis, menu, kode rak, atau email member.
                </p>
              </div>
            )}

            {/* KATEGORI 1: BUKU / PUSTAKA */}
            {results.books.length > 0 && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between px-1 text-[11px] font-bold text-brand-muted uppercase tracking-wider">
                  <span className="flex items-center gap-1.5 text-brand-maroon">
                    <BookOpen size={13} /> Buku / Pustaka ({results.books.length})
                  </span>
                  <button
                    type="button"
                    onClick={() => navigateTo('/pustaka')}
                    className="text-brand-muted hover:text-brand-maroon transition-colors"
                  >
                    Lihat Pustaka
                  </button>
                </div>
                <div className="space-y-1">
                  {results.books.slice(0, 4).map((book) => (
                    <div
                      key={book.id}
                      onClick={() => navigateTo('/pustaka')}
                      className="group flex items-center justify-between p-2 rounded-xl hover:bg-brand-cream/60 transition-colors cursor-pointer border border-transparent hover:border-brand-cream-accent"
                    >
                      <div className="flex-1 min-w-0 pr-2">
                        <p className="text-xs font-semibold text-brand-text truncate group-hover:text-brand-maroon transition-colors">
                          {book.title}
                        </p>
                        <p className="text-[11px] text-brand-muted truncate">
                          Penulis: {book.author} • {book.rack_location || 'Rak Utama'}
                        </p>
                      </div>
                      <div className="shrink-0 flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            (book.status || '').toLowerCase().includes('tersedia')
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {book.status || 'Tersedia'}
                        </span>
                        <ExternalLink size={12} className="text-brand-muted group-hover:text-brand-maroon" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* KATEGORI 2: MENU KEDAI & PESANAN */}
            {(results.menus.length > 0 || results.orders.length > 0) && (
              <div className="space-y-1.5 pt-1 border-t border-brand-cream-accent/40">
                <div className="flex items-center justify-between px-1 text-[11px] font-bold text-brand-muted uppercase tracking-wider">
                  <span className="flex items-center gap-1.5 text-amber-700">
                    <Coffee size={13} /> Menu Kedai &amp; Pesanan ({results.menus.length + results.orders.length})
                  </span>
                  <button
                    type="button"
                    onClick={() => navigateTo('/kedai')}
                    className="text-brand-muted hover:text-brand-maroon transition-colors"
                  >
                    Kelola Kedai
                  </button>
                </div>

                {/* Sub: Menu Items */}
                {results.menus.length > 0 && (
                  <div className="space-y-1">
                    {results.menus.slice(0, 3).map((menu) => (
                      <div
                        key={`menu-${menu.id}`}
                        onClick={() => navigateTo('/kedai')}
                        className="group flex items-center justify-between p-2 rounded-xl hover:bg-brand-cream/60 transition-colors cursor-pointer border border-transparent hover:border-brand-cream-accent"
                      >
                        <div className="flex-1 min-w-0 pr-2">
                          <p className="text-xs font-semibold text-brand-text truncate group-hover:text-brand-maroon transition-colors">
                            {menu.name}
                          </p>
                          <p className="text-[11px] text-brand-muted truncate">
                            {menu.category} • Rp {Number(menu.price).toLocaleString('id-ID')}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            menu.status === 'Habis'
                              ? 'bg-red-50 text-red-600 border border-red-200'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          {menu.status || 'Tersedia'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Sub: Orders */}
                {results.orders.length > 0 && (
                  <div className="space-y-1 pt-1">
                    {results.orders.slice(0, 3).map((order) => (
                      <div
                        key={`order-${order.id}`}
                        onClick={() => navigateTo('/kedai')}
                        className="group flex items-center justify-between p-2 rounded-xl bg-brand-cream/30 hover:bg-brand-cream/80 transition-colors cursor-pointer border border-brand-cream-accent/60"
                      >
                        <div className="flex-1 min-w-0 pr-2">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-[10px] font-bold text-brand-maroon">
                              #{order.id}
                            </span>
                            <span className="text-[10px] font-semibold text-brand-text">
                              ({order.table_number})
                            </span>
                          </div>
                          <p className="text-[11px] text-brand-muted truncate">
                            {order.items}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-[11px] font-bold text-brand-maroon">{order.total}</p>
                          <span
                            className={`inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.2 rounded capitalize ${
                              order.status === 'disiapkan'
                                ? 'bg-amber-100 text-amber-700'
                                : order.status === 'selesai'
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}
                          >
                            <Clock size={9} /> {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* KATEGORI 3: AGENDA & TIKET */}
            {results.events.length > 0 && (
              <div className="space-y-1.5 pt-1 border-t border-brand-cream-accent/40">
                <div className="flex items-center justify-between px-1 text-[11px] font-bold text-brand-muted uppercase tracking-wider">
                  <span className="flex items-center gap-1.5 text-purple-700">
                    <Calendar size={13} /> Agenda &amp; Tiket ({results.events.length})
                  </span>
                  <button
                    type="button"
                    onClick={() => navigateTo('/agenda')}
                    className="text-brand-muted hover:text-brand-maroon transition-colors"
                  >
                    Buka Agenda
                  </button>
                </div>
                <div className="space-y-1">
                  {results.events.slice(0, 3).map((event) => (
                    <div
                      key={event.id}
                      onClick={() => navigateTo('/agenda')}
                      className="group flex items-center justify-between p-2 rounded-xl hover:bg-brand-cream/60 transition-colors cursor-pointer border border-transparent hover:border-brand-cream-accent"
                    >
                      <div className="flex-1 min-w-0 pr-2">
                        <p className="text-xs font-semibold text-brand-text truncate group-hover:text-brand-maroon transition-colors">
                          {event.title}
                        </p>
                        <p className="text-[11px] text-brand-muted truncate">
                          {event.date} • {event.time} • {event.location}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                          {Number(event.price) === 0 ? 'Gratis' : `Rp ${Number(event.price).toLocaleString('id-ID')}`}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* KATEGORI 4: ANGGOTA / MEMBER */}
            {results.users.length > 0 && (
              <div className="space-y-1.5 pt-1 border-t border-brand-cream-accent/40">
                <div className="flex items-center justify-between px-1 text-[11px] font-bold text-brand-muted uppercase tracking-wider">
                  <span className="flex items-center gap-1.5 text-blue-700">
                    <Users size={13} /> Anggota / Member ({results.users.length})
                  </span>
                  <button
                    type="button"
                    onClick={() => navigateTo('/anggota')}
                    className="text-brand-muted hover:text-brand-maroon transition-colors"
                  >
                    Kelola Member
                  </button>
                </div>
                <div className="space-y-1">
                  {results.users.slice(0, 3).map((user) => (
                    <div
                      key={user.id}
                      onClick={() => navigateTo('/anggota')}
                      className="group flex items-center justify-between p-2 rounded-xl hover:bg-brand-cream/60 transition-colors cursor-pointer border border-transparent hover:border-brand-cream-accent"
                    >
                      <div className="flex-1 min-w-0 pr-2">
                        <p className="text-xs font-semibold text-brand-text truncate group-hover:text-brand-maroon transition-colors">
                          {user.name}
                        </p>
                        <p className="text-[11px] text-brand-muted truncate">
                          {user.email} {user.phone ? `• ${user.phone}` : ''}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          user.role === 'admin'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}
                      >
                        {user.role}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer Panel */}
          {hasAnyResults && (
            <div className="p-2.5 border-t border-brand-cream-accent bg-brand-cream/30 flex items-center justify-between text-[11px] text-brand-muted">
              <span>Tekan <kbd className="px-1 py-0.5 bg-white border border-brand-cream-accent rounded text-[10px] font-mono">Enter</kbd> untuk hasil lengkap</span>
              <span><kbd className="px-1 py-0.5 bg-white border border-brand-cream-accent rounded text-[10px] font-mono">Esc</kbd> menutup</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
