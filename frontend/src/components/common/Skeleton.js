'use client';

import React from 'react';

export function CardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-brand-border bg-brand-card p-5 space-y-4">
      {/* Image box */}
      <div className="h-48 w-full rounded-xl bg-slate-200 dark:bg-slate-700" />
      {/* Title / Make & Model */}
      <div className="space-y-2">
        <div className="h-5 w-2/3 rounded bg-slate-200 dark:bg-slate-700" />
        <div className="h-4 w-1/2 rounded bg-slate-200 dark:bg-slate-700" />
      </div>
      {/* Specs pill badges */}
      <div className="flex space-x-2">
        <div className="h-6 w-16 rounded-full bg-slate-200 dark:bg-slate-700" />
        <div className="h-6 w-16 rounded-full bg-slate-200 dark:bg-slate-700" />
      </div>
      {/* Price and Stock */}
      <div className="flex items-center justify-between border-t border-brand-border pt-4">
        <div className="h-6 w-24 rounded bg-slate-200 dark:bg-slate-700" />
        <div className="h-8 w-20 rounded-xl bg-slate-200 dark:bg-slate-700" />
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5, cols = 4 }) {
  return (
    <div className="w-full animate-pulse space-y-4">
      {/* Header row */}
      <div className="flex space-x-4 border-b border-brand-border pb-4">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="h-4 flex-1 rounded bg-slate-200 dark:bg-slate-700" />
        ))}
      </div>
      {/* Content rows */}
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex space-x-4 py-3 border-b border-brand-border/50">
          {Array.from({ length: cols }).map((_, c) => (
            <div
              key={c}
              className="h-4 flex-1 rounded bg-slate-200 dark:bg-slate-700"
              style={{ width: `${Math.floor(Math.random() * 40) + 60}%` }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Stats Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="animate-pulse rounded-2xl border border-brand-border bg-brand-card p-6 space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-4 w-24 rounded bg-slate-200 dark:bg-slate-700" />
              <div className="h-8 w-8 rounded-lg bg-slate-200 dark:bg-slate-700" />
            </div>
            <div className="h-8 w-16 rounded bg-slate-200 dark:bg-slate-700" />
          </div>
        ))}
      </div>
      
      {/* Graphic / Table layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 animate-pulse rounded-2xl border border-brand-border bg-brand-card p-6 space-y-4">
          <div className="h-6 w-48 rounded bg-slate-200 dark:bg-slate-700" />
          <div className="h-64 w-full rounded bg-slate-200 dark:bg-slate-700" />
        </div>
        <div className="animate-pulse rounded-2xl border border-brand-border bg-brand-card p-6 space-y-4">
          <div className="h-6 w-32 rounded bg-slate-200 dark:bg-slate-700" />
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded bg-slate-200 dark:bg-slate-700" />
                <div className="flex-1 space-y-1">
                  <div className="h-4 w-full rounded bg-slate-200 dark:bg-slate-700" />
                  <div className="h-3 w-2/3 rounded bg-slate-200 dark:bg-slate-700" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
