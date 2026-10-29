"use client";

import React from 'react';
import { Coffee, Tag, Check, PackageX, Pencil, Trash2 } from 'lucide-react';
import { MenuItem } from './types';

interface MenuCardListProps {
  items: MenuItem[];
  onToggleStatus: (id: string) => void;
  onEdit: (item: MenuItem) => void;
  onDelete: (item: MenuItem) => void;
}

export const MenuCardList: React.FC<MenuCardListProps> = ({
  items,
  onToggleStatus,
  onEdit,
  onDelete,
}) => {
  const [failedImages, setFailedImages] = React.useState<Record<string, boolean>>({});

  const handleImageError = (id: string) => {
    setFailedImages((prev) => ({ ...prev, [id]: true }));
  };

  const getImageUrl = (url?: string) => {
    if (!url) return '';
    // Cloud URL Vercel Blob / Full URL
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('blob:') || url.startsWith('data:')) {
      return url;
    }
    // Fallback path legacy
    if (url.startsWith('assets/images/')) {
      return `/${url.replace('assets/images/', '')}`;
    }
    return url;
  };

  const formatRupiah = (val: number) => {
    return `Rp ${val.toLocaleString('id-ID')}`;
  };

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-brand-cream-accent p-10 text-center bg-white/60">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-cream-card text-brand-muted mb-2">
          <Coffee size={24} />
        </div>
        <p className="text-sm font-bold text-brand-text">Menu Tidak Ditemukan</p>
        <p className="mt-1 text-xs text-brand-muted">
          Tidak ada menu yang sesuai dengan filter atau kata kunci pencarian.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex flex-col justify-between rounded-2xl border border-brand-cream-accent bg-white overflow-hidden shadow-sm hover:shadow-md transition-all group"
        >
          {/* Thumbnail Gambar Menu */}
          <div className="relative w-full h-36 bg-[#FAF6F0] flex items-center justify-center overflow-hidden">
            {item.imageUrl && !failedImages[item.id] ? (
              <img
                src={getImageUrl(item.imageUrl)}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={() => handleImageError(item.id)}
              />
            ) : (
              <div className="flex flex-col items-center gap-1.5 text-[#C59A3F]/60">
                <Coffee size={32} strokeWidth={1.5} />
                <span className="text-[10px] font-medium text-brand-muted">Belum ada foto</span>
              </div>
            )}
            {/* Status overlay badge */}
            {item.status === 'Habis' && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="rounded-full bg-rose-600 px-3 py-1 text-[10px] font-bold text-white tracking-wide">
                  HABIS
                </span>
              </div>
            )}
          </div>

          <div className="p-4">
            {/* Top badges: Category & Availability */}
            <div className="flex items-center justify-between gap-2 mb-2.5">
              <span className="inline-flex items-center gap-1 rounded-md bg-[#FAF6F0] border border-[#E8DFD5] px-2 py-0.5 text-[10px] font-semibold text-brand-muted">
                <Tag size={10} className="text-[#C59A3F]" />
                {item.category}
              </span>

              <button
                type="button"
                onClick={() => onToggleStatus(item.id)}
                title="Klik untuk ubah status ketersediaan"
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold transition-colors cursor-pointer ${
                  item.status === 'Tersedia'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                    : 'bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100'
                }`}
              >
                {item.status === 'Tersedia' ? (
                  <>
                    <Check size={10} /> Tersedia
                  </>
                ) : (
                  <>
                    <PackageX size={10} /> Habis
                  </>
                )}
              </button>
            </div>

            {/* Menu Name & Description */}
            <h3 className="text-sm font-bold text-brand-text group-hover:text-brand-maroon transition-colors line-clamp-1">
              {item.name}
            </h3>
            <p className="mt-1 text-xs text-brand-muted leading-relaxed line-clamp-2 min-h-8">
              {item.description || 'Racikan menu istimewa khas Kedai Kopi Rumah Budaya Ratna.'}
            </p>
          </div>

          {/* Price and Action Buttons */}
          <div className="mx-4 mb-4 pt-3 border-t border-brand-cream-accent flex items-center justify-between">
            <div>
              <span className="text-[10px] text-brand-muted block font-medium">Harga Menu</span>
              <span className="text-sm font-extrabold text-[#5E1626]">
                {formatRupiah(item.price)}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => onEdit(item)}
                title="Edit Menu"
                className="rounded-lg border border-brand-cream-accent bg-brand-cream-card p-1.5 text-brand-muted hover:text-brand-maroon hover:bg-brand-cream-accent transition-colors cursor-pointer"
              >
                <Pencil size={13} />
              </button>
              <button
                type="button"
                onClick={() => onDelete(item)}
                title="Hapus Menu"
                className="rounded-lg border border-rose-200 bg-rose-50 p-1.5 text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MenuCardList;
