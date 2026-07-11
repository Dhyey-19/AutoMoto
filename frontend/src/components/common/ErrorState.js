'use client';

import React from 'react';
import { ShieldAlert } from 'lucide-react';

export default function ErrorState({
  title = 'Something went wrong',
  description = 'We encountered an error loading this data. Please try again.',
  error,
  onRetry,
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-brand-border bg-brand-card p-12 text-center shadow-lg max-w-lg mx-auto">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-950/30 text-red-500 mb-4 animate-pulse">
        <ShieldAlert className="h-10 w-10" />
      </div>
      <h3 className="text-lg font-bold text-brand-text mb-1">
        {title}
      </h3>
      <p className="text-sm text-brand-muted mb-4">
        {error ? error.friendlyMessage || error.message || description : description}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-accent text-white font-medium px-5 py-2.5 rounded-xl hover:bg-accent/90 active:scale-95 transition-all text-sm"
        >
          Retry Request
        </button>
      )}
    </div>
  );
}
