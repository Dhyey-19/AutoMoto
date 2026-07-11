'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Menu, X, LogOut, LayoutDashboard, Car } from 'lucide-react';

export default function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Vehicles', href: isAuthenticated ? '/dashboard/vehicles' : '#featured' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'glass-panel shadow-md py-4 border-b border-brand-border/60'
          : 'bg-transparent py-6 border-b border-transparent'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo - Icon Only */}
          <Link href="/" className="flex items-center space-x-2 group" title="AutoMoto Home">
            <Car className="h-9 w-9 text-accent group-hover:rotate-12 transition-transform duration-300" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-semibold tracking-wide transition-colors ${
                    scrolled 
                      ? 'text-black hover:text-accent' 
                      : 'text-white/90 hover:text-accent'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Actions */}
            <div className={`flex items-center space-x-4 border-l pl-6 transition-colors ${
              scrolled ? 'border-brand-border/60' : 'border-white/20'
            }`}>
              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <Link
                    href="/dashboard"
                    className="flex items-center space-x-1.5 rounded-xl bg-black px-4 py-2.5 text-sm font-bold text-white hover:bg-slate-900 border border-black transition-all shadow-md active:scale-95 cursor-pointer"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                  <button
                    onClick={logout}
                    className={`flex items-center space-x-1 rounded-xl border px-4 py-2.5 text-sm font-bold transition-colors active:scale-95 cursor-pointer ${
                      scrolled 
                        ? 'border-brand-border text-brand-text hover:bg-slate-50' 
                        : 'border-white/20 text-white hover:bg-white/10'
                    }`}
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    href="/login"
                    className={`text-sm font-bold px-3 py-2 transition-colors ${
                      scrolled 
                        ? 'text-black hover:text-accent' 
                        : 'text-white hover:text-accent'
                    }`}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="rounded-xl gold-gradient text-white font-bold text-sm px-5 py-2.5 hover:opacity-95 transition-opacity shadow-lg active:scale-95"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile hamburger menu button */}
          <div className="flex md:hidden items-center space-x-3">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`rounded-xl p-2 transition-colors ${
                scrolled 
                  ? 'text-black hover:bg-slate-100' 
                  : 'text-white hover:bg-white/10'
              }`}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 top-[73px] z-30 bg-black/10 backdrop-blur-sm md:hidden" onClick={() => setIsOpen(false)}>
          {/* Mobile Drawer Menu */}
          <div
            className="w-full bg-brand-card border-b border-brand-border px-6 py-6 space-y-6 shadow-2xl transition-all animate-in fade-in slide-in-from-top duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-bold text-brand-text/80 hover:text-accent py-2 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="pt-6 border-t border-brand-border/60 flex flex-col space-y-3">
              {isAuthenticated ? (
                <>
                  <div className="text-sm font-semibold text-brand-muted mb-2">
                    Signed in as: <span className="text-brand-text">{user?.FullName}</span>
                  </div>
                  <Link
                    href="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center space-x-1.5 rounded-xl bg-black px-4 py-3 text-sm font-bold text-white hover:opacity-95 transition-all shadow-md"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      logout();
                    }}
                    className="flex items-center justify-center space-x-1 rounded-xl border border-brand-border px-4 py-3 text-sm font-bold text-brand-text hover:bg-slate-50 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center rounded-xl border border-brand-border px-4 py-3 text-sm font-bold text-brand-text hover:bg-slate-50 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center rounded-xl gold-gradient text-white font-bold text-sm px-4 py-3 hover:opacity-90 transition-opacity shadow-lg"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
