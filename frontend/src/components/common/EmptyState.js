'use client';

import React from 'react';
import { Archive, AlertCircle, ShoppingCart } from 'lucide-react';

export default function EmptyState({
  title,
  description,
  type = 'archive', // 'archive' | 'search' | 'purchase'
  actionLabel,
  onAction,
}) {
  const getIcon = () => {
    switch (type) {
      case 'purchase':
        return <ShoppingCart className="h-12 w-12 text-gold animate-bounce" />;
      case 'search':
        return <AlertCircle className="h-12 w-12 text-accent" />;
      case 'archive':
      default:
        return <Archive className="h-12 w-12 text-brand-muted" />;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-brand-border bg-brand-card p-12 text-center shadow-sm">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 mb-4 transition-colors">
        {getIcon()}
      </div>
      <h3 className="text-lg font-bold text-brand-text mb-1">
        {title}
      </h3>
      <p className="max-w-md text-sm text-brand-muted mb-6">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="gold-gradient text-slate-950 font-semibold px-6 py-2.5 rounded-xl hover:opacity-90 active:scale-95 transition-all text-sm"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
