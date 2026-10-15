"use client";

import { AdminLayout } from '@/components/AdminLayout';
import { PustakaView } from '@/components/views/PustakaView';

export default function PustakaPage() {
  return (
    <AdminLayout activeTab="pustaka">
      <PustakaView />
    </AdminLayout>
  );
}
