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
        const PAID_STATUSES = ['paid', 'settlement', 'capture', 'success', 'lunas'];

        // Cek transaksi tiket lunas real-time dari API orders
        let paidTicketCount = 0;
        let paidTicketRevenue = 0;
        const paidTicketPerEvent: Record<number, number> = {};

        try {
          const resOrders = await fetch(`${API_BASE}/api/orders`, { cache: 'no-store' });
          if (resOrders.ok) {
            const ordersJson = await resOrders.json();
            const orderList = Array.isArray(ordersJson) ? ordersJson : (ordersJson.data ?? []);
            for (const ord of orderList) {
              const payStatus = String(ord.payment_status || ord.status || '').toLowerCase().trim();
              if (PAID_STATUSES.includes(payStatus) && ord.event_id) {
                const evId = Number(ord.event_id);
                const qty = Number(ord.quantity ?? ord.qty ?? 1);
                const price = Number(ord.total_price ?? ord.amount ?? 0);
                paidTicketCount += qty;
                paidTicketRevenue += price;
                paidTicketPerEvent[evId] = (paidTicketPerEvent[evId] || 0) + qty;
              }
            }
          }
        } catch (_) {}

        // Reset tiket terjual dan omset tiket ke angka murni real-time dari transaksi lunas
        if (payload.ticketsSold) {
          payload.ticketsSold = {
            ...payload.ticketsSold,
            total: paidTicketCount,
            formatted: `${paidTicketCount} Tiket`,
            subtitle: `${payload.ticketsSold.activeEventsCount || 0} Event Aktif Kuota Tersedia`,
          };
        }

        // Sinkronkan panel Event & Okupansi agar booked_count dihitung dari transaksi lunas
        if (Array.isArray(payload.eventOccupancy)) {
          payload.eventOccupancy = payload.eventOccupancy.map((item) => {
            const realBooked = paidTicketPerEvent[item.id] || 0;
            const pct = item.quota > 0 ? Math.min(100, Math.round((realBooked / item.quota) * 100)) : 0;
            return {
              ...item,
              booked_count: realBooked,
              percentage: pct,
              status: pct >= 100 ? 'Tiket Penuh' : 'Tiket Tersedia',
            };
          });
        }

        // Koreksi chart data jika omset tiket berasal dari seed/dummy:
        // Jika belum ada tiket lunas (paidTicketRevenue === 0), eventOmset bernilai 0
        if (Array.isArray(payload.chartData)) {
          payload.chartData = payload.chartData.map((pt) => {
            const evOmset = paidTicketRevenue > 0 ? pt.eventOmset : 0;
            return {
              ...pt,
              eventOmset: evOmset,
              totalOmset: (pt.kedaiOmset || 0) + evOmset,
            };
          });

          // Perbarui total chart omset
          payload.totalChartOmset = payload.chartData.reduce((acc, pt) => acc + pt.totalOmset, 0);
          payload.totalChartOmsetFormatted = `Rp ${new Intl.NumberFormat('id-ID').format(payload.totalChartOmset)}`;
        }

        // Filter activeOrders client-side: hanya tampilkan yang sudah dibayar dan belum selesai
        if (Array.isArray(payload.activeOrders)) {
          payload.activeOrders = payload.activeOrders.filter((order) => {
            const payStatus = String(order.payment_status || '').toLowerCase();
            const isPaid = PAID_STATUSES.includes(payStatus);
            const orderSt = String(order.order_status || order.status || '').toLowerCase();
            const isCompleted = orderSt === 'selesai' || orderSt === 'completed' || orderSt === 'done' || orderSt === 'success' || orderSt === 'sukses';
            return isPaid && !isCompleted;
          });
        }
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
