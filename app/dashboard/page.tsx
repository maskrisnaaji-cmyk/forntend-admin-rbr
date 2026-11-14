import React from "react";
import type { Metadata } from "next";
import { AdminLayout } from "@/components/AdminLayout";
import { HeroBanner } from "./components/hero";
import { DashboardStats } from "./components/DashboardStats";
import { FinancialChart } from "./components/dataanalis";
import { ActiveOrders } from "./components/ActiveOrders";
import { EventOccupancy } from "./components/EventOccupancy";

export const metadata: Metadata = {
  title: "Dashboard Overview",
  description:
    "Pantau metrik penjualan kedai, peminjaman pustaka naskah, okupansi tiket agenda budaya, dan ringkasan keanggotaan Rumah Budaya Ratna.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardPage() {
  return (
    <AdminLayout activeTab="dashboard">
      <div className="space-y-6 sm:space-y-8">
        {/* Seksi 1: Banner Welcome Maroon — muncul pertama (delay 0ms) */}
        <section aria-label="Selamat Datang" className="stagger-item stagger-0">
          <HeroBanner />
        </section>

        {/* Seksi 2: 4 Stat Cards — stagger cascading per kartu (100ms, 200ms, 300ms, 400ms) */}
        <section aria-label="Statistik Operasional Terpadu">
          <DashboardStats />
        </section>

        {/* Seksi 3: Grafik Analisis Keuangan & Omset (delay 500ms) */}
        <section aria-label="Analisis Omset dan Transaksi" className="stagger-item stagger-5">
          <FinancialChart />
        </section>

        {/* Seksi 4: 2 Panel Utama: Pesanan Aktif & Event Okupansi (delay 600ms) */}
        <section
          aria-label="Aktivitas Pesanan dan Okupansi Acara"
          className="stagger-item stagger-6 grid grid-cols-1 lg:grid-cols-12 gap-6"
        >
          <ActiveOrders />
          <EventOccupancy />
        </section>
      </div>
    </AdminLayout>
  );
}
