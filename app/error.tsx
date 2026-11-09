'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error server-side tanpa data sensitif
    console.error('[App Error]', {
      message: error.message,
      digest: error.digest,
      timestamp: new Date().toISOString(),
    });
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
      <div className="text-6xl">⚠️</div>
      <h2 className="text-2xl font-semibold text-gray-800">Terjadi Kesalahan</h2>
      <p className="text-gray-500 max-w-md">
        Maaf, terjadi kesalahan yang tidak terduga. Silakan coba lagi atau hubungi administrator
        jika masalah berlanjut.
      </p>

      {/* Stack trace hanya tampil di development, TIDAK di production */}
      {process.env.NODE_ENV !== 'production' && (
        <pre className="rounded-md bg-red-50 p-4 text-left text-sm text-red-700 max-w-xl w-full overflow-auto border border-red-200">
          {error.message}
        </pre>
      )}

      <button
        onClick={() => reset()}
        className="mt-2 rounded-md bg-amber-700 px-6 py-2 text-white font-medium hover:bg-amber-800 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
      >
        ↺ Coba Lagi
      </button>
    </div>
  );
}

