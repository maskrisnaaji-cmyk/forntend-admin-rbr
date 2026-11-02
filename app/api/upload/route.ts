import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export async function POST(request: NextRequest) {
  try {
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (!token) {
      return NextResponse.json(
        { message: 'BLOB_READ_WRITE_TOKEN belum dikonfigurasi di environment.' },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { message: 'File wajib diunggah pada field file.' },
        { status: 400 }
      );
    }

    // Validasi tipe file
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { message: 'Format file harus JPG, JPEG, PNG, atau WEBP.' },
        { status: 400 }
      );
    }

    // Validasi ukuran maksimal (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { message: 'Ukuran file maksimal 5 MB.' },
        { status: 400 }
      );
    }

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-');
    const blob = await put(`uploads/${Date.now()}-${safeName}`, file, {
      access: 'public',
      contentType: file.type,
      token: token,
    });

    return NextResponse.json({
      status: 'success',
      url: blob.url,
    });
  } catch (error: any) {
    console.error('[API /api/upload]', error);
    return NextResponse.json(
      { message: error?.message || 'Gagal mengunggah file ke Vercel Blob.' },
      { status: 500 }
    );
  }
}

