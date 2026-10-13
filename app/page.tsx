"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Bersihkan sisa sesi lama jika ada di localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_logged_in');
    }
    // Setiap kali root (http://localhost:3000) diakses, SELALU arahkan ke halaman Login terlebih dahulu
    router.replace('/login');
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FDFBF7]">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#6B1D2F] border-t-transparent" />
    </div>
  );
}