export type EventStatus =
  | 'Tiket Tersedia'
  | 'Tiket Penuh'
  | 'Menunggu Persetujuan'
  | 'Pending'
  | 'Ditolak'
  | 'Aktif';

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
  status_approval?: 'pending' | 'approved' | 'rejected' | string;
  image?: string;
  category?: string;
  organizer_name?: string;
  organizer_contact?: string;
  organizer_email?: string;
  description?: string;
}
