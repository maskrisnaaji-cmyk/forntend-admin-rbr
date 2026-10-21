"use client";

import React, { useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Plus, Clock, Coffee } from 'lucide-react';
import {
  OrderItem,
  OrderStatus,
  MenuItem,
  MenuCategory,
  MenuStatus,
  INITIAL_MENU_ITEMS,
} from './components/types';
import { CategoryFilter } from './components/CategoryFilter';
import { MenuCardList } from './components/MenuCardList';
import { AddMenuModal } from './components/AddMenuModal';
import { OrderQueue } from './components/OrderQueue';
import { OrderModal } from './components/OrderModal';

export default function KedaiPage() {
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

  return (
    <AdminLayout activeTab="kedai">
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
              className="flex items-center justify-center gap-2 rounded-xl bg-brand-maroon px-4 py-2.5 text-xs font-bold text-white shadow hover:bg-brand-maroon-light transition-colors cursor-pointer"
            >
              <Plus size={16} />
              <span>Buat Pesanan Baru</span>
            </button>
          ) : (
            <button
              onClick={handleOpenCreateMenu}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#6B1D2F] border border-[#D4AF37] px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#802135] transition-all cursor-pointer"
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
        </div>

        {/* TAB 1: ANTREAN PESANAN */}
        {activeSubTab === 'antrean' && (
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

        {/* TAB 2: KATALOG MENU KEDAI */}
        {activeSubTab === 'katalog' && (
          <div className="space-y-5 animate-in fade-in duration-200">
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
          </div>
        )}

        {/* ORDER MODALS (ADD/EDIT & DELETE) */}
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

        {/* MENU MODALS (ADD/EDIT & DELETE) */}
        <AddMenuModal
          isOpen={menuModalOpen}
          isEditing={isEditingMenu}
          formData={menuFormData}
          imagePreview={imagePreview}
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
    </AdminLayout>
  );
}
