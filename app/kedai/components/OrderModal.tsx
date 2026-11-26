"use client";

import React from 'react';
import { Trash2 } from 'lucide-react';
import { AdminModal } from '@/components/ui/AdminModal';
import { OrderItem, OrderStatus } from './types';

interface OrderModalProps {
  isOpen: boolean;
  isEditing: boolean;
  currentOrder: Partial<OrderItem>;
  onChange: (updated: Partial<OrderItem>) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  deleteModalOpen: boolean;
  orderToDelete: OrderItem | null;
  onCloseDeleteModal: () => void;
  onConfirmDelete: () => void;
}

export const OrderModal: React.FC<OrderModalProps> = ({
  isOpen,
  isEditing,
  currentOrder,
  onChange,
  onClose,
  onSubmit,
  deleteModalOpen,
  orderToDelete,
  onCloseDeleteModal,
  onConfirmDelete,
}) => {
  return (
    <>
      {/* MODAL TAMBAH / EDIT PESANAN */}
      <AdminModal
        isOpen={isOpen}
        onClose={onClose}
        title={isEditing ? `Edit Pesanan #${currentOrder.id}` : 'Buat Pesanan Baru'}
        subtitle={isEditing ? `Perbarui rincian pesanan meja atau status pesanan` : 'Tambahkan pesanan pelanggan secara manual ke antrean'}
        size="md"
        footer={
          <div className="flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-stone-200 px-4 py-2 text-sm font-medium text-stone-600 hover:bg-stone-50 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              form="order-form"
              className="rounded-xl bg-[#5C1D24] px-5 py-2 text-sm font-semibold text-white hover:bg-[#4A161C] transition-colors cursor-pointer"
            >
              {isEditing ? 'Simpan Perubahan' : 'Simpan Pesanan'}
            </button>
          </div>
        }
      >
        <form id="order-form" onSubmit={onSubmit} className="space-y-3.5 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block font-semibold text-brand-text">Nomor Meja</label>
              <input
                type="text"
                required
                value={currentOrder.table || ''}
                onChange={(e) => onChange({ table: e.target.value })}
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
                onChange={(e) => onChange({ total: e.target.value })}
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
              onChange={(e) => onChange({ items: e.target.value })}
              className="w-full rounded-xl border border-brand-cream-accent p-2.5 text-xs focus:border-brand-maroon focus:outline-none"
              placeholder="Contoh: 1x Kopi Susu Creamy Gula Aren, 1x Pisang Goreng"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block font-semibold text-brand-text">Status Pesanan</label>
              <select
                value={currentOrder.status || 'menunggu'}
                onChange={(e) => onChange({ status: e.target.value as OrderStatus })}
                className="w-full rounded-xl border border-brand-cream-accent p-2.5 text-xs focus:border-brand-maroon focus:outline-none bg-white"
              >
                <option value="menunggu">Menunggu Bayar</option>
                <option value="disiapkan">Disiapkan Barista</option>
                <option value="selesai">Selesai</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block font-semibold text-brand-text">Metode Pembayaran</label>
              <select
                value={currentOrder.payment_method || currentOrder.payment_type || 'cash'}
                onChange={(e) => onChange({ payment_method: e.target.value, payment_type: e.target.value })}
                className="w-full rounded-xl border border-brand-cream-accent p-2.5 text-xs focus:border-brand-maroon focus:outline-none bg-white font-medium"
              >
                <option value="cash">Bayar di Kasir (Tunai)</option>
                <option value="qris">QRIS (Midtrans Sandbox)</option>
              </select>
            </div>
          </div>
        </form>
      </AdminModal>

      {/* MODAL KONFIRMASI HAPUS PESANAN */}
      <AdminModal
        isOpen={Boolean(deleteModalOpen && orderToDelete)}
        onClose={onCloseDeleteModal}
        title="Konfirmasi Hapus Pesanan"
        size="md"
        footer={
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onCloseDeleteModal}
              className="flex-1 rounded-xl border border-stone-200 px-4 py-2 text-sm font-medium text-stone-600 hover:bg-stone-50 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={onConfirmDelete}
              className="flex-1 rounded-xl bg-rose-600 py-2 text-sm font-bold text-white shadow hover:bg-rose-700 transition-colors cursor-pointer"
            >
              Ya, Hapus
            </button>
          </div>
        }
      >
        <div className="text-center py-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-600 mb-3">
            <Trash2 size={22} />
          </div>
          <p className="text-xs text-brand-muted leading-relaxed">
            Apakah Anda yakin ingin membatalkan dan menghapus pesanan{' '}
            <span className="font-semibold text-brand-text">
              #{orderToDelete?.id} ({orderToDelete?.table})
            </span>
            ? Tindakan ini tidak dapat dibatalkan.
          </p>
        </div>
      </AdminModal>
    </>
  );
};

export default OrderModal;
