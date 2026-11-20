"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { HeroBanner } from "./components/hero";
import { DashboardStats, KedaiRevenue, TicketsSold, BorrowedBooks, TotalMembers } from "./components/DashboardStats";
import { FinancialChart, ChartDataPoint, RangeOption } from "./components/dataanalis";
import { ActiveOrders, ActiveOrder } from "./components/ActiveOrders";
import { EventOccupancy, EventOccupancyItem } from "./components/EventOccupancy";

interface DashboardData {
  kedaiRevenue: KedaiRevenue;
  ticketsSold: TicketsSold;
  borrowedBooks: BorrowedBooks;
  totalMembers: TotalMembers;
  range: string;
  totalChartOmset: number;
  totalChartOmsetFormatted: string;
  chartData: ChartDataPoint[];
  activeOrders: ActiveOrder[];
  eventOccupancy: EventOccupancyItem[];
}

const API_BASE = "http://localhost:5000";
const POLL_INTERVAL = 6000; // 6 detik

export default function DashboardPage() {
  const [range, setRange] = useState<RangeOption>("month");
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch data dari endpoint GET /api/dashboard/summary?range=${range}
  const fetchDashboardData = useCallback(async (selectedRange: RangeOption, showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/dashboard/summary?range=${selectedRange}`, {
        cache: 'no-store',
      });
      if (res.ok) {
        const json = await res.json();
        const payload: DashboardData = json.data ?? json;
        setData(payload);
      }
    } catch (err) {
      console.error("Gagal mengambil data dashboard real-time:", err);
    } finally {
      if (showLoading) setLoading(false);
    }
  }, []);

  // Initial fetch & Polling background setiap 6 detik
  useEffect(() => {
    fetchDashboardData(range, true);

    const intervalId = setInterval(() => {
      fetchDashboardData(range, false);
    }, POLL_INTERVAL);

    return () => clearInterval(intervalId);
  }, [range, fetchDashboardData]);

  // Handler saat filter rentang waktu grafik diubah
  const handleRangeChange = (newRange: RangeOption) => {
    setRange(newRange);
  };

  return (
    <AdminLayout activeTab="dashboard">
      <div className="space-y-6 sm:space-y-8">
        {/* Seksi 1: Banner Welcome Maroon (+ Tambah Agenda & Kelola Kedai) */}
        <section aria-label="Selamat Datang" className="stagger-item stagger-0">
          <HeroBanner />
        </section>

        {/* Seksi 2: 4 Stat Cards Real-time */}
        <section aria-label="Statistik Operasional Terpadu">
          <DashboardStats
            kedaiRevenue={data?.kedaiRevenue}
            ticketsSold={data?.ticketsSold}
            borrowedBooks={data?.borrowedBooks}
            totalMembers={data?.totalMembers}
            loading={loading && !data}
          />
        </section>

        {/* Seksi 3: Grafik Analisis Keuangan & Omset dengan Dropdown Interaktif */}
        <section aria-label="Analisis Omset dan Transaksi" className="stagger-item stagger-5">
          <FinancialChart
            chartData={data?.chartData ?? []}
            totalChartOmset={data?.totalChartOmset ?? 0}
            totalChartOmsetFormatted={data?.totalChartOmsetFormatted ?? "Rp 0"}
            selectedRange={range}
            onRangeChange={handleRangeChange}
            loading={loading && !data}
          />
        </section>

        {/* Seksi 4: 2 Panel Utama: Pesanan Aktif Kedai & Okupansi Event */}
        <section
          aria-label="Aktivitas Pesanan dan Okupansi Acara"
          className="stagger-item stagger-6 grid grid-cols-1 lg:grid-cols-12 gap-6"
        >
          <ActiveOrders
            activeOrders={data?.activeOrders ?? []}
            loading={loading && !data}
          />
          <EventOccupancy
            eventOccupancy={data?.eventOccupancy ?? []}
            loading={loading && !data}
          />
        </section>
      </div>
    </AdminLayout>
  );
}
