'use client';

import React, { useState, useEffect } from 'react';
import { Search, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { categoryService } from '@/services/api';

export default function SearchFilters({ onFilterChange }) {
  const [make, setMake] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(4000000);
  const [manufactureYear, setManufactureYear] = useState('');
  const [color, setColor] = useState('');
  
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [lastModified, setLastModified] = useState('min');

  // Load categories from database
  useEffect(() => {
    let isMounted = true;
    const fetchCategories = async () => {
      try {
        const response = await categoryService.getCategories();
        if (isMounted && response.success) {
          setCategories(response.data || []);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      } finally {
        if (isMounted) setLoadingCategories(false);
      }
    };
    fetchCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  // Propagate filters on state update
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      onFilterChange({
        make,
        categoryId,
        minPrice: minPrice > 0 ? minPrice : '',
        maxPrice: maxPrice < 4000000 ? maxPrice : '',
        manufactureYear,
        color,
      });
    }, 300); // Debounce queries to avoid overwhelming the server

    return () => clearTimeout(delayDebounceFn);
  }, [make, categoryId, minPrice, maxPrice, manufactureYear, color]);

  const handleReset = () => {
    setMake('');
    setCategoryId('');
    setMinPrice(0);
    setMaxPrice(4000000);
    setManufactureYear('');
    setColor('');
  };

  const minVal = Number(minPrice);
  const maxVal = Number(maxPrice);
  const minLimit = 0;
  const maxLimit = 4000000;
  const priceStep = 50000;

  const handleMinChange = (e) => {
    const value = Math.min(Number(e.target.value), maxVal - priceStep);
    setMinPrice(value);
    setLastModified('min');
  };

  const handleMaxChange = (e) => {
    const value = Math.max(Number(e.target.value), minVal + priceStep);
    setMaxPrice(value);
    setLastModified('max');
  };

  const minPercent = ((minVal - minLimit) / (maxLimit - minLimit)) * 100;
  const maxPercent = ((maxVal - minLimit) / (maxLimit - minLimit)) * 100;

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
            disabled={loadingCategories}
            className="w-full rounded-xl border border-brand-border bg-brand-card px-3 py-2 text-xs text-brand-text focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none cursor-pointer disabled:opacity-50"
          >
            <option value="">{loadingCategories ? 'Loading...' : 'All Categories'}</option>
            {categories.map((cat) => (
              <option key={cat.CategoryId} value={cat.CategoryId}>
                {cat.CategoryName}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range Dual Slider */}
        <div className="space-y-1 sm:col-span-2 md:col-span-1 lg:col-span-2">
          <div className="flex justify-between items-center">
            <label className="text-[10px] font-bold text-brand-muted uppercase tracking-wider">Price Range</label>
            <span className="text-[10px] font-bold text-gold">
              ${minVal.toLocaleString()} - ${maxVal.toLocaleString()}{maxVal === maxLimit ? '+' : ''}
            </span>
          </div>
          <div className="relative pt-2 pb-1 price-range-slider h-7 flex items-center">
            <input
              type="range"
              min={minLimit}
              max={maxLimit}
              step={priceStep}
              value={minVal}
              onChange={handleMinChange}
              className="absolute pointer-events-none appearance-none z-30 h-1.5 w-full bg-transparent focus:outline-none price-slider-input"
              style={{
                zIndex: lastModified === 'min' ? 35 : 30
              }}
            />
            <input
              type="range"
              min={minLimit}
              max={maxLimit}
              step={priceStep}
              value={maxVal}
              onChange={handleMaxChange}
              className="absolute pointer-events-none appearance-none z-30 h-1.5 w-full bg-transparent focus:outline-none price-slider-input"
              style={{
                zIndex: lastModified === 'max' ? 35 : 30
              }}
            />

            {/* Custom Slider Track */}
            <div className="relative h-1.5 w-full bg-brand-border rounded-lg z-10">
              <div
                className="absolute h-full gold-gradient rounded-lg z-20"
                style={{
                  left: `${minPercent}%`,
                  right: `${100 - maxPercent}%`,
                }}
              />
            </div>
          </div>
          <style dangerouslySetInnerHTML={{__html: `
            .price-slider-input::-webkit-slider-thumb {
              -webkit-appearance: none;
              appearance: none;
              height: 14px;
              width: 14px;
              border-radius: 50%;
              background: #FF6500 !important;
              cursor: pointer;
              pointer-events: auto !important;
              box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
              border: 2px solid #FFFFFF;
              transition: transform 0.15s ease-in-out;
            }
            .price-slider-input::-webkit-slider-thumb:hover {
              transform: scale(1.25);
            }
            .price-slider-input::-webkit-slider-thumb:active {
              transform: scale(1.4);
            }
            .price-slider-input::-moz-range-thumb {
              height: 14px;
              width: 14px;
              border-radius: 50%;
              background: #FF6500 !important;
              cursor: pointer;
              pointer-events: auto !important;
              box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
              border: 2px solid #FFFFFF;
              transition: transform 0.15s ease-in-out;
            }
            .price-slider-input::-moz-range-thumb:hover {
              transform: scale(1.25);
            }
            .price-slider-input::-moz-range-thumb:active {
              transform: scale(1.4);
            }
          `}} />
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

