'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Car, Mail, ArrowLeft, Send } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toast.success(`Password reset instructions sent to ${data.email}!`);
    }, 1200);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-950 text-white relative">
      <Navbar />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,162,122,0.08),transparent_60%)] pointer-events-none" />
      <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#C5A27A_1px,transparent_1px),linear-gradient(to_bottom,#C5A27A_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

      <div className="flex-grow flex items-center justify-center px-4 py-32 z-10">
        <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md p-8 shadow-2xl space-y-6">
          
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gold/10 border border-gold/30 text-gold mb-2">
              <Car className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white">Reset Password</h2>
            <p className="text-sm text-slate-400">
              {submitted 
                ? 'Check your inbox for password recovery links'
                : 'Enter your account email to receive recovery instructions'
              }
            </p>
          </div>

          {!submitted ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Email Address</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
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
                      errors.email ? 'border-red-500' : 'border-slate-850'
                    } bg-slate-950 pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-gold focus:ring-1 focus:ring-gold focus:outline-none transition-colors`}
                  />
                </div>
                {errors.email && (
                  <span className="text-xs text-red-500">{errors.email.message}</span>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl gold-gradient text-slate-950 font-bold py-3 text-sm flex items-center justify-center space-x-2 shadow-lg hover:opacity-90 active:scale-[0.98] disabled:opacity-50 transition-all cursor-pointer mt-6"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-slate-950" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <span>Send Instructions</span>
                    <Send className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="bg-slate-950/40 p-4 border border-slate-800 rounded-xl text-center space-y-4">
              <p className="text-xs text-slate-400">
                We have dispatched password reset logs to your registered email. Links expire in 30 minutes.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-xs text-gold font-bold hover:underline"
              >
                Resend email
              </button>
            </div>
          )}

          {/* Footer Navigation */}
          <div className="text-center pt-2 border-t border-slate-800/60">
            <Link href="/login" className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white transition-colors">
              <ArrowLeft className="h-3 w-3" />
              <span>Back to Sign In</span>
            </Link>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}
