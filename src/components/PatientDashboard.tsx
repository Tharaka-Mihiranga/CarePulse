import React, { useState } from 'react';
import { 
  Heart, 
  Activity, 
  Droplet, 
  Scale, 
  Calendar, 
  Pill, 
  FileText, 
  CreditCard, 
  MessageSquare, 
  Download, 
  ArrowRight, 
  Clock, 
  User, 
  Plus, 
  CheckCircle2,
  AlertCircle,
  Eye,
  RefreshCw
} from 'lucide-react';
import { Appointment, Prescription, LabReport, PageId, PatientVitals } from '../types';

interface PatientDashboardProps {
  userName: string;
  patientId: string;
  appointments: Appointment[];
  prescriptions: Prescription[];
  labReports: LabReport[];
  vitals: PatientVitals;
  onNavigate: (page: PageId) => void;
  onRequestRefill: (prescriptionId: string) => void;
  onPayOutstanding?: () => void;
}

export function PatientDashboard({
  userName,
  patientId,
  appointments,
  prescriptions,
  labReports,
  vitals,
  onNavigate,
  onRequestRefill,
  onPayOutstanding,
}: PatientDashboardProps) {

  const [activeTab, setActiveTab] = useState<'overview' | 'vitals'>('overview');
  const [selectedLabReport, setSelectedLabReport] = useState<LabReport | null>(null);
  const [showNotification, setShowNotification] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setShowNotification(msg);
    setTimeout(() => setShowNotification(null), 3500);
  };

  const handleDownloadLabPDF = (reportTitle: string) => {
    triggerToast(`Generating high-resolution official PDF for ${reportTitle}... Download ready!`);
  };

  return (
    <div className="space-y-6">
      {/* Toast feedback */}
      {showNotification && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-lg shadow-xl border border-slate-700 flex items-center gap-3 text-sm animate-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{showNotification}</span>
        </div>
      )}

      {/* Welcome & Context Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 uppercase tracking-wider mb-1">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Active Patient Portal
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome back, {userName}</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            MRN: <span className="font-mono font-medium text-slate-700">{patientId}</span> • Last comprehensive checkup: Sep 12, 2026
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => onNavigate('appointment-booking')}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#2c3e50] hover:bg-[#1a252f] text-white text-sm font-semibold rounded-lg shadow-xs transition"
          >
            <Plus className="w-4 h-4" />
            <span>Book Appointment</span>
          </button>
          <button
            onClick={() => onNavigate('medical-records')}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-lg transition"
          >
            <FileText className="w-4 h-4" />
            <span>Medical Record</span>
          </button>
        </div>
      </div>

      {/* Quick Vitals / Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Heart Rate */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-center justify-between hover:border-slate-300 transition">
          <div>
            <div className="text-xs font-medium text-slate-500 mb-1">Heart Rate</div>
            <div className="text-2xl font-bold text-[#2c3e50] flex items-baseline gap-1">
              {vitals.heartRate} <span className="text-sm font-normal text-slate-500">bpm</span>
            </div>
            <div className="text-xs text-emerald-600 font-medium mt-1">
              {vitals.heartRate > 100 ? 'Tachycardia alert' : vitals.heartRate < 60 ? 'Bradycardia range' : 'Normal resting rhythm'}
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <Heart className="w-6 h-6" />
          </div>
        </div>

        {/* Blood Pressure */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-center justify-between hover:border-slate-300 transition">
          <div>
            <div className="text-xs font-medium text-slate-500 mb-1">Blood Pressure</div>
            <div className="text-2xl font-bold text-[#2c3e50] flex items-baseline gap-1">
              {vitals.systolic}/{vitals.diastolic} <span className="text-sm font-normal text-slate-500">mmHg</span>
            </div>
            <div className={`text-xs font-medium mt-1 ${vitals.systolic >= 135 ? 'text-amber-600' : 'text-emerald-600'}`}>
              {vitals.systolic >= 135 ? 'Pre-Hypertension' : 'Optimal category'}
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Activity className="w-6 h-6" />
          </div>
        </div>

        {/* Blood Sugar */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-center justify-between hover:border-slate-300 transition">
          <div>
            <div className="text-xs font-medium text-slate-500 mb-1">Blood Sugar</div>
            <div className="text-2xl font-bold text-[#2c3e50] flex items-baseline gap-1">
              {vitals.bloodSugar} <span className="text-sm font-normal text-slate-500">mg/dL</span>
            </div>
            <div className={`text-xs font-medium mt-1 ${vitals.bloodSugar > 125 ? 'text-amber-600' : 'text-emerald-600'}`}>
              {vitals.bloodSugar > 125 ? 'Elevated reading' : 'Fasting normal'}
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Droplet className="w-6 h-6" />
          </div>
        </div>

        {/* Weight */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-center justify-between hover:border-slate-300 transition">
          <div>
            <div className="text-xs font-medium text-slate-500 mb-1">Weight</div>
            <div className="text-2xl font-bold text-[#2c3e50] flex items-baseline gap-1">
              {vitals.weight} <span className="text-sm font-normal text-slate-500">kg</span>
            </div>
            <div className="text-xs text-slate-500 font-medium mt-1">
              BMI {(vitals.weight / (1.74 * 1.74)).toFixed(1)} (Normal)
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Scale className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Two Column Layout from Wireframe 7 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: 2/3 Width */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Upcoming Appointments Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#2c3e50]" />
                <h2 className="text-base font-bold text-slate-900">Upcoming Appointments</h2>
              </div>
              <button
                onClick={() => onNavigate('appointment-booking')}
                className="text-xs font-semibold px-3 py-1.5 bg-[#2c3e50] text-white hover:bg-slate-700 rounded-lg transition inline-flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Book New</span>
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {appointments.length > 0 ? (
                appointments.map((apt) => (
                  <div key={apt.id} className="py-3.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                        <span>{apt.doctorName}</span>
                        <span className="text-xs font-medium text-slate-500">({apt.specialty})</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {apt.date}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {apt.time}
                        </span>
                        <span className="bg-blue-50 text-blue-700 font-medium px-2 py-0.5 rounded-full text-[11px]">
                          Fee: ${apt.fee.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          onNavigate('appointment-booking');
                        }}
                        className="text-xs font-medium px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-md transition"
                      >
                        Reschedule
                      </button>
                      <button
                        onClick={() => {
                          onNavigate('payment');
                        }}
                        className="text-xs font-medium px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md transition"
                      >
                        Pay Copay
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-slate-400 text-sm">
                  No upcoming appointments scheduled.
                </div>
              )}
            </div>
          </div>

          {/* Active Prescriptions Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Pill className="w-5 h-5 text-teal-600" />
                <h2 className="text-base font-bold text-slate-900">Active Prescriptions</h2>
              </div>
              <button
                onClick={() => onNavigate('prescriptions')}
                className="text-xs text-teal-700 hover:underline font-semibold flex items-center gap-1"
              >
                <span>View All (PharmacyDirect)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {prescriptions.map((rx) => (
                <div key={rx.id} className="py-3.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                      <span>{rx.name}</span>
                      <span className="text-xs text-slate-400 font-mono">#{rx.rxNumber}</span>
                    </div>
                    <div className="text-xs text-slate-500">
                      {rx.instructions}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                        rx.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700'
                          : rx.status === 'Refill Needed'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {rx.status === 'Active' ? 'Refill Ready' : rx.status}
                    </span>
                    <button
                      onClick={() => {
                        onRequestRefill(rx.id);
                        onNavigate('prescriptions');
                      }}
                      className="text-xs font-semibold text-teal-700 hover:text-teal-800 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-md transition"
                    >
                      Request Refill
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: 1/3 Width */}
        <div className="space-y-6">
          
          {/* Quick Actions Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
              Quick Actions
            </h2>
            <div className="flex flex-col gap-2.5">
              <button
                onClick={() => onNavigate('prescriptions')}
                className="w-full text-left px-3.5 py-2.5 text-sm font-medium border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg transition flex items-center justify-between group"
              >
                <span className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-teal-600 group-hover:rotate-45 transition-transform" />
                  Request Prescription Refill
                </span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition" />
              </button>

              <button
                onClick={() => {
                  triggerToast("Secure message thread opened with Dr. Sarah Jenkins (Cardiology).");
                }}
                className="w-full text-left px-3.5 py-2.5 text-sm font-medium border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg transition flex items-center justify-between group"
              >
                <span className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                  Message Care Team
                </span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition" />
              </button>

              <button
                onClick={() => handleDownloadLabPDF('Complete Blood Panel & Vitals')}
                className="w-full text-left px-3.5 py-2.5 text-sm font-medium border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg transition flex items-center justify-between group"
              >
                <span className="flex items-center gap-2">
                  <Download className="w-4 h-4 text-purple-600" />
                  Download Lab Results (PDF)
                </span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition" />
              </button>

              <button
                onClick={() => onNavigate('payment')}
                className="w-full text-left px-3.5 py-2.5 text-sm font-medium border border-blue-200 bg-blue-50/50 hover:bg-blue-50 text-blue-900 rounded-lg transition flex items-center justify-between group"
              >
                <span className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-blue-600" />
                  Online Payment & Billing
                </span>
                <ArrowRight className="w-4 h-4 text-blue-400 group-hover:text-blue-700 transition" />
              </button>
            </div>
          </div>

          {/* Recent Lab Reports Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">Recent Lab Reports</h2>
              <button
                onClick={() => onNavigate('medical-records')}
                className="text-xs text-blue-600 hover:underline font-medium"
              >
                All Records
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {labReports.map((lab) => (
                <div key={lab.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-slate-900">{lab.title}</div>
                    <div className="text-xs text-slate-500">Uploaded: {lab.date}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedLabReport(lab)}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-md transition flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Lab Report Detail Modal */}
      {selectedLabReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">{selectedLabReport.title}</h3>
                <p className="text-xs text-slate-500">Recorded: {selectedLabReport.date} • {selectedLabReport.category}</p>
              </div>
              <button
                onClick={() => setSelectedLabReport(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-700">
                <span className="font-semibold text-slate-900">Summary: </span>
                {selectedLabReport.resultSummary}
              </div>

              {selectedLabReport.metrics && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Detailed Biomarkers</h4>
                  <div className="space-y-2 text-xs border border-slate-100 rounded-lg divide-y divide-slate-100">
                    {selectedLabReport.metrics.map((m, idx) => (
                      <div key={idx} className="p-2.5 flex items-center justify-between">
                        <div>
                          <div className="font-medium text-slate-800">{m.name}</div>
                          <div className="text-[11px] text-slate-400">Ref: {m.range}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-slate-900">{m.value}</div>
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                              m.flag === 'high' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {m.flag ? m.flag.toUpperCase() : 'NORMAL'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => {
                  handleDownloadLabPDF(selectedLabReport.title);
                  setSelectedLabReport(null);
                }}
                className="text-xs font-semibold px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg transition flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save PDF</span>
              </button>

              <button
                onClick={() => setSelectedLabReport(null)}
                className="text-xs font-semibold px-4 py-2 bg-[#2c3e50] text-white rounded-lg hover:bg-slate-800 transition"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
