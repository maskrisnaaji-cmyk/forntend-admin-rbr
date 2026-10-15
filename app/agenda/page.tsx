"use client";

import { AdminLayout } from '@/components/AdminLayout';
import { AgendaView } from '@/components/views/AgendaView';

export default function AgendaPage() {
  return (
    <AdminLayout activeTab="agenda">
      <AgendaView />
    </AdminLayout>
  );
}
