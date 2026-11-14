import React from "react";
import type { Metadata } from "next";
import { AdminLayout } from "@/components/AdminLayout";
import { PeminjamanContent } from "./components/PeminjamanContent";

export const metadata: Metadata = {
  title: "Peminjaman Buku",
  description:
    "Pantau sirkulasi peminjaman buku dan naskah kuno, persetujuan perpanjangan masa pinjam, serta verifikasi pengembalian buku.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function PeminjamanPage() {
  return (
    <AdminLayout activeTab="peminjaman">
      <PeminjamanContent />
    </AdminLayout>
  );
}
