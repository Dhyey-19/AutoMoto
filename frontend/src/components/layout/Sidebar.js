'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Car,
  LayoutDashboard,
  History,
  User,
  Settings,
  ShieldCheck,
  BarChart3,
  Users,
  LogOut
} from 'lucide-react';

export default function Sidebar({ isOpen, setIsOpen }) {
  const pathname = usePathname();
  const { logout, isAdmin } = useAuth();

  const userNavigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Vehicles', href: '/dashboard/vehicles', icon: Car },
    { name: 'Purchase History', href: '/dashboard/purchases', icon: History },
    { name: 'Profile', href: '/dashboard/profile', icon: User },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  const adminNavigation = [
    { name: 'Inventory Management', href: '/dashboard/inventory', icon: ShieldCheck },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    { name: 'User Management', href: '/dashboard/users', icon: Users },
  ];

  const isLinkActive = (href) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  const renderNavItems = (items) => {
    return items.map((item) => {
      const Icon = item.icon;
      const active = isLinkActive(item.href);
      return (
        <li key={item.name}>
          {item.isComingSoon ? (
            <div className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold text-white/40 cursor-not-allowed select-none">
              <div className="flex items-center space-x-3">
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span>{item.name}</span>
              </div>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-zinc-800 text-white/40">
                Soon
              </span>
            </div>
          ) : (
            <Link
              href={item.href}
              className={`flex items-center space-x-3 rounded-xl px-4 py-3 text-sm font-bold transition-all ${
                active
                  ? 'bg-white/10 text-accent'
                  : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <span>{item.name}</span>
            </Link>
          )}
        </li>
      );
    });
  };

  return (
    <>
      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 flex w-72 flex-col border-r border-zinc-800 bg-black transition-transform duration-300 md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header/Logo */}
        <div className="flex h-20 items-center justify-between border-b border-zinc-800 px-6">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <Car className="h-7 w-7 text-accent" />
            <span className="text-xl font-extrabold tracking-wider text-white uppercase italic">
              Auto<span className="text-accent">Moto</span>
            </span>
          </Link>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-8">
          <div>
            <ul className="space-y-1">
              {renderNavItems(userNavigation)}
            </ul>
          </div>

          {isAdmin && (
            <div>
              <div className="px-4 mb-2 text-[10px] font-bold text-accent uppercase tracking-widest">
                Admin Panel
              </div>
              <ul className="space-y-1">
                {renderNavItems(adminNavigation)}
              </ul>
            </div>
          )}
        </nav>

        {/* Footer/Logout Only */}
        <div className="border-t border-zinc-800 p-4">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center space-x-3 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm font-bold text-red-500 hover:bg-zinc-800 transition-colors active:scale-95 cursor-pointer"
          >
            <LogOut className="h-5 w-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-20 bg-black/60 backdrop-blur-sm md:hidden"
        />
      )}
    </>
  );
}
