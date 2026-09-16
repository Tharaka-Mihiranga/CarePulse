// Prescriptions Page Logic - Interactive & Reactive
import { setupNavigation, onReady, showToast } from '../navbar.js';
import {
  getPrescriptions,
  savePrescriptions,
  getPreferredPharmacy,
  savePreferredPharmacy,
  getMedicationDoses,
  saveMedicationDoses
} from '../storage.js';
import { icon } from '../icons.js';

function initPrescriptions() {
  setupNavigation('prescriptions');

  const rxContainer = document.getElementById('prescriptions-table');
  const rxCountEl = document.getElementById('rx-count');
  const searchInput = document.getElementById('search-rx');
  const filterSelect = document.getElementById('filter-rx-status');
  const currentPharmacyLabel = document.getElementById('current-pharmacy-label');

  // Load preferred pharmacy
  const pharmacy = getPreferredPharmacy();
  if (currentPharmacyLabel) currentPharmacyLabel.textContent = pharmacy;

  // Render Prescriptions List
  function renderPrescriptions() {
    const allRxs = getPrescriptions();
    const query = (searchInput?.value || '').toLowerCase().trim();
    const statusFilter = filterSelect?.value || 'All';

    let filtered = allRxs.filter(rx => {
      const matchesQuery = rx.medication.toLowerCase().includes(query) ||
        rx.instructions.toLowerCase().includes(query) ||
        rx.prescribedBy.toLowerCase().includes(query);

      let matchesStatus = true;
      if (statusFilter === 'Active') matchesStatus = rx.status === 'Active';
      else if (statusFilter === 'Refill Needed') matchesStatus = rx.refillsLeft <= 1;

      return matchesQuery && matchesStatus;
    });

    if (rxCountEl) rxCountEl.textContent = `${filtered.length} of ${allRxs.length} medications displayed`;

    if (!rxContainer) return;

    if (filtered.length === 0) {
      rxContainer.innerHTML = `
        <div class="p-8 text-center text-slate-400">
          <div class="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-2">
            ${icon('pill', 'w-6 h-6')}
          </div>
          <p class="font-semibold text-slate-600 text-xs">No medications match your filter criteria.</p>
        </div>
      `;
      return;
    }

    rxContainer.innerHTML = filtered.map(rx => `
      <div class="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/80 transition" data-rx-row="${rx.id}">
        <div class="flex items-start gap-3.5">
          <div class="w-10 h-10 rounded-xl ${rx.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'} flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
            ${icon('pill', 'w-5 h-5')}
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="font-bold text-slate-900 text-sm">${rx.medication}</span>
              <span class="text-xs font-semibold px-2 py-0.2 rounded bg-slate-100 text-slate-700">${rx.dosage}</span>
              <span class="text-[10px] font-bold px-2 py-0.2 rounded-full ${
                rx.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }">${rx.status}</span>
            </div>
            <div class="text-xs text-slate-600 mt-1">${rx.frequency}</div>
            <div class="text-[11px] text-slate-400 mt-1">Prescribed by <strong class="text-slate-600">${rx.prescribedBy}</strong> on ${rx.datePrescribed} • ${rx.pharmacy}</div>
            <div class="text-[11px] text-slate-500 italic mt-0.5 bg-slate-50 p-1.5 rounded border border-slate-100/80 max-w-lg">"${rx.instructions}"</div>
          </div>
        </div>

        <div class="flex items-center gap-3 shrink-0 self-end md:self-center">
          <div class="text-right">
            <div class="text-xs font-bold text-slate-900">${rx.refillsLeft} refills remaining</div>
            <div class="text-[11px] text-slate-500">Insurance Copay: <span class="font-semibold text-slate-800">${rx.copay}</span></div>
          </div>

          <button data-refill="${rx.id}" class="px-4 py-2 ${
            rx.refillsLeft > 0 ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          } rounded-xl text-xs font-semibold transition" ${rx.refillsLeft === 0 ? 'disabled' : ''}>
            ${rx.refillsLeft > 0 ? 'Request Refill' : 'Refills Exhausted'}
          </button>
        </div>
      </div>
    `).join('');

    // Bind refill button clicks
    rxContainer.querySelectorAll('[data-refill]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-refill');
        const updated = getPrescriptions().map(p => {
          if (p.id === id && p.refillsLeft > 0) {
            return {
              ...p,
              refillsLeft: p.refillsLeft - 1,
              status: 'Refill In Progress'
            };
          }
          return p;
        });

        savePrescriptions(updated);
        showToast('Prescription refill order transmitted to your pharmacy!', 'success');
        renderPrescriptions();
      });
    });
  }

  renderPrescriptions();

  searchInput?.addEventListener('input', renderPrescriptions);
  filterSelect?.addEventListener('change', renderPrescriptions);

  // Daily Medication Tracker Logic
  const doses = getMedicationDoses();
  const checkMorning = document.getElementById('check-dose-morning');
  const checkAfternoon = document.getElementById('check-dose-afternoon');
  const checkEvening = document.getElementById('check-dose-evening');
  const morningStatus = document.getElementById('morning-status');
  const afternoonStatus = document.getElementById('afternoon-status');
  const eveningStatus = document.getElementById('evening-status');
  const adherencePercent = document.getElementById('adherence-percent');

  if (checkMorning) checkMorning.checked = doses.morning?.taken || false;
  if (checkAfternoon) checkAfternoon.checked = doses.afternoon?.taken || false;
  if (checkEvening) checkEvening.checked = doses.evening?.taken || false;

  function updateDoseUI() {
    if (morningStatus) morningStatus.textContent = checkMorning.checked ? 'Status: Taken at 08:15 AM' : 'Status: Pending';
    if (afternoonStatus) afternoonStatus.textContent = checkAfternoon.checked ? 'Status: Taken at 01:10 PM' : 'Status: Pending';
    if (eveningStatus) eveningStatus.textContent = checkEvening.checked ? 'Status: Taken at 08:05 PM' : 'Status: Pending';

    const count = [checkMorning.checked, checkAfternoon.checked, checkEvening.checked].filter(Boolean).length;
    const pct = Math.round((count / 3) * 100);
    if (adherencePercent) {
      adherencePercent.textContent = `${pct}% Adherence (${count}/3 doses)`;
    }
  }

  updateDoseUI();

  function saveDoses() {
    const updated = {
      morning: { taken: checkMorning.checked, time: checkMorning.checked ? '08:15 AM' : null },
      afternoon: { taken: checkAfternoon.checked, time: checkAfternoon.checked ? '01:10 PM' : null },
      evening: { taken: checkEvening.checked, time: checkEvening.checked ? '08:05 PM' : null },
    };
    saveMedicationDoses(updated);
    updateDoseUI();
    showToast('Daily dose tracker updated!', 'info');
  }

  checkMorning?.addEventListener('change', saveDoses);
  checkAfternoon?.addEventListener('change', saveDoses);
  checkEvening?.addEventListener('change', saveDoses);

  // Pharmacy Change Modal
  const pharmacyModal = document.getElementById('pharmacy-modal');
  const btnChangePharmacy = document.getElementById('btn-change-pharmacy');
  const btnClosePharmacy = document.getElementById('btn-close-pharmacy-modal');
  const btnCancelPharmacy = document.getElementById('btn-cancel-pharmacy');
  const btnSavePharmacy = document.getElementById('btn-save-pharmacy');
  const pharmacyList = document.getElementById('pharmacy-options-list');

  btnChangePharmacy?.addEventListener('click', () => {
    pharmacyModal?.classList.remove('hidden');
  });

  btnClosePharmacy?.addEventListener('click', () => pharmacyModal?.classList.add('hidden'));
  btnCancelPharmacy?.addEventListener('click', () => pharmacyModal?.classList.add('hidden'));

  // Option radio styling
  pharmacyList?.querySelectorAll('input[type="radio"]').forEach(radio => {
    radio.addEventListener('change', () => {
      pharmacyList.querySelectorAll('label').forEach(l => {
        l.className = 'p-3 border rounded-xl flex items-center justify-between cursor-pointer hover:bg-slate-50 transition border-slate-200';
      });
      radio.closest('label').className = 'p-3 border rounded-xl flex items-center justify-between cursor-pointer hover:bg-slate-50 transition border-blue-500 bg-blue-50/40';
    });
  });

  btnSavePharmacy?.addEventListener('click', () => {
    const selected = pharmacyList?.querySelector('input[type="radio"]:checked')?.value;
    if (selected) {
      savePreferredPharmacy(selected);
      if (currentPharmacyLabel) currentPharmacyLabel.textContent = selected.split(' - ')[0];
      pharmacyModal?.classList.add('hidden');
      showToast('Preferred pharmacy updated successfully!', 'success');
    }
  });

  // Add Medication Modal
  const addMedModal = document.getElementById('add-med-modal');
  const btnAddMed = document.getElementById('btn-add-medication');
  const btnCloseMed = document.getElementById('btn-close-med-modal');
  const btnCancelMed = document.getElementById('btn-cancel-med');
  const addMedForm = document.getElementById('add-med-form');

  btnAddMed?.addEventListener('click', () => addMedModal?.classList.remove('hidden'));
  btnCloseMed?.addEventListener('click', () => addMedModal?.classList.add('hidden'));
  btnCancelMed?.addEventListener('click', () => addMedModal?.classList.add('hidden'));

  addMedForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('input-med-name')?.value || 'Omeprazole';
    const dosage = document.getElementById('input-med-dosage')?.value || '20mg';
    const freq = document.getElementById('input-med-freq')?.value || 'Once daily';
    const doc = document.getElementById('input-med-doctor')?.value || 'Dr. Sarah Jenkins, MD';
    const instructions = document.getElementById('input-med-instructions')?.value || 'Take as directed';

    const newMed = {
      id: `RX-${Math.floor(100 + Math.random() * 900)}`,
      medication: name,
      dosage,
      frequency: freq,
      status: 'Active',
      refillsLeft: 3,
      datePrescribed: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      prescribedBy: doc,
      pharmacy: getPreferredPharmacy().split(' - ')[0],
      copay: '$10.00',
      instructions
    };

    const currentRxs = getPrescriptions();
    savePrescriptions([newMed, ...currentRxs]);

    addMedModal?.classList.add('hidden');
    addMedForm.reset();
    showToast(`Added ${name} ${dosage} to active prescriptions`, 'success');
    renderPrescriptions();
  });

  window.addEventListener('click', (e) => {
    if (e.target === pharmacyModal) pharmacyModal.classList.add('hidden');
    if (e.target === addMedModal) addMedModal.classList.add('hidden');
  });
}

onReady(initPrescriptions);
