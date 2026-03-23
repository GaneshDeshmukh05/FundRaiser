import { formatDistanceToNow } from '../utils/formatDate';
import { User, MessageCircle, CheckCircle2, Clock, Trash2 } from 'lucide-react';

const METHOD_LABELS = { upi: 'UPI', card: 'Card', cash: 'Cash' };
const METHOD_COLORS = {
  upi: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
  card: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
  cash: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
};

export default function ContributionList({ contributions, isOrganizer, onConfirm, onDelete }) {
  if (!contributions || contributions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
          <User className="w-8 h-8 text-slate-400" />
        </div>
        <p className="text-slate-500 dark:text-slate-400 font-medium">No contributions yet</p>
        <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">Be the first to contribute!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {contributions.map((c) => (
        <div
          key={c._id}
          className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50 hover:border-slate-200 dark:hover:border-slate-600 transition-all duration-200 animate-slide-up"
        >
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center flex-shrink-0 shadow-sm">
            <span className="text-white font-bold text-sm">
              {(c.name || 'A')[0].toUpperCase()}
            </span>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-slate-900 dark:text-white">{c.name || 'Anonymous'}</span>
              <span className={`badge ${METHOD_COLORS[c.paymentMethod]}`}>
                {METHOD_LABELS[c.paymentMethod]}
              </span>
              {c.confirmed ? (
                <span className="badge bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
                  <CheckCircle2 className="w-3 h-3" /> Confirmed
                </span>
              ) : (
                <span className="badge bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
                  <Clock className="w-3 h-3" /> Pending
                </span>
              )}
            </div>

            {c.message && (
              <div className="flex items-start gap-1.5 mt-1.5">
                <MessageCircle className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-slate-600 dark:text-slate-400 italic">&quot;{c.message}&quot;</p>
              </div>
            )}

            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              {formatDistanceToNow(c.createdAt)}
            </p>
          </div>

          {/* Amount */}
          <div className="text-right flex-shrink-0">
            <p className="font-bold text-lg text-slate-900 dark:text-white">
              ₹{c.amount.toLocaleString('en-IN')}
            </p>
            {isOrganizer && (
              <div className="flex items-center gap-1 mt-1 justify-end">
                {!c.confirmed && (
                  <button
                    onClick={() => onConfirm(c._id)}
                    className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
                  >
                    Confirm
                  </button>
                )}
                <button
                  onClick={() => onDelete(c._id)}
                  className="text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
