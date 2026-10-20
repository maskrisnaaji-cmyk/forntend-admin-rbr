"use client";

import React, { useState } from 'react';
import {
  Coffee,
  Plus,
  Search,
  Clock,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Pencil,
  X,
  UtensilsCrossed,
  Tag,
  Check,
  PackageX,
  ShoppingBag,
  ImageUp,
} from 'lucide-react';

type OrderStatus = 'menunggu' | 'disiapkan' | 'selesai';

interface OrderItem {
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

const INITIAL_MENU_ITEMS: MenuItem[] = [
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

export const KedaiView = () => {
  // 1. SUB-TAB SWITCHER STATE
  const [activeSubTab, setActiveSubTab] = useState<'antrean' | 'katalog'>('antrean');

  // ----------------------------------------------------
  // ORDER STATE & HANDLERS (EXISTING - STRICTLY PRESERVED)
  // ----------------------------------------------------
  const [orders, setOrders] = useState<OrderItem[]>([
    { id: 'RBR-1042', table: 'Meja 04', items: '1x Kopi Susu Creamy Gula Aren, 1x Americano Origin, 1x Pisang Goreng', total: 'Rp 65.000', status: 'disiapkan', time: '10 menit lalu' },
    { id: 'RBR-1043', table: 'Meja 09', items: '2x Wedang Uwuh Rempah Khas, 1x Jadah Bakar Serundeng Gurih', total: 'Rp 45.000', status: 'menunggu', time: '5 menit lalu' },
    { id: 'RBR-1041', table: 'Meja 01', items: '1x Single Origin V60 Flores Bajawa, 1x Cirebon Rujak', total: 'Rp 52.000', status: 'selesai', time: '25 menit lalu' },
    { id: 'RBR-1040', table: 'Meja 03', items: '2x Espresso Double Shot, 2x Croissant Butter', total: 'Rp 78.000', status: 'selesai', time: '40 menit lalu' },
  ]);

  const [filter, setFilter] = useState('semua');
  const [searchQuery, setSearchQuery] = useState('');

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<OrderItem | null>(null);

  const [formModalOpen, setFormModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Partial<OrderItem>>({
    table: '',
    items: '',
    total: '',
    status: 'menunggu',
  });

  const handleOpenCreate = () => {
    setIsEditing(false);
    setCurrentOrder({
      table: 'Meja 05',
      items: '',
      total: 'Rp 45.000',
      status: 'menunggu',
      time: 'Baru saja',
    });
    setFormModalOpen(true);
  };

  const handleOpenEdit = (order: OrderItem) => {
    setIsEditing(true);
    setCurrentOrder(order);
    setFormModalOpen(true);
  };

  const handleCycleStatus = (orderId: string) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          const nextStatusMap: Record<OrderStatus, OrderStatus> = {
            menunggu: 'disiapkan',
            disiapkan: 'selesai',
            selesai: 'menunggu',
          };
          return { ...order, status: nextStatusMap[order.status] };
        }
        return order;
      })
    );
  };

  const handleSaveOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentOrder.table || !currentOrder.items) return;

    if (isEditing && currentOrder.id) {
      setOrders((prev) =>
        prev.map((o) => (o.id === currentOrder.id ? (currentOrder as OrderItem) : o))
      );
    } else {
      const randomId = `RBR-${Math.floor(1000 + Math.random() * 9000)}`;
      const newOrder: OrderItem = {
        id: currentOrder.id || randomId,
        table: currentOrder.table || 'Meja 01',
        items: currentOrder.items || '',
        total: currentOrder.total || 'Rp 0',
        status: (currentOrder.status as OrderStatus) || 'menunggu',
        time: 'Baru saja',
      };
      setOrders((prev) => [newOrder, ...prev]);
    }
    setFormModalOpen(false);
  };

  const handleRequestDelete = (order: OrderItem) => {
    setOrderToDelete(order);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (orderToDelete) {
      setOrders((prev) => prev.filter((o) => o.id !== orderToDelete.id));
      setOrderToDelete(null);
    }
    setDeleteModalOpen(false);
  };

  const filteredOrders = orders.filter((o) => {
    const matchFilter = filter === 'semua' ? true : o.status === filter;
    const matchSearch =
      searchQuery.trim() === ''
        ? true
        : o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          o.table.toLowerCase().includes(searchQuery.toLowerCase()) ||
          o.items.toLowerCase().includes(searchQuery.toLowerCase());
    return matchFilter && matchSearch;
  });

  // ----------------------------------------------------
  // MENU CATALOG STATE & HANDLERS
  // ----------------------------------------------------
  const [menuItems, setMenuItems] = useState<MenuItem[]>(INITIAL_MENU_ITEMS);
  const [menuCategoryFilter, setMenuCategoryFilter] = useState<string>('semua');
  const [menuSearchQuery, setMenuSearchQuery] = useState<string>('');

  // Menu Modal State
  const [menuModalOpen, setMenuModalOpen] = useState(false);
  const [isEditingMenu, setIsEditingMenu] = useState(false);
  const [menuFormData, setMenuFormData] = useState<{
    id: string;
    name: string;
    category: MenuCategory;
    price: number | '';
    description: string;
    status: MenuStatus;
    imageUrl: string;
  }>({
    id: '',
    name: '',
    category: 'Kopi Nusantara',
    price: '',
    description: '',
    status: 'Tersedia',
    imageUrl: '',
  });

  // Image upload preview state
  const [imagePreview, setImagePreview] = useState<string>('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setImagePreview(objectUrl);
    setMenuFormData((prev) => ({ ...prev, imageUrl: objectUrl }));
  };

  // Menu Delete Confirmation Modal
  const [menuDeleteModalOpen, setMenuDeleteModalOpen] = useState(false);
  const [menuToDelete, setMenuToDelete] = useState<MenuItem | null>(null);

  const handleOpenCreateMenu = () => {
    setIsEditingMenu(false);
    setMenuFormData({
      id: '',
      name: '',
      category: 'Kopi Nusantara',
      price: '',
      description: '',
      status: 'Tersedia',
      imageUrl: '',
    });
    setImagePreview('');
    setMenuModalOpen(true);
  };

  const handleOpenEditMenu = (item: MenuItem) => {
    setIsEditingMenu(true);
    setMenuFormData({
      id: item.id,
      name: item.name,
      category: item.category,
      price: item.price,
      description: item.description,
      status: item.status,
      imageUrl: item.imageUrl || '',
    });
    setImagePreview(item.imageUrl || '');
    setMenuModalOpen(true);
  };

  const handleSaveMenu = (e: React.FormEvent) => {
    e.preventDefault();
    if (!menuFormData.name || menuFormData.price === '') return;

    const numericPrice = Number(menuFormData.price) || 0;

    if (isEditingMenu && menuFormData.id) {
      setMenuItems((prev) =>
        prev.map((item) =>
          item.id === menuFormData.id
            ? {
                ...item,
                name: menuFormData.name,
                category: menuFormData.category,
                price: numericPrice,
                description: menuFormData.description,
                status: menuFormData.status,
                imageUrl: menuFormData.imageUrl || item.imageUrl,
              }
            : item
        )
      );
    } else {
      const newMenu: MenuItem = {
        id: `MN-${String(menuItems.length + 1).padStart(3, '0')}`,
        name: menuFormData.name,
        category: menuFormData.category,
        price: numericPrice,
        description: menuFormData.description,
        status: menuFormData.status,
        imageUrl: menuFormData.imageUrl,
      };
      setMenuItems((prev) => [newMenu, ...prev]);
    }
    setMenuModalOpen(false);
  };

  const handleToggleMenuStatus = (itemId: string) => {
    setMenuItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, status: item.status === 'Tersedia' ? 'Habis' : 'Tersedia' }
          : item
      )
    );
  };

  const handleRequestDeleteMenu = (item: MenuItem) => {
    setMenuToDelete(item);
    setMenuDeleteModalOpen(true);
  };

  const handleConfirmDeleteMenu = () => {
    if (menuToDelete) {
      setMenuItems((prev) => prev.filter((item) => item.id !== menuToDelete.id));
      setMenuToDelete(null);
    }
    setMenuDeleteModalOpen(false);
  };

  const filteredMenuItems = menuItems.filter((item) => {
    const matchCategory =
      menuCategoryFilter === 'semua' ? true : item.category === menuCategoryFilter;
    const matchSearch =
      menuSearchQuery.trim() === ''
        ? true
        : item.name.toLowerCase().includes(menuSearchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(menuSearchQuery.toLowerCase()) ||
          item.category.toLowerCase().includes(menuSearchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const formatRupiah = (val: number) => {
    return `Rp ${val.toLocaleString('id-ID')}`;
  };

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-brand-text">Manajemen Order Kedai Kopi</h1>
          <p className="text-xs text-brand-muted">
            {activeSubTab === 'antrean'
              ? 'Pantau antrean pesanan dapur dan status pembayaran secara real-time'
              : 'Kelola katalog menu kedai, harga, kategori minuman & camilan nusantara, dan status stok'}
          </p>
        </div>

        {/* Action Button depends on active sub tab */}
        {activeSubTab === 'antrean' ? (
          <button
            onClick={handleOpenCreate}
            className="flex items-center justify-center gap-2 rounded-xl bg-brand-maroon px-4 py-2.5 text-xs font-bold text-white shadow hover:bg-brand-maroon-light transition-colors"
          >
            <Plus size={16} />
            <span>Buat Pesanan Baru</span>
          </button>
        ) : (
          <button
            onClick={handleOpenCreateMenu}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#6B1D2F] border border-[#D4AF37] px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#802135] transition-all"
          >
            <Plus size={16} className="text-[#D4AF37]" />
            <span>+ Tambah Menu Baru</span>
          </button>
        )}
      </div>

      {/* 1. SUB-TAB SWITCHER NAVIGATION */}
      <div className="flex items-center gap-2 border-b border-brand-cream-accent pb-3">
        <button
          type="button"
          onClick={() => setActiveSubTab('antrean')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
            activeSubTab === 'antrean'
              ? 'bg-brand-maroon text-white shadow'
              : 'bg-white text-brand-muted border border-brand-cream-accent hover:text-brand-text'
          }`}
        >
          <Clock size={15} />
          <span>Antrean Pesanan</span>
          <span
            className={`ml-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
              activeSubTab === 'antrean'
                ? 'bg-white/20 text-white'
                : 'bg-brand-cream-accent text-brand-text'
            }`}
          >
            {orders.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('katalog')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
            activeSubTab === 'katalog'
              ? 'bg-brand-maroon text-white shadow'
              : 'bg-white text-brand-muted border border-brand-cream-accent hover:text-brand-text'
          }`}
        >
          <Coffee size={15} />
          <span>Katalog Menu Kedai</span>
          <span
            className={`ml-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
              activeSubTab === 'katalog'
                ? 'bg-white/20 text-white'
                : 'bg-brand-cream-accent text-brand-text'
            }`}
          >
            {menuItems.length}
          </span>
        </button>
      </div>

      {/* TAB 1: ANTREAN PESANAN (STRICTLY PRESERVED) */}
      {activeSubTab === 'antrean' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          {/* Filter Status Tabs & Search */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-brand-cream-accent pb-3">
            <div className="flex flex-wrap items-center gap-2">
              {['semua', 'menunggu', 'disiapkan', 'selesai'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`rounded-xl px-4 py-2 text-xs font-semibold capitalize transition-all ${
                    filter === tab
                      ? 'bg-brand-maroon text-white shadow'
                      : 'bg-white text-brand-muted border border-brand-cream-accent hover:text-brand-text'
                  }`}
                >
                  {tab === 'semua'
                    ? 'Semua Order'
                    : tab === 'menunggu'
                    ? 'Menunggu Bayar'
                    : tab === 'disiapkan'
                    ? 'Disiapkan'
                    : 'Selesai'}
                </button>
              ))}
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-brand-muted" size={16} />
              <input
                type="text"
                placeholder="Cari ID Order / No. Meja..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-56 rounded-xl border border-brand-cream-accent bg-white py-2 pl-9 pr-4 text-xs focus:border-brand-maroon focus:outline-none"
              />
            </div>
          </div>

          {/* Order List */}
          <div className="grid grid-cols-1 gap-4">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-brand-cream-accent bg-white p-5 shadow-sm"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-brand-maroon px-2 py-0.5 text-xs font-bold text-white">
                      {order.table}
                    </span>
                    <span className="text-xs font-semibold text-brand-text">#{order.id}</span>
                    <span className="text-[10px] text-brand-muted">• {order.time}</span>
                  </div>
                  <p className="text-xs text-brand-muted">{order.items}</p>
                  <p className="text-sm font-extrabold text-brand-maroon">{order.total}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2.5">
                  {order.status === 'disiapkan' && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-[11px] font-bold text-amber-700">
                      <Clock size={12} /> Disiapkan
                    </span>
                  )}
                  {order.status === 'menunggu' && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-[11px] font-bold text-blue-700">
                      <AlertCircle size={12} /> Menunggu Bayar
                    </span>
                  )}
                  {order.status === 'selesai' && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold text-emerald-700">
                      <CheckCircle2 size={12} /> Selesai
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleCycleStatus(order.id)}
                    title="Klik untuk ubah tahapan status"
                    className="rounded-xl border border-brand-cream-accent bg-brand-cream-card px-3 py-2 text-xs font-bold text-brand-text hover:bg-brand-cream-accent transition-colors"
                  >
                    Update Status
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(order)}
                    title="Edit Pesanan"
                    className="rounded-xl border border-brand-cream-accent bg-brand-cream-card p-2 text-xs font-bold text-brand-muted hover:text-brand-maroon hover:bg-brand-cream-accent transition-colors"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRequestDelete(order)}
                    title="Hapus / Batalkan Pesanan"
                    className="rounded-xl border border-rose-200 bg-rose-50 p-2 text-xs font-bold text-rose-600 hover:bg-rose-100 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
            {filteredOrders.length === 0 && (
              <div className="rounded-2xl border border-dashed border-brand-cream-accent p-8 text-center bg-white/60">
                <p className="text-xs text-brand-muted">Tidak ada pesanan yang sesuai dengan filter.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: KATALOG MENU KEDAI */}
      {activeSubTab === 'katalog' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          {/* Category Filter and Search Toolbar */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-brand-cream-accent pb-3">
            <div className="flex flex-wrap items-center gap-2">
              {[
                { key: 'semua', label: 'Semua Kategori' },
                { key: 'Kopi Nusantara', label: 'Kopi Nusantara' },
                { key: 'Manual Brew', label: 'Manual Brew' },
                { key: 'Non-Kopi', label: 'Non-Kopi' },
                { key: 'Camilan Nusantara', label: 'Camilan Nusantara' },
              ].map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setMenuCategoryFilter(cat.key)}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
                    menuCategoryFilter === cat.key
                      ? 'bg-brand-maroon text-white shadow'
                      : 'bg-white text-brand-muted border border-brand-cream-accent hover:text-brand-text'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-brand-muted" size={16} />
              <input
                type="text"
                placeholder="Cari nama menu / komposisi..."
                value={menuSearchQuery}
                onChange={(e) => setMenuSearchQuery(e.target.value)}
                className="w-full sm:w-64 rounded-xl border border-brand-cream-accent bg-white py-2 pl-9 pr-4 text-xs focus:border-brand-maroon focus:outline-none"
              />
            </div>
          </div>

          {/* 3. GRID KATALOG MENU (3-4 Kolom Responsive) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredMenuItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-col justify-between rounded-2xl border border-brand-cream-accent bg-white overflow-hidden shadow-sm hover:shadow-md transition-all group"
              >
                {/* Thumbnail Gambar Menu */}
                <div className="relative w-full h-36 bg-[#FAF6F0] flex items-center justify-center overflow-hidden">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-1.5 text-[#C59A3F]/60">
                      <Coffee size={32} strokeWidth={1.5} />
                      <span className="text-[10px] font-medium text-brand-muted">Belum ada foto</span>
                    </div>
                  )}
                  {/* Status overlay badge */}
                  {item.status === 'Habis' && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="rounded-full bg-rose-600 px-3 py-1 text-[10px] font-bold text-white tracking-wide">HABIS</span>
                    </div>
                  )}
                </div>

                <div className="p-4">
                  {/* Top badges: Category & Availability */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className="inline-flex items-center gap-1 rounded-md bg-[#FAF6F0] border border-[#E8DFD5] px-2 py-0.5 text-[10px] font-semibold text-brand-muted">
                      <Tag size={10} className="text-[#C59A3F]" />
                      {item.category}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleToggleMenuStatus(item.id)}
                      title="Klik untuk ubah status ketersediaan"
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold transition-colors ${
                        item.status === 'Tersedia'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                          : 'bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100'
                      }`}
                    >
                      {item.status === 'Tersedia' ? (
                        <>
                          <Check size={10} /> Tersedia
                        </>
                      ) : (
                        <>
                          <PackageX size={10} /> Habis
                        </>
                      )}
                    </button>
                  </div>

                  {/* Menu Name & Description */}
                  <h3 className="text-sm font-bold text-brand-text group-hover:text-brand-maroon transition-colors line-clamp-1">
                    {item.name}
                  </h3>
                  <p className="mt-1 text-xs text-brand-muted leading-relaxed line-clamp-2 min-h-8">
                    {item.description || 'Racikan menu istimewa khas Kedai Kopi Rumah Budaya Ratna.'}
                  </p>
                </div>

                {/* Price and Action Buttons */}
                <div className="mx-4 mb-4 pt-3 border-t border-brand-cream-accent flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-brand-muted block font-medium">Harga Menu</span>
                    <span className="text-sm font-extrabold text-[#5E1626]">
                      {formatRupiah(item.price)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleOpenEditMenu(item)}
                      title="Edit Menu"
                      className="rounded-lg border border-brand-cream-accent bg-brand-cream-card p-1.5 text-brand-muted hover:text-brand-maroon hover:bg-brand-cream-accent transition-colors"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRequestDeleteMenu(item)}
                      title="Hapus Menu"
                      className="rounded-lg border border-rose-200 bg-rose-50 p-1.5 text-rose-600 hover:bg-rose-100 transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredMenuItems.length === 0 && (
            <div className="rounded-2xl border border-dashed border-brand-cream-accent p-10 text-center bg-white/60">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-cream-card text-brand-muted mb-2">
                <Coffee size={24} />
              </div>
              <p className="text-sm font-bold text-brand-text">Menu Tidak Ditemukan</p>
              <p className="mt-1 text-xs text-brand-muted">
                Tidak ada menu yang sesuai dengan filter atau kata kunci pencarian.
              </p>
            </div>
          )}
        </div>
      )}

      {/* 2. MODAL DIALOG "+ TAMBAH MENU BARU" / "EDIT MENU" */}
      {menuModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-brand-cream-accent bg-white p-5 sm:p-6 shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <div className="mb-4 flex items-center justify-between border-b border-brand-cream-accent pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#6B1D2F]/10 text-[#6B1D2F]">
                  <Coffee size={16} />
                </div>
                <h3 className="text-sm font-bold text-brand-text">
                  {isEditingMenu ? 'Edit Menu Kedai' : 'Tambah Menu Baru'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setMenuModalOpen(false)}
                className="rounded-lg p-1 text-brand-muted hover:bg-brand-cream-card hover:text-brand-text transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveMenu} className="space-y-4 text-xs">
              {/* Input Text: Nama Menu */}
              <div>
                <label className="mb-1 block font-semibold text-brand-text">
                  Nama Menu <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={menuFormData.name}
                  onChange={(e) => setMenuFormData({ ...menuFormData, name: e.target.value })}
                  placeholder="misal: Es Kopi Susu Creamy Gula Aren"
                  className="w-full rounded-xl border border-brand-cream-accent p-2.5 text-xs focus:border-[#6B1D2F] focus:outline-none"
                />
              </div>

              {/* Grid 2 Kolom: Kategori & Harga */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Select Dropdown: Kategori */}
                <div>
                  <label className="mb-1 block font-semibold text-brand-text">
                    Kategori <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={menuFormData.category}
                    onChange={(e) =>
                      setMenuFormData({
                        ...menuFormData,
                        category: e.target.value as MenuCategory,
                      })
                    }
                    className="w-full rounded-xl border border-brand-cream-accent bg-white p-2.5 text-xs focus:border-[#6B1D2F] focus:outline-none"
                  >
                    <option value="Kopi Nusantara">Kopi Nusantara</option>
                    <option value="Manual Brew">Manual Brew</option>
                    <option value="Non-Kopi">Non-Kopi</option>
                    <option value="Camilan Nusantara">Camilan Nusantara</option>
                  </select>
                </div>

                {/* Input Number: Harga (Rp) */}
                <div>
                  <label className="mb-1 block font-semibold text-brand-text">
                    Harga (Rp) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs font-bold text-brand-muted">
                      Rp
                    </span>
                    <input
                      type="number"
                      required
                      min={0}
                      step={1000}
                      value={menuFormData.price}
                      onChange={(e) =>
                        setMenuFormData({
                          ...menuFormData,
                          price: e.target.value === '' ? '' : Number(e.target.value),
                        })
                      }
                      placeholder="misal: 28000"
                      className="w-full rounded-xl border border-brand-cream-accent py-2.5 pl-9 pr-3 text-xs focus:border-[#6B1D2F] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Textarea: Deskripsi Komposisi/Singkat */}
              <div>
                <label className="mb-1 block font-semibold text-brand-text">
                  Deskripsi Komposisi/Singkat
                </label>
                <textarea
                  rows={3}
                  value={menuFormData.description}
                  onChange={(e) =>
                    setMenuFormData({ ...menuFormData, description: e.target.value })
                  }
                  placeholder="misal: Espresso blend dengan sirup gula aren organik dan susu segar creamy..."
                  className="w-full rounded-xl border border-brand-cream-accent p-2.5 text-xs focus:border-[#6B1D2F] focus:outline-none"
                />
              </div>

              {/* Upload Foto Menu */}
              <div>
                <label className="mb-1.5 block font-semibold text-brand-text">
                  Upload Foto Menu
                </label>
                <label
                  htmlFor="menu-image-upload"
                  className="flex flex-col items-center justify-center w-full rounded-xl border-2 border-dashed border-brand-cream-accent bg-[#FAF6F0] cursor-pointer hover:border-[#C59A3F] hover:bg-[#FAF6F0]/80 transition-all overflow-hidden"
                  style={{ minHeight: imagePreview ? 'auto' : '100px' }}
                >
                  {imagePreview ? (
                    <div className="relative w-full">
                      <img
                        src={imagePreview}
                        alt="Preview foto menu"
                        className="w-full max-h-44 object-cover rounded-xl"
                      />
                      <span className="absolute bottom-2 right-2 rounded-lg bg-black/50 px-2 py-1 text-[10px] font-bold text-white">
                        Klik untuk ganti foto
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 py-5 text-brand-muted">
                      <ImageUp size={24} strokeWidth={1.5} className="text-[#C59A3F]" />
                      <span className="text-xs font-semibold">Klik untuk pilih foto menu</span>
                      <span className="text-[10px]">JPG, PNG, WEBP — maks. 5MB</span>
                    </div>
                  )}
                </label>
                <input
                  id="menu-image-upload"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>

              {/* Radio Option: Status Menu ("Tersedia" / "Habis") */}
              <div>
                <label className="mb-1.5 block font-semibold text-brand-text">Status Menu</label>
                <div className="flex items-center gap-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="menuStatus"
                      value="Tersedia"
                      checked={menuFormData.status === 'Tersedia'}
                      onChange={() => setMenuFormData({ ...menuFormData, status: 'Tersedia' })}
                      className="accent-[#6B1D2F] h-4 w-4"
                    />
                    <span className="text-xs font-medium text-brand-text flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block"></span>
                      Tersedia
                    </span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="menuStatus"
                      value="Habis"
                      checked={menuFormData.status === 'Habis'}
                      onChange={() => setMenuFormData({ ...menuFormData, status: 'Habis' })}
                      className="accent-[#6B1D2F] h-4 w-4"
                    />
                    <span className="text-xs font-medium text-brand-text flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-rose-500 inline-block"></span>
                      Habis
                    </span>
                  </label>
                </div>
              </div>

              {/* Modal Action Buttons: Batal (Outline/Gold) & Simpan Menu (Maroon #6B1D2F) */}
              <div className="mt-6 flex items-center justify-end gap-2.5 pt-3 border-t border-brand-cream-accent">
                <button
                  type="button"
                  onClick={() => setMenuModalOpen(false)}
                  className="rounded-xl border border-[#D4AF37] bg-white px-4 py-2.5 text-xs font-bold text-stone-700 hover:bg-[#FAF6F0] transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#6B1D2F] px-5 py-2.5 text-xs font-bold text-white shadow hover:bg-[#802135] transition-colors"
                >
                  {isEditingMenu ? 'Simpan Perubahan' : 'Simpan Menu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus Menu */}
      {menuDeleteModalOpen && menuToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl border border-brand-cream-accent bg-white p-6 shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-600 mb-3">
              <Trash2 size={22} />
            </div>
            <h3 className="text-center text-sm font-bold text-brand-text">Hapus Menu Kedai</h3>
            <p className="mt-2 text-center text-xs text-brand-muted leading-relaxed">
              Apakah Anda yakin ingin menghapus menu{' '}
              <span className="font-semibold text-brand-text">"{menuToDelete.name}"</span> dari
              katalog? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="mt-6 flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setMenuDeleteModalOpen(false);
                  setMenuToDelete(null);
                }}
                className="flex-1 rounded-xl border border-brand-cream-accent bg-brand-cream-card py-2.5 text-xs font-bold text-brand-muted hover:bg-brand-cream-accent hover:text-brand-text transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteMenu}
                className="flex-1 rounded-xl bg-rose-600 py-2.5 text-xs font-bold text-white shadow hover:bg-rose-700 transition-colors"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL KONFIRMASI HAPUS PESANAN (EXISTING - STRICTLY PRESERVED) */}
      {deleteModalOpen && orderToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl border border-brand-cream-accent bg-white p-6 shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-600 mb-3">
              <Trash2 size={22} />
            </div>
            <h3 className="text-center text-sm font-bold text-brand-text">Konfirmasi Hapus Pesanan</h3>
            <p className="mt-2 text-center text-xs text-brand-muted leading-relaxed">
              Apakah Anda yakin ingin membatalkan dan menghapus pesanan <span className="font-semibold text-brand-text">#{orderToDelete.id} ({orderToDelete.table})</span>? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="mt-6 flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => { setDeleteModalOpen(false); setOrderToDelete(null); }}
                className="flex-1 rounded-xl border border-brand-cream-accent bg-brand-cream-card py-2.5 text-xs font-bold text-brand-muted hover:bg-brand-cream-accent hover:text-brand-text transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 rounded-xl bg-rose-600 py-2.5 text-xs font-bold text-white shadow hover:bg-rose-700 transition-colors"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL TAMBAH / EDIT PESANAN (EXISTING - STRICTLY PRESERVED) */}
      {formModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border border-brand-cream-accent bg-white p-5 sm:p-6 shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <div className="mb-4 flex items-center justify-between border-b border-brand-cream-accent pb-3">
              <h3 className="text-sm font-bold text-brand-text">
                {isEditing ? `Edit Pesanan #${currentOrder.id}` : 'Buat Pesanan Baru'}
              </h3>
              <button
                type="button"
                onClick={() => setFormModalOpen(false)}
                className="rounded-lg p-1 text-brand-muted hover:bg-brand-cream-card hover:text-brand-text transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveOrder} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block font-semibold text-brand-text">Nomor Meja</label>
                  <input
                    type="text"
                    required
                    value={currentOrder.table || ''}
                    onChange={(e) => setCurrentOrder({ ...currentOrder, table: e.target.value })}
                    className="w-full rounded-xl border border-brand-cream-accent p-2.5 text-xs focus:border-brand-maroon focus:outline-none"
                    placeholder="Contoh: Meja 04"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-semibold text-brand-text">Total Harga</label>
                  <input
                    type="text"
                    required
                    value={currentOrder.total || ''}
                    onChange={(e) => setCurrentOrder({ ...currentOrder, total: e.target.value })}
                    className="w-full rounded-xl border border-brand-cream-accent p-2.5 text-xs focus:border-brand-maroon focus:outline-none"
                    placeholder="Contoh: Rp 65.000"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block font-semibold text-brand-text">Item Pesanan</label>
                <textarea
                  rows={3}
                  required
                  value={currentOrder.items || ''}
                  onChange={(e) => setCurrentOrder({ ...currentOrder, items: e.target.value })}
                  className="w-full rounded-xl border border-brand-cream-accent p-2.5 text-xs focus:border-brand-maroon focus:outline-none"
                  placeholder="Contoh: 1x Kopi Susu Creamy Gula Aren, 1x Pisang Goreng"
                />
              </div>

              <div>
                <label className="mb-1 block font-semibold text-brand-text">Status Pesanan</label>
                <select
                  value={currentOrder.status || 'menunggu'}
                  onChange={(e) => setCurrentOrder({ ...currentOrder, status: e.target.value as OrderStatus })}
                  className="w-full rounded-xl border border-brand-cream-accent p-2.5 text-xs focus:border-brand-maroon focus:outline-none bg-white"
                >
                  <option value="menunggu">Menunggu Bayar</option>
                  <option value="disiapkan">Disiapkan Barista</option>
                  <option value="selesai">Selesai</option>
                </select>
              </div>

              <div className="mt-5 flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setFormModalOpen(false)}
                  className="rounded-xl border border-brand-cream-accent bg-brand-cream-card px-4 py-2.5 text-xs font-bold text-brand-muted hover:bg-brand-cream-accent hover:text-brand-text transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-brand-maroon px-5 py-2.5 text-xs font-bold text-white shadow hover:bg-brand-maroon-light transition-colors"
                >
                  {isEditing ? 'Simpan Perubahan' : 'Simpan Pesanan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
