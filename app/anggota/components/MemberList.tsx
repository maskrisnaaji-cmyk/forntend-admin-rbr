"use client";

import React from 'react';
import { Trash2 } from 'lucide-react';
import { MemberItem } from './types';

interface MemberListProps {
  members: MemberItem[];
  onDeleteMember: (member: MemberItem) => void;
}

export const MemberList: React.FC<MemberListProps> = ({ members, onDeleteMember }) => {
  return (
    <div className="rounded-2xl border border-brand-cream-accent bg-white p-4 sm:p-5 shadow-sm">
      <h3 className="mb-3 text-sm font-bold text-brand-text">Anggota Terbaru</h3>
      <div className="space-y-3">
        {members.map((m) => (
          <div
            key={m.id}
            className="flex items-center justify-between rounded-xl border border-brand-cream-accent bg-brand-cream-card p-3"
          >
            <div>
              <h4 className="text-xs font-bold text-brand-text">{m.name}</h4>
              <p className="text-[10px] text-brand-muted">
                {m.email} • {m.visits}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  m.status === 'Terverifikasi'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-amber-100 text-amber-700'
                }`}
              >
                {m.status}
              </span>
              <button
                type="button"
                onClick={() => onDeleteMember(m)}
                title="Hapus Member"
                className="rounded-lg p-1 text-brand-muted transition-colors hover:bg-rose-50 hover:text-rose-600 cursor-pointer"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
        {members.length === 0 && (
          <div className="rounded-xl border border-dashed border-brand-cream-accent p-6 text-center text-xs text-brand-muted">
            Tidak ada anggota terdata.
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberList;
