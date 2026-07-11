'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useForm } from 'react-hook-form';
import { User, Mail, ShieldAlert, Award } from 'lucide-react';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      FullName: user?.FullName || '',
      Email: user?.Email || '',
    },
  });

  const onSubmit = async (data) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 600));
    updateProfile({
      FullName: data.FullName,
      Email: data.Email,
    });
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <p className="text-sm text-brand-muted font-light -mt-2">
        Manage your personal security profile, contact info, and showroom authorization tier.
      </p>

      {/* Info Card */}
      <div className="rounded-2xl border border-brand-border bg-brand-card p-6 flex items-center space-x-4 shadow-sm">
        <div className="h-16 w-16 rounded-full gold-gradient text-white font-bold flex items-center justify-center text-xl border border-accent/30">
          {user?.FullName?.charAt(0).toUpperCase() || 'U'}
        </div>
        <div>
          <h3 className="text-lg font-bold text-brand-text">{user?.FullName}</h3>
          <p className="text-xs text-brand-muted font-medium mt-0.5 uppercase tracking-wide">
            Showroom Tier: <span className="text-accent font-bold">{user?.Role}</span>
          </p>
        </div>
      </div>

      {/* Settings Form */}
      <div className="bg-brand-card border border-brand-border rounded-2xl p-6 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="border-b border-brand-border/60 pb-3 mb-4">
            <h4 className="text-sm font-bold text-brand-text uppercase tracking-wider">Account Credentials</h4>
          </div>

          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-brand-muted uppercase tracking-wider">Full Name</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-brand-muted">
                <User className="h-4 w-4" />
              </span>
              <input
                type="text"
                placeholder="Name"
                {...register('FullName', { required: 'Name is required' })}
                className="w-full rounded-xl border border-brand-border bg-transparent pl-10 pr-4 py-2.5 text-sm text-brand-text placeholder-brand-muted focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none"
              />
            </div>
            {errors.FullName && <span className="text-xs text-red-500">{errors.FullName.message}</span>}
          </div>

          {/* Email Address */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-brand-muted uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-brand-muted">
                <Mail className="h-4 w-4" />
              </span>
              <input
                type="email"
                placeholder="Email"
                {...register('Email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
                className="w-full rounded-xl border border-brand-border bg-transparent pl-10 pr-4 py-2.5 text-sm text-brand-text placeholder-brand-muted focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none"
              />
            </div>
            {errors.Email && <span className="text-xs text-red-500">{errors.Email.message}</span>}
          </div>

          {/* Submit */}
          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl gold-gradient text-white font-bold px-6 py-2.5 text-sm shadow hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center"
            >
              {isSubmitting ? 'Saving changes...' : 'Save Profile Details'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
