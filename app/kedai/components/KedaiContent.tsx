"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Plus, Clock, Coffee, RefreshCw } from 'lucide-react';
import {
  OrderItem,
  OrderStatus,
  MenuItem,
  MenuCategory,
  MenuStatus,
  INITIAL_MENU_ITEMS,
} from './types';
import { CategoryFilter } from './CategoryFilter';
import { MenuCardList } from './MenuCardList';
import { AddMenuModal } from './AddMenuModal';
import { OrderQueue } from './OrderQueue';
import { OrderModal } from './OrderModal';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
const ORDER_POLL_INTERVAL_MS = 5000;

/** Mapping row dari backend → OrderItem UI */
function mapOrderRow(d: any): OrderItem {
  const statusRaw: string = (d.order_status || d.status || 'menunggu').toLowerCase();
  let status: OrderStatus = 'menunggu';
  if (statusRaw === 'disiapkan' || statusRaw === 'sedang diproses') status = 'disiapkan';
  else if (statusRaw === 'selesai') status = 'selesai';

  const totalStr = d.total ||
    (d.total_price ? `Rp ${Number(d.total_price).toLocaleString('id-ID')}` : 'Rp 0');

  return {
    id: d.order_code || d.id || '',
    order_code: d.order_code || d.id,
    table: d.table_number || d.table || '-',
    table_number: d.table_number || d.table,
    items: d.items_summary || (Array.isArray(d.items)
      ? d.items.map((i: any) => `${i.quantity || i.qty || 1}x ${i.name}`).join(', ')
      : String(d.items || '')),
    items_summary: d.items_summary,
    total: totalStr,
    total_price: d.total_price ? Number(d.total_price) : undefined,
    payment_status: d.payment_status as 'UNPAID' | 'PAID',
    order_status: d.order_status,
    status,
    time: d.time || 'Baru saja',
  };
}

