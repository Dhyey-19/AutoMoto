'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/context/AuthContext';
import { Car, User, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';

export default function RegisterPage() {
  const { register: registerContext, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    await registerContext(data.name, data.email, data.password);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center relative overflow-hidden bg-black text-white select-none">
      <Navbar />

      {/* Full screen background image with slight blur & scale */}
      <div 
        className="absolute inset-0 bg-cover bg-center filter blur-[4px] scale-105 transition-all duration-700 z-0"
        style={{ backgroundImage: "url('/auth_background_car.png')" }}
      />
      
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/65 z-0" />

      {/* Main glass-effect form container */}
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl p-8 shadow-2xl space-y-6 z-10 mt-16">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 border border-accent/30 text-accent mb-2">
            <Car className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Create Account</h2>
          <p className="text-sm text-white/60">Join AutoMoto and access premium automotive listings</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-white/50">Full Name</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-white/30">
                <User className="h-4 w-4" />
              </span>
              <input
                type="text"
                placeholder="e.g. Maverick Pilot"
                {...register('name', {
                  required: 'Full name is required',
                  minLength: {
                    value: 2,
                    message: 'Name must be at least 2 characters',
                  },
                })}
                className={`w-full rounded-xl border ${
                  errors.name ? 'border-red-500' : 'border-white/10'
                } bg-black/35 pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/20 focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none transition-colors`}
              />
            </div>
            {errors.name && (
              <span className="text-xs text-red-500">{errors.name.message}</span>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-white/50">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-white/30">
                <Mail className="h-4 w-4" />
              </span>
              <input
                type="email"
                placeholder="e.g. pilot@automoto.com"
                {...register('email', {
                  required: 'Email address is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
                className={`w-full rounded-xl border ${
                  errors.email ? 'border-red-500' : 'border-white/10'
                } bg-black/35 pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/20 focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none transition-colors`}
              />
            </div>
            {errors.email && (
              <span className="text-xs text-red-500">{errors.email.message}</span>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-white/50">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-white/30">
                <Lock className="h-4 w-4" />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
                className={`w-full rounded-xl border ${
                  errors.password ? 'border-red-500' : 'border-white/10'
                } bg-black/35 pl-10 pr-10 py-2.5 text-sm text-white placeholder-white/20 focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none transition-colors`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-white/30 hover:text-white"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <span className="text-xs text-red-500">{errors.password.message}</span>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl gold-gradient text-white font-bold py-3 text-sm flex items-center justify-center space-x-2 shadow-lg hover:opacity-90 active:scale-[0.98] disabled:opacity-50 transition-all cursor-pointer mt-6"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Register Account</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Navigation */}
        <div className="text-center text-xs text-white/50 pt-4 border-t border-white/10">
          Already have an account?{' '}
          <Link href="/login" className="text-accent font-bold hover:underline">
            Sign In
          </Link>
        </div>

      </div>
    </div>
  );
}
