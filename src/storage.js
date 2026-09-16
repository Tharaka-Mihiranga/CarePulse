// CarePulse Health Portal - Persistent Clinical Data Store via localStorage
import './index.css';

export const DEFAULT_PROFILES = {
  patient: {
    id: 'PT-84920',
    name: 'Eleanor Vance',
    email: 'e.vance@carepulse.org',
    role: 'patient',
    mrn: 'MRN-84920',
    bloodType: 'O Positive',
    allergies: ['Penicillin', 'Sulfa Drugs'],
    primaryDoctor: 'Dr. Sarah Jenkins, MD',
    avatarText: 'EV',
  },
  doctor: {
    id: 'DOC-104',
    name: 'Dr. Sarah Jenkins, MD',
    email: 's.jenkins@carepulse.org',
    role: 'doctor',
    specialty: 'Chief of Cardiology',
    department: 'Cardiovascular Health & Medicine',
    license: 'MD-83921-CA',
    avatarText: 'SJ',
  },
  administrator: {
    id: 'ADM-001',
    name: 'System AdminCore',
    email: 'admin@carepulse.org',
    role: 'administrator',
    badge: 'Superuser Access',
    avatarText: 'AD',
  },
};

export const DEFAULT_VITALS = {
  heartRate: 72,
  systolic: 120,
  diastolic: 80,
  bloodSugar: 95,
  weight: 68,
  oxygenSaturation: 98,
  recordedAt: 'Today, 08:30 AM',
};

export const DEFAULT_APPOINTMENTS = [
  {
    id: 'APT-101',
    doctorName: 'Dr. Sarah Jenkins',
    doctorSpecialty: 'Cardiologist',
    date: 'Oct 24, 2026',
    time: '10:30 AM',
    location: 'Suite 402 - Heart Center',
    type: 'In-Person Consultation',
    status: 'Confirmed',
    copay: '$50.00',
    paid: false,
    reason: 'Quarterly arrhythmia follow-up and ECG review',
  },
  {
    id: 'APT-102',
    doctorName: 'Dr. Marcus Vance',
    doctorSpecialty: 'Endocrinologist',
    date: 'Nov 02, 2026',
    time: '02:15 PM',
    location: 'Telehealth Room 4',
    type: 'Video Consultation',
    status: 'Scheduled',
    copay: '$35.00',
    paid: true,
    reason: 'Fasting glucose titration analysis',
  },
  {
    id: 'APT-103',
    doctorName: 'Dr. Emily Chen',
    doctorSpecialty: 'Dermatologist',
    date: 'Nov 18, 2026',
    time: '11:00 AM',
    location: 'Suite 108 - Specialty Clinic',
    type: 'In-Person Consultation',
    status: 'Pending Verification',
    copay: '$40.00',
    paid: false,
    reason: 'Annual preventive skin wellness examination',
  },
];

export const DEFAULT_PRESCRIPTIONS = [
  {
    id: 'RX-7721',
    medication: 'Amoxicillin',
    dosage: '500mg',
    frequency: 'Take 1 capsule 3 times daily with food',
    prescribedBy: 'Dr. Sarah Jenkins',
    datePrescribed: 'Oct 12, 2026',
    refillsLeft: 2,
    status: 'Active',
    pharmacy: 'CVS Pharmacy #4821 - Main St',
    instructions: 'Complete the entire 10-day cycle even if symptoms subside.',
    copay: '$12.50',
  },
  {
    id: 'RX-8840',
    medication: 'Lisinopril',
    dosage: '20mg',
    frequency: 'Take 1 tablet every morning',
    prescribedBy: 'Dr. Sarah Jenkins',
    datePrescribed: 'Sep 05, 2026',
    refillsLeft: 5,
    status: 'Active',
    pharmacy: 'CVS Pharmacy #4821 - Main St',
    instructions: 'Monitor resting blood pressure bi-weekly.',
    copay: '$10.00',
  },
  {
    id: 'RX-9912',
    medication: 'Metformin HCl',
    dosage: '850mg',
    frequency: 'Take 1 tablet twice daily with meals',
    prescribedBy: 'Dr. Marcus Vance',
    datePrescribed: 'Aug 18, 2026',
    refillsLeft: 0,
    status: 'Refill Needed',
    pharmacy: 'Walgreens #1204 - Oak Ave',
    instructions: 'Take strictly with breakfast and dinner.',
    copay: '$15.00',
  },
  {
    id: 'RX-5541',
    medication: 'Ibuprofen',
    dosage: '600mg',
    frequency: 'Take as needed for severe joint inflammation',
    prescribedBy: 'Dr. Alan Ross',
    datePrescribed: 'Jun 10, 2026',
    refillsLeft: 0,
    status: 'Expired',
    pharmacy: 'CVS Pharmacy #4821 - Main St',
    instructions: 'Do not exceed 3 tablets within a 24-hour interval.',
    copay: '$8.00',
  },
];

