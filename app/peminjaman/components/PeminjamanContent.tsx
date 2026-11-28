"use client";

import React, { useCallback, useEffect, useState } from 'react';
import { Check, Clock3, RotateCcw, X, RefreshCw } from 'lucide-react';

type Loan = {
  id: number;
  book_code: string;
  title: string;
  member_name: string;
  member_email?: string;
  rack_location?: string;
  borrow_date: string;
  borrow_at?: string | null;
  due_date: string;
  returned_at?: string | null;
  status: 'requested' | 'active' | 'overdue' | 'returned' | 'rejected';
  request_status: 'none' | 'pending' | 'approved' | 'rejected';
  extension_status: 'none' | 'pending' | 'approved' | 'rejected';
  extension_days?: number;
};

const API_URL = 'http://localhost:5000/api/loans';

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(new Date(`${value}T00:00:00`));

const formatWIBDate = (value: string | null | undefined) => {
  if (!value) return 'Belum dikembalikan';
  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeZone: 'Asia/Jakarta',
  }).format(new Date(value));
};

const formatWIBTime = (value: string | null | undefined) => {
  if (!value) return '-';
  return `${new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'Asia/Jakarta',
  }).format(new Date(value))} WIB`;
};

export const PeminjamanContent: React.FC = () => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchLoans = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Gagal mengambil data peminjaman.');
      setLoans(await response.json());
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Backend belum tersedia.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLoans();
  }, [fetchLoans]);

  const updateLoan = async (id: number, action: 'approve_request' | 'reject_request' | 'approve_extension' | 'reject_extension' | 'return') => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.message || 'Status peminjaman gagal diperbarui.');
    }

    // Panggil sinkronisasi backend dan perbarui antrean pinjam
    await fetch('http://localhost:5000/api/loans/sync').catch(() => null);
    await fetchLoans();

    // Trigger update data daftar buku di modul Pustaka agar status buku langsung kembali TERSEDIA
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('refresh_books_catalog'));
      localStorage.setItem('rbr_books_updated_at', Date.now().toString());
    }
  };

  const runAction = async (id: number, action: 'approve_request' | 'reject_request' | 'approve_extension' | 'reject_extension' | 'return') => {
    try {
      await updateLoan(id, action);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Aksi gagal diproses.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Seksi Peminjaman — muncul pertama (delay 0ms) */}
      <header className="stagger-item stagger-0 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-brand-text">Peminjaman Buku</h1>
          <p className="text-xs text-brand-muted">
            Konfirmasi pengajuan, pengembalian, dan request perpanjangan dari anggota.
          </p>
        </div>
        <button
          type="button"
          onClick={fetchLoans}
          disabled={loading}
          className="flex items-center justify-center gap-1.5 rounded-xl border border-brand-cream-accent bg-brand-cream-card px-3.5 py-2 text-xs font-semibold text-brand-text hover:bg-brand-cream-accent transition-colors cursor-pointer disabled:opacity-60 w-fit"
          title="Refresh data peminjaman"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>Refresh Data</span>
        </button>
      </header>

      {error && <div className="rounded-xl bg-rose-50 p-3 text-xs text-rose-700">{error}</div>}

      <section aria-label="Tabel Data Peminjaman">
        {loading ? (
          <div className="stagger-item stagger-1 rounded-2xl border border-brand-cream-accent bg-white p-8 text-center text-sm text-brand-muted">
            Memuat data peminjaman...
          </div>
        ) : loans.length === 0 ? (
          <div className="stagger-item stagger-1 rounded-2xl border border-dashed border-brand-cream-accent bg-white p-10 text-center text-sm text-brand-muted">
            Belum ada data peminjaman yang tersinkron.
          </div>
        ) : (
          <div className="stagger-item stagger-1 overflow-x-auto rounded-2xl border border-brand-cream-accent bg-white shadow-sm">
            <table className="w-full min-w-[900px] text-left text-xs">
              <thead className="border-b border-brand-cream-accent bg-brand-cream-card text-[10px] uppercase tracking-wide text-brand-muted">
                <tr>
                  <th className="px-5 py-4">Buku & Anggota</th>
                  <th className="px-5 py-4">Lokasi Rak</th>
                  <th className="px-5 py-4">Masa Pinjam</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-cream-accent/70">
                {loans.map((loan) => (
                  <tr key={loan.id}>
                    <td className="px-5 py-4">
                      <p className="font-bold text-brand-text">{loan.title}</p>
                      <p className="mt-1 text-[11px] text-brand-muted">{loan.book_code}</p>
                      <p className="mt-2 font-semibold text-brand-maroon">{loan.member_name}</p>
                      <p className="text-[11px] text-brand-muted">{loan.member_email || '-'}</p>
                    </td>
                    <td className="px-5 py-4 font-semibold text-brand-text">{loan.rack_location || 'Belum ditentukan'}</td>
                    <td className="px-5 py-4 text-brand-muted">
                      <p>Pinjam: {loan.borrow_at ? formatWIBDate(loan.borrow_at) : formatDate(loan.borrow_date)}</p>
                      <p className="mt-1">Waktu Pinjam: {formatWIBTime(loan.borrow_at)}</p>
                      <p className="mt-1 font-semibold text-brand-maroon">Tempo: {formatDate(loan.due_date)}</p>
                      <p className="mt-1">Tgl Kembali: {formatWIBDate(loan.returned_at)}</p>
                      <p className="mt-1">Waktu Kembali: {formatWIBTime(loan.returned_at)}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                          loan.status === 'returned'
                          ? 'bg-emerald-50 text-emerald-700'
                          : loan.status === 'rejected'
                          ? 'bg-rose-50 text-rose-700'
                            : loan.status === 'overdue'
                            ? 'bg-rose-50 text-rose-700'
                            : 'bg-blue-50 text-blue-700'
                      }`}>
                        {loan.status === 'requested' ? 'Menunggu Konfirmasi' : loan.status === 'rejected' ? 'Ditolak' : loan.status === 'returned' ? 'Dikembalikan' : loan.status === 'overdue' ? 'Terlambat' : 'Dipinjam'}
                      </span>
                      {loan.request_status === 'pending' && (
                        <p className="mt-2 flex items-center gap-1 font-bold text-amber-700"><Clock3 size={12} /> Pengajuan baru</p>
                      )}
                      {loan.extension_status === 'pending' && (
                        <p className="mt-2 flex items-center gap-1 font-bold text-amber-700"><Clock3 size={12} /> Request +{loan.extension_days || 7} hari</p>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-2">
                        {loan.request_status === 'pending' && (
                          <>
                            <button onClick={() => runAction(loan.id, 'approve_request')} className="flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-2 font-bold text-white cursor-pointer" title="Setujui pengajuan"><Check size={13} /> Setujui</button>
                            <button onClick={() => runAction(loan.id, 'reject_request')} className="flex items-center gap-1 rounded-lg bg-rose-600 px-2.5 py-2 font-bold text-white cursor-pointer" title="Tolak pengajuan"><X size={13} /> Tolak</button>
                          </>
                        )}
                        {loan.extension_status === 'pending' && (
                          <>
                            <button onClick={() => runAction(loan.id, 'approve_extension')} className="flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-2 font-bold text-white cursor-pointer" title="Setujui perpanjangan"><Check size={13} /> Setujui</button>
                            <button onClick={() => runAction(loan.id, 'reject_extension')} className="flex items-center gap-1 rounded-lg bg-rose-600 px-2.5 py-2 font-bold text-white cursor-pointer" title="Tolak perpanjangan"><X size={13} /> Tolak</button>
                          </>
                        )}
                        {(loan.status === 'active' || loan.status === 'overdue') && (
                          <button onClick={() => runAction(loan.id, 'return')} className="flex items-center gap-1 rounded-lg border border-brand-maroon px-2.5 py-2 font-bold text-brand-maroon cursor-pointer hover:bg-brand-maroon hover:text-white transition-colors" title="Konfirmasi buku dikembalikan"><RotateCcw size={13} /> Kembalikan</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};
