"use client";

import React from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import { AdminModal } from '@/components/ui/AdminModal';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  target: { type: 'member' | 'coupon'; id: number; name: string } | null;
  isDeleting?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  target,
  isDeleting = false,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !target) return null;

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Konfirmasi Hapus ${target.type === 'member' ? 'Anggota' : 'Kupon Promo'}`}
      size="md"
      footer={
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            disabled={isDeleting}
            onClick={onClose}
            className="flex-1 rounded-xl border border-stone-200 px-4 py-2 text-sm font-medium text-stone-600 hover:bg-stone-50 transition-colors cursor-pointer disabled:opacity-60"
          >
            Batal
          </button>
          <button
            type="button"
            disabled={isDeleting}
            onClick={onConfirm}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-rose-600 py-2 text-sm font-bold text-white shadow hover:bg-rose-700 transition-colors cursor-pointer disabled:opacity-60"
          >
            {isDeleting && <Loader2 size={13} className="animate-spin" />}
            <span>{isDeleting ? 'Menghapus...' : 'Ya, Hapus'}</span>
          </button>
        </div>
      }
    >
      <div className="text-center py-2">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-600 mb-3">
          <Trash2 size={22} />
        </div>
        <p className="text-xs text-brand-muted leading-relaxed">
          Apakah Anda yakin ingin menghapus {target.type === 'member' ? 'akun anggota' : 'kupon promo'}{' '}
          <span className="font-semibold text-brand-text">&ldquo;{target.name}&rdquo;</span>? Tindakan ini tidak dapat dibatalkan.
        </p>
      </div>
    </AdminModal>
  );
};

export default DeleteConfirmationModal;