export const DEFAULT_LAB_REPORTS = [
  {
    id: 'LAB-2026-90',
    testName: 'Complete Blood Count (CBC) with Differential',
    orderedBy: 'Dr. Sarah Jenkins',
    date: 'Oct 15, 2026',
    status: 'Verified & Signed',
    summary: 'RBC, Platelets, and WBC levels all within optimal reference limits.',
    findings: [
      { metric: 'White Blood Cell Count', value: '6.8 x10^3/uL', reference: '4.5 - 11.0', status: 'Normal' },
      { metric: 'Red Blood Cell Count', value: '4.72 x10^6/uL', reference: '4.00 - 5.20', status: 'Normal' },
      { metric: 'Hemoglobin', value: '14.2 g/dL', reference: '12.0 - 16.0', status: 'Normal' },
      { metric: 'Platelets', value: '240 x10^3/uL', reference: '150 - 450', status: 'Normal' },
    ],
  },
  {
    id: 'LAB-2026-82',
    testName: 'Comprehensive Metabolic Panel (CMP-14)',
    orderedBy: 'Dr. Marcus Vance',
    date: 'Sep 28, 2026',
    status: 'Verified & Signed',
    summary: 'Electrolytes, Kidney, and Liver enzymatic functions normal.',
    findings: [
      { metric: 'Fasting Glucose', value: '95 mg/dL', reference: '70 - 99', status: 'Normal' },
      { metric: 'eGFR (Kidney Function)', value: '> 90 mL/min', reference: '> 60', status: 'Optimal' },
      { metric: 'Serum Potassium', value: '4.2 mmol/L', reference: '3.5 - 5.0', status: 'Normal' },
      { metric: 'Creatinine', value: '0.88 mg/dL', reference: '0.50 - 1.10', status: 'Normal' },
    ],
  },
  {
    id: 'LAB-2026-74',
    testName: 'Lipid Cardiovascular Biomarker Panel',
    orderedBy: 'Dr. Sarah Jenkins',
    date: 'Aug 14, 2026',
    status: 'Archived',
    summary: 'HDL protective index elevated; Total cholesterol within standard boundary.',
    findings: [
      { metric: 'Total Cholesterol', value: '178 mg/dL', reference: '< 200', status: 'Normal' },
      { metric: 'HDL (Good Cholesterol)', value: '62 mg/dL', reference: '> 50', status: 'Optimal' },
      { metric: 'LDL (Calculated)', value: '98 mg/dL', reference: '< 100', status: 'Normal' },
      { metric: 'Triglycerides', value: '110 mg/dL', reference: '< 150', status: 'Normal' },
    ],
  },
];

export const DEFAULT_TRANSACTIONS = [
  {
    id: 'TXN-9021',
    patientName: 'Eleanor Vance',
    service: 'Specialist Copay (Cardiology Consultation)',
    amount: 50.0,
    date: 'Oct 24, 2026',
    method: 'Visa •••• 4242',
    status: 'Settled',
    invoiceNumber: 'INV-2026-0891',
  },
  {
    id: 'TXN-9020',
    patientName: 'Eleanor Vance',
    service: 'Prescription Copay (Amoxicillin 500mg)',
    amount: 12.5,
    date: 'Oct 14, 2026',
    method: 'Apple Pay',
    status: 'Settled',
    invoiceNumber: 'INV-2026-0872',
  },
  {
    id: 'TXN-9019',
    patientName: 'David K. Miller',
    service: 'Diagnostic Radiology (Chest X-Ray Digital)',
    amount: 185.0,
    date: 'Oct 12, 2026',
    method: 'Mastercard •••• 8812',
    status: 'Settled',
    invoiceNumber: 'INV-2026-0865',
  },
  {
    id: 'TXN-9018',
    patientName: 'Sophia Reynolds',
    service: 'Comprehensive Metabolic Panel (CMP-14)',
    amount: 65.0,
    date: 'Oct 11, 2026',
    method: 'Health Savings Account (HSA)',
    status: 'Settled',
    invoiceNumber: 'INV-2026-0854',
  },
  {
    id: 'TXN-9017',
    patientName: 'James Wilson',
    service: 'Urgent Care Walk-In Triage & Evaluation',
    amount: 120.0,
    date: 'Oct 10, 2026',
    method: 'Direct Bank ACH',
    status: 'Pending',
    invoiceNumber: 'INV-2026-0849',
  },
];

