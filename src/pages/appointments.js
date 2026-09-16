// Appointment Booking Page Logic - Interactive & Dynamic
import { setupNavigation, onReady, showToast } from '../navbar.js';
import { getAppointments, saveAppointments, AVAILABLE_DOCTORS } from '../storage.js';
import { icon } from '../icons.js';

function initAppointments() {
  setupNavigation('appointments');

  const doctorPicker = document.getElementById('doctor-picker');
  const feeDisplay = document.getElementById('booking-fee-display');
  const aptForm = document.getElementById('appointment-form');
  const userAppointmentsList = document.getElementById('user-appointments-list');
  const scheduledCount = document.getElementById('scheduled-count');
  const searchInput = document.getElementById('search-appointments');
  const slotPicker = document.getElementById('slot-picker');
  const selectedSlotInput = document.getElementById('selected-slot');
  const specialtyFilters = document.getElementById('specialty-filters');

  let activeSpecialty = 'All';
  let selectedDoctorName = AVAILABLE_DOCTORS[0]?.name || '';

  // Slot buttons handler
  if (slotPicker && selectedSlotInput) {
    slotPicker.querySelectorAll('.slot-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        slotPicker.querySelectorAll('.slot-btn').forEach(b => {
          b.className = 'slot-btn p-2 text-center text-xs font-semibold rounded-lg border bg-white text-slate-700 border-slate-200 hover:bg-slate-50 transition';
        });
        btn.className = 'slot-btn p-2 text-center text-xs font-semibold rounded-lg border bg-[#005a9c] text-white border-[#005a9c] shadow-xs transition';
        const slot = btn.getAttribute('data-slot');
        selectedSlotInput.value = slot;
      });
    });
  }

  // Render Doctor Cards with Filter
  function renderDoctors() {
    if (!doctorPicker) return;

    const filtered = activeSpecialty === 'All'
      ? AVAILABLE_DOCTORS
      : AVAILABLE_DOCTORS.filter(d => d.specialty.toLowerCase().includes(activeSpecialty.toLowerCase()));

    if (filtered.length === 0) {
      doctorPicker.innerHTML = `
        <div class="col-span-2 p-6 text-center text-slate-400">
          No providers currently listed under ${activeSpecialty}. Please choose another specialty.
        </div>
      `;
      return;
    }

    doctorPicker.innerHTML = filtered.map(doc => {
      const isSelected = doc.name === selectedDoctorName;
      return `
        <label class="p-4 rounded-xl border ${isSelected ? 'border-[#005a9c] bg-blue-50/50 ring-2 ring-blue-500/20' : 'border-slate-200 hover:border-slate-300 bg-white'} cursor-pointer flex items-start gap-3 transition">
          <input type="radio" name="doctor" value="${doc.name}" data-fee="${doc.fee}" data-specialty="${doc.specialty}" ${isSelected ? 'checked' : ''} class="mt-1 text-[#005a9c] focus:ring-[#005a9c]">
          <div class="flex-1">
            <div class="flex items-center justify-between">
              <span class="font-bold text-sm text-slate-900">${doc.name}</span>
              <span class="text-[11px] font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">${doc.fee}</span>
            </div>
            <div class="text-xs text-[#005a9c] font-semibold mt-0.5">${doc.specialty} • ${doc.department}</div>
            <div class="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
              <span>Next available: Today</span>
              <span class="text-amber-600 font-semibold">${doc.rating}</span>
            </div>
          </div>
        </label>
      `;
    }).join('');

    // Wire radio changes
    doctorPicker.querySelectorAll('input[type="radio"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        selectedDoctorName = radio.value;
        const fee = radio.getAttribute('data-fee') || '$50.00';
        if (feeDisplay) feeDisplay.textContent = fee;
        renderDoctors();
      });
    });
  }

  // Specialty pills click
  if (specialtyFilters) {
    specialtyFilters.querySelectorAll('.specialty-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        specialtyFilters.querySelectorAll('.specialty-btn').forEach(b => {
          b.className = 'specialty-btn px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200 transition';
        });
        btn.className = 'specialty-btn px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#005a9c] text-white transition';
        activeSpecialty = btn.getAttribute('data-filter');
        renderDoctors();
      });
    });
  }

  renderDoctors();

  // Render Existing Appointments
  function renderAppointments(query = '') {
    if (!userAppointmentsList) return;
    let appointments = getAppointments();

    if (query) {
      const q = query.toLowerCase();
      appointments = appointments.filter(a =>
        a.doctorName.toLowerCase().includes(q) ||
        a.doctorSpecialty.toLowerCase().includes(q) ||
        a.reason.toLowerCase().includes(q)
      );
    }

    if (scheduledCount) scheduledCount.textContent = `${appointments.length}`;

    if (appointments.length === 0) {
      userAppointmentsList.innerHTML = `
        <div class="p-8 text-center text-slate-400 bg-slate-50 rounded-xl">
          <div class="w-10 h-10 mx-auto rounded-full bg-slate-200/60 flex items-center justify-center mb-2">
            ${icon('calendar', 'w-5 h-5 text-slate-500')}
          </div>
          <p class="font-semibold text-slate-700 text-xs">No scheduled appointments matching your criteria.</p>
        </div>
      `;
      return;
    }

    userAppointmentsList.innerHTML = appointments.map(apt => `
      <div class="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition shadow-2xs" data-apt-id="${apt.id}">
        <div class="flex items-start gap-3.5">
          <div class="w-10 h-10 rounded-xl bg-blue-50 text-[#005a9c] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 shadow-2xs">
            ${icon('calendar', 'w-5 h-5')}
          </div>
          <div>
            <div class="font-bold text-slate-900 text-sm flex items-center gap-2">
              <span>${apt.doctorName}</span>
              <span class="text-[10px] px-2 py-0.2 rounded-full ${apt.paid ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'} font-semibold">
                ${apt.paid ? 'Copay Settled' : 'Copay Due: ' + apt.copay}
              </span>
            </div>
            <div class="text-xs text-slate-600 mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span class="font-semibold text-slate-800 flex items-center gap-1">
                ${icon('clock', 'w-3 h-3 text-slate-400')} ${apt.date} at ${apt.time}
              </span>
              <span class="flex items-center gap-1">
                ${icon('map-pin', 'w-3 h-3 text-slate-400')} ${apt.location}
              </span>
            </div>
            <div class="text-[11px] text-slate-400 mt-1">${apt.type} • ${apt.reason}</div>
          </div>
        </div>

        <div class="flex items-center gap-2 shrink-0 self-end sm:self-center">
          ${!apt.paid ? `
            <a href="./billing.html?service=${encodeURIComponent('Copay: ' + apt.doctorName)}&amount=50.00" class="px-3 py-1.5 bg-[#005a9c] hover:bg-blue-700 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition shadow-xs">
              ${icon('credit-card', 'w-3.5 h-3.5')}
              <span>Pay ${apt.copay}</span>
            </a>
          ` : `
            <span class="text-xs text-emerald-700 font-bold px-2.5 py-1 bg-emerald-50 rounded-lg border border-emerald-200 flex items-center gap-1">
              ${icon('check', 'w-3.5 h-3.5')} Confirmed
            </span>
          `}

          <button data-cancel-id="${apt.id}" class="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition" title="Cancel Appointment">
            ${icon('trash', 'w-4 h-4')}
          </button>
        </div>
      </div>
    `).join('');

    // Cancel appointment buttons
    userAppointmentsList.querySelectorAll('[data-cancel-id]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-cancel-id');
        if (confirm('Are you sure you want to cancel this scheduled appointment?')) {
          const allApts = getAppointments();
          const updated = allApts.filter(a => a.id !== id);
          saveAppointments(updated);
          showToast('Appointment was cancelled.', 'info');
          renderAppointments(searchInput?.value || '');
        }
      });
    });
  }

  renderAppointments();

  // Search filter
  searchInput?.addEventListener('input', (e) => {
    renderAppointments(e.target.value);
  });

  // Booking Form Submission
  aptForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const submitter = e.submitter;
    const isPayNow = submitter && submitter.getAttribute('data-action') === 'confirm-pay';

    const formData = new FormData(aptForm);
    const doctorName = formData.get('doctor') || selectedDoctorName || 'Dr. Sarah Jenkins';
    const visitType = formData.get('visitType') || 'In-Person Office Consultation';
    const dateVal = formData.get('date') || '2026-10-28';
    const timeSlot = selectedSlotInput?.value || formData.get('timeSlot') || '10:30 AM';
    const reason = formData.get('reason') || 'Routine Consultation';

    const matchedDoc = AVAILABLE_DOCTORS.find(d => d.name === doctorName);
    const specialty = matchedDoc ? matchedDoc.specialty : 'Clinical Consultation';

    const newApt = {
      id: `APT-${Math.floor(100 + Math.random() * 900)}`,
      doctorName: doctorName.toString(),
      doctorSpecialty: specialty,
      date: dateVal.toString(),
      time: timeSlot.toString(),
      location: visitType.includes('Telehealth') ? 'Encrypted WebRTC Telehealth Room' : 'Suite 402 - Heart Center',
      type: visitType.toString(),
      status: 'Confirmed',
      copay: '$50.00',
      paid: isPayNow,
      reason: reason.toString(),
    };

    const apts = [newApt, ...getAppointments()];
    saveAppointments(apts);

    if (isPayNow) {
      showToast('Booking saved! Redirecting to secure Copay checkout...', 'info');
      setTimeout(() => {
        window.location.href = `./billing.html?service=${encodeURIComponent('Copay: ' + newApt.doctorName)}&amount=50.00`;
      }, 400);
    } else {
      showToast('Appointment booked successfully!', 'success');
      renderAppointments();
      const reasonEl = document.getElementById('input-reason');
      if (reasonEl) reasonEl.value = '';
      // Scroll to appointments list
      document.getElementById('scheduled-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  });
}

onReady(initAppointments);
