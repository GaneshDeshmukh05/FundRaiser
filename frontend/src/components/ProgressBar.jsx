import { useEffect, useState } from 'react';

export default function ProgressBar({ current, target }) {
  const [animated, setAnimated] = useState(false);
  const percentage = Math.min(Math.round((current / target) * 100), 100);
  const isGoalReached = percentage >= 100;

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-2">
      <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden ${
            isGoalReached
              ? 'bg-gradient-to-r from-emerald-400 to-emerald-500'
              : 'bg-gradient-to-r from-primary-500 to-accent-500'
          }`}
          style={{ width: animated ? `${percentage}%` : '0%' }}
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full animate-[shimmer_2s_ease-in-out_infinite]" />
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-1.5">
          <span className={`font-bold text-base ${isGoalReached ? 'text-emerald-600 dark:text-emerald-400' : 'text-primary-600 dark:text-primary-400'}`}>
            ₹{current.toLocaleString('en-IN')}
          </span>
          <span className="text-slate-400 dark:text-slate-500">raised</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`font-bold px-2 py-0.5 rounded-full text-xs ${
            isGoalReached
              ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
              : 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
          }`}>
            {percentage}%
          </span>
          <span className="text-slate-500 dark:text-slate-400">
            of ₹{target.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {isGoalReached && (
        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-sm font-semibold animate-slide-up">
          <span>🎉</span> Goal reached! Amazing work!
        </div>
      )}
    </div>
  );
}
