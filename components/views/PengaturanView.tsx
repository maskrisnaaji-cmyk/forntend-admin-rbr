"use client";

import React from 'react';
import { Settings, Shield, Store, Bell, Save } from 'lucide-react';

export const PengaturanView = () => {
  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-xl font-bold text-brand-text">Pengaturan Sistem</h1>
        <p className="text-xs text-brand-muted">Atur informasi operasional Rumah Budaya Ratna dan preferensi admin</p>
      </div>

      <div className="space-y-4 rounded-2xl border border-brand-cream-accent bg-white p-6 shadow-sm">
        <h3 className="border-b border-brand-cream-accent pb-2 text-sm font-bold text-brand-text">Informasi Operasional</h3>
        
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <label className="mb-1 block font-semibold text-brand-text">Nama Tempat</label>
            <input type="text" defaultValue="Rumah Budaya Ratna" className="w-full rounded-xl border border-brand-cream-accent p-2.5 focus:border-brand-maroon focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block font-semibold text-brand-text">Jam Buka Kedai</label>
            <input type="text" defaultValue="09:00 - 22:00 WIB" className="w-full rounded-xl border border-brand-cream-accent p-2.5 focus:border-brand-maroon focus:outline-none" />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-brand-text">Alamat Lengkap</label>
          <textarea rows={2} defaultValue="Jl. Magelang No. 102, Sleman, DI Yogyakarta" className="w-full rounded-xl border border-brand-cream-accent p-2.5 text-xs focus:border-brand-maroon focus:outline-none"></textarea>
        </div>

        <div className="pt-2">
          <button className="flex items-center gap-2 rounded-xl bg-brand-maroon px-5 py-2.5 text-xs font-bold text-white shadow hover:bg-brand-maroon-light">
            <Save size={16} />
            <span>Simpan Perubahan</span>
          </button>
        </div>
      </div>
    </div>
  );
};