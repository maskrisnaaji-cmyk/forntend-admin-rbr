"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { Plus, RefreshCw, AlertCircle } from 'lucide-react';
import { MemberItem, PromoCoupon, CouponFormData } from './types';
import { MemberList } from './MemberList';
import { CouponList } from './CouponList';
import { CouponModal } from './CouponModal';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';

const USERS_API_URL = 'http://localhost:5000/api/users';
const COUPONS_API_URL = 'http://localhost:5000/api/coupons';

export const AnggotaContent: React.FC = () => {
  // ─── State Data (Tanpa Dummy Statis) ──────────────────────────────────────
  const [members, setMembers] = useState<MemberItem[]>([]);
  const [coupons, setCoupons] = useState<PromoCoupon[]>([]);

  // ─── State Loading & Verifikasi ───────────────────────────────────────────
  const [isLoadingMembers, setIsLoadingMembers] = useState(true);
  const [isLoadingCoupons, setIsLoadingCoupons] = useState(true);
  const [verifyingMemberId, setVerifyingMemberId] = useState<number | null>(null);
  const [isSubmittingCoupon, setIsSubmittingCoupon] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // ─── State Modal ──────────────────────────────────────────────────────────
  const [couponModalOpen, setCouponModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    type: 'member' | 'coupon';
    id: number;
    name: string;
  } | null>(null);

  // ─── State Form Kupon Baru ────────────────────────────────────────────────
  const [newCoupon, setNewCoupon] = useState<CouponFormData>({
    code: '',
    desc: '',
    discount_type: 'percent',
    discount_value: '',
    target_member: 'all',
    theme: 'maroon',
  });

  // ─── Helper Auth Token ────────────────────────────────────────────────────
  const getAuthToken = () => {
    if (typeof window === 'undefined') return '';
    return (
      localStorage.getItem('token') ||
      sessionStorage.getItem('token') ||
      localStorage.getItem('adminToken') ||
      localStorage.getItem('authToken') ||
      ''
    );
  };

  const getAuthHeaders = () => {
    const token = getAuthToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
  };

  // ─── Fetch Daftar Anggota (GET /api/users) ─────────────────────────────────
  const fetchMembers = useCallback(async () => {
    setIsLoadingMembers(true);
    try {
      const response = await fetch(USERS_API_URL, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Gagal memuat data anggota`);
      }
      const data = await response.json();
      setMembers(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error('[Anggota] Load members error:', error.message);
      setFeedbackMsg({
        type: 'error',
        text: `Gagal memuat anggota: ${error.message}`,
      });
    } finally {
      setIsLoadingMembers(false);
    }
  }, []);

  // ─── Fetch Daftar Kupon Promo (GET /api/coupons) ───────────────────────────
  const fetchCoupons = useCallback(async () => {
    setIsLoadingCoupons(true);
    try {
      const response = await fetch(COUPONS_API_URL, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Gagal memuat data kupon`);
      }
      const data = await response.json();
      setCoupons(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error('[Anggota] Load coupons error:', error.message);
    } finally {
      setIsLoadingCoupons(false);
    }
  }, []);

  useEffect(() => {
    fetchMembers();
    fetchCoupons();
  }, [fetchMembers, fetchCoupons]);

  // Otomatis hilangkan feedback message setelah 4 detik
  useEffect(() => {
    if (feedbackMsg) {
      const timer = setTimeout(() => setFeedbackMsg(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [feedbackMsg]);

  // ─── Toggle Verifikasi Anggota (PATCH /api/users/:id/verify) ──────────────
  const handleToggleVerify = async (member: MemberItem) => {
    if (verifyingMemberId === member.id) return;

    setVerifyingMemberId(member.id);
    const isCurrentlyVerified =
      member.status === 'Terverifikasi' ||
      member.is_verified === 1 ||
      member.is_verified === true ||
      String(member.is_verified) === '1';

    const targetVerified = !isCurrentlyVerified;

    // Optimistic Update pada UI
    setMembers((prev) =>
      prev.map((m) =>
        m.id === member.id
          ? {
              ...m,
              is_verified: targetVerified ? 1 : 0,
              status: targetVerified ? 'Terverifikasi' : 'Menunggu Verifikasi',
            }
          : m
      )
    );

    try {
      const response = await fetch(`${USERS_API_URL}/${member.id}/verify`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ is_verified: targetVerified ? 1 : 0 }),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.message || `Gagal mengubah status (HTTP ${response.status})`);
      }

      const resData = await response.json();
      const updatedStatus = resData?.data?.status || (targetVerified ? 'Terverifikasi' : 'Menunggu Verifikasi');

      setFeedbackMsg({
        type: 'success',
        text: `Status ${member.name} berhasil diubah menjadi ${updatedStatus}.`,
      });
    } catch (error: any) {
      console.error('[Anggota] Toggle verify error:', error);
      // Rollback jika gagal
      setMembers((prev) =>
        prev.map((m) =>
          m.id === member.id
            ? {
                ...m,
                is_verified: isCurrentlyVerified ? 1 : 0,
                status: isCurrentlyVerified ? 'Terverifikasi' : 'Menunggu Verifikasi',
              }
            : m
        )
      );
      setFeedbackMsg({
        type: 'error',
        text: `Gagal memperbarui status: ${error.message}`,
      });
    } finally {
      setVerifyingMemberId(null);
    }
  };

  // ─── Buat Kupon Promo Baru (POST /api/coupons) ─────────────────────────────
  const handleOpenCreateCoupon = () => {
    setNewCoupon({
      code: '',
      desc: '',
      discount_type: 'percent',
      discount_value: '',
      target_member: 'all',
      theme: 'maroon',
    });
    setCouponModalOpen(true);
  };

  const handleSaveCoupon = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanCode = newCoupon.code.trim().toUpperCase().replace(/\s+/g, '');
    const cleanDesc = newCoupon.desc.trim();
    const numValue = Number(newCoupon.discount_value);

    if (!cleanCode) {
      alert('Kode kupon wajib diisi.');
      return;
    }
    if (!cleanDesc) {
      alert('Deskripsi kupon wajib diisi.');
      return;
    }
    if (isNaN(numValue) || numValue <= 0) {
      alert('Nilai diskon harus berupa angka lebih dari 0.');
      return;
    }
    if (newCoupon.discount_type === 'percent' && numValue > 100) {
      alert('Diskon persentase tidak boleh lebih dari 100%.');
      return;
    }

    setIsSubmittingCoupon(true);

    try {
      const payload = {
        code: cleanCode,
        desc: cleanDesc,
        discount_type: newCoupon.discount_type,
        discount_value: numValue,
        target_member: newCoupon.target_member,
        status: 'Aktif',
        theme: newCoupon.theme,
        is_active: 1,
      };

      const response = await fetch(COUPONS_API_URL, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.message || `Gagal menyimpan kupon (HTTP ${response.status})`);
      }

      await fetchCoupons();
      setCouponModalOpen(false);
      setFeedbackMsg({
        type: 'success',
        text: `Kupon promo "${cleanCode}" berhasil diterbitkan!`,
      });
    } catch (error: any) {
      console.error('[Coupons] Create error:', error);
      alert(`Gagal membuat kupon promo: ${error.message}`);
    } finally {
      setIsSubmittingCoupon(false);
    }
  };

  // ─── Modal Hapus ──────────────────────────────────────────────────────────
  const handleRequestDeleteMember = (member: MemberItem) => {
    setDeleteTarget({ type: 'member', id: member.id, name: member.name });
    setDeleteModalOpen(true);
  };

  const handleRequestDeleteCoupon = (coupon: PromoCoupon) => {
    setDeleteTarget({ type: 'coupon', id: coupon.id, name: coupon.code });
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      if (deleteTarget.type === 'member') {
        const response = await fetch(`${USERS_API_URL}/${deleteTarget.id}`, {
          method: 'DELETE',
          headers: getAuthHeaders(),
        });
        if (!response.ok) {
          const err = await response.json().catch(() => ({}));
          throw new Error(err.message || 'Gagal menghapus user');
        }
        setMembers((prev) => prev.filter((m) => m.id !== deleteTarget.id));
        setFeedbackMsg({
          type: 'success',
          text: `Akun anggota "${deleteTarget.name}" berhasil dihapus.`,
        });
      } else {
        const response = await fetch(`${COUPONS_API_URL}/${deleteTarget.id}`, {
          method: 'DELETE',
          headers: getAuthHeaders(),
        });
        if (!response.ok) {
          const err = await response.json().catch(() => ({}));
          throw new Error(err.message || 'Gagal menghapus kupon');
        }
        setCoupons((prev) => prev.filter((c) => c.id !== deleteTarget.id));
        setFeedbackMsg({
          type: 'success',
          text: `Kupon promo "${deleteTarget.name}" berhasil dihapus.`,
        });
      }
      setDeleteTarget(null);
      setDeleteModalOpen(false);
    } catch (error: any) {
      console.error('[Anggota] Delete error:', error);
      alert(`Gagal menghapus: ${error.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {feedbackMsg && (
        <div
          className={`flex items-center justify-between rounded-xl p-3 text-xs font-semibold shadow-sm animate-modal-pop ${
            feedbackMsg.type === 'success'
              ? 'border border-emerald-300 bg-emerald-50 text-emerald-800'
              : 'border border-rose-300 bg-rose-50 text-rose-800'
          }`}
        >
          <div className="flex items-center gap-2">
            <AlertCircle size={15} />
            <span>{feedbackMsg.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedbackMsg(null)}
            className="text-[10px] underline hover:opacity-80 cursor-pointer"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Header & Aksi */}
      <header className="stagger-item stagger-0 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-brand-text">Keanggotaan &amp; Kode Promo</h1>
          <p className="text-xs text-brand-muted">
            Kelola data member komunitas kebudayaan, status verifikasi akun, dan kupon diskon promo
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              fetchMembers();
              fetchCoupons();
            }}
            title="Segarkan Data"
            className="flex items-center justify-center rounded-xl border border-brand-cream-accent bg-white p-2.5 text-brand-muted shadow-sm hover:bg-brand-cream-card hover:text-brand-text transition-colors cursor-pointer"
          >
            <RefreshCw
              size={15}
              className={isLoadingMembers || isLoadingCoupons ? 'animate-spin' : ''}
            />
          </button>

          <button
            type="button"
            onClick={handleOpenCreateCoupon}
            className="flex items-center justify-center gap-2 rounded-xl bg-brand-maroon px-4 py-2.5 text-xs font-bold text-white shadow hover:bg-brand-maroon-light transition-colors cursor-pointer"
          >
            <Plus size={16} />
            <span>Buat Kupon Promo</span>
          </button>
        </div>
      </header>

      {/* 2 Kolom: Member List & Coupon List */}
      <section
        aria-label="Manajemen Anggota dan Kupon"
        className="stagger-item stagger-1 grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <MemberList
          members={members}
          isLoading={isLoadingMembers}
          onDeleteMember={handleRequestDeleteMember}
          onToggleVerify={handleToggleVerify}
          verifyingId={verifyingMemberId}
        />
        <CouponList
          coupons={coupons}
          isLoading={isLoadingCoupons}
          onDeleteCoupon={handleRequestDeleteCoupon}
        />
      </section>

      {/* Modal Buat Kupon Promo */}
      {couponModalOpen && (
        <CouponModal
          isOpen={couponModalOpen}
          formData={newCoupon}
          isSubmitting={isSubmittingCoupon}
          onClose={() => setCouponModalOpen(false)}
          onChange={(upd) => setNewCoupon((prev) => ({ ...prev, ...upd }))}
          onSubmit={handleSaveCoupon}
        />
      )}

      {/* Modal Konfirmasi Hapus */}
      {deleteModalOpen && Boolean(deleteTarget) && (
        <DeleteConfirmationModal
          isOpen={deleteModalOpen}
          target={deleteTarget}
          isDeleting={isDeleting}
          onClose={() => {
            setDeleteModalOpen(false);
            setDeleteTarget(null);
          }}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
};
