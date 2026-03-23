import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Users, AlertCircle, Loader2, Heart, Send } from 'lucide-react';
import Confetti from 'react-confetti';
import { getFundraiser, getContributions } from '../api';
import ProgressBar from '../components/ProgressBar';
import ContributionList from '../components/ContributionList';
import PaymentModal from '../components/PaymentModal';
import { formatDate, daysRemaining } from '../utils/formatDate';
import toast from 'react-hot-toast';

const OCCASION_EMOJIS = {
  Birthday: '🎂', Farewell: '👋', Wedding: '💍', Anniversary: '💕',
  Graduation: '🎓', 'Baby Shower': '🍼', Retirement: '🏆', Other: '🎁'
};

export default function FundraiserPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [fundraiser, setFundraiser] = useState(null);
  const [contributions, setContributions] = useState([]);
  const [totalCollected, setTotalCollected] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const [form, setForm] = useState({ name: '', amount: '', message: '' });

  const fetchData = useCallback(async () => {
    try {
      const [fRes, cRes] = await Promise.all([
        getFundraiser(id),
        getContributions(id)
      ]);
      setFundraiser(fRes.data.fundraiser);
      setContributions(cRes.data.contributions);
      setTotalCollected(cRes.data.totalCollected);
    } catch {
      setError('Fundraiser not found or unavailable.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
    // Poll every 10 seconds
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleContribute = (e) => {
    e.preventDefault();
    if (!form.amount || Number(form.amount) < 1) {
      toast.error('Please enter a valid amount');
      return;
    }
    if (fundraiser.status === 'closed') {
      toast.error('This fundraiser is closed');
      return;
    }
    setShowModal(true);
  };

  const handlePaymentSuccess = (contribution) => {
    setShowModal(false);
    setContributions(prev => [contribution, ...prev]);
    if (contribution.confirmed) {
      const newTotal = totalCollected + contribution.amount;
      setTotalCollected(newTotal);
      if (newTotal >= fundraiser.targetAmount && !showConfetti) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 6000);
      }
    }
    navigate('/thankyou', { state: { fundraiserId: id, name: form.name || 'Anonymous', amount: form.amount, giftName: fundraiser.giftName } });
  };

  const days = fundraiser ? daysRemaining(fundraiser.deadline) : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Not Found</h2>
        <p className="text-slate-500">{error}</p>
      </div>
    );
  }

  const isClosed = fundraiser.status === 'closed' || days < 0;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {showConfetti && <Confetti recycle={false} numberOfPieces={400} />}

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Left: Fundraiser info */}
        <div className="lg:col-span-3 space-y-6">
          {/* Header card */}
          <div className="card p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-2xl flex-shrink-0">
                {OCCASION_EMOJIS[fundraiser.occasion] || '🎁'}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="badge bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
                    {fundraiser.occasion}
                  </span>
                  {isClosed && (
                    <span className="badge bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">Closed</span>
                  )}
                </div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{fundraiser.giftName}</h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">by {fundraiser.organizerName}</p>
              </div>
            </div>

            {fundraiser.description && (
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">{fundraiser.description}</p>
            )}

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="text-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                <p className="text-lg font-bold text-slate-900 dark:text-white">₹{fundraiser.targetAmount.toLocaleString('en-IN')}</p>
                <p className="text-xs text-slate-500">Goal</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                <div className="flex items-center justify-center gap-1">
                  <Users className="w-4 h-4 text-primary-500" />
                  <p className="text-lg font-bold text-slate-900 dark:text-white">{contributions.length}</p>
                </div>
                <p className="text-xs text-slate-500">Contributors</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                <div className="flex items-center justify-center gap-1">
                  <Calendar className="w-4 h-4 text-primary-500" />
                  <p className="text-lg font-bold text-slate-900 dark:text-white">
                    {days > 0 ? days : 0}
                  </p>
                </div>
                <p className="text-xs text-slate-500">{days > 1 ? 'Days left' : days === 1 ? 'Day left' : 'Ended'}</p>
              </div>
            </div>

            <ProgressBar current={totalCollected} target={fundraiser.targetAmount} />

            <p className="text-xs text-slate-400 dark:text-slate-500 mt-3 flex items-center gap-1">
              <Calendar className="w-3 h-3" /> Deadline: {formatDate(fundraiser.deadline)}
            </p>
          </div>

          {/* Contributions */}
          <div className="card p-6">
            <h2 className="font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-2">
              <Users className="w-5 h-5 text-primary-500" />
              Contributors <span className="text-slate-400 font-normal text-sm">({contributions.length})</span>
            </h2>
            <ContributionList contributions={contributions} isOrganizer={false} />
          </div>
        </div>

        {/* Right: Contribution form */}
        <div className="lg:col-span-2">
          <div className="sticky top-24">
            <div className="card p-6">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-2">
                <Heart className="w-5 h-5 text-accent-500" />
                Contribute
              </h2>

              {isClosed ? (
                <div className="text-center py-6">
                  <p className="text-slate-500 dark:text-slate-400">This fundraiser is no longer accepting contributions.</p>
                </div>
              ) : (
                <form onSubmit={handleContribute} className="space-y-4">
                  <div>
                    <label className="label">Your Name</label>
                    <input className="input" placeholder="Anonymous" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
                  </div>
                  <div>
                    <label className="label">Amount (₹) *</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">₹</span>
                      <input
                        className="input pl-8"
                        type="number"
                        min={1}
                        placeholder="500"
                        value={form.amount}
                        onChange={e => setForm(p => ({ ...p, amount: e.target.value }))}
                        required
                      />
                    </div>
                    {/* Quick amount buttons */}
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {[100, 250, 500, 1000].map(amt => (
                        <button key={amt} type="button" onClick={() => setForm(p => ({ ...p, amount: String(amt) }))}
                          className={`px-3 py-1 rounded-lg text-sm font-medium border transition-all duration-150 ${form.amount === String(amt) ? 'bg-primary-600 text-white border-primary-600' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-primary-400'}`}>
                          ₹{amt}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="label">Message <span className="text-slate-400 font-normal">(optional)</span></label>
                    <textarea className="input resize-none" rows={2} placeholder="Happy Birthday!" value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} />
                  </div>
                  <button type="submit" className="btn-primary w-full justify-center">
                    <Send className="w-4 h-4" /> Contribute
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showModal && (
        <PaymentModal
          fundraiserId={id}
          contributorData={form}
          onClose={() => setShowModal(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </main>
  );
}
