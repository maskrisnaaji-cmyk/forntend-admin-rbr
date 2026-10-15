"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';
import { Search, Bell, LogOut } from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  activeTab: string;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, activeTab }) => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
    sessionStorage.clear();
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
      {/* Sidebar Navigasi */}
      <Sidebar activeTab={activeTab} onLogout={handleLogout} />

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

        {/* Isi Halaman Modul View */}
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
