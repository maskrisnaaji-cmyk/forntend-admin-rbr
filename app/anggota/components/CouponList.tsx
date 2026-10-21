"use client";

import React from 'react';
import { Trash2 } from 'lucide-react';
import { PromoCoupon } from './types';

interface CouponListProps {
  coupons: PromoCoupon[];
  onDeleteCoupon: (coupon: PromoCoupon) => void;
}

export const CouponList: React.FC<CouponListProps> = ({ coupons, onDeleteCoupon }) => {
  return (
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
                  onClick={() => onDeleteCoupon(coupon)}
                  title="Hapus Kupon"
                  className="rounded-lg p-1 text-brand-muted transition-colors hover:bg-rose-50 hover:text-rose-600 cursor-pointer"
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
  );
};

export default CouponList;
