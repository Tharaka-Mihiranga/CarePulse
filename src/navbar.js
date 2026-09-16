// CarePulse Health Portal - Universal Navigation Header Component
import { getCurrentUser, saveCurrentUser, DEFAULT_PROFILES } from './storage.js';
import { icon } from './icons.js';

export function setupNavigation(activePageId) {
  const headerContainer = document.getElementById('carepulse-header');
  if (!headerContainer) return;

  const currentUser = getCurrentUser();

  const NAV_LINKS = [
    { id: 'dashboard', label: 'Dashboard', href: './index.html', iconName: 'dashboard' },
    { id: 'appointments', label: 'Book Visit', href: './appointments.html', iconName: 'calendar' },
    { id: 'records', label: 'EHR Records', href: './medical-records.html', iconName: 'file-text' },
    { id: 'prescriptions', label: 'Pharmacy Rx', href: './prescriptions.html', iconName: 'pill' },
    { id: 'billing', label: 'Billing', href: './billing.html', iconName: 'credit-card' },
    { id: 'admin', label: 'AdminCore', href: './admin.html', iconName: 'building' },
  ];

  headerContainer.innerHTML = `
    <header class="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        <!-- Logo -->
        <a href="./index.html" class="flex items-center gap-2.5 select-none group text-decoration-none">
          <div class="w-9 h-9 rounded-xl bg-[#005a9c] text-white flex items-center justify-center shadow-xs group-hover:bg-blue-700 transition">
            ${icon('heart-pulse', 'w-5 h-5')}
          </div>
          <div>
            <div class="font-bold text-slate-900 text-sm sm:text-base tracking-tight leading-tight flex items-center gap-1.5">
              CarePulse <span class="text-[#005a9c] hidden sm:inline">Health Portal</span>
            </div>
            <div class="text-[10px] text-slate-400 font-medium hidden sm:block">Unified Clinical Network</div>
          </div>
        </a>

        <!-- Desktop Navigation Links -->
        <nav class="hidden lg:flex items-center gap-1">
          ${NAV_LINKS.map(link => `
            <a href="${link.href}" class="px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activePageId === link.id
                ? 'bg-blue-50 text-[#005a9c] font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }">
              ${icon(link.iconName, `w-4 h-4 ${activePageId === link.id ? 'text-[#005a9c]' : 'text-slate-500'}`)}
              <span>${link.label}</span>
            </a>
          `).join('')}
        </nav>

        <!-- Search Bar -->
        <form id="nav-search-form" class="hidden md:flex flex-1 max-w-xs mx-2">
          <div class="relative w-full">
            <input
              type="text"
              id="nav-search-input"
              placeholder="Search Rx, visits, records..."
              class="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-100 hover:bg-slate-50 focus:bg-white border border-slate-200 rounded-full outline-none focus:ring-2 focus:ring-[#005a9c] transition"
            />
            <span class="text-slate-400 absolute left-2.5 top-2">${icon('search', 'w-3.5 h-3.5')}</span>
          </div>
        </form>

        <!-- Right Controls: Notifications & Profile & Mobile Toggle -->
        <div class="flex items-center gap-2">
          
          <!-- Notifications Dropdown -->
          <div class="relative">
            <button id="btn-notif-toggle" class="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition relative">
              ${icon('bell', 'w-4 h-4')}
              <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
            </button>

            <div id="notif-dropdown" class="hidden absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl p-4 z-50 text-xs">
              <div class="flex items-center justify-between pb-2 border-b border-slate-100 mb-3 font-bold text-slate-800">
                <span>Clinical Notifications</span>
                <span class="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-semibold">3 New</span>
              </div>
              <div class="space-y-2">
                <a href="./prescriptions.html" class="block p-2.5 bg-slate-50 rounded-lg hover:bg-blue-50/50 transition">
                  <div class="font-semibold text-slate-800">Prescription Refill Ready</div>
                  <div class="text-slate-500 text-[11px]">Amoxicillin 500mg verified at CVS #4821.</div>
                </a>
                <a href="./medical-records.html" class="block p-2.5 bg-slate-50 rounded-lg hover:bg-blue-50/50 transition">
                  <div class="font-semibold text-slate-800">Lab Results Signed</div>
                  <div class="text-slate-500 text-[11px]">Dr. Jenkins verified Complete Blood Count.</div>
                </a>
              </div>
            </div>
          </div>

          <!-- User Profile & Persona Switcher -->
          <div class="relative">
            <button id="btn-user-toggle" class="flex items-center gap-2 p-1.5 pl-2 hover:bg-slate-100 rounded-lg transition border border-slate-200">
              <div class="w-7 h-7 rounded-full bg-[#005a9c] text-white flex items-center justify-center font-bold text-xs">
                ${currentUser.avatarText}
              </div>
              <div class="hidden sm:block text-left text-xs">
                <div class="font-semibold text-slate-800 leading-tight">${currentUser.name}</div>
                <div class="text-[10px] text-slate-400 capitalize">${currentUser.role}</div>
              </div>
              ${icon('chevron', 'w-3.5 h-3.5 text-slate-400')}
            </button>

            <div id="user-dropdown" class="hidden absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-xl p-3 z-50 text-xs space-y-2">
              <div class="pb-2 border-b border-slate-100">
                <div class="font-bold text-slate-900">${currentUser.name}</div>
                <div class="text-slate-500">${currentUser.email}</div>
                <div class="text-[11px] text-[#005a9c] font-semibold mt-0.5 capitalize">Role: ${currentUser.role}</div>
              </div>

              <div>
                <div class="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1.5">Switch Persona Role:</div>
                <div class="space-y-1">
                  <button data-switch-persona="patient" class="w-full text-left p-2 rounded-lg flex items-center gap-2 ${currentUser.role === 'patient' ? 'bg-blue-50 text-blue-900 font-bold' : 'hover:bg-slate-50 text-slate-700'}">
                    ${icon('user', 'w-3.5 h-3.5')}
                    <span>Patient (Eleanor Vance)</span>
                  </button>
                  <button data-switch-persona="doctor" class="w-full text-left p-2 rounded-lg flex items-center gap-2 ${currentUser.role === 'doctor' ? 'bg-blue-50 text-blue-900 font-bold' : 'hover:bg-slate-50 text-slate-700'}">
                    ${icon('stethoscope', 'w-3.5 h-3.5')}
                    <span>Doctor (Dr. Sarah Jenkins)</span>
                  </button>
                  <button data-switch-persona="administrator" class="w-full text-left p-2 rounded-lg flex items-center gap-2 ${currentUser.role === 'administrator' ? 'bg-blue-50 text-blue-900 font-bold' : 'hover:bg-slate-50 text-slate-700'}">
                    ${icon('building', 'w-3.5 h-3.5')}
                    <span>Admin (⚡ AdminCore)</span>
                  </button>
                </div>
              </div>

              <div class="pt-2 border-t border-slate-100">
                <a href="./login.html" class="w-full text-left p-2 rounded-lg text-rose-600 hover:bg-rose-50 font-medium flex items-center gap-2">
                  ${icon('logout', 'w-3.5 h-3.5')}
                  <span>Sign Out / Persona Screen</span>
                </a>
              </div>
            </div>
          </div>

          <!-- Mobile Menu Button -->
          <button id="btn-mobile-toggle" class="lg:hidden p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg">
            ${icon('menu', 'w-5 h-5')}
          </button>

        </div>

      </div>

      <!-- Mobile Navigation Drawer -->
      <div id="mobile-nav-drawer" class="hidden lg:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1">
        ${NAV_LINKS.map(link => `
          <a href="${link.href}" class="block px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 ${
            activePageId === link.id
              ? 'bg-blue-50 text-[#005a9c] font-bold'
              : 'text-slate-600 hover:bg-slate-50'
          }">
            ${icon(link.iconName, 'w-4 h-4')}
            <span>${link.label}</span>
          </a>
        `).join('')}
      </div>
    </header>
  `;

  // Wire up event listeners
  const btnNotif = document.getElementById('btn-notif-toggle');
  const notifDropdown = document.getElementById('notif-dropdown');
  const btnUser = document.getElementById('btn-user-toggle');
  const userDropdown = document.getElementById('user-dropdown');
  const btnMobile = document.getElementById('btn-mobile-toggle');
  const mobileDrawer = document.getElementById('mobile-nav-drawer');

  btnNotif?.addEventListener('click', (e) => {
    e.stopPropagation();
    notifDropdown?.classList.toggle('hidden');
    userDropdown?.classList.add('hidden');
  });

  btnUser?.addEventListener('click', (e) => {
    e.stopPropagation();
    userDropdown?.classList.toggle('hidden');
    notifDropdown?.classList.add('hidden');
  });

  btnMobile?.addEventListener('click', () => {
    mobileDrawer?.classList.toggle('hidden');
  });

  document.addEventListener('click', () => {
    notifDropdown?.classList.add('hidden');
    userDropdown?.classList.add('hidden');
  });

  // Persona switch buttons
  document.querySelectorAll('[data-switch-persona]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const role = btn.getAttribute('data-switch-persona');
      if (role && DEFAULT_PROFILES[role]) {
        saveCurrentUser(DEFAULT_PROFILES[role]);
        window.location.reload();
      }
    });
  });

  // Search input redirect
  const searchForm = document.getElementById('nav-search-form');
  searchForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = (document.getElementById('nav-search-input')?.value || '').toLowerCase();
    if (query.includes('book') || query.includes('appoint')) window.location.href = './appointments.html';
    else if (query.includes('rx') || query.includes('prescri') || query.includes('pill')) window.location.href = './prescriptions.html';
    else if (query.includes('record') || query.includes('lab') || query.includes('soap')) window.location.href = './medical-records.html';
    else if (query.includes('pay') || query.includes('bill')) window.location.href = './billing.html';
    else if (query.includes('admin')) window.location.href = './admin.html';
    else window.location.href = './index.html';
  });
}
