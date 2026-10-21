"use client";

import React from 'react';
import { Coffee, X, ImageUp, Trash2 } from 'lucide-react';
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
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-brand-cream-accent bg-white p-5 sm:p-6 shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <div className="mb-4 flex items-center justify-between border-b border-brand-cream-accent pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#6B1D2F]/10 text-[#6B1D2F]">
                  <Coffee size={16} />
                </div>
                <h3 className="text-sm font-bold text-brand-text">
                  {isEditing ? 'Edit Menu Kedai' : 'Tambah Menu Baru'}
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-1 text-brand-muted hover:bg-brand-cream-card hover:text-brand-text transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={onSubmit} className="space-y-4 text-xs">
              {/* Input Text: Nama Menu */}
              <div>
                <label className="mb-1 block font-semibold text-brand-text">
                  Nama Menu <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => onChange({ name: e.target.value })}
                  placeholder="misal: Es Kopi Susu Creamy Gula Aren"
                  className="w-full rounded-xl border border-brand-cream-accent p-2.5 text-xs focus:border-[#6B1D2F] focus:outline-none"
                />
              </div>

              {/* Grid 2 Kolom: Kategori & Harga */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Select Dropdown: Kategori */}
                <div>
                  <label className="mb-1 block font-semibold text-brand-text">
                    Kategori <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => onChange({ category: e.target.value as MenuCategory })}
                    className="w-full rounded-xl border border-brand-cream-accent bg-white p-2.5 text-xs focus:border-[#6B1D2F] focus:outline-none"
                  >
                    <option value="Kopi Nusantara">Kopi Nusantara</option>
                    <option value="Manual Brew">Manual Brew</option>
                    <option value="Non-Kopi">Non-Kopi</option>
                    <option value="Camilan Nusantara">Camilan Nusantara</option>
                  </select>
                </div>

                {/* Input Number: Harga (Rp) */}
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
                      className="w-full rounded-xl border border-brand-cream-accent py-2.5 pl-9 pr-3 text-xs focus:border-[#6B1D2F] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Textarea: Deskripsi Komposisi/Singkat */}
              <div>
                <label className="mb-1 block font-semibold text-brand-text">
                  Deskripsi Komposisi/Singkat
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => onChange({ description: e.target.value })}
                  placeholder="misal: Espresso blend dengan sirup gula aren organik dan susu segar creamy..."
                  className="w-full rounded-xl border border-brand-cream-accent p-2.5 text-xs focus:border-[#6B1D2F] focus:outline-none"
                />
              </div>

              {/* Upload Foto Menu */}
              <div>
                <label className="mb-1.5 block font-semibold text-brand-text">
                  Upload Foto Menu
                </label>
                <label
                  htmlFor="menu-image-upload"
                  className="flex flex-col items-center justify-center w-full rounded-xl border-2 border-dashed border-brand-cream-accent bg-[#FAF6F0] cursor-pointer hover:border-[#C59A3F] hover:bg-[#FAF6F0]/80 transition-all overflow-hidden"
                  style={{ minHeight: imagePreview ? 'auto' : '100px' }}
                >
                  {imagePreview ? (
                    <div className="relative w-full">
                      <img
                        src={imagePreview}
                        alt="Preview foto menu"
                        className="w-full max-h-44 object-cover rounded-xl"
                      />
                      <span className="absolute bottom-2 right-2 rounded-lg bg-black/50 px-2 py-1 text-[10px] font-bold text-white">
                        Klik untuk ganti foto
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 py-5 text-brand-muted">
                      <ImageUp size={24} strokeWidth={1.5} className="text-[#C59A3F]" />
                      <span className="text-xs font-semibold">Klik untuk pilih foto menu</span>
                      <span className="text-[10px]">JPG, PNG, WEBP — maks. 5MB</span>
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

              {/* Radio Option: Status Menu ("Tersedia" / "Habis") */}
              <div>
                <label className="mb-1.5 block font-semibold text-brand-text">Status Menu</label>
                <div className="flex items-center gap-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="menuStatus"
                      value="Tersedia"
                      checked={formData.status === 'Tersedia'}
                      onChange={() => onChange({ status: 'Tersedia' })}
                      className="accent-[#6B1D2F] h-4 w-4"
                    />
                    <span className="text-xs font-medium text-brand-text flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block"></span>
                      Tersedia
                    </span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="menuStatus"
                      value="Habis"
                      checked={formData.status === 'Habis'}
                      onChange={() => onChange({ status: 'Habis' })}
                      className="accent-[#6B1D2F] h-4 w-4"
                    />
                    <span className="text-xs font-medium text-brand-text flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-rose-500 inline-block"></span>
                      Habis
                    </span>
                  </label>
                </div>
              </div>

              {/* Modal Action Buttons */}
              <div className="mt-6 flex items-center justify-end gap-2.5 pt-3 border-t border-brand-cream-accent">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-[#D4AF37] bg-white px-4 py-2.5 text-xs font-bold text-stone-700 hover:bg-[#FAF6F0] transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#6B1D2F] px-5 py-2.5 text-xs font-bold text-white shadow hover:bg-[#802135] transition-colors cursor-pointer"
                >
                  {isEditing ? 'Simpan Perubahan' : 'Simpan Menu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus Menu */}
      {deleteModalOpen && menuToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl border border-brand-cream-accent bg-white p-6 shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-600 mb-3">
              <Trash2 size={22} />
            </div>
            <h3 className="text-center text-sm font-bold text-brand-text">Hapus Menu Kedai</h3>
            <p className="mt-2 text-center text-xs text-brand-muted leading-relaxed">
              Apakah Anda yakin ingin menghapus menu{' '}
              <span className="font-semibold text-brand-text">&ldquo;{menuToDelete.name}&rdquo;</span> dari
              katalog? Tindakan ini tidak dapat dibatalkan.
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

export default AddMenuModal;
