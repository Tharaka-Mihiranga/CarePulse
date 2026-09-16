// CarePulse Health Portal - Universal Navigation Header Component
import { getCurrentUser, saveCurrentUser, DEFAULT_PROFILES, getAppointments, getPrescriptions, getTransactions } from './storage.js';
import { icon } from './icons.js';

export function onReady(fn) {
  if (document.readyState === 'interactive' || document.readyState === 'complete') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn, { once: true });
    window.addEventListener('load', fn, { once: true });
  }
}

export function showToast(message, type = 'success') {
  let toastContainer = document.getElementById('carepulse-toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'carepulse-toast-container';
    toastContainer.className = 'fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm pointer-events-none';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  const bg = type === 'success' ? 'bg-emerald-700' : type === 'info' ? 'bg-blue-700' : 'bg-rose-700';
  toast.className = `${bg} text-white px-4 py-3 rounded-xl shadow-lg text-xs font-semibold flex items-center gap-2.5 transition-all transform translate-y-2 opacity-0 pointer-events-auto`;
  toast.innerHTML = `
    <span class="shrink-0">${icon(type === 'success' ? 'check' : 'alert-circle', 'w-4 h-4')}</span>
    <span class="flex-1">${message}</span>
    <button class="text-white/80 hover:text-white shrink-0 ml-1" onclick="this.parentElement.remove()">&times;</button>
  `;

  toastContainer.appendChild(toast);
  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-2', 'opacity-0');
  });

  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

