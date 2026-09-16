// Billing & Payment Logic
import { setupNavigation } from '../navbar.js';
import { getCurrentUser, getTransactions, saveTransactions, getAppointments, saveAppointments } from '../storage.js';

document.addEventListener('DOMContentLoaded', () => {
  setupNavigation('billing');

  const user = getCurrentUser();
  const urlParams = new URLSearchParams(window.location.search);
  const requestedService = urlParams.get('service') || 'Specialist Consultation Copay';
  const requestedAmount = parseFloat(urlParams.get('amount') || '50.00');

  const invoiceServiceEl = document.getElementById('invoice-service');
  const invoiceAmountEl = document.getElementById('invoice-amount');
  const invoiceTotalEl = document.getElementById('invoice-total');
  const btnAuthorizeEl = document.getElementById('btn-authorize-amount');
  const paymentForm = document.getElementById('payment-form');
  const transactionsTable = document.getElementById('transactions-history');

  if (invoiceServiceEl) invoiceServiceEl.textContent = requestedService;
  if (invoiceAmountEl) invoiceAmountEl.textContent = `$${requestedAmount.toFixed(2)}`;
  if (invoiceTotalEl) invoiceTotalEl.textContent = `$${requestedAmount.toFixed(2)}`;
  if (btnAuthorizeEl) btnAuthorizeEl.textContent = `Authorize Payment ($${requestedAmount.toFixed(2)})`;

  function renderTransactions() {
    const transactions = getTransactions();
    if (!transactionsTable) return;
    transactionsTable.innerHTML = transactions.map(tx => `
      <div class="p-4 flex items-center justify-between text-xs">
        <div>
          <div class="font-semibold text-slate-800">${tx.service}</div>
          <div class="text-[11px] text-slate-400">${tx.invoiceNumber} • ${tx.date} • ${tx.method}</div>
        </div>
        <div class="text-right">
          <div class="font-bold text-slate-900">$${tx.amount.toFixed(2)}</div>
          <div class="text-[10px] text-emerald-600 font-semibold">${tx.status}</div>
        </div>
      </div>
    `).join('');
  }

  renderTransactions();

  paymentForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    const newTx = {
      id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
      patientName: user.name,
      service: requestedService,
      amount: requestedAmount,
      date: 'Just now',
      method: 'Visa •••• 4242',
      status: 'Settled',
      invoiceNumber: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    };

    const updatedTxs = [newTx, ...getTransactions()];
    saveTransactions(updatedTxs);

    // If an appointment matches this service, mark it as paid!
    const updatedApts = getAppointments().map(apt => {
      if (requestedService.includes(apt.doctorSpecialty) || requestedService.includes(apt.doctorName)) {
        return { ...apt, paid: true };
      }
      return apt;
    });
    saveAppointments(updatedApts);

    alert(`Payment of $${requestedAmount.toFixed(2)} authorized successfully!\nReceipt: ${newTx.invoiceNumber}`);
    renderTransactions();
  });
});
