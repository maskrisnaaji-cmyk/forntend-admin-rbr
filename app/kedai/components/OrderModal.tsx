"use client";

import React from 'react';
import { X, Trash2 } from 'lucide-react';
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
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border border-brand-cream-accent bg-white p-5 sm:p-6 shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <div className="mb-4 flex items-center justify-between border-b border-brand-cream-accent pb-3">
              <h3 className="text-sm font-bold text-brand-text">
                {isEditing ? `Edit Pesanan #${currentOrder.id}` : 'Buat Pesanan Baru'}
              </h3>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-1 text-brand-muted hover:bg-brand-cream-card hover:text-brand-text transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={onSubmit} className="space-y-3.5 text-xs">
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

              <div className="mt-5 flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-brand-cream-accent bg-brand-cream-card px-4 py-2.5 text-xs font-bold text-brand-muted hover:bg-brand-cream-accent hover:text-brand-text transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-brand-maroon px-5 py-2.5 text-xs font-bold text-white shadow hover:bg-brand-maroon-light transition-colors cursor-pointer"
                >
                  {isEditing ? 'Simpan Perubahan' : 'Simpan Pesanan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL KONFIRMASI HAPUS PESANAN */}
      {deleteModalOpen && orderToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl border border-brand-cream-accent bg-white p-6 shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-600 mb-3">
              <Trash2 size={22} />
            </div>
            <h3 className="text-center text-sm font-bold text-brand-text">Konfirmasi Hapus Pesanan</h3>
            <p className="mt-2 text-center text-xs text-brand-muted leading-relaxed">
              Apakah Anda yakin ingin membatalkan dan menghapus pesanan{' '}
              <span className="font-semibold text-brand-text">
                #{orderToDelete.id} ({orderToDelete.table})
              </span>
              ? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="mt-6 flex items-center gap-2.5">
              <button
                type="button"
                onClick={onCloseDeleteModal}
                className="flex-1 rounded-xl border border-brand-cream-accent bg-brand-cream-card py-2.5 text-xs font-bold text-brand-muted hover:bg-brand-cream-accent hover:text-brand-text transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={onConfirmDelete}
                className="flex-1 rounded-xl bg-rose-600 py-2.5 text-xs font-bold text-white shadow hover:bg-rose-700 transition-colors cursor-pointer"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderModal;
