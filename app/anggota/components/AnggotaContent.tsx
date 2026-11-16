"use client";

import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { MemberItem, PromoCoupon } from './types';
import { MemberList } from './MemberList';
import { CouponList } from './CouponList';
import { CouponModal } from './CouponModal';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';

const COUPONS_API_URL = 'http://localhost:5000/api/coupons';

export const AnggotaContent: React.FC = () => {
  const [members, setMembers] = useState<MemberItem[]>([
    { id: 1, name: 'Bambang Triyono', email: 'bambang@gmail.com', role: 'Member Reguler', visits: '12x Kunjungan', status: 'Terverifikasi' },
    { id: 2, name: 'Dewi Lestari', email: 'dewi.l@gmail.com', role: 'Member VIP', visits: '28x Kunjungan', status: 'Terverifikasi' },
    { id: 3, name: 'Ahmad Subagyo', email: 'ahmad.subagyo@yahoo.com', role: 'Member Reguler', visits: '3x Kunjungan', status: 'Menunggu Verifikasi' },
  ]);

  const [coupons, setCoupons] = useState<PromoCoupon[]>([]);

  useEffect(() => {
    fetch(COUPONS_API_URL)
      .then((response) => {
        if (!response.ok) throw new Error('Gagal mengambil kupon');
        return response.json();
      })
      .then((data: PromoCoupon[]) => setCoupons(data))
      .catch((error) => console.error('[Coupons] load error', error));
  }, []);

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

  const handleSaveCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCoupon.code || !newCoupon.desc) return;

    try {
      const response = await fetch(COUPONS_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: newCoupon.code,
          desc: newCoupon.desc,
          status: 'Aktif',
          theme: newCoupon.theme,
        }),
      });
      if (!response.ok) throw new Error('Gagal menyimpan kupon');
      const coupon = (await response.json()) as PromoCoupon;
      setCoupons((prev) => [...prev, coupon]);
      setCouponModalOpen(false);
    } catch (error) {
      console.error('[Coupons] create error', error);
    }
  };

  const handleRequestDeleteMember = (member: MemberItem) => {
    setDeleteTarget({ type: 'member', id: member.id, name: member.name });
    setDeleteModalOpen(true);
  };

  const handleRequestDeleteCoupon = (coupon: PromoCoupon) => {
    setDeleteTarget({ type: 'coupon', id: coupon.id, name: coupon.code });
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteTarget) {
      if (deleteTarget.type === 'member') {
        setMembers((prev) => prev.filter((m) => m.id !== deleteTarget.id));
      } else {
        try {
          const response = await fetch(`${COUPONS_API_URL}/${deleteTarget.id}`, {
            method: 'DELETE',
          });
          if (!response.ok) throw new Error('Gagal menghapus kupon');
          setCoupons((prev) => prev.filter((c) => c.id !== deleteTarget.id));
        } catch (error) {
          console.error('[Coupons] delete error', error);
        }
      }
      setDeleteTarget(null);
    }
    setDeleteModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header & Aksi — muncul pertama (delay 0ms) */}
      <header className="stagger-item stagger-0 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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
      </header>

      {/* 2 Kolom: Member List & Coupon List (delay 100ms) */}
      <section aria-label="Manajemen Anggota dan Kupon" className="stagger-item stagger-1 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MemberList
          members={members}
          onDeleteMember={handleRequestDeleteMember}
        />
        <CouponList
          coupons={coupons}
          onDeleteCoupon={handleRequestDeleteCoupon}
        />
      </section>

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
  );
};
