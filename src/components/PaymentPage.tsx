import React, { useState } from 'react';
import { 
  CreditCard, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  ArrowLeft, 
  Sparkles, 
  Building, 
  Check, 
  HelpCircle,
  Receipt
} from 'lucide-react';
import { PageId, PaymentIntent, Transaction } from '../types';

interface PaymentPageProps {
  paymentIntent: PaymentIntent | null;
  onAddTransaction: (transaction: Transaction) => void;
  onNavigate: (page: PageId) => void;
}

export function PaymentPage({
  paymentIntent,
  onAddTransaction,
  onNavigate,
}: PaymentPageProps) {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'bank'>('card');
  const [cardName, setCardName] = useState('Alex Morgan');
  const [cardNumber, setCardNumber] = useState('4532 8920 1198 4242');
  const [expDate, setExpDate] = useState('08/28');
  const [cvc, setCvc] = useState('883');
  const [saveCard, setSaveCard] = useState(true);

  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);

  const [isProcessing, setIsProcessing] = useState(false);
  const [receipt, setReceipt] = useState<Transaction | null>(null);

  // Dynamic order items or intent
  const currentItem = paymentIntent || {
    itemTitle: 'Pro Membership Plan (Annual)',
    category: 'membership',
    amount: 120.00,
    tax: 9.00,
  };

  const subtotal = currentItem.amount;
  const tax = currentItem.tax || (subtotal * 0.075);
  const totalDue = Math.max(0, subtotal + tax - discount);

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'CARE10' || promoCode.trim().toUpperCase() === 'HEALTH10') {
      setDiscount(subtotal * 0.1);
      setPromoApplied(true);
    } else if (promoCode.trim()) {
      alert("Invalid promo code. Try 'CARE10' for 10% off.");
    }
  };

  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      const newTx: Transaction = {
        id: `tx-${Math.floor(1000 + Math.random() * 9000)}`,
        user: cardName,
        date: 'Today, ' + new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        amount: totalDue,
        status: 'Completed',
        description: currentItem.itemTitle,
        method: paymentMethod === 'card' ? `Credit Card (••• ${cardNumber.slice(-4)})` : paymentMethod.toUpperCase(),
      };

      onAddTransaction(newTx);
      setReceipt(newTx);
    }, 1200);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Top Header & Navigation Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate('patient-dashboard')}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5" />
            256-Bit SSL Encrypted
          </span>
          <span className="text-xs font-semibold px-2.5 py-1 bg-slate-200 text-slate-700 rounded-md">
            Wireframe 05 — Checkout Express
          </span>
        </div>
      </div>

      {/* Main Payment Container (2 Columns from Wireframe) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Payment Details (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          
          <div>
            <h2 className="text-xl font-bold text-slate-900">Select Payment Method</h2>
            <p className="text-xs text-slate-500 mt-0.5">Choose your preferred billing channel for clinical settlement.</p>
          </div>

          {/* Payment Method Selectors from Wireframe */}
          <div className="grid grid-cols-3 gap-3">
            <label
              onClick={() => setPaymentMethod('card')}
              className={`border-2 rounded-xl p-3 text-center cursor-pointer transition flex flex-col items-center justify-center gap-1 ${
                paymentMethod === 'card'
                  ? 'border-blue-600 bg-blue-50/50 text-blue-900'
                  : 'border-slate-200 hover:border-slate-300 text-slate-700'
              }`}
            >
              <input type="radio" name="method" checked={paymentMethod === 'card'} readOnly className="hidden" />
              <span className="text-xl">💳</span>
              <span className="text-xs font-semibold">Credit Card</span>
            </label>

            <label
              onClick={() => setPaymentMethod('paypal')}
              className={`border-2 rounded-xl p-3 text-center cursor-pointer transition flex flex-col items-center justify-center gap-1 ${
                paymentMethod === 'paypal'
                  ? 'border-blue-600 bg-blue-50/50 text-blue-900'
                  : 'border-slate-200 hover:border-slate-300 text-slate-700'
              }`}
            >
              <input type="radio" name="method" checked={paymentMethod === 'paypal'} readOnly className="hidden" />
              <span className="text-xl">🅿️</span>
              <span className="text-xs font-semibold">PayPal</span>
            </label>

            <label
              onClick={() => setPaymentMethod('bank')}
              className={`border-2 rounded-xl p-3 text-center cursor-pointer transition flex flex-col items-center justify-center gap-1 ${
                paymentMethod === 'bank'
                  ? 'border-blue-600 bg-blue-50/50 text-blue-900'
                  : 'border-slate-200 hover:border-slate-300 text-slate-700'
              }`}
            >
              <input type="radio" name="method" checked={paymentMethod === 'bank'} readOnly className="hidden" />
              <span className="text-xl">🏛️</span>
              <span className="text-xs font-semibold">Bank ACH</span>
            </label>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmitPayment} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Cardholder Name</label>
              <input
                type="text"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                placeholder="e.g. Alex Morgan"
                className="w-full p-2.5 text-sm border border-slate-300 rounded-lg bg-[#f9fafb] focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Card Number</label>
              <div className="relative">
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="1234 •••• •••• 5678"
                  maxLength={19}
                  className="w-full p-2.5 text-sm border border-slate-300 rounded-lg bg-[#f9fafb] focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none font-mono"
                  required
                />
                <div className="absolute right-3 top-2.5 flex items-center gap-1 text-slate-400">
                  <CreditCard className="w-5 h-5 text-slate-500" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Expiration Date</label>
                <input
                  type="text"
                  value={expDate}
                  onChange={(e) => setExpDate(e.target.value)}
                  placeholder="MM / YY"
                  maxLength={5}
                  className="w-full p-2.5 text-sm border border-slate-300 rounded-lg bg-[#f9fafb] focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">CVC / CVV</label>
                <input
                  type="password"
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value)}
                  placeholder="123"
                  maxLength={4}
                  className="w-full p-2.5 text-sm border border-slate-300 rounded-lg bg-[#f9fafb] focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none font-mono"
                  required
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1 text-xs text-slate-600">
              <input
                type="checkbox"
                id="save-card-check"
                checked={saveCard}
                onChange={(e) => setSaveCard(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
              />
              <label htmlFor="save-card-check" className="cursor-pointer">
                Save card details securely for future clinical visits
              </label>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full mt-4 py-3.5 px-4 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold rounded-xl shadow-sm transition flex items-center justify-center gap-2 text-sm disabled:opacity-75"
            >
              {isProcessing ? (
                <span>Processing Secure Transaction...</span>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Pay ${totalDue.toFixed(2)}</span>
                </>
              )}
            </button>
          </form>

        </div>

        {/* Right Column: Order Summary (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
              Order Summary
            </h3>

            {/* Item details */}
            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-start text-slate-700">
                <span className="font-semibold text-slate-900">{currentItem.itemTitle}</span>
                <span className="font-bold text-slate-900">${subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-slate-500">
                <span>Hospital Facility Fee / Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Promo Discount (10% Off)</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}

              <div className="border-t border-slate-200 pt-3 flex justify-between text-base font-bold text-slate-900">
                <span>Total Due</span>
                <span className="text-blue-600">${totalDue.toFixed(2)}</span>
              </div>
            </div>

            {/* Promo Code input */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <label className="block text-[11px] font-semibold text-slate-600">Have a promotional or insurance code?</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. CARE10"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 p-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-600 uppercase"
                />
                <button
                  type="button"
                  onClick={handleApplyPromo}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition"
                >
                  Apply
                </button>
              </div>
              {promoApplied && (
                <div className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>Promo code CARE10 applied successfully!</span>
                </div>
              )}
            </div>

            {/* Quick demo bill preset switcher */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Test Other Clinical Invoices:
              </span>
              <div className="flex flex-wrap gap-2 text-[11px]">
                <button
                  type="button"
                  onClick={() => onNavigate('appointment-booking')}
                  className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 hover:bg-slate-200"
                >
                  Doctor Consultation ($50.00)
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('prescriptions')}
                  className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 hover:bg-slate-200"
                >
                  Prescription Copay ($15.00)
                </button>
              </div>
            </div>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-start gap-2.5">
            <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Automated HSA & FSA Eligible:</span> This transaction produces an itemized CMS-1500 compliant clinical receipt suitable for reimbursement.
            </div>
          </div>
        </div>

      </div>

      {/* Confirmation / Receipt Modal */}
      {receipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-8 animate-in zoom-in-95 text-center space-y-5">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900">Payment Successful!</h3>
              <p className="text-xs text-slate-500 mt-1">
                Your clinical charge has been processed and logged to hospital accounts.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-2 text-left">
              <div className="flex justify-between">
                <span className="text-slate-500">Transaction Ref:</span>
                <span className="font-mono font-bold text-slate-800">{receipt.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Billing Item:</span>
                <span className="font-medium text-slate-800">{receipt.description}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Method:</span>
                <span className="text-slate-800">{receipt.method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Date & Timestamp:</span>
                <span className="text-slate-800">{receipt.date}</span>
              </div>
              <div className="border-t border-slate-200 pt-2 flex justify-between font-bold text-slate-900 text-sm">
                <span>Amount Paid:</span>
                <span className="text-emerald-700">${receipt.amount.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={() => {
                  setReceipt(null);
                  onNavigate('patient-dashboard');
                }}
                className="w-full py-2.5 px-4 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold rounded-lg text-xs transition"
              >
                Return to Patient Dashboard
              </button>
              <button
                onClick={() => {
                  setReceipt(null);
                  onNavigate('admin-dashboard');
                }}
                className="w-full py-2 px-4 border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium rounded-lg text-xs transition"
              >
                View in ⚡ AdminCore Transactions
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer from Wireframe */}
      <footer className="text-center py-6 text-xs text-slate-500 border-t border-slate-200 space-y-1">
        <p>
          Need help? Contact <a href="#" className="text-blue-600 hover:underline">Hospital Billing Support</a> (800-555-PAY)
        </p>
        <p className="text-slate-400">CarePulse Health System Terms of Service • HIPAA Privacy Policy</p>
      </footer>
    </div>
  );
}
