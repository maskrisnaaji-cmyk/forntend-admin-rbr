"use client";

import React from 'react';
import { Search } from 'lucide-react';

interface CategoryFilterProps {
  menuCategoryFilter: string;
  setMenuCategoryFilter: (cat: string) => void;
  menuSearchQuery: string;
  setMenuSearchQuery: (query: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  menuCategoryFilter,
  setMenuCategoryFilter,
  menuSearchQuery,
  setMenuSearchQuery,
}) => {
  const categories = [
    { key: 'semua', label: 'Semua Kategori' },
    { key: 'Kopi Nusantara', label: 'Kopi Nusantara' },
    { key: 'Manual Brew', label: 'Manual Brew' },
    { key: 'Non-Kopi', label: 'Non-Kopi' },
    { key: 'Camilan Nusantara', label: 'Camilan Nusantara' },
  ];

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-brand-cream-accent pb-3">
      <div className="flex flex-wrap items-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setMenuCategoryFilter(cat.key)}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
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
  );
};

export default CategoryFilter;
