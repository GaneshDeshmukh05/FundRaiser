import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Gift, User, Mail, Calendar, DollarSign, FileText, Tag, Loader2, ArrowRight } from 'lucide-react';
import { createFundraiser } from '../api';
import toast from 'react-hot-toast';

const OCCASIONS = ['Birthday', 'Farewell', 'Wedding', 'Anniversary', 'Graduation', 'Baby Shower', 'Retirement', 'Other'];

const OCCASION_EMOJIS = {
  Birthday: '🎂', Farewell: '👋', Wedding: '💍', Anniversary: '💕',
  Graduation: '🎓', 'Baby Shower': '🍼', Retirement: '🏆', Other: '🎁'
};

export default function CreateFundraiser() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    giftName: '',
    targetAmount: '',
    occasion: '',
    deadline: '',
    description: '',
    organizerName: '',
    organizerEmail: ''
  });

  const today = new Date().toISOString().split('T')[0];

  const update = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.giftName || !form.targetAmount || !form.occasion || !form.deadline || !form.organizerName || !form.organizerEmail) {
      toast.error('Please fill all required fields');
      return;
    }
    if (Number(form.targetAmount) < 1) {
      toast.error('Target amount must be at least ₹1');
      return;
    }
    setLoading(true);
    try {
      const res = await createFundraiser(form);
      const { fundraiserId } = res.data.fundraiser;
      toast.success('Fundraiser created!');
      navigate(`/dashboard/${fundraiserId}`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create fundraiser');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/25">
          <Gift className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Create a Fundraiser</h1>
        <p className="text-slate-500 dark:text-slate-400">Set up your group gift in under a minute.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Gift Details */}
        <div className="card p-6 space-y-5">
          <h2 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Gift className="w-4 h-4 text-primary-500" /> Gift Details
          </h2>

          <div>
            <label className="label">Gift Name *</label>
            <input className="input" placeholder="e.g. iPhone 15 Pro, Weekend Trip to Goa" value={form.giftName} onChange={update('giftName')} />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Target Amount (₹) *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">₹</span>
                <input className="input pl-8" type="number" min={1} placeholder="5000" value={form.targetAmount} onChange={update('targetAmount')} />
              </div>
            </div>
            <div>
              <label className="label">Occasion *</label>
              <select className="input" value={form.occasion} onChange={update('occasion')}>
                <option value="">Select occasion</option>
                {OCCASIONS.map(o => (
                  <option key={o} value={o}>{OCCASION_EMOJIS[o]} {o}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="label">Deadline *</label>
            <input className="input" type="date" min={today} value={form.deadline} onChange={update('deadline')} />
          </div>

          <div>
            <label className="label">Description <span className="text-slate-400 font-normal">(optional)</span></label>
            <textarea
              className="input resize-none"
              rows={3}
              placeholder="Tell contributors why this gift is special..."
              value={form.description}
              onChange={update('description')}
            />
          </div>
        </div>

        {/* Organizer Info */}
        <div className="card p-6 space-y-5">
          <h2 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <User className="w-4 h-4 text-primary-500" /> Organizer Info
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Your Name *</label>
              <input className="input" placeholder="Aditya Kumar" value={form.organizerName} onChange={update('organizerName')} />
            </div>
            <div>
              <label className="label">Your Email *</label>
              <input className="input" type="email" placeholder="you@example.com" value={form.organizerEmail} onChange={update('organizerEmail')} />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800 text-sm text-primary-700 dark:text-primary-300">
            💡 Save the dashboard link after creation — it's your organizer access.
          </div>
        </div>

        <button type="submit" className="btn-primary w-full justify-center text-base py-4" disabled={loading}>
          {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Creating…</> : <>Create Fundraiser <ArrowRight className="w-5 h-5" /></>}
        </button>
      </form>
    </main>
  );
}
