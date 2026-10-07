"use client";

import React from 'react';
import { 
  LayoutDashboard, 
  Coffee, 
  Calendar, 
  BookOpen, 
  Users, 
  Settings, 
  LogOut 
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'kedai', label: 'Kedai Kopi & Order', icon: Coffee },
    { id: 'agenda', label: 'Agenda & Tiket Budaya', icon: Calendar },
    { id: 'pustaka', label: 'Pustaka & Buku', icon: BookOpen },
    { id: 'anggota', label: 'Anggota & Kupon Promo', icon: Users },
    { id: 'pengaturan', label: 'Pengaturan', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-brand-maroon text-white flex flex-col justify-between min-h-screen fixed left-0 top-0 z-20 shadow-xl">
      <div>
        {/* Header Logo */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center font-bold text-lg border border-white/20 text-brand-gold">
              RBR
            </div>
            <div>
              <h1 className="font-bold text-sm leading-tight tracking-wide">Rumah Budaya Ratna</h1>
              <span className="text-[10px] text-white/60 uppercase tracking-wider block mt-0.5">Pusat Kendali Operasional</span>
            </div>
          </div>
        </div>

        {/* Menu Navigation */}
        <nav className="p-4 space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-medium transition-all ${
                  isActive 
                    ? 'bg-white text-brand-maroon shadow-md font-bold' 
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Profil Admin */}
      <div className="p-4 border-t border-white/10 bg-black/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-brand-gold/20 text-brand-gold border border-brand-gold/40 flex items-center justify-center text-xs font-bold">
              RD
            </div>
            <div>
              <p className="text-xs font-semibold text-white">Ratna Dewi</p>
              <p className="text-[10px] text-white/60">Admin Operasional</p>
            </div>
          </div>
          <button className="text-white/60 hover:text-white transition-colors p-1.5 hover:bg-white/10 rounded-lg">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
};