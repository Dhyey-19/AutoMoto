'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { vehicleService } from '@/services/api';
import ErrorState from '@/components/common/ErrorState';
import { ShieldAlert, BarChart3, TrendingUp, TrendingDown, RefreshCcw, DollarSign, Box } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function AnalyticsPage() {
  const { isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();

  const [vehicles, setVehicles] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Security check
  useEffect(() => {
    if (!authLoading && !isAdmin) {
      toast.error('Unauthorized access. Admin privileges required.');
      router.push('/dashboard');
    }
  }, [authLoading, isAdmin, router]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const res = await vehicleService.getVehicles();
      setVehicles(res.data || []);

      const txRes = await vehicleService.getTransactions();
      if (txRes.success) {
        setTransactions(txRes.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadAnalytics();
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

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse-glow">
        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 rounded-2xl bg-brand-card border border-brand-border" />
          ))}
        </div>
        <div className="h-96 rounded-2xl bg-brand-card border border-brand-border" />
      </div>
    );
  }

  // --- Financial Computations ---
  const purchases = transactions.filter((t) => t.TransactionType === 'PURCHASE');
  const restocks = transactions.filter((t) => t.TransactionType === 'RESTOCK');

  const totalSalesRevenue = purchases.reduce((sum, t) => sum + t.TotalAmount, 0);
  const totalRestockExpense = restocks.reduce((sum, t) => sum + t.TotalAmount, 0);

  const unitsSold = purchases.reduce((sum, t) => sum + t.Quantity, 0);
  const unitsRestocked = restocks.reduce((sum, t) => sum + t.Quantity, 0);

  const netCashFlow = totalSalesRevenue - totalRestockExpense;

  // --- Category & Vehicle Sales Breakdown ---
  const categorySales = {};
  purchases.forEach((p) => {
    const cat = p.CategoryName || 'Unknown';
    categorySales[cat] = (categorySales[cat] || 0) + p.Quantity;
  });

  const carSales = {};
  purchases.forEach((p) => {
    const car = p.VehicleName || 'Unknown';
    if (!carSales[car]) {
      carSales[car] = { quantity: 0, revenue: 0 };
    }
    carSales[car].quantity += p.Quantity;
    carSales[car].revenue += p.TotalAmount;
  });

  let bestSellingCar = 'None';
  let bestSellingQty = 0;
  let bestSellingRev = 0;

  Object.keys(carSales).forEach((car) => {
    if (carSales[car].quantity > bestSellingQty) {
      bestSellingCar = car;
      bestSellingQty = carSales[car].quantity;
      bestSellingRev = carSales[car].revenue;
    }
  });

  const catData = Object.keys(categorySales).map((cat) => ({
    name: cat,
    value: categorySales[cat],
  })).sort((a, b) => b.value - a.value).slice(0, 5);

  const topCarRevenueList = Object.keys(carSales).map((car) => ({
    name: car,
    quantity: carSales[car].quantity,
    revenue: carSales[car].revenue,
  })).sort((a, b) => b.revenue - a.revenue).slice(0, 5);

  return (
    <div className="space-y-8">
      <p className="text-sm text-brand-muted font-light -mt-2">
        Financial logs, capital allocation flow, and volume activity reviews.
      </p>

      {/* KPI Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Gross Revenue */}
        <div className="rounded-2xl border border-brand-border bg-brand-card p-6 flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-brand-muted uppercase tracking-wider">Gross Sales Revenue</span>
            <h3 className="text-3xl font-extrabold text-brand-text tracking-tight">
              ${totalSalesRevenue.toLocaleString(undefined, { minimumFractionDigits: 0 })}
            </h3>
            <p className="text-xs text-emerald-500 flex items-center space-x-1 font-semibold mt-1">
              <TrendingUp className="h-3 w-3" />
              <span>+{unitsSold} sold</span>
            </p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center">
            <DollarSign className="h-6 w-6" />
          </div>
        </div>

        {/* Restocking Expenses */}
        <div className="rounded-2xl border border-brand-border bg-brand-card p-6 flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-brand-muted uppercase tracking-wider">Restock Cost</span>
            <h3 className="text-3xl font-extrabold text-brand-text tracking-tight">
              ${totalRestockExpense.toLocaleString(undefined, { minimumFractionDigits: 0 })}
            </h3>
            <p className="text-xs text-accent flex items-center space-x-1 font-semibold mt-1">
              <RefreshCcw className="h-3 w-3" />
              <span>+{unitsRestocked} replenished</span>
            </p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-accent/10 text-accent border border-accent/20 flex items-center justify-center">
            <Box className="h-6 w-6" />
          </div>
        </div>

        {/* Cash Flow */}
        <div className="rounded-2xl border border-brand-border bg-brand-card p-6 flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-brand-muted uppercase tracking-wider">Net Cash Flow</span>
            <h3 className={`text-3xl font-extrabold tracking-tight ${netCashFlow >= 0 ? 'text-accent' : 'text-red-500'}`}>
              {netCashFlow >= 0 ? '+' : '-'}${Math.abs(netCashFlow).toLocaleString(undefined, { minimumFractionDigits: 0 })}
            </h3>
            <p className="text-xs text-brand-muted font-medium mt-1">
              Showroom adjustments
            </p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-accent/10 text-accent border border-accent/20 flex items-center justify-center">
            <BarChart3 className="h-6 w-6" />
          </div>
        </div>

      </div>

      {/* Sales Leader Highlights Grid */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        {/* Top-Selling Model */}
        <div className="rounded-2xl border border-brand-border bg-brand-card p-6 flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-brand-muted uppercase tracking-wider">Best-Selling Vehicle</span>
            <h3 className="text-xl font-bold text-brand-text tracking-tight truncate max-w-[200px]" title={bestSellingCar}>
              {bestSellingCar}
            </h3>
            <p className="text-xs text-[#FF6500] font-semibold mt-1">
              {bestSellingQty} sold
            </p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-[#FF6500]/10 text-[#FF6500] border border-[#FF6500]/20 flex items-center justify-center font-bold text-lg italic">
            🏆
          </div>
        </div>

        {/* Top-Selling Revenue */}
        <div className="rounded-2xl border border-brand-border bg-brand-card p-6 flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-brand-muted uppercase tracking-wider">Best-Seller Gross Revenue</span>
            <h3 className="text-3xl font-extrabold text-brand-text tracking-tight">
              ${bestSellingRev.toLocaleString()}
            </h3>
            <p className="text-xs text-brand-muted font-medium mt-1">
              Total sales revenue generated by {bestSellingCar}
            </p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-[#FF6500]/10 text-[#FF6500] border border-[#FF6500]/20 flex items-center justify-center font-bold">
            💰
          </div>
        </div>
      </div>

      {/* Performance Insights Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Category Sales Distribution */}
        <div className="rounded-2xl border border-brand-border bg-brand-card p-6 space-y-6 shadow-sm">
          <div className="border-b border-brand-border/60 pb-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-brand-text">Category Sales Performance</h4>
            <p className="text-[10px] text-brand-muted mt-1">Car distribution by total purchase quantity.</p>
          </div>
          <div className="space-y-4">
            {catData.length === 0 ? (
              <div className="text-center py-10 text-xs text-brand-muted font-light">No sales transactions logged yet.</div>
            ) : (
              catData.map((c) => {
                const maxVal = Math.max(...catData.map(d => d.value)) || 1;
                const pct = (c.value / maxVal) * 100;
                return (
                  <div key={c.name} className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-brand-text">{c.name}</span>
                      <span className="text-brand-muted font-bold">{c.value} sold</span>
                    </div>
                    <div className="h-3 w-full bg-zinc-950 rounded-full overflow-hidden border border-brand-border/60">
                      <div 
                        className="h-full rounded-full bg-gradient-to-r from-[#FF6500] to-[#ff8533]"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Top Vehicle Revenue Leaders */}
        <div className="rounded-2xl border border-brand-border bg-brand-card p-6 space-y-6 shadow-sm">
          <div className="border-b border-brand-border/60 pb-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-brand-text">Revenue Leaderboard</h4>
            <p className="text-[10px] text-brand-muted mt-1">Best-selling models and their total revenue.</p>
          </div>
          <div className="space-y-4">
            {topCarRevenueList.length === 0 ? (
              <div className="text-center py-10 text-xs text-brand-muted font-light">No sales transactions logged yet.</div>
            ) : (
              topCarRevenueList.map((item) => {
                const maxRev = Math.max(...topCarRevenueList.map(d => d.revenue)) || 1;
                const pct = (item.revenue / maxRev) * 100;
                return (
                  <div key={item.name} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-brand-text truncate max-w-[150px]">{item.name}</span>
                      <span className="text-accent font-extrabold">${item.revenue.toLocaleString()}</span>
                    </div>
                    <div className="h-3 w-full bg-zinc-950 rounded-full overflow-hidden border border-brand-border/60">
                      <div 
                        className="h-full rounded-full bg-gradient-to-r from-[#FF6500] to-yellow-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-brand-muted block font-medium">{item.quantity} sold</span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Transaction History log */}
      <div className="bg-brand-card border border-brand-border rounded-2xl p-6 shadow-sm space-y-6">
        <div className="border-b border-brand-border/60 pb-4">
          <h3 className="text-lg font-bold text-brand-text">Complete Transaction Ledger</h3>
        </div>

        {transactions.length === 0 ? (
          <div className="py-12 text-center text-brand-muted text-sm font-light">
            No logged purchases or restocks recorded.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-brand-border/20 border-b border-brand-border text-xs text-brand-muted uppercase tracking-wider font-semibold">
                  <th className="px-6 py-4">Transaction ID</th>
                  <th className="px-6 py-4">Vehicle Model</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4 text-center">Qty</th>
                  <th className="px-6 py-4 text-right">Price</th>
                  <th className="px-6 py-4 text-right">Total Amount</th>
                  <th className="px-6 py-4">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/30">
                {transactions.map((tx) => (
                  <tr key={tx.TransactionId} className="hover:bg-brand-border/10 transition-all text-xs">
                    <td className="px-6 py-4 font-mono text-brand-muted">{tx.TransactionId}</td>
                    <td className="px-6 py-4 font-bold text-brand-text">{tx.VehicleName}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wide ${
                          tx.TransactionType === 'PURCHASE'
                            ? 'bg-emerald-500/10 text-emerald-500'
                            : 'bg-accent/10 text-accent'
                        }`}
                      >
                        {tx.TransactionType}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-brand-text">{tx.Quantity}</td>
                    <td className="px-6 py-4 text-right text-brand-muted">${tx.VehiclePrice.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right font-extrabold text-brand-text">${tx.TotalAmount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-brand-muted max-w-xs truncate">{tx.Remarks || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
