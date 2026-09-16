// Billing & Payment Logic - Interactive & Dynamic
import { setupNavigation, onReady, showToast } from '../navbar.js';
import { getCurrentUser, getTransactions, saveTransactions, getAppointments, saveAppointments } from '../storage.js';
import { icon } from '../icons.js';

function initBilling() {
  setupNavigation('billing');

  const user = getCurrentUser();
  const urlParams = new URLSearchParams(window.location.search);
  const requestedService = urlParams.get('service') || 'Specialist Consultation Copay';
  let currentAmount = parseFloat(urlParams.get('amount') || '50.00');

  const invoiceServiceEl = document.getElementById('invoice-service');
  const invoiceAmountEl = document.getElementById('invoice-amount');
  const invoiceTotalEl = document.getElementById('invoice-total');
  const btnAuthorizeEl = document.getElementById('btn-authorize-amount');
  const paymentForm = document.getElementById('payment-form');
  const transactionsTable = document.getElementById('transactions-history');
  const searchInput = document.getElementById('search-transactions');
  const cardNumberInput = document.getElementById('card-number');
  const cardExpInput = document.getElementById('card-exp');
  const kpiBalanceDue = document.getElementById('kpi-balance-due');
  const kpiPaidYtd = document.getElementById('kpi-paid-ytd');

  function updateAmount(amt) {
    currentAmount = amt;
    if (invoiceServiceEl) invoiceServiceEl.textContent = requestedService;
    if (invoiceAmountEl) invoiceAmountEl.textContent = `$${currentAmount.toFixed(2)}`;
    if (invoiceTotalEl) invoiceTotalEl.textContent = `$${currentAmount.toFixed(2)}`;
    if (btnAuthorizeEl) {
      btnAuthorizeEl.innerHTML = `
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        <span>Authorize & Pay ($${currentAmount.toFixed(2)})</span>
      `;
    }
  }

  updateAmount(currentAmount);

  // Amount preset buttons
  document.querySelectorAll('#amount-presets .amt-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#amount-presets .amt-btn').forEach(b => {
        b.className = 'amt-btn py-1.5 px-2 text-center text-xs font-semibold rounded-lg border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 transition';
      });
      btn.className = 'amt-btn py-1.5 px-2 text-center text-xs font-bold rounded-lg border border-[#005a9c] bg-blue-50 text-[#005a9c] transition';
      const amt = parseFloat(btn.getAttribute('data-amt') || '50.00');
      updateAmount(amt);
    });
  });

  // Payment method tabs
  let selectedMethodType = 'Credit / Debit';
  document.querySelectorAll('#payment-method-tabs .pay-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#payment-method-tabs .pay-tab').forEach(b => {
        b.className = 'pay-tab p-3 border border-slate-200 bg-slate-50 rounded-xl text-center text-xs font-semibold text-slate-600 hover:bg-slate-100 transition';
      });
      btn.className = 'pay-tab p-3 border-2 border-[#005a9c] bg-blue-50/50 rounded-xl text-center text-xs font-bold text-[#005a9c] transition shadow-xs';
      selectedMethodType = btn.textContent.trim();
      showToast(`Selected payment method: ${selectedMethodType}`, 'info');
    });
  });

  // Auto-format card number
  cardNumberInput?.addEventListener('input', (e) => {
    let val = e.target.value.replace(/\D/g, '').substring(0, 16);
    let formatted = val.match(/.{1,4}/g)?.join(' ') || val;
    e.target.value = formatted;
  });

  // Auto-format expiration date
  cardExpInput?.addEventListener('input', (e) => {
    let val = e.target.value.replace(/\D/g, '').substring(0, 4);
    if (val.length >= 2) {
      e.target.value = `${val.substring(0, 2)}/${val.substring(2)}`;
    } else {
      e.target.value = val;
    }
  });

  // Render past transactions
  function renderTransactions() {
    const transactions = getTransactions();
    const query = (searchInput?.value || '').toLowerCase().trim();

    const filtered = transactions.filter(tx =>
      tx.service.toLowerCase().includes(query) ||
      tx.invoiceNumber.toLowerCase().includes(query) ||
      tx.method.toLowerCase().includes(query)
    );

    // Calculate totals
    const totalPaid = transactions.reduce((acc, t) => acc + (t.amount || 0), 0);
    if (kpiPaidYtd) kpiPaidYtd.textContent = `$${(totalPaid + 1300).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    const unpaidApts = getAppointments().filter(a => !a.paid);
    if (kpiBalanceDue) {
      kpiBalanceDue.textContent = unpaidApts.length > 0 ? `$${(unpaidApts.length * 50).toFixed(2)}` : '$0.00';
    }

    if (!transactionsTable) return;

    if (filtered.length === 0) {
      transactionsTable.innerHTML = `
        <div class="p-8 text-center text-slate-400">
          <p class="font-semibold text-xs">No transactions match your search query.</p>
        </div>
      `;
      return;
    }

    transactionsTable.innerHTML = filtered.map(tx => `
      <div class="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 transition" data-tx-id="${tx.id}">
        <div class="flex items-start gap-3">
          <div class="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
            ${icon('check', 'w-4 h-4')}
          </div>
          <div>
            <div class="font-semibold text-slate-900 text-xs sm:text-sm">${tx.service}</div>
            <div class="text-[11px] text-slate-400 mt-0.5">${tx.invoiceNumber} • ${tx.date} • ${tx.method}</div>
          </div>
        </div>
        <div class="flex items-center gap-3 shrink-0 self-end sm:self-center">
          <div class="text-right">
            <div class="font-bold text-slate-900 text-sm">$${tx.amount.toFixed(2)}</div>
            <div class="text-[10px] text-emerald-600 font-bold">${tx.status}</div>
          </div>
          <button data-view-receipt="${tx.id}" class="px-2.5 py-1 text-xs border border-slate-200 hover:bg-slate-100 rounded-lg text-slate-600 font-semibold transition">
            Receipt
          </button>
        </div>
      </div>
    `).join('');

    // Bind receipt button clicks
    transactionsTable.querySelectorAll('[data-view-receipt]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-view-receipt');
        const tx = transactions.find(t => t.id === id);
        if (tx) openReceiptModal(tx);
      });
    });
  }

  renderTransactions();
  searchInput?.addEventListener('input', renderTransactions);

  // Digital Receipt Modal
  const receiptModal = document.getElementById('receipt-modal');
  const btnCloseReceipt = document.getElementById('btn-close-receipt');
  const btnDoneReceipt = document.getElementById('btn-done-receipt');
  const btnPrintReceipt = document.getElementById('btn-print-receipt');

  function openReceiptModal(tx) {
    if (!receiptModal) return;
    document.getElementById('receipt-invoice').textContent = tx.invoiceNumber;
    document.getElementById('receipt-auth').textContent = `AUTH-${Math.floor(10000000 + Math.random() * 90000000)}`;
    document.getElementById('receipt-service').textContent = tx.service;
    document.getElementById('receipt-method').textContent = tx.method;
    document.getElementById('receipt-amount').textContent = `$${tx.amount.toFixed(2)}`;
    document.getElementById('receipt-date').textContent = tx.date;
    receiptModal.classList.remove('hidden');
  }

  btnCloseReceipt?.addEventListener('click', () => receiptModal?.classList.add('hidden'));
  btnDoneReceipt?.addEventListener('click', () => receiptModal?.classList.add('hidden'));
  btnPrintReceipt?.addEventListener('click', () => window.print());

  // Payment Form Submission
  paymentForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    const rawCard = cardNumberInput?.value || '4242';
    const last4 = rawCard.replace(/\s/g, '').slice(-4) || '4242';

    const newTx = {
      id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
      patientName: user.name,
      service: requestedService,
      amount: currentAmount,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      method: `${selectedMethodType} •••• ${last4}`,
      status: 'Settled',
      invoiceNumber: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    };

    const updatedTxs = [newTx, ...getTransactions()];
    saveTransactions(updatedTxs);

    // If an appointment matches this service, mark it as paid!
    const updatedApts = getAppointments().map(apt => {
      if (requestedService.includes(apt.doctorSpecialty) || requestedService.includes(apt.doctorName) || requestedService.includes('Copay')) {
        return { ...apt, paid: true };
      }
      return apt;
    });
    saveAppointments(updatedApts);

    showToast(`Payment of $${currentAmount.toFixed(2)} authorized successfully!`, 'success');
    renderTransactions();
    openReceiptModal(newTx);
  });

  window.addEventListener('click', (e) => {
    if (e.target === receiptModal) receiptModal.classList.add('hidden');
  });
}

onReady(initBilling);
