/**
 * Helper normalisasi tanggal ke format standar ISO YYYY-MM-DD
 * Mendukung format input teks Indonesia seperti "Sabtu, 28 September 2026"
 * atau format ISO YYYY-MM-DD agar aman disimpan ke database MySQL.
 */
export function normalizeDateToISO(dateStr: string | null | undefined): string {
  if (!dateStr || !dateStr.trim()) return '';

  const clean = dateStr.trim();

  // 1. Cek jika sudah berformat YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(clean)) {
    return clean;
  }

  // 2. Cek jika ISO String dengan waktu (misal: 2026-09-28T00:00:00.000Z)
  const isoMatch = clean.match(/^(\d{4}-\d{2}-\d{2})/);
  if (isoMatch) {
    return isoMatch[1];
  }

  // 3. Parser tanggal Indonesia e.g. "Sabtu, 28 September 2026" atau "28 September 2026"
  const monthMap: Record<string, string> = {
    januari: '01',
    februari: '02',
    maret: '03',
    april: '04',
    mei: '05',
    juni: '06',
    juli: '07',
    agustus: '08',
    september: '09',
    oktober: '10',
    november: '11',
    desember: '12',
    jan: '01',
    feb: '02',
    mar: '03',
    apr: '04',
    jun: '06',
    jul: '07',
    agu: '08',
    agust: '08',
    sep: '09',
    okt: '10',
    nov: '11',
    des: '12',
  };

  const regex = /(\d{1,2})\s+([a-zA-Z]+)\s+(\d{4})/;
  const match = clean.toLowerCase().match(regex);
  if (match) {
    const day = match[1].padStart(2, '0');
    const monthName = match[2];
    const year = match[3];
    const month = monthMap[monthName];
    if (month && Number(year) >= 2000 && Number(year) <= 2100) {
      return `${year}-${month}-${day}`;
    }
  }

  // Fallback: coba parsing dengan Date() bawaan JS
  const parsed = new Date(clean);
  if (!isNaN(parsed.getTime())) {
    const y = parsed.getFullYear();
    // Cegah tahun 1899 atau tahun abnormal
    if (y >= 2000 && y <= 2100) {
      const m = String(parsed.getMonth() + 1).padStart(2, '0');
      const d = String(parsed.getDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    }
  }

  return clean;
}

/**
 * Format tanggal ISO YYYY-MM-DD ke teks bahasa Indonesia yang ramah pembaca
 */
export function formatISODateToIndonesian(isoStr: string | null | undefined): string {
  if (!isoStr || !isoStr.trim()) return '';

  const clean = isoStr.trim();
  const match = clean.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return clean;

  const year = match[1];
  const monthIndex = parseInt(match[2], 10) - 1;
  const day = parseInt(match[3], 10);

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
  ];

  const monthName = monthNames[monthIndex] || match[2];
  return `${day} ${monthName} ${year}`;
}

/**
 * Format relative time (e.g. 'Baru saja', '1 mnt lalu', '5 mnt lalu', '1 jam lalu')
 * Berdasarkan timestamp pembayaran (paid_at / payment_time / updated_at saat lunas) dengan fallback ke created_at.
 */
export function formatOrderRelativeTime(
  order: {
    paid_at?: string | null;
    payment_time?: string | null;
    updated_at?: string | null;
    created_at?: string | null;
    payment_status?: string | null;
    time?: string | null;
    time_ago?: string | null;
  },
  now: number = Date.now()
): string {
  const paymentStatus = String(order.payment_status || '').toUpperCase();
  const isPaid = paymentStatus === 'PAID' || paymentStatus === 'SETTLEMENT' || paymentStatus === 'CAPTURE';

  let timeSource: string | null | undefined = null;
  if (isPaid) {
    timeSource = order.paid_at || order.payment_time || order.updated_at || order.created_at;
  } else {
    timeSource = order.created_at || order.paid_at || order.payment_time || order.updated_at;
  }

  if (!timeSource || typeof timeSource !== 'string' || !timeSource.trim()) {
    return order.time || order.time_ago || 'Baru saja';
  }

  let date = new Date(timeSource);
  if (isNaN(date.getTime()) && timeSource.includes(' ')) {
    date = new Date(timeSource.replace(' ', 'T'));
  }

  if (isNaN(date.getTime())) {
    return order.time || order.time_ago || 'Baru saja';
  }

  const diffMs = Math.max(0, now - date.getTime());
  const diffSec = Math.floor(diffMs / 1000);

  if (diffSec < 60) {
    return 'Baru saja';
  }

  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) {
    return `${diffMin} mnt lalu`;
  }

  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) {
    return `${diffHours} jam lalu`;
  }

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} hari lalu`;
}

