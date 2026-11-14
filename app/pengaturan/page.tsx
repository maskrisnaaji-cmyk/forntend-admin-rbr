import React from "react";
import type { Metadata } from "next";
import { AdminLayout } from "@/components/AdminLayout";
import { PengaturanContent } from "./components/PengaturanContent";

export const metadata: Metadata = {
  title: "Pusat Pengaturan",
  description:
    "Konfigurasi profil administrator, preferensi operasional sistem Rumah Budaya Ratna, manajemen sesi, dan keamanan akun.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function PengaturanPage() {
  return (
    <AdminLayout activeTab="pengaturan">
      <PengaturanContent />
    </AdminLayout>
  );
}
