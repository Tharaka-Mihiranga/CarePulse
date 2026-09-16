// Admin Dashboard Logic
import { setupNavigation } from '../navbar.js';
import { getTransactions } from '../storage.js';

document.addEventListener('DOMContentLoaded', () => {
  setupNavigation('admin');

  const transactions = getTransactions();
  const tableBody = document.getElementById('admin-transactions-body');

  if (tableBody) {
    tableBody.innerHTML = transactions.map(tx => `
      <tr class="hover:bg-slate-50/60 transition">
        <td class="p-3.5 font-mono text-slate-700">${tx.invoiceNumber}</td>
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
});
