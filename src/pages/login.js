// Login Page Logic
import { saveCurrentUser, DEFAULT_PROFILES } from '../storage.js';

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const roleSelect = document.getElementById('login-role-select');
  const emailInput = document.getElementById('login-email');

  roleSelect?.addEventListener('change', (e) => {
    const role = e.target.value;
    if (role === 'doctor') {
      if (emailInput) emailInput.value = 's.jenkins@carepulse.org';
    } else if (role === 'administrator') {
      if (emailInput) emailInput.value = 'admin@carepulse.org';
    } else {
      if (emailInput) emailInput.value = 'e.vance@carepulse.org';
    }
  });

  loginForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const role = roleSelect ? roleSelect.value : 'patient';
    const email = emailInput ? emailInput.value : 'e.vance@carepulse.org';

    const userProfile = {
      ...(DEFAULT_PROFILES[role] || DEFAULT_PROFILES.patient),
      email,
    };

    saveCurrentUser(userProfile);

    if (role === 'patient') window.location.href = '/index.html';
    else if (role === 'doctor') window.location.href = '/medical-records.html';
    else window.location.href = '/admin.html';
  });
});
