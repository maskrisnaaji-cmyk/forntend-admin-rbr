export interface MemberItem {
  id: number;
  name: string;
  email: string;
  role: string;
  visits: string;
  status: string;
}

export interface PromoCoupon {
  id: number;
  code: string;
  desc: string;
  status: string;
  theme: 'maroon' | 'amber';
}
