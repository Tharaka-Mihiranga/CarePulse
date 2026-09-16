// Medical Records & EHR Logic
import { setupNavigation } from '../navbar.js';
import { getCurrentUser, getLabReports, CLINICAL_NOTES } from '../storage.js';
import { icon } from '../icons.js';

document.addEventListener('DOMContentLoaded', () => {
  setupNavigation('records');

  const user = getCurrentUser();
  const labReports = getLabReports();

  // Populate Header
  document.getElementById('patient-name').textContent = user.name;
  document.getElementById('patient-mrn').textContent = user.mrn || 'MRN-84920';
  document.getElementById('patient-avatar').textContent = user.avatarText || 'PT';
  document.getElementById('patient-blood').textContent = user.bloodType || 'O Positive';
  document.getElementById('patient-allergies').textContent = (user.allergies || ['Penicillin']).join(', ');

  // Render SOAP Notes
  const notesContainer = document.getElementById('soap-notes-container');
  if (notesContainer) {
    notesContainer.innerHTML = CLINICAL_NOTES.map(note => `
      <div class="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-200/70 pb-2">
          <div>
            <div class="font-bold text-slate-900 text-sm">${note.type}</div>
            <div class="text-xs text-[#005a9c] font-medium">${note.provider} • ${note.specialty}</div>
          </div>
          <div class="text-xs font-mono text-slate-500">${note.date}</div>
        </div>

        <div class="grid grid-cols-1 gap-2.5 text-xs">
          <div>
            <span class="font-bold text-slate-800 uppercase tracking-wider text-[10px] block">Subjective:</span>
            <p class="text-slate-600 mt-0.5">${note.subjective}</p>
          </div>
          <div>
            <span class="font-bold text-slate-800 uppercase tracking-wider text-[10px] block">Objective:</span>
            <p class="text-slate-600 mt-0.5">${note.objective}</p>
          </div>
          <div>
            <span class="font-bold text-slate-800 uppercase tracking-wider text-[10px] block">Assessment:</span>
            <p class="text-slate-600 mt-0.5">${note.assessment}</p>
          </div>
          <div>
            <span class="font-bold text-slate-800 uppercase tracking-wider text-[10px] block">Plan:</span>
            <p class="text-slate-600 mt-0.5">${note.plan}</p>
          </div>
        </div>
      </div>
    `).join('');
  }

  // Render Lab Panels
  const labReportsContainer = document.getElementById('lab-reports-list');
  if (labReportsContainer) {
    labReportsContainer.innerHTML = labReports.map(lab => `
      <div class="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
        <div class="flex items-center justify-between">
          <div>
            <div class="font-bold text-slate-900 text-xs">${lab.testName}</div>
            <div class="text-[11px] text-slate-500">${lab.date} • ${lab.orderedBy}</div>
          </div>
          <span class="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
            ${lab.status}
          </span>
        </div>
        <p class="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg">${lab.summary}</p>
        <div class="divide-y divide-slate-100 text-xs">
          ${lab.findings.map(f => `
            <div class="py-1.5 flex items-center justify-between">
              <span class="text-slate-700">${f.metric}</span>
              <span class="font-mono font-bold text-slate-900">${f.value}</span>
              <span class="text-slate-400 text-[11px]">Ref: ${f.reference}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('');
  }

  // Print button
  document.getElementById('btn-print-record')?.addEventListener('click', () => {
    window.print();
  });

  // Add Note prompt
  document.getElementById('btn-add-note')?.addEventListener('click', () => {
    const text = prompt('Enter physician clinical progress note:');
    if (text) {
      alert('Encounter note successfully appended to HIPAA patient EHR audit.');
    }
  });
});
