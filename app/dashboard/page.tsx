"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  LogOut,
  TrendingUp,
  Calendar
} from 'lucide-react';

// Import 5 Halaman View Utama
import { KedaiView } from '@/components/views/KedaiView';
import { AgendaView } from '@/components/views/AgendaView';
import { PustakaView } from '@/components/views/PustakaView';
import { AnggotaView } from '@/components/views/AnggotaView';
import { PengaturanView } from '@/components/views/PengaturanView';

export default function DashboardPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Periksa status otentikasi admin dari sessionStorage
  useEffect(() => {
    const authStatus = sessionStorage.getItem('admin_logged_in');
    if (authStatus !== 'true') {
      setIsLoggedIn(false);
      router.replace('/login');
    } else {
      setIsLoggedIn(true);
      setIsLoading(false);
    }
  }, [router]);

  // Handler saat admin melakukan logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    // Bersihkan seluruh data sesi di sessionStorage
    sessionStorage.clear();
    // Bersihkan juga sisa sesi localStorage jika ada
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_logged_in');
    }
    router.push('/login');
  };

  // Tampilan loading saat verifikasi status login
  if (isLoading || !isLoggedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FDFBF7]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#6B1D2F] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-brand-cream">
      {/* Sidebar Navigasi dengan integrasi tombol keluar */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={handleLogout} 
      />

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
              className="flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-100 transition-colors cursor-pointer"
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

            {/* Seksi Grafik Analisis Keuangan */}
            <div className="mb-8 rounded-2xl border border-brand-cream-accent bg-white p-6 shadow-sm">
              {/* Header Card: Judul, Keterangan, dan Tombol Filter */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-brand-text">Trend Omset &amp; Analisis Keuangan</h3>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-200">
                      <TrendingUp size={11} /> Naik
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-brand-muted">
                    Grafik perbandingan pendapatan Kedai Kopi &amp; Tiket Event (Status: Untung / Naik)
                  </p>
                </div>

                {/* Tombol Filter Kanan Atas: Pill "Bulan Ini" */}
                <div className="flex items-center gap-2">
                  <div className="inline-flex rounded-full bg-[#FDFBF7] p-1 border border-brand-cream-accent">
                    <button className="flex items-center gap-1.5 rounded-full bg-[#6B1D2F] px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[#581625]">
                      <Calendar size={13} />
                      <span>Bulan Ini</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Indikator Angka Ringkas &amp; Legend */}
              <div className="mt-5 mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-brand-cream-accent/60 pb-5">
                <div className="flex flex-wrap items-center gap-6">
                  {/* Total Omset */}
                  <div>
                    <span className="text-[11px] font-medium uppercase tracking-wider text-brand-muted">Total Omset</span>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-2xl font-extrabold text-brand-text">Rp 45.850.000</span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-600 border border-emerald-100">
                        <TrendingUp size={12} />
                        +14.2% Untung
                      </span>
                    </div>
                  </div>

                  <div className="hidden h-10 w-px bg-brand-cream-accent sm:block" />

                  {/* Laba Bersih */}
                  <div>
                    <span className="text-[11px] font-medium uppercase tracking-wider text-brand-muted">Laba Bersih</span>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-2xl font-extrabold text-[#6B1D2F]">Rp 17.650.000</span>
                      <span className="inline-flex items-center rounded-full bg-[#FDFBF7] px-2.5 py-0.5 text-[11px] font-bold text-[#6B1D2F] border border-amber-300">
                        Margin 38.5%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Legend Grafik */}
                <div className="flex items-center gap-5 text-xs font-medium">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-[#6B1D2F] shadow-sm" />
                    <span className="font-semibold text-brand-text">Omset Kedai Kopi</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-[#D4AF37] shadow-sm" />
                    <span className="font-semibold text-brand-text">Tiket Event Budaya</span>
                  </div>
                </div>
              </div>

              {/* Visual Grafik Garis/Area (Line Chart) */}
              <div className="relative w-full overflow-x-auto">
                <div className="min-w-sm">
                  <svg viewBox="0 0 840 230" className="w-full h-56 select-none overflow-visible">
                    <defs>
                      {/* Gradient Maroon Kedai Kopi */}
                      <linearGradient id="maroonGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6B1D2F" stopOpacity="0.28" />
                        <stop offset="100%" stopColor="#6B1D2F" stopOpacity="0.0" />
                      </linearGradient>
                      {/* Gradient Gold Tiket Event */}
                      <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.32" />
                        <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Sumbu Y Horizontal Grid Lines &amp; Skala Rupiah (0 - 50M) */}
                    {[
                      { val: 'Rp 50M', y: 20 },
                      { val: 'Rp 40M', y: 53 },
                      { val: 'Rp 30M', y: 86 },
                      { val: 'Rp 20M', y: 119 },
                      { val: 'Rp 10M', y: 152 },
                      { val: 'Rp 0', y: 185 },
                    ].map((tick) => (
                      <g key={tick.val}>
                        <line
                          x1="65"
                          y1={tick.y}
                          x2="820"
                          y2={tick.y}
                          stroke="#E8DFD5"
                          strokeDasharray="4 4"
                          strokeWidth="1"
                        />
                        <text
                          x="55"
                          y={tick.y + 4}
                          textAnchor="end"
                          className="fill-brand-muted text-[11px] font-medium"
                        >
                          {tick.val}
                        </text>
                      </g>
                    ))}

                    {/* Area Gradien Kedai Kopi */}
                    <path
                      d="M 80,126 C 135,115 150,106 200,106 C 260,106 270,112 325,112 C 385,112 400,83 450,83 C 510,83 525,93 575,93 C 635,93 650,56 700,56 C 760,56 770,34 810,34 L 810,185 L 80,185 Z"
                      fill="url(#maroonGradient)"
                    />

                    {/* Area Gradien Tiket Event Budaya */}
                    <path
                      d="M 80,165 C 135,155 150,149 200,149 C 260,149 270,132 325,132 C 385,132 400,139 450,139 C 510,139 525,109 575,109 C 635,109 650,116 700,116 C 760,116 770,89 810,89 L 810,185 L 80,185 Z"
                      fill="url(#goldGradient)"
                    />

                    {/* Garis Tren Tiket Event Budaya (Gold #D4AF37) */}
                    <path
                      d="M 80,165 C 135,155 150,149 200,149 C 260,149 270,132 325,132 C 385,132 400,139 450,139 C 510,139 525,109 575,109 C 635,109 650,116 700,116 C 760,116 770,89 810,89"
                      fill="none"
                      stroke="#D4AF37"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />

                    {/* Garis Tren Omset Kedai Kopi (Maroon #6B1D2F) */}
                    <path
                      d="M 80,126 C 135,115 150,106 200,106 C 260,106 270,112 325,112 C 385,112 400,83 450,83 C 510,83 525,93 575,93 C 635,93 650,56 700,56 C 760,56 770,34 810,34"
                      fill="none"
                      stroke="#6B1D2F"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />

                    {/* Data Points Kedai Kopi (#6B1D2F) */}
                    {[
                      { x: 80, y: 126 },
                      { x: 200, y: 106 },
                      { x: 325, y: 112 },
                      { x: 450, y: 83 },
                      { x: 575, y: 93 },
                      { x: 700, y: 56 },
                      { x: 810, y: 34 },
                    ].map((pt, idx) => (
                      <circle
                        key={`kedai-${idx}`}
                        cx={pt.x}
                        cy={pt.y}
                        r={idx === 6 ? 5 : 3.5}
                        fill="#6B1D2F"
                        stroke="#FFFFFF"
                        strokeWidth={idx === 6 ? 2.5 : 2}
                      />
                    ))}

                    {/* Data Points Tiket Event (#D4AF37) */}
                    {[
                      { x: 80, y: 165 },
                      { x: 200, y: 149 },
                      { x: 325, y: 132 },
                      { x: 450, y: 139 },
                      { x: 575, y: 109 },
                      { x: 700, y: 116 },
                      { x: 810, y: 89 },
                    ].map((pt, idx) => (
                      <circle
                        key={`event-${idx}`}
                        cx={pt.x}
                        cy={pt.y}
                        r={idx === 6 ? 5 : 3.5}
                        fill="#D4AF37"
                        stroke="#FFFFFF"
                        strokeWidth={idx === 6 ? 2.5 : 2}
                      />
                    ))}

                    {/* Sumbu X (1 Oct - 30 Oct) */}
                    {[
                      { date: '1 Oct', x: 80 },
                      { date: '5 Oct', x: 200 },
                      { date: '10 Oct', x: 325 },
                      { date: '15 Oct', x: 450 },
                      { date: '20 Oct', x: 575 },
                      { date: '25 Oct', x: 700 },
                      { date: '30 Oct', x: 810 },
                    ].map((item) => (
                      <text
                        key={item.date}
                        x={item.x}
                        y={208}
                        textAnchor="middle"
                        className="fill-brand-muted text-[11px] font-medium"
                      >
                        {item.date}
                      </text>
                    ))}
                  </svg>
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
                  <button onClick={() => router.push('/kedai')} className="text-xs font-bold text-brand-maroon hover:underline cursor-pointer">Lihat Semua Order</button>
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
