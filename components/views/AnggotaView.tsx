"use client";

import React, { useState } from 'react';
import { Users, Tag, Plus, CheckCircle, ShieldCheck, Trash2, X } from 'lucide-react';

interface MemberItem {
  id: number;
  name: string;
  email: string;
  role: string;
  visits: string;
  status: string;
}

interface PromoCoupon {
  id: number;
  code: string;
  desc: string;
  status: string;
  theme: 'maroon' | 'amber';
}

export const AnggotaView = () => {
  const [members, setMembers] = useState<MemberItem[]>([
    { id: 1, name: 'Bambang Triyono', email: 'bambang@gmail.com', role: 'Member Reguler', visits: '12x Kunjungan', status: 'Terverifikasi' },
    { id: 2, name: 'Dewi Lestari', email: 'dewi.l@gmail.com', role: 'Member VIP', visits: '28x Kunjungan', status: 'Terverifikasi' },
    { id: 3, name: 'Ahmad Subagyo', email: 'ahmad.subagyo@yahoo.com', role: 'Member Reguler', visits: '3x Kunjungan', status: 'Menunggu Verifikasi' },
  ]);

  const [coupons, setCoupons] = useState<PromoCoupon[]>([
    { id: 1, code: 'BUDAYAKU20', desc: 'Diskon 20% untuk Tiket Event Budaya', status: 'Aktif', theme: 'maroon' },
    { id: 2, code: 'KOPIKULTUR', desc: 'Potongan Rp 10.000 untuk transaksi Kedai', status: 'Aktif', theme: 'amber' },
  ]);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'member' | 'coupon'; id: number; name: string } | null>(null);

  const [couponModalOpen, setCouponModalOpen] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    desc: '',
    theme: 'maroon' as 'maroon' | 'amber',
  });

  const handleOpenCreateCoupon = () => {
    setNewCoupon({
      code: '',
      desc: '',
      theme: 'maroon',
    });
    setCouponModalOpen(true);
  };

  const handleSaveCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCoupon.code || !newCoupon.desc) return;

    const coupon: PromoCoupon = {
      id: Date.now(),
      code: newCoupon.code.toUpperCase(),
      desc: newCoupon.desc,
      status: 'Aktif',
      theme: newCoupon.theme,
    };
    setCoupons((prev) => [...prev, coupon]);
    setCouponModalOpen(false);
  };

  const handleRequestDeleteMember = (member: MemberItem) => {
    setDeleteTarget({ type: 'member', id: member.id, name: member.name });
    setDeleteModalOpen(true);
  };

  const handleRequestDeleteCoupon = (coupon: PromoCoupon) => {
    setDeleteTarget({ type: 'coupon', id: coupon.id, name: coupon.code });
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      if (deleteTarget.type === 'member') {
        setMembers((prev) => prev.filter((m) => m.id !== deleteTarget.id));
      } else {
        setCoupons((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      }
      setDeleteTarget(null);
    }
    setDeleteModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-brand-text">Keanggotaan & Kode Promo</h1>
          <p className="text-xs text-brand-muted">Kelola data member komunitas kebudayaan dan diskon khusus</p>
        </div>
        <button
          onClick={handleOpenCreateCoupon}
          className="flex items-center gap-2 rounded-xl bg-brand-gold px-4 py-2.5 text-xs font-bold text-brand-maroon shadow hover:bg-amber-400 transition-colors"
        >
          <Plus size={16} />
          <span>Buat Kupon Promo</span>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* List Anggota */}
        <div className="rounded-2xl border border-brand-cream-accent bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-sm font-bold text-brand-text">Anggota Terbaru</h3>
          <div className="space-y-3">
            {members.map((m) => (
              <div key={m.id} className="flex items-center justify-between rounded-xl border border-brand-cream-accent bg-brand-cream-card p-3">
                <div>
                  <h4 className="text-xs font-bold text-brand-text">{m.name}</h4>
                  <p className="text-[10px] text-brand-muted">{m.email} • {m.visits}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    m.status === 'Terverifikasi' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {m.status}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRequestDeleteMember(m)}
                    title="Hapus Member"
                    className="rounded-lg p-1 text-brand-muted transition-colors hover:bg-rose-50 hover:text-rose-600"
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

        {/* Kupon Promo Aktif */}
        <div className="rounded-2xl border border-brand-cream-accent bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-sm font-bold text-brand-text">Kupon Promo Aktif</h3>
          <div className="space-y-3">
            {coupons.map((coupon) => (
              <div
                key={coupon.id}
                className={`rounded-xl border border-dashed p-4 ${
                  coupon.theme === 'maroon'
                    ? 'border-brand-maroon bg-rose-50/50'
                    : 'border-amber-600 bg-amber-50/50'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span
                      className={`font-extrabold text-sm tracking-wider ${
                        coupon.theme === 'maroon' ? 'text-brand-maroon' : 'text-amber-800'
                      }`}
                    >
                      {coupon.code}
                    </span>
                    <p className="text-xs text-brand-muted mt-0.5">{coupon.desc}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold text-white px-2 py-0.5 rounded ${
                        coupon.theme === 'maroon' ? 'bg-brand-maroon' : 'bg-amber-700'
                      }`}
                    >
                      {coupon.status}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRequestDeleteCoupon(coupon)}
                      title="Hapus Kupon"
                      className="rounded-lg p-1 text-brand-muted transition-colors hover:bg-rose-50 hover:text-rose-600"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {coupons.length === 0 && (
              <div className="rounded-xl border border-dashed border-brand-cream-accent p-6 text-center text-xs text-brand-muted">
                Belum ada kupon promo aktif.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Konfirmasi Hapus */}
      {deleteModalOpen && deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl border border-brand-cream-accent bg-white p-6 shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-600 mb-3">
              <Trash2 size={22} />
            </div>
            <h3 className="text-center text-sm font-bold text-brand-text">
              Konfirmasi Hapus {deleteTarget.type === 'member' ? 'Anggota' : 'Kupon'}
            </h3>
            <p className="mt-2 text-center text-xs text-brand-muted leading-relaxed">
              Apakah Anda yakin ingin menghapus {deleteTarget.type === 'member' ? 'anggota' : 'kupon promo'}{' '}
              <span className="font-semibold text-brand-text">&ldquo;{deleteTarget.name}&rdquo;</span>? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="mt-6 flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => { setDeleteModalOpen(false); setDeleteTarget(null); }}
                className="flex-1 rounded-xl border border-brand-cream-accent bg-brand-cream-card py-2.5 text-xs font-bold text-brand-muted hover:bg-brand-cream-accent hover:text-brand-text transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 rounded-xl bg-rose-600 py-2.5 text-xs font-bold text-white shadow hover:bg-rose-700 transition-colors"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Buat Kupon Promo */}
      {couponModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-brand-cream-accent bg-white p-6 shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <div className="mb-4 flex items-center justify-between border-b border-brand-cream-accent pb-3">
              <h3 className="text-sm font-bold text-brand-text">Buat Kupon Promo Baru</h3>
              <button
                type="button"
                onClick={() => setCouponModalOpen(false)}
                className="rounded-lg p-1 text-brand-muted hover:bg-brand-cream-card hover:text-brand-text transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveCoupon} className="space-y-3.5 text-xs">
              <div>
                <label className="mb-1 block font-semibold text-brand-text">Kode Promo</label>
                <input
                  type="text"
                  required
                  value={newCoupon.code}
                  onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                  className="w-full rounded-xl border border-brand-cream-accent p-2.5 text-xs focus:border-brand-maroon focus:outline-none uppercase font-bold tracking-wider"
                  placeholder="Contoh: BUDAYA50"
                />
              </div>

              <div>
                <label className="mb-1 block font-semibold text-brand-text">Deskripsi Promo</label>
                <input
                  type="text"
                  required
                  value={newCoupon.desc}
                  onChange={(e) => setNewCoupon({ ...newCoupon, desc: e.target.value })}
                  className="w-full rounded-xl border border-brand-cream-accent p-2.5 text-xs focus:border-brand-maroon focus:outline-none"
                  placeholder="Contoh: Diskon 50% Tiket Masuk Pagelaran"
                />
              </div>

              <div>
                <label className="mb-1 block font-semibold text-brand-text">Skema Tampilan</label>
                <select
                  value={newCoupon.theme}
                  onChange={(e) => setNewCoupon({ ...newCoupon, theme: e.target.value as 'maroon' | 'amber' })}
                  className="w-full rounded-xl border border-brand-cream-accent p-2.5 text-xs focus:border-brand-maroon focus:outline-none bg-white"
                >
                  <option value="maroon">Maroon (Agenda & Tiket Budaya)</option>
                  <option value="amber">Amber (Kedai Kopi)</option>
                </select>
              </div>

              <div className="mt-5 flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setCouponModalOpen(false)}
                  className="rounded-xl border border-brand-cream-accent bg-brand-cream-card px-4 py-2.5 text-xs font-bold text-brand-muted hover:bg-brand-cream-accent hover:text-brand-text transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-brand-maroon px-5 py-2.5 text-xs font-bold text-white shadow hover:bg-brand-maroon-light transition-colors"
                >
                  Simpan Kupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};