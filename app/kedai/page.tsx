import React from "react";
import type { Metadata } from "next";
import { AdminLayout } from "@/components/AdminLayout";
import { KedaiContent } from "./components/KedaiContent";

export const metadata: Metadata = {
  title: "Kedai Kopi & Order",
  description:
    "Pantau antrean pesanan dapur secara real-time dan kelola katalog menu minuman kopi serta kudapan khas Rumah Budaya Ratna.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function KedaiPage() {
  return (
    <AdminLayout activeTab="kedai">
      <KedaiContent />
    </AdminLayout>
  );
}
