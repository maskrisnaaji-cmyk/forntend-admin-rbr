"use client";

import React, { useState, useEffect } from 'react';
import { Building2, Clock, BookOpen, Save, MapPin, Phone, Mail } from 'lucide-react';

interface SystemSettingsTabProps {
  onNotify: (msg: string) => void;
}

export const SystemSettingsTab: React.FC<SystemSettingsTabProps> = ({ onNotify }) => {
  const [placeName, setPlaceName] = useState('Rumah Budaya Ratna');
  const [tagline, setTagline] = useState('Ruang Temu Seni, Literasi & Kehangatan Tradisi Jawa');
  const [address, setAddress] = useState('Jl. Magelang No. 102, Sleman, DI Yogyakarta');
  const [contactPhone, setContactPhone] = useState('+62 813-9876-5432');
  const [contactEmail, setContactEmail] = useState('kontak@rumahbudayaratna.id');

  const [cafeHours, setCafeHours] = useState('09:00 - 22:00 WIB');
  const [libraryHours, setLibraryHours] = useState('10:00 - 20:00 WIB');
  const [closedDay, setClosedDay] = useState('Setiap Senin Pon (Pembersihan Arsip)');

  const [maxBorrowDays, setMaxBorrowDays] = useState('7');
  const [maxBorrowQuota, setMaxBorrowQuota] = useState('2');
  const [dailyLateFee, setDailyLateFee] = useState('2000');

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('rbr_system_settings');
      if (saved) {
        try {
          const s = JSON.parse(saved);
          if (s.placeName) setPlaceName(s.placeName);
          if (s.tagline) setTagline(s.tagline);
          if (s.address) setAddress(s.address);
          if (s.contactPhone) setContactPhone(s.contactPhone);
          if (s.contactEmail) setContactEmail(s.contactEmail);
          if (s.cafeHours) setCafeHours(s.cafeHours);
          if (s.libraryHours) setLibraryHours(s.libraryHours);
          if (s.closedDay) setClosedDay(s.closedDay);
          if (s.maxBorrowDays) setMaxBorrowDays(s.maxBorrowDays);
          if (s.maxBorrowQuota) setMaxBorrowQuota(s.maxBorrowQuota);
          if (s.dailyLateFee) setDailyLateFee(s.dailyLateFee);
        } catch (_) {}
      }
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const payload = {
      placeName,
      tagline,
      address,
      contactPhone,
      contactEmail,
      cafeHours,
      libraryHours,
      closedDay,
      maxBorrowDays,
      maxBorrowQuota,
      dailyLateFee,
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem('rbr_system_settings', JSON.stringify(payload));
    }

    setTimeout(() => {
      setIsSaving(false);
      onNotify('Pengaturan sistem dan operasional berhasil disimpan!');
    }, 300);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 animate-fade-in">
      {/* CARD 1: Identitas & Lokasi Fisik */}
      <div className="rounded-2xl border border-brand-cream-accent bg-white p-5 sm:p-6 shadow-xs">
        <div className="flex items-center gap-2.5 pb-4 border-b border-brand-cream-accent">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/15 text-amber-700">
            <Building2 size={18} />
          </div>
          <div>
            <h3 className="font-serif text-sm font-bold text-brand-text">Identitas Rumah Budaya & Lokasi</h3>
            <p className="text-[11px] text-brand-muted">Informasi publik yang ditampilkan pada struk kasir, katalog pustaka, dan tiket</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 text-xs">
          <div>
            <label className="mb-1 block font-bold text-brand-text text-[11px] uppercase tracking-wider">
              Nama Tempat / Institusi
            </label>
            <input
              type="text"
              required
              value={placeName}
              onChange={(e) => setPlaceName(e.target.value)}
              className="w-full rounded-xl border border-brand-cream-accent bg-[#FCFAF6] py-2 px-3 text-xs text-brand-text focus:border-brand-maroon focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-maroon"
            />
          </div>

          <div>
            <label className="mb-1 block font-bold text-brand-text text-[11px] uppercase tracking-wider">
              Tagline / Slogan
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full rounded-xl border border-brand-cream-accent bg-[#FCFAF6] py-2 px-3 text-xs text-brand-text focus:border-brand-maroon focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-maroon"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1 block font-bold text-brand-text text-[11px] uppercase tracking-wider">
              Alamat Lengkap Rumah Budaya
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-2.5 text-stone-400" size={15} />
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full rounded-xl border border-brand-cream-accent bg-[#FCFAF6] py-2 pl-9 pr-3 text-xs text-brand-text focus:border-brand-maroon focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-maroon"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block font-bold text-brand-text text-[11px] uppercase tracking-wider">
              No. Kontak Resmi (WhatsApp)
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-2.5 text-stone-400" size={15} />
              <input
                type="text"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full rounded-xl border border-brand-cream-accent bg-[#FCFAF6] py-2 pl-9 pr-3 text-xs text-brand-text focus:border-brand-maroon focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-maroon"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block font-bold text-brand-text text-[11px] uppercase tracking-wider">
              Email Resmi Informasi
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 text-stone-400" size={15} />
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full rounded-xl border border-brand-cream-accent bg-[#FCFAF6] py-2 pl-9 pr-3 text-xs text-brand-text focus:border-brand-maroon focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-maroon"
              />
            </div>
          </div>
        </div>
      </div>

      {/* CARD 2: Jam Operasional Harian */}
      <div className="rounded-2xl border border-brand-cream-accent bg-white p-5 sm:p-6 shadow-xs">
        <div className="flex items-center gap-2.5 pb-4 border-b border-brand-cream-accent">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-700">
            <Clock size={18} />
          </div>
          <div>
            <h3 className="font-serif text-sm font-bold text-brand-text">Jadwal Operasional Layanan</h3>
            <p className="text-[11px] text-brand-muted">Pengaturan jam layanan aktif untuk kedai kopi dan galeri pustaka</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs">
          <div>
            <label className="mb-1 block font-bold text-brand-text text-[11px] uppercase tracking-wider">
              Jam Operasional Kedai Kopi
            </label>
            <input
              type="text"
              value={cafeHours}
              onChange={(e) => setCafeHours(e.target.value)}
              className="w-full rounded-xl border border-brand-cream-accent bg-[#FCFAF6] py-2 px-3 text-xs text-brand-text focus:border-brand-maroon focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-maroon"
            />
          </div>

          <div>
            <label className="mb-1 block font-bold text-brand-text text-[11px] uppercase tracking-wider">
              Jam Operasional Pustaka & Galeri
            </label>
            <input
              type="text"
              value={libraryHours}
              onChange={(e) => setLibraryHours(e.target.value)}
              className="w-full rounded-xl border border-brand-cream-accent bg-[#FCFAF6] py-2 px-3 text-xs text-brand-text focus:border-brand-maroon focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-maroon"
            />
          </div>

          <div>
            <label className="mb-1 block font-bold text-brand-text text-[11px] uppercase tracking-wider">
              Jadwal Tutup Rutin
            </label>
            <input
              type="text"
              value={closedDay}
              onChange={(e) => setClosedDay(e.target.value)}
              className="w-full rounded-xl border border-brand-cream-accent bg-[#FCFAF6] py-2 px-3 text-xs text-brand-text focus:border-brand-maroon focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-maroon"
            />
          </div>
        </div>
      </div>

      {/* CARD 3: Kebijakan Sirkulasi Pustaka */}
      <div className="rounded-2xl border border-brand-cream-accent bg-white p-5 sm:p-6 shadow-xs">
        <div className="flex items-center gap-2.5 pb-4 border-b border-brand-cream-accent">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-700">
            <BookOpen size={18} />
          </div>
          <div>
            <h3 className="font-serif text-sm font-bold text-brand-text">Kebijakan Sirkulasi & Preservasi Pustaka</h3>
            <p className="text-[11px] text-brand-muted">Parameter default aturan peminjaman koleksi naskah dan buku</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs">
          <div>
            <label className="mb-1 block font-bold text-brand-text text-[11px] uppercase tracking-wider">
              Batas Pinjam Maksimal (Hari)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max="30"
                value={maxBorrowDays}
                onChange={(e) => setMaxBorrowDays(e.target.value)}
                className="w-full rounded-xl border border-brand-cream-accent bg-[#FCFAF6] py-2 px-3 text-xs text-brand-text focus:border-brand-maroon focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-maroon"
              />
              <span className="text-brand-muted text-[11px] whitespace-nowrap">Hari</span>
            </div>
          </div>

          <div>
            <label className="mb-1 block font-bold text-brand-text text-[11px] uppercase tracking-wider">
              Kuota Buku Maksimal / Anggota
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max="5"
                value={maxBorrowQuota}
                onChange={(e) => setMaxBorrowQuota(e.target.value)}
                className="w-full rounded-xl border border-brand-cream-accent bg-[#FCFAF6] py-2 px-3 text-xs text-brand-text focus:border-brand-maroon focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-maroon"
              />
              <span className="text-brand-muted text-[11px] whitespace-nowrap">Buku</span>
            </div>
          </div>

          <div>
            <label className="mb-1 block font-bold text-brand-text text-[11px] uppercase tracking-wider">
              Biaya Denda Keterlambatan
            </label>
            <div className="flex items-center gap-2">
              <span className="text-brand-muted text-[11px] font-semibold">Rp</span>
              <input
                type="number"
                step="500"
                value={dailyLateFee}
                onChange={(e) => setDailyLateFee(e.target.value)}
                className="w-full rounded-xl border border-brand-cream-accent bg-[#FCFAF6] py-2 px-3 text-xs text-brand-text focus:border-brand-maroon focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-maroon"
              />
              <span className="text-brand-muted text-[11px] whitespace-nowrap">/ Hari</span>
            </div>
          </div>
        </div>
      </div>

      {/* Button Simpan */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSaving}
          className="flex items-center gap-2 rounded-xl bg-brand-maroon px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-brand-maroon-light transition-all active:scale-[0.99] disabled:opacity-50 cursor-pointer"
        >
          {isSaving ? (
            <span>Menyimpan Konfigurasi...</span>
          ) : (
            <>
              <Save size={15} />
              <span>Simpan Pengaturan Sistem</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default SystemSettingsTab;

