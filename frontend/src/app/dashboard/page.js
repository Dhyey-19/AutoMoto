'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { vehicleService } from '@/services/api';
import { TableSkeleton } from '@/components/common/Skeleton';
import ErrorState from '@/components/common/ErrorState';
import {
  Car,
  CheckCircle,
  AlertTriangle,
  DollarSign,
  History,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardHome() {
  const { user, isAdmin } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load vehicles and transactions
  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch live vehicles from backend
      const res = await vehicleService.getVehicles();
      const vehicleList = res.data || [];
      setVehicles(vehicleList);

      // 2. Fetch live transactions from database
      const txRes = await vehicleService.getTransactions();
      setTransactions(txRes.data || []);
    } catch (err) {
      console.error(err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [isAdmin, user]);

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse-glow">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 rounded-2xl bg-brand-card border border-brand-border" />
          ))}
        </div>
        <div className="h-96 rounded-2xl bg-brand-card border border-brand-border" />
      </div>
    );
  }

  if (error) {
    return <ErrorState error={error} onRetry={loadDashboardData} />;
  }

  // --- Computations ---
  const totalVehicles = vehicles.length;
  const availableVehicles = vehicles.filter((v) => v.Quantity > 0).length;
  const outOfStockVehicles = vehicles.filter((v) => v.Quantity === 0).length;
  const totalInventoryValue = vehicles.reduce((sum, v) => sum + v.Price * v.Quantity, 0);

  // Transactions calculations
  const purchasesOnly = transactions.filter((t) => t.TransactionType === 'PURCHASE');
  const restocksOnly = transactions.filter((t) => t.TransactionType === 'RESTOCK');

  const stats = [
    {
      name: 'Total Models',
      value: totalVehicles,
      icon: Car,
      color: 'text-accent bg-accent/10',
    },
    {
      name: 'Available Stock',
      value: availableVehicles,
      icon: CheckCircle,
      color: 'text-emerald-500 bg-emerald-500/10',
    },
    {
      name: 'Out of Stock',
      value: outOfStockVehicles,
      icon: AlertTriangle,
      color: outOfStockVehicles > 0 ? 'text-red-500 bg-red-500/10' : 'text-brand-muted/20 text-brand-muted',
    },
    {
      name: 'Inventory Value',
      value: `$${totalInventoryValue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
      icon: DollarSign,
      color: 'text-accent bg-accent/10',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <div className="rounded-2xl border border-brand-border bg-brand-card p-6 sm:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6 shadow-sm">
        <div>
          <h2 className="text-2xl font-extrabold text-brand-text">
            Welcome, <span className="gold-text-gradient">{user?.FullName}</span>
          </h2>
          <p className="text-sm text-brand-muted mt-1 font-light">
            Here is your dealership status report. You have access as a <span className="font-bold text-brand-text uppercase">{user?.Role}</span>.
          </p>
        </div>
        <div>
          <Link
            href="/dashboard/vehicles"
            className="inline-flex rounded-xl gold-gradient text-white font-bold px-5 py-3 text-sm hover:opacity-90 transition-opacity items-center space-x-1.5 shadow"
          >
            <span>Browse Vehicles</span>
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="rounded-2xl border border-brand-border bg-brand-card p-6 flex items-center justify-between shadow-sm"
            >
              <div className="space-y-1">
                <span className="text-xs font-semibold text-brand-muted uppercase tracking-wider">{stat.name}</span>
                <h3 className="text-3xl font-extrabold text-brand-text tracking-tight">{stat.value}</h3>
              </div>
              <div className={`h-12 w-12 rounded-xl flex items-center justify-center border border-brand-border/40 ${stat.color}`}>
                <Icon className="h-6 w-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Analytics breakdown and transactions */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Recent Transactions List */}
        <div className="lg:col-span-2 rounded-2xl border border-brand-border bg-brand-card p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-brand-border/50 pb-4">
            <h3 className="text-lg font-bold text-brand-text flex items-center space-x-2">
              <History className="h-5 w-5 text-gold" />
              <span>{isAdmin ? 'Recent Transactions' : 'Your Purchase Log'}</span>
            </h3>
            <span className="text-xs font-semibold text-brand-muted">
              {transactions.length} record{transactions.length !== 1 && 's'}
            </span>
          </div>

          {transactions.length === 0 ? (
            <div className="py-12 text-center text-brand-muted text-sm font-light">
              No recent activity recorded on your account.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-xs text-brand-muted uppercase tracking-wider border-b border-brand-border/60 pb-2">
                    <th className="pb-3 font-semibold">Id</th>
                    <th className="pb-3 font-semibold">Vehicle</th>
                    <th className="pb-3 font-semibold">Type</th>
                    <th className="pb-3 font-semibold">Quantity</th>
                    <th className="pb-3 font-semibold text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border/30">
                  {transactions.slice(0, 6).map((tx) => (
                    <tr key={tx.TransactionId} className="group hover:bg-brand-border/20">
                      <td className="py-3.5 font-mono text-xs text-brand-muted">{tx.TransactionId}</td>
                      <td className="py-3.5 font-bold text-brand-text">{tx.VehicleName}</td>
                      <td className="py-3.5">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-2xs font-extrabold uppercase tracking-wide ${
                            tx.TransactionType === 'PURCHASE'
                              ? 'bg-emerald-500/10 text-emerald-500'
                              : 'bg-accent/10 text-accent'
                          }`}
                        >
                          {tx.TransactionType}
                        </span>
                      </td>
                      <td className="py-3.5 text-brand-text font-semibold">{tx.Quantity}</td>
                      <td className="py-3.5 text-right font-bold text-brand-text">
                        ${tx.TotalAmount.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Brand/Category Breakdown & Stock Alerts */}
        <div className="rounded-2xl border border-brand-border bg-brand-card p-6 shadow-sm space-y-6">
          <div className="border-b border-brand-border/50 pb-4">
            <h3 className="text-lg font-bold text-brand-text flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-gold" />
              <span>Stock Distribution</span>
            </h3>
          </div>

          <div className="space-y-5">
            {/* Compute categories */}
            {vehicles.length === 0 ? (
              <div className="text-center py-6 text-brand-muted text-sm font-light">
                No vehicles in database to analyze.
              </div>
            ) : (
              (() => {
                // Count category quantities
                const catCount = {};
                vehicles.forEach((v) => {
                  catCount[v.CategoryName] = (catCount[v.CategoryName] || 0) + v.Quantity;
                });
                const totalStock = vehicles.reduce((sum, v) => sum + v.Quantity, 0);

                if (totalStock === 0) {
                  return (
                    <div className="text-center py-6 text-brand-muted text-sm font-light">
                      All catalog vehicles are currently out of stock.
                    </div>
                  );
                }

                return Object.keys(catCount).map((catName) => {
                  const qty = catCount[catName];
                  const percentage = totalStock > 0 ? Math.round((qty / totalStock) * 100) : 0;
                  return (
                    <div key={catName} className="space-y-2">
                      <div className="flex justify-between text-sm font-semibold">
                        <span className="text-brand-text">{catName}</span>
                        <span className="text-brand-muted">
                          {qty} units ({percentage}%)
                        </span>
                      </div>
                      <div className="h-2 w-full bg-brand-border/40 rounded-full overflow-hidden">
                        <div
                          className="h-full gold-gradient rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                });
              })()
            )}
          </div>

          {/* Out of Stock Alerts block */}
          {outOfStockVehicles > 0 && (
            <div className="mt-6 border-t border-brand-border/60 pt-6">
              <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 flex items-start space-x-3 text-red-500 text-sm">
                <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold">Replenishment Alert</h4>
                  <p className="text-xs text-red-500/80 mt-1">
                    There are {outOfStockVehicles} vehicle models that are currently out of stock. 
                    {isAdmin ? ' Check inventory to restock.' : ' Please contact sales to enquire.'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
