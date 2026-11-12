"use client";

import React, { useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { User, Sliders, ShieldCheck, Bell, CheckCircle2, X } from 'lucide-react';
import { ProfileSettingsTab } from './components/ProfileSettingsTab';
import { SystemSettingsTab } from './components/SystemSettingsTab';
import { SecuritySettingsTab } from './components/SecuritySettingsTab';
import { NotificationSettingsTab } from './components/NotificationSettingsTab';

type SettingsTab = 'profile' | 'system' | 'security' | 'notifications';

export default function PengaturanPage() {
  const [activeTabSection, setActiveTabSection] = useState<SettingsTab>('profile');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  const tabs: { id: SettingsTab; label: string; icon: React.FC<{ size?: number; className?: string }> }[] = [
    { id: 'profile', label: 'Profil Admin', icon: User },
    { id: 'system', label: 'Pengaturan Sistem', icon: Sliders },
    { id: 'security', label: 'Keamanan & Sesi', icon: ShieldCheck },
    { id: 'notifications', label: 'Notifikasi', icon: Bell },
  ];

  return (
    <AdminLayout activeTab="pengaturan">
      <div className="max-w-4xl space-y-6">
        {/* Toast Notifikasi Feedback Tersimpan */}
        {toastMsg && (
          <div className="animate-slide-down fixed top-6 right-6 z-50 flex items-center gap-2.5 rounded-xl border border-emerald-300 bg-white px-4 py-3 text-xs font-semibold text-emerald-800 shadow-xl">
            <CheckCircle2 size={17} className="text-emerald-600 shrink-0" />
            <span>{toastMsg}</span>
            <button
              type="button"
              onClick={() => setToastMsg(null)}
              className="ml-2 text-stone-400 hover:text-stone-700 cursor-pointer p-0.5"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* Header Halaman Pengaturan — muncul pertama (delay 0ms) */}
        <div className="stagger-item stagger-0">
          <h1 className="text-xl sm:text-2xl font-bold font-serif text-brand-text">Pusat Pengaturan & Konfigurasi</h1>
          <p className="text-xs text-brand-muted mt-0.5">
            Kelola profil administrator, identitas operasional Rumah Budaya Ratna, dan kebijakan keamanan sistem
          </p>
        </div>

        {/* Tab Bar Navigasi Modular Pengaturan (delay 100ms) */}
        <div className="stagger-item stagger-1 flex overflow-x-auto no-scrollbar border-b border-brand-cream-accent gap-2 sm:gap-3 pb-px">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTabSection === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTabSection(tab.id)}
                className={`flex items-center gap-2 px-3.5 sm:px-4 py-2.5 text-xs font-bold transition-all duration-200 border-b-2 whitespace-nowrap cursor-pointer rounded-t-lg ${
                  isActive
                    ? 'border-brand-maroon text-brand-maroon bg-white shadow-2xs'
                    : 'border-transparent text-brand-muted hover:text-brand-text hover:bg-white/60'
                }`}
              >
                <Icon size={16} className={isActive ? 'text-brand-maroon' : 'text-stone-400'} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Konten Tab Aktif (Transisi Cepat & Halus 200ms) */}
        <div key={activeTabSection} className="animate-fade-in pt-1">
          {activeTabSection === 'profile' && <ProfileSettingsTab onNotify={showNotification} />}
          {activeTabSection === 'system' && <SystemSettingsTab onNotify={showNotification} />}
          {activeTabSection === 'security' && <SecuritySettingsTab onNotify={showNotification} />}
          {activeTabSection === 'notifications' && <NotificationSettingsTab onNotify={showNotification} />}
        </div>
      </div>
    </AdminLayout>
  );
}
