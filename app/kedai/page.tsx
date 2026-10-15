"use client";

import { AdminLayout } from '@/components/AdminLayout';
import { KedaiView } from '@/components/views/KedaiView';

export default function KedaiPage() {
  return (
    <AdminLayout activeTab="kedai">
      <KedaiView />
    </AdminLayout>
  );
}
