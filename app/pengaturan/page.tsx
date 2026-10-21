"use client";

import React from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { OperationalSettingsForm } from './components/OperationalSettingsForm';

export default function PengaturanPage() {
  return (
    <AdminLayout activeTab="pengaturan">
      <div className="max-w-3xl space-y-6">
        <div>
          <h1 className="text-xl font-bold text-brand-text">Pengaturan Sistem</h1>
          <p className="text-xs text-brand-muted">
            Atur informasi operasional Rumah Budaya Ratna dan preferensi admin
          </p>
        </div>

        <OperationalSettingsForm />
      </div>
    </AdminLayout>
  );
}
