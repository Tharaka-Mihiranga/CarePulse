import React, { useState } from 'react';
import { 
  HeartPulse, 
  LayoutDashboard, 
  Calendar, 
  FileText, 
  Pill, 
  CreditCard, 
  LogOut, 
  Menu, 
  X, 
  Bell, 
  Search, 
  ChevronDown, 
  User, 
  Stethoscope, 
  Building2
} from 'lucide-react';
import { PageId, UserRole, UserProfile } from '../types';

interface NavigationProps {
  currentPage: PageId;
  currentRole: UserRole;
  userProfile: UserProfile;
  onNavigate: (page: PageId) => void;
  onSwitchRole: (role: UserRole) => void;
}

export function Navigation({
  currentPage,
  currentRole,
  userProfile,
  onNavigate,
  onSwitchRole,
}: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navItems: { id: PageId; label: string; icon: any; badge?: string }[] = [
    { id: 'patient-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'appointment-booking', label: 'Book Visit', icon: Calendar },
    { id: 'medical-records', label: 'EHR Records', icon: FileText },
    { id: 'prescriptions', label: 'Pharmacy Rx', icon: Pill },
    { id: 'payment', label: 'Billing', icon: CreditCard },
    { id: 'admin-dashboard', label: 'AdminCore', icon: Building2 },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.toLowerCase();
    if (q.includes('book') || q.includes('appoint') || q.includes('sched')) {
      onNavigate('appointment-booking');
    } else if (q.includes('rx') || q.includes('prescri') || q.includes('med') || q.includes('refill')) {
      onNavigate('prescriptions');
    } else if (q.includes('record') || q.includes('lab') || q.includes('vance') || q.includes('x-ray')) {
      onNavigate('medical-records');
    } else if (q.includes('pay') || q.includes('bill') || q.includes('card') || q.includes('checkout')) {
      onNavigate('payment');
    } else if (q.includes('admin') || q.includes('revenue') || q.includes('metric') || q.includes('user')) {
      onNavigate('admin-dashboard');
    } else if (q.includes('login') || q.includes('auth')) {
      onNavigate('login');
    } else {
      onNavigate('patient-dashboard');
    }
    setSearchQuery('');
  };

  return (
    <>
      {/* Primary Header Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 sm:gap-4">
          
          {/* Brand Logo & Mobile Toggle */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div
              onClick={() => onNavigate('patient-dashboard')}
              className="flex items-center gap-2.5 cursor-pointer select-none group"
            >
              <div className="w-9 h-9 rounded-xl bg-[#005a9c] text-white flex items-center justify-center shadow-xs group-hover:bg-blue-700 transition">
                <HeartPulse className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-slate-900 text-sm sm:text-base tracking-tight leading-tight flex items-center gap-1.5">
                  CarePulse <span className="text-[#005a9c] hidden sm:inline">Health Portal</span>
                </div>
                <div className="text-[10px] text-slate-400 font-medium hidden sm:block">Unified Clinical Network</div>
              </div>
            </div>
          </div>

          {/* Desktop Primary Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                    isActive
                      ? 'bg-blue-50 text-[#005a9c] font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#005a9c]' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="hidden xl:flex flex-1 max-w-xs mx-2">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search visits, Rx, records..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-100 hover:bg-slate-50 focus:bg-white border border-slate-200 rounded-full outline-none focus:ring-2 focus:ring-[#005a9c] transition"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </form>

          {/* Right Action Controls: Notifications + Profile */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Notifications Popover */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition relative"
                aria-label="View notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl p-4 z-50 text-xs animate-in zoom-in-95">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-3 font-bold text-slate-800">
                    <span>Clinical Notifications</span>
                    <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-semibold">3 New</span>
                  </div>
                  <div className="space-y-2.5">
                    <div className="p-2.5 bg-slate-50 rounded-lg hover:bg-blue-50/50 transition cursor-pointer" onClick={() => { onNavigate('prescriptions'); setNotificationsOpen(false); }}>
                      <div className="font-semibold text-slate-800 flex items-center justify-between">
                        <span>Prescription Ready</span>
                        <span className="text-[10px] text-slate-400">10m ago</span>
                      </div>
                      <div className="text-slate-500 text-[11px] mt-0.5">Amoxicillin 500mg is ready for pickup at CVS #4821.</div>
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded-lg hover:bg-blue-50/50 transition cursor-pointer" onClick={() => { onNavigate('medical-records'); setNotificationsOpen(false); }}>
                      <div className="font-semibold text-slate-800 flex items-center justify-between">
                        <span>Lab Results Verified</span>
                        <span className="text-[10px] text-slate-400">1h ago</span>
                      </div>
                      <div className="text-slate-500 text-[11px] mt-0.5">Dr. Sarah Jenkins approved Complete Blood Count.</div>
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded-lg hover:bg-blue-50/50 transition cursor-pointer" onClick={() => { onNavigate('appointment-booking'); setNotificationsOpen(false); }}>
                      <div className="font-semibold text-slate-800 flex items-center justify-between">
                        <span>Upcoming Visit Reminder</span>
                        <span className="text-[10px] text-slate-400">Oct 24</span>
                      </div>
                      <div className="text-slate-500 text-[11px] mt-0.5">Cardiology Consultation on Oct 24, 2026.</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile & Role Switcher */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1.5 pl-2 hover:bg-slate-100 rounded-lg transition border border-slate-200"
              >
                <div className="w-7 h-7 rounded-full bg-[#005a9c] text-white flex items-center justify-center font-bold text-xs">
                  {userProfile.avatarText}
                </div>
                <div className="hidden md:block text-left text-xs">
                  <div className="font-semibold text-slate-800 leading-tight">{userProfile.name}</div>
                  <div className="text-[10px] text-slate-400 capitalize">{userProfile.role}</div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-xl p-3 z-50 text-xs animate-in zoom-in-95 space-y-2">
                  <div className="pb-2 border-b border-slate-100">
                    <div className="font-bold text-slate-900">{userProfile.name}</div>
                    <div className="text-slate-500">{userProfile.email}</div>
                    <div className="text-[11px] text-indigo-600 font-medium mt-0.5">Role: {userProfile.role.toUpperCase()}</div>
                  </div>

                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1.5">
                      Switch Role Context:
                    </div>
                    <div className="space-y-1">
                      <button
                        onClick={() => {
                          onSwitchRole('patient');
                          onNavigate('patient-dashboard');
                          setProfileDropdownOpen(false);
                        }}
                        className={`w-full text-left p-2 rounded-lg flex items-center justify-between ${
                          currentRole === 'patient' ? 'bg-blue-50 text-blue-900 font-bold' : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <User className="w-3.5 h-3.5" />
                          <span>Patient (Eleanor Vance)</span>
                        </span>
                      </button>

                      <button
                        onClick={() => {
                          onSwitchRole('doctor');
                          onNavigate('medical-records');
                          setProfileDropdownOpen(false);
                        }}
                        className={`w-full text-left p-2 rounded-lg flex items-center justify-between ${
                          currentRole === 'doctor' ? 'bg-blue-50 text-blue-900 font-bold' : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <Stethoscope className="w-3.5 h-3.5" />
                          <span>Doctor (Dr. Sarah Jenkins)</span>
                        </span>
                      </button>

                      <button
                        onClick={() => {
                          onSwitchRole('administrator');
                          onNavigate('admin-dashboard');
                          setProfileDropdownOpen(false);
                        }}
                        className={`w-full text-left p-2 rounded-lg flex items-center justify-between ${
                          currentRole === 'administrator' ? 'bg-blue-50 text-blue-900 font-bold' : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <Building2 className="w-3.5 h-3.5" />
                          <span>Admin (⚡ AdminCore)</span>
                        </span>
                      </button>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100">
                    <button
                      onClick={() => {
                        onNavigate('login');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left p-2 rounded-lg text-rose-600 hover:bg-rose-50 font-medium flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out / Lock Portal</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden bg-black/50 backdrop-blur-xs flex">
          <div className="bg-white w-72 h-full p-6 shadow-2xl flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center gap-2 text-[#005a9c] font-bold">
                  <HeartPulse className="w-6 h-6" />
                  <span>CarePulse Portal</span>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="p-1 rounded text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-1.5">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onNavigate(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-medium flex items-center justify-between ${
                        isActive ? 'bg-[#005a9c] text-white font-bold' : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </span>
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 border-t space-y-2">
              <button
                onClick={() => {
                  onNavigate('login');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 px-3 border border-slate-200 text-slate-600 rounded-lg text-xs hover:bg-slate-50"
              >
                Sign Out / Return to Login
              </button>
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}
    </>
  );
}
