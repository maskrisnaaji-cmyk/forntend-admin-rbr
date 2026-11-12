"use client";

import React, { useState, useEffect } from 'react';
import { Bell, Volume2, Coffee, Ticket, BookOpen, Save } from 'lucide-react';

interface NotificationSettingsTabProps {
  onNotify: (msg: string) => void;
}

export const NotificationSettingsTab: React.FC<NotificationSettingsTabProps> = ({ onNotify }) => {
  const [notifyOrders, setNotifyOrders] = useState(true);
  const [notifyEvents, setNotifyEvents] = useState(true);
  const [notifyLibrary, setNotifyLibrary] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [emailDigest, setEmailDigest] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('rbr_notification_prefs');
      if (saved) {
        try {
          const n = JSON.parse(saved);
          if (typeof n.notifyOrders === 'boolean') setNotifyOrders(n.notifyOrders);
          if (typeof n.notifyEvents === 'boolean') setNotifyEvents(n.notifyEvents);
          if (typeof n.notifyLibrary === 'boolean') setNotifyLibrary(n.notifyLibrary);
          if (typeof n.soundEnabled === 'boolean') setSoundEnabled(n.soundEnabled);
          if (typeof n.emailDigest === 'boolean') setEmailDigest(n.emailDigest);
        } catch (_) {}
      }
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      localStorage.setItem('rbr_notification_prefs', JSON.stringify({
        notifyOrders,
        notifyEvents,
        notifyLibrary,
        soundEnabled,
        emailDigest,
      }));
    }
    onNotify('Preferensi notifikasi berhasil disimpan!');
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 animate-fade-in">
      {/* CARD: Notifikasi Operasional */}
      <div className="rounded-2xl border border-brand-cream-accent bg-white p-5 sm:p-6 shadow-xs">
        <div className="flex items-center gap-2.5 pb-4 border-b border-brand-cream-accent">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/15 text-amber-700">
            <Bell size={18} />
          </div>
          <div>
            <h3 className="font-serif text-sm font-bold text-brand-text">Notifikasi Modul Operasional</h3>
            <p className="text-[11px] text-brand-muted">Atur jenis peringatan langsung yang muncul saat modul aktif menerima aktivitas baru</p>
          </div>
        </div>

        <div className="divide-y divide-brand-cream-accent text-xs">
          {/* Item 1 */}
          <div className="py-3.5 flex items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-amber-50 text-amber-700 mt-0.5">
                <Coffee size={16} />
              </div>
              <div>
                <h4 className="font-bold text-brand-text">Pesanan Baru Kedai Kopi</h4>
                <p className="text-[11px] text-brand-muted">Tampilkan notifikasi pop-up saat kasir atau pelanggan membuat pesanan minuman baru</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setNotifyOrders(!notifyOrders)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                notifyOrders ? 'bg-brand-maroon' : 'bg-stone-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  notifyOrders ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Item 2 */}
          <div className="py-3.5 flex items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-rose-50 text-rose-700 mt-0.5">
                <Ticket size={16} />
              </div>
              <div>
                <h4 className="font-bold text-brand-text">Reservasi & Tiket Agenda Budaya</h4>
                <p className="text-[11px] text-brand-muted">Pemberitahuan saat pengunjung melakukan klaim kupon atau pendaftaran event seni</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setNotifyEvents(!notifyEvents)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                notifyEvents ? 'bg-brand-maroon' : 'bg-stone-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  notifyEvents ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Item 3 */}
          <div className="py-3.5 flex items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-indigo-50 text-indigo-700 mt-0.5">
                <BookOpen size={16} />
              </div>
              <div>
                <h4 className="font-bold text-brand-text">Peringatan Jatuh Tempo Buku Pustaka</h4>
                <p className="text-[11px] text-brand-muted">Alarm peringatan otomatis saat peminjaman buku melampaui batas 7 hari</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setNotifyLibrary(!notifyLibrary)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                notifyLibrary ? 'bg-brand-maroon' : 'bg-stone-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  notifyLibrary ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Item 4 */}
          <div className="py-3.5 flex items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-stone-100 text-stone-700 mt-0.5">
                <Volume2 size={16} />
              </div>
              <div>
                <h4 className="font-bold text-brand-text">Efek Suara Notifikasi (Audio Chime)</h4>
                <p className="text-[11px] text-brand-muted">Putar nada dering lembut saat pesanan kedai kopi atau scan tiket berhasil diproses</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                soundEnabled ? 'bg-brand-maroon' : 'bg-stone-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  soundEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="flex items-center gap-2 rounded-xl bg-brand-maroon px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-brand-maroon-light transition-all active:scale-[0.99] cursor-pointer"
        >
          <Save size={15} />
          <span>Simpan Preferensi Notifikasi</span>
        </button>
      </div>
    </form>
  );
};

export default NotificationSettingsTab;

