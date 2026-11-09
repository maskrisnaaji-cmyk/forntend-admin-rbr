'use client';

import { useEffect } from 'react';

// global-error.tsx menggantikan root layout saat error kritis,
// sehingga wajib menyertakan <html> dan <body> sendiri.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[Global Error]', {
      message: error.message,
      digest: error.digest,
      timestamp: new Date().toISOString(),
    });
  }, [error]);

  return (
    <html lang="id">
      <body
        style={{
          margin: 0,
          fontFamily: 'system-ui, sans-serif',
          backgroundColor: '#fafafa',
        }}
      >
        <div
          style={{
            display: 'flex',
            minHeight: '100vh',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            padding: '32px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '56px' }}>💥</div>
          <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#1f2937', margin: 0 }}>
            Aplikasi Mengalami Masalah
          </h2>
          <p style={{ color: '#6b7280', maxWidth: '480px', margin: 0 }}>
            Maaf, terjadi kesalahan kritis. Silakan muat ulang halaman atau coba beberapa saat
            lagi.
          </p>
          <button
            onClick={() => reset()}
            style={{
              marginTop: '8px',
              padding: '10px 28px',
              backgroundColor: '#b45309',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '15px',
              fontWeight: 500,
            }}
          >
            ↺ Muat Ulang
          </button>
        </div>
      </body>
    </html>
  );
}