export const CLINICAL_NOTES = [
  {
    id: 'NOTE-302',
    date: 'Oct 15, 2026',
    provider: 'Dr. Sarah Jenkins, MD',
    specialty: 'Cardiovascular Health',
    type: 'SOAP Progress Evaluation',
    subjective: 'Patient reports feeling well overall. Occasional mild palpitations during intense stress, lasting under 30 seconds. No syncope, orthopnea, or dyspnea on exertion.',
    objective: 'BP: 120/80 mmHg, HR: 72 bpm regular rhythm, SpO2: 98% on room air. Lungs clear to auscultation bilaterally. No peripheral edema noted in lower extremities.',
    assessment: 'Controlled sinus rhythm. Benign occasional premature ventricular contractions (PVCs). Primary hypertension well managed on Lisinopril 20mg.',
    plan: 'Continue current Lisinopril 20mg daily dose. Maintain active hydration. Repeat Holter telemetry follow-up in 6 months.',
  },
  {
    id: 'NOTE-298',
    date: 'Sep 10, 2026',
    provider: 'Dr. Marcus Vance, MD',
    specialty: 'Endocrinology',
    type: 'Metabolic Review',
    subjective: 'Reviewed self-monitoring glucose log. Average morning fasting level 92-98 mg/dL. Adhering to balanced Mediterranean dietary recommendations.',
    objective: 'Weight: 68 kg (stable), BMI: 22.4. Fasting glucose at office: 95 mg/dL. HbA1c: 5.6% (non-diabetic reference range).',
    assessment: 'Euglycemia sustained on Metformin 850mg twice daily with zero reported gastrointestinal adverse events.',
    plan: 'Renew Metformin 850mg prescription for 12 months. Routine follow-up scheduled in 6 months.',
  },
];

export const AVAILABLE_DOCTORS = [
  { id: 'doc-1', name: 'Dr. Sarah Jenkins', specialty: 'Cardiology', department: 'Heart & Vascular', fee: '$50.00', rating: '4.9 ★ (128 reviews)' },
  { id: 'doc-2', name: 'Dr. Marcus Vance', specialty: 'Endocrinology', department: 'Metabolic Health', fee: '$45.00', rating: '4.8 ★ (94 reviews)' },
  { id: 'doc-3', name: 'Dr. Emily Chen', specialty: 'Dermatology', department: 'Specialty Care', fee: '$40.00', rating: '4.9 ★ (210 reviews)' },
  { id: 'doc-4', name: 'Dr. Robert Patel', specialty: 'Internal Medicine', department: 'Primary Care', fee: '$35.00', rating: '4.7 ★ (85 reviews)' },
];

// LocalStorage helpers
export function getStoredData(key, defaultVal) {
  try {
    const item = localStorage.getItem(`carepulse_${key}`);
    return item ? JSON.parse(item) : defaultVal;
  } catch (e) {
    return defaultVal;
  }
}

export function setStoredData(key, value) {
  try {
    localStorage.setItem(`carepulse_${key}`, JSON.stringify(value));
  } catch (e) {
    console.error('Storage write error', e);
  }
}

export function getAppointments() {
  return getStoredData('appointments', DEFAULT_APPOINTMENTS);
}

export function saveAppointments(apts) {
  setStoredData('appointments', apts);
}

export function getPrescriptions() {
  return getStoredData('prescriptions', DEFAULT_PRESCRIPTIONS);
}

export function savePrescriptions(rxs) {
  setStoredData('prescriptions', rxs);
}

export function getTransactions() {
  return getStoredData('transactions', DEFAULT_TRANSACTIONS);
}

export function saveTransactions(txs) {
  setStoredData('transactions', txs);
}

export function getCurrentUser() {
  return getStoredData('currentUser', DEFAULT_PROFILES.patient);
}

export function saveCurrentUser(user) {
  setStoredData('currentUser', user);
}

export function getVitals() {
  return getStoredData('vitals', DEFAULT_VITALS);
}

export function saveVitals(vitals) {
  setStoredData('vitals', vitals);
}

export function getLabReports() {
  return getStoredData('labReports', DEFAULT_LAB_REPORTS);
}

export function saveLabReports(reports) {
  setStoredData('labReports', reports);
}

export function getClinicalNotes() {
  return getStoredData('clinicalNotes', CLINICAL_NOTES);
}

export function saveClinicalNotes(notes) {
  setStoredData('clinicalNotes', notes);
}

export function getEmergencyAlert() {
  return getStoredData('emergencyAlert', {
    active: true,
    title: 'Hospital Operational Advisory',
    message: 'Seasonal viral clinic hours extended until 9:00 PM. Same-day appointments available for rapid testing.',
    severity: 'info',
    timestamp: 'Updated today at 08:00 AM'
  });
}

export function saveEmergencyAlert(alert) {
  setStoredData('emergencyAlert', alert);
}

export function getPreferredPharmacy() {
  return getStoredData('preferredPharmacy', 'CVS Pharmacy #4821 - 742 Evergreen Terrace');
}

export function savePreferredPharmacy(pharmacy) {
  setStoredData('preferredPharmacy', pharmacy);
}

export function getMedicationDoses() {
  return getStoredData('medicationDoses', {
    morning: { taken: true, time: '08:15 AM' },
    afternoon: { taken: false, time: null },
    evening: { taken: false, time: null }
  });
}

export function saveMedicationDoses(doses) {
  setStoredData('medicationDoses', doses);
}
