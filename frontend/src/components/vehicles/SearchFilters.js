'use client';

import React, { useState, useEffect } from 'react';
import { Search, RotateCcw, SlidersHorizontal } from 'lucide-react';

const CATEGORIES = [
  { id: '', name: 'All Categories' },
  { id: 1, name: 'SUV' },
  { id: 2, name: 'Sedan' },
  { id: 3, name: 'Truck' },
  { id: 4, name: 'Hatchback' },
  { id: 5, name: 'Coupe' },
];

export default function SearchFilters({ onFilterChange }) {
  const [make, setMake] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [manufactureYear, setManufactureYear] = useState('');
  const [color, setColor] = useState('');

  // Propagate filters on state update
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      onFilterChange({
        make,
        categoryId,
        minPrice,
        maxPrice,
        manufactureYear,
        color,
      });
    }, 300); // Debounce queries to avoid overwhelming the server

    return () => clearTimeout(delayDebounceFn);
  }, [make, categoryId, minPrice, maxPrice, manufactureYear, color]);

  const handleReset = () => {
    setMake('');
    setCategoryId('');
    setMinPrice('');
    setMaxPrice('');
    setManufactureYear('');
    setColor('');
  };

  return (
    <div className="rounded-2xl border border-brand-border bg-brand-card p-6 shadow-sm space-y-4">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-brand-border/50 pb-3">
        <div className="flex items-center space-x-2 text-brand-text">
          <SlidersHorizontal className="h-4 w-4 text-gold" />
          <h3 className="text-sm font-bold uppercase tracking-wider">Search Filters</h3>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center space-x-1 text-xs text-brand-muted hover:text-gold transition-colors cursor-pointer font-semibold"
        >
          <RotateCcw className="h-3 w-3" />
          <span>Reset Filters</span>
        </button>
      </div>

      {/* Filter controls grid */}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        
        {/* Search Make/Model */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-brand-muted uppercase tracking-wider">Search</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-brand-muted">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              placeholder="e.g. Porsche, Audi"
              value={make}
              onChange={(e) => setMake(e.target.value)}
              className="w-full rounded-xl border border-brand-border bg-transparent pl-9 pr-3 py-2 text-xs text-brand-text placeholder-brand-muted focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none"
            />
          </div>
        </div>

        {/* Category Select */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-brand-muted uppercase tracking-wider">Category</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full rounded-xl border border-brand-border bg-brand-card px-3 py-2 text-xs text-brand-text focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none cursor-pointer"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Min Price */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-brand-muted uppercase tracking-wider">Min Price ($)</label>
          <input
            type="number"
            placeholder="Min Price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full rounded-xl border border-brand-border bg-transparent px-3 py-2 text-xs text-brand-text placeholder-brand-muted focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none"
          />
        </div>

        {/* Max Price */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-brand-muted uppercase tracking-wider">Max Price ($)</label>
          <input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full rounded-xl border border-brand-border bg-transparent px-3 py-2 text-xs text-brand-text placeholder-brand-muted focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none"
          />
        </div>

        {/* Manufacture Year */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-brand-muted uppercase tracking-wider">Year</label>
          <input
            type="number"
            placeholder="e.g. 2026"
            value={manufactureYear}
            onChange={(e) => setManufactureYear(e.target.value)}
            className="w-full rounded-xl border border-brand-border bg-transparent px-3 py-2 text-xs text-brand-text placeholder-brand-muted focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none"
          />
        </div>

        {/* Color */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-brand-muted uppercase tracking-wider">Color</label>
          <input
            type="text"
            placeholder="e.g. Black, Silver"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-full rounded-xl border border-brand-border bg-transparent px-3 py-2 text-xs text-brand-text placeholder-brand-muted focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none"
          />
        </div>

      </div>
    </div>
  );
}
