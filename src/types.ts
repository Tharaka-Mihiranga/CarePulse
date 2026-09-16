export type UserRole = 'patient' | 'doctor' | 'nurse' | 'administrator';

export type PageId = 
  | 'login'
  | 'patient-dashboard'
  | 'appointment-booking'
  | 'medical-records'
  | 'prescriptions'
  | 'payment'
  | 'admin-dashboard';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  mrn?: string;
  avatarText: string;
  dob?: string;
  gender?: string;
  bloodType?: string;
}

export interface Appointment {
  id: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  serviceType: string;
  status: 'Upcoming' | 'Completed' | 'Cancelled';
  fee: number;
}

export interface Prescription {
  id: string;
  name: string;
  dosage: string;
  instructions: string;
  rxNumber: string;
  refillsLeft: number;
  prescriber: string;
  status: 'Active' | 'Refill Needed' | 'Pending Approval' | 'Expired';
  copay: number;
}

export interface MedicalNote {
  id: string;
  date: string;
  physician: string;
  facility: string;
  visitType: string;
  diagnosis: string;
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}

export interface LabReport {
  id: string;
  title: string;
  date: string;
  category: string;
  resultSummary: string;
  status: 'Normal' | 'Follow-up Needed' | 'Completed';
  metrics?: { name: string; value: string; range: string; flag?: 'high' | 'low' | 'normal' }[];
}

export interface Transaction {
  id: string;
  user: string;
  date: string;
  amount: number;
  status: 'Completed' | 'Pending' | 'Failed';
  description: string;
  method?: string;
}

export interface RefillTimelineItem {
  id: string;
  title: string;
  time: string;
  completed: boolean;
}

export interface PaymentIntent {
  itemTitle: string;
  category: 'appointment' | 'prescription' | 'membership' | 'general';
  amount: number;
  tax: number;
  relatedId?: string;
}

export interface PatientVitals {
  heartRate: number;
  systolic: number;
  diastolic: number;
  bloodSugar: number;
  weight: number;
  oxygenSaturation: number;
  recordedAt: string;
}

export interface TriageResult {
  urgency: 'low' | 'moderate' | 'high' | 'emergency';
  title: string;
  recommendation: string;
  actionType: 'self_care' | 'routine_appointment' | 'urgent_telehealth' | 'emergency_call';
  suggestedSpecialty?: string;
}

