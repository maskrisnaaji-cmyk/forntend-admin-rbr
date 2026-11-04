import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const q = searchParams.get('q') || '';
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  try {
    const res = await fetch(`${backendUrl}/api/search?q=${encodeURIComponent(q)}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      return NextResponse.json(
        { status: 'error', message: 'Gagal mengambil data pencarian dari backend.' },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('[API /api/search proxy error]', error);
    return NextResponse.json(
      {
        status: 'error',
        message: 'Tidak dapat terhubung ke server backend Express.',
        error: error.message,
      },
      { status: 502 }
    );
  }
}

