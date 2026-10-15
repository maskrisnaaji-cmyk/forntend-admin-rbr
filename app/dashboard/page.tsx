"use client";

import { AdminLayout } from '@/components/AdminLayout';
import { DashboardView } from '@/components/views/DashboardView';

export default function DashboardPage() {
  return (
    <AdminLayout activeTab="dashboard">
      <DashboardView />
    </AdminLayout>
  );
}
