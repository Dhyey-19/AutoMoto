'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { ShoppingCart, Edit, Trash2, PlusCircle, Car } from 'lucide-react';

export default function VehicleCard({ vehicle, onPurchase, onEdit, onDelete, onRestock }) {
  const { isAdmin } = useAuth();

  const {
    VehicleId,
    Make,
    Model,
    CategoryName,
    ManufactureYear,
    Color,
    Description,
    Price,
    Quantity,
    ImageUrl,
  } = vehicle;

  const isOutOfStock = Quantity === 0;

  // Fallback image helper
  const displayImage = ImageUrl || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800';

  return (
    <div className="rounded-2xl border border-brand-border bg-brand-card overflow-hidden shadow-sm flex flex-col justify-between group hover:shadow-lg hover:border-gold/30 transition-all duration-350">
      <Link href={`/dashboard/vehicles/${VehicleId}`} className="flex flex-col flex-1">
      
      {/* Visual Frame */}
      <div className="relative h-48 w-full overflow-hidden bg-white">
        <img
          src={displayImage}
          alt={`${Make} ${Model}`}
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800';
          }}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Details Area */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          {/* Metadata category, Year, and Stock Status */}
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider">
            <span className="text-accent">{CategoryName}</span>
            <div className="flex items-center space-x-2">
              <span className="text-brand-muted font-normal">{ManufactureYear}</span>
              <span className="text-brand-muted font-normal">•</span>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wide border shrink-0 ${
                  isOutOfStock
                    ? 'bg-red-500/10 text-red-500 border-red-500/20 animate-pulse'
                    : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                }`}
              >
                {isOutOfStock ? 'Out of Stock' : `${Quantity} Available`}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center gap-2">
            <h3 className="text-lg font-bold text-brand-text truncate">
              {Make} {Model}
            </h3>
            <span className="text-lg font-black text-accent tracking-tight shrink-0">
              ${parseFloat(Price).toLocaleString()}
            </span>
          </div>

          {Color && (
            <p className="text-xs text-brand-muted">
              Color: <span className="font-semibold text-brand-text">{Color}</span>
            </p>
          )}

          <p className="text-xs text-brand-muted font-light line-clamp-3 leading-relaxed">
            {Description || 'No detailed description provided for this premium vehicle model.'}
          </p>
        </div>
      </div>
    </Link>

      {/* Dynamic CTA Footer based on access controls - rendered outside the link container */}
      <div className="p-5 pt-0">
        <div className="border-t border-brand-border/60 pt-4">
          {isAdmin ? (
            // Admin management block
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onRestock(vehicle)}
                className="flex-1 bg-slate-950 text-white border border-slate-800 dark:bg-white dark:text-slate-950 hover:opacity-90 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-1 transition-all active:scale-95 cursor-pointer"
                title="Restock Inventory"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                <span>Restock</span>
              </button>
              <button
                onClick={() => onEdit(vehicle)}
                className="p-2.5 bg-slate-100 text-brand-text hover:bg-gold hover:text-slate-950 dark:bg-slate-850 dark:hover:bg-gold dark:hover:text-slate-950 rounded-xl transition-all active:scale-95 cursor-pointer"
                title="Edit Details"
              >
                <Edit className="h-4.5 w-4.5" />
              </button>
              <button
                onClick={() => onDelete(vehicle)}
                className="p-2.5 bg-red-50 text-danger hover:bg-danger hover:text-white dark:bg-red-950/20 dark:hover:bg-danger dark:hover:text-white rounded-xl transition-all active:scale-95 cursor-pointer"
                title="Delete Model"
              >
                <Trash2 className="h-4.5 w-4.5" />
              </button>
            </div>
          ) : (
            // Regular User CTA
            <button
              onClick={() => onPurchase(vehicle)}
              disabled={isOutOfStock}
              className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all active:scale-95 cursor-pointer ${
                isOutOfStock
                  ? 'bg-slate-100 text-slate-400 dark:bg-slate-850 dark:text-slate-600 cursor-not-allowed'
                  : 'gold-gradient text-slate-950 hover:opacity-90 shadow-md shadow-gold/10'
              }`}
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              <span>{isOutOfStock ? 'Sold Out' : 'Purchase Vehicle'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
