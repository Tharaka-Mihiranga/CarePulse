// Prescriptions Page Logic
import { setupNavigation } from '../navbar.js';
import { getPrescriptions, savePrescriptions } from '../storage.js';
import { icon } from '../icons.js';

document.addEventListener('DOMContentLoaded', () => {
  setupNavigation('prescriptions');

  const rxContainer = document.getElementById('prescriptions-table');
  const rxCountEl = document.getElementById('rx-count');

  function renderPrescriptions() {
    const prescriptions = getPrescriptions();
    if (rxCountEl) rxCountEl.textContent = `${prescriptions.length} items total`;

    if (!rxContainer) return;
    rxContainer.innerHTML = prescriptions.map(rx => `
      <div class="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/70 transition">
        <div class="flex items-start gap-3.5">
          <div class="w-10 h-10 rounded-xl ${rx.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'} flex items-center justify-center shrink-0 mt-0.5">
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
            <div class="text-[11px] text-slate-400 mt-1">Prescribed by ${rx.prescribedBy} on ${rx.datePrescribed} • ${rx.pharmacy}</div>
            <div class="text-[11px] text-slate-500 italic mt-0.5">"${rx.instructions}"</div>
          </div>
        </div>

        <div class="flex items-center gap-3 shrink-0 self-end md:self-center">
          <div class="text-right">
            <div class="text-xs font-bold text-slate-900">${rx.refillsLeft} refills remaining</div>
            <div class="text-[11px] text-slate-500">Copay: ${rx.copay}</div>
          </div>

          <button data-refill="${rx.id}" class="px-4 py-2 ${
            rx.refillsLeft > 0 ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          } rounded-xl text-xs font-semibold transition" ${rx.refillsLeft === 0 ? 'disabled' : ''}>
            ${rx.refillsLeft > 0 ? 'Request Refill' : 'Refills Exhausted'}
          </button>
        </div>
      </div>
    `).join('');

    // Bind refill clicks
    rxContainer.querySelectorAll('[data-refill]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-refill');
        const updated = getPrescriptions().map(p => {
          if (p.id === id && p.refillsLeft > 0) {
            return { ...p, refillsLeft: p.refillsLeft - 1 };
          }
          return p;
        });
        savePrescriptions(updated);
        alert(`Refill request sent to pharmacy for ${id}!`);
        renderPrescriptions();
      });
    });
  }

  renderPrescriptions();
});
