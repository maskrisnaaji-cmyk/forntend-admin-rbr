"use client";

import React from 'react';
import { Search, Clock, AlertCircle, CheckCircle2, Pencil, Trash2 } from 'lucide-react';
import { OrderItem } from './types';

interface OrderQueueProps {
  orders: OrderItem[];
  filter: string;
  setFilter: (f: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onCycleStatus: (id: string) => void;
  onEdit: (order: OrderItem) => void;
  onDelete: (order: OrderItem) => void;
}

export const OrderQueue: React.FC<OrderQueueProps> = ({
  orders,
  filter,
  setFilter,
  searchQuery,
  setSearchQuery,
  onCycleStatus,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Filter Status Tabs & Search */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-brand-cream-accent pb-3">
        <div className="flex flex-wrap items-center gap-2">
          {['semua', 'menunggu', 'disiapkan', 'selesai'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`rounded-xl px-4 py-2 text-xs font-semibold capitalize transition-all cursor-pointer ${
                filter === tab
                  ? 'bg-brand-maroon text-white shadow'
                  : 'bg-white text-brand-muted border border-brand-cream-accent hover:text-brand-text'
              }`}
            >
              {tab === 'semua'
                ? 'Semua Order'
                : tab === 'menunggu'
                ? 'Menunggu Bayar'
                : tab === 'disiapkan'
                ? 'Disiapkan'
                : 'Selesai'}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-brand-muted" size={16} />
          <input
            type="text"
            placeholder="Cari ID Order / No. Meja..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-56 rounded-xl border border-brand-cream-accent bg-white py-2 pl-9 pr-4 text-xs focus:border-brand-maroon focus:outline-none"
          />
        </div>
      </div>

      {/* Order List */}
      <div className="grid grid-cols-1 gap-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-brand-cream-accent bg-white p-5 shadow-sm"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="rounded bg-brand-maroon px-2 py-0.5 text-xs font-bold text-white">
                  {order.table}
                </span>
                <span className="text-xs font-semibold text-brand-text">#{order.id}</span>
                <span className="text-[10px] text-brand-muted">• {order.time}</span>
              </div>
              <p className="text-xs text-brand-muted">{order.items}</p>
              <p className="text-sm font-extrabold text-brand-maroon">{order.total}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              {order.status === 'disiapkan' && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-[11px] font-bold text-amber-700">
                  <Clock size={12} /> Disiapkan
                </span>
              )}
              {order.status === 'menunggu' && (
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-[11px] font-bold text-blue-700">
                  <AlertCircle size={12} /> Menunggu Bayar
                </span>
              )}
              {order.status === 'selesai' && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold text-emerald-700">
                  <CheckCircle2 size={12} /> Selesai
                </span>
              )}
              <button
                type="button"
                onClick={() => onCycleStatus(order.id)}
                title="Klik untuk ubah tahapan status"
                className="rounded-xl border border-brand-cream-accent bg-brand-cream-card px-3 py-2 text-xs font-bold text-brand-text hover:bg-brand-cream-accent transition-colors cursor-pointer"
              >
                Update Status
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
        ))}
        {orders.length === 0 && (
          <div className="rounded-2xl border border-dashed border-brand-cream-accent p-8 text-center bg-white/60">
            <p className="text-xs text-brand-muted">Tidak ada pesanan yang sesuai dengan filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderQueue;
