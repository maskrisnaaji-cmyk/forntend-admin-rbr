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

