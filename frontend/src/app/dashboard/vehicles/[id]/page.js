'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { vehicleService } from '@/services/api';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import CelebrationModal from '@/components/common/CelebrationModal';
import { 
  ArrowLeft, 
  Car, 
  Calendar, 
  Palette, 
  Layers, 
  ShoppingCart, 
  AlertTriangle 
} from 'lucide-react';

export default function VehiclePreviewPage({ params }) {
  // Unwrap parameters promise for Next.js 15
  const { id } = React.use(params);
  
  const { user } = useAuth();
  const router = useRouter();

  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Dialog state triggers
  const [isPurchaseOpen, setIsPurchaseOpen] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const fetchVehicleDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await vehicleService.getVehicleById(id);
      setVehicle(res.data);
    } catch (err) {
      console.error(err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchVehicleDetails();
    }
  }, [id]);

  const handlePurchase = async ({ quantity, remarks }) => {
    try {
      const res = await vehicleService.purchaseVehicle(id, {
        Quantity: quantity,
        Remarks: remarks || 'Online showroom acquisition',
      });

      // Adjust remaining inventory quantity instantly on client view
      setVehicle((prev) => ({
        ...prev,
        Quantity: Math.max(0, prev.Quantity - quantity),
      }));

      // Trigger purchase celebration animation
      setShowCelebration(true);

      toast.success('Vehicle purchased successfully!');
    } catch (err) {
      toast.error(err.friendlyMessage || 'Failed to complete vehicle purchase.');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse-glow">
        <div className="h-6 w-24 bg-brand-border/40 rounded-xl" />
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="h-96 rounded-2xl bg-brand-card border border-brand-border animate-pulse" />
          <div className="space-y-6">
            <div className="h-10 w-2/3 bg-brand-border/40 rounded-xl animate-pulse" />
            <div className="h-6 w-1/3 bg-brand-border/40 rounded-xl animate-pulse" />
            <div className="h-32 w-full bg-brand-card border border-brand-border rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertTriangle className="h-12 w-12 text-red-500 mb-3" />
        <h3 className="text-lg font-bold text-brand-text">Vehicle Not Found</h3>
        <p className="text-sm text-brand-muted mt-1 font-light">
          This vehicle model might have been deleted or is currently inactive.
        </p>
        <button
          onClick={() => router.push('/dashboard/vehicles')}
          className="mt-6 inline-flex items-center space-x-2 text-xs font-bold text-accent hover:underline cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Catalog</span>
        </button>
      </div>
    );
  }

  const outOfStock = vehicle.Quantity === 0;

  return (
    <div className="space-y-6">
      {/* Back button link */}
      <div>
        <button
          onClick={() => router.push('/dashboard/vehicles')}
          className="inline-flex items-center space-x-2 text-sm font-bold text-brand-text hover:text-accent transition-colors cursor-pointer group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Vehicles Catalog</span>
        </button>
      </div>

      {/* Main Preview Container */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Left Side: Large image display */}
        <div className="rounded-2xl border border-brand-border bg-white overflow-hidden shadow flex items-center justify-center p-4">
          <img
            src={vehicle.ImageUrl || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800'}
            alt={`${vehicle.Make} ${vehicle.Model}`}
            className="w-full max-h-[450px] object-contain rounded-xl"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800';
            }}
          />
        </div>

        {/* Right Side: Specifications details card */}
        <div className="bg-brand-card border border-brand-border rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-sm space-y-6">
          <div className="space-y-4">
            {/* Category tag & stock info */}
            <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wider">
              <span className="text-accent flex items-center space-x-1.5">
                <Layers className="h-4 w-4" />
                <span>{vehicle.CategoryName}</span>
              </span>

              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-2xs font-extrabold border ${
                  outOfStock
                    ? 'bg-red-500/10 text-red-500 border-red-500/20 animate-pulse'
                    : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                }`}
              >
                {outOfStock ? 'Sold Out' : `${vehicle.Quantity} Available`}
              </span>
            </div>

            {/* Model Title */}
            <div>
              <h2 className="text-3xl font-extrabold text-brand-text leading-tight tracking-tight">
                {vehicle.Make} {vehicle.Model}
              </h2>
            </div>

            {/* Specifications Row */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="flex items-center space-x-2 text-sm text-brand-muted font-light">
                <Calendar className="h-4 w-4 text-accent/80" />
                <span>Year: <span className="font-semibold text-brand-text">{vehicle.ManufactureYear}</span></span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-brand-muted font-light">
                <Palette className="h-4 w-4 text-accent/80" />
                <span>Color: <span className="font-semibold text-brand-text">{vehicle.Color || '-'}</span></span>
              </div>
            </div>

            {/* Description block */}
            <div className="pt-4 border-t border-brand-border/40">
              <h4 className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2">Specifications & Details</h4>
              <p className="text-sm text-brand-muted font-light leading-relaxed">
                {vehicle.Description || 'Experience pure engineering excellence. This custom model provides cutting edge performance, high-speed stability, and a premium cockpit interface configured for enthusiast drivers.'}
              </p>
            </div>
          </div>

          {/* Pricing area & CTA Purchase button */}
          <div className="pt-6 border-t border-brand-border/40 space-y-4">
            <div className="flex justify-between items-baseline">
              <span className="text-sm text-brand-muted font-medium uppercase tracking-wider">Showroom Cost</span>
              <span className="text-3xl font-black text-accent tracking-tight">
                ${vehicle.Price.toLocaleString()}
              </span>
            </div>

            <button
              onClick={() => setIsPurchaseOpen(true)}
              disabled={outOfStock}
              className={`w-full py-4 rounded-xl font-bold flex items-center justify-center space-x-2 transition-all active:scale-[0.98] cursor-pointer shadow-md ${
                outOfStock
                  ? 'bg-slate-100 text-slate-400 dark:bg-slate-850 dark:text-slate-600 cursor-not-allowed'
                  : 'gold-gradient text-white hover:opacity-90 shadow-gold/20'
              }`}
            >
              <ShoppingCart className="h-4.5 w-4.5" />
              <span>{outOfStock ? 'Sold Out' : 'Purchase Vehicle'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Purchase Confirmation Dialogue */}
      {vehicle && (
        <ConfirmDialog
          isOpen={isPurchaseOpen}
          onClose={() => setIsPurchaseOpen(false)}
          onConfirm={handlePurchase}
          title="Acquire Premium Vehicle Model"
          message={`Please verify you want to purchase a ${vehicle.Make} ${vehicle.Model}. Specify desired purchase quantity below.`}
          confirmLabel="Purchase"
          type="gold"
          showQuantity={true}
          showRemarks={true}
          maxQuantity={vehicle.Quantity}
        />
      )}

      {/* Purchase Celebration Modal */}
      {vehicle && (
        <CelebrationModal
          isOpen={showCelebration}
          onClose={() => setShowCelebration(false)}
          vehicleName={`${vehicle.Make} ${vehicle.Model}`}
        />
      )}
    </div>
  );
}
