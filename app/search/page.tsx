import React from "react";
import type { Metadata } from "next";
import { AdminLayout } from "@/components/AdminLayout";
import { SearchContent } from "./components/SearchContent";

export const metadata: Metadata = {
  title: "Pencarian Universal Sistem",
  description:
    "Pencarian terpadu data buku pustaka, menu dan pesanan kedai, agenda budaya, serta keanggotaan Rumah Budaya Ratna.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SearchPage() {
  return (
    <AdminLayout activeTab="search">
      <SearchContent />
    </AdminLayout>
  );
}
