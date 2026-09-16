import React, { useState } from 'react';
import { 
  PageId, 
  UserRole, 
  UserProfile, 
  Appointment, 
  Prescription, 
  LabReport, 
  Transaction, 
  PaymentIntent, 
  RefillTimelineItem,
  PatientVitals 
} from './types';
import { 
  INITIAL_PROFILES, 
  INITIAL_APPOINTMENTS, 
  INITIAL_PRESCRIPTIONS, 
  INITIAL_LAB_REPORTS, 
  INITIAL_TRANSACTIONS, 
  INITIAL_REFILL_TIMELINE,
  INITIAL_VITALS 
} from './data/mockData';
import { Navigation } from './components/Navigation';
import { LoginPage } from './components/LoginPage';
import { PatientDashboard } from './components/PatientDashboard';
import { AppointmentBookingPage } from './components/AppointmentBookingPage';
import { MedicalRecordPage } from './components/MedicalRecordPage';
import { PrescriptionsPage } from './components/PrescriptionsPage';
import { PaymentPage } from './components/PaymentPage';
import { AdminDashboard } from './components/AdminDashboard';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('patient-dashboard');
  const [currentRole, setCurrentRole] = useState<UserRole>('patient');
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_PROFILES.patient);
  
  // Interconnected Application State
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(INITIAL_PRESCRIPTIONS);
  const [labReports, setLabReports] = useState<LabReport[]>(INITIAL_LAB_REPORTS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [refillTimeline, setRefillTimeline] = useState<RefillTimelineItem[]>(INITIAL_REFILL_TIMELINE);
  const [paymentIntent, setPaymentIntent] = useState<PaymentIntent | null>(null);
  
  // Patient Biomarkers State
  const [vitals] = useState<PatientVitals>(INITIAL_VITALS);

  // Switch Role handler
  const handleSwitchRole = (role: UserRole) => {
    setCurrentRole(role);
    if (role === 'patient') {
      setUserProfile(INITIAL_PROFILES.patient);
    } else if (role === 'doctor') {
      setUserProfile(INITIAL_PROFILES.doctor);
    } else {
      setUserProfile(INITIAL_PROFILES.administrator);
    }
  };

  // Login handler
  const handleLogin = (role: UserRole, email: string) => {
    setCurrentRole(role);
    if (role === 'patient') {
      setUserProfile({ ...INITIAL_PROFILES.patient, email });
      setCurrentPage('patient-dashboard');
    } else if (role === 'doctor') {
      setUserProfile({ ...INITIAL_PROFILES.doctor, email });
      setCurrentPage('medical-records');
    } else if (role === 'administrator') {
      setUserProfile({ ...INITIAL_PROFILES.administrator, email });
      setCurrentPage('admin-dashboard');
    } else {
      setUserProfile({
        id: 'NUR-402',
        name: 'Nurse Clara Higgins',
        email,
        role: 'nurse',
        avatarText: 'CH',
      });
      setCurrentPage('patient-dashboard');
    }
  };

  // Add new appointment handler
  const handleAddAppointment = (newApt: Appointment) => {
    setAppointments([newApt, ...appointments]);
  };

  // Request refill handler
  const handleRequestRefill = (prescriptionId: string) => {
    setPrescriptions(prev => prev.map(p => {
      if (p.id === prescriptionId) {
        return {
          ...p,
          refillsLeft: Math.max(0, p.refillsLeft - 1),
          status: 'Active',
        };
      }
      return p;
    }));

    setRefillTimeline([
      { id: '1', title: 'Refill Request Submitted', time: 'Just now', completed: true },
      { id: '2', title: 'Doctor E-Signature Pending', time: 'In queue for Dr. Sarah Jenkins', completed: false },
      { id: '3', title: 'Pharmacy Dispense', time: 'Pending authorization', completed: false },
      { id: '4', title: 'Delivery or Pickup Ready', time: 'Est. Tomorrow, 10:00 AM', completed: false },
    ]);
  };

  // Add transaction handler
  const handleAddTransaction = (newTx: Transaction) => {
    setTransactions([newTx, ...transactions]);
  };

  return (
    <div className="min-h-screen bg-[#f4f6f8] text-slate-800 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900 relative">
      
      {/* Navigation Bar */}
      {currentPage !== 'login' && (
        <Navigation
          currentPage={currentPage}
          currentRole={currentRole}
          userProfile={userProfile}
          onNavigate={(page) => setCurrentPage(page)}
          onSwitchRole={handleSwitchRole}
        />
      )}

      {/* Main Content Area */}
      <main className={`flex-1 ${currentPage === 'login' ? 'p-0' : 'p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto'}`}>
        {currentPage === 'login' && (
          <LoginPage
            onLogin={handleLogin}
            onNavigate={(page) => setCurrentPage(page)}
          />
        )}

        {currentPage === 'patient-dashboard' && (
          <PatientDashboard
            userName={userProfile.name}
            patientId={userProfile.mrn || 'PT-84920'}
            appointments={appointments}
            prescriptions={prescriptions}
            labReports={labReports}
            vitals={vitals}
            onNavigate={(page) => setCurrentPage(page)}
            onRequestRefill={handleRequestRefill}
          />
        )}

        {currentPage === 'appointment-booking' && (
          <AppointmentBookingPage
            onAddAppointment={handleAddAppointment}
            onNavigate={(page) => setCurrentPage(page)}
            onSetPaymentIntent={(intent) => setPaymentIntent(intent)}
          />
        )}

        {currentPage === 'medical-records' && (
          <MedicalRecordPage
            onNavigate={(page) => setCurrentPage(page)}
          />
        )}

        {currentPage === 'prescriptions' && (
          <PrescriptionsPage
            prescriptions={prescriptions}
            refillTimeline={refillTimeline}
            onRequestRefill={handleRequestRefill}
            onNavigate={(page) => setCurrentPage(page)}
            onSetPaymentIntent={(intent) => setPaymentIntent(intent)}
          />
        )}

        {currentPage === 'payment' && (
          <PaymentPage
            paymentIntent={paymentIntent}
            onAddTransaction={handleAddTransaction}
            onNavigate={(page) => setCurrentPage(page)}
          />
        )}

        {currentPage === 'admin-dashboard' && (
          <AdminDashboard
            transactions={transactions}
            onNavigate={(page) => setCurrentPage(page)}
            onAddTransaction={handleAddTransaction}
          />
        )}
      </main>
    </div>
  );
}
