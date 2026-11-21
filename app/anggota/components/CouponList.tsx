"use client";

import React from 'react';
import { Trash2, Tag, ShieldCheck, Users } from 'lucide-react';
import { PromoCoupon } from './types';

interface CouponListProps {
  coupons: PromoCoupon[];
  isLoading?: boolean;
  onDeleteCoupon: (coupon: PromoCoupon) => void;
}

export const CouponList: React.FC<CouponListProps> = ({
  coupons,
  isLoading = false,
  onDeleteCoupon,
}) => {
  return (
    <div className="rounded-2xl border border-brand-cream-accent bg-white p-4 sm:p-5 shadow-sm">
      <div className="mb-3.5 flex items-center justify-between">
        <h3 className="text-sm font-bold text-brand-text">Kupon Promo Aktif</h3>
        <span className="text-[11px] font-semibold text-brand-muted">
          Total: {coupons.length} Kupon
        </span>
      </div>

      {isLoading ? (
        <div className="space-y-3 py-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-20 animate-pulse rounded-xl border border-dashed border-brand-cream-accent bg-brand-cream-card/50"
            />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {coupons.map((coupon) => {
            const isMaroon = coupon.theme !== 'amber';
            const isPercent =
              coupon.discount_type === 'percent' ||
              coupon.discount_type === 'percentage' ||
              coupon.discount_type === '%';

            let discountLabel = '';
            if (coupon.discount_value) {
              discountLabel = isPercent
                ? `${coupon.discount_value}% OFF`
                : `Potongan Rp ${Number(coupon.discount_value).toLocaleString('id-ID')}`;
            }

            const isVerifiedOnly = coupon.target_member === 'verified';

            return (
              <div
                key={coupon.id}
                className={`relative rounded-xl border border-dashed p-3.5 transition-all ${
                  isMaroon
                    ? 'border-brand-maroon/40 bg-rose-50/40 hover:border-brand-maroon'
                    : 'border-amber-600/40 bg-amber-50/40 hover:border-amber-600'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-mono text-sm font-extrabold tracking-wider ${
                          isMaroon ? 'text-brand-maroon' : 'text-amber-800'
                        }`}
                      >
                        {coupon.code}
                      </span>

                      {discountLabel && (
                        <span
                          className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-bold ${
                            isMaroon
                              ? 'bg-brand-maroon/10 text-brand-maroon'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          <Tag size={10} />
                          {discountLabel}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-brand-muted">
                      {coupon.desc || coupon.description}
                    </p>

                    <div className="flex items-center gap-2 pt-0.5">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-medium ${
                          isVerifiedOnly
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-stone-100 text-stone-600'
                        }`}
                      >
                        {isVerifiedOnly ? (
                          <>
                            <ShieldCheck size={10} /> Khusus Member Terverifikasi
                          </>
                        ) : (
                          <>
                            <Users size={10} /> Semua Pengguna
                          </>
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-bold text-white ${
                        isMaroon ? 'bg-brand-maroon' : 'bg-amber-700'
                      }`}
                    >
                      {coupon.status || 'Aktif'}
                    </span>
                    <button
                      type="button"
                      onClick={() => onDeleteCoupon(coupon)}
                      title="Hapus Kupon Promo"
                      className="rounded-lg p-1.5 text-brand-muted transition-colors hover:bg-rose-100 hover:text-rose-600 cursor-pointer"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {coupons.length === 0 && (
            <div className="rounded-xl border border-dashed border-brand-cream-accent p-8 text-center text-xs text-brand-muted">
              Belum ada kupon promo aktif. Klik tombol &ldquo;Buat Kupon Promo&rdquo; di atas untuk menambahkan.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CouponList;
