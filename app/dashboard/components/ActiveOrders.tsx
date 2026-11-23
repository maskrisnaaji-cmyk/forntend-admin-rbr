"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Clock, Coffee } from 'lucide-react';

export interface ActiveOrderItem {
  name: string;
  qty: number;
  price: number;
}

export interface ActiveOrder {
  id: string;
  order_code: string;
  table_number: string;
  items_summary: string;
  items: ActiveOrderItem[];
  total_price: number;
  total_formatted: string;
  status: string;
  payment_status: string;
  payment_method?: string;
  payment_type?: string;
  order_status: string;
  created_at: string;
  time_ago: string;
}

interface ActiveOrdersProps {
  activeOrders?: ActiveOrder[];
  loading?: boolean;
}

function getStatusStyle(status: string) {
  const s = status.toLowerCase();
  if (s.includes('barista') || s.includes('disiapkan') || s.includes('proses')) {
    return 'bg-amber-100 text-amber-700';
  }
  if (s.includes('menunggu') || s.includes('bayar') || s.includes('pending')) {
    return 'bg-blue-100 text-blue-700';
  }
  if (s.includes('selesai') || s.includes('success')) {
    return 'bg-emerald-100 text-emerald-700';
  }
  return 'bg-stone-100 text-stone-700';
}

export const ActiveOrders: React.FC<ActiveOrdersProps> = ({
  activeOrders = [],
  loading = false,
}) => {
  const router = useRouter();

  return (
    <div className="lg:col-span-7 rounded-2xl border border-brand-cream-accent bg-white p-5 sm:p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-brand-text">Pesanan Aktif Kedai Kopi</h3>
          <p className="text-xs text-brand-muted">Monitor antrean dapur &amp; barista secara real-time</p>
        </div>
        <button 
          onClick={() => router.push('/kedai')} 
          className="inline-flex items-center gap-1 text-xs font-bold text-brand-maroon hover:underline cursor-pointer"
        >
          <span>Lihat Semua</span>
          <ArrowRight size={13} />
        </button>
      </div>

      <div className="space-y-3">
        {loading && (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="animate-pulse rounded-xl border border-brand-cream-accent bg-brand-cream-card p-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="h-4 w-28 bg-brand-cream-accent rounded" />
                  <div className="h-4 w-20 bg-brand-cream-accent rounded" />
                </div>
                <div className="h-3 w-48 bg-brand-cream-accent rounded mb-2" />
                <div className="h-4 w-24 bg-brand-cream-accent rounded" />
              </div>
            ))}
          </div>
        )}

        {!loading && activeOrders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-center rounded-xl border border-dashed border-brand-cream-accent">
            <Coffee size={28} className="text-brand-muted/60 mb-2" />
            <p className="text-xs font-medium text-brand-muted">Tidak ada pesanan aktif saat ini</p>
          </div>
        )}

        {!loading && activeOrders.map((order) => (
          <div
            key={order.id}
            className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-brand-cream-accent bg-brand-cream-card p-4 hover:border-brand-maroon/30 transition-colors"
          >
            <div>
              <div className="mb-1 flex items-center gap-2 flex-wrap">
                <span className="rounded bg-brand-maroon px-2 py-0.5 text-xs font-bold text-white">
                  {order.table_number || 'Meja --'}
                </span>
                <span className="text-xs font-semibold text-brand-text">
                  Order #{order.order_code}
                </span>
                {order.payment_method && (
                  <span className={`rounded px-1.5 py-0.5 text-[9px] font-bold ${
                    order.payment_method.toLowerCase().includes('qris')
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}>
                    {order.payment_method.toLowerCase().includes('qris') ? 'QRIS' : 'Kasir'}
                  </span>
                )}
                <span className="text-[10px] text-brand-muted">• {order.time_ago}</span>
              </div>
              <p className="text-xs text-brand-muted line-clamp-1">{order.items_summary}</p>
              <p className="mt-1 text-xs font-extrabold text-brand-maroon">{order.total_formatted}</p>
            </div>
            <div>
              <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-bold ${getStatusStyle(order.status)}`}>
                <Clock size={12} /> {order.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActiveOrders;
