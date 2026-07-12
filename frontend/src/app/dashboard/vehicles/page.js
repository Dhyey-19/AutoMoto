'use client';

import React, { useState, useEffect } from 'react';
import { vehicleService } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import SearchFilters from '@/components/vehicles/SearchFilters';
import VehicleCard from '@/components/vehicles/VehicleCard';
import { CardSkeleton } from '@/components/common/Skeleton';
import EmptyState from '@/components/common/EmptyState';
import ErrorState from '@/components/common/ErrorState';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import Modal from '@/components/common/Modal';
import VehicleForm from '@/components/forms/VehicleForm';
import { toast } from 'react-hot-toast';
import { Plus } from 'lucide-react';
import CelebrationModal from '@/components/common/CelebrationModal';
import ComparisonModal from '@/components/vehicles/ComparisonModal';

export default function VehiclesPage() {
  const { isAdmin, user } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});

  // Dialog & Modal states
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationCarName, setCelebrationCarName] = useState('');
  const [comparisonList, setComparisonList] = useState([]);
  const [isComparingOpen, setIsComparingOpen] = useState(false);

  const handleCompareToggle = (vehicle) => {
    setComparisonList((prev) => {
      const exists = prev.some((v) => v.VehicleId === vehicle.VehicleId);
      if (exists) {
        return prev.filter((v) => v.VehicleId !== vehicle.VehicleId);
      } else {
        if (prev.length >= 3) {
          toast.error('You can compare a maximum of 3 vehicles.');
          return prev;
        }
        return [...prev, vehicle];
      }
    });
  };
  const [isPurchaseOpen, setIsPurchaseOpen] = useState(false);
  const [isRestockOpen, setIsRestockOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Load vehicles
  const fetchVehicles = async (currentFilters = filters) => {
    setLoading(true);
    setError(null);
    try {
      const response = await vehicleService.searchVehicles(currentFilters);
      setVehicles(response.data || []);
    } catch (err) {
      console.error(err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    fetchVehicles(newFilters);
  };

  // --- Purchase Flow ---
  const triggerPurchase = (vehicle) => {
    setSelectedVehicle(vehicle);
    setIsPurchaseOpen(true);
  };

  const confirmPurchase = async ({ remarks, quantity }) => {
    if (!selectedVehicle) return;
    try {
      const res = await vehicleService.purchaseVehicle(selectedVehicle.VehicleId, {
        Quantity: quantity,
        Remarks: remarks,
      });

      // Update local vehicle quantities instantly
      setVehicles((prev) =>
        prev.map((v) =>
          v.VehicleId === selectedVehicle.VehicleId
            ? { ...v, Quantity: Math.max(0, v.Quantity - quantity) }
            : v
        )
      );

      // Trigger celebration animation
      setCelebrationCarName(`${selectedVehicle.Make} ${selectedVehicle.Model}`);
      setShowCelebration(true);

      toast.success('Vehicle purchased successfully!');
    } catch (err) {
      toast.error(err.friendlyMessage || 'Failed to purchase vehicle.');
      throw err;
    }
  };

  // --- Restock Flow ---
  const triggerRestock = (vehicle) => {
    setSelectedVehicle(vehicle);
    setIsRestockOpen(true);
  };

  const confirmRestock = async ({ remarks, quantity }) => {
    if (!selectedVehicle) return;
    try {
      const res = await vehicleService.restockVehicle(selectedVehicle.VehicleId, {
        Quantity: quantity,
        Remarks: remarks,
      });

      // Update quantity on UI instantly
      setVehicles((prev) =>
        prev.map((v) =>
          v.VehicleId === selectedVehicle.VehicleId
            ? { ...v, Quantity: v.Quantity + quantity }
            : v
        )
      );

      toast.success('Inventory restocked successfully!');
    } catch (err) {
      toast.error(err.friendlyMessage || 'Failed to restock vehicle.');
      throw err;
    }
  };

  // --- Delete Flow ---
  const triggerDelete = (vehicle) => {
    setSelectedVehicle(vehicle);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedVehicle) return;
    try {
      await vehicleService.deleteVehicle(selectedVehicle.VehicleId);
      // Remove from UI list
      setVehicles((prev) => prev.filter((v) => v.VehicleId !== selectedVehicle.VehicleId));
      toast.success('Vehicle deleted successfully.');
    } catch (err) {
      toast.error(err.friendlyMessage || 'Failed to delete vehicle.');
      throw err;
    }
  };

  // --- Edit Flow ---
  const triggerEdit = (vehicle) => {
    setSelectedVehicle(vehicle);
    setIsEditOpen(true);
  };

  const saveEdit = async (formData) => {
    try {
      const res = await vehicleService.updateVehicle(selectedVehicle.VehicleId, formData);
      const updated = res.data;
      
      // Update UI list
      setVehicles((prev) =>
        prev.map((v) => (v.VehicleId === selectedVehicle.VehicleId ? { ...v, ...updated } : v))
      );
      
      setIsEditOpen(false);
      toast.success('Vehicle updated successfully.');
    } catch (err) {
      toast.error(err.friendlyMessage || 'Failed to update vehicle details.');
    }
  };

  // --- Create Flow ---
  const saveCreate = async (formData) => {
    try {
      const res = await vehicleService.createVehicle(formData);
      // Append to the list
      setVehicles((prev) => [res.data, ...prev]);
      setIsAddOpen(false);
      toast.success('New vehicle model created successfully.');
    } catch (err) {
      toast.error(err.friendlyMessage || 'Failed to create vehicle model.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header action for Admins */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-sm text-brand-muted font-light">
            Search our global fleet database of luxury high-performance models.
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center justify-center space-x-1.5 rounded-xl gold-gradient text-white px-5 py-3 text-sm font-bold shadow hover:opacity-90 active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="h-4.5 w-4.5" />
            <span>Add Vehicle</span>
          </button>
        )}
      </div>

      {/* Filter panel */}
      <SearchFilters onFilterChange={handleFilterChange} />

      {/* Results grid */}
      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <ErrorState error={error} onRetry={() => fetchVehicles()} />
      ) : vehicles.length === 0 ? (
        <EmptyState
          title="No Vehicles Found"
          description="We couldn't find any vehicles matching your search criteria. Try modifying your filter values or search queries."
          type="search"
          actionLabel="Reset Search Filters"
          onAction={() => handleFilterChange({})}
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {vehicles.map((car) => (
            <VehicleCard
              key={car.VehicleId}
              vehicle={car}
              isComparing={comparisonList.some((v) => v.VehicleId === car.VehicleId)}
              onCompareToggle={handleCompareToggle}
              onPurchase={triggerPurchase}
              onEdit={triggerEdit}
              onDelete={triggerDelete}
              onRestock={triggerRestock}
            />
          ))}
        </div>
      )}

      {/* Purchase Dialog */}
      {selectedVehicle && (
        <ConfirmDialog
          isOpen={isPurchaseOpen}
          onClose={() => setIsPurchaseOpen(false)}
          onConfirm={confirmPurchase}
          title="Purchase Vehicle"
          message={`Are you sure you want to purchase a ${selectedVehicle.Make} ${selectedVehicle.Model}? Enter your purchase quantity and remarks.`}
          confirmLabel="Purchase"
          type="gold"
          showQuantity={true}
          showRemarks={true}
          maxQuantity={selectedVehicle.Quantity}
        />
      )}

      {/* Restock Dialog */}
      {selectedVehicle && (
        <ConfirmDialog
          isOpen={isRestockOpen}
          onClose={() => setIsRestockOpen(false)}
          onConfirm={confirmRestock}
          title="Restock Vehicle"
          message={`Replenish stock for the ${selectedVehicle.Make} ${selectedVehicle.Model}. Enter restock quantity.`}
          confirmLabel="Restock"
          type="accent"
          showQuantity={true}
          showRemarks={true}
        />
      )}

      {/* Delete Dialog */}
      {selectedVehicle && (
        <ConfirmDialog
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          onConfirm={confirmDelete}
          title="Delete Vehicle Model"
          message={`Are you absolutely sure you want to soft-delete the ${selectedVehicle.Make} ${selectedVehicle.Model}? This marks the car as inactive in database.`}
          confirmLabel="Delete"
          type="danger"
        />
      )}

      {/* Add Modal */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Create New Vehicle Model">
        <VehicleForm onSubmit={saveCreate} onCancel={() => setIsAddOpen(false)} />
      </Modal>

      {/* Edit Modal */}
      {selectedVehicle && (
        <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title={`Edit ${selectedVehicle.Make} ${selectedVehicle.Model}`}>
          <VehicleForm
            vehicle={selectedVehicle}
            onSubmit={saveEdit}
            onCancel={() => setIsEditOpen(false)}
          />
        </Modal>
      )}

      {/* Purchase Celebration Modal */}
      <CelebrationModal
        isOpen={showCelebration}
        onClose={() => setShowCelebration(false)}
        vehicleName={celebrationCarName}
      />

      {/* Floating Comparison Bar */}
      {comparisonList.length > 0 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 bg-zinc-950/95 border border-zinc-800 text-white rounded-2xl px-6 py-4 flex items-center justify-between space-x-8 shadow-2xl backdrop-blur-md animate-fade-in max-w-md w-full">
          <div className="flex items-center space-x-3">
            <span className="h-6 w-6 bg-[#FF6500] rounded-full flex items-center justify-center text-xs font-bold text-slate-950">
              {comparisonList.length}
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">Models Selected</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setComparisonList([])}
              className="px-3 py-1.5 border border-zinc-800 rounded-xl text-xs text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors cursor-pointer"
            >
              Clear
            </button>
            <button
              onClick={() => setIsComparingOpen(true)}
              className="px-4 py-1.5 gold-gradient rounded-xl text-xs font-bold text-slate-950 hover:opacity-95 transition-opacity cursor-pointer"
            >
              Compare Side-by-Side
            </button>
          </div>
        </div>
      )}

      {/* Comparison Modal */}
      <ComparisonModal
        isOpen={isComparingOpen}
        onClose={() => setIsComparingOpen(false)}
        vehicles={comparisonList}
        onRemove={(car) => setComparisonList((prev) => prev.filter((v) => v.VehicleId !== car.VehicleId))}
      />
    </div>
  );
}
