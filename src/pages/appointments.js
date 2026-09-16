// Appointment Booking Page Logic
import { setupNavigation } from '../navbar.js';
import { getAppointments, saveAppointments, AVAILABLE_DOCTORS } from '../storage.js';

document.addEventListener('DOMContentLoaded', () => {
  setupNavigation('appointments');

  const doctorPicker = document.getElementById('doctor-picker');
  const feeDisplay = document.getElementById('booking-fee-display');
  const aptForm = document.getElementById('appointment-form');
  const userAppointmentsList = document.getElementById('user-appointments-list');

  // Render Doctor Choices
  if (doctorPicker) {
    doctorPicker.innerHTML = AVAILABLE_DOCTORS.map((doc, idx) => `
      <label class="p-4 rounded-xl border ${idx === 0 ? 'border-[#005a9c] bg-blue-50/40 ring-2 ring-blue-500/20' : 'border-slate-200 hover:border-slate-300'} cursor-pointer flex items-start gap-3 transition">
        <input type="radio" name="doctor" value="${doc.name}" data-fee="${doc.fee}" data-specialty="${doc.specialty}" ${idx === 0 ? 'checked' : ''} class="mt-1 text-[#005a9c] focus:ring-[#005a9c]">
        <div>
          <div class="font-bold text-sm text-slate-900">${doc.name}</div>
          <div class="text-xs text-[#005a9c] font-semibold">${doc.specialty} • ${doc.department}</div>
          <div class="text-[11px] text-slate-500 mt-1">Consultation Copay: <span class="font-bold text-slate-800">${doc.fee}</span></div>
          <div class="text-[10px] text-amber-600 mt-0.5">${doc.rating}</div>
        </div>
      </label>
    `).join('');

    doctorPicker.querySelectorAll('input[type="radio"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        doctorPicker.querySelectorAll('label').forEach(l => {
          l.classList.remove('border-[#005a9c]', 'bg-blue-50/40', 'ring-2', 'ring-blue-500/20');
          l.classList.add('border-slate-200');
        });
        const parent = radio.closest('label');
        parent.classList.remove('border-slate-200');
        parent.classList.add('border-[#005a9c]', 'bg-blue-50/40', 'ring-2', 'ring-blue-500/20');
        
        const fee = radio.getAttribute('data-fee') || '$50.00';
        if (feeDisplay) feeDisplay.textContent = fee;
      });
    });
  }

  // Render Existing Appointments
  function renderAppointments() {
    if (!userAppointmentsList) return;
    const appointments = getAppointments();
    userAppointmentsList.innerHTML = appointments.map(apt => `
      <div class="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div class="font-bold text-slate-900 text-sm flex items-center gap-2">
            <span>${apt.doctorName}</span>
            <span class="text-[10px] px-2 py-0.5 rounded-full ${apt.paid ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'} font-semibold">
              ${apt.paid ? 'Paid' : 'Unpaid Copay'}
            </span>
          </div>
          <div class="text-xs text-slate-600 mt-0.5">${apt.date} at ${apt.time} • ${apt.location}</div>
          <div class="text-[11px] text-slate-400 mt-0.5">${apt.type} - ${apt.reason}</div>
        </div>
        <div>
          ${!apt.paid ? `
            <a href="./billing.html?service=${encodeURIComponent('Copay: ' + apt.doctorName)}&amount=50.00" class="px-3 py-1.5 bg-[#005a9c] hover:bg-blue-700 text-white rounded-lg text-xs font-semibold inline-block">
              Pay ${apt.copay}
            </a>
          ` : `
            <span class="text-xs text-emerald-600 font-bold">Confirmed</span>
          `}
        </div>
      </div>
    `).join('');
  }

  renderAppointments();

  // Booking Form Submission
  aptForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const submitter = e.submitter;
    const isPayNow = submitter && submitter.getAttribute('data-action') === 'confirm-pay';

    const formData = new FormData(aptForm);
    const doctorName = formData.get('doctor') || 'Dr. Sarah Jenkins';
    const visitType = formData.get('visitType') || 'In-Person Consultation';
    const dateVal = formData.get('date') || '2026-10-28';
    const timeSlot = formData.get('timeSlot') || '10:30 AM';
    const reason = formData.get('reason') || 'Routine Consultation';

    const newApt = {
      id: `APT-${Math.floor(100 + Math.random() * 900)}`,
      doctorName: doctorName.toString(),
      doctorSpecialty: 'Specialist Consultation',
      date: dateVal.toString(),
      time: timeSlot.toString(),
      location: visitType === 'In-Person Consultation' ? 'Suite 402 - Heart Center' : 'Encrypted Telehealth Room',
      type: visitType.toString(),
      status: 'Confirmed',
      copay: '$50.00',
      paid: isPayNow,
      reason: reason.toString(),
    };

    const apts = [newApt, ...getAppointments()];
    saveAppointments(apts);

    if (isPayNow) {
      window.location.href = `./billing.html?service=${encodeURIComponent('Copay: ' + newApt.doctorName)}&amount=50.00`;
    } else {
      alert('Appointment successfully confirmed and added to your schedule!');
      renderAppointments();
      aptForm.reset();
    }
  });
});
