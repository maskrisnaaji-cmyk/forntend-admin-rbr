"use client";

import React from 'react';
import { Search } from 'lucide-react';

interface BookSearchToolbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  totalBooks: number;
}

export const BookSearchToolbar: React.FC<BookSearchToolbarProps> = ({
  searchQuery,
  setSearchQuery,
  totalBooks,
}) => {
  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative w-full sm:w-72">
        <Search className="absolute left-3 top-2.5 text-brand-muted" size={16} />
        <input
          type="text"
          placeholder="Cari judul buku atau nama peminjam..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl border border-brand-cream-accent bg-brand-cream-card py-2 pl-9 pr-4 text-xs focus:border-brand-maroon focus:outline-none"
        />
      </div>
      <span className="text-xs font-semibold text-brand-muted">
        Total: {totalBooks} Judul Terdata
      </span>
    </div>
  );
};

export default BookSearchToolbar;
