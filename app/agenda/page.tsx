import React from 'react';
import type { Metadata } from 'next';
import { AdminLayout } from '@/components/AdminLayout';
import { AgendaContent } from './components/AgendaContent';

export const metadata: Metadata = {
  title: 'Agenda & Tiket Budaya',
  description:
    'Kelola jadwal pementasan, lokakarya, kuota pengunjung, dan reservasi tiket Rumah Budaya Ratna.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AgendaPage() {
  return (
    <AdminLayout activeTab="agenda">
      <AgendaContent />
    </AdminLayout>
  );
}
