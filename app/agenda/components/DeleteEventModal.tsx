"use client";

import React from 'react';
import { Trash2 } from 'lucide-react';
import { EventItem } from './types';

interface DeleteEventModalProps {
  isOpen: boolean;
  eventToDelete: EventItem | null;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteEventModal: React.FC<DeleteEventModalProps> = ({
  isOpen,
  eventToDelete,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !eventToDelete) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm rounded-2xl border border-brand-cream-accent bg-white p-6 shadow-xl animate-in fade-in zoom-in-95 duration-150">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-600 mb-3">
          <Trash2 size={22} />
        </div>
        <h3 className="text-center text-sm font-bold text-brand-text">Konfirmasi Hapus Agenda</h3>
        <p className="mt-2 text-center text-xs text-brand-muted leading-relaxed">
          Apakah Anda yakin ingin menghapus agenda{' '}
          <span className="font-semibold text-brand-text">
            &ldquo;{eventToDelete.title}&rdquo;
          </span>
          ? Tindakan ini tidak dapat dibatalkan.
        </p>
        <div className="mt-6 flex items-center gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-brand-cream-accent bg-brand-cream-card py-2.5 text-xs font-bold text-brand-muted hover:bg-brand-cream-accent hover:text-brand-text transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 rounded-xl bg-rose-600 py-2.5 text-xs font-bold text-white shadow hover:bg-rose-700 transition-colors cursor-pointer"
          >
            Ya, Hapus
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteEventModal;
