"use client";

import { AdminLayout } from '@/components/AdminLayout';
import { PengaturanView } from '@/components/views/PengaturanView';

export default function PengaturanPage() {
  return (
    <AdminLayout activeTab="pengaturan">
      <PengaturanView />
    </AdminLayout>
  );
}
