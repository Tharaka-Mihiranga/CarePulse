// Patient Dashboard Logic - Interactive & Reactive
import { setupNavigation, onReady, showToast } from '../navbar.js';
import {
  getCurrentUser,
  getVitals,
  saveVitals,
  getAppointments,
  saveAppointments,
  getPrescriptions,
  savePrescriptions,
  getLabReports,
  getEmergencyAlert
} from '../storage.js';
import { icon } from '../icons.js';

function initDashboard() {
  setupNavigation('dashboard');

  const user = getCurrentUser();
  const alertData = getEmergencyAlert();

  // Populate User Info
  const userNameEl = document.getElementById('user-welcome-name');
  if (userNameEl) userNameEl.textContent = `Welcome back, ${user.name}`;
  const userMrnEl = document.getElementById('user-mrn');
  if (userMrnEl) userMrnEl.textContent = user.mrn || 'PT-84920';
  const userDoctorEl = document.getElementById('user-doctor');
  if (userDoctorEl) userDoctorEl.textContent = user.primaryDoctor || 'Dr. Sarah Jenkins, MD';

  // Role Badge
  const roleBadge = document.getElementById('user-role-badge');
  if (roleBadge) {
    if (user.role === 'doctor') {
      roleBadge.className = 'px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200';
      roleBadge.textContent = 'Physician Credentialed';
    } else if (user.role === 'administrator') {
      roleBadge.className = 'px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200';
      roleBadge.textContent = 'System AdminCore';
    } else {
      roleBadge.className = 'px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200';
      roleBadge.textContent = 'Active Patient Member';
    }
  }

  // Handle Emergency Alert Banner
  const alertBanner = document.getElementById('dashboard-alert-banner');
  const alertTitle = document.getElementById('alert-title');
  const alertMessage = document.getElementById('alert-message');
  const btnDismissAlert = document.getElementById('btn-dismiss-alert');

  if (alertData && alertData.active && alertBanner) {
    alertBanner.classList.remove('hidden');
    if (alertTitle) alertTitle.textContent = alertData.title;
    if (alertMessage) alertMessage.textContent = alertData.message;

    btnDismissAlert?.addEventListener('click', () => {
      alertBanner.classList.add('hidden');
    });
  }

  // Render Vitals & Status
  function renderVitals() {
    const vitals = getVitals();
    const hrEl = document.getElementById('vital-hr');
    const bpEl = document.getElementById('vital-bp');
    const bsEl = document.getElementById('vital-bs');
    const weightEl = document.getElementById('vital-weight');
    const hrStatusEl = document.getElementById('vital-hr-status');
    const bpStatusEl = document.getElementById('vital-bp-status');
    const bsStatusEl = document.getElementById('vital-bs-status');
    const bmiStatusEl = document.getElementById('vital-bmi-status');

    if (hrEl) hrEl.textContent = vitals.heartRate;
    if (bpEl) bpEl.textContent = `${vitals.systolic}/${vitals.diastolic}`;
    if (bsEl) bsEl.textContent = vitals.bloodSugar;
    if (weightEl) weightEl.textContent = vitals.weight;

    // Status diagnostics
    if (hrStatusEl) {
      if (vitals.heartRate > 100) {
        hrStatusEl.textContent = 'Tachycardia elevated';
        hrStatusEl.className = 'text-xs text-rose-600 font-medium mt-1';
      } else if (vitals.heartRate < 60) {
        hrStatusEl.textContent = 'Bradycardia low';
        hrStatusEl.className = 'text-xs text-amber-600 font-medium mt-1';
      } else {
        hrStatusEl.textContent = 'Normal resting rhythm';
        hrStatusEl.className = 'text-xs text-emerald-600 font-medium mt-1';
      }
    }

    if (bpStatusEl) {
      if (vitals.systolic >= 130 || vitals.diastolic >= 85) {
        bpStatusEl.textContent = 'Pre-hypertension stage';
        bpStatusEl.className = 'text-xs text-amber-600 font-medium mt-1';
      } else {
        bpStatusEl.textContent = 'Optimal arterial baseline';
        bpStatusEl.className = 'text-xs text-emerald-600 font-medium mt-1';
      }
    }

    if (bsStatusEl) {
      if (vitals.bloodSugar > 120) {
        bsStatusEl.textContent = 'Elevated postprandial';
        bsStatusEl.className = 'text-xs text-amber-600 font-medium mt-1';
      } else {
        bsStatusEl.textContent = 'Fasting euglycemic range';
        bsStatusEl.className = 'text-xs text-emerald-600 font-medium mt-1';
      }
    }

    if (bmiStatusEl) {
      // Assuming avg height 1.74m
      const heightM = 1.74;
      const bmi = (vitals.weight / (heightM * heightM)).toFixed(1);
      let cat = 'Normal';
      if (bmi < 18.5) cat = 'Underweight';
      else if (bmi >= 25) cat = 'Overweight';
      bmiStatusEl.textContent = `BMI ${bmi} (${cat})`;
    }
  }

  renderVitals();

  // Render Appointments List
  function renderAppointments() {
    const appointments = getAppointments();
    const aptsList = document.getElementById('dashboard-appointments-list');
    if (!aptsList) return;

    if (appointments.length === 0) {
      aptsList.innerHTML = `
        <div class="p-8 text-center text-slate-400">
          <div class="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-2">
            ${icon('calendar', 'w-6 h-6')}
          </div>
          <p class="font-semibold text-slate-600 text-xs">No upcoming appointments scheduled</p>
          <a href="./appointments.html" class="inline-block mt-3 px-4 py-2 bg-[#005a9c] hover:bg-blue-700 text-white rounded-xl text-xs font-semibold">
            Book a Clinic or Virtual Visit
          </a>
        </div>
      `;
      return;
    }

    aptsList.innerHTML = appointments.slice(0, 3).map(apt => `
      <div class="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition" data-apt-id="${apt.id}">
        <div class="flex items-start gap-3.5">
          <div class="w-10 h-10 rounded-xl bg-blue-50 text-[#005a9c] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 shadow-2xs">
            ${icon('calendar', 'w-5 h-5')}
          </div>
          <div>
            <div class="font-bold text-slate-900 text-sm flex items-center gap-2">
              <span>${apt.doctorName}</span>
              <span class="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-slate-100 text-slate-600">${apt.doctorSpecialty}</span>
            </div>
            <div class="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span class="flex items-center gap-1 font-semibold text-slate-700">
                ${icon('clock', 'w-3.5 h-3.5 text-slate-400')} ${apt.date} at ${apt.time}
              </span>
              <span class="flex items-center gap-1">
                ${icon('map-pin', 'w-3.5 h-3.5 text-slate-400')} ${apt.location}
              </span>
            </div>
            <div class="text-[11px] text-slate-400 mt-1">${apt.reason}</div>
          </div>
        </div>

        <div class="flex items-center gap-2 shrink-0 self-end sm:self-center">
          ${!apt.paid ? `
            <a href="./billing.html?service=${encodeURIComponent('Copay: ' + apt.doctorSpecialty)}&amount=50.00" class="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#005a9c] rounded-lg text-xs font-bold transition flex items-center gap-1.5 border border-blue-200">
              ${icon('credit-card', 'w-3.5 h-3.5')}
              <span>Pay ${apt.copay}</span>
            </a>
          ` : `
            <span class="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-[11px] font-semibold flex items-center gap-1">
              ${icon('check', 'w-3 h-3')} Copay Paid
            </span>
          `}
          
          <button data-cancel-apt="${apt.id}" class="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition" title="Cancel this appointment">
            ${icon('trash', 'w-4 h-4')}
          </button>
        </div>
      </div>
    `).join('');

    // Wire up cancel appointment clicks
    aptsList.querySelectorAll('[data-cancel-apt]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = btn.getAttribute('data-cancel-apt');
        if (confirm('Are you sure you want to cancel this appointment?')) {
          const currentApts = getAppointments();
          const updated = currentApts.filter(a => a.id !== id);
          saveAppointments(updated);
          showToast('Appointment cancelled successfully', 'info');
          renderAppointments();
        }
      });
    });
  }

  renderAppointments();

  // Render Prescriptions List
  function renderPrescriptions() {
    const prescriptions = getPrescriptions();
    const rxList = document.getElementById('dashboard-prescriptions-list');
    if (!rxList) return;

    rxList.innerHTML = prescriptions.slice(0, 4).map(rx => `
      <div class="p-4 rounded-xl border border-slate-200/80 hover:border-slate-300 bg-slate-50/50 hover:bg-white transition flex flex-col justify-between" data-rx-id="${rx.id}">
        <div>
          <div class="flex items-start justify-between gap-2">
            <div>
              <div class="font-bold text-slate-900 text-xs sm:text-sm">${rx.medication}</div>
              <div class="text-xs text-slate-500 mt-0.5">${rx.dosage} • ${rx.frequency}</div>
            </div>
            <span class="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
              rx.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
            }">${rx.status}</span>
          </div>
          <div class="text-[11px] text-slate-400 mt-2 line-clamp-1 italic">"${rx.instructions}"</div>
        </div>

        <div class="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between">
          <span class="text-xs font-bold text-slate-700">${rx.refillsLeft} refills left</span>
          <button data-quick-refill="${rx.id}" class="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition ${rx.refillsLeft === 0 ? 'opacity-50 cursor-not-allowed' : ''}" ${rx.refillsLeft === 0 ? 'disabled' : ''}>
            ${rx.refillsLeft > 0 ? 'Request Refill' : 'Exhausted'}
          </button>
        </div>
      </div>
    `).join('');

    // Wire up refill buttons
    rxList.querySelectorAll('[data-quick-refill]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-quick-refill');
        const rxs = getPrescriptions();
        const updated = rxs.map(rx => {
          if (rx.id === id && rx.refillsLeft > 0) {
            return { ...rx, refillsLeft: rx.refillsLeft - 1, status: 'Refill Requested' };
          }
          return rx;
        });
        savePrescriptions(updated);
        showToast('Prescription refill request sent to pharmacy!', 'success');
        renderPrescriptions();
      });
    });
  }

  renderPrescriptions();

  // Render Lab Reports
  function renderLabs() {
    const labReports = getLabReports();
    const labsList = document.getElementById('dashboard-labs-list');
    if (!labsList) return;

    labsList.innerHTML = labReports.map((lab, index) => `
      <div class="p-3 bg-slate-50 hover:bg-blue-50/50 rounded-xl border border-slate-100 transition flex items-center justify-between cursor-pointer" data-lab-index="${index}">
        <div>
          <div class="font-bold text-slate-900 text-xs flex items-center gap-1.5">
            <span>${lab.testName}</span>
            <span class="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">Signed</span>
          </div>
          <div class="text-[11px] text-slate-500 mt-0.5">${lab.date} • ${lab.orderedBy}</div>
        </div>
        <button class="p-1.5 text-slate-400 hover:text-[#005a9c] hover:bg-white rounded-lg transition" title="View details">
          ${icon('eye', 'w-4 h-4')}
        </button>
      </div>
    `).join('');

    // Wire up lab modal trigger
    labsList.querySelectorAll('[data-lab-index]').forEach(item => {
      item.addEventListener('click', () => {
        const idx = parseInt(item.getAttribute('data-lab-index'), 10);
        openDiagnosticModal(labReports[idx]);
      });
    });
  }

  renderLabs();

  // Diagnostic Modal logic
  const diagnosticModal = document.getElementById('diagnostic-modal');
  const btnCloseDiagnostic = document.getElementById('btn-close-diagnostic-modal');
  const modalLabTitle = document.getElementById('modal-lab-title');
  const modalLabMeta = document.getElementById('modal-lab-meta');
  const modalLabBody = document.getElementById('modal-lab-body');
  const btnPrintLab = document.getElementById('btn-print-lab');

  function openDiagnosticModal(lab) {
    if (!diagnosticModal) return;
    if (modalLabTitle) modalLabTitle.textContent = lab.testName;
    if (modalLabMeta) modalLabMeta.textContent = `Ordered by ${lab.orderedBy} • ${lab.date} • Status: ${lab.status}`;

    if (modalLabBody) {
      modalLabBody.innerHTML = `
        <div class="p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-blue-900">
          <div class="font-bold mb-0.5">Clinical Impression & Summary:</div>
          <div class="text-[11px] leading-relaxed text-blue-800">${lab.summary}</div>
        </div>

        <div>
          <div class="font-bold text-slate-800 text-xs mb-2">Detailed Specimen Biomarkers:</div>
          <div class="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
            <div class="bg-slate-50 p-2.5 grid grid-cols-4 font-bold text-slate-600 text-[11px]">
              <span class="col-span-2">Biomarker Metric</span>
              <span>Observed</span>
              <span>Reference</span>
            </div>
            ${lab.findings.map(f => `
              <div class="p-2.5 grid grid-cols-4 items-center text-[11px]">
                <span class="col-span-2 font-semibold text-slate-800">${f.metric}</span>
                <span class="font-bold text-[#005a9c]">${f.value}</span>
                <span class="text-slate-500">${f.reference}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    diagnosticModal.classList.remove('hidden');
  }

  btnCloseDiagnostic?.addEventListener('click', () => {
    diagnosticModal?.classList.add('hidden');
  });

  btnPrintLab?.addEventListener('click', () => {
    window.print();
  });

  // Vitals Modal Logic
  const vitalsModal = document.getElementById('vitals-modal');
  const btnOpenVitals = document.getElementById('btn-open-vitals-modal');
  const btnQuickEditVitals = document.getElementById('btn-quick-edit-vitals');
  const btnCloseVitals = document.getElementById('btn-close-vitals-modal');
  const btnCancelVitals = document.getElementById('btn-cancel-vitals');
  const vitalsForm = document.getElementById('vitals-form');

  function openVitalsModal() {
    if (!vitalsModal) return;
    const v = getVitals();
    document.getElementById('input-vital-hr').value = v.heartRate;
    document.getElementById('input-vital-bs').value = v.bloodSugar;
    document.getElementById('input-vital-systolic').value = v.systolic;
    document.getElementById('input-vital-diastolic').value = v.diastolic;
    document.getElementById('input-vital-weight').value = v.weight;
    document.getElementById('input-vital-o2').value = v.oxygenSaturation || 98;
    vitalsModal.classList.remove('hidden');
  }

  btnOpenVitals?.addEventListener('click', openVitalsModal);
  btnQuickEditVitals?.addEventListener('click', openVitalsModal);

  document.querySelectorAll('.vitals-card').forEach(card => {
    card.addEventListener('click', openVitalsModal);
  });

  btnCloseVitals?.addEventListener('click', () => vitalsModal?.classList.add('hidden'));
  btnCancelVitals?.addEventListener('click', () => vitalsModal?.classList.add('hidden'));

  vitalsForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const updated = {
      heartRate: parseInt(document.getElementById('input-vital-hr').value, 10),
      bloodSugar: parseInt(document.getElementById('input-vital-bs').value, 10),
      systolic: parseInt(document.getElementById('input-vital-systolic').value, 10),
      diastolic: parseInt(document.getElementById('input-vital-diastolic').value, 10),
      weight: parseFloat(document.getElementById('input-vital-weight').value),
      oxygenSaturation: parseInt(document.getElementById('input-vital-o2').value, 10),
      recordedAt: 'Just now'
    };

    saveVitals(updated);
    renderVitals();
    vitalsModal.classList.add('hidden');
    showToast('Vitals biometric telemetry updated successfully!', 'success');
  });

  // Close modals on outside click
  window.addEventListener('click', (e) => {
    if (e.target === vitalsModal) vitalsModal.classList.add('hidden');
    if (e.target === diagnosticModal) diagnosticModal.classList.add('hidden');
  });
}

onReady(initDashboard);
