import React, { useState } from 'react';
import { LostFoundItem, CurrentUser, ItemClaim } from '../types';
import { X, HandHelping, AlertCircle, ShieldCheck, HelpCircle } from 'lucide-react';

interface ClaimModalProps {
  isOpen: boolean;
  item: LostFoundItem | null;
  currentUser: CurrentUser | null;
  onClose: () => void;
  onSubmitClaim: (claimData: Partial<ItemClaim>) => Promise<void>;
  onPromptLogin: () => void;
}

export const ClaimModal: React.FC<ClaimModalProps> = ({
  isOpen,
  item,
  currentUser,
  onClose,
  onSubmitClaim,
  onPromptLogin,
}) => {
  const [reasonProof, setReasonProof] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !item) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!currentUser || currentUser.type !== 'student') {
      setError('You must be logged in as a student to file a claim.');
      return;
    }

    if (item.student_id === currentUser.student?.student_id) {
      setError('You cannot claim an item that you reported finding.');
      return;
    }

    if (!reasonProof.trim() || reasonProof.trim().length < 10) {
      setError('Please provide specific proof of ownership (minimum 10 characters).');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmitClaim({
        item_id: item.id,
        item_title: item.title,
        student_id: currentUser.student?.student_id,
        student_name: currentUser.student?.name,
        student_email: currentUser.student?.email,
        reason_proof: reasonProof.trim(),
        status: 'PENDING',
      });
      setReasonProof('');
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to submit claim. You may have already claimed this.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center">
              <HandHelping className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold">Claim Found Belonging</h2>
              <p className="text-xs text-emerald-100">Proctorial Verification Workflow</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Item Summary Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1.5 text-xs">
            <div className="flex justify-between items-start">
              <span className="font-extrabold text-slate-900 text-sm">{item.title}</span>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold uppercase text-[10px]">
                {item.category}
              </span>
            </div>
            <p className="text-slate-600">{item.description}</p>
            <div className="text-slate-500 pt-1 border-t border-slate-200 flex justify-between">
              <span>Found At: {item.location}</span>
              <span>Date: {item.date_incident}</span>
            </div>
          </div>

          {!currentUser || currentUser.type !== 'student' ? (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm space-y-3 text-center">
              <AlertCircle className="w-8 h-8 text-amber-600 mx-auto" />
              <p className="font-semibold">Student Login Required</p>
              <p className="text-xs text-amber-700">
                Only authenticated students (Arth or Shivam) can submit ownership claims to prevent fraudulent retrievals.
              </p>
              <button
                onClick={onPromptLogin}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs"
              >
                Log In as Student
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2.5 text-xs text-emerald-900 flex justify-between items-center">
                <span>Claimant Student:</span>
                <span className="font-bold">
                  {currentUser.student?.name} ({currentUser.student?.roll_number})
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Proof of Ownership &amp; Identifying Rationale *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Provide concrete proof such as: unique scratch marks, wallpaper on screen, serial numbers, exact engravings, or contents inside..."
                  value={reasonProof}
                  onChange={(e) => setReasonProof(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 resize-none"
                ></textarea>
                <p className="text-[11px] text-slate-500 mt-1">
                  The campus administrator (Hariom sir) will evaluate this proof before approving hand-off.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
                >
                  <HandHelping className="w-4 h-4" />
                  <span>{isSubmitting ? 'Submitting...' : 'Submit Claim'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
