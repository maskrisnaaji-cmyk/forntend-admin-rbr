/**
 * Helper pemformatan mata uang Rupiah standar Indonesia (id-ID)
 * Mengonversi angka atau string desimal (seperti 5000000.00) ke format "Rp 5.000.000" atau "Rp 25.000".
 */
export function formatRupiah(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === '') {
    return 'Rp 0';
  }

  let numeric: number;
  if (typeof value === 'number') {
    numeric = Math.round(value);
  } else {
    const cleanStr = String(value).trim();
    if (cleanStr.toLowerCase() === 'gratis' || cleanStr.toLowerCase() === 'free') {
      return 'Gratis';
    }
    // Jika format desimal seperti "5000000.00"
    const cleaned = cleanStr.replace(/[^0-9.-]/g, '');
    const parsed = parseFloat(cleaned);
    if (isNaN(parsed)) return 'Rp 0';
    numeric = Math.round(parsed);
  }

  if (numeric === 0) {
    return 'Rp 0';
  }

  const formattedNumber = new Intl.NumberFormat('id-ID', {
    maximumFractionDigits: 0,
  }).format(numeric);

  return `Rp ${formattedNumber}`;
}

export default formatRupiah;

