"use client";

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  size?: 'md' | 'lg' | 'xl';
  footer?: React.ReactNode;
  children: React.ReactNode;
}

const sizeClasses: Record<'md' | 'lg' | 'xl', string> = {
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
};

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  size = 'md',
  footer,
  children,
}) => {
  // Tangani penekanan tombol Escape untuk menutup modal
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-transparent p-4 animate-in fade-in duration-150"
      onClick={(e) => {
        // Klik area luar modal akan memanggil onClose
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className={`w-full ${sizeClasses[size] || sizeClasses.md} rounded-2xl border border-stone-200 bg-white shadow-[0_20px_50px_rgba(28,25,23,0.18)] animate-modal-pop`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Seragam */}
        <div className="flex items-center justify-between border-b border-brand-cream-accent px-6 py-4">
          <div className="min-w-0 flex-1 pr-3">
            <h3 className="text-sm font-bold text-brand-text truncate">{title}</h3>
            {subtitle && (
              <p className="mt-0.5 text-[11px] text-brand-muted truncate">{subtitle}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup modal"
            className="rounded-lg p-1.5 text-brand-muted hover:bg-brand-cream-card hover:text-brand-text transition-colors cursor-pointer shrink-0"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body Modal */}
        <div className="max-h-[75vh] overflow-y-auto px-6 py-5">
          {children}
        </div>

        {/* Footer Modal Opsional */}
        {footer && (
          <div className="border-t border-brand-cream-accent px-6 py-3 bg-brand-cream-card/20 rounded-b-2xl">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminModal;
