import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "Rumah Budaya Ratna - Pusat Kendali Admin",
    template: "%s | Rumah Budaya Ratna",
  },
  description:
    "Pusat Kendali Operasional Terpadu Rumah Budaya Ratna - Manajemen Kedai Kopi, Pustaka Naskah Kuno, Agenda Budaya, dan Keanggotaan Komunitas.",
  keywords: ["Rumah Budaya Ratna", "Admin", "Pustaka", "Kedai Kopi", "Agenda Budaya", "Manajemen"],
  authors: [{ name: "Rumah Budaya Ratna" }],
  creator: "Rumah Budaya Ratna",
  publisher: "Rumah Budaya Ratna",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Rumah Budaya Ratna - Panel Operasional Admin",
    description:
      "Pusat Kendali Operasional Terpadu Rumah Budaya Ratna - Pengelolaan Kedai, Pustaka Naskah, Agenda Budaya, dan Keanggotaan.",
    url: "https://rumahbudayaratna.id",
    siteName: "Rumah Budaya Ratna",
    locale: "id_ID",
    type: "website",
    images: [
      {
        url: "/rbr.jpg",
        width: 800,
        height: 600,
        alt: "Logo Rumah Budaya Ratna",
      },
    ],
  },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      "max-video-preview": -1,
      "max-image-preview": "none",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/rbr.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
