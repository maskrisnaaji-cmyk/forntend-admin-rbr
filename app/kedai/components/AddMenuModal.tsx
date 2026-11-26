"use client";

import React from 'react';
import { Coffee, ImageUp, Trash2 } from 'lucide-react';
import { AdminModal } from '@/components/ui/AdminModal';
import { MenuCategory, MenuItem, MenuStatus } from './types';

interface MenuFormData {
  id: string;
  name: string;
  category: MenuCategory;
  price: number | '';
  description: string;
  status: MenuStatus;
  imageUrl: string;
}

interface AddMenuModalProps {
  isOpen: boolean;
  isEditing: boolean;
  formData: MenuFormData;
  imagePreview: string;
  isUploading?: boolean;
  onClose: () => void;
  onChange: (updated: Partial<MenuFormData>) => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  deleteModalOpen: boolean;
  menuToDelete: MenuItem | null;
  onCloseDeleteModal: () => void;
  onConfirmDelete: () => void;
}

export const AddMenuModal: React.FC<AddMenuModalProps> = ({
  isOpen,
  isEditing,
  formData,
  imagePreview,
  isUploading = false,
  onClose,
  onChange,
  onImageChange,
  onSubmit,
  deleteModalOpen,
  menuToDelete,
  onCloseDeleteModal,
  onConfirmDelete,
}) => {
  return (
    <>
      {/* MODAL DIALOG "+ TAMBAH MENU BARU" / "EDIT MENU" */}
      <AdminModal
        isOpen={isOpen}
        onClose={onClose}
        title={
          <span className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-maroon/10 text-brand-maroon shrink-0">
              <Coffee size={15} />
            </span>
            <span>{isEditing ? 'Edit Menu Kedai' : 'Tambah Menu Baru'}</span>
          </span>
        }
        subtitle={isEditing ? 'Sesuaikan data menu, harga, kategori, atau foto menu' : 'Tambahkan item minuman atau kudapan baru ke katalog kedai'}
        size="lg"
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
              form="menu-form"
              disabled={isUploading}
              className="rounded-xl bg-[#5C1D24] px-5 py-2 text-sm font-semibold text-white hover:bg-[#4A161C] transition-colors cursor-pointer disabled:opacity-60 flex items-center gap-1.5"
            >
              {isUploading ? (
                <>
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Mengunggah Gambar...</span>
                </>
              ) : (
                <span>{isEditing ? 'Simpan Perubahan' : 'Simpan Menu'}</span>
              )}
            </button>
          </div>
        }
      >
        <form id="menu-form" onSubmit={onSubmit} className="space-y-3.5 text-xs">
          {/* Grid 2 Kolom: Nama Menu & Kategori */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block font-semibold text-brand-text">
                Nama Menu <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => onChange({ name: e.target.value })}
                placeholder="misal: Es Kopi Susu Creamy"
                className="w-full rounded-xl border border-brand-cream-accent p-2.5 text-xs focus:border-brand-maroon focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block font-semibold text-brand-text">
                Kategori <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => onChange({ category: e.target.value as MenuCategory })}
                className="w-full rounded-xl border border-brand-cream-accent bg-white p-2.5 text-xs focus:border-brand-maroon focus:outline-none"
              >
                <option value="Kopi Nusantara">Kopi Nusantara</option>
                <option value="Manual Brew">Manual Brew</option>
                <option value="Non-Kopi">Non-Kopi</option>
                <option value="Camilan Nusantara">Camilan Nusantara</option>
              </select>
            </div>
          </div>

          {/* Grid 2 Kolom: Harga & Status Menu */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block font-semibold text-brand-text">
                Harga (Rp) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs font-bold text-brand-muted">
                  Rp
                </span>
                <input
                  type="number"
                  required
                  min={0}
                  step={1000}
                  value={formData.price}
                  onChange={(e) =>
                    onChange({
                      price: e.target.value === '' ? '' : Number(e.target.value),
                    })
                  }
                  placeholder="misal: 28000"
                  className="w-full rounded-xl border border-brand-cream-accent py-2.5 pl-9 pr-3 text-xs focus:border-brand-maroon focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block font-semibold text-brand-text">Status Menu</label>
              <div className="flex items-center gap-4 h-[38px]">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="menuStatus"
                    value="Tersedia"
                    checked={formData.status === 'Tersedia'}
                    onChange={() => onChange({ status: 'Tersedia' })}
                    className="accent-brand-maroon h-4 w-4 cursor-pointer"
                  />
                  <span className="text-xs font-medium text-brand-text flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block"></span>
                    Tersedia
                  </span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="menuStatus"
                    value="Habis"
                    checked={formData.status === 'Habis'}
                    onChange={() => onChange({ status: 'Habis' })}
                    className="accent-brand-maroon h-4 w-4 cursor-pointer"
                  />
                  <span className="text-xs font-medium text-brand-text flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-rose-500 inline-block"></span>
                    Habis
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Grid 2 Kolom: Deskripsi Singkat & Upload Foto Menu */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block font-semibold text-brand-text">
                Deskripsi Singkat
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => onChange({ description: e.target.value })}
                placeholder="misal: Espresso blend dengan susu segar creamy..."
                className="w-full h-[88px] rounded-xl border border-brand-cream-accent p-2.5 text-xs focus:border-brand-maroon focus:outline-none resize-none"
              />
            </div>

            <div>
              <label className="mb-1 block font-semibold text-brand-text">
                Foto Menu
              </label>
              <label
                htmlFor="menu-image-upload"
                className="flex flex-col items-center justify-center w-full h-[88px] rounded-xl border-2 border-dashed border-brand-cream-accent bg-[#FAF6F0] cursor-pointer hover:border-brand-maroon hover:bg-rose-50/20 transition-all overflow-hidden"
              >
                {imagePreview ? (
                  <div className="relative w-full h-full flex items-center justify-center bg-stone-100">
                    <img
                      src={
                        imagePreview.startsWith('assets/images/')
                          ? `/${imagePreview.replace('assets/images/', '')}`
                          : imagePreview
                      }
                      alt="Preview foto menu"
                      className="h-full w-auto object-cover rounded-lg"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity rounded-xl">
                      <span className="text-white text-[10px] font-bold flex items-center gap-1">
                        <ImageUp size={12} /> Ganti foto
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-2 text-brand-muted text-center">
                    <ImageUp size={16} className="text-brand-maroon mb-1" />
                    <span className="text-[11px] font-semibold text-brand-text leading-tight">
                      Upload foto menu
                    </span>
                    <span className="text-[9px] text-brand-muted">Maks. 5MB</span>
                  </div>
                )}
              </label>
              <input
                id="menu-image-upload"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={onImageChange}
              />
            </div>
          </div>
        </form>
      </AdminModal>

      {/* Modal Konfirmasi Hapus Menu */}
      <AdminModal
        isOpen={Boolean(deleteModalOpen && menuToDelete)}
        onClose={onCloseDeleteModal}
        title="Hapus Menu Kedai"
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
            Apakah Anda yakin ingin menghapus menu{' '}
            <span className="font-semibold text-brand-text">&ldquo;{menuToDelete?.name}&rdquo;</span> dari
            katalog? Tindakan ini tidak dapat dibatalkan.
          </p>
        </div>
      </AdminModal>
    </>
  );
};

export default AddMenuModal;
