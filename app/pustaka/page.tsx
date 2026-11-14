import React from "react";
import type { Metadata } from "next";
import { AdminLayout } from "@/components/AdminLayout";
import { PustakaContent } from "./components/PustakaContent";

export const metadata: Metadata = {
  title: "Pustaka & Katalog Naskah",
  description:
    "Kelola koleksi naskah kuno, buku sejarah, arsip literatur, dan aktivitas peminjaman Rumah Budaya Ratna.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function PustakaPage() {
  return (
    <AdminLayout activeTab="pustaka">
      <PustakaContent />
    </AdminLayout>
  );
}
