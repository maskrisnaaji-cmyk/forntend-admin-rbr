"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { X, QrCode, Coins, Clock, AlertTriangle, CheckCircle2, RefreshCw, Zap } from 'lucide-react';
import { OrderItem } from './types';

interface PaymentDetailModalProps {
  isOpen: boolean;
  order: OrderItem | null;
  onClose: () => void;
  onPaymentSuccess: (orderId: string) => void;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

export const PaymentDetailModal: React.FC<PaymentDetailModalProps> = ({
  isOpen,
  order,
  onClose,
  onPaymentSuccess,
}) => {
  // Hanya 2 metode pembayaran yang didukung untuk kedai: 'qris' dan 'cash' (kasir)
  const initialMethod = (order?.payment_method || order?.payment_type || '').toLowerCase().includes('qris')
    ? 'qris'
    : 'cash';

  const [selectedMethod, setSelectedMethod] = useState<'qris' | 'cash'>(initialMethod);
  const [isChecking, setIsChecking] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isConfirmingCash, setIsConfirmingCash] = useState(false);
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // Sync selectedMethod saat order berubah
  useEffect(() => {
    if (order) {
      const isQris = (order.payment_method || order.payment_type || '').toLowerCase().includes('qris');
      setSelectedMethod(isQris ? 'qris' : 'cash');
      setActionMessage(null);
    }
  }, [order]);

  // ----------------------------------------------------
  // COUNTDOWN TIMER REAL-TIME (30 MENIT)
  // ----------------------------------------------------
  const effectiveExpiredAt = useMemo(() => {
    if (!order) return new Date();
    if (order.expired_at) {
      const parsed = new Date(order.expired_at);
      if (!isNaN(parsed.getTime())) return parsed;
    }
    if (order.created_at) {
      const parsed = new Date(order.created_at);
      if (!isNaN(parsed.getTime())) {
        return new Date(parsed.getTime() + 30 * 60 * 1000);
      }
    }
    // Fallback jika tidak ada timestamp: 30 menit dari waktu sekarang saat modal dibuka
    return new Date(Date.now() + 30 * 60 * 1000);
  }, [order]);

  const [remainingSeconds, setRemainingSeconds] = useState<number>(() => {
    const diff = Math.floor((effectiveExpiredAt.getTime() - Date.now()) / 1000);
    return Math.max(0, diff);
  });

  const [isExpired, setIsExpired] = useState<boolean>(() => {
    if (order?.payment_status === 'EXPIRED') return true;
    return (effectiveExpiredAt.getTime() - Date.now()) <= 0;
  });

  useEffect(() => {
    if (!isOpen || !order) return;

    const calculateRemaining = () => {
      if (order.payment_status === 'PAID') {
        setRemainingSeconds(0);
        setIsExpired(false);
        return;
      }
      if (order.payment_status === 'EXPIRED') {
        setRemainingSeconds(0);
        setIsExpired(true);
        return;
      }
      const now = Date.now();
      const diffSeconds = Math.floor((effectiveExpiredAt.getTime() - now) / 1000);
      if (diffSeconds <= 0) {
        setRemainingSeconds(0);
        setIsExpired(true);
      } else {
        setRemainingSeconds(diffSeconds);
        setIsExpired(false);
      }
    };

    calculateRemaining();
    const interval = setInterval(calculateRemaining, 1000);
    return () => clearInterval(interval);
  }, [isOpen, order, effectiveExpiredAt]);

  if (!isOpen || !order) return null;

  const isPaid = order.payment_status === 'PAID';
  const effectiveIsExpired = !isPaid && (isExpired || order.payment_status === 'EXPIRED');

