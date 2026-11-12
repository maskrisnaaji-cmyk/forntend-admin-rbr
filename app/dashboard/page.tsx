"use client";

import React from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { HeroBanner } from './components/hero';
import { DashboardStats } from './components/DashboardStats';
import { FinancialChart } from './components/dataanalis';
import { ActiveOrders } from './components/ActiveOrders';
import { EventOccupancy } from './components/EventOccupancy';

export default function DashboardPage() {
  return (
    <AdminLayout activeTab="dashboard">
      <div className="space-y-6 sm:space-y-8">
        {/* Seksi 1: Banner Welcome Maroon (Stagger 1) */}
        <div className="stagger-item stagger-1">
          <HeroBanner />
        </div>

        {/* Seksi 2: 4 Stat Cards Ringkasan Operasional (Stagger 2) */}
        <div className="stagger-item stagger-2">
          <DashboardStats />
        </div>

        {/* Seksi 3: Grafik Analisis Keuangan & Omset (Stagger 3) */}
        <div className="stagger-item stagger-3">
          <FinancialChart />
        </div>

        {/* Seksi 4: 2 Panel Utama: Pesanan Aktif & Event Okupansi (Stagger 4) */}
        <div className="stagger-item stagger-4 grid grid-cols-1 lg:grid-cols-12 gap-6">
          <ActiveOrders />
          <EventOccupancy />
        </div>
      </div>
    </AdminLayout>
  );
}
