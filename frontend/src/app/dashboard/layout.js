'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/layout/Sidebar';
import { DashboardSkeleton } from '@/components/common/Skeleton';
import { Menu, Bell } from 'lucide-react';

export default function DashboardLayout({ children }) {
  const { isAuthenticated, loading, user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Route guarding
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login?redirected=true');
    }
  }, [loading, isAuthenticated, router]);

  // Page Title Resolver
  const getPageTitle = () => {
    if (pathname === '/dashboard') return 'Dashboard';
    if (pathname.startsWith('/dashboard/vehicles')) return 'Vehicle Collection';
    if (pathname.startsWith('/dashboard/purchases')) return 'Purchase History';
    if (pathname.startsWith('/dashboard/inventory')) return 'Inventory Management';
    if (pathname.startsWith('/dashboard/analytics')) return 'Business Analytics';
    if (pathname.startsWith('/dashboard/profile')) return 'User Profile';
    if (pathname.startsWith('/dashboard/settings')) return 'Preferences & Settings';
    return 'AutoMoto';
  };

  // If loading session, show loading skeleton
  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center p-8">
        <div className="w-full max-w-7xl">
          <DashboardSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text flex transition-colors duration-300">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Container */}
      <div className="flex-1 flex flex-col md:pl-72 min-w-0">
        
        {/* Top Header Navbar */}
        <header className="h-20 bg-brand-card border-b border-brand-border flex items-center justify-between px-6 sm:px-8 sticky top-0 z-20">
          <div className="flex items-center space-x-4">
            {/* Hamburger Trigger for Mobile */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-brand-muted hover:bg-brand-border/40 rounded-xl md:hidden transition-colors cursor-pointer"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-bold tracking-tight text-brand-text">
              {getPageTitle()}
            </h1>
          </div>

          {/* Quick Toolbar */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative group hidden sm:block">
              <button className="p-2 text-brand-muted hover:bg-brand-border/40 rounded-xl transition-colors cursor-pointer">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-accent border-2 border-brand-card animate-pulse" />
              </button>
            </div>

            {/* User Dropdown */}
            <div className="flex items-center space-x-3 pl-3 border-l border-brand-border/60">
              <div className="h-9 w-9 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm">
                {user?.FullName?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="hidden lg:block text-left">
                <div className="text-xs font-bold text-brand-text leading-tight">{user?.FullName}</div>
                <div className="text-[10px] text-brand-muted font-semibold uppercase tracking-wider">{user?.Role}</div>
              </div>
            </div>

          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
