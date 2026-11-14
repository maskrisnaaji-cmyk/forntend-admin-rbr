import React from "react";
import type { Metadata } from "next";
import { LoginClient } from "./components/LoginClient";

export const metadata: Metadata = {
  title: "Masuk Portal Admin",
  description:
    "Portal autentikasi administrator dan staff operasional Rumah Budaya Ratna.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginPage() {
  return <LoginClient />;
}
