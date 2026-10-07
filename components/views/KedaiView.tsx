"use client";

import React, { useState } from 'react';
import { Coffee, Plus, Search, Clock, CheckCircle2, AlertCircle, RefreshCw, Trash2, Pencil, X } from 'lucide-react';

type OrderStatus = 'menunggu' | 'disiapkan' | 'selesai';

interface OrderItem {
  id: string;
  table: string;
  items: string;
  total: string;
  status: OrderStatus;
  time: string;
}

export const KedaiView = () => {
  const [orders, setOrders] = useState<OrderItem[]>([
    { id: 'RBR-1042', table: 'Meja 04', items: '1x Kopi Susu Creamy Gula Aren, 1x Americano Origin, 1x Pisang Goreng', total: 'Rp 65.000', status: 'disiapkan', time: '10 menit lalu' },
    { id: 'RBR-1043', table: 'Meja 09', items: '2x Wedang Uwuh Rempah Khas, 1x Jadah Bakar Serundeng Gurih', total: 'Rp 45.000', status: 'menunggu', time: '5 menit lalu' },
    { id: 'RBR-1041', table: 'Meja 01', items: '1x Single Origin V60 Flores Bajawa, 1x Cirebon Rujak', total: 'Rp 52.000', status: 'selesai', time: '25 menit lalu' },
    { id: 'RBR-1040', table: 'Meja 03', items: '2x Espresso Double Shot, 2x Croissant Butter', total: 'Rp 78.000', status: 'selesai', time: '40 menit lalu' },
  ]);

  const [filter, setFilter] = useState('semua');
  const [searchQuery, setSearchQuery] = useState('');

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<OrderItem | null>(null);

  const [formModalOpen, setFormModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Partial<OrderItem>>({
    table: '',
    items: '',
    total: '',
    status: 'menunggu',
  });

  const handleOpenCreate = () => {
    setIsEditing(false);
    setCurrentOrder({
      table: 'Meja 05',
      items: '',
      total: 'Rp 45.000',
      status: 'menunggu',
      time: 'Baru saja',
    });
    setFormModalOpen(true);
  };

  const handleOpenEdit = (order: OrderItem) => {
    setIsEditing(true);
    setCurrentOrder(order);
    setFormModalOpen(true);
  };

  const handleCycleStatus = (orderId: string) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          const nextStatusMap: Record<OrderStatus, OrderStatus> = {
            menunggu: 'disiapkan',
            disiapkan: 'selesai',
            selesai: 'menunggu',
          };
          return { ...order, status: nextStatusMap[order.status] };
        }
        return order;
      })
    );
  };

  const handleSaveOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentOrder.table || !currentOrder.items) return;

    if (isEditing && currentOrder.id) {
      setOrders((prev) =>
        prev.map((o) => (o.id === currentOrder.id ? (currentOrder as OrderItem) : o))
      );
    } else {
      const randomId = `RBR-${Math.floor(1000 + Math.random() * 9000)}`;
      const newOrder: OrderItem = {
        id: currentOrder.id || randomId,
        table: currentOrder.table || 'Meja 01',
        items: currentOrder.items || '',
        total: currentOrder.total || 'Rp 0',
        status: (currentOrder.status as OrderStatus) || 'menunggu',
        time: 'Baru saja',
      };
      setOrders((prev) => [newOrder, ...prev]);
    }
    setFormModalOpen(false);
  };

  const handleRequestDelete = (order: OrderItem) => {
    setOrderToDelete(order);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (orderToDelete) {
      setOrders((prev) => prev.filter((o) => o.id !== orderToDelete.id));
      setOrderToDelete(null);
    }
    setDeleteModalOpen(false);
  };

  const filteredOrders = orders.filter((o) => {
    const matchFilter = filter === 'semua' ? true : o.status === filter;
    const matchSearch =
      searchQuery.trim() === ''
        ? true
        : o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          o.table.toLowerCase().includes(searchQuery.toLowerCase()) ||
          o.items.toLowerCase().includes(searchQuery.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-brand-text">Manajemen Order Kedai Kopi</h1>
          <p className="text-xs text-brand-muted">Pantau antrean pesanan dapur dan status pembayaran secara real-time</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 rounded-xl bg-brand-maroon px-4 py-2.5 text-xs font-bold text-white shadow hover:bg-brand-maroon-light transition-colors"
        >
          <Plus size={16} />
          <span>Buat Pesanan Baru</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between border-b border-brand-cream-accent pb-3">
        <div className="flex items-center gap-2">
          {['semua', 'menunggu', 'disiapkan', 'selesai'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`rounded-xl px-4 py-2 text-xs font-semibold capitalize transition-all ${
                filter === tab
                  ? 'bg-brand-maroon text-white shadow'
                  : 'bg-white text-brand-muted border border-brand-cream-accent hover:text-brand-text'
              }`}
            >
              {tab === 'semua' ? 'Semua Order' : tab === 'menunggu' ? 'Menunggu Bayar' : tab === 'disiapkan' ? 'Disiapkan' : 'Selesai'}
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
            className="w-56 rounded-xl border border-brand-cream-accent bg-white py-2 pl-9 pr-4 text-xs focus:border-brand-maroon focus:outline-none"
          />
        </div>
      </div>

      {/* Order List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredOrders.map((order) => (
          <div key={order.id} className="flex items-center justify-between rounded-2xl border border-brand-cream-accent bg-white p-5 shadow-sm">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="rounded bg-brand-maroon px-2 py-0.5 text-xs font-bold text-white">{order.table}</span>
                <span className="text-xs font-semibold text-brand-text">#{order.id}</span>
                <span className="text-[10px] text-brand-muted">• {order.time}</span>
              </div>
              <p className="text-xs text-brand-muted">{order.items}</p>
              <p className="text-sm font-extrabold text-brand-maroon">{order.total}</p>
            </div>
            <div className="flex items-center gap-2.5">
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
                onClick={() => handleCycleStatus(order.id)}
                title="Klik untuk ubah tahapan status"
                className="rounded-xl border border-brand-cream-accent bg-brand-cream-card px-3 py-2 text-xs font-bold text-brand-text hover:bg-brand-cream-accent transition-colors"
              >
                Update Status
              </button>
              <button
                type="button"
                onClick={() => handleOpenEdit(order)}
                title="Edit Pesanan"
                className="rounded-xl border border-brand-cream-accent bg-brand-cream-card p-2 text-xs font-bold text-brand-muted hover:text-brand-maroon hover:bg-brand-cream-accent transition-colors"
              >
                <Pencil size={14} />
              </button>
              <button
                type="button"
                onClick={() => handleRequestDelete(order)}
                title="Hapus / Batalkan Pesanan"
                className="rounded-xl border border-rose-200 bg-rose-50 p-2 text-xs font-bold text-rose-600 hover:bg-rose-100 transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
        {filteredOrders.length === 0 && (
          <div className="rounded-2xl border border-dashed border-brand-cream-accent p-8 text-center">
            <p className="text-xs text-brand-muted">Tidak ada pesanan yang sesuai dengan filter.</p>
          </div>
        )}
      </div>

      {/* Modal Konfirmasi Hapus / Batalkan Pesanan */}
      {deleteModalOpen && orderToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl border border-brand-cream-accent bg-white p-6 shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-600 mb-3">
              <Trash2 size={22} />
            </div>
            <h3 className="text-center text-sm font-bold text-brand-text">Konfirmasi Hapus Pesanan</h3>
            <p className="mt-2 text-center text-xs text-brand-muted leading-relaxed">
              Apakah Anda yakin ingin membatalkan dan menghapus pesanan <span className="font-semibold text-brand-text">#{orderToDelete.id} ({orderToDelete.table})</span>? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="mt-6 flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => { setDeleteModalOpen(false); setOrderToDelete(null); }}
                className="flex-1 rounded-xl border border-brand-cream-accent bg-brand-cream-card py-2.5 text-xs font-bold text-brand-muted hover:bg-brand-cream-accent hover:text-brand-text transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 rounded-xl bg-rose-600 py-2.5 text-xs font-bold text-white shadow hover:bg-rose-700 transition-colors"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Tambah / Edit Pesanan */}
      {formModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-brand-cream-accent bg-white p-6 shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <div className="mb-4 flex items-center justify-between border-b border-brand-cream-accent pb-3">
              <h3 className="text-sm font-bold text-brand-text">
                {isEditing ? `Edit Pesanan #${currentOrder.id}` : 'Buat Pesanan Baru'}
              </h3>
              <button
                type="button"
                onClick={() => setFormModalOpen(false)}
                className="rounded-lg p-1 text-brand-muted hover:bg-brand-cream-card hover:text-brand-text transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveOrder} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block font-semibold text-brand-text">Nomor Meja</label>
                  <input
                    type="text"
                    required
                    value={currentOrder.table || ''}
                    onChange={(e) => setCurrentOrder({ ...currentOrder, table: e.target.value })}
                    className="w-full rounded-xl border border-brand-cream-accent p-2.5 text-xs focus:border-brand-maroon focus:outline-none"
                    placeholder="Contoh: Meja 04"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-semibold text-brand-text">Total Harga</label>
                  <input
                    type="text"
                    required
                    value={currentOrder.total || ''}
                    onChange={(e) => setCurrentOrder({ ...currentOrder, total: e.target.value })}
                    className="w-full rounded-xl border border-brand-cream-accent p-2.5 text-xs focus:border-brand-maroon focus:outline-none"
                    placeholder="Contoh: Rp 65.000"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block font-semibold text-brand-text">Item Pesanan</label>
                <textarea
                  rows={3}
                  required
                  value={currentOrder.items || ''}
                  onChange={(e) => setCurrentOrder({ ...currentOrder, items: e.target.value })}
                  className="w-full rounded-xl border border-brand-cream-accent p-2.5 text-xs focus:border-brand-maroon focus:outline-none"
                  placeholder="Contoh: 1x Kopi Susu Creamy Gula Aren, 1x Pisang Goreng"
                />
              </div>

              <div>
                <label className="mb-1 block font-semibold text-brand-text">Status Pesanan</label>
                <select
                  value={currentOrder.status || 'menunggu'}
                  onChange={(e) => setCurrentOrder({ ...currentOrder, status: e.target.value as OrderStatus })}
                  className="w-full rounded-xl border border-brand-cream-accent p-2.5 text-xs focus:border-brand-maroon focus:outline-none bg-white"
                >
                  <option value="menunggu">Menunggu Bayar</option>
                  <option value="disiapkan">Disiapkan Barista</option>
                  <option value="selesai">Selesai</option>
                </select>
              </div>

              <div className="mt-5 flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setFormModalOpen(false)}
                  className="rounded-xl border border-brand-cream-accent bg-brand-cream-card px-4 py-2.5 text-xs font-bold text-brand-muted hover:bg-brand-cream-accent hover:text-brand-text transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-brand-maroon px-5 py-2.5 text-xs font-bold text-white shadow hover:bg-brand-maroon-light transition-colors"
                >
                  {isEditing ? 'Simpan Perubahan' : 'Simpan Pesanan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};