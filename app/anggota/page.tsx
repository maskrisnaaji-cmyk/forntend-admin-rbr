"use client";

import { AdminLayout } from '@/components/AdminLayout';
import { AnggotaView } from '@/components/views/AnggotaView';

export default function AnggotaPage() {
  return (
    <AdminLayout activeTab="anggota">
      <AnggotaView />
    </AdminLayout>
  );
}
