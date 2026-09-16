import React, { useState } from 'react';
import { 
  Pill, 
  RefreshCw, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  Clock, 
  CreditCard, 
  Plus, 
  ChevronRight, 
  Building2, 
  AlertCircle,
  X
} from 'lucide-react';
import { Prescription, PageId, PaymentIntent, RefillTimelineItem } from '../types';

interface PrescriptionsPageProps {
  prescriptions: Prescription[];
  refillTimeline: RefillTimelineItem[];
  onRequestRefill: (prescriptionId: string) => void;
  onNavigate: (page: PageId) => void;
  onSetPaymentIntent: (intent: PaymentIntent) => void;
}

export function PrescriptionsPage({
  prescriptions,
  refillTimeline,
  onRequestRefill,
  onNavigate,
  onSetPaymentIntent,
}: PrescriptionsPageProps) {
  const [activeTab, setActiveTab] = useState<'active' | 'pending' | 'expired'>('active');
  const [showNewRxModal, setShowNewRxModal] = useState(false);
  const [showChangePharmacyModal, setShowChangePharmacyModal] = useState(false);
  const [pharmacy, setPharmacy] = useState({
    name: 'CVS Pharmacy #4821',
    address: '123 Main Street, Suite B, Springfield, IL 62701',
    phone: '(555) 019-2834',
  });

  const [notification, setNotification] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleRefillClick = (rx: Prescription) => {
    onRequestRefill(rx.id);
    triggerToast(`Refill requested for ${rx.name}. Transmitted to ${pharmacy.name}.`);
  };

  const handlePayCopay = (rx: Prescription) => {
    onSetPaymentIntent({
      itemTitle: `Prescription Copay: ${rx.name}`,
      category: 'prescription',
      amount: rx.copay || 15.00,
      tax: 0,
      relatedId: rx.id,
    });
    onNavigate('payment');
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Feedback */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-lg shadow-xl border border-slate-700 flex items-center gap-3 text-sm animate-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-teal-50 text-teal-600 rounded-xl border border-teal-200">
            <Pill className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-teal-700 uppercase tracking-wider">
              PharmacyDirect • CarePulse Electronic Rx
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Online Prescriptions</h1>
          </div>
        </div>

        <button
          onClick={() => setShowNewRxModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg shadow-xs transition"
        >
          <Plus className="w-4 h-4" />
          <span>+ Request New Prescription</span>
        </button>
      </div>

      {/* Grid Layout (2 Column from Wireframe 5) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Prescriptions List (2/3 Width) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
            
            {/* Tabs */}
            <div className="flex border-b border-slate-200 mb-6 gap-6 text-sm font-medium">
              <button
                onClick={() => setActiveTab('active')}
                className={`pb-3 border-b-2 transition -mb-[1px] ${
                  activeTab === 'active'
                    ? 'border-teal-600 text-teal-700 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Active Prescriptions ({prescriptions.filter(p => p.status !== 'Expired').length})
              </button>
              <button
                onClick={() => setActiveTab('pending')}
                className={`pb-3 border-b-2 transition -mb-[1px] ${
                  activeTab === 'pending'
                    ? 'border-teal-600 text-teal-700 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Pending Approval (1)
              </button>
              <button
                onClick={() => setActiveTab('expired')}
                className={`pb-3 border-b-2 transition -mb-[1px] ${
                  activeTab === 'expired'
                    ? 'border-teal-600 text-teal-700 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Expired & Past
              </button>
            </div>

            {/* List */}
            <div className="space-y-4">
              {activeTab === 'active' && (
                prescriptions.map((rx) => (
                  <div
                    key={rx.id}
                    className="border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2.5">
                        <h3 className="text-base font-bold text-slate-900">{rx.name}</h3>
                        <span
                          className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold ${
                            rx.status === 'Active'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-amber-100 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {rx.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600">{rx.dosage}</p>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 pt-1">
                        <span><strong>Rx #:</strong> <span className="font-mono">{rx.rxNumber}</span></span>
                        <span><strong>Refills Left:</strong> {rx.refillsLeft}</span>
                        <span><strong>Prescriber:</strong> {rx.prescriber}</span>
                        <span><strong>Copay:</strong> ${rx.copay.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePayCopay(rx)}
                        className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-lg text-xs transition flex items-center gap-1"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Pay Copay</span>
                      </button>

                      <button
                        onClick={() => handleRefillClick(rx)}
                        disabled={rx.refillsLeft === 0}
                        className={`px-4 py-2 font-semibold rounded-lg text-xs transition flex items-center gap-1.5 ${
                          rx.refillsLeft > 0
                            ? 'bg-teal-600 hover:bg-teal-700 text-white shadow-xs'
                            : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>{rx.refillsLeft > 0 ? 'Request Refill' : 'Renew Rx'}</span>
                      </button>
                    </div>
                  </div>
                ))
              )}

              {activeTab === 'pending' && (
                <div className="border border-amber-200 bg-amber-50/50 rounded-xl p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-slate-900">Hydrochlorothiazide 25mg</h3>
                    <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-amber-100 text-amber-800">
                      Under Clinical Review
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">Tablet • 1 tablet daily for blood pressure regulation</p>
                  <p className="text-xs text-slate-500">
                    Requested by Dr. Sarah Jenkins on Sep 14, 2026. Awaiting final pharmacy stock verification.
                  </p>
                </div>
              )}

              {activeTab === 'expired' && (
                <div className="border border-slate-200 rounded-xl p-5 text-xs text-slate-500 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-700">Azithromycin 250mg (Z-Pak)</h3>
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600">Expired March 2025</span>
                  </div>
                  <p>Course of 5 days completed. Prescriber: Dr. Mark Sloan.</p>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Right Column: Preferred Pharmacy & Tracking (1/3 Width) */}
        <div className="space-y-6">
          
          {/* Preferred Pharmacy Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-teal-600" />
                <span>Preferred Pharmacy</span>
              </h3>
              <button
                onClick={() => setShowChangePharmacyModal(true)}
                className="text-xs font-semibold text-teal-700 hover:text-teal-800 bg-teal-50 px-2.5 py-1 rounded-md transition"
              >
                Change
              </button>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-lg p-4 space-y-2 text-xs">
              <div className="font-bold text-slate-900 text-sm">{pharmacy.name}</div>
              <div className="flex items-start gap-2 text-slate-600">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span>{pharmacy.address}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{pharmacy.phone}</span>
              </div>
              <div className="pt-2 text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>E-Prescribing Enabled (NPI Verified)</span>
              </div>
            </div>
          </div>

          {/* Active Refill Status Widget with Timeline from Wireframe */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
            <div className="mb-3 pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Recent Refill Status</h3>
              <div className="flex items-center justify-between text-xs mt-1">
                <span className="font-semibold text-slate-800">Order #RX-2026-88</span>
                <span className="text-teal-700 font-medium">Amoxicillin 500mg (Qty: 30)</span>
              </div>
            </div>

            {/* Vertical Timeline from Wireframe */}
            <div className="relative pl-6 space-y-4 pt-2 before:absolute before:left-2 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
              {refillTimeline.map((step) => (
                <div key={step.id} className="relative text-xs">
                  <div
                    className={`absolute -left-6 top-0.5 w-3.5 h-3.5 rounded-full border-2 border-white shadow-xs ${
                      step.completed ? 'bg-teal-600' : 'bg-slate-300'
                    }`}
                  />
                  <div className={`font-semibold ${step.completed ? 'text-slate-900' : 'text-slate-500'}`}>
                    {step.title}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{step.time}</div>
                </div>
              ))}
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">Pick-up counter alert:</span>
              <button
                onClick={() => triggerToast("SMS & Push Notifications enabled for order ready alert.")}
                className="text-teal-700 font-semibold hover:underline"
              >
                Enable SMS Alert
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Change Pharmacy Modal */}
      {showChangePharmacyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full p-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <h3 className="text-base font-bold text-slate-900">Select Designated Pharmacy</h3>
              <button onClick={() => setShowChangePharmacyModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {[
                { name: 'CVS Pharmacy #4821', address: '123 Main Street, Suite B, Springfield', phone: '(555) 019-2834' },
                { name: 'Walgreens Pharmacy #104', address: '450 West Broad Ave, Springfield', phone: '(555) 019-9941' },
                { name: 'CarePulse In-Hospital Dispensary', address: 'Central Hospital Ground Floor Room 102', phone: '(555) 019-4000' },
              ].map((p) => (
                <div
                  key={p.name}
                  onClick={() => {
                    setPharmacy(p);
                    setShowChangePharmacyModal(false);
                    triggerToast(`Default delivery pharmacy updated to ${p.name}`);
                  }}
                  className={`p-3.5 border rounded-lg cursor-pointer transition flex items-center justify-between ${
                    pharmacy.name === p.name ? 'border-teal-500 bg-teal-50' : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <div className="font-bold text-slate-900">{p.name}</div>
                    <div className="text-slate-500">{p.address}</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Request New Prescription Modal */}
      {showNewRxModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <h3 className="text-base font-bold text-slate-900">Request New Prescription Refill</h3>
              <button onClick={() => setShowNewRxModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setShowNewRxModal(false);
                triggerToast("Medication request submitted to Dr. Sarah Jenkins for electronic sign-off.");
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Medication Name or Rx Number</label>
                <input
                  type="text"
                  placeholder="e.g. Albuterol HFA or Rx #984021"
                  required
                  className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Prescribing Doctor</label>
                <select className="w-full p-2.5 border rounded-lg bg-white outline-none focus:ring-2 focus:ring-teal-600">
                  <option>Dr. Sarah Jenkins (Cardiology)</option>
                  <option>Dr. Mark Sloan (Pulmonology)</option>
                  <option>Dr. Robert Chen (Internal Medicine)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Clinical Justification / Symptoms</label>
                <textarea
                  rows={2}
                  placeholder="Describe reasons for continuation or dosage renewal..."
                  className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-teal-600 resize-none"
                />
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewRxModal(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg"
                >
                  Submit to Care Team
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
