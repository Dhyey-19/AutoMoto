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

      const storedTx = localStorage.getItem('automoto_transactions');
      if (storedTx) {
        setTransactions(JSON.parse(storedTx));
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
              <span>+{unitsSold} luxury models sold</span>
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
              <span>+{unitsRestocked} vehicles replenished</span>
            </p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-accent/10 text-accent border border-accent/20 flex items-center justify-center">
            <Box className="h-6 w-6" />
          </div>
        </div>

        {/* Cash Flow */}
        <div className="rounded-2xl border border-brand-border bg-brand-card p-6 flex items-center justify-between shadow-sm sm:col-span-2 lg:col-span-1">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-brand-muted uppercase tracking-wider">Net Cash Flow</span>
            <h3 className={`text-3xl font-extrabold tracking-tight ${netCashFlow >= 0 ? 'text-accent' : 'text-red-500'}`}>
              {netCashFlow >= 0 ? '+' : '-'}${Math.abs(netCashFlow).toLocaleString(undefined, { minimumFractionDigits: 0 })}
            </h3>
            <p className="text-xs text-brand-muted font-medium mt-1">
              Showroom capital adjustments
            </p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-accent/10 text-accent border border-accent/20 flex items-center justify-center">
            <BarChart3 className="h-6 w-6" />
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
                  <th className="px-6 py-4">Operator / User</th>
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
                    <td className="px-6 py-4 font-semibold text-brand-text">{tx.UserName}</td>
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
