"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoginView from '@/components/views/LoginView';

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    // Bersihkan sisa sesi lama di localStorage agar tidak bocor ke sesi baru
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_logged_in');
    }
  }, []);

  const handleLoginSuccess = () => {
    // Simpan tanda login ke sessionStorage (sesi tab/browser)
    sessionStorage.setItem('admin_logged_in', 'true');
    // Arahkan masuk ke dashboard
    router.push('/dashboard');
  };

  return <LoginView onLoginSuccess={handleLoginSuccess} />;
}
