"use client";

import React, { useCallback, useEffect, useState } from 'react';
import { Check, Clock3, RotateCcw, X } from 'lucide-react';
import { AdminLayout } from '@/components/AdminLayout';

type Loan = {
  id: number;
  book_code: string;
  title: string;
  member_name: string;
  member_email?: string;
  rack_location?: string;
  borrow_date: string;
  due_date: string;
  status: 'active' | 'overdue' | 'returned';
  extension_status: 'none' | 'pending' | 'approved' | 'rejected';
  extension_days?: number;
};

const API_URL = 'http://localhost:5000/api/loans';

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(new Date(`${value}T00:00:00`));

export default function PeminjamanPage() {
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

  const updateLoan = async (id: number, action: 'approve_extension' | 'reject_extension' | 'return') => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.message || 'Status peminjaman gagal diperbarui.');
    }
    await fetchLoans();
  };

  const runAction = async (id: number, action: 'approve_extension' | 'reject_extension' | 'return') => {
    try {
      await updateLoan(id, action);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Aksi gagal diproses.');
    }
  };

  return (
    <AdminLayout activeTab="peminjaman">
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold text-brand-text">Peminjaman Buku</h1>
          <p className="text-xs text-brand-muted">
            Konfirmasi pengembalian dan request perpanjangan dari anggota.
          </p>
        </div>

        {error && <div className="rounded-xl bg-rose-50 p-3 text-xs text-rose-700">{error}</div>}
        {loading ? (
          <div className="rounded-2xl border border-brand-cream-accent bg-white p-8 text-center text-sm text-brand-muted">
            Memuat data peminjaman...
          </div>
        ) : loans.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-brand-cream-accent bg-white p-10 text-center text-sm text-brand-muted">
            Belum ada data peminjaman yang tersinkron.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-brand-cream-accent bg-white shadow-sm">
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
                      <p>Pinjam: {formatDate(loan.borrow_date)}</p>
                      <p className="mt-1 font-semibold text-brand-maroon">Tempo: {formatDate(loan.due_date)}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                        loan.status === 'returned'
                          ? 'bg-emerald-50 text-emerald-700'
                          : loan.status === 'overdue'
                            ? 'bg-rose-50 text-rose-700'
                            : 'bg-blue-50 text-blue-700'
                      }`}>
                        {loan.status === 'returned' ? 'Dikembalikan' : loan.status === 'overdue' ? 'Terlambat' : 'Dipinjam'}
                      </span>
                      {loan.extension_status === 'pending' && (
                        <p className="mt-2 flex items-center gap-1 font-bold text-amber-700"><Clock3 size={12} /> Request +{loan.extension_days || 7} hari</p>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-2">
                        {loan.extension_status === 'pending' && (
                          <>
                            <button onClick={() => runAction(loan.id, 'approve_extension')} className="flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-2 font-bold text-white" title="Setujui perpanjangan"><Check size={13} /> Setujui</button>
                            <button onClick={() => runAction(loan.id, 'reject_extension')} className="flex items-center gap-1 rounded-lg bg-rose-600 px-2.5 py-2 font-bold text-white" title="Tolak perpanjangan"><X size={13} /> Tolak</button>
                          </>
                        )}
                        {loan.status !== 'returned' && (
                          <button onClick={() => runAction(loan.id, 'return')} className="flex items-center gap-1 rounded-lg border border-brand-maroon px-2.5 py-2 font-bold text-brand-maroon" title="Konfirmasi buku dikembalikan"><RotateCcw size={13} /> Kembalikan</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