export const KedaiContent: React.FC = () => {
  // 1. SUB-TAB SWITCHER STATE
  const [activeSubTab, setActiveSubTab] = useState<'antrean' | 'katalog'>('antrean');

  // ----------------------------------------------------
  // ORDER STATE & HANDLERS (connected to backend)
  // ----------------------------------------------------
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchOrders = useCallback(async (silent = false) => {
    if (!silent) setOrdersLoading(true);
    setOrdersError(null);
    try {
      const res = await fetch(`${BACKEND_URL}/api/kedai/orders`, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const rows: any[] = Array.isArray(json) ? json : (json.data ?? []);
      setOrders(rows.map(mapOrderRow));
      setLastRefreshed(new Date());
    } catch (err: any) {
      setOrdersError('Gagal memuat antrean pesanan. Pastikan server backend berjalan.');
      console.warn('[OrderQueue] fetch error:', err);
    } finally {
      if (!silent) setOrdersLoading(false);
    }
  }, []);

  // Initial load & polling setiap 5 detik
  useEffect(() => {
    fetchOrders();
    pollingRef.current = setInterval(() => fetchOrders(true), ORDER_POLL_INTERVAL_MS);
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [fetchOrders]);

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

  /** Update status pesanan ke backend via PATCH /api/kedai/orders/:id/status */
  const handleCycleStatus = async (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    const nextStatusMap: Record<OrderStatus, OrderStatus> = {
      menunggu: 'disiapkan',
      disiapkan: 'selesai',
      selesai: 'menunggu',
    };
    const nextStatus = nextStatusMap[order.status];

    // Optimistic update
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: nextStatus } : o))
    );

    try {
      await fetch(`${BACKEND_URL}/api/kedai/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_status: nextStatus }),
      });
      // Re-fetch setelah update agar data sinkron
      fetchOrders(true);
    } catch (e) {
      console.warn('Gagal update status pesanan ke backend:', e);
      // Rollback jika gagal
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: order.status } : o))
      );
    }
  };

  const handleSaveOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentOrder.table || !currentOrder.items) return;

    if (isEditing && currentOrder.id) {
      // Update status pesanan yang ada
      try {
        await fetch(`${BACKEND_URL}/api/kedai/orders/${currentOrder.id}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order_status: currentOrder.status }),
        });
        fetchOrders(true);
      } catch (e) {
        console.warn('Gagal simpan edit pesanan:', e);
        setOrders((prev) =>
          prev.map((o) => (o.id === currentOrder.id ? (currentOrder as OrderItem) : o))
        );
      }
    } else {
      // Buat pesanan baru via POST
      try {
        await fetch(`${BACKEND_URL}/api/kedai/orders`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            table_number: currentOrder.table,
            items: currentOrder.items,
            total_price: Number(String(currentOrder.total || '0').replace(/[^0-9]/g, '')) || 0,
          }),
        });
        fetchOrders(true);
      } catch (e) {
        console.warn('Gagal buat pesanan baru:', e);
      }
    }
    setFormModalOpen(false);
  };

  const handleRequestDelete = (order: OrderItem) => {
    setOrderToDelete(order);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (orderToDelete) {
      try {
        await fetch(`${BACKEND_URL}/api/kedai/orders/${orderToDelete.id}`, {
          method: 'DELETE',
        });
        fetchOrders(true);
      } catch (e) {
        console.warn('Gagal hapus pesanan:', e);
        setOrders((prev) => prev.filter((o) => o.id !== orderToDelete.id));
      }
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

  const fetchMenusFromBackend = useCallback(async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/kedai/menus`, {
        cache: 'no-store',
        headers: {
          'Pragma': 'no-cache',
          'Cache-Control': 'no-cache',
        },
      });
      if (res.ok) {
        const data = await res.json();
        const rows = Array.isArray(data) ? data : (data.data ?? []);
        if (rows.length > 0) {
          const mapped: MenuItem[] = rows.map((d: any) => {
            const isAvail = d.is_available !== undefined && d.is_available !== null
              ? (d.is_available === true || d.is_available === 1 || d.is_available === '1' || d.is_available === 'true')
              : (String(d.status).trim().toLowerCase() !== 'habis');
            const status: MenuStatus = isAvail ? 'Tersedia' : 'Habis';
            return {
              id: String(d.id),
              name: d.name,
              category: d.category as MenuCategory,
              price: Number(d.price) || 0,
              description: d.description || '',
              status,
              imageUrl: d.image || d.imageUrl || '',
            };
          });
          setMenuItems(mapped);
        }
      }
    } catch (e) {
      console.warn('Backend menus offline, using local state:', e);
    }
  }, []);

  useEffect(() => {
    fetchMenusFromBackend();
  }, [fetchMenusFromBackend]);

  // Refresh menu saat sub-tab katalog dibuka
  useEffect(() => {
    if (activeSubTab === 'katalog') {
      fetchMenusFromBackend();
    }
  }, [activeSubTab, fetchMenusFromBackend]);

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

  const [imagePreview, setImagePreview] = useState<string>('');
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedImageFile(file);
    const objectUrl = URL.createObjectURL(file);
    setImagePreview(objectUrl);
  };

  const [menuDeleteModalOpen, setMenuDeleteModalOpen] = useState(false);
  const [menuToDelete, setMenuToDelete] = useState<MenuItem | null>(null);

  const handleOpenCreateMenu = () => {
    setIsEditingMenu(false);
    setSelectedImageFile(null);
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
    setSelectedImageFile(null);
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

  const handleSaveMenu = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!menuFormData.name || menuFormData.price === '') return;

    const numericPrice = Number(menuFormData.price) || 0;
    let finalImageUrl = menuFormData.imageUrl;

    if (finalImageUrl.startsWith('blob:')) {
      finalImageUrl = '';
    }

    if (selectedImageFile) {
      try {
        setIsUploading(true);
        const uploadFormData = new FormData();
        uploadFormData.append('file', selectedImageFile);
        if (isEditingMenu && menuFormData.id) {
          uploadFormData.append('entity', 'menu');
          uploadFormData.append('entityId', String(menuFormData.id));
        }

        let uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData,
        }).catch(() => null);

        if (!uploadRes || !uploadRes.ok) {
          uploadRes = await fetch(`${BACKEND_URL}/api/upload`, {
            method: 'POST',
            body: uploadFormData,
          });
        }

        if (uploadRes && uploadRes.ok) {
          const uploadData = await uploadRes.json();
          if (uploadData.url && (uploadData.url.startsWith('https://') || uploadData.url.startsWith('http://'))) {
            finalImageUrl = uploadData.url;
            setMenuFormData((prev) => ({ ...prev, imageUrl: uploadData.url }));
          } else {
            throw new Error('URL Vercel Blob tidak valid dari server.');
          }
        } else {
          const errData = await uploadRes?.json().catch(() => ({}));
          throw new Error(errData?.message || 'Gagal mengunggah gambar menu ke Vercel Blob.');
        }
      } catch (uploadErr: any) {
        console.error('Error saat upload gambar menu:', uploadErr);
        alert(`Gagal mengunggah gambar ke Vercel Blob: ${uploadErr.message || 'Terjadi kesalahan'}. Simpan menu dibatalkan.`);
        setIsUploading(false);
        return;
      } finally {
        setIsUploading(false);
      }
    }

    if (finalImageUrl.startsWith('blob:')) {
      alert('Gambar menu belum berhasil diunggah ke cloud. Harap ulangi pemilihan gambar.');
      return;
    }

    try {
      if (isEditingMenu && menuFormData.id) {
        await fetch(`${BACKEND_URL}/api/kedai/menus/${menuFormData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: menuFormData.name,
            category: menuFormData.category,
            price: numericPrice,
            description: menuFormData.description,
            status: menuFormData.status,
            is_available: menuFormData.status === 'Tersedia',
            image: finalImageUrl,
          }),
        });
      } else {
        await fetch(`${BACKEND_URL}/api/kedai/menus`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: menuFormData.name,
            category: menuFormData.category,
            price: numericPrice,
            description: menuFormData.description,
            status: menuFormData.status,
            is_available: menuFormData.status === 'Tersedia',
            image: finalImageUrl,
          }),
        });
      }
      fetchMenusFromBackend();
    } catch (e) {
      console.error('Gagal sync ke backend menu:', e);
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
                  imageUrl: finalImageUrl || item.imageUrl,
                }
              : item
          )
        );
      } else {
        const newMenu: MenuItem = {
          id: `MN-${Date.now()}`,
          name: menuFormData.name,
          category: menuFormData.category,
          price: numericPrice,
          description: menuFormData.description,
          status: menuFormData.status,
          imageUrl: finalImageUrl,
        };
        setMenuItems((prev) => [newMenu, ...prev]);
      }
    }
    setSelectedImageFile(null);
    setMenuModalOpen(false);
  };

  /**
   * Toggle status ketersediaan menu — memanggil PATCH /api/kedai/menus/:id
   * dengan payload { is_available: boolean, status: string } agar tersimpan ke backend.
   */
  const handleToggleMenuStatus = async (itemId: string) => {
    const item = menuItems.find((i) => i.id === itemId);
    if (!item) return;
    const newStatus: MenuStatus = item.status === 'Tersedia' ? 'Habis' : 'Tersedia';
    const newAvailable = newStatus === 'Tersedia';

    // Optimistic update pada kartu admin
    setMenuItems((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, status: newStatus } : i))
    );

    try {
      const res = await fetch(`${BACKEND_URL}/api/kedai/menus/${itemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_available: newAvailable, status: newStatus }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const resJson = await res.json().catch(() => null);
      if (resJson) {
        const row = resJson.data || resJson;
        if (row && (row.is_available !== undefined || row.status !== undefined)) {
          const isAvail = row.is_available !== undefined && row.is_available !== null
            ? (row.is_available === true || row.is_available === 1 || row.is_available === '1' || row.is_available === 'true')
            : (String(row.status).trim().toLowerCase() !== 'habis');
          const confirmedStatus: MenuStatus = isAvail ? 'Tersedia' : 'Habis';
          setMenuItems((prev) =>
            prev.map((i) => (i.id === itemId ? { ...i, status: confirmedStatus } : i))
          );
        }
      }
    } catch (e) {
      console.warn('Gagal update status menu ke backend, rollback:', e);
      // Rollback jika gagal
      setMenuItems((prev) =>
        prev.map((i) => (i.id === itemId ? { ...i, status: item.status } : i))
      );
    }
  };

  const handleRequestDeleteMenu = (item: MenuItem) => {
    setMenuToDelete(item);
    setMenuDeleteModalOpen(true);
  };

  const handleConfirmDeleteMenu = async () => {
    if (menuToDelete) {
      try {
        await fetch(`${BACKEND_URL}/api/kedai/menus/${menuToDelete.id}`, {
          method: 'DELETE',
        });
        fetchMenusFromBackend();
      } catch (e) {
        console.warn('Gagal hapus menu dari backend:', e);
        setMenuItems((prev) => prev.filter((item) => item.id !== menuToDelete.id));
      }
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

  return (
    <div className="space-y-6">
      {/* HEADER SECTION — muncul pertama (delay 0ms) */}
      <header className="stagger-item stagger-0 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-brand-text">Manajemen Order Kedai Kopi</h1>
          <p className="text-xs text-brand-muted">
            {activeSubTab === 'antrean'
              ? 'Pantau antrean pesanan dapur dan status pembayaran secara real-time'
              : 'Kelola katalog menu kedai, harga, kategori minuman & camilan nusantara, dan status stok'}
          </p>
        </div>

        {activeSubTab === 'antrean' ? (
          <div className="flex items-center gap-2">
            {/* Tombol refresh manual + indikator last-sync */}
            {lastRefreshed && (
              <span className="text-[10px] text-brand-muted hidden sm:block">
                Diperbarui {lastRefreshed.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            )}
            <button
              type="button"
              onClick={() => fetchOrders()}
              title="Refresh manual antrean"
              className="flex items-center gap-1.5 rounded-xl border border-brand-cream-accent bg-white px-3 py-2 text-xs font-semibold text-brand-muted hover:text-brand-text hover:bg-brand-cream-card transition-colors cursor-pointer"
            >
              <RefreshCw size={14} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button
              onClick={handleOpenCreate}
              className="flex items-center justify-center gap-2 rounded-xl bg-brand-maroon px-4 py-2.5 text-xs font-bold text-white shadow hover:bg-brand-maroon-light transition-colors cursor-pointer"
            >
              <Plus size={16} />
              <span>Buat Pesanan Baru</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fetchMenusFromBackend()}
              title="Refresh katalog menu"
              className="flex items-center gap-1.5 rounded-xl border border-brand-cream-accent bg-white px-3 py-2 text-xs font-semibold text-brand-muted hover:text-brand-text hover:bg-brand-cream-card transition-colors cursor-pointer"
            >
              <RefreshCw size={14} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button
              onClick={handleOpenCreateMenu}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#6B1D2F] border border-[#D4AF37] px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#802135] transition-all cursor-pointer"
            >
              <Plus size={16} className="text-[#D4AF37]" />
              <span>+ Tambah Menu Baru</span>
            </button>
          </div>
        )}
      </header>

      {/* 1. SUB-TAB SWITCHER NAVIGATION (delay 100ms) */}
      <nav aria-label="Pilihan Tampilan Kedai" className="stagger-item stagger-1 flex items-center gap-2 border-b border-brand-cream-accent pb-3">
        <button
          type="button"
          onClick={() => setActiveSubTab('antrean')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all cursor-pointer ${
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
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all cursor-pointer ${
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
      </nav>

      {/* TAB 1: ANTREAN PESANAN (delay 200ms) */}
      {activeSubTab === 'antrean' && (
        <section aria-label="Antrean Pesanan Dapur" className="stagger-item stagger-2">
          {/* Error banner */}
          {ordersError && (
            <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-700 font-medium">
              ⚠️ {ordersError}
            </div>
          )}
          {/* Loading skeleton */}
          {ordersLoading && orders.length === 0 ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 rounded-2xl bg-brand-cream-card animate-pulse" />
              ))}
            </div>
          ) : (
            <OrderQueue
              orders={filteredOrders}
              filter={filter}
              setFilter={setFilter}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onCycleStatus={handleCycleStatus}
              onEdit={handleOpenEdit}
              onDelete={handleRequestDelete}
            />
          )}
        </section>
      )}

      {/* TAB 2: KATALOG MENU KEDAI (delay 200ms) */}
      {activeSubTab === 'katalog' && (
        <section aria-label="Daftar Katalog Menu Kedai" className="stagger-item stagger-2 space-y-5 animate-in fade-in duration-200">
          <CategoryFilter
            menuCategoryFilter={menuCategoryFilter}
            setMenuCategoryFilter={setMenuCategoryFilter}
            menuSearchQuery={menuSearchQuery}
            setMenuSearchQuery={setMenuSearchQuery}
          />
          <MenuCardList
            items={filteredMenuItems}
            onToggleStatus={handleToggleMenuStatus}
            onEdit={handleOpenEditMenu}
            onDelete={handleRequestDeleteMenu}
          />
        </section>
      )}

      {/* ORDER MODALS */}
      <OrderModal
        isOpen={formModalOpen}
        isEditing={isEditing}
        currentOrder={currentOrder}
        onChange={(upd) => setCurrentOrder((prev) => ({ ...prev, ...upd }))}
        onClose={() => setFormModalOpen(false)}
        onSubmit={handleSaveOrder}
        deleteModalOpen={deleteModalOpen}
        orderToDelete={orderToDelete}
        onCloseDeleteModal={() => {
          setDeleteModalOpen(false);
          setOrderToDelete(null);
        }}
        onConfirmDelete={handleConfirmDelete}
      />

      {/* MENU MODALS */}
      <AddMenuModal
        isOpen={menuModalOpen}
        isEditing={isEditingMenu}
        formData={menuFormData}
        imagePreview={imagePreview}
        isUploading={isUploading}
        onClose={() => setMenuModalOpen(false)}
        onChange={(upd) => setMenuFormData((prev) => ({ ...prev, ...upd }))}
        onImageChange={handleImageChange}
        onSubmit={handleSaveMenu}
        deleteModalOpen={menuDeleteModalOpen}
        menuToDelete={menuToDelete}
        onCloseDeleteModal={() => {
          setMenuDeleteModalOpen(false);
          setMenuToDelete(null);
        }}
        onConfirmDelete={handleConfirmDeleteMenu}
      />
    </div>
  );
};
