"use client";

import React from 'react';
import { Search, Clock, AlertCircle, CheckCircle2, Pencil, Trash2, Coffee, QrCode, Coins, CreditCard, AlertTriangle } from 'lucide-react';
import { OrderItem } from './types';

interface OrderQueueProps {
  orders: OrderItem[];
  filter: string;
  setFilter: (f: string) => void;
  paymentMethodFilter: string;
  setPaymentMethodFilter: (m: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onCycleStatus: (id: string) => void;
  onEdit: (order: OrderItem) => void;
  onDelete: (order: OrderItem) => void;
  onOpenPaymentDetail: (order: OrderItem) => void;
}

export const OrderQueue: React.FC<OrderQueueProps> = ({
  orders,
  filter,
  setFilter,
  paymentMethodFilter,
  setPaymentMethodFilter,
  searchQuery,
  setSearchQuery,
  onCycleStatus,
  onEdit,
  onDelete,
  onOpenPaymentDetail,
}) => {
  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Filter Status Tabs, Payment Method Tabs & Search */}
      <div className="flex flex-col gap-3.5 border-b border-brand-cream-accent pb-4">
        {/* Row 1: Filter Status Order */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-brand-muted uppercase tracking-wider mr-1">Status:</span>
            {['semua', 'menunggu', 'disiapkan', 'selesai'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold capitalize transition-all cursor-pointer ${
                  filter === tab
                    ? 'bg-brand-maroon text-white shadow'
                    : 'bg-white text-brand-muted border border-brand-cream-accent hover:text-brand-text'
                }`}
              >
                {tab === 'semua'
                  ? 'Semua'
                  : tab === 'menunggu'
                  ? 'Menunggu Bayar'
                  : tab === 'disiapkan'
                  ? 'Disiapkan'
                  : 'Selesai'}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-brand-muted" size={15} />
            <input
              type="text"
              placeholder="Cari ID Order / No. Meja..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-56 rounded-xl border border-brand-cream-accent bg-white py-1.5 pl-8 pr-3 text-xs focus:border-brand-maroon focus:outline-none"
            />
          </div>
        </div>

        {/* Row 2: Filter Metode Pembayaran Kedai (HANYA QRIS & BAYAR DI KASIR) */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-brand-cream-accent/60">
          <span className="text-[11px] font-bold text-brand-muted uppercase tracking-wider mr-1">Metode Bayar:</span>
          {[
            { id: 'semua', label: 'Semua Metode', icon: null },
            { id: 'qris', label: 'QRIS', icon: QrCode },
            { id: 'va', label: 'Virtual Account', icon: CreditCard },
            { id: 'cash', label: 'Bayar di Kasir', icon: Coins },
          ].map((item) => {
            const Icon = item.icon;
            const active = paymentMethodFilter === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setPaymentMethodFilter(item.id)}
                className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1 text-xs font-semibold transition-all cursor-pointer ${
                  active
                    ? 'bg-[#1E1C1A] text-white shadow-sm'
                    : 'bg-brand-cream-card/60 text-brand-muted border border-brand-cream-accent hover:text-brand-text'
                }`}
              >
                {Icon && <Icon size={13} />}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Order List */}
      <div className="grid grid-cols-1 gap-4">
        {orders.map((order) => {
          const pm = (order.payment_method || order.payment_type || '').toLowerCase();
          const isQris = pm.includes('qris');
          const isVa = pm.includes('va') || pm.includes('bank') || pm.includes('transfer');
          const isCash = !isQris && !isVa;
          const isPaid = order.payment_status === 'PAID';
          const isExpired = order.payment_status === 'EXPIRED';

          return (
            <div
              key={order.id}
              className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-brand-cream-accent bg-white p-5 shadow-sm hover:border-brand-maroon/20 transition-all"
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="rounded bg-brand-maroon px-2 py-0.5 text-xs font-bold text-white shrink-0">
                    {order.table_number || order.table}
                  </span>
                  <span className="text-xs font-bold text-brand-text">#{order.id}</span>
                  <span className="text-[10px] text-brand-muted">• {order.time}</span>

                  {/* Badge Metode Pembayaran Kedai */}
                  {isQris ? (
                    <span className="inline-flex items-center gap-1 rounded-md bg-rose-50 border border-rose-200 px-2 py-0.5 text-[10px] font-bold text-rose-700">
                      <QrCode size={11} /> QRIS
                    </span>
                  ) : isVa ? (
                    <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 border border-blue-200 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                      <CreditCard size={11} /> Virtual Account
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 border border-amber-200 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                      <Coins size={11} /> Bayar di Kasir
                    </span>
                  )}
                </div>

                {/* Items ringkasan */}
                <p className="text-xs text-brand-muted line-clamp-2">{order.items}</p>
                <div className="flex items-center gap-3">
                  <p className="text-sm font-extrabold text-brand-maroon">{order.total}</p>

                  {/* Status Pembayaran */}
                  {isPaid ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                      ✓ Lunas
                    </span>
                  ) : isExpired ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 border border-rose-200 px-2 py-0.5 text-[10px] font-bold text-rose-700">
                      ✕ Kedaluwarsa
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                      Menunggu Bayar
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                {/* Badge order_status dapur */}
                {order.status === 'disiapkan' && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-bold text-amber-700">
                    <Clock size={12} /> Disiapkan
                  </span>
                )}
                {order.status === 'menunggu' && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-1 text-[11px] font-bold text-blue-700">
                    <AlertCircle size={12} /> Menunggu
                  </span>
                )}
                {order.status === 'selesai' && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
                    <CheckCircle2 size={12} /> Selesai
                  </span>
                )}

                {/* Tombol Konfirmasi / Detail Bayar */}
                <button
                  type="button"
                  onClick={() => onOpenPaymentDetail(order)}
                  title="Buka Konfirmasi / Detail Pembayaran"
                  className={`inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                    isPaid
                      ? 'border border-brand-cream-accent bg-brand-cream-card text-brand-text hover:bg-brand-cream-accent'
                      : isExpired
                      ? 'border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100'
                      : 'bg-brand-maroon text-white shadow-sm hover:bg-brand-maroon-light'
                  }`}
                >
                  <CreditCard size={13} />
                  <span>{isPaid ? 'Detail Bayar' : isExpired ? 'Lihat Expired' : 'Konfirmasi Bayar'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => onCycleStatus(order.id)}
                  title="Klik untuk ubah tahapan status pesanan dapur"
                  className="rounded-xl border border-brand-cream-accent bg-brand-cream-card px-3 py-1.5 text-xs font-bold text-brand-text hover:bg-brand-cream-accent transition-colors cursor-pointer"
                >
                  Update Dapur
                </button>

                <button
                  type="button"
                  onClick={() => onEdit(order)}
                  title="Edit Pesanan"
                  className="rounded-xl border border-brand-cream-accent bg-brand-cream-card p-2 text-xs font-bold text-brand-muted hover:text-brand-maroon hover:bg-brand-cream-accent transition-colors cursor-pointer"
                >
                  <Pencil size={14} />
                </button>

                <button
                  type="button"
                  onClick={() => onDelete(order)}
                  title="Hapus / Batalkan Pesanan"
                  className="rounded-xl border border-rose-200 bg-rose-50 p-2 text-xs font-bold text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
        })}

        {orders.length === 0 && (
          <div className="rounded-2xl border border-dashed border-brand-cream-accent p-10 text-center bg-white/60">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-cream-card text-brand-muted mb-3">
              <Coffee size={24} />
            </div>
            <p className="text-sm font-bold text-brand-text">Antrean Kosong</p>
            <p className="mt-1 text-xs text-brand-muted">
              Tidak ada pesanan yang sesuai dengan filter. Pesanan dari mobile app atau kasir akan muncul di sini secara otomatis.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderQueue;
