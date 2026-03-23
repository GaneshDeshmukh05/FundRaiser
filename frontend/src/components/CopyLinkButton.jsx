import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CopyLinkButton({ fundraiserId }) {
  const [copied, setCopied] = useState(false);
  const shareUrl = `${window.location.origin}/f/${fundraiserId}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Share link copied!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy link');
    }
  };

  return (
    <div className="flex items-center gap-2 p-1 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
      <span className="flex-1 px-3 text-sm text-slate-600 dark:text-slate-400 truncate font-mono">
        {shareUrl}
      </span>
      <button
        onClick={handleCopy}
        className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
          copied
            ? 'bg-emerald-500 text-white'
            : 'bg-primary-600 hover:bg-primary-700 text-white'
        }`}
      >
        {copied ? (
          <><Check className="w-3.5 h-3.5" /> Copied!</>
        ) : (
          <><Copy className="w-3.5 h-3.5" /> Copy Link</>
        )}
      </button>
    </div>
  );
}
