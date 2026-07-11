'use client';

import React, { useState } from 'react';
import Modal from './Modal';

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  type = 'accent', // 'accent' | 'danger' | 'gold'
  showRemarks = false,
  showQuantity = false,
  maxQuantity = 9999,
}) {
  const [remarks, setRemarks] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm({ remarks, quantity });
      setRemarks('');
      setQuantity(1);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getButtonClass = () => {
    switch (type) {
      case 'danger':
        return 'bg-danger text-white hover:bg-danger/90';
      case 'gold':
        return 'gold-gradient text-slate-950 font-semibold hover:opacity-90';
      case 'accent':
      default:
        return 'bg-accent text-white hover:bg-accent/90';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-4">
        <p className="text-sm text-brand-muted">{message}</p>

        {showQuantity && (
          <div className="space-y-1">
            <label className="text-xs font-semibold text-brand-muted uppercase tracking-wider">
              Quantity
            </label>
            <input
              type="number"
              min="1"
              max={maxQuantity}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Math.min(maxQuantity, parseInt(e.target.value, 10) || 1)))}
              className="w-full rounded-xl border border-brand-border bg-transparent px-4 py-2.5 text-sm text-brand-text placeholder-brand-muted focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none"
            />
          </div>
        )}

        {showRemarks && (
          <div className="space-y-1">
            <label className="text-xs font-semibold text-brand-muted uppercase tracking-wider">
              Remarks (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Paying cash, urgent delivery"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full rounded-xl border border-brand-border bg-transparent px-4 py-2.5 text-sm text-brand-text placeholder-brand-muted focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none"
            />
          </div>
        )}

        <div className="mt-6 flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-xl border border-brand-border px-5 py-2.5 text-sm font-medium text-brand-text hover:bg-slate-800 hover:text-white disabled:opacity-50 transition-colors cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className={`rounded-xl px-5 py-2.5 text-sm font-medium disabled:opacity-50 flex items-center space-x-2 transition-all ${getButtonClass()}`}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Processing...</span>
              </>
            ) : (
              <span>{confirmLabel}</span>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}
