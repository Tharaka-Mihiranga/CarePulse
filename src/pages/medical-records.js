// Medical Records & EHR Logic - Interactive & Dynamic
import { setupNavigation, onReady, showToast } from '../navbar.js';
import { getCurrentUser, getLabReports, getClinicalNotes, saveClinicalNotes } from '../storage.js';
import { icon } from '../icons.js';

function initRecords() {
  setupNavigation('records');

  const user = getCurrentUser();
  const notesContainer = document.getElementById('soap-notes-container');
  const labReportsContainer = document.getElementById('lab-reports-list');
  const soapCountEl = document.getElementById('soap-count');
  const searchInput = document.getElementById('search-ehr');
  const recordTabs = document.getElementById('record-tabs');

  // Populate Header
  const nameEl = document.getElementById('patient-name');
  if (nameEl) nameEl.textContent = user.name;
  const mrnEl = document.getElementById('patient-mrn');
  if (mrnEl) mrnEl.textContent = user.mrn || 'MRN-84920';
  const avatarEl = document.getElementById('patient-avatar');
  if (avatarEl) avatarEl.textContent = user.avatarText || 'PT';
  const bloodEl = document.getElementById('patient-blood');
  if (bloodEl) bloodEl.textContent = user.bloodType || 'O Positive';
  const allergiesEl = document.getElementById('patient-allergies');
  if (allergiesEl) allergiesEl.textContent = (user.allergies || ['Penicillin', 'Sulfa Drugs']).join(', ');

  let currentTab = 'all';

  // Render SOAP Notes
  function renderNotes(filterText = '') {
    if (!notesContainer) return;
    let notes = getClinicalNotes();

    if (filterText) {
      const q = filterText.toLowerCase();
      notes = notes.filter(n =>
        n.type.toLowerCase().includes(q) ||
        n.provider.toLowerCase().includes(q) ||
        n.subjective.toLowerCase().includes(q) ||
        n.assessment.toLowerCase().includes(q)
      );
    }

    if (soapCountEl) soapCountEl.textContent = `${notes.length}`;

    if (notes.length === 0) {
      notesContainer.innerHTML = `
        <div class="p-8 text-center text-slate-400 bg-slate-50 rounded-xl">
          <p class="font-semibold text-xs">No clinical notes matching your query.</p>
        </div>
      `;
      return;
    }

    notesContainer.innerHTML = notes.map((note, idx) => `
      <div class="p-5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white transition space-y-3 shadow-2xs">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-200/70 pb-2">
          <div>
            <div class="font-bold text-slate-900 text-sm flex items-center gap-2">
              <span>${note.type}</span>
              ${idx === 0 ? '<span class="text-[9px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.2 rounded">Latest</span>' : ''}
            </div>
            <div class="text-xs text-[#005a9c] font-semibold">${note.provider} • ${note.specialty}</div>
          </div>
          <div class="text-xs font-mono text-slate-500">${note.date}</div>
        </div>

        <div class="grid grid-cols-1 gap-2.5 text-xs">
          <div class="bg-white p-3 rounded-lg border border-slate-100">
            <span class="font-bold text-slate-800 uppercase tracking-wider text-[10px] block text-blue-900">Subjective:</span>
            <p class="text-slate-600 mt-0.5 leading-relaxed">${note.subjective}</p>
          </div>
          <div class="bg-white p-3 rounded-lg border border-slate-100">
            <span class="font-bold text-slate-800 uppercase tracking-wider text-[10px] block text-blue-900">Objective:</span>
            <p class="text-slate-600 mt-0.5 leading-relaxed">${note.objective}</p>
          </div>
          <div class="bg-white p-3 rounded-lg border border-slate-100">
            <span class="font-bold text-slate-800 uppercase tracking-wider text-[10px] block text-blue-900">Assessment:</span>
            <p class="text-slate-600 mt-0.5 leading-relaxed">${note.assessment}</p>
          </div>
          <div class="bg-white p-3 rounded-lg border border-slate-100">
            <span class="font-bold text-slate-800 uppercase tracking-wider text-[10px] block text-blue-900">Plan:</span>
            <p class="text-slate-600 mt-0.5 leading-relaxed">${note.plan}</p>
          </div>
        </div>
      </div>
    `).join('');
  }

  // Render Lab Panels
  function renderLabs(filterText = '') {
    if (!labReportsContainer) return;
    let labReports = getLabReports();

    if (filterText) {
      const q = filterText.toLowerCase();
      labReports = labReports.filter(l =>
        l.testName.toLowerCase().includes(q) ||
        l.orderedBy.toLowerCase().includes(q) ||
        l.summary.toLowerCase().includes(q)
      );
    }

    labReportsContainer.innerHTML = labReports.map(lab => `
      <div class="p-4 rounded-xl border border-slate-200 bg-white space-y-3 shadow-2xs hover:border-blue-300 transition">
        <div class="flex items-center justify-between">
          <div>
            <div class="font-bold text-slate-900 text-xs">${lab.testName}</div>
            <div class="text-[11px] text-slate-500">${lab.date} • ${lab.orderedBy}</div>
          </div>
          <span class="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
            ${lab.status}
          </span>
        </div>
        <p class="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">${lab.summary}</p>
        <div class="divide-y divide-slate-100 text-xs">
          ${lab.findings.map(f => `
            <div class="py-1.5 flex items-center justify-between">
              <span class="text-slate-700 font-medium">${f.metric}</span>
              <span class="font-mono font-bold text-slate-900">${f.value}</span>
              <span class="text-slate-400 text-[11px]">Ref: ${f.reference}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('');
  }

  renderNotes();
  renderLabs();

  // Search Input Filter
  searchInput?.addEventListener('input', (e) => {
    const q = e.target.value;
    renderNotes(q);
    renderLabs(q);
  });

  // Tab Switching
  if (recordTabs) {
    recordTabs.querySelectorAll('.ehr-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        recordTabs.querySelectorAll('.ehr-tab').forEach(b => {
          b.className = 'ehr-tab px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition';
        });
        btn.className = 'ehr-tab px-3 py-1.5 rounded-xl text-xs font-bold bg-[#005a9c] text-white shadow-xs transition';
        currentTab = btn.getAttribute('data-tab');

        const secSoap = document.getElementById('section-soap');
        const secImaging = document.getElementById('section-imaging');
        const secLabs = document.getElementById('section-labs');
        const secVaccines = document.getElementById('section-vaccines');

        if (currentTab === 'all') {
          secSoap?.classList.remove('hidden');
          secImaging?.classList.remove('hidden');
          secLabs?.classList.remove('hidden');
          secVaccines?.classList.remove('hidden');
        } else if (currentTab === 'soap') {
          secSoap?.classList.remove('hidden');
          secImaging?.classList.add('hidden');
          secLabs?.classList.add('hidden');
          secVaccines?.classList.add('hidden');
        } else if (currentTab === 'labs') {
          secSoap?.classList.add('hidden');
          secImaging?.classList.add('hidden');
          secLabs?.classList.remove('hidden');
          secVaccines?.classList.add('hidden');
        } else if (currentTab === 'imaging') {
          secSoap?.classList.add('hidden');
          secImaging?.classList.remove('hidden');
          secLabs?.classList.add('hidden');
          secVaccines?.classList.add('hidden');
        } else if (currentTab === 'vaccines') {
          secSoap?.classList.add('hidden');
          secImaging?.classList.add('hidden');
          secLabs?.classList.add('hidden');
          secVaccines?.classList.remove('hidden');
        }
      });
    });
  }

  // DICOM Viewer Toggle Contrast
  const dicomCanvas = document.getElementById('dicom-canvas');
  let inverted = false;
  document.getElementById('btn-toggle-contrast')?.addEventListener('click', () => {
    inverted = !inverted;
    if (dicomCanvas) {
      if (inverted) {
        dicomCanvas.classList.add('invert', 'contrast-125');
        showToast('DICOM High-Contrast Inversion Applied', 'info');
      } else {
        dicomCanvas.classList.remove('invert', 'contrast-125');
        showToast('DICOM Standard View Restored', 'info');
      }
    }
  });

  document.getElementById('btn-expand-dicom')?.addEventListener('click', () => {
    showToast('High-Resolution 3000x3000px PACS DICOM Radiograph Loaded', 'success');
  });

  // Print button
  document.getElementById('btn-print-record')?.addEventListener('click', () => {
    window.print();
  });

  // Modal: Add Clinical Note
  const addNoteModal = document.getElementById('add-note-modal');
  const btnAddNote = document.getElementById('btn-add-note');
  const btnCloseNoteModal = document.getElementById('btn-close-note-modal');
  const btnCancelNote = document.getElementById('btn-cancel-note');
  const addNoteForm = document.getElementById('add-note-form');

  btnAddNote?.addEventListener('click', () => {
    addNoteModal?.classList.remove('hidden');
  });

  btnCloseNoteModal?.addEventListener('click', () => {
    addNoteModal?.classList.add('hidden');
  });

  btnCancelNote?.addEventListener('click', () => {
    addNoteModal?.classList.add('hidden');
  });

  addNoteForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const type = document.getElementById('note-type')?.value || 'Outpatient Consultation';
    const provider = document.getElementById('note-provider')?.value || 'Dr. Sarah Jenkins, MD';
    const subjective = document.getElementById('note-subjective')?.value || '';
    const objective = document.getElementById('note-objective')?.value || '';
    const assessment = document.getElementById('note-assessment')?.value || '';
    const plan = document.getElementById('note-plan')?.value || '';

    const newNote = {
      id: `NOTE-${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      provider,
      specialty: 'Attending Physician',
      type,
      subjective,
      objective,
      assessment,
      plan
    };

    const currentNotes = getClinicalNotes();
    const updated = [newNote, ...currentNotes];
    saveClinicalNotes(updated);

    addNoteModal?.classList.add('hidden');
    showToast('Clinical SOAP Note appended to patient EHR.', 'success');
    renderNotes();
  });

  window.addEventListener('click', (e) => {
    if (e.target === addNoteModal) addNoteModal.classList.add('hidden');
  });
}

onReady(initRecords);
