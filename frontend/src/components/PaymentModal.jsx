import { useState } from 'react';
import { X, Smartphone, CreditCard, Banknote, Loader2, CheckCircle2 } from 'lucide-react';
import { addContribution } from '../api';
import toast from 'react-hot-toast';

const METHODS = [
  { id: 'upi', label: 'UPI', icon: Smartphone, desc: 'Pay via UPI ID or QR code', color: 'from-purple-500 to-violet-600' },
  { id: 'card', label: 'Card', icon: CreditCard, desc: 'Debit / Credit card', color: 'from-blue-500 to-indigo-600' },
  { id: 'cash', label: 'Cash', icon: Banknote, desc: 'Organizer confirms on receipt', color: 'from-amber-500 to-orange-600' },
];

export default function PaymentModal({ fundraiserId, contributorData, onClose, onSuccess }) {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState('method'); // method | confirm | success

  // UPI details
  const [upiId, setUpiId] = useState('');
  // Card details
  const [cardNum, setCardNum] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  const handleProceed = () => {
    if (!selectedMethod) return;
    setStep('confirm');
  };

  const handlePay = async () => {
    setProcessing(true);
    // Simulate network delay
    await new Promise(r => setTimeout(r, 1500));
    try {
      const res = await addContribution({
        fundraiserId,
        name: contributorData.name,
        amount: contributorData.amount,
        message: contributorData.message,
        paymentMethod: selectedMethod
      });
      setStep('success');
      setTimeout(() => {
        onSuccess(res.data.contribution);
      }, 1200);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Payment failed. Try again.');
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="card w-full max-w-md p-6 relative animate-slide-up">
        {/* Close */}
        {step !== 'success' && (
          <button onClick={onClose} className="absolute right-4 top-4 w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
            <X className="w-4 h-4 text-slate-500" />
          </button>
        )}

        {/* Summary */}
        <div className="mb-5 pr-8">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Complete Payment</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
            {contributorData.name || 'Anonymous'} · ₹{Number(contributorData.amount).toLocaleString('en-IN')}
          </p>
        </div>

        {/* Step: Choose payment method */}
        {step === 'method' && (
          <div className="space-y-3">
            {METHODS.map(m => (
              <button
                key={m.id}
                onClick={() => setSelectedMethod(m.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 ${
                  selectedMethod === m.id
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-slate-100 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600 bg-white dark:bg-slate-800/50'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${m.color} flex items-center justify-center flex-shrink-0`}>
                  <m.icon className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-slate-900 dark:text-white">{m.label}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{m.desc}</p>
                </div>
                {selectedMethod === m.id && (
                  <CheckCircle2 className="w-5 h-5 text-primary-500 ml-auto" />
                )}
              </button>
            ))}
            <button onClick={handleProceed} disabled={!selectedMethod} className="btn-primary w-full mt-2 justify-center">
              Continue
            </button>
          </div>
        )}

        {/* Step: Confirm payment details */}
        {step === 'confirm' && (
          <div className="space-y-4">
            {selectedMethod === 'upi' && (
              <div>
                <label className="label">UPI ID</label>
                <input className="input" placeholder="yourname@upi" value={upiId} onChange={e => setUpiId(e.target.value)} />
                <p className="text-xs text-slate-400 mt-1.5">Mock – no real payment processed</p>
              </div>
            )}
            {selectedMethod === 'card' && (
              <div className="space-y-3">
                <div>
                  <label className="label">Card Number</label>
                  <input className="input font-mono" placeholder="4242 4242 4242 4242" maxLength={19}
                    value={cardNum}
                    onChange={e => setCardNum(e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim())}
                  />
                </div>
                <div>
                  <label className="label">Name on Card</label>
                  <input className="input" placeholder="John Doe" value={cardName} onChange={e => setCardName(e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label">Expiry</label>
                    <input className="input" placeholder="MM/YY" maxLength={5} value={cardExpiry} onChange={e => setCardExpiry(e.target.value)} />
                  </div>
                  <div>
                    <label className="label">CVV</label>
                    <input className="input" placeholder="•••" maxLength={4} type="password" value={cardCvv} onChange={e => setCardCvv(e.target.value)} />
                  </div>
                </div>
                <p className="text-xs text-slate-400">Mock – no real payment processed</p>
              </div>
            )}
            {selectedMethod === 'cash' && (
              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                <p className="text-sm text-amber-700 dark:text-amber-400 font-medium">Cash Payment</p>
                <p className="text-xs text-amber-600 dark:text-amber-500 mt-1">
                  Hand ₹{Number(contributorData.amount).toLocaleString('en-IN')} to the organizer. They will confirm your payment.
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={() => setStep('method')} className="btn-secondary flex-1 justify-center" disabled={processing}>
                Back
              </button>
              <button onClick={handlePay} className="btn-primary flex-1 justify-center" disabled={processing}>
                {processing ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing…</> : `Pay ₹${Number(contributorData.amount).toLocaleString('en-IN')}`}
              </button>
            </div>
          </div>
        )}

        {/* Step: Success */}
        {step === 'success' && (
          <div className="text-center py-4 animate-slide-up">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <CheckCircle2 className="w-9 h-9 text-emerald-500" />
            </div>
            <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Payment Recorded!</h4>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Thank you for contributing 🎉</p>
          </div>
        )}
      </div>
    </div>
  );
}
