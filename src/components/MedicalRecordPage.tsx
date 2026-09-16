import React, { useState } from 'react';
import { 
  FileText, 
  Printer, 
  Plus, 
  Download, 
  Heart, 
  Activity, 
  Thermometer, 
  Wind, 
  AlertTriangle, 
  Pill, 
  Calendar, 
  Building, 
  User, 
  Eye, 
  CheckCircle2, 
  X,
  Stethoscope
} from 'lucide-react';
import { MedicalNote, PageId } from '../types';

interface MedicalRecordPageProps {
  onNavigate: (page: PageId) => void;
}

export function MedicalRecordPage({ onNavigate }: MedicalRecordPageProps) {
  const [activeTab, setActiveTab] = useState<'encounter' | 'labs' | 'prescriptions' | 'history'>('encounter');
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [selectedAttachment, setSelectedAttachment] = useState<string | null>(null);

  const [clinicalNotes, setClinicalNotes] = useState<MedicalNote[]>([
    {
      id: 'enc-1',
      date: 'Sept 12, 2026',
      physician: 'Dr. Mark Sloan',
      facility: 'Central Hospital, East Wing',
      visitType: 'Outpatient Consultation',
      diagnosis: 'Acute Bronchitis (J20.9)',
      subjective: 'Patient presents with a 4-day history of persistent cough, mild fever, and shortness of breath upon exertion. Reports fatigue and localized chest soreness from coughing.',
      objective: 'Chest X-Ray shows mild bronchial wall thickening. No consolidation observed. Lungs demonstrate mild wheezing bilaterally.',
      assessment: 'Acute viral bronchitis without secondary pulmonary complications.',
      plan: 'Prescribed Albuterol inhaler (2 puffs q4h prn) and advised rest and increased hydration. Follow up in 10 days if symptoms persist.',
    }
  ]);

  const [newDiagnosis, setNewDiagnosis] = useState('');
  const [newPlan, setNewPlan] = useState('');
  const [newSubjective, setNewSubjective] = useState('');

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDiagnosis) return;

    const newNote: MedicalNote = {
      id: `enc-${Date.now()}`,
      date: 'Today, ' + new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      physician: 'Dr. Sarah Jenkins',
      facility: 'CarePulse Central Clinic',
      visitType: 'Clinical Follow-up Note',
      diagnosis: newDiagnosis,
      subjective: newSubjective || 'Patient reports symptoms improving with prescribed regimen.',
      objective: 'Vitals stable. Clear breath sounds upon re-examination.',
      assessment: 'Favorable clinical progression.',
      plan: newPlan || 'Continue current therapy. Discharge with standard precautions.',
    };

    setClinicalNotes([newNote, ...clinicalNotes]);
    setShowAddNoteModal(false);
    setNewDiagnosis('');
    setNewPlan('');
    setNewSubjective('');
  };

  return (
    <div className="space-y-6">
      
      {/* Patient Header Banner from Wireframe */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900">Eleanor Vance</h1>
            <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-200">
              Active Record
            </span>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-500 mt-1.5">
            <span><strong>MRN:</strong> #MRN-84920</span>
            <span><strong>DOB:</strong> Oct 14, 1988 (35 yrs)</span>
            <span><strong>Gender:</strong> Female</span>
            <span><strong>Blood Type:</strong> A+</span>
            <span><strong>Primary Physician:</strong> Dr. Sarah Jenkins</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <button
            onClick={() => setShowPrintModal(true)}
            className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-3.5 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-medium transition"
          >
            <Printer className="w-4 h-4" />
            <span>Print Record</span>
          </button>
          <button
            onClick={() => setShowAddNoteModal(true)}
            className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add New Note</span>
          </button>
        </div>
      </div>

      {/* Main Body Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Panel: Medical Record Details (2/3 Width) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
            
            {/* Tabs */}
            <div className="flex border-b border-slate-200 mb-6 gap-6 text-sm font-medium">
              <button
                onClick={() => setActiveTab('encounter')}
                className={`pb-3 border-b-2 transition -mb-[1px] ${
                  activeTab === 'encounter'
                    ? 'border-blue-600 text-blue-600 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Encounter Summary
              </button>
              <button
                onClick={() => setActiveTab('labs')}
                className={`pb-3 border-b-2 transition -mb-[1px] ${
                  activeTab === 'labs'
                    ? 'border-blue-600 text-blue-600 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Lab Results
              </button>
              <button
                onClick={() => {
                  setActiveTab('prescriptions');
                  onNavigate('prescriptions');
                }}
                className={`pb-3 border-b-2 transition -mb-[1px] ${
                  activeTab === 'prescriptions'
                    ? 'border-blue-600 text-blue-600 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Prescriptions (Open Rx)
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`pb-3 border-b-2 transition -mb-[1px] ${
                  activeTab === 'history'
                    ? 'border-blue-600 text-blue-600 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Clinical History
              </button>
            </div>

            {activeTab === 'encounter' && (
              <div className="space-y-6">
                {clinicalNotes.map((note) => (
                  <div key={note.id} className="space-y-5 pb-6 border-b border-slate-100 last:border-none last:pb-0">
                    
                    {/* Encounter Overview */}
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 mb-3 border-b border-dashed border-slate-200 pb-1.5 flex items-center justify-between">
                        <span>Encounter Overview — {note.date}</span>
                        <span className="text-xs font-normal text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
                          Validated by Attending
                        </span>
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-slate-500">Attending Physician:</span>{' '}
                          <span className="font-semibold text-slate-800">{note.physician}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">Facility:</span>{' '}
                          <span className="font-semibold text-slate-800">{note.facility}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">Visit Type:</span>{' '}
                          <span className="font-semibold text-slate-800">{note.visitType}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">Primary Diagnosis:</span>{' '}
                          <span className="font-semibold text-slate-800">{note.diagnosis}</span>
                        </div>
                      </div>
                    </div>

                    {/* Clinical Notes (SOAP Format) */}
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 mb-2 border-b border-dashed border-slate-200 pb-1.5">
                        Clinical Notes (SOAP Protocol)
                      </h3>
                      <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg text-xs leading-relaxed text-slate-700 space-y-2.5">
                        <div>
                          <strong className="text-slate-900">Subjective:</strong> {note.subjective}
                        </div>
                        <div>
                          <strong className="text-slate-900">Objective:</strong> {note.objective}
                        </div>
                        <div>
                          <strong className="text-slate-900">Assessment:</strong> {note.assessment}
                        </div>
                        <div>
                          <strong className="text-slate-900">Plan:</strong> {note.plan}
                        </div>
                      </div>
                    </div>

                  </div>
                ))}

                {/* Attachments & Diagnostic Images */}
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-3 border-b border-dashed border-slate-200 pb-1.5">
                    Attachments & Diagnostic Images
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-600" />
                        <span className="font-medium text-slate-800">Chest_XRay_Bilateral_20260912.pdf</span>
                        <span className="text-slate-400 text-[11px]">(2.4 MB • Radiology)</span>
                      </div>
                      <button
                        onClick={() => setSelectedAttachment('Chest X-Ray Bilateral Imaging Report')}
                        className="px-3 py-1 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold rounded text-xs transition"
                      >
                        View Scan
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-emerald-600" />
                        <span className="font-medium text-slate-800">Lab_BloodPanel_Complete.pdf</span>
                        <span className="text-slate-400 text-[11px]">(1.1 MB • Hematology)</span>
                      </div>
                      <button
                        onClick={() => setSelectedAttachment('Complete Blood Count (CBC) Laboratory Findings')}
                        className="px-3 py-1 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold rounded text-xs transition"
                      >
                        View Lab
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {activeTab === 'labs' && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900">Official Diagnostic Reports</h3>
                <div className="space-y-3">
                  <div className="border border-slate-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">Complete Blood Count (CBC)</h4>
                        <p className="text-xs text-slate-500">Collected: Sep 10, 2026 • Certified by Dr. Lisa Ray</p>
                      </div>
                      <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-xs font-semibold">
                        All Biomarkers Normal
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-2 border-t border-slate-100">
                      <div><span className="text-slate-500">WBC:</span> <strong>6.8 K/uL</strong></div>
                      <div><span className="text-slate-500">RBC:</span> <strong>4.52 M/uL</strong></div>
                      <div><span className="text-slate-500">Hemoglobin:</span> <strong>14.1 g/dL</strong></div>
                      <div><span className="text-slate-500">Platelets:</span> <strong>254 K/uL</strong></div>
                    </div>
                  </div>

                  <div className="border border-slate-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">Lipid & Metabolic Profile</h4>
                        <p className="text-xs text-slate-500">Collected: Aug 15, 2026 • Verified Lab ID #90214</p>
                      </div>
                      <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 rounded-full text-xs font-semibold">
                        Mild LDL Elevation
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-2 border-t border-slate-100">
                      <div><span className="text-slate-500">Total Chol:</span> <strong>188 mg/dL</strong></div>
                      <div><span className="text-slate-500">HDL (Good):</span> <strong>54 mg/dL</strong></div>
                      <div><span className="text-slate-500">LDL:</span> <strong className="text-amber-700">112 mg/dL</strong></div>
                      <div><span className="text-slate-500">Triglycerides:</span> <strong>110 mg/dL</strong></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-4 text-xs">
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-2">Surgical & Past Medical History</h4>
                  <ul className="list-disc list-inside space-y-1 text-slate-700">
                    <li>Appendectomy (Laparoscopic) — June 2018 (Uncomplicated)</li>
                    <li>Mild seasonal allergic rhinitis</li>
                    <li>No history of hypertension or diabetes mellitus</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-2">Immunization Record</h4>
                  <ul className="list-disc list-inside space-y-1 text-slate-700">
                    <li>Annual Influenza Vaccine (Inactivated) — Oct 2025</li>
                    <li>Tdap (Tetanus, Diphtheria, Pertussis) Booster — May 2022</li>
                    <li>COVID-19 Updated Bivalent Booster — Sep 2024</li>
                  </ul>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Right Panel: Vitals & Clinical Widgets (1/3 Width) */}
        <div className="space-y-6">
          
          {/* Recorded Vitals Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center justify-between">
              <span>Recorded Vitals</span>
              <span className="text-[11px] font-normal text-slate-400">Sep 12, 2026</span>
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#f4f6f9] p-3 rounded-lg text-center">
                <div className="text-[11px] font-medium text-slate-500">Blood Pressure</div>
                <div className="text-lg font-bold text-slate-900 mt-1">120/80</div>
                <div className="text-[10px] text-emerald-600">mmHg</div>
              </div>

              <div className="bg-[#f4f6f9] p-3 rounded-lg text-center">
                <div className="text-[11px] font-medium text-slate-500">Heart Rate</div>
                <div className="text-lg font-bold text-slate-900 mt-1">72 <span className="text-xs font-normal">bpm</span></div>
                <div className="text-[10px] text-emerald-600">Regular</div>
              </div>

              <div className="bg-[#f4f6f9] p-3 rounded-lg text-center">
                <div className="text-[11px] font-medium text-slate-500">Temperature</div>
                <div className="text-lg font-bold text-slate-900 mt-1">98.6°F</div>
                <div className="text-[10px] text-slate-400">Oral</div>
              </div>

              <div className="bg-[#f4f6f9] p-3 rounded-lg text-center">
                <div className="text-[11px] font-medium text-slate-500">SpO2 Oxygen</div>
                <div className="text-lg font-bold text-slate-900 mt-1">98%</div>
                <div className="text-[10px] text-emerald-600">Room air</div>
              </div>
            </div>
          </div>

          {/* Allergies Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Known Allergies</span>
            </h3>

            <div className="flex flex-wrap gap-2">
              <span className="px-2.5 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-semibold">
                Penicillin (Severe / Anaphylaxis)
              </span>
              <span className="px-2.5 py-1 bg-red-100 text-red-900 rounded-full text-xs font-semibold">
                Peanuts
              </span>
              <span className="px-2.5 py-1 bg-slate-100 text-slate-800 rounded-full text-xs font-semibold">
                Latex
              </span>
            </div>
          </div>

          {/* Active Medications */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Pill className="w-4 h-4 text-teal-600" />
                <span>Active Medications</span>
              </h3>
              <button
                onClick={() => onNavigate('prescriptions')}
                className="text-xs text-teal-700 hover:underline font-semibold"
              >
                Manage Rx
              </button>
            </div>

            <ul className="text-xs space-y-2 text-slate-700 divide-y divide-slate-100">
              <li className="pt-2 first:pt-0">
                <div className="font-semibold text-slate-900">Lisinopril 10mg</div>
                <div className="text-slate-500">1x Daily in the morning</div>
              </li>
              <li className="pt-2">
                <div className="font-semibold text-slate-900">Albuterol Inhaler (90mcg)</div>
                <div className="text-slate-500">2 puffs every 4-6 hours as needed for wheeze</div>
              </li>
              <li className="pt-2">
                <div className="font-semibold text-slate-900">Multivitamin Daily</div>
                <div className="text-slate-500">1 tablet daily with breakfast</div>
              </li>
            </ul>
          </div>

        </div>

      </div>

      {/* Add New Note Modal */}
      {showAddNoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-blue-600" />
                Add Clinical Note to Electronic Record
              </h3>
              <button
                onClick={() => setShowAddNoteModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddNote} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Primary Diagnosis / ICD-10</label>
                <input
                  type="text"
                  placeholder="e.g. Acute Bronchitis resolved / Follow-up"
                  value={newDiagnosis}
                  onChange={(e) => setNewDiagnosis(e.target.value)}
                  className="w-full p-2.5 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Subjective Findings</label>
                <textarea
                  rows={2}
                  placeholder="Patient reports symptoms and response to inhaler therapy..."
                  value={newSubjective}
                  onChange={(e) => setNewSubjective(e.target.value)}
                  className="w-full p-2.5 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-600 resize-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assessment & Treatment Plan</label>
                <textarea
                  rows={3}
                  placeholder="Clinical assessment and revised prescription instructions..."
                  value={newPlan}
                  onChange={(e) => setNewPlan(e.target.value)}
                  className="w-full p-2.5 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-600 resize-none"
                  required
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddNoteModal(false)}
                  className="px-3.5 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 text-slate-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
                >
                  Save to Patient Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Print Record Preview Modal */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-2xl w-full p-8 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-4 mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Hospital Medical Record Summary</h3>
                <p className="text-xs text-slate-500">Official Clinical Transcript • HIPAA Protected</p>
              </div>
              <button onClick={() => setShowPrintModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-800 leading-relaxed border p-6 rounded-lg bg-slate-50">
              <div className="grid grid-cols-2 gap-4 pb-4 border-b">
                <div>
                  <strong>Patient:</strong> Eleanor Vance<br />
                  <strong>MRN:</strong> #MRN-84920<br />
                  <strong>DOB:</strong> Oct 14, 1988 (Age 35)
                </div>
                <div>
                  <strong>Facility:</strong> CarePulse Central Hospital<br />
                  <strong>Date of Generation:</strong> September 16, 2026<br />
                  <strong>Physician:</strong> Dr. Sarah Jenkins (Cardiology)
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1">Latest Clinical Encounter:</h4>
                <p>Primary Diagnosis: Acute Bronchitis (J20.9). Albuterol inhaler prescribed. Follow-up complete.</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1">Current Vitals:</h4>
                <p>BP: 120/80 mmHg | Heart Rate: 72 bpm | Temp: 98.6°F | SpO2: 98%</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1">Allergies Documented:</h4>
                <p className="text-amber-800 font-semibold">Penicillin (Severe), Peanuts, Latex</p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t flex justify-between items-center text-xs">
              <span className="text-slate-400">Authenticated via CarePulse Electronic Health Record (EHR)</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowPrintModal(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-slate-50"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    alert("Official printable document sent to printer spooler.");
                    setShowPrintModal(false);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" />
                  <span>Send to Printer</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Attachment Viewer Modal */}
      {selectedAttachment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-xl w-full p-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                {selectedAttachment}
              </h3>
              <button onClick={() => setSelectedAttachment(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-8 bg-slate-900 text-white rounded-xl text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-blue-400">
                <Activity className="w-8 h-8 animate-pulse" />
              </div>
              <div>
                <div className="text-base font-bold">Diagnostic Imaging DICOM / High-Res View</div>
                <div className="text-xs text-slate-400 mt-1">High-resolution viewer loaded for Eleanor Vance (MRN-84920)</div>
              </div>
              <div className="p-3 bg-slate-800/80 rounded-lg text-xs text-slate-300 font-mono text-left">
                [Metadata: Resolution 3840x2160, Exposure: 120kV, Modality: CR Bilateral Thorax, Radiologist: Dr. Lisa Ray, MD]
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2 text-xs">
              <button
                onClick={() => setSelectedAttachment(null)}
                className="px-4 py-2 border rounded-lg hover:bg-slate-50"
              >
                Close Viewer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
