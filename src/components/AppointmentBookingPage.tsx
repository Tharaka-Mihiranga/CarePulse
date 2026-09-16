import React, { useState } from 'react';
import { Calendar, Clock, User, CheckCircle2, ArrowLeft, CreditCard, ShieldCheck, Stethoscope } from 'lucide-react';
import { Appointment, PageId, PaymentIntent } from '../types';

interface AppointmentBookingPageProps {
  onAddAppointment: (appointment: Appointment) => void;
  onNavigate: (page: PageId) => void;
  onSetPaymentIntent: (intent: PaymentIntent) => void;
}

export function AppointmentBookingPage({
  onAddAppointment,
  onNavigate,
  onSetPaymentIntent,
}: AppointmentBookingPageProps) {
  const [service, setService] = useState<'consultation' | 'full-session' | 'specialist'>('consultation');
  const [provider, setProvider] = useState<'dr-jenkins' | 'dr-smith' | 'dr-chen' | 'dr-sloan'>('dr-jenkins');
  const [date, setDate] = useState('2026-10-28');
  const [selectedTime, setSelectedTime] = useState('10:30 AM');
  const [fullName, setFullName] = useState('Eleanor Vance');
  const [email, setEmail] = useState('eleanor.vance@carepulse.org');
  const [phone, setPhone] = useState('(312) 555-0192');
  const [notes, setNotes] = useState('Routine 6-month checkup and respiratory assessment.');
  const [isSuccess, setIsSuccess] = useState(false);

  const timeSlots = ['09:00 AM', '10:30 AM', '01:00 PM', '02:30 PM', '04:00 PM'];

  const serviceFees = {
    consultation: 50.00,
    'full-session': 120.00,
    specialist: 150.00,
  };

  const providerNames: Record<string, { name: string; specialty: string }> = {
    'dr-jenkins': { name: 'Dr. Sarah Jenkins', specialty: 'Cardiologist' },
    'dr-smith': { name: 'Dr. Sarah Smith', specialty: 'General Practice' },
    'dr-chen': { name: 'Dr. Robert Chen', specialty: 'Internal Medicine' },
    'dr-sloan': { name: 'Dr. Mark Sloan', specialty: 'Pulmonology' },
  };

  const fee = serviceFees[service] || 50.00;

  const handleBookingSubmit = (payOnline: boolean) => {
    const selectedProvider = providerNames[provider] || { name: 'Dr. Sarah Jenkins', specialty: 'Cardiology' };
    
    // Format friendly date
    const dateObj = new Date(date + 'T00:00:00');
    const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    const newApt: Appointment = {
      id: `apt-${Date.now()}`,
      doctorName: selectedProvider.name,
      specialty: selectedProvider.specialty,
      date: formattedDate,
      time: selectedTime,
      serviceType: service === 'consultation' ? 'Consultation (30 mins)' : 'Full Session (60 mins)',
      status: 'Upcoming',
      fee,
    };

    onAddAppointment(newApt);

    if (payOnline) {
      onSetPaymentIntent({
        itemTitle: `Appointment Fee: ${selectedProvider.name}`,
        category: 'appointment',
        amount: fee,
        tax: 0,
        relatedId: newApt.id,
      });
      onNavigate('payment');
    } else {
      setIsSuccess(true);
      setTimeout(() => {
        onNavigate('patient-dashboard');
      }, 1500);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Top Header & Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate('patient-dashboard')}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>
        <span className="text-xs font-semibold px-2.5 py-1 bg-slate-200 text-slate-700 rounded-md">
          Wireframe 02 — Appointment Scheduling
        </span>
      </div>

      {/* Main Container styled with wireframe dashed aesthetic / modern touch */}
      <div className="bg-white border-2 border-slate-300 rounded-2xl p-6 sm:p-10 shadow-sm">
        
        {/* Header Banner */}
        <div className="text-center border-b-2 border-slate-200 pb-6 mb-8">
          <div className="inline-flex p-3 bg-slate-100 rounded-full text-slate-700 mb-3">
            <Calendar className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Book an Appointment</h1>
          <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
            Schedule an in-person or telemedicine consultation with our certified medical staff.
          </p>
        </div>

        {isSuccess ? (
          <div className="text-center py-12 space-y-4 animate-in fade-in duration-300">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Appointment Confirmed!</h2>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              Your appointment with {providerNames[provider]?.name} for {selectedTime} has been registered to your Patient Portal.
            </p>
            <p className="text-xs text-slate-400">Redirecting to Dashboard...</p>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleBookingSubmit(false);
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Left Column: Service, Date & Time Selection */}
              <div className="space-y-6">
                
                {/* Step 1: Select Service */}
                <div className="border border-slate-200 p-5 rounded-xl bg-[#fafafa]">
                  <div className="text-sm font-bold text-slate-800 mb-4 pb-2 border-b border-slate-200 flex items-center justify-between">
                    <span>1. Select Service & Provider</span>
                    <Stethoscope className="w-4 h-4 text-slate-400" />
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label htmlFor="service-select" className="block text-xs font-semibold text-slate-600 mb-1.5">
                        Service Type
                      </label>
                      <select
                        id="service-select"
                        value={service}
                        onChange={(e) => setService(e.target.value as any)}
                        className="w-full p-2.5 text-sm border border-slate-300 rounded-lg bg-white text-slate-800 focus:ring-2 focus:ring-slate-800 outline-none"
                      >
                        <option value="consultation">Consultation (30 mins) — $50.00</option>
                        <option value="full-session">Full Session (60 mins) — $120.00</option>
                        <option value="specialist">Specialist Review (45 mins) — $150.00</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="provider-select" className="block text-xs font-semibold text-slate-600 mb-1.5">
                        Select Provider
                      </label>
                      <select
                        id="provider-select"
                        value={provider}
                        onChange={(e) => setProvider(e.target.value as any)}
                        className="w-full p-2.5 text-sm border border-slate-300 rounded-lg bg-white text-slate-800 focus:ring-2 focus:ring-slate-800 outline-none"
                      >
                        <option value="dr-jenkins">Dr. Sarah Jenkins (Cardiology)</option>
                        <option value="dr-smith">Dr. Sarah Smith (General Practice)</option>
                        <option value="dr-chen">Dr. Robert Chen (Internal Medicine)</option>
                        <option value="dr-sloan">Dr. Mark Sloan (Pulmonology)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Step 2: Date & Time */}
                <div className="border border-slate-200 p-5 rounded-xl bg-[#fafafa]">
                  <div className="text-sm font-bold text-slate-800 mb-4 pb-2 border-b border-slate-200 flex items-center justify-between">
                    <span>2. Select Date & Time</span>
                    <Clock className="w-4 h-4 text-slate-400" />
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label htmlFor="booking-date" className="block text-xs font-semibold text-slate-600 mb-1.5">
                        Consultation Date
                      </label>
                      <input
                        type="date"
                        id="booking-date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full p-2.5 text-sm border border-slate-300 rounded-lg bg-white text-slate-800 focus:ring-2 focus:ring-slate-800 outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-2">
                        Available Time Slots
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {timeSlots.map((slot) => {
                          const isSelected = selectedTime === slot;
                          return (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => setSelectedTime(slot)}
                              className={`py-2 px-1 text-center rounded-lg text-xs font-semibold transition border ${
                                isSelected
                                  ? 'bg-[#333333] text-white border-[#333333] shadow-xs'
                                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                              }`}
                            >
                              {slot}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column: User Info & Summary */}
              <div className="space-y-6">
                
                {/* Step 3: Contact Info */}
                <div className="border border-slate-200 p-5 rounded-xl bg-[#fafafa]">
                  <div className="text-sm font-bold text-slate-800 mb-4 pb-2 border-b border-slate-200 flex items-center justify-between">
                    <span>3. Your Information</span>
                    <User className="w-4 h-4 text-slate-400" />
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label htmlFor="full-name" className="block text-xs font-semibold text-slate-600 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="full-name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. John Doe"
                        className="w-full p-2.5 text-sm border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-slate-800 outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="contact-email" className="block text-xs font-semibold text-slate-600 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="contact-email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. john@example.com"
                        className="w-full p-2.5 text-sm border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-slate-800 outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="contact-phone" className="block text-xs font-semibold text-slate-600 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="contact-phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="(123) 456-7890"
                        className="w-full p-2.5 text-sm border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-slate-800 outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="booking-notes" className="block text-xs font-semibold text-slate-600 mb-1">
                        Additional Notes / Symptoms
                      </label>
                      <textarea
                        id="booking-notes"
                        rows={2}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Add any specific symptoms or concerns..."
                        className="w-full p-2.5 text-sm border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-slate-800 outline-none resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Booking Summary Box from Wireframe */}
                <div className="border border-slate-300 p-5 rounded-xl bg-slate-100">
                  <div className="text-sm font-bold text-slate-800 mb-3 pb-2 border-b border-slate-200">
                    Booking Summary
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Service:</span>
                      <strong className="text-slate-900 capitalize">{service.replace('-', ' ')}</strong>
                    </div>

                    <div className="flex justify-between text-slate-600">
                      <span>Provider:</span>
                      <strong className="text-slate-900">{providerNames[provider]?.name}</strong>
                    </div>

                    <div className="flex justify-between text-slate-600">
                      <span>Date & Time:</span>
                      <strong className="text-slate-900">{date} at {selectedTime}</strong>
                    </div>

                    <div className="border-t border-slate-300 pt-3 mt-3 flex justify-between text-sm">
                      <span className="font-bold text-slate-800">Total Fee:</span>
                      <strong className="text-base text-slate-900">${fee.toFixed(2)}</strong>
                    </div>
                  </div>

                  {/* Dual Action Buttons Connecting Booking -> Payment / Dashboard */}
                  <div className="mt-5 space-y-2">
                    <button
                      type="button"
                      onClick={() => handleBookingSubmit(true)}
                      className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-sm shadow-xs transition flex items-center justify-center gap-2"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Confirm & Pay Now (${fee.toFixed(2)})</span>
                    </button>

                    <button
                      type="submit"
                      className="w-full py-2.5 px-4 bg-[#333333] hover:bg-slate-700 text-white font-semibold rounded-lg text-xs transition"
                    >
                      Confirm (Pay Later / At Clinic)
                    </button>
                  </div>

                  <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Free cancellation up to 24h before appointment</span>
                  </div>
                </div>

              </div>

            </div>
          </form>
        )}

      </div>
    </div>
  );
}
