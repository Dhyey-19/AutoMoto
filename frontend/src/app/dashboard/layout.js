'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/layout/Sidebar';
import { DashboardSkeleton } from '@/components/common/Skeleton';
import { Menu, Bell } from 'lucide-react';
import { vehicleService } from '@/services/api';

export default function DashboardLayout({ children }) {
  const { isAuthenticated, loading, user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Load sidebar collapse preference from localStorage
  useEffect(() => {
    const collapsed = localStorage.getItem('automoto_sidebar_collapsed') === 'true';
    setSidebarCollapsed(collapsed);
  }, []);

  const toggleSidebarCollapse = () => {
    const newVal = !sidebarCollapsed;
    setSidebarCollapsed(newVal);
    localStorage.setItem('automoto_sidebar_collapsed', String(newVal));
  };

  const [notifications, setNotifications] = useState([]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const fetchNotifications = async () => {
    try {
      const res = await vehicleService.getTransactions();
      if (res.success) {
        const purchases = (res.data || [])
          .filter((t) => t.TransactionType === 'PURCHASE')
          .slice(0, 5);
        setNotifications(purchases);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const seconds = Math.floor((now - date) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

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
      <Sidebar
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        isCollapsed={sidebarCollapsed}
        toggleCollapse={toggleSidebarCollapse}
      />

      {/* Main Container */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${sidebarCollapsed ? 'md:pl-20' : 'md:pl-72'}`}>
        
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
            <div className="relative hidden sm:block">
              <button 
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                  fetchNotifications();
                }}
                className="p-2 text-brand-muted hover:bg-brand-border/40 rounded-xl transition-colors cursor-pointer relative"
              >
                <Bell className="h-5 w-5" />
                {notifications.length > 0 && (
                  <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-accent border-2 border-brand-card animate-pulse" />
                )}
              </button>

              {notificationsOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setNotificationsOpen(false)} />
                  <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-brand-border bg-brand-card p-4 shadow-xl z-40 space-y-3">
                    <div className="flex justify-between items-center border-b border-brand-border/60 pb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-brand-text">Notifications</span>
                      <button 
                        onClick={() => {
                          setNotifications([]);
                          setNotificationsOpen(false);
                        }}
                        className="text-[10px] text-brand-muted hover:text-accent font-semibold"
                      >
                        Clear All
                      </button>
                    </div>

                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="text-center py-6 text-xs text-brand-muted font-light">
                          No new notifications
                        </div>
                      ) : (
                        notifications.map((tx) => (
                          <div key={tx.TransactionId} className="p-2.5 hover:bg-brand-border/25 rounded-xl transition-colors text-xs flex flex-col space-y-1">
                            <p className="text-brand-text font-medium leading-relaxed">
                              You purchased <span className="font-bold text-accent">{tx.VehicleName}</span>
                            </p>
                            <span className="text-[10px] text-brand-muted font-semibold">
                              {formatTimeAgo(tx.CreatedAt)}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
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
