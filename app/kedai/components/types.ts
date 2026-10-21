export type OrderStatus = 'menunggu' | 'disiapkan' | 'selesai';

export interface OrderItem {
  id: string;
  table: string;
  items: string;
  total: string;
  status: OrderStatus;
  time: string;
}

export type MenuCategory = 'Kopi Nusantara' | 'Manual Brew' | 'Non-Kopi' | 'Camilan Nusantara';
export type MenuStatus = 'Tersedia' | 'Habis';

export interface MenuItem {
  id: string;
  name: string;
  category: MenuCategory;
  price: number;
  description: string;
  status: MenuStatus;
  imageUrl?: string;
}

export const INITIAL_MENU_ITEMS: MenuItem[] = [
  {
    id: 'MN-001',
    name: 'Es Kopi Susu Creamy',
    category: 'Kopi Nusantara',
    price: 28000,
    description: 'Espresso robusta & arabika blend dengan sirup gula aren murni organik dan susu segar creamy khas racikan barista.',
    status: 'Tersedia',
    imageUrl: '/kopi_susu.jpg',
  },
  {
    id: 'MN-002',
    name: 'Kopi Tubruk',
    category: 'Manual Brew',
    price: 32000,
    description: 'Seduhan manual pour-over V60 berkarakter sweet milk chocolate, floral aroma, dan balance acidity yang halus.',
    status: 'Tersedia',
    imageUrl: '/kopi_tubruk.jpg',
  },
  {
    id: 'MN-003',
    name: 'Wedang Uwuh Rempah',
    category: 'Non-Kopi',
    price: 22000,
    description: 'Racikan rempah daun kayu secang, cengkeh, kayu manis, jahe bakar keprok, dan pemanis alami gula batu.',
    status: 'Tersedia',
    imageUrl: '/wedang_uwuh.jpg',
  },
  {
    id: 'MN-004',
    name: 'Americano',
    category: 'Manual Brew',
    price: 25000,
    description: 'Perpaduan kopi yang sudah di carikan dan dicampur air',
    status: 'Tersedia',
    imageUrl: '/americano.jpg',
  },
  {
    id: 'MN-005',
    name: 'Pisang Goreng Keju',
    category: 'Camilan Nusantara',
    price: 24000,
    description: 'Pisang kepok madu goreng tepung renyah dengan taburan keju cheddar parut melimpah dan drizzle saus gula aren.',
    status: 'Habis',
    imageUrl: '/pisang_goreng_keju.jpg',
  },
];
