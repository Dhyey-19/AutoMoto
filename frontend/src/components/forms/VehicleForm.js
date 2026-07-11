'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { categoryService } from '@/services/api';

export default function VehicleForm({ vehicle, onSubmit, onCancel }) {
  const [categoriesList, setCategoriesList] = useState([
    { id: 1, name: 'SUV' },
    { id: 2, name: 'Sedan' },
    { id: 3, name: 'Truck' },
    { id: 4, name: 'Hatchback' },
    { id: 5, name: 'Coupe' },
  ]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await categoryService.getCategories();
        if (res.success && res.data) {
          setCategoriesList(res.data.map((c) => ({ id: c.CategoryId, name: c.CategoryName })));
        }
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    };
    loadCategories();
  }, []);
  const isEdit = !!vehicle;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      Make: vehicle?.Make || '',
      Model: vehicle?.Model || '',
      CategoryId: vehicle?.CategoryId || 1,
      ManufactureYear: vehicle?.ManufactureYear || new Date().getFullYear(),
      Color: vehicle?.Color || '',
      Description: vehicle?.Description || '',
      Price: vehicle?.Price || 0,
      Quantity: vehicle?.Quantity || 0,
      ImageUrl: vehicle?.ImageUrl || '',
    },
  });

  const handleFormSubmit = async (data) => {
    // Parse numeric fields for backend Zod validation
    const parsedData = {
      ...data,
      CategoryId: parseInt(data.CategoryId, 10),
      ManufactureYear: parseInt(data.ManufactureYear, 10),
      Price: parseFloat(data.Price),
      Quantity: parseInt(data.Quantity, 10),
    };
    await onSubmit(parsedData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Make */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-brand-muted uppercase tracking-wider">Make</label>
          <input
            type="text"
            placeholder="e.g. Porsche"
            {...register('Make', { required: 'Vehicle make is required' })}
            className="w-full rounded-xl border border-brand-border bg-transparent px-4 py-2.5 text-sm text-brand-text placeholder-brand-muted focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none"
          />
          {errors.Make && <span className="text-xs text-red-555">{errors.Make.message}</span>}
        </div>

        {/* Model */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-brand-muted uppercase tracking-wider">Model</label>
          <input
            type="text"
            placeholder="e.g. 911 Carrera"
            {...register('Model', { required: 'Vehicle model is required' })}
            className="w-full rounded-xl border border-brand-border bg-transparent px-4 py-2.5 text-sm text-brand-text placeholder-brand-muted focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none"
          />
          {errors.Model && <span className="text-xs text-red-555">{errors.Model.message}</span>}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Category */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-brand-muted uppercase tracking-wider">Category</label>
          <select
            {...register('CategoryId', { required: true })}
            className="w-full rounded-xl border border-brand-border bg-brand-card px-4 py-2.5 text-sm text-brand-text focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none"
          >
            {categoriesList.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Manufacture Year */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-brand-muted uppercase tracking-wider">Manufacture Year</label>
          <input
            type="number"
            {...register('ManufactureYear', {
              required: 'Year is required',
              min: { value: 1886, message: 'Invalid year (>= 1886)' },
              max: { value: new Date().getFullYear() + 1, message: 'Year exceeds limits' },
            })}
            className="w-full rounded-xl border border-brand-border bg-transparent px-4 py-2.5 text-sm text-brand-text placeholder-brand-muted focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none"
          />
          {errors.ManufactureYear && <span className="text-xs text-red-555">{errors.ManufactureYear.message}</span>}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {/* Color */}
        <div className="space-y-1 sm:col-span-1">
          <label className="text-xs font-semibold text-brand-muted uppercase tracking-wider">Color</label>
          <input
            type="text"
            placeholder="e.g. Metallic Black"
            {...register('Color')}
            className="w-full rounded-xl border border-brand-border bg-transparent px-4 py-2.5 text-sm text-brand-text placeholder-brand-muted focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none"
          />
        </div>

        {/* Price */}
        <div className="space-y-1 sm:col-span-1">
          <label className="text-xs font-semibold text-brand-muted uppercase tracking-wider">Price ($)</label>
          <input
            type="number"
            step="0.01"
            placeholder="0"
            {...register('Price', {
              required: 'Price is required',
              min: { value: 0, message: 'Price cannot be negative' },
            })}
            className="w-full rounded-xl border border-brand-border bg-transparent px-4 py-2.5 text-sm text-brand-text placeholder-brand-muted focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none"
          />
          {errors.Price && <span className="text-xs text-red-555">{errors.Price.message}</span>}
        </div>

        {/* Quantity */}
        <div className="space-y-1 sm:col-span-1">
          <label className="text-xs font-semibold text-brand-muted uppercase tracking-wider">Quantity</label>
          <input
            type="number"
            placeholder="0"
            {...register('Quantity', {
              required: 'Quantity is required',
              min: { value: 0, message: 'Quantity cannot be negative' },
            })}
            className="w-full rounded-xl border border-brand-border bg-transparent px-4 py-2.5 text-sm text-brand-text placeholder-brand-muted focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none"
          />
          {errors.Quantity && <span className="text-xs text-red-555">{errors.Quantity.message}</span>}
        </div>
      </div>

      {/* Image URL */}
      <div className="space-y-1">
        <label className="text-xs font-semibold text-brand-muted uppercase tracking-wider">Vehicle Image URL</label>
        <input
          type="text"
          placeholder="e.g. https://images.unsplash.com/..."
          {...register('ImageUrl')}
          className="w-full rounded-xl border border-brand-border bg-transparent px-4 py-2.5 text-sm text-brand-text placeholder-brand-muted focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none"
        />
      </div>

      {/* Description */}
      <div className="space-y-1">
        <label className="text-xs font-semibold text-brand-muted uppercase tracking-wider">Description</label>
        <textarea
          rows="3"
          placeholder="Provide high-performance specifications, unique features, etc..."
          {...register('Description')}
          className="w-full rounded-xl border border-brand-border bg-transparent px-4 py-2.5 text-sm text-brand-text placeholder-brand-muted focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none resize-none"
        />
      </div>

      {/* Button footer actions */}
      <div className="flex items-center justify-end space-x-3 pt-4 border-t border-brand-border/60">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-brand-border px-5 py-2.5 text-sm font-medium text-brand-text hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl gold-gradient text-slate-950 px-6 py-2.5 text-sm font-bold shadow hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center space-x-1.5"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-slate-950" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Saving...</span>
            </>
          ) : (
            <span>{isEdit ? 'Save Changes' : 'Create Vehicle'}</span>
          )}
        </button>
      </div>
    </form>
  );
}
