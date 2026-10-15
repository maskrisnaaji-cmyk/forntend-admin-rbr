"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';
import { Search, Bell, LogOut, Menu } from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  activeTab: string;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, activeTab }) => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

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
    <div className="min-h-screen bg-brand-cream relative">
      {/* Mobile Drawer Backdrop */}
      {isMobileSidebarOpen && (
        <div 
          onClick={() => setIsMobileSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-xs lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Navigasi (Responsive: fixed di desktop, drawer di mobile/tablet) */}
      <Sidebar 
        activeTab={activeTab} 
        onLogout={handleLogout} 
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Area Konten Utama (Responsive margin & padding) */}
      <div className="lg:ml-64 flex flex-col min-h-screen transition-all duration-300">
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {/* Top Navbar Header */}
          <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              {/* Tombol Hamburger Menu Mobile */}
              <button
                type="button"
                onClick={() => setIsMobileSidebarOpen(true)}
                className="lg:hidden rounded-xl border border-brand-cream-accent bg-white p-2 text-brand-text hover:text-brand-maroon hover:bg-brand-cream-card transition-colors cursor-pointer"
                title="Buka Menu Navigasi"
              >
                <Menu size={18} />
              </button>

              <div className="flex items-center gap-2 text-xs text-brand-muted">
                <span className="hidden sm:inline">Pusat Kendali Operasional</span>
                <span className="hidden sm:inline">/</span>
                <span className="font-semibold text-brand-maroon capitalize">{activeTab}</span>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-2.5 sm:gap-4">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-3 top-2.5 text-brand-muted" size={15} />
                <input 
                  type="text" 
                  placeholder="Cari transaksi, pesanan..." 
                  className="w-full sm:w-56 md:w-64 rounded-xl border border-brand-cream-accent bg-white py-2 pl-9 pr-3 text-xs text-brand-text focus:border-brand-maroon focus:outline-none"
                />
              </div>
              <button 
                type="button"
                className="rounded-xl border border-brand-cream-accent bg-white p-2 text-brand-muted transition-colors hover:text-brand-maroon hover:bg-brand-cream-card cursor-pointer"
                title="Notifikasi"
              >
                <Bell size={17} />
              </button>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-2.5 sm:px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-100 transition-colors cursor-pointer"
                title="Keluar dari akun admin"
              >
                <LogOut size={15} />
                <span className="hidden sm:inline">Keluar</span>
              </button>
            </div>
          </header>

          {/* Isi Halaman Modul View */}
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
