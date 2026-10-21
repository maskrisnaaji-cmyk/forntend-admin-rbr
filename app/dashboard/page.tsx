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
      <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
        {/* Banner Welcome Maroon */}
        <HeroBanner />

        {/* 4 Stat Cards */}
        <DashboardStats />

        {/* Seksi Grafik Analisis Keuangan */}
        <FinancialChart />

        {/* 2 Panel Utama: Pesanan Aktif & Event Okupansi */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <ActiveOrders />
          <EventOccupancy />
        </div>
      </div>
    </AdminLayout>
  );
}
