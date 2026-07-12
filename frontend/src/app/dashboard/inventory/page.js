'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { vehicleService, categoryService } from '@/services/api';
import { TableSkeleton } from '@/components/common/Skeleton';
import EmptyState from '@/components/common/EmptyState';
import ErrorState from '@/components/common/ErrorState';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import Modal from '@/components/common/Modal';
import VehicleForm from '@/components/forms/VehicleForm';
import { toast } from 'react-hot-toast';
import { Plus, Edit, Trash2, RotateCcw, AlertTriangle, ShieldAlert, FolderPlus, Loader2 } from 'lucide-react';

export default function InventoryPage() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [stockFilter, setStockFilter] = useState('all'); // 'all', 'instock', 'outofstock'

  // Modals & Dialog triggers
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isRestockOpen, setIsRestockOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [categoryLoading, setCategoryLoading] = useState(false);

  // Security Gate
  useEffect(() => {
    if (!authLoading && !isAdmin) {
      toast.error('Unauthorized access. Admin privileges required.');
      router.push('/dashboard');
    }
  }, [authLoading, isAdmin, router]);

  const loadInventory = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await vehicleService.getVehicles();
      setVehicles(res.data || []);
    } catch (err) {
      console.error(err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    setCategoryLoading(true);
    try {
      const res = await categoryService.getCategories();
      setCategories(res.data || []);
    } catch (err) {
      console.error('Failed to load categories', err);
    } finally {
      setCategoryLoading(false);
    }
  };

  useEffect(() => {
    if (isCategoryOpen) {
      loadCategories();
    }
  }, [isCategoryOpen]);

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      return toast.error('Category name is required.');
    }
    try {
      await categoryService.createCategory(newCategoryName.trim());
      toast.success('Category created successfully!');
      setNewCategoryName('');
      loadCategories();
    } catch (err) {
      toast.error(err.friendlyMessage || 'Failed to create category.');
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadInventory();
    }
  }, [isAdmin]);

  if (authLoading || !isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <ShieldAlert className="h-12 w-12 text-red-500 animate-pulse mb-3" />
        <h3 className="text-lg font-bold text-brand-text">Access Denied</h3>
        <p className="text-sm text-brand-muted mt-1 font-light">Loading permissions or redirecting...</p>
      </div>
    );
  }

  // --- CRUD implementations ---
  const handleCreate = async (formData) => {
    try {
      const res = await vehicleService.createVehicle(formData);
      setVehicles((prev) => [res.data, ...prev]);
      setIsAddOpen(false);
      toast.success('Vehicle created successfully!');
    } catch (err) {
      toast.error(err.friendlyMessage || 'Failed to create vehicle.');
    }
  };

  const handleUpdate = async (formData) => {
    try {
      const res = await vehicleService.updateVehicle(selectedVehicle.VehicleId, formData);
      setVehicles((prev) =>
        prev.map((v) => (v.VehicleId === selectedVehicle.VehicleId ? { ...v, ...res.data } : v))
      );
      setIsEditOpen(false);
      toast.success('Vehicle updated successfully!');
    } catch (err) {
      toast.error(err.friendlyMessage || 'Failed to update vehicle.');
    }
  };

  const handleDelete = async () => {
    try {
      await vehicleService.deleteVehicle(selectedVehicle.VehicleId);
      setVehicles((prev) => prev.filter((v) => v.VehicleId !== selectedVehicle.VehicleId));
      toast.success('Vehicle deleted successfully.');
    } catch (err) {
      toast.error(err.friendlyMessage || 'Failed to delete vehicle.');
      throw err;
    }
  };

  const handleRestock = async ({ quantity, remarks }) => {
    try {
      const res = await vehicleService.restockVehicle(selectedVehicle.VehicleId, {
        Quantity: quantity,
        Remarks: remarks,
      });

      // Update quantity instantly in list
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

  // Triggers
  const openEdit = (vehicle) => {
    setSelectedVehicle(vehicle);
    setIsEditOpen(true);
  };

  const openDelete = (vehicle) => {
    setSelectedVehicle(vehicle);
    setIsDeleteOpen(true);
  };

  const openRestock = (vehicle) => {
    setSelectedVehicle(vehicle);
    setIsRestockOpen(true);
  };

  // Filtering row listings locally
  const filteredVehicles = vehicles.filter((v) => {
    const text = `${v.Make} ${v.Model} ${v.Color} ${v.CategoryName}`.toLowerCase();
    const matchesSearch = text.includes(searchTerm.toLowerCase());
    
    let matchesStock = true;
    if (stockFilter === 'instock') {
      matchesStock = v.Quantity > 0;
    } else if (stockFilter === 'outofstock') {
      matchesStock = v.Quantity === 0;
    }
    
    return matchesSearch && matchesStock;
  });

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-brand-border/40 pb-5">
        <div>
          <p className="text-sm text-brand-muted font-light">
            Review detailed stock status, audit logs, and edit automotive model properties.
          </p>
        </div>
        <div className="flex items-center space-x-2">
            <button
              onClick={loadInventory}
              className="p-2.5 rounded-xl border border-brand-border bg-brand-card hover:bg-brand-border/20 text-brand-text transition-colors cursor-pointer"
              title="Reload Data"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
            <button
              onClick={() => setIsCategoryOpen(true)}
              className="flex items-center justify-center space-x-1.5 rounded-xl border border-brand-border bg-brand-card text-brand-text hover:bg-brand-border/20 px-5 py-2.5 text-sm font-bold shadow hover:opacity-90 active:scale-95 transition-all cursor-pointer"
            >
              <FolderPlus className="h-4.5 w-4.5 text-accent" />
              <span>Add Category</span>
            </button>
            <button
              onClick={() => setIsAddOpen(true)}
              className="flex items-center justify-center space-x-1.5 rounded-xl gold-gradient text-white px-5 py-2.5 text-sm font-bold shadow hover:opacity-90 active:scale-95 transition-all cursor-pointer"
            >
            <Plus className="h-4.5 w-4.5" />
            <span>Add Vehicle</span>
          </button>
        </div>
      </div>

      {/* Internal table search bar & stock filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="w-full max-w-sm">
          <input
            type="text"
            placeholder="Filter table rows..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-brand-border bg-transparent px-4 py-2.5 text-sm text-brand-text placeholder-brand-muted focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none"
          />
        </div>
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <span className="text-xs text-brand-muted font-bold uppercase tracking-wider whitespace-nowrap">Stock:</span>
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="rounded-xl border border-brand-border bg-brand-card text-brand-text px-4 py-2.5 text-sm focus:border-accent focus:outline-none cursor-pointer"
          >
            <option value="all">All Vehicles</option>
            <option value="instock">In Stock</option>
            <option value="outofstock">Out of Stock</option>
          </select>
        </div>
      </div>

      {/* Main Listing View */}
      {loading ? (
        <div className="bg-brand-card border border-brand-border rounded-2xl p-6 shadow-sm">
          <TableSkeleton rows={6} cols={6} />
        </div>
      ) : error ? (
        <ErrorState error={error} onRetry={loadInventory} />
      ) : filteredVehicles.length === 0 ? (
        <EmptyState
          title="No Vehicles in Inventory"
          description={searchTerm ? "No rows match your filter keyword." : "The database inventory is currently empty."}
          actionLabel={searchTerm ? "Clear Search Filter" : "Create First Vehicle"}
          onAction={searchTerm ? () => setSearchTerm('') : () => setIsAddOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVehicles.map((car) => {
            const outOfStock = car.Quantity === 0;
            const lowStock = car.Quantity > 0 && car.Quantity <= 2;
            
            return (
              <div 
                key={car.VehicleId} 
                className="bg-brand-card border border-brand-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                {/* Vehicle Image Backdrop */}
                <div className="relative h-48 w-full bg-white overflow-hidden">
                  <img
                    src={car.ImageUrl || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=600'}
                    alt={`${car.Make} ${car.Model}`}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=600'; }}
                  />
                </div>

                {/* Info Content Section */}
                <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="font-extrabold text-brand-text text-base leading-tight truncate">
                        {car.Make} {car.Model}
                      </h4>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-brand-border/40 text-brand-muted shrink-0 border border-brand-border/20">
                        {car.CategoryName}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-brand-muted font-light">
                      <div className="flex items-center space-x-1.5">
                        <span>Model Year: <span className="font-semibold text-brand-text">{car.ManufactureYear}</span></span>
                        <span>•</span>
                        <span>Color: <span className="font-semibold text-brand-text">{car.Color || '-'}</span></span>
                      </div>
                      
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide border shrink-0 ${
                          outOfStock
                            ? 'bg-red-500/10 text-red-500 border-red-500/20 animate-pulse'
                            : lowStock
                            ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                            : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                        }`}
                      >
                        {outOfStock ? 'Out of Stock' : `${car.Quantity} units`}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-brand-border/40 flex justify-between items-center">
                    <span className="text-xs text-brand-muted font-medium uppercase tracking-wider">Showroom Price</span>
                    <span className="text-xl font-black text-accent tracking-tight">
                      ${car.Price.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Bottom Action controls */}
                <div className="bg-brand-border/10 border-t border-brand-border p-4 flex items-center justify-between gap-2">
                  <button
                    onClick={() => openRestock(car)}
                    className="flex-1 text-xs bg-brand-border/40 hover:bg-accent hover:text-white text-brand-text px-4 py-2.5 rounded-xl font-bold transition-all active:scale-95 cursor-pointer text-center"
                  >
                    Restock
                  </button>
                  <button
                    onClick={() => openEdit(car)}
                    className="p-2.5 text-brand-muted hover:text-accent hover:bg-brand-border/40 rounded-xl transition-all border border-brand-border bg-brand-card cursor-pointer shadow-sm"
                    title="Edit Properties"
                  >
                    <Edit className="h-4.5 w-4.5" />
                  </button>
                  <button
                    onClick={() => openDelete(car)}
                    className="p-2.5 text-red-500 hover:bg-red-500/10 rounded-xl transition-all border border-red-500/10 bg-brand-card cursor-pointer shadow-sm"
                    title="Delete Model"
                  >
                    <Trash2 className="h-4.5 w-4.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Modal */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Create New Vehicle Model">
        <VehicleForm onSubmit={handleCreate} onCancel={() => setIsAddOpen(false)} />
      </Modal>

      {/* Edit Modal */}
      {selectedVehicle && (
        <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title={`Edit ${selectedVehicle.Make} ${selectedVehicle.Model}`}>
          <VehicleForm
            vehicle={selectedVehicle}
            onSubmit={handleUpdate}
            onCancel={() => setIsEditOpen(false)}
          />
        </Modal>
      )}

      {/* Restock Dialog */}
      {selectedVehicle && (
        <ConfirmDialog
          isOpen={isRestockOpen}
          onClose={() => setIsRestockOpen(false)}
          onConfirm={handleRestock}
          title="Restock Vehicle"
          message={`Replenish inventory stock for the ${selectedVehicle.Make} ${selectedVehicle.Model}. Enter quantity.`}
          confirmLabel="Restock"
          type="accent"
          showQuantity={true}
          showRemarks={true}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {selectedVehicle && (
        <ConfirmDialog
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          onConfirm={handleDelete}
          title="Delete Vehicle Model"
          message={`Are you absolutely sure you want to delete the ${selectedVehicle.Make} ${selectedVehicle.Model}? This soft-deletes the vehicle row.`}
          confirmLabel="Delete"
          type="danger"
        />
      )}

      {/* Category Management Modal */}
      <Modal isOpen={isCategoryOpen} onClose={() => setIsCategoryOpen(false)} title="Manage Car Categories">
        <div className="space-y-6">
          {/* Create Category Form */}
          <form onSubmit={handleCreateCategory} className="space-y-3">
            <label className="text-xs font-semibold text-brand-muted uppercase tracking-wider block">Add New Category</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. Electric Hypercar"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="flex-1 rounded-xl border border-brand-border bg-transparent px-4 py-2.5 text-sm text-brand-text placeholder-brand-muted focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl gold-gradient text-white text-sm font-bold shadow hover:opacity-90 active:scale-95 transition-all cursor-pointer flex items-center justify-center space-x-1"
              >
                <Plus className="h-4 w-4" />
                <span>Add</span>
              </button>
            </div>
          </form>

          {/* Categories List */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-brand-muted uppercase tracking-wider block">Active Categories</label>
            {categoryLoading ? (
              <div className="flex items-center justify-center py-6 text-brand-muted text-sm space-x-2">
                <Loader2 className="h-4 w-4 animate-spin text-accent" />
                <span>Retrieving categories...</span>
              </div>
            ) : categories.length === 0 ? (
              <div className="text-center py-6 text-brand-muted text-sm font-light">
                No active categories found in database.
              </div>
            ) : (
              <div className="max-h-60 overflow-y-auto border border-brand-border/60 rounded-xl divide-y divide-brand-border/40">
                {categories.map((cat) => (
                  <div key={cat.CategoryId} className="flex justify-between items-center px-4 py-3 bg-brand-card text-brand-text text-sm">
                    <span className="font-semibold">{cat.CategoryName}</span>
                    <span className="text-2xs text-brand-muted uppercase font-bold px-2 py-0.5 rounded bg-brand-border/40 border border-brand-border/20">
                      ID: {cat.CategoryId}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end pt-2 border-t border-brand-border/40">
            <button
              type="button"
              onClick={() => setIsCategoryOpen(false)}
              className="px-5 py-2.5 rounded-xl border border-brand-border text-brand-text hover:bg-slate-800 hover:text-white text-sm font-semibold transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
