"use client";

import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Shield, Save, CheckCircle2, Camera } from 'lucide-react';

interface ProfileSettingsTabProps {
  onNotify: (msg: string) => void;
}

export const ProfileSettingsTab: React.FC<ProfileSettingsTabProps> = ({ onNotify }) => {
  const [name, setName] = useState('Administrator Utama');
  const [email, setEmail] = useState('admin@rbr.com');
  const [phone, setPhone] = useState('+62 812-3456-7890');
  const [department, setDepartment] = useState('Manajemen Operasional & Budaya');
  const [bio, setBio] = useState('Pengelola operasional terpadu Kedai Kopi, Sirkulasi Pustaka Jawa, dan Agenda Pertunjukan Seni Rumah Budaya Ratna.');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Ambil data user yang tersimpan jika ada
    if (typeof window !== 'undefined') {
      const savedUserStr = sessionStorage.getItem('user') || localStorage.getItem('user');
      if (savedUserStr) {
        try {
          const userObj = JSON.parse(savedUserStr);
          if (userObj.name) setName(userObj.name);
          if (userObj.email) setEmail(userObj.email);
        } catch (_) {}
      }
      const savedProfile = localStorage.getItem('rbr_admin_profile');
      if (savedProfile) {
        try {
          const p = JSON.parse(savedProfile);
          if (p.name) setName(p.name);
          if (p.email) setEmail(p.email);
          if (p.phone) setPhone(p.phone);
          if (p.department) setDepartment(p.department);
          if (p.bio) setBio(p.bio);
        } catch (_) {}
      }
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const payload = { name, email, phone, department, bio };
    if (typeof window !== 'undefined') {
      localStorage.setItem('rbr_admin_profile', JSON.stringify(payload));
      // Sinkronkan ke sessionStorage jika perlu
      const current = sessionStorage.getItem('user');
      if (current) {
        try {
          const parsed = JSON.parse(current);
          sessionStorage.setItem('user', JSON.stringify({ ...parsed, name, email }));
        } catch (_) {}
      }
    }

    setTimeout(() => {
      setIsSaving(false);
      onNotify('Profil administrator berhasil diperbarui!');
    }, 300);
  };

  return (
    <form onSubmit={handleSave} className="space-y-5 animate-fade-in">
      {/* Kartu Ringkasan Akun */}
      <div className="rounded-2xl border border-brand-cream-accent bg-white p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5 pb-5 border-b border-brand-cream-accent">
          {/* Avatar Monogram */}
          <div className="relative group">
            <div className="flex h-16 w-16 sm:h-18 sm:w-18 items-center justify-center rounded-2xl bg-[#6B1D2F] text-amber-200 font-serif font-bold text-2xl shadow-sm border-2 border-amber-300/40">
              {name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() || 'AD'}
            </div>
            <button
              type="button"
              className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-white text-stone-600 shadow-md border border-stone-200 hover:text-brand-maroon cursor-pointer transition-colors"
              title="Ubah Foto Profil"
            >
              <Camera size={13} />
            </button>
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-serif text-lg font-bold text-brand-text">{name}</h3>
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-800 border border-amber-200">
                <Shield size={11} className="text-amber-700" />
                Super Administrator
              </span>
            </div>
            <p className="text-xs text-brand-muted">{email} • {department}</p>
            <div className="flex items-center gap-2 pt-1 text-[11px] text-emerald-700 font-medium">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Status Akun Aktif & Terverifikasi</span>
            </div>
          </div>
        </div>

        {/* Input Fields Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-5 text-xs">
          <div>
            <label className="mb-1.5 block font-bold text-brand-text uppercase tracking-wider text-[11px]">
              Nama Lengkap
            </label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 text-stone-400" size={15} />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-brand-cream-accent bg-[#FCFAF6] py-2 pl-9 pr-3 text-xs text-brand-text focus:border-brand-maroon focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-maroon transition-all"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block font-bold text-brand-text uppercase tracking-wider text-[11px]">
              Email Administrator
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 text-stone-400" size={15} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-brand-cream-accent bg-[#FCFAF6] py-2 pl-9 pr-3 text-xs text-brand-text focus:border-brand-maroon focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-maroon transition-all"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block font-bold text-brand-text uppercase tracking-wider text-[11px]">
              Nomor WhatsApp / Telepon
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-2.5 text-stone-400" size={15} />
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-xl border border-brand-cream-accent bg-[#FCFAF6] py-2 pl-9 pr-3 text-xs text-brand-text focus:border-brand-maroon focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-maroon transition-all"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block font-bold text-brand-text uppercase tracking-wider text-[11px]">
              Departemen / Divisi
            </label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full rounded-xl border border-brand-cream-accent bg-[#FCFAF6] py-2 px-3 text-xs text-brand-text focus:border-brand-maroon focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-maroon transition-all"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1.5 block font-bold text-brand-text uppercase tracking-wider text-[11px]">
              Deskripsi Tugas / Bio Singkat
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full rounded-xl border border-brand-cream-accent bg-[#FCFAF6] p-2.5 text-xs text-brand-text focus:border-brand-maroon focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-maroon transition-all resize-none"
            />
          </div>
        </div>

        {/* Footer Submit */}
        <div className="mt-5 pt-4 border-t border-brand-cream-accent flex items-center justify-between">
          <p className="text-[11px] text-brand-muted">
            Perubahan profil akan disinkronkan ke seluruh sesi panel admin.
          </p>
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 rounded-xl bg-brand-maroon px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-brand-maroon-light transition-all active:scale-[0.99] disabled:opacity-50 cursor-pointer"
          >
            {isSaving ? (
              <span>Menyimpan...</span>
            ) : (
              <>
                <Save size={15} />
                <span>Simpan Profil</span>
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default ProfileSettingsTab;

