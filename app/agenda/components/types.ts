export type EventStatus = 'Tiket Tersedia' | 'Tiket Penuh';

export interface EventItem {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  price: string;        // Formatted: "Rp 35.000" (untuk tampilan)
  priceRaw: number;     // Angka asli dari backend
  sold: number;         // Alias booked_count (kompatibilitas)
  booked_count: number; // Tiket terjual/terpesan
  quota: number;        // Total kuota
  remaining_tickets: number;
  is_available: boolean;
  status: EventStatus;
  image?: string;
  category?: string;
}
