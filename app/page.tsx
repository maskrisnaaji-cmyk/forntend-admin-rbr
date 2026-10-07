"use client";

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { 
  Coffee, 
  Ticket, 
  BookOpen, 
  Users, 
  Plus, 
  FileText, 
  Search, 
  Bell, 
  Clock,
  LogOut 
} from 'lucide-react';

// Import View Login Admin Web
import LoginView from '@/components/views/LoginView';

// Import 5 Halaman View Utama
import { KedaiView } from '@/components/views/KedaiView';
import { AgendaView } from '@/components/views/AgendaView';
import { PustakaView } from '@/components/views/PustakaView';
import { AnggotaView } from '@/components/views/AnggotaView';
import { PengaturanView } from '@/components/views/PengaturanView';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Periksa status login dari localStorage saat pertama kali halaman dimuat
  useEffect(() => {
    const authStatus = localStorage.getItem('admin_logged_in');
    if (authStatus === 'true') {
      setIsLoggedIn(true);
    }
    setIsLoading(false);
  }, []);

  // Handler saat berhasil login di LoginView
  const handleLoginSuccess = () => {
    localStorage.setItem('admin_logged_in', 'true');
    setIsLoggedIn(true);
  };

  // Handler saat admin melakukan logout
  const handleLogout = () => {
    localStorage.removeItem('admin_logged_in');
    setIsLoggedIn(false);
  };

  // 1. TAMPILAN LOADING SAAT CEK SESI
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-cream">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-maroon border-t-transparent" />
      </div>
    );
  }

  // 2. JIKA BELUM LOGIN: Tampilkan Halaman Login Admin Web Saja
  if (!isLoggedIn) {
    return <LoginView onLoginSuccess={handleLoginSuccess} />;
  }

  // 3. JIKA SUDAH LOGIN: Tampilkan Seluruh Dashboard Utama Admin
  return (
    <div className="flex min-h-screen bg-brand-cream">
      {/* Sidebar Navigasi */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Area Konten Utama */}
      <main className="ml-64 flex-1 p-8">
        
        {/* Top Navbar Header */}
        <header className="mb-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs text-brand-muted">
              <span>Pusat Kendali Operasional</span>
              <span>/</span>
              <span className="font-semibold text-brand-maroon capitalize">{activeTab}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-brand-muted" size={16} />
              <input 
                type="text" 
                placeholder="Cari transaksi, pesanan, agenda..." 
                className="w-64 rounded-xl border border-brand-cream-accent bg-white py-2 pl-9 pr-4 text-xs text-brand-text focus:border-brand-maroon focus:outline-none"
              />
            </div>
            <button className="rounded-xl border border-brand-cream-accent bg-white p-2 text-brand-muted transition-colors hover:text-brand-maroon">
              <Bell size={18} />
            </button>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-100 transition-colors"
              title="Keluar dari akun admin"
            >
              <LogOut size={16} />
              <span>Keluar</span>
            </button>
          </div>
        </header>

        {/* KONTEN DINAMIS BERDASARKAN SIDEBAR */}
        {activeTab === 'dashboard' && (
          <>
            {/* Banner Welcome Maroon */}
            <div className="relative mb-6 flex items-center justify-between overflow-hidden rounded-2xl bg-brand-maroon p-6 text-white shadow-lg">
              <div className="relative z-10">
                <h1 className="mb-1 text-2xl font-bold">Sugeng Rawuh, Admin Rumah Budaya</h1>
                <p className="max-w-xl text-xs leading-relaxed text-white/80">
                  Pantau seluruh operasional Kedai Kopi, pemesanan Tiket Acara, peminjaman Pustaka Naskah, dan verifikasi anggota dalam satu panel terpadu.
                </p>
              </div>
              <div className="relative z-10 flex items-center gap-3">
                <button className="flex items-center gap-2 rounded-xl bg-brand-gold px-4 py-2.5 text-xs font-bold text-brand-maroon shadow transition-colors hover:bg-amber-400">
                  <Plus size={16} />
                  <span>Tambah Agenda Baru</span>
                </button>
                <button className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-medium text-white transition-colors hover:bg-white/20">
                  <FileText size={16} />
                  <span>Cetak Laporan</span>
                </button>
              </div>
            </div>

            {/* 4 Stat Cards */}
            <div className="mb-8 grid grid-cols-4 gap-4">
              <div className="flex items-center justify-between rounded-2xl border border-brand-cream-accent bg-white p-5 shadow-sm">
                <div>
                  <span className="text-[11px] font-medium uppercase tracking-wider text-brand-muted">Total Omset Kedai</span>
                  <h2 className="mt-1 text-xl font-extrabold text-brand-text">Rp 3.420.000</h2>
                  <span className="mt-1 inline-block rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">+12% hari ini</span>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-100 bg-amber-50 text-brand-maroon">
                  <Coffee size={22} />
                </div>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-brand-cream-accent bg-white p-5 shadow-sm">
                <div>
                  <span className="text-[11px] font-medium uppercase tracking-wider text-brand-muted">Tiket Terjual</span>
                  <h2 className="mt-1 text-xl font-extrabold text-brand-text">85 Tiket</h2>
                  <span className="mt-1 block text-[10px] text-brand-muted">3 Event Aktif Minggu Ini</span>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-rose-100 bg-rose-50 text-brand-maroon">
                  <Ticket size={22} />
                </div>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-brand-cream-accent bg-white p-5 shadow-sm">
                <div>
                  <span className="text-[11px] font-medium uppercase tracking-wider text-brand-muted">Buku Terpinjam</span>
                  <h2 className="mt-1 text-xl font-extrabold text-brand-text">18 Judul</h2>
                  <span className="mt-1 block text-[10px] text-brand-muted">Rata-rata pinjam 4 hari</span>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-100 bg-amber-50 text-amber-700">
                  <BookOpen size={22} />
                </div>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-brand-cream-accent bg-white p-5 shadow-sm">
                <div>
                  <span className="text-[11px] font-medium uppercase tracking-wider text-brand-muted">Member Baru</span>
                  <h2 className="mt-1 text-xl font-extrabold text-brand-text">128 Member</h2>
                  <span className="mt-1 inline-block rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">+18 bulan ini</span>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-700">
                  <Users size={22} />
                </div>
              </div>
            </div>

            {/* 2 Panel Utama */}
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-7 rounded-2xl border border-brand-cream-accent bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-brand-text">Pesanan Aktif Kedai Kopi</h3>
                    <p className="text-xs text-brand-muted">Monitor antrean dapur & barista secara real-time</p>
                  </div>
                  <button onClick={() => setActiveTab('kedai')} className="text-xs font-bold text-brand-maroon hover:underline">Lihat Semua Order</button>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-xl border border-brand-cream-accent bg-brand-cream-card p-4">
                    <div>
                      <div className="mb-1 flex items-center gap-2">
                        <span className="rounded bg-brand-maroon px-2 py-0.5 text-xs font-bold text-white">Meja 04</span>
                        <span className="text-xs font-semibold text-brand-text">Order #RBR-1042</span>
                      </div>
                      <p className="text-xs text-brand-muted">1x Kopi Susu Creamy Gula Aren, 1x Americano Origin, 1x Pisang Goreng</p>
                      <p className="mt-1 text-xs font-extrabold text-brand-maroon">Rp 65.000</p>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-[11px] font-bold text-amber-700">
                        <Clock size={12} /> Disiapkan Barista
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-span-5 rounded-2xl border border-brand-cream-accent bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-brand-text">Event & Okupansi</h3>
                    <p className="text-xs text-brand-muted">Status kuota tiket agenda mendatang</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-xl border border-brand-cream-accent bg-brand-cream-card p-4">
                    <div className="mb-2 flex items-start justify-between">
                      <div>
                        <span className="rounded bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-brand-maroon">SABTU, 28 SEP</span>
                        <h4 className="mt-1 text-xs font-bold text-brand-text">Prasasti Trowulan Pak Rangkuti</h4>
                        <p className="text-[10px] text-brand-muted">Sesi Diskusi Naskah & Artefak</p>
                      </div>
                      <span className="text-xs font-extrabold text-brand-maroon">85%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-brand-cream-accent">
                      <div className="h-full rounded-full bg-brand-maroon w-[85%]"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* TAMPILAN PER MENU */}
        {activeTab === 'kedai' && <KedaiView />}
        {activeTab === 'agenda' && <AgendaView />}
        {activeTab === 'pustaka' && <PustakaView />}
        {activeTab === 'anggota' && <AnggotaView />}
        {activeTab === 'pengaturan' && <PengaturanView />}

      </main>
    </div>
  );
}