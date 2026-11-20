"use client";

import React from 'react';
import { Trash2, CheckCircle2, Clock, Loader2 } from 'lucide-react';
import { MemberItem } from './types';

interface MemberListProps {
  members: MemberItem[];
  isLoading?: boolean;
  onDeleteMember: (member: MemberItem) => void;
  onToggleVerify: (member: MemberItem) => void;
  verifyingId?: number | null;
}

export const MemberList: React.FC<MemberListProps> = ({
  members,
  isLoading = false,
  onDeleteMember,
  onToggleVerify,
  verifyingId = null,
}) => {
  return (
    <div className="rounded-2xl border border-brand-cream-accent bg-white p-4 sm:p-5 shadow-sm">
      <div className="mb-3.5 flex items-center justify-between">
        <h3 className="text-sm font-bold text-brand-text">Anggota Terbaru</h3>
        <span className="text-[11px] font-semibold text-brand-muted">
          Total: {members.length} Pengguna
        </span>
      </div>

      {isLoading ? (
        <div className="space-y-3 py-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-16 animate-pulse rounded-xl border border-brand-cream-accent bg-brand-cream-card/50"
            />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {members.map((m) => {
            const isVerified =
              m.status === 'Terverifikasi' ||
              m.is_verified === 1 ||
              m.is_verified === true ||
              String(m.is_verified) === '1';

            const visitText = m.visits || `${m.visit_count ?? 0}x Kunjungan`;
            const isVerifyingThis = verifyingId === m.id;

            return (
              <div
                key={m.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-brand-cream-accent bg-brand-cream-card p-3 transition-colors hover:border-brand-cream-accent/80"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h4 className="truncate text-xs font-bold text-brand-text">
                      {m.name || 'Pengguna RBR'}
                    </h4>
                    {isVerified && (
                      <CheckCircle2 size={13} className="shrink-0 text-emerald-600" />
                    )}
                  </div>
                  <p className="truncate text-[10px] text-brand-muted mt-0.5">
                    {m.email} • <span className="font-medium text-stone-600">{visitText}</span>
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  {/* Badge Status Interaktif (Dapat diklik untuk toggle verifikasi) */}
                  <button
                    type="button"
                    onClick={() => onToggleVerify(m)}
                    disabled={isVerifyingThis}
                    title="Klik untuk mengubah status verifikasi anggota"
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold transition-all cursor-pointer select-none active:scale-95 disabled:opacity-60 disabled:cursor-wait ${
                      isVerified
                        ? 'border border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:border-emerald-400'
                        : 'border border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100 hover:border-amber-400'
                    }`}
                  >
                    {isVerifyingThis ? (
                      <Loader2 size={11} className="animate-spin" />
                    ) : isVerified ? (
                      <CheckCircle2 size={11} />
                    ) : (
                      <Clock size={11} />
                    )}
                    <span>{isVerified ? 'Terverifikasi' : 'Menunggu Verifikasi'}</span>
                  </button>

                  {/* Tombol Hapus Member */}
                  <button
                    type="button"
                    onClick={() => onDeleteMember(m)}
                    title="Hapus Akun Pengguna"
                    className="rounded-lg p-1.5 text-brand-muted transition-colors hover:bg-rose-50 hover:text-rose-600 cursor-pointer"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            );
          })}

          {members.length === 0 && (
            <div className="rounded-xl border border-dashed border-brand-cream-accent p-8 text-center text-xs text-brand-muted">
              Belum ada data anggota yang terdaftar di sistem.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MemberList;
