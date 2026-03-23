import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { CheckCircle2, ArrowLeft, Share2, ExternalLink } from 'lucide-react';
import Confetti from 'react-confetti';

export default function ThankYou() {
  const { state } = useLocation();
  const navigate = useNavigate();

  // Redirect if accessed directly with no state
  useEffect(() => {
    if (!state?.fundraiserId) {
      navigate('/');
    }
  }, [state, navigate]);

  if (!state?.fundraiserId) return null;

  const { fundraiserId, name, amount, giftName } = state;

  const handleShare = async () => {
    const url = `${window.location.origin}/f/${fundraiserId}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Group Gift Fundraiser', url });
      } catch {}
    } else {
      await navigator.clipboard.writeText(url);
    }
  };

  return (
    <main className="min-h-[80vh] flex items-center justify-center px-4">
      <Confetti recycle={false} numberOfPieces={300} initialVelocityY={10} />
      <div className="max-w-md w-full text-center animate-slide-up">
        {/* Success icon */}
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-2xl shadow-emerald-500/30">
          <CheckCircle2 className="w-12 h-12 text-white" />
        </div>

        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-3">
          Thank You! 🎉
        </h1>

        <p className="text-xl text-slate-600 dark:text-slate-400 mb-2">
          <span className="font-semibold text-slate-900 dark:text-white">{name || 'You'}</span> contributed{' '}
          <span className="font-bold text-emerald-600 dark:text-emerald-400">₹{Number(amount).toLocaleString('en-IN')}</span>
        </p>

        <p className="text-slate-500 dark:text-slate-400 mb-8">
          towards <span className="font-medium text-slate-700 dark:text-slate-300">{giftName}</span>.<br />
          Every rupee brings us closer to the perfect gift! 🎁
        </p>

        {/* Cards */}
        <div className="card p-6 mb-6 text-left space-y-3">
          <h3 className="font-semibold text-slate-900 dark:text-white">What happens next?</h3>
          {[
            'Your contribution has been recorded.',
            'The organizer will confirm receipt if you paid cash.',
            'Progress is updated in real-time for everyone.',
            'Once the goal is reached — gift time! 🎊'
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-emerald-600 dark:text-emerald-400 text-xs font-bold">{i + 1}</span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">{step}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link to={`/f/${fundraiserId}`} className="btn-secondary flex-1 justify-center">
            <ExternalLink className="w-4 h-4" /> View Fundraiser
          </Link>
          <button onClick={handleShare} className="btn-primary flex-1 justify-center">
            <Share2 className="w-4 h-4" /> Share with Friends
          </button>
        </div>

        <Link to="/" className="inline-flex items-center gap-1 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 text-sm mt-6 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
        </Link>
      </div>
    </main>
  );
}
