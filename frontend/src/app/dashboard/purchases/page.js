'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import EmptyState from '@/components/common/EmptyState';
import { ShoppingBag, ChevronRight, FileText } from 'lucide-react';
import Link from 'next/link';

export default function PurchaseHistoryPage() {
  const { user } = useAuth();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadPurchases = () => {
    setLoading(true);
    try {
      const storedTx = localStorage.getItem('automoto_transactions');
      if (storedTx) {
        const txList = JSON.parse(storedTx);
        // Filter only purchases made by the current user
        const userPurchases = txList.filter(
          (t) => t.TransactionType === 'PURCHASE' && t.UserName === user?.FullName
        );
        setPurchases(userPurchases);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadPurchases();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse-glow">
        <div className="h-10 w-48 bg-brand-border/40 rounded-xl" />
        <div className="h-64 bg-brand-card border border-brand-border rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-brand-muted font-light -mt-2">
        Audit log of all high-performance vehicles purchased under your account.
      </p>

      {purchases.length === 0 ? (
        <EmptyState
          title="No Purchases Yet"
          description="You haven't ordered any vehicles yet. Explore our luxury vehicle database catalog and acquire your first model."
          type="purchase"
          actionLabel="Explore Vehicles"
          onAction={() => window.location.href = '/dashboard/vehicles'}
        />
      ) : (
        <div className="bg-brand-card border border-brand-border rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-brand-border/20 border-b border-brand-border text-xs text-brand-muted uppercase tracking-wider font-semibold">
                  <th className="px-6 py-4">Transaction ID</th>
                  <th className="px-6 py-4">Vehicle Model</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-center">Quantity</th>
                  <th className="px-6 py-4 text-right">Unit Price</th>
                  <th className="px-6 py-4 text-right">Total Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/30">
                {purchases.map((tx) => (
                  <tr key={tx.TransactionId} className="hover:bg-brand-border/10 transition-all">
                    {/* ID */}
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-accent flex-shrink-0" />
                        <span className="font-mono text-xs text-brand-muted">{tx.TransactionId}</span>
                      </div>
                    </td>

                    {/* Model */}
                    <td className="px-6 py-4 font-bold text-brand-text">
                      {tx.VehicleName}
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-xs text-brand-muted">
                      {new Date(tx.CreatedAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>

                    {/* Quantity */}
                    <td className="px-6 py-4 text-center text-brand-text font-semibold">
                      {tx.Quantity}
                    </td>

                    {/* Unit Price */}
                    <td className="px-6 py-4 text-right text-brand-muted">
                      ${tx.VehiclePrice.toLocaleString()}
                    </td>

                    {/* Total Amount */}
                    <td className="px-6 py-4 text-right font-extrabold text-brand-text">
                      ${tx.TotalAmount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
