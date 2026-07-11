'use client';

import React, { useState } from 'react';
import { BellRing, Save } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function SettingsPage() {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [restockAlerts, setRestockAlerts] = useState(false);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSaveSettings = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('System preferences saved successfully!');
    }, 800);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <p className="text-sm text-brand-muted font-light -mt-2">
        Customize notification thresholds, contact targets, and automation preferences.
      </p>

      {/* Notifications Card */}
      <div className="bg-brand-card border border-brand-border rounded-2xl p-6 shadow-sm space-y-4">
        <div className="border-b border-brand-border/60 pb-3">
          <h4 className="text-sm font-bold text-brand-text uppercase tracking-wider flex items-center space-x-2">
            <BellRing className="h-4.5 w-4.5 text-accent" />
            <span>Alerts & Notifications</span>
          </h4>
        </div>

        <div className="space-y-4">
          {/* Purchase notifications */}
          <div className="flex items-center justify-between">
            <div>
              <h5 className="text-sm font-bold text-brand-text">Purchase Confirmations</h5>
              <p className="text-xs text-brand-muted font-light mt-0.5">Send transaction receipt logs to your email</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={() => setEmailAlerts(!emailAlerts)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent" />
            </label>
          </div>

          {/* Restock reminders */}
          <div className="flex items-center justify-between">
            <div>
              <h5 className="text-sm font-bold text-brand-text">Low Stock Reminders</h5>
              <p className="text-xs text-brand-muted font-light mt-0.5">Alert if stock counts drop below threshold limits</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={restockAlerts}
                onChange={() => setRestockAlerts(!restockAlerts)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent" />
            </label>
          </div>

          {/* Weekly Report */}
          <div className="flex items-center justify-between">
            <div>
              <h5 className="text-sm font-bold text-brand-text">Weekly Showroom Digest</h5>
              <p className="text-xs text-brand-muted font-light mt-0.5">Receive summary audits of showroom performance updates</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={weeklyDigest}
                onChange={() => setWeeklyDigest(!weeklyDigest)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent" />
            </label>
          </div>
        </div>

        {/* Action bar */}
        <div className="pt-4 flex justify-end border-t border-brand-border/60">
          <button
            onClick={handleSaveSettings}
            disabled={loading}
            className="rounded-xl gold-gradient text-white font-bold px-6 py-2.5 text-sm shadow hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
          >
            <Save className="h-4.5 w-4.5" />
            <span>{loading ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
