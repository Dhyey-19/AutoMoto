'use client';

import React from 'react';
import { X, Check, AlertTriangle } from 'lucide-react';

export default function ComparisonModal({ isOpen, onClose, vehicles, onRemove }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-5xl rounded-3xl border border-brand-border bg-brand-card shadow-2xl p-6 sm:p-8 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-brand-border/60 pb-4 mb-6">
          <div>
            <h3 className="text-xl font-extrabold text-brand-text">Vehicle Comparison</h3>
            <p className="text-xs text-brand-muted mt-1">Comparing technical details and pricing side-by-side.</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-brand-muted hover:text-brand-text hover:bg-brand-border/40 rounded-xl transition-colors cursor-pointer"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Comparison Grid */}
        <div className="flex-1 overflow-auto">
          {vehicles.length === 0 ? (
            <div className="text-center py-20 text-brand-muted text-sm font-light">
              No vehicles selected for comparison. Select up to 3 models from the catalog.
            </div>
          ) : (
            <div 
              className="grid gap-6 divide-x divide-brand-border/45"
              style={{
                gridTemplateColumns: `repeat(${vehicles.length}, minmax(0, 1fr))`
              }}
            >
              {vehicles.map((car, idx) => {
                const isOutOfStock = car.Quantity === 0;
                return (
                  <div key={car.VehicleId} className={`px-4 space-y-6 ${idx === 0 ? 'pl-0' : ''}`}>
                    {/* Image & Title Header */}
                    <div className="relative group rounded-2xl overflow-hidden border border-brand-border bg-white h-44 w-full">
                      <img
                        src={car.ImageUrl || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800'}
                        alt={`${car.Make} ${car.Model}`}
                        className="h-full w-full object-cover"
                      />
                      <button
                        onClick={() => onRemove(car)}
                        className="absolute top-2 right-2 p-1.5 bg-black/75 hover:bg-black rounded-lg text-white hover:text-red-500 transition-colors cursor-pointer"
                        title="Remove from comparison"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-lg font-bold text-brand-text leading-tight">{car.Make} {car.Model}</h4>
                      <p className="text-xs text-accent font-semibold uppercase">{car.CategoryName}</p>
                    </div>

                    {/* Specifications List */}
                    <div className="space-y-4 text-sm">
                      {/* Price */}
                      <div className="flex justify-between border-b border-brand-border/30 pb-2">
                        <span className="text-brand-muted">Price</span>
                        <span className="font-bold text-accent">${parseFloat(car.Price).toLocaleString()}</span>
                      </div>

                      {/* Year */}
                      <div className="flex justify-between border-b border-brand-border/30 pb-2">
                        <span className="text-brand-muted">Year</span>
                        <span className="font-semibold text-brand-text">{car.ManufactureYear}</span>
                      </div>

                      {/* Color */}
                      <div className="flex justify-between border-b border-brand-border/30 pb-2">
                        <span className="text-brand-muted">Color</span>
                        <span className="font-semibold text-brand-text">{car.Color || '-'}</span>
                      </div>

                      {/* Stock Status */}
                      <div className="flex justify-between border-b border-brand-border/30 pb-2">
                        <span className="text-brand-muted">Availability</span>
                        <span className={`font-bold flex items-center space-x-1 ${isOutOfStock ? 'text-red-500' : 'text-emerald-500'}`}>
                          {isOutOfStock ? (
                            <>
                              <AlertTriangle className="h-4 w-4 text-red-500" />
                              <span>Sold Out</span>
                            </>
                          ) : (
                            <>
                              <Check className="h-4 w-4 text-emerald-500" />
                              <span>{car.Quantity} In Stock</span>
                            </>
                          )}
                        </span>
                      </div>

                      {/* Description */}
                      <div className="space-y-1.5">
                        <span className="text-xs text-brand-muted uppercase tracking-wider font-bold">Overview</span>
                        <p className="text-xs text-brand-muted leading-relaxed font-light line-clamp-4">
                          {car.Description || 'No detailed overview description provided for this premium high-performance vehicle model.'}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
