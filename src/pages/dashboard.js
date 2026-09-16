// Patient Dashboard Logic
import { setupNavigation } from '../navbar.js';
import { getCurrentUser, getVitals, getAppointments, getPrescriptions, getLabReports } from '../storage.js';
import { icon } from '../icons.js';

document.addEventListener('DOMContentLoaded', () => {
  setupNavigation('dashboard');

  const user = getCurrentUser();
  const vitals = getVitals();
  const appointments = getAppointments();
  const prescriptions = getPrescriptions();
  const labReports = getLabReports();

  // Populate User Info
  const userNameEl = document.getElementById('user-welcome-name');
  if (userNameEl) userNameEl.textContent = `Welcome back, ${user.name}`;
  const userMrnEl = document.getElementById('user-mrn');
  if (userMrnEl) userMrnEl.textContent = user.mrn || 'PT-84920';
  const userDoctorEl = document.getElementById('user-doctor');
  if (userDoctorEl) userDoctorEl.textContent = user.primaryDoctor || 'Dr. Sarah Jenkins, MD';

  // Populate Vitals
  document.getElementById('vital-hr').textContent = vitals.heartRate;
  document.getElementById('vital-bp').textContent = `${vitals.systolic}/${vitals.diastolic}`;
  document.getElementById('vital-bs').textContent = vitals.bloodSugar;
  document.getElementById('vital-weight').textContent = vitals.weight;

  // Render Appointments List
  const aptsList = document.getElementById('dashboard-appointments-list');
  if (aptsList) {
    aptsList.innerHTML = appointments.slice(0, 3).map(apt => `
      <div class="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition">
        <div class="flex items-start gap-3.5">
          <div class="w-10 h-10 rounded-xl bg-blue-50 text-[#005a9c] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
            ${icon('calendar', 'w-5 h-5')}
          </div>
          <div>
            <div class="font-bold text-slate-900 text-sm flex items-center gap-2">
              <span>${apt.doctorName}</span>
              <span class="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-slate-100 text-slate-600">${apt.doctorSpecialty}</span>
            </div>
            <div class="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span class="flex items-center gap-1 font-medium text-slate-700">${icon('clock', 'w-3.5 h-3.5 text-slate-400')} ${apt.date} at ${apt.time}</span>
              <span class="flex items-center gap-1">${icon('map-pin', 'w-3.5 h-3.5 text-slate-400')} ${apt.location}</span>
            </div>
            <div class="text-[11px] text-slate-400 mt-1">${apt.reason}</div>
          </div>
        </div>

        <div class="flex items-center gap-2 shrink-0 self-end sm:self-center">
          ${!apt.paid ? `
            <a href="/billing.html?service=${encodeURIComponent('Copay: ' + apt.doctorSpecialty)}&amount=50.00" class="px-3 py-1.5 bg-blue-50 text-[#005a9c] hover:bg-blue-100 rounded-lg text-xs font-semibold transition flex items-center gap-1.5">
              ${icon('credit-card', 'w-3.5 h-3.5')}
              <span>Pay ${apt.copay}</span>
            </a>
          ` : `
            <span class="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-[11px] font-semibold flex items-center gap-1">
              ${icon('check', 'w-3 h-3')} Copay Paid
            </span>
          `}
          <span class="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-[11px] font-medium">
            ${apt.type}
          </span>
        </div>
      </div>
    `).join('');
  }

  // Render Prescriptions List
  const rxList = document.getElementById('dashboard-prescriptions-list');
  if (rxList) {
    rxList.innerHTML = prescriptions.slice(0, 2).map(rx => `
      <div class="p-4 rounded-xl border border-slate-200 hover:border-blue-300 transition bg-slate-50/50 flex flex-col justify-between">
        <div>
          <div class="flex items-start justify-between">
            <div>
              <div class="font-bold text-slate-900 text-sm">${rx.medication}</div>
              <div class="text-xs font-semibold text-[#005a9c]">${rx.dosage} • ${rx.status}</div>
            </div>
            <span class="text-[11px] bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded-full font-medium">
              ${rx.refillsLeft} refills left
            </span>
          </div>
          <div class="text-xs text-slate-500 mt-2 line-clamp-2">${rx.frequency}</div>
          <div class="text-[11px] text-slate-400 mt-1">${rx.pharmacy}</div>
        </div>

        <div class="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between">
          <span class="text-xs font-bold text-slate-700">Copay: ${rx.copay}</span>
          <a href="/prescriptions.html" class="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition">
            Request Refill
          </a>
        </div>
      </div>
    `).join('');
  }

  // Render Lab Reports List
  const labList = document.getElementById('dashboard-labs-list');
  if (labList) {
    labList.innerHTML = labReports.map(lab => `
      <div class="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-blue-50/30 transition flex items-center justify-between">
        <div>
          <div class="font-semibold text-slate-900 text-xs">${lab.testName}</div>
          <div class="text-[11px] text-slate-500 mt-0.5">${lab.date} • ${lab.orderedBy}</div>
        </div>
        <a href="/medical-records.html" class="p-2 text-slate-400 hover:text-[#005a9c] hover:bg-white rounded-lg transition border border-transparent hover:border-slate-200">
          ${icon('eye', 'w-4 h-4')}
        </a>
      </div>
    `).join('');
  }
});