  // Format MM:SS
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // 1. CEK STATUS PEMBAYARAN MIDTRANS
  const handleCheckStatus = async () => {
    if (effectiveIsExpired || isChecking) return;
    setIsChecking(true);
    setActionMessage(null);
    try {
      const res = await fetch(`${BACKEND_URL}/api/payment/status/${order.id}`);
      const data = await res.json();
      if (data.status?.is_paid || data.status?.transaction_status === 'settlement' || data.status?.transaction_status === 'capture') {
        setActionMessage({ type: 'success', text: '🎉 Pembayaran berhasil diverifikasi lunas!' });
        onPaymentSuccess(order.id);
      } else if (data.status?.is_expired || data.status?.transaction_status === 'expire') {
        setIsExpired(true);
        setActionMessage({ type: 'error', text: 'Transaksi ini telah kedaluwarsa di sistem pembayaran.' });
      } else {
        setActionMessage({ type: 'info', text: 'Status: Menunggu Pembayaran. Pelanggan belum menyelesaikan pembayaran.' });
      }
    } catch (e: any) {
      setActionMessage({ type: 'error', text: 'Gagal mengecek status pembayaran ke server.' });
    } finally {
      setIsChecking(false);
    }
  };

  // 2. SIMULASI LUNAS (MIDTRANS SANDBOX)
  const handleSimulateSettlement = async () => {
    if (effectiveIsExpired || isSimulating) return;
    setIsSimulating(true);
    setActionMessage(null);
    try {
      const rawPrice = order.total_price || Number(String(order.total || '0').replace(/[^0-9]/g, '')) || 35000;
      const res = await fetch(`${BACKEND_URL}/api/payment/simulate-settlement`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.id,
          paymentType: 'qris',
          grossAmount: rawPrice,
        }),
      });
      const data = await res.json();
      if (data.success) {
        // Konfirmasi juga ke endpoint kedai orders
        await fetch(`${BACKEND_URL}/api/kedai/orders/${order.id}/pay`, { method: 'PATCH' }).catch(() => null);
        setActionMessage({ type: 'success', text: '✅ Simulasi Sandbox Berhasil: Pesanan QRIS kini LUNAS!' });
        setTimeout(() => {
          onPaymentSuccess(order.id);
          onClose();
        }, 1200);
      } else {
        setActionMessage({ type: 'error', text: data.message || 'Simulasi pelunasan gagal.' });
      }
    } catch (e: any) {
      setActionMessage({ type: 'error', text: 'Gagal mengirim simulasi pelunasan sandbox.' });
    } finally {
      setIsSimulating(false);
    }
  };

  // 3. KONFIRMASI PEMBAYARAN TUNAI (KASIR)
  const handleConfirmCashPayment = async () => {
    if (effectiveIsExpired || isConfirmingCash) return;
    setIsConfirmingCash(true);
    setActionMessage(null);
    try {
      const res = await fetch(`${BACKEND_URL}/api/kedai/orders/${order.id}/pay`, {
        method: 'PATCH',
      });
      const data = await res.json();
      if (data.success) {
        setActionMessage({ type: 'success', text: '✅ Pembayaran tunai kasir berhasil dikonfirmasi lunas!' });
        setTimeout(() => {
          onPaymentSuccess(order.id);
          onClose();
        }, 1000);
      } else {
        setActionMessage({ type: 'error', text: data.message || 'Gagal mengonfirmasi pembayaran kasir.' });
      }
    } catch (e: any) {
      setActionMessage({ type: 'error', text: 'Gagal menghubungi server untuk konfirmasi bayar kasir.' });
    } finally {
      setIsConfirmingCash(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-md max-h-[92vh] overflow-y-auto rounded-2xl border border-stone-200 bg-white p-5 sm:p-6 shadow-2xl animate-modal-pop">
        {/* Header Modal */}
        <div className="flex items-center justify-between border-b border-brand-cream-accent pb-3">
          <div>
            <h3 className="text-sm font-bold text-brand-text">Konfirmasi &amp; Detail Bayar Kedai</h3>
            <p className="text-[11px] text-brand-muted">Order #{order.id} • {order.table_number || order.table}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-brand-muted hover:bg-brand-cream-card hover:text-brand-text transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          {/* TIMER COUNTDOWN 30 MENIT */}
          {isPaid ? (
            <div className="flex items-center justify-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-2.5 text-xs font-bold text-emerald-700">
              <CheckCircle2 size={16} />
              <span>PEMBAYARAN TELAH LUNAS</span>
            </div>
          ) : effectiveIsExpired ? (
            <div className="flex items-center justify-center gap-2 rounded-xl bg-rose-50 border border-rose-200 px-4 py-2.5 text-xs font-bold text-rose-700">
              <AlertTriangle size={16} />
              <span>WAKTU PEMBAYARAN KEDALUWARSA (00:00)</span>
            </div>
          ) : (
            <div className="flex items-center justify-between rounded-xl bg-amber-50 border border-amber-200 px-4 py-2.5">
              <div className="flex items-center gap-2 text-xs font-medium text-amber-900">
                <Clock size={16} className="text-amber-700" />
                <span>Batas Pembayaran (30 Menit):</span>
              </div>
              <span className="text-sm font-extrabold text-amber-700 tracking-wider">
                {timeFormatted}
              </span>
            </div>
          )}

          {/* Rincian Singkat Pesanan */}
          <div className="rounded-xl border border-brand-cream-accent bg-brand-cream-card/50 p-3.5 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-brand-muted">Nomor Meja</span>
              <span className="font-bold text-brand-text">{order.table_number || order.table}</span>
            </div>
            <div className="flex items-start justify-between text-xs gap-3">
              <span className="text-brand-muted shrink-0">Item</span>
              <span className="font-medium text-brand-text text-right line-clamp-2">{order.items}</span>
            </div>
            <div className="border-t border-brand-cream-accent pt-2 flex items-center justify-between">
              <span className="text-xs font-bold text-brand-text">Total Tagihan</span>
              <span className="text-base font-extrabold text-brand-maroon">{order.total}</span>
            </div>
          </div>

          {/* OPSI METODE PEMBAYARAN KEDAI (HANYA QRIS & BAYAR DI KASIR) */}
          <div>
            <label className="block text-xs font-semibold text-brand-text mb-2">
              Pilihan Metode Pembayaran Kedai:
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setSelectedMethod('qris')}
                disabled={effectiveIsExpired}
                className={`flex items-center justify-center gap-2 rounded-xl border p-2.5 text-xs font-bold transition-all cursor-pointer ${
                  selectedMethod === 'qris'
                    ? 'border-brand-maroon bg-brand-maroon text-white shadow'
                    : 'border-brand-cream-accent bg-white text-brand-text hover:border-brand-maroon/40'
                } ${effectiveIsExpired ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <QrCode size={16} />
                <span>QRIS Nasional</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedMethod('cash')}
                disabled={effectiveIsExpired}
                className={`flex items-center justify-center gap-2 rounded-xl border p-2.5 text-xs font-bold transition-all cursor-pointer ${
                  selectedMethod === 'cash'
                    ? 'border-brand-maroon bg-brand-maroon text-white shadow'
                    : 'border-brand-cream-accent bg-white text-brand-text hover:border-brand-maroon/40'
                } ${effectiveIsExpired ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Coins size={16} />
                <span>Bayar di Kasir</span>
              </button>
            </div>
          </div>

          {/* CONTENT: TAB QRIS (POLA MIDTRANS SANDBOX) */}
          {selectedMethod === 'qris' && (
            <div className="rounded-xl border border-brand-cream-accent bg-white p-4 space-y-3.5">
              <div className="flex items-center justify-between border-b border-brand-cream-accent pb-2">
                <span className="rounded bg-rose-600 px-2 py-0.5 text-[10px] font-black text-white tracking-wider">
                  QRIS
                </span>
                <span className="text-[10px] font-bold text-brand-muted tracking-wider">
                  MIDTRANS SANDBOX
                </span>
                <span className="rounded bg-blue-900 px-2 py-0.5 text-[10px] font-black text-white">
                  GPN
                </span>
              </div>

              {/* Box Gambar QR */}
              <div className="relative mx-auto flex h-48 w-48 items-center justify-center rounded-xl border border-stone-200 bg-white p-2 shadow-inner">
                {order.qr_url ? (
                  <img
                    src={order.qr_url}
                    alt="QRIS Midtrans"
                    className={`h-full w-full object-contain ${effectiveIsExpired ? 'opacity-20' : ''}`}
                  />
                ) : (
                  <div className={`flex flex-col items-center justify-center text-center p-3 ${effectiveIsExpired ? 'opacity-20' : ''}`}>
                    <QrCode size={90} className="text-brand-text mb-1" />
                    <span className="text-[9px] font-mono text-brand-muted">NMID: ID10200392019</span>
                  </div>
                )}

                {/* Overlay Kedaluwarsa */}
                {effectiveIsExpired && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 rounded-xl">
                    <span className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-black text-white shadow-md">
                      KEDALUWARSA
                    </span>
                    <span className="mt-1 text-[10px] font-bold text-rose-600">00:00 Habis</span>
                  </div>
                )}
              </div>

              <p className="text-center text-[11px] text-brand-muted">
                {effectiveIsExpired
                  ? 'Kode QR telah kedaluwarsa dan tidak dapat dipindai lagi.'
                  : 'Pelanggan dapat memindai QRIS ini via m-Banking atau E-Wallet (BCA Mobile, GoPay, OVO, ShopeePay, DANA).'}
              </p>

              {/* Tombol Aksi QRIS */}
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={handleCheckStatus}
                  disabled={effectiveIsExpired || isChecking || isPaid}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand-maroon py-2.5 text-xs font-bold text-white shadow hover:bg-brand-maroon-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <RefreshCw size={14} className={isChecking ? 'animate-spin' : ''} />
                  <span>{isChecking ? 'Mengecek...' : 'Cek Status Pembayaran (Midtrans)'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleSimulateSettlement}
                  disabled={effectiveIsExpired || isSimulating || isPaid}
                  className="w-full flex items-center justify-center gap-2 rounded-xl border border-brand-maroon/30 bg-brand-cream-card py-2 text-xs font-semibold text-brand-maroon hover:bg-brand-cream-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <Zap size={14} />
                  <span>{isSimulating ? 'Memproses Simulasi...' : '⚡ Simulasi Lunas (Demo Sandbox)'}</span>
                </button>
              </div>
            </div>
          )}

          {/* CONTENT: TAB BAYAR DI KASIR */}
          {selectedMethod === 'cash' && (
            <div className="rounded-xl border border-brand-cream-accent bg-white p-4 space-y-3.5">
              <div className="flex items-center gap-2 text-xs font-bold text-brand-text">
                <Coins size={16} className="text-amber-600" />
                <span>Pembayaran Tunai di Meja Kasir</span>
              </div>
              <p className="text-xs text-brand-muted leading-relaxed">
                Pelanggan membayar pesanan secara tunai ke kasir sebesar{' '}
                <strong className="text-brand-maroon">{order.total}</strong>. Tekan tombol di bawah untuk mengonfirmasi bahwa uang telah diterima dan menyelesaikan pesanan.
              </p>

              <button
                type="button"
                onClick={handleConfirmCashPayment}
                disabled={effectiveIsExpired || isConfirmingCash || isPaid}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white shadow hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <CheckCircle2 size={16} />
                <span>{isConfirmingCash ? 'Mengonfirmasi...' : 'Konfirmasi Terima Tunai (Kasir)'}</span>
              </button>
            </div>
          )}

          {/* Action Message Alert */}
          {actionMessage && (
            <div
              className={`rounded-xl px-3.5 py-2.5 text-xs font-medium ${
                actionMessage.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : actionMessage.type === 'error'
                  ? 'bg-rose-50 text-rose-800 border border-rose-200'
                  : 'bg-blue-50 text-blue-800 border border-blue-200'
              }`}
            >
              {actionMessage.text}
            </div>
          )}

          {/* Peringatan jika expired */}
          {effectiveIsExpired && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <AlertTriangle size={14} /> Batas Waktu Pembayaran Telah Habis
              </p>
              <p className="text-[11px] leading-relaxed">
                Batas waktu pembayaran 30 menit dari waktu pesanan dibuat telah kedaluwarsa. Seluruh aksi konfirmasi pembayaran telah dinonaktifkan. Silakan batalkan pesanan ini dan buat pesanan baru jika pelanggan ingin memesan kembali.
              </p>
            </div>
          )}
        </div>

        {/* Footer Modal */}
        <div className="mt-5 border-t border-brand-cream-accent pt-3 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-brand-cream-accent bg-brand-cream-card px-4 py-2 text-xs font-bold text-brand-muted hover:bg-brand-cream-accent hover:text-brand-text transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
