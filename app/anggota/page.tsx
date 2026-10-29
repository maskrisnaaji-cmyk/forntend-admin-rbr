"use client";

import React, { useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Plus } from 'lucide-react';
import { MemberItem, PromoCoupon } from './components/types';
import { MemberList } from './components/MemberList';
import { CouponList } from './components/CouponList';
import { CouponModal } from './components/CouponModal';
import { DeleteConfirmationModal } from './components/DeleteConfirmationModal';

export default function AnggotaPage() {
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
  const [newCoupon, setNewCoupon] = useState<{
    code: string;
    desc: string;
    theme: 'maroon' | 'amber';
  }>({
    code: '',
    desc: '',
    theme: 'maroon',
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
    <AdminLayout activeTab="anggota">
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold text-brand-text">Keanggotaan &amp; Kode Promo</h1>
            <p className="text-xs text-brand-muted">
              Kelola data member komunitas kebudayaan dan diskon khusus
            </p>
          </div>
          <button
            onClick={handleOpenCreateCoupon}
            className="flex items-center justify-center gap-2 rounded-xl bg-brand-maroon px-4 py-2.5 text-xs font-bold text-white shadow hover:bg-brand-maroon-light transition-colors cursor-pointer"
          >
            <Plus size={16} />
            <span>Buat Kupon Promo</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MemberList
            members={members}
            onDeleteMember={handleRequestDeleteMember}
          />
          <CouponList
            coupons={coupons}
            onDeleteCoupon={handleRequestDeleteCoupon}
          />
        </div>

        {/* Modal Buat Kupon */}
        <CouponModal
          isOpen={couponModalOpen}
          formData={newCoupon}
          onClose={() => setCouponModalOpen(false)}
          onChange={(upd) => setNewCoupon((prev) => ({ ...prev, ...upd }))}
          onSubmit={handleSaveCoupon}
        />

        {/* Modal Konfirmasi Hapus */}
        <DeleteConfirmationModal
          isOpen={deleteModalOpen}
          target={deleteTarget}
          onClose={() => {
            setDeleteModalOpen(false);
            setDeleteTarget(null);
          }}
          onConfirm={handleConfirmDelete}
        />
      </div>
    </AdminLayout>
  );
}
