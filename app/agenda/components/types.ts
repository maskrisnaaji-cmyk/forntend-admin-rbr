export type EventStatus =
  | 'Tiket Tersedia'
  | 'Tiket Penuh'
  | 'Menunggu Persetujuan'
  | 'Pending'
  | 'Ditolak'
  | 'Aktif';

export interface TicketTier {
  id?: number;
  tier_name: 'Presale' | 'Reguler' | 'OTS' | string;
  tier_order?: number;
  price: number;
  quota: number;
  sold?: number;
  is_active?: boolean;
}

export interface EventItem {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  price: string;        // Formatted: "Rp 35.000" atau rentang "Rp 20.000 - Rp 35.000"
  priceRaw: number;     // Harga aktif terendah / acuan backend
  sold: number;         // Tiket terjual murni dari transaksi lunas (bawaan seed direset ke 0)
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
}

