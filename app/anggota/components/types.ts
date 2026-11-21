export interface MemberItem {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  role: string;
  visits: string;
  visit_count?: number;
  is_verified?: number | boolean;
  status: 'Terverifikasi' | 'Menunggu Verifikasi' | string;
  createdAt?: string;
}

export interface PromoCoupon {
  id: number;
  code: string;
  desc: string;
  description?: string;
  discount_type?: 'percent' | 'fixed' | string;
  discount_value?: number;
  target_member?: 'all' | 'verified' | string;
  is_active?: number | boolean;
  status: string;
  theme: 'maroon' | 'amber' | string;
  created_at?: string;
}

export interface CouponFormData {
  code: string;
  desc: string;
  discount_type: 'percent' | 'fixed';
  discount_value: number | string;
  target_member: 'all' | 'verified';
  theme: 'maroon' | 'amber';
}