export function setupNavigation(activePageId) {
  const headerContainer = document.getElementById('carepulse-header');
  if (!headerContainer) return;

  const currentUser = getCurrentUser();
  const prescriptions = getPrescriptions();
  const appointments = getAppointments();
  const unpaidApts = appointments.filter(a => !a.paid).length;
  const activeRxs = prescriptions.filter(p => p.status === 'Active').length;

  const NAV_LINKS = [
    { id: 'dashboard', label: 'Dashboard', href: './index.html', iconName: 'dashboard', badge: null },
    { id: 'appointments', label: 'Book Visit', href: './appointments.html', iconName: 'calendar', badge: appointments.length > 0 ? `${appointments.length}` : null },
    { id: 'records', label: 'EHR Records', href: './medical-records.html', iconName: 'file-text', badge: '3 Lab' },
    { id: 'prescriptions', label: 'Pharmacy Rx', href: './prescriptions.html', iconName: 'pill', badge: `${activeRxs} Active` },
    { id: 'billing', label: 'Billing', href: './billing.html', iconName: 'credit-card', badge: unpaidApts > 0 ? `${unpaidApts} Due` : null },
    { id: 'admin', label: 'AdminCore', href: './admin.html', iconName: 'building', badge: 'Admin' },
  ];

  headerContainer.innerHTML = `
    <header class="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      
      <!-- Top Brand & Controls Row -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-15 flex items-center justify-between gap-3 sm:gap-4">
        
        <!-- Logo -->
        <a href="./index.html" class="flex items-center gap-2.5 select-none group text-decoration-none shrink-0">
          <div class="w-9 h-9 rounded-xl bg-[#005a9c] text-white flex items-center justify-center shadow-xs group-hover:bg-blue-700 transition">
            ${icon('heart-pulse', 'w-5 h-5')}
          </div>
          <div>
            <div class="font-bold text-slate-900 text-sm sm:text-base tracking-tight leading-tight flex items-center gap-1.5">
              CarePulse <span class="text-[#005a9c] hidden sm:inline">Health Portal</span>
            </div>
            <div class="text-[10px] text-slate-400 font-medium hidden sm:block">Unified Clinical EHR & Patient Network</div>
          </div>
        </a>

        <!-- Interactive Universal Search Bar -->
        <div class="relative flex-1 max-w-xs sm:max-w-md mx-1 sm:mx-4">
          <form id="nav-search-form" class="relative w-full">
            <input
              type="text"
              id="nav-search-input"
              placeholder="Search visits, Rx medications, EHR records, doctors..."
              autocomplete="off"
              class="w-full pl-8 pr-8 py-1.5 text-xs bg-slate-100 hover:bg-slate-50 focus:bg-white border border-slate-200 rounded-full outline-none focus:ring-2 focus:ring-[#005a9c] transition"
            />
            <span class="text-slate-400 absolute left-2.5 top-2">${icon('search', 'w-3.5 h-3.5')}</span>
            <button type="button" id="nav-search-clear" class="hidden text-slate-400 hover:text-slate-600 absolute right-2.5 top-1.5 text-sm">&times;</button>
          </form>

          <!-- Live Search Results Dropdown -->
          <div id="nav-search-results" class="hidden absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl p-2 z-50 max-h-72 overflow-y-auto text-xs divide-y divide-slate-100">
          </div>
        </div>

        <!-- Right Controls: Active Persona Pill, Notifications, Profile -->
        <div class="flex items-center gap-1.5 sm:gap-2 shrink-0">
          
          <!-- Role Indicator Pill -->
          <div class="hidden md:flex items-center gap-1 px-2.5 py-1 bg-blue-50 border border-blue-200/80 rounded-lg text-[11px] font-semibold text-[#005a9c]">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span class="capitalize">${currentUser.role}:</span>
            <span class="text-slate-700 truncate max-w-[110px]">${currentUser.name.split(' ')[0]}</span>
          </div>

          <!-- Notifications Dropdown -->
          <div class="relative">
            <button id="btn-notif-toggle" aria-label="Notifications" class="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition relative">
              ${icon('bell', 'w-4 h-4')}
              <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
            </button>

            <div id="notif-dropdown" class="hidden absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl p-3 z-50 text-xs">
              <div class="flex items-center justify-between pb-2 border-b border-slate-100 mb-2 font-bold text-slate-800">
                <span>Clinical Notifications</span>
                <span class="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-semibold">3 Active</span>
              </div>
              <div class="space-y-1.5">
                <a href="./prescriptions.html" class="block p-2 bg-slate-50 rounded-lg hover:bg-blue-50/70 transition">
                  <div class="font-semibold text-slate-800 flex items-center justify-between">
                    <span>Prescription Refill Ready</span>
                    <span class="text-[9px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">Rx Ready</span>
                  </div>
                  <div class="text-slate-500 text-[11px] mt-0.5">Amoxicillin 500mg verified at CVS Pharmacy.</div>
                </a>
                <a href="./medical-records.html" class="block p-2 bg-slate-50 rounded-lg hover:bg-blue-50/70 transition">
                  <div class="font-semibold text-slate-800 flex items-center justify-between">
                    <span>Lab Results Signed</span>
                    <span class="text-[9px] text-blue-600 font-bold bg-blue-50 px-1.5 py-0.5 rounded">CBC Panel</span>
                  </div>
                  <div class="text-slate-500 text-[11px] mt-0.5">Dr. Sarah Jenkins verified Complete Blood Count.</div>
                </a>
                <a href="./appointments.html" class="block p-2 bg-slate-50 rounded-lg hover:bg-blue-50/70 transition">
                  <div class="font-semibold text-slate-800 flex items-center justify-between">
                    <span>Appointment Reminder</span>
                    <span class="text-[9px] text-amber-600 font-bold bg-amber-50 px-1.5 py-0.5 rounded">Upcoming</span>
                  </div>
                  <div class="text-slate-500 text-[11px] mt-0.5">Cardiology follow-up scheduled for Oct 24, 10:30 AM.</div>
                </a>
              </div>
            </div>
          </div>

          <!-- User Profile & Persona Switcher -->
          <div class="relative">
            <button id="btn-user-toggle" class="flex items-center gap-1.5 p-1.5 pl-2 hover:bg-slate-100 rounded-lg transition border border-slate-200">
              <div class="w-7 h-7 rounded-full bg-[#005a9c] text-white flex items-center justify-center font-bold text-xs">
                ${currentUser.avatarText || 'CP'}
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
                <div class="text-slate-500 text-[11px]">${currentUser.email}</div>
                <div class="text-[11px] text-[#005a9c] font-semibold mt-0.5 capitalize">Active Role: ${currentUser.role}</div>
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
                    <span>Admin (System AdminCore)</span>
                  </button>
                </div>
              </div>

              <div class="pt-2 border-t border-slate-100">
                <a href="./login.html" class="w-full text-left p-2 rounded-lg text-rose-600 hover:bg-rose-50 font-medium flex items-center gap-2">
                  ${icon('logout', 'w-3.5 h-3.5')}
                  <span>Sign Out / Role Selection</span>
                </a>
              </div>
            </div>
          </div>

        </div>

      </div>

      <!-- ALWAYS VISIBLE MAIN NAVIGATION BAR (All 6 core modules) -->
      <div class="bg-slate-50 border-t border-slate-200 px-3 sm:px-6 lg:px-8 shadow-inner">
        <div class="max-w-7xl mx-auto flex items-center justify-start sm:justify-between gap-1 sm:gap-2 overflow-x-auto py-2 scrollbar-none">
          <div class="flex items-center gap-1 sm:gap-2 shrink-0">
            ${NAV_LINKS.map(link => {
              const isActive = activePageId === link.id;
              return `
                <a
                  href="${link.href}"
                  id="nav-link-${link.id}"
                  class="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition whitespace-nowrap ${
                    isActive
                      ? 'bg-[#005a9c] text-white shadow-xs font-bold'
                      : 'text-slate-700 bg-white hover:bg-slate-100 border border-slate-200/80 hover:text-slate-900'
                  }"
                >
                  ${icon(link.iconName, `w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`)}
                  <span>${link.label}</span>
                  ${link.badge ? `
                    <span class="text-[10px] px-1.5 py-0.2 rounded-full font-bold leading-tight ${
                      isActive ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-700 border border-blue-200/60'
                    }">${link.badge}</span>
                  ` : ''}
                </a>
              `;
            }).join('')}
          </div>

          <!-- Fast Role Quick-Switcher Pills -->
          <div class="hidden xl:flex items-center gap-1 shrink-0 text-[11px] text-slate-500 pl-4 border-l border-slate-200">
            <span class="font-medium text-slate-400">View as:</span>
            <button data-switch-persona="patient" class="px-2 py-0.5 rounded ${currentUser.role === 'patient' ? 'bg-blue-100 text-blue-800 font-bold' : 'hover:bg-slate-200 text-slate-600'}">Patient</button>
            <button data-switch-persona="doctor" class="px-2 py-0.5 rounded ${currentUser.role === 'doctor' ? 'bg-blue-100 text-blue-800 font-bold' : 'hover:bg-slate-200 text-slate-600'}">Doctor</button>
            <button data-switch-persona="administrator" class="px-2 py-0.5 rounded ${currentUser.role === 'administrator' ? 'bg-blue-100 text-blue-800 font-bold' : 'hover:bg-slate-200 text-slate-600'}">AdminCore</button>
          </div>
        </div>
      </div>

    </header>
  `;

  // Wire up event listeners
  const btnNotif = document.getElementById('btn-notif-toggle');
  const notifDropdown = document.getElementById('notif-dropdown');
  const btnUser = document.getElementById('btn-user-toggle');
  const userDropdown = document.getElementById('user-dropdown');

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

  document.addEventListener('click', (e) => {
    if (!notifDropdown?.contains(e.target)) notifDropdown?.classList.add('hidden');
    if (!userDropdown?.contains(e.target)) userDropdown?.classList.add('hidden');
    const searchResults = document.getElementById('nav-search-results');
    if (!searchResults?.contains(e.target) && e.target !== document.getElementById('nav-search-input')) {
      searchResults?.classList.add('hidden');
    }
  });

  // Persona switch buttons
  document.querySelectorAll('[data-switch-persona]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const role = btn.getAttribute('data-switch-persona');
      if (role && DEFAULT_PROFILES[role]) {
        saveCurrentUser(DEFAULT_PROFILES[role]);
        showToast(`Switched active persona to ${DEFAULT_PROFILES[role].name} (${role})`);
        setTimeout(() => {
          window.location.reload();
        }, 300);
      }
    });
  });

  // Live search functionality
  const searchInput = document.getElementById('nav-search-input');
  const searchResults = document.getElementById('nav-search-results');
  const searchClear = document.getElementById('nav-search-clear');
  const searchForm = document.getElementById('nav-search-form');

  function performSearch(query) {
    if (!query || query.trim().length < 2) {
      searchResults?.classList.add('hidden');
      searchClear?.classList.add('hidden');
      return;
    }

    searchClear?.classList.remove('hidden');
    const q = query.toLowerCase().trim();
    const results = [];

    // Search prescriptions
    prescriptions.forEach(p => {
      if (p.medication.toLowerCase().includes(q) || p.instructions.toLowerCase().includes(q)) {
        results.push({
          title: `Rx: ${p.medication} ${p.dosage}`,
          desc: `${p.instructions} • ${p.status}`,
          badge: 'Pharmacy Rx',
          badgeColor: 'bg-emerald-50 text-emerald-700',
          link: './prescriptions.html'
        });
      }
    });

    // Search appointments
    appointments.forEach(a => {
      if (a.doctorName.toLowerCase().includes(q) || a.doctorSpecialty.toLowerCase().includes(q) || a.reason.toLowerCase().includes(q)) {
        results.push({
          title: `Visit: ${a.doctorName} (${a.doctorSpecialty})`,
          desc: `${a.date} at ${a.time} • ${a.reason}`,
          badge: 'Book Visit',
          badgeColor: 'bg-blue-50 text-blue-700',
          link: './appointments.html'
        });
      }
    });

    // Generic section matches
    if ('ehr records labs notes blood tests'.includes(q)) {
      results.push({
        title: 'EHR Medical Records & Lab Panels',
        desc: 'Comprehensive blood counts, metabolic panels, and clinical SOAP notes.',
        badge: 'EHR Records',
        badgeColor: 'bg-indigo-50 text-indigo-700',
        link: './medical-records.html'
      });
    }

    if ('billing payments invoices copay insurance transactions'.includes(q)) {
      results.push({
        title: 'Billing & Payment Gateway',
        desc: 'Pay copays, view itemized charges, and download statements.',
        badge: 'Billing',
        badgeColor: 'bg-amber-50 text-amber-700',
        link: './billing.html'
      });
    }

    if ('admincore bed occupancy hospital metrics triage staff'.includes(q)) {
      results.push({
        title: 'AdminCore Operations Dashboard',
        desc: 'Live bed census, ER wait times, and physician rosters.',
        badge: 'AdminCore',
        badgeColor: 'bg-purple-50 text-purple-700',
        link: './admin.html'
      });
    }

    if (results.length === 0) {
      searchResults.innerHTML = `
        <div class="p-3 text-center text-slate-400">
          No matches found for "<span class="font-semibold text-slate-600">${query}</span>". Try searching "Amoxicillin", "Dr. Sarah", "Blood", or "Copay".
        </div>
      `;
    } else {
      searchResults.innerHTML = results.slice(0, 5).map(res => `
        <a href="${res.link}" class="block p-2.5 hover:bg-slate-50 transition rounded-lg">
          <div class="flex items-center justify-between">
            <span class="font-bold text-slate-900">${res.title}</span>
            <span class="text-[10px] font-bold px-1.5 py-0.5 rounded ${res.badgeColor}">${res.badge}</span>
          </div>
          <div class="text-[11px] text-slate-500 mt-0.5">${res.desc}</div>
        </a>
      `).join('');
    }

    searchResults?.classList.remove('hidden');
  }

  searchInput?.addEventListener('input', (e) => {
    performSearch(e.target.value);
  });

  searchClear?.addEventListener('click', () => {
    if (searchInput) searchInput.value = '';
    searchResults?.classList.add('hidden');
    searchClear?.classList.add('hidden');
  });

  searchForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = (searchInput?.value || '').toLowerCase();
    if (query.includes('book') || query.includes('appoint')) window.location.href = './appointments.html';
    else if (query.includes('rx') || query.includes('prescri') || query.includes('pill')) window.location.href = './prescriptions.html';
    else if (query.includes('record') || query.includes('lab') || query.includes('soap')) window.location.href = './medical-records.html';
    else if (query.includes('pay') || query.includes('bill')) window.location.href = './billing.html';
    else if (query.includes('admin')) window.location.href = './admin.html';
    else if (query.length > 0) window.location.href = './medical-records.html';
  });
}
