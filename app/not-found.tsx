import Link from 'next/link';

// not-found.tsx — halaman 404 otomatis dipanggil oleh Next.js App Router
// saat notFound() dipanggil di Server Component atau route tidak ditemukan
export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
      <div className="text-9xl font-bold text-amber-700 leading-none">404</div>
      <h2 className="text-2xl font-semibold text-gray-800">Halaman Tidak Ditemukan</h2>
      <p className="text-gray-500 max-w-md">
        Halaman yang Anda cari tidak ada, mungkin telah dipindahkan, atau URL yang dimasukkan
        salah.
      </p>
      <Link
        href="/dashboard"
        className="mt-2 inline-block rounded-md bg-amber-700 px-6 py-2 text-white font-medium hover:bg-amber-800 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
      >
        ← Kembali ke Dashboard
      </Link>
    </div>
  );
}

