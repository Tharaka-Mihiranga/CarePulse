// Admin Dashboard Logic - Interactive & Telemetry Driven
import { setupNavigation, onReady, showToast } from '../navbar.js';
import { getTransactions, saveEmergencyAlert } from '../storage.js';

function initAdmin() {
  setupNavigation('admin');

  const tableBody = document.getElementById('admin-transactions-body');
  const searchInput = document.getElementById('admin-search');
  const revenueEl = document.getElementById('metric-revenue');

  // Load and render transactions
  function renderLedger() {
    const transactions = getTransactions();
    const query = (searchInput?.value || '').toLowerCase().trim();

    const filtered = transactions.filter(t =>
      t.invoiceNumber.toLowerCase().includes(query) ||
      t.patientName.toLowerCase().includes(query) ||
      t.service.toLowerCase().includes(query) ||
      t.method.toLowerCase().includes(query)
    );

    const totalRev = transactions.reduce((acc, t) => acc + (t.amount || 0), 0) + 48000;
    if (revenueEl) {
      revenueEl.textContent = `$${totalRev.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }

    if (!tableBody) return;

    if (filtered.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="7" class="p-6 text-center text-slate-400">
            No audit records match your search criteria.
          </td>
        </tr>
      `;
      return;
    }

    tableBody.innerHTML = filtered.map(tx => `
      <tr class="hover:bg-slate-50/70 transition">
        <td class="p-3.5 font-mono text-slate-700 font-semibold">${tx.invoiceNumber}</td>
        <td class="p-3.5 font-medium text-slate-900">${tx.patientName}</td>
        <td class="p-3.5 text-slate-600">${tx.service}</td>
        <td class="p-3.5 text-slate-500">${tx.date}</td>
        <td class="p-3.5 text-slate-500">${tx.method}</td>
        <td class="p-3.5 text-right font-bold text-slate-900">$${tx.amount.toFixed(2)}</td>
        <td class="p-3.5 text-center">
          <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            ${tx.status}
          </span>
        </td>
      </tr>
    `).join('');
  }

  renderLedger();
  searchInput?.addEventListener('input', renderLedger);

  // Bed Census simulation state
  let totalBeds = 240;
  let occupiedBeds = 198;
  let genMedBeds = 120;
  const genMedMax = 140;

  const metricBeds = document.getElementById('metric-beds');
  const metricBedStatus = document.getElementById('metric-bed-status');
  const labelGenMed = document.getElementById('label-genmed');
  const barGenMed = document.getElementById('bar-genmed');

  function updateBedUI() {
    if (metricBeds) metricBeds.textContent = `${occupiedBeds} / ${totalBeds}`;
    const pct = ((occupiedBeds / totalBeds) * 100).toFixed(1);
    if (metricBedStatus) metricBedStatus.textContent = `${pct}% Occupancy`;

    if (labelGenMed) {
      const genPct = Math.round((genMedBeds / genMedMax) * 100);
      labelGenMed.textContent = `${genMedBeds} / ${genMedMax} beds (${genPct}%)`;
    }
    if (barGenMed) {
      const genPct = Math.round((genMedBeds / genMedMax) * 100);
      barGenMed.style.width = `${genPct}%`;
    }
  }

  document.getElementById('btn-admit-patient')?.addEventListener('click', () => {
    if (occupiedBeds < totalBeds) {
      occupiedBeds++;
      genMedBeds++;
      updateBedUI();
      showToast('Patient admitted to Floor 3 General Medicine unit.', 'success');
    } else {
      showToast('Hospital bed census at 100% capacity!', 'error');
    }
  });

  document.getElementById('btn-discharge-patient')?.addEventListener('click', () => {
    if (occupiedBeds > 100) {
      occupiedBeds--;
      genMedBeds--;
      updateBedUI();
      showToast('Patient discharged. Bed sanitized and available.', 'info');
    }
  });

  // Physician On-Duty Toggles
  document.querySelectorAll('.toggle-duty-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.textContent.trim() === 'ON DUTY') {
        btn.textContent = 'OFF DUTY';
        btn.className = 'toggle-duty-btn px-2 py-1 rounded text-[10px] font-bold bg-slate-100 text-slate-600 transition';
        showToast('Physician status marked as Off-Duty.', 'info');
      } else {
        btn.textContent = 'ON DUTY';
        btn.className = 'toggle-duty-btn px-2 py-1 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 transition';
        showToast('Physician status marked as On-Duty.', 'success');
      }
    });
  });

  // Export CSV Audit
  document.getElementById('btn-export-csv')?.addEventListener('click', () => {
    const transactions = getTransactions();
    let csv = 'Invoice,Patient,Service,Date,Method,Amount,Status\n';
    transactions.forEach(t => {
      csv += `"${t.invoiceNumber}","${t.patientName}","${t.service}","${t.date}","${t.method}","${t.amount}","${t.status}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `CarePulse_Financial_Audit_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Financial audit CSV ledger downloaded!', 'success');
  });

  // Broadcast Emergency Alert Modal
  const broadcastModal = document.getElementById('broadcast-modal');
  const btnBroadcastAlert = document.getElementById('btn-broadcast-alert');
  const btnCloseBroadcast = document.getElementById('btn-close-broadcast');
  const btnCancelBroadcast = document.getElementById('btn-cancel-broadcast');
  const broadcastForm = document.getElementById('broadcast-form');

  btnBroadcastAlert?.addEventListener('click', () => broadcastModal?.classList.remove('hidden'));
  btnCloseBroadcast?.addEventListener('click', () => broadcastModal?.classList.add('hidden'));
  btnCancelBroadcast?.addEventListener('click', () => broadcastModal?.classList.add('hidden'));

  broadcastForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('broadcast-title')?.value || 'System Notice';
    const message = document.getElementById('broadcast-message')?.value || '';

    saveEmergencyAlert({
      active: true,
      title,
      message,
      type: 'warning'
    });

    broadcastModal?.classList.add('hidden');
    showToast('Portal announcement broadcasted across patient and clinic interfaces!', 'success');
  });

  window.addEventListener('click', (e) => {
    if (e.target === broadcastModal) broadcastModal.classList.add('hidden');
  });
}

onReady(initAdmin);
