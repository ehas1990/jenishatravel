'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { SessionProvider } from 'next-auth/react';
import { ToastProvider } from '@/components/ui/Toast';
import {
  LayoutDashboard,
  Users,
  Compass,
  Package,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  User as UserIcon,
  Sun,
  Moon,
  ChevronDown
} from 'lucide-react';
import Button from '@/components/ui/Button';

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Auto-close mobile sidebar on route change
  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [pathname]);

  const isAuthPage = 
    pathname === '/admin/login' || 
    pathname?.startsWith('/admin/login/') ||
    pathname?.startsWith('/admin/forgot-password') ||
    pathname?.startsWith('/admin/reset-password');

  // If it is an auth page (Login, Forgot Password, Reset Password), skip sidebar/header shell
  if (isAuthPage) {
    return (
      <div className={`min-h-screen w-full flex items-center justify-center p-4 ${darkMode ? 'dark bg-slate-950' : 'bg-dark-bg'}`}>
        {children}
      </div>
    );
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-light-gray flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-[14px] font-semibold text-heading">Verifying administrator session...</span>
        </div>
      </div>
    );
  }

  // Define sidebar navigation items
  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { label: 'Users', icon: Users, path: '/admin/users' },
    { label: 'Destinations', icon: Compass, path: '/admin/destinations' },
    { label: 'Packages', icon: Package, path: '/admin/packages' },
    { label: 'Settings', icon: Settings, path: '/admin/settings' }
  ];

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/admin/login' });
  };

  return (
    <div className={`min-h-screen flex w-full ${darkMode ? 'dark bg-slate-900' : 'bg-[#F8FAFC]'}`}>
      
      {/* 1. Desktop Sidebar (Hidden on Mobile) */}
      <aside
        className={`hidden md:flex flex-col shrink-0 bg-dark-bg text-white border-r border-slate-800 transition-all duration-300 ${
          sidebarOpen ? 'w-[260px]' : 'w-[80px]'
        }`}
      >
        {/* Logo Section */}
        <div className="h-[80px] flex items-center px-6 border-b border-slate-800 gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <Compass className="w-5 h-5 text-white" />
          </div>
          {sidebarOpen && (
            <span className="font-heading font-extrabold text-[18px] tracking-wider text-white">
              VISTALUXE
            </span>
          )}
        </div>

        {/* Menu Navigation */}
        <nav className="flex-grow py-6 px-3 flex flex-col gap-1">
          {menuItems.map((item, idx) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            return (
              <Link
                key={idx}
                href={item.path}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group text-[14px] font-semibold ${
                  isActive
                    ? 'bg-primary text-white shadow-soft'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-3 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-[14px] font-semibold text-rose-400 hover:text-white hover:bg-rose-600/10 transition-all cursor-pointer hover:cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* 2. Mobile Sidebar Overlay */}
      <div
        className={`fixed inset-0 z-50 md:hidden bg-dark-bg/60 backdrop-blur-sm transition-opacity duration-300 ${
          mobileSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileSidebarOpen(false)}
      >
        <aside
          className={`w-[260px] h-full bg-dark-bg text-white flex flex-col transition-transform duration-300 ${
            mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="h-[80px] flex items-center justify-between px-6 border-b border-slate-800">
            <span className="font-heading font-extrabold text-[18px] tracking-wider">
              VISTALUXE
            </span>
            <button onClick={() => setMobileSidebarOpen(false)} className="text-slate-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex-grow py-6 px-3 flex flex-col gap-1">
            {menuItems.map((item, idx) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;
              return (
                <Link
                  key={idx}
                  href={item.path}
                  className={`flex items-center gap-4 px-4 py-3 rounded-xl text-[14px] font-semibold ${
                    isActive ? 'bg-primary text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-3 border-t border-slate-800">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-[14px] font-semibold text-rose-400 hover:text-white hover:bg-rose-600/10 transition-all cursor-pointer"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </aside>
      </div>

      {/* 3. Main Page Body wrapper */}
      <div className="flex-grow flex flex-col min-w-0">
        
        {/* Top Navbar */}
        <header className="h-[80px] bg-white border-b border-border flex items-center justify-between px-6 shrink-0 z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden md:block p-2 hover:bg-slate-100 rounded-lg text-slate-500 cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="block md:hidden p-2 hover:bg-slate-100 rounded-lg text-slate-500 cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Quick Search */}
            <div className="relative hidden sm:block w-[240px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-paragraph/60" />
              <input
                type="text"
                placeholder="Search resources..."
                className="w-full pl-9 pr-4 py-2 border border-border text-[13px] rounded-lg bg-light-gray/40 focus:outline-none focus:border-primary focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Right Header items */}
          <div className="flex items-center gap-4">
            {/* Dark Mode toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 cursor-pointer"
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Notifications Alert Dropdown */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 cursor-pointer relative"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-secondary rounded-full" />
              </button>
              
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-border rounded-xl shadow-glass py-2 z-20">
                  <div className="px-4 py-2 border-b border-border flex justify-between items-center">
                    <span className="font-semibold text-heading text-[13px]">Notifications</span>
                    <button className="text-[11px] text-primary hover:underline">Mark read</button>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    <div className="px-4 py-3 hover:bg-light-gray cursor-pointer border-b border-border/40">
                      <p className="text-[12px] text-heading font-medium">New User Registration</p>
                      <p className="text-[11px] text-paragraph mt-0.5">Editor John Doe joined the administration board.</p>
                      <span className="text-[10px] text-paragraph/50">2 mins ago</span>
                    </div>
                    <div className="px-4 py-3 hover:bg-light-gray cursor-pointer">
                      <p className="text-[12px] text-heading font-medium">System Update</p>
                      <p className="text-[11px] text-paragraph mt-0.5">Database backups completed successfully.</p>
                      <span className="text-[10px] text-paragraph/50">1 hour ago</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-teal-500 text-white flex items-center justify-center text-[13px] font-bold shadow-soft overflow-hidden">
                  {session?.user?.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={session.user.image} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    session?.user?.name?.charAt(0).toUpperCase() || 'A'
                  )}
                </div>
                <span className="hidden sm:block text-[13px] font-semibold text-heading">
                  {session?.user?.name || 'Administrator'}
                </span>
                <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-border rounded-xl shadow-glass py-2 z-20">
                  <div className="px-4 py-2 border-b border-border">
                    <p className="text-[13px] font-bold text-heading truncate">{session?.user?.name}</p>
                    <p className="text-[11px] text-paragraph truncate">{session?.user?.email}</p>
                    <span className="inline-block mt-1 text-[10px] font-bold bg-teal-50 text-primary px-1.5 py-0.5 rounded-md">
                      {session?.user?.role}
                    </span>
                  </div>
                  <Link
                    href="/admin/settings"
                    className="block px-4 py-2 text-[13px] text-heading hover:bg-light-gray"
                    onClick={() => setProfileDropdownOpen(false)}
                  >
                    Edit Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left block px-4 py-2 text-[13px] text-rose-500 hover:bg-rose-50 cursor-pointer"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Pane */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ToastProvider>
        <AdminLayoutContent>{children}</AdminLayoutContent>
      </ToastProvider>
    </SessionProvider>
  );
}
