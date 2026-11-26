"use client";

import React from 'react';
import { Trash2 } from 'lucide-react';
import { AdminModal } from '@/components/ui/AdminModal';
import { BookItem } from './types';

interface DeleteBookModalProps {
  isOpen: boolean;
  bookToDelete: BookItem | null;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteBookModal: React.FC<DeleteBookModalProps> = ({
  isOpen,
  bookToDelete,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !bookToDelete) return null;

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title="Konfirmasi Hapus Pustaka"
      size="md"
      footer={
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-stone-200 px-4 py-2 text-sm font-medium text-stone-600 hover:bg-stone-50 transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
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
          Apakah Anda yakin ingin menghapus buku{' '}
          <span className="font-semibold text-brand-text">
            &ldquo;{bookToDelete.title}&rdquo; ({bookToDelete.code})
          </span>
          ? Tindakan ini tidak dapat dibatalkan.
        </p>
      </div>
    </AdminModal>
  );
};

export default DeleteBookModal;
