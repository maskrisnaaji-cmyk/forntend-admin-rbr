import React from "react";
import type { Metadata } from "next";
import { AdminLayout } from "@/components/AdminLayout";
import { AnggotaContent } from "./components/AnggotaContent";

export const metadata: Metadata = {
  title: "Anggota & Kupon Promo",
  description:
    "Kelola data anggota komunitas seni dan literatur Rumah Budaya Ratna, verifikasi akun, dan kelola kupon diskon promo.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AnggotaPage() {
  return (
    <AdminLayout activeTab="anggota">
      <AnggotaContent />
    </AdminLayout>
  );
}
