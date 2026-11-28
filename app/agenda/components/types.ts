export type EventStatus =
  | 'Tiket Tersedia'
  | 'Tiket Penuh'
  | 'Menunggu Persetujuan'
  | 'Pending'
  | 'Ditolak'
  | 'Aktif';

export interface TicketTier {
  id?: number;
  event_id?: number;
  tier_name: 'Presale 1' | 'Presale 2' | 'Reguler' | string;
  tier_order?: number;
  price: number;
  quota: number;
  sold?: number;
  remaining?: number;
  is_active?: boolean;
  is_soldout?: boolean;
  is_current_active?: boolean;
}

export interface EventItem {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  price: string;        // Formatted: "Rp 35.000" atau rentang "Rp 20.000 - Rp 35.000"
  priceRaw: number;     // Harga aktif terendah / acuan backend
  sold: number;         // Tiket terjual murni dari transaksi lunas
  booked_count: number; // Tiket terjual murni dari transaksi lunas
  quota: number;        // Total kuota 3 kategori
  remaining_tickets: number;
  is_available: boolean;
  status: EventStatus;
  status_approval?: 'pending' | 'approved' | 'rejected' | string;
  image?: string;
  category?: string;
  organizer_name?: string;
  organizer_contact?: string;
  organizer_email?: string;
  description?: string;
  ticket_tiers?: TicketTier[];
  presale_tiers?: TicketTier[];
  active_tier?: TicketTier | null;
  active_price?: number;
  active_quota?: number;
  active_remaining?: number;
  current_tier_name?: string | null;
  all_soldout?: boolean;
}
