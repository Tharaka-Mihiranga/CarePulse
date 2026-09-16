import { UserProfile, Appointment, Prescription, MedicalNote, LabReport, Transaction, RefillTimelineItem } from '../types';

export const INITIAL_PROFILES: Record<string, UserProfile> = {
  patient: {
    id: 'PT-84920',
    name: 'Eleanor Vance',
    email: 'eleanor.vance@carepulse.org',
    role: 'patient',
    mrn: 'MRN-84920',
    avatarText: 'EV',
    dob: 'Oct 14, 1988 (35 yrs)',
    gender: 'Female',
    bloodType: 'A+',
  },
  doctor: {
    id: 'DOC-1092',
    name: 'Dr. Sarah Jenkins',
    email: 's.jenkins@carepulse.org',
    role: 'doctor',
    mrn: 'STF-5821',
    avatarText: 'SJ',
    dob: 'May 22, 1982',
    gender: 'Female',
  },
  administrator: {
    id: 'ADM-0042',
    name: 'Admin User',
    email: 'sysadmin@carepulse.org',
    role: 'administrator',
    avatarText: 'AU',
  },
};

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-1',
    doctorName: 'Dr. Sarah Smith',
    specialty: 'Cardiologist',
    date: 'Oct 24, 2026',
    time: '10:30 AM',
    serviceType: 'Cardiology Consultation',
    status: 'Upcoming',
    fee: 50.00,
  },
  {
    id: 'apt-2',
    doctorName: 'Dr. Robert Chen',
    specialty: 'General Checkup',
    date: 'Nov 12, 2026',
    time: '02:00 PM',
    serviceType: 'Routine Physical Examination',
    status: 'Upcoming',
    fee: 40.00,
  },
];

export const INITIAL_PRESCRIPTIONS: Prescription[] = [
  {
    id: 'rx-1',
    name: 'Amoxicillin 500mg',
    dosage: 'Capsule • Take 1 capsule 3x daily with food',
    instructions: 'Take 1 capsule every 8 hours with meals until finished',
    rxNumber: '984021A',
    refillsLeft: 2,
    prescriber: 'Dr. Aris Thorne',
    status: 'Active',
    copay: 15.00,
  },
  {
    id: 'rx-2',
    name: 'Atorvastatin 20mg',
    dosage: 'Tablet • Take 1 tablet daily at bedtime',
    instructions: 'Take 1 tablet in evening with water',
    rxNumber: '774109B',
    refillsLeft: 0,
    prescriber: 'Dr. Sarah Jenkins',
    status: 'Refill Needed',
    copay: 20.00,
  },
  {
    id: 'rx-3',
    name: 'Lisinopril 10mg',
    dosage: 'Tablet • Take 1 tablet every morning',
    instructions: 'Take 1 tablet every morning with or without food',
    rxNumber: '332910C',
    refillsLeft: 5,
    prescriber: 'Dr. Sarah Jenkins',
    status: 'Active',
    copay: 12.00,
  },
];

export const INITIAL_MEDICAL_NOTE: MedicalNote = {
  id: 'enc-20260912',
  date: 'Sept 12, 2026',
  physician: 'Dr. Mark Sloan',
  facility: 'Central Hospital, East Wing',
  visitType: 'Outpatient Consultation',
  diagnosis: 'Acute Bronchitis (J20.9)',
  subjective: 'Patient presents with a 4-day history of persistent cough, mild fever, and shortness of breath upon exertion. Reports fatigue and localized chest soreness from coughing.',
  objective: 'Chest X-Ray shows mild bronchial wall thickening. No consolidation observed. Lungs demonstrate mild wheezing bilaterally. Blood pressure 120/80, SpO2 98%.',
  assessment: 'Acute viral bronchitis without secondary pulmonary complications.',
  plan: 'Prescribed Albuterol inhaler (2 puffs q4h prn) and advised rest and increased hydration. Follow up in 10 days if symptoms persist.',
};

export const INITIAL_LAB_REPORTS: LabReport[] = [
  {
    id: 'lab-1',
    title: 'Complete Blood Count (CBC)',
    date: 'Sep 10, 2026',
    category: 'Hematology',
    resultSummary: 'Normal blood count across all markers; WBC within normal limits (6.8 K/uL).',
    status: 'Completed',
    metrics: [
      { name: 'White Blood Cells (WBC)', value: '6.8 K/uL', range: '4.5 - 11.0 K/uL', flag: 'normal' },
      { name: 'Red Blood Cells (RBC)', value: '4.52 M/uL', range: '4.0 - 5.2 M/uL', flag: 'normal' },
      { name: 'Hemoglobin', value: '14.1 g/dL', range: '12.0 - 15.5 g/dL', flag: 'normal' },
      { name: 'Platelets', value: '254 K/uL', range: '150 - 450 K/uL', flag: 'normal' },
    ],
  },
  {
    id: 'lab-2',
    title: 'Lipid Panel',
    date: 'Aug 15, 2026',
    category: 'Metabolic & Cardiovascular',
    resultSummary: 'Total cholesterol optimal; LDL slightly elevated at 112 mg/dL. Routine monitoring advised.',
    status: 'Completed',
    metrics: [
      { name: 'Total Cholesterol', value: '188 mg/dL', range: '< 200 mg/dL', flag: 'normal' },
      { name: 'HDL (Good)', value: '54 mg/dL', range: '> 50 mg/dL', flag: 'normal' },
      { name: 'LDL (Calculated)', value: '112 mg/dL', range: '< 100 mg/dL', flag: 'high' },
      { name: 'Triglycerides', value: '110 mg/dL', range: '< 150 mg/dL', flag: 'normal' },
    ],
  },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1092',
    user: 'Alex Morgan',
    date: 'Sep 16, 2026',
    amount: 129.00,
    status: 'Completed',
    description: 'Pro Membership Plan (Annual)',
    method: 'Credit Card (••• 4242)',
  },
  {
    id: 'tx-1091',
    user: 'John Doe',
    date: 'Sep 16, 2026',
    amount: 250.00,
    status: 'Pending',
    description: 'Full Session Specialist Care',
    method: 'PayPal',
  },
  {
    id: 'tx-1090',
    user: 'Sarah Smith',
    date: 'Sep 15, 2026',
    amount: 89.00,
    status: 'Completed',
    description: 'Diagnostic Imaging Copay',
    method: 'Bank Transfer',
  },
  {
    id: 'tx-1089',
    user: 'Michael Brown',
    date: 'Sep 15, 2026',
    amount: 45.00,
    status: 'Failed',
    description: 'Pharmacy Refill Order',
    method: 'Credit Card (••• 1198)',
  },
];

export const INITIAL_REFILL_TIMELINE: RefillTimelineItem[] = [
  { id: '1', title: 'Request Submitted', time: 'Today, 9:30 AM', completed: true },
  { id: '2', title: 'Doctor Approved', time: 'Today, 10:15 AM', completed: true },
  { id: '3', title: 'Preparing at Pharmacy', time: 'In Progress (Estimated 2:30 PM)', completed: false },
  { id: '4', title: 'Ready for Pickup / Delivery', time: 'Est. Today, 4:00 PM', completed: false },
];

export const INITIAL_VITALS = {
  heartRate: 72,
  systolic: 120,
  diastolic: 80,
  bloodSugar: 95,
  weight: 68,
  oxygenSaturation: 98,
  recordedAt: 'Today, 08:30 AM',
};

