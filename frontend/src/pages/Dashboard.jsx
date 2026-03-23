import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  LayoutDashboard, Loader2, AlertCircle, Users, TrendingUp, Calendar,
  Download, Lock, Edit, Check, X, Save, ExternalLink
} from 'lucide-react';
import { getFundraiser, getContributions, closeFundraiser, updateFundraiser, confirmContribution, deleteContribution, exportCSV } from '../api';
import ProgressBar from '../components/ProgressBar';
import ContributionList from '../components/ContributionList';
import CopyLinkButton from '../components/CopyLinkButton';
import { formatDate, daysRemaining } from '../utils/formatDate';
import toast from 'react-hot-toast';

const OCCASIONS = ['Birthday', 'Farewell', 'Wedding', 'Anniversary', 'Graduation', 'Baby Shower', 'Retirement', 'Other'];

export default function Dashboard() {
  const { id } = useParams();
  const [fundraiser, setFundraiser] = useState(null);
  const [contributions, setContributions] = useState([]);
  const [totalCollected, setTotalCollected] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [closing, setClosing] = useState(false);

  const recalcTotal = (contribs) => {
    return contribs.filter(c => c.confirmed).reduce((s, c) => s + c.amount, 0);
  };

  const fetchData = useCallback(async () => {
    try {
      const [fRes, cRes] = await Promise.all([getFundraiser(id), getContributions(id)]);
      setFundraiser(fRes.data.fundraiser);
      setContributions(cRes.data.contributions);
      setTotalCollected(cRes.data.totalCollected);
    } catch {
      setError('Dashboard not found.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const startEdit = () => {
    setEditForm({
      giftName: fundraiser.giftName,
      targetAmount: fundraiser.targetAmount,
      occasion: fundraiser.occasion,
      deadline: fundraiser.deadline.split('T')[0],
      description: fundraiser.description
    });
    setEditMode(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await updateFundraiser(id, editForm);
      setFundraiser(res.data.fundraiser);
      setEditMode(false);
      toast.success('Fundraiser updated!');
    } catch {
      toast.error('Failed to update');
    } finally {
      setSaving(false);
    }
  };

  const handleClose = async () => {
    if (!window.confirm('Are you sure you want to close this fundraiser? No new contributions will be accepted.')) return;
    setClosing(true);
    try {
      const res = await closeFundraiser(id);
      setFundraiser(res.data.fundraiser);
      toast.success('Fundraiser closed!');
    } catch {
      toast.error('Failed to close');
    } finally {
      setClosing(false);
    }
  };

  const handleConfirm = async (cId) => {
    try {
      const res = await confirmContribution(cId);
      const updated = contributions.map(c => c._id === cId ? res.data.contribution : c);
      setContributions(updated);
      setTotalCollected(recalcTotal(updated));
      toast.success('Contribution confirmed!');
    } catch {
      toast.error('Failed to confirm');
    }
  };

  const handleDelete = async (cId) => {
    if (!window.confirm('Delete this contribution?')) return;
    try {
      await deleteContribution(cId);
      const updated = contributions.filter(c => c._id !== cId);
      setContributions(updated);
      setTotalCollected(recalcTotal(updated));
      toast.success('Contribution deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleExport = () => {
    window.location.href = exportCSV(id);
  };

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

  const days = daysRemaining(fundraiser.deadline);
  const pendingCount = contributions.filter(c => !c.confirmed).length;
  const confirmedTotal = totalCollected;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <LayoutDashboard className="w-5 h-5 text-primary-500" />
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Organizer Dashboard</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">{fundraiser.giftName}</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            {fundraiser.occasion} · by {fundraiser.organizerName}
            {fundraiser.status === 'closed' && (
              <span className="ml-2 badge bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">Closed</span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Link to={`/f/${id}`} target="_blank" className="btn-secondary text-sm py-2 px-4 gap-1.5">
            <ExternalLink className="w-4 h-4" /> View Public Page
          </Link>
          <button onClick={handleExport} className="btn-secondary text-sm py-2 px-4 gap-1.5">
            <Download className="w-4 h-4" /> Export CSV
          </button>
          {fundraiser.status === 'open' && (
            <>
              <button onClick={startEdit} className="btn-secondary text-sm py-2 px-4 gap-1.5">
                <Edit className="w-4 h-4" /> Edit
              </button>
              <button onClick={handleClose} disabled={closing} className="btn-danger text-sm py-2 px-4">
                {closing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                Close Fundraiser
              </button>
            </>
          )}
        </div>
      </div>

      {/* Share link */}
      <div className="card p-4 mb-6">
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Share Link</p>
        <CopyLinkButton fundraiserId={id} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Collected', value: `₹${confirmedTotal.toLocaleString('en-IN')}`, sub: `of ₹${fundraiser.targetAmount.toLocaleString('en-IN')}`, icon: TrendingUp, color: 'text-emerald-500' },
          { label: 'Contributors', value: contributions.length, sub: `${pendingCount} pending`, icon: Users, color: 'text-primary-500' },
          { label: 'Remaining', value: `₹${Math.max(0, fundraiser.targetAmount - confirmedTotal).toLocaleString('en-IN')}`, sub: 'to reach goal', icon: TrendingUp, color: 'text-accent-500' },
          { label: 'Time Left', value: days > 0 ? `${days}d` : 'Ended', sub: formatDate(fundraiser.deadline), icon: Calendar, color: 'text-amber-500' },
        ].map(stat => (
          <div key={stat.label} className="card p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stat.value}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{stat.sub}</p>
              </div>
              <stat.icon className={`w-5 h-5 ${stat.color} mt-0.5`} />
            </div>
          </div>
        ))}
      </div>

      {/* Progress */}
      <div className="card p-6 mb-6">
        <ProgressBar current={confirmedTotal} target={fundraiser.targetAmount} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Edit form */}
        {editMode && (
          <div className="lg:col-span-1">
            <div className="card p-6">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Edit className="w-4 h-4 text-primary-500" /> Edit Details
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="label">Gift Name</label>
                  <input className="input" value={editForm.giftName} onChange={e => setEditForm(p => ({ ...p, giftName: e.target.value }))} />
                </div>
                <div>
                  <label className="label">Target (₹)</label>
                  <input className="input" type="number" value={editForm.targetAmount} onChange={e => setEditForm(p => ({ ...p, targetAmount: e.target.value }))} />
                </div>
                <div>
                  <label className="label">Occasion</label>
                  <select className="input" value={editForm.occasion} onChange={e => setEditForm(p => ({ ...p, occasion: e.target.value }))}>
                    {OCCASIONS.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Deadline</label>
                  <input className="input" type="date" value={editForm.deadline} onChange={e => setEditForm(p => ({ ...p, deadline: e.target.value }))} />
                </div>
                <div>
                  <label className="label">Description</label>
                  <textarea className="input resize-none" rows={2} value={editForm.description} onChange={e => setEditForm(p => ({ ...p, description: e.target.value }))} />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setEditMode(false)} className="btn-secondary flex-1 justify-center text-sm py-2">
                    <X className="w-4 h-4" /> Cancel
                  </button>
                  <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 justify-center text-sm py-2">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contributions list */}
        <div className={editMode ? 'lg:col-span-2' : 'lg:col-span-3'}>
          <div className="card p-6">
            <h2 className="font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-2">
              <Users className="w-5 h-5 text-primary-500" />
              All Contributions
              <span className="text-slate-400 font-normal text-sm">({contributions.length})</span>
            </h2>
            <ContributionList
              contributions={contributions}
              isOrganizer={true}
              onConfirm={handleConfirm}
              onDelete={handleDelete}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
